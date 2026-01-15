// vue - router - quasar - pinia
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import moment from 'moment'

// interfaces
import { IAccountChartResource } from '@/interfaces/customs/accounting/ChartAccount'
import {
  IBusinessTrustAccountStructure,
  IVoucherAmount,
} from '@/interfaces/customs/accounting/AccountingReceipt'
import { IBusinessTrustResource } from '@/interfaces/customs/resources/BusinessTrust'
import { ActionType } from '@/interfaces/global'

// composables - utils
import { useBigNumbers, useUtils } from '@/composables'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingReceiptsStore } from '@/stores/accounting/accounting-receipt'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useThirdPartiesStore } from '@/stores/third-parties'
import Big from 'big.js'

const useInformationForm = (props: { action: ActionType; id?: number }) => {
  const { defaultIconsLucide, formatCurrency, formatDate } = useUtils()
  const {
    business_trust,
    accounts_charts,
    cost_center,
    third_parties_label,
    voucher_natures,
    receipt_types_manual_without_cancellation_subtypes,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { accounting_receipt } = storeToRefs(useAccountingReceiptsStore('v2'))

  const { _searchInCautionList } = useThirdPartiesStore()
  const { isValidPerson } = storeToRefs(useThirdPartiesStore())

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _getAccountingReceipt,
    _cleanAccountingReceiptsData,
    _downloadAccountingReceipt,
    _getVoucherLines,
    _getCoinById,
  } = useAccountingReceiptsStore('v2')

  const informationForm = ref()

  const selectedBusiness = ref()

  const structureApplied = ref()

  const sub_receipt_types = ref()

  const selectedAccountStructure = ref<
    {
      value: number
      label: string
      accounting_structure: string
    }[]
  >([])

  const daysInMonth = ref(0)

  const periodValue = ref('')

  const isView = computed(() => props.action === 'view')

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const amountsTableColumns = [
    {
      name: 'id',
      required: false,
      label: '#',
      align: 'left',
      field: 'id',
      sortable: true,
    },
    {
      name: 'nature',
      required: true,
      label: 'Naturaleza*',
      align: 'left',
      field: (row: IVoucherAmount) => `${row.nature ?? ''}`,
      sortable: true,
      style: styleColumn(150),
    },
    {
      name: 'account_id',
      required: true,
      label: 'Cuenta*',
      align: 'left',
      field: (row: IVoucherAmount) =>
        isView
          ? `${row.account?.code} - ${row.account?.name}`
          : `${row.account?.id}`,
      sortable: true,
      style: styleColumn(300),
    },
    {
      name: 'third_party_id',
      required: true,
      label: 'Auxiliar*',
      align: 'left',
      field: (row: IVoucherAmount) => {
        if (isView.value) {
          const abbreviation =
            row.third_party?.document_type?.abbreviation ?? ''
          const doc = row.third_party?.document ?? ''
          const name =
            row.third_party?.natural_person?.name &&
            row.third_party?.natural_person?.last_name
              ? `${row.third_party.natural_person.name} ${row.third_party.natural_person.last_name}`
              : row.third_party?.legal_person?.business_name ?? ''
          return `${abbreviation} - ${doc} - ${name}`.trim()
        } else {
          return `${row.third_party?.id}`
        }
      },
      sortable: true,
      style: styleColumn(300),
    },
    {
      name: 'cost_center_id',
      required: true,
      label: 'Centro de costos',
      align: 'left',
      field: (row: IVoucherAmount) =>
        isView
          ? `${row.cost_center?.code ?? ''} - ${row.cost_center?.name ?? ''}`
          : `${row.cost_center?.id}`,
      sortable: true,
      style: styleColumn(200),
    },
    {
      name: 'register_detail',
      required: true,
      label: 'Detalles del registro*',
      align: 'left',
      field: (row: IVoucherAmount) => `${row.register_detail}`,
      sortable: true,
      style: styleColumn(100),
    },
    {
      name: 'debit',
      required: true,
      label: 'Débito',
      align: 'right',
      field: (row: IVoucherAmount) => formatCurrency(`${row.debit ?? '0.00'}`),
      sortable: true,
      style: styleColumn(180),
    },

    {
      name: 'credit',
      required: true,
      label: 'Crédito',
      align: 'right',
      field: (row: IVoucherAmount) => formatCurrency(`${row.credit ?? '0.00'}`),
      sortable: true,
      style: styleColumn(180),
    },
    {
      name: 'type_foreign_currency',
      required: true,
      label: 'Tipo de moneda',
      align: 'left',
      field: (row: IVoucherAmount) => row.type_foreign_currency || '-',
      sortable: true,
    },
    {
      name: 'foreign_currency',
      required: true,
      label: 'Moneda extranjera',
      align: 'right',
      field: (row: IVoucherAmount) =>
        formatCurrency(`${row.foreign_currency ?? '0.00'}`),
      sortable: true,
      style: styleColumn(200),
    },
    {
      name: 'actions',
      required: true,
      label: 'Acciones',
      align: 'center',
      field: 'actions',
    },
  ]

  const visibleColumns = computed(() => {
    return isView.value
      ? (amountsTableColumns.filter(
          (col) => col.name !== 'actions'
        ) as QTable['columns'])
      : (amountsTableColumns as QTable['columns'])
  })

  let amountsPerPage = 10

  const amountsTableProps = ref({
    title: 'Datos del comprobante',
    loading: false,
    columns: visibleColumns,
    rows: [] as IVoucherAmount[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    rowsPerPage: amountsPerPage,
  })

  const listVoucherLines = async () => {
    if (!props.id) return

    amountsTableProps.value.loading = true

    const result = (await _getVoucherLines(props.id, {
      page: amountsTableProps.value.pages.currentPage,
      rows: amountsTableProps.value.rowsPerPage || amountsPerPage,
    })) as {
      rows: IVoucherAmount[]
      currentPage: number
      lastPage: number
      perPage: number
    } | null

    if (result) {
      amountsTableProps.value.rows = await Promise.all(
        result.rows.map(async (row) => {
          if (row.currency?.id) {
            const coinData = await _getCoinById(row.currency.id)
            row.type_foreign_currency = coinData || ''
            row.currency_id = row.currency.id
          }

          return row
        })
      )
      amountsTableProps.value.pages.currentPage = result.currentPage
      amountsTableProps.value.pages.lastPage = result.lastPage
      amountsTableProps.value.rowsPerPage = result.perPage
    }

    amountsTableProps.value.loading = false
  }

  const updateAmountsPage = (page: number) => {
    amountsTableProps.value.pages.currentPage = page
    listVoucherLines()
  }

  const updateAmountsRowsPerPage = (rowsPerPage: number) => {
    amountsPerPage = rowsPerPage
    amountsTableProps.value.rowsPerPage = rowsPerPage
    amountsTableProps.value.pages.currentPage = 1
    listVoucherLines()
  }

  const customColumns =
    props.action === 'view'
      ? ['id']
      : [
          'id',
          'nature',
          'account_id',
          'third_party_id',
          'cost_center_id',
          'register_detail',
          'debit',
          'credit',
          'type_foreign_currency',
          'foreign_currency',
          'actions',
        ]

  const isReexpressed = (voucherData: IVoucherAmount) => {
    const selectedAccount = accounts_charts.value.find(
      (chart: IAccountChartResource) => chart.id === voucherData.account_id
    )

    return !!selectedAccount?.is_currency_reexpressed
  }

  const canForeignCurrency = computed(() => {
    const selectedBusiness = business_trust.value.find(
      (business: IBusinessTrustResource) =>
        business.value === accounting_receipt.value.business_trust_id
    )

    if (!selectedBusiness) return false

    return !!selectedBusiness?.account?.can_foreign_currency
  })

  const hasCostCenter = (voucherData: IVoucherAmount) => {
    const selectedAccount = accounts_charts.value.find(
      (chart: IAccountChartResource) => chart.id === voucherData.account_id
    )

    return !!selectedAccount?.has_cost_center
  }

  const removeAmount = (row: IVoucherAmount) => {
    const index = amountsTableProps.value.rows.indexOf(row)
    if (index > -1) {
      amountsTableProps.value.rows.splice(index, 1)
    }
  }

  const addReceiptAmount = () => {
    if (!Array.isArray(accounting_receipt.value.voucher_data)) {
      accounting_receipt.value.voucher_data = []
    }

    accounting_receipt.value.voucher_data.push({
      nature: '',
      account_id: 0,
      third_party_id:
        accounting_receipt.value.voucher_data.length > 0
          ? accounting_receipt.value.voucher_data[0].third_party_id
          : 0,
      cost_center_id: null,
      register_detail:
        accounting_receipt.value.voucher_data.length > 0
          ? accounting_receipt.value.voucher_data[0].register_detail
          : '',
      debit: '',
      credit: '',
      currency_id:
        accounting_receipt.value.voucher_data.length > 0
          ? accounting_receipt.value.voucher_data[0].currency_id
          : null,
      foreign_currency: '',
    })
    amountsTableProps.value.rows = accounting_receipt.value.voucher_data
  }

  const downloadAccountingReceipt = () => {
    _downloadAccountingReceipt(props.id!).then((xlsResponse) => {
      if (xlsResponse) {
        createAndDownloadBlobByArrayBuffer(
          xlsResponse,
          `Consulta_De_Comprobante`,
          new Date()
        )
      }
    })
  }

  watch(
    () => accounting_receipt.value.business_trust_id,
    (newVal) => {
      if (newVal) {
        setSelect(Number(newVal))
        const selected_business = business_trust.value.find(
          (business) => business.id === newVal
        )
        if (selected_business) {
          if (selected_business.account?.cost_center_structure_id) {
            _getResources(
              { accounting: ['cost_center'] },
              `filter[accounting_structure_id]=${selected_business.account?.cost_center_structure_id}`
            )
          }

          periodValue.value = formatDate(
            selected_business.account?.current_period || '',
            'YYYY-MM'
          )
        }
      }
    },
    { deep: true }
  )

  watch(
    () => accounting_receipt.value.accounting_structure_id,
    (val) => {
      if (val) {
        _getResources(
          { accounting: ['accounts_charts'] },
          `filter[account_structure_id]=${val}`
        )
      }
    },
    { deep: true }
  )

  watch(
    () => accounting_receipt.value.voucher_data,
    (newVal) => {
      amountsTableProps.value.rows = Array.isArray(newVal) ? newVal : []
    },
    { deep: true }
  )

  watch(
    () => accounting_receipt.value.accounting_structure_id,
    (newVal) => {
      structureApplied.value = null
      if (newVal) {
        structureApplied.value = selectedAccountStructure.value.find(
          (structure) => structure.value === parseInt(String(newVal))
        )
      }
    },
    { deep: true }
  )

  watch(
    () => amountsTableProps.value.rows,
    () => {
      if (!isView.value) {
        setTotals()
      }
    },
    { deep: true }
  )

  watch(
    () => accounting_receipt.value.receipt_type_id,
    (newVal) => {
      accounting_receipt.value.sub_receipt_type_id = ''
      sub_receipt_types.value = []

      if (newVal) {
        const receiptType =
          receipt_types_manual_without_cancellation_subtypes.value.find(
            (receipt_type) => receipt_type.value === newVal
          )

        if (receiptType) {
          sub_receipt_types.value = Array.isArray(receiptType.sub_receipt_types)
            ? receiptType.sub_receipt_types.map((item) => ({
                ...item,
                value: item.id,
                label: `${item.code} - ${item.name}`,
              }))
            : []
        }
      }
    },
    { deep: true }
  )

  const setSelect = (newVal: number) => {
    selectedBusiness.value = null
    selectedAccountStructure.value = []
    accounting_receipt.value.registration_day = ''
    if (newVal) {
      selectedBusiness.value = business_trust.value.find(
        (business) => business.id === parseInt(String(newVal))
      )

      if (selectedBusiness) {
        if (
          selectedBusiness.value?.account?.business_trust_account_structure
            .length > 0
        ) {
          selectedAccountStructure.value =
            selectedBusiness.value?.account?.business_trust_account_structure
              .map((item: IBusinessTrustAccountStructure) => ({
                value: item.account_structure.id,
                label: `${item.account_structure.code} - ${item.account_structure.purpose}`,
                accounting_structure: `${item.account_structure.purpose} - ${item.type}`,
                type: item.type,
              }))
              .filter(
                (structure: IBusinessTrustAccountStructure) =>
                  structure.type === 'Principal'
              ) ?? null
        } else {
          selectedAccountStructure.value = [
            {
              value: selectedBusiness.value?.account?.accounting_structure?.id,
              label: `${selectedBusiness.value?.account?.accounting_structure?.code} - ${selectedBusiness.value?.account?.accounting_structure?.purpose}`,
              accounting_structure: `${selectedBusiness.value?.account?.accounting_structure?.purpose} - Principal`,
            },
          ]
        }

        daysInMonth.value = moment(
          selectedBusiness.value?.account?.current_period
        ).daysInMonth()

        accounting_receipt.value.registration_day = String(daysInMonth.value)
      }
    }
  }

  const { sum, minus } = useBigNumbers()

  const setTotals = () => {
    const { totalCredit, totalDebit } = amountsTableProps.value.rows.reduce(
      (acc, row: IVoucherAmount) => {
        if (row.nature === 'Crédito') {
          return {
            ...acc,
            totalCredit: sum(acc.totalCredit, row.credit || '0'),
          }
        } else if (row.nature === 'Débito') {
          return {
            ...acc,
            totalDebit: sum(acc.totalDebit, row.debit || '0'),
          }
        }
        return acc
      },
      {
        totalCredit: new Big(0),
        totalDebit: new Big(0),
      }
    )

    const difference = minus(totalDebit, totalCredit)

    accounting_receipt.value.total_amount_credits = totalCredit.toFixed(2)
    accounting_receipt.value.total_amount_debits = totalDebit.toFixed(2)
    accounting_receipt.value.difference_amount = difference.toFixed(2)
  }

  const validateAccountingReceipt = () => {
    return (
      informationForm.value?.validate() &&
      Number(accounting_receipt.value.difference_amount) === 0
    )
  }

  const setThirdParty = async (item: IVoucherAmount, event: number) => {
    item.third_party_id = event
    const selectedThirdParty = third_parties_label.value.find(
      (item) => item.id === event
    )
    if (!selectedThirdParty) return
    const name = selectedThirdParty.natural_person
      ? `${selectedThirdParty.natural_person.name} ${selectedThirdParty.natural_person.last_name}`
      : `${selectedThirdParty.legal_person?.business_name ?? ''}`
    _searchInCautionList(
      `${name ?? ''}`,
      `${selectedThirdParty?.document ?? ''}`
    ).finally(() => {
      if (!isValidPerson) {
        item.third_party_id = 0
      }
    })
  }

  const setAccountValue = async ($event: number, row: IVoucherAmount) => {
    const accountSelected = accounts_charts.value.find(
      (account: IAccountChartResource) => account.id === $event
    )
    row.account_id = $event
    row.cost_center_id = !hasCostCenter(row) ? null : row.cost_center_id

    if (accountSelected?.currency_id) {
      const coinData = await _getCoinById(accountSelected.currency_id)
      row.type_foreign_currency = coinData || ''
      row.currency_id = accountSelected.currency_id
    }
  }

  const getPayloadData = () => {
    const voucherData = accounting_receipt.value.voucher_data.map(
      (item: IVoucherAmount) => {
        const itemData: IVoucherAmount = {
          nature: item.nature,
          account_id: item.account_id,
          third_party_id: item.third_party_id,
          register_detail: item.register_detail,
          cost_center_id: item.cost_center_id,
          currency_id: item.currency_id ?? null,
          foreign_currency:
            Number(item.foreign_currency) == 0
              ? ''
              : new Big(item.foreign_currency).toFixed(2),
        }

        if (item.nature === 'Débito' && item.debit) {
          itemData.debit = item.debit
        } else {
          itemData.credit = item.credit
        }

        return itemData
      }
    )
    return {
      business_trust_id: accounting_receipt.value.business_trust_id,
      accounting_structure_id: accounting_receipt.value.accounting_structure_id,
      registration_date: formatDate(
        accounting_receipt.value.registration_date,
        'YYYY-MM-DD'
      ),
      registration_day: accounting_receipt.value.registration_day,
      receipt_type_id: accounting_receipt.value.receipt_type_id,
      sub_receipt_type_id:
        accounting_receipt.value.sub_receipt_type_id != 0
          ? accounting_receipt.value.sub_receipt_type_id
          : accounting_receipt.value.sub_receipt_type.id,
      voucher_data: voucherData,
      total_amount_credits: accounting_receipt.value.total_amount_credits,
      total_amount_debits: accounting_receipt.value.total_amount_debits,
      difference_amount: accounting_receipt.value.difference_amount,
      is_manual: accounting_receipt.value.is_manual || true,
    }
  }

  const changeBusinessTrust = (value: number | string) => {
    accounting_receipt.value.business_trust_id = value
    accounting_receipt.value.accounting_structure_id = ''
  }

  const changePeriod = (value: string) => {
    periodValue.value = value
    if (value) {
      // Establecer el primer día del mes seleccionado como fecha de registro
      accounting_receipt.value.registration_date = `${value}-01`
    }
  }

  watch(periodValue, (newVal) => {
    if (newVal && props.action === 'create') {
      // Actualizar la fecha de registro con el primer día del periodo seleccionado
      const currentRegistrationDate = accounting_receipt.value.registration_date
      if (
        !currentRegistrationDate ||
        !currentRegistrationDate.startsWith(newVal)
      ) {
        accounting_receipt.value.registration_date = `${newVal}-01`
      }
    }
  })

  onMounted(async () => {
    if (props.action !== 'create' && props.id) {
      await _getAccountingReceipt(props.id)

      const voucherId = accounting_receipt.value?.id
      if (voucherId) {
        amountsTableProps.value.pages.currentPage = 1
        await listVoucherLines()
      }

      business_trust.value = business_trust.value.filter(
        (item) => item.account?.current_period
      )

      if (!Array.isArray(accounting_receipt.value.voucher_data)) {
        accounting_receipt.value.voucher_data = []
      }

      accounting_receipt.value.voucher_data.forEach((item) => {
        item.account_id = item.account?.id ?? 0
        item.third_party_id = item.third_party?.id ?? 0
        item.cost_center_id = item.cost_center?.id ?? null
      })

      const structure = accounting_receipt.value.accounting_structure

      let structureCode: string | undefined
      let structurePurpose: string | undefined
      let structureType: string | undefined

      if (structure) {
        structureCode = structure.code
        structurePurpose = structure.purpose
        accounting_receipt.value.accounting_structure_id = structure.id
        structureType = structure.type ?? 'Original'
      }

      const subReceiptTypeCode =
        accounting_receipt.value?.sub_receipt_type?.code
      const subReceiptTypeName =
        accounting_receipt.value?.sub_receipt_type?.name

      accounting_receipt.value.business_trust_account_structure_label = `${structureCode} - ${structurePurpose}`
      accounting_receipt.value.structure_applied_label = `${structurePurpose} - ${structureType}`
      accounting_receipt.value.sub_receipt_type_label = `${subReceiptTypeCode} - ${subReceiptTypeName}`

      accounting_receipt.value.receipt_type_id =
        accounting_receipt.value?.receipt_type?.id
      accounting_receipt.value.sub_receipt_type_id =
        accounting_receipt.value?.sub_receipt_type?.id
      accounting_receipt.value.business_trust_id =
        accounting_receipt.value.business_trust?.id ?? 0
      accounting_receipt.value.registration_date = formatDate(
        accounting_receipt.value.registration_date,
        'YYYY-MM-DD'
      )
    }
  })

  onBeforeUnmount(() => {
    _cleanAccountingReceiptsData
    _resetKeys({ accounting: ['accounts_charts', 'cost_center'] })
  })

  return {
    accounting_receipt,
    accounts_charts,
    amountsTableProps,
    business_trust,
    cost_center,
    informationForm,
    third_parties_label,
    voucher_natures,
    sub_receipt_types,
    selectedBusiness,
    selectedAccountStructure,
    structureApplied,
    receipt_types_manual_without_cancellation_subtypes,
    isView,
    customColumns,
    canForeignCurrency,
    defaultIconsLucide,
    periodValue,
    isReexpressed,
    hasCostCenter,
    removeAmount,
    addReceiptAmount,
    downloadAccountingReceipt,
    setThirdParty,
    getPayloadData,
    validateAccountingReceipt,
    setAccountValue,
    updateAmountsPage,
    updateAmountsRowsPerPage,
    changeBusinessTrust,
    changePeriod,
  }
}

export default useInformationForm
