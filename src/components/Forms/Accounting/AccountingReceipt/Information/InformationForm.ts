import { useMainLoader, useUtils } from '@/composables'
import {
  IAccountChartResource,
  IThirdPartyResource,
  IVoucherAmount,
} from '@/interfaces/customs'
import {
  useAccountingReceiptsStore,
  useResourceStore,
  useThirdPartiesStore,
} from '@/stores'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const useInformationForm = (props: {
  action: 'create' | 'edit' | 'view'
  id?: number
}) => {
  const {
    business_trust,
    accounts_charts,
    cost_center,
    third_parties,
    receipt_types,
    voucher_natures,
  } = storeToRefs(useResourceStore('v1'))
  const { accounting_receipt } = storeToRefs(useAccountingReceiptsStore('v1'))

  const { _searchInCautionList } = useThirdPartiesStore()
  const { isValidPerson } = storeToRefs(useThirdPartiesStore())

  const { _getAccountingResources } = useResourceStore('v1')
  const {
    _getAccountingReceipt,
    _cleanAccountingReceiptsData,
    _downloadAccountingReceipt,
  } = useAccountingReceiptsStore('v1')

  const { openMainLoader } = useMainLoader()

  const informationForm = ref()

  const selectedBusiness = ref()

  const sub_receipt_types = ref()

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
      style: styleColumn(100),
    },
    {
      name: 'account_id',
      required: true,
      label: 'Cuenta*',
      align: 'left',
      field: (row: IVoucherAmount) =>
        isView
          ? `${row.account?.code} - ${row.account?.name}`
          : `${row.account_id}`,
      sortable: true,
      style: styleColumn(300),
    },
    {
      name: 'third_party_id',
      required: true,
      label: 'Auxiliar*',
      align: 'left',
      field: (row: IVoucherAmount) =>
        isView
          ? `${row.third_party?.document} - ${
              row.third_party?.commercial_registration ?? ''
            }`
          : `${row.third_party_id}`,
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
          : `${row.cost_center_id}`,
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
      align: 'left',
      field: (row: IVoucherAmount) => `${row.debit ?? '0.00'}`,
      sortable: true,
      style: styleColumn(180),
    },

    {
      name: 'credit',
      required: true,
      label: 'Crédito',
      align: 'left',
      field: (row: IVoucherAmount) => `${row.credit ?? '0.00'}`,
      sortable: true,
      style: styleColumn(180),
    },
    {
      name: 'foreign_currency',
      required: true,
      label: 'Moneda extranjera',
      align: 'left',
      field: (row: IVoucherAmount) => `${row.foreign_currency ?? '0.00'}`,
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

  const amountsTableProps = ref({
    title: 'Datos del comprobante',
    loading: false,
    columns: visibleColumns,
    rows: accounting_receipt.value.voucher_data,
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const customColumns =
    props.action === 'view'
      ? []
      : [
          'nature',
          'account_id',
          'third_party_id',
          'cost_center_id',
          'register_detail',
          'debit',
          'credit',
          'foreign_currency',
          'actions',
        ]

  const keys = [
    'business_trust',
    'accounts_charts',
    'third_parties',
    'cost_center',
    'receipt_types',
    'voucher_natures',
  ]

  const isReexpressed = (voucherData: IVoucherAmount) => {
    const selectedAccount = accounts_charts.value.find(
      (chart: IAccountChartResource) => chart.id === voucherData.account_id
    )

    return !!selectedAccount?.is_currency_reexpressed
  }

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
    accounting_receipt.value.voucher_data.push({
      nature: '',
      account_id: 0,
      third_party_id: 0,
      cost_center_id: 0,
      register_detail: '',
      debit: '',
      credit: '',
      foreign_currency: '',
    })
    amountsTableProps.value.rows = accounting_receipt.value.voucher_data
  }

  const downloadAccountingReceipt = () => {
    _downloadAccountingReceipt(props.id!).then((xlsResponse) => {
      if (xlsResponse) {
        createAndDownloadBlobByArrayBuffer(
          xlsResponse,
          `Comprobante_Contable_${props.id}`,
          new Date()
        )
      }
    })
  }

  const selectedAccountStructure = ref()

  const daysInMonth = ref(0)

  const selectBusiness = (event: number) => {
    selectedBusiness.value = business_trust.value.find(
      (business) => business.id === event
    )
    if (!selectedBusiness) return
    accounting_receipt.value.business_trust_id = selectedBusiness.value.id
    selectedAccountStructure.value =
      selectedBusiness.value.account?.accounting_structure ?? null

    daysInMonth.value = moment(
      selectedBusiness.value.account.current_period
    ).daysInMonth()

    if (accounting_receipt.value.registration_day === `${daysInMonth.value}`) {
      accounting_receipt.value.registration_day = `${daysInMonth.value}`
    } else if (accounting_receipt.value.registration_day) {
      setRegistrationDate(accounting_receipt.value.registration_day)
    }
  }

  const setRegistrationDate = (selectedDay: string) => {
    if (selectedBusiness.value?.account) {
      const day = String(selectedDay).padStart(2, '0')
      const monthYear = useUtils().formatDate(
        selectedBusiness.value.account.current_period,
        'MM/YYYY'
      )
      accounting_receipt.value.registration_date = `${day}/${monthYear}`
    }
  }

  watch(
    () => accounting_receipt.value.registration_day,
    (newVal) => {
      setRegistrationDate(newVal)
    },
    { deep: true }
  )

  watch(
    () => amountsTableProps.value.rows,
    () => setTotals(),
    { deep: true }
  )

  watch(
    () => accounting_receipt.value.receipt_type_id,
    (newVal) => {
      accounting_receipt.value.sub_receipt_type_id = 0
      if (!newVal) {
        sub_receipt_types.value = []
      }
      const receiptType = receipt_types.value.find(
        (receipt_type) => receipt_type.value === newVal
      )
      if (!receiptType) return
      sub_receipt_types.value = receiptType.related
    },
    { deep: true }
  )

  const setTotals = () => {
    let totalCredit = 0
    let totalDebit = 0
    amountsTableProps.value.rows.forEach((row: IVoucherAmount) => {
      totalCredit += Number(row.credit)
      totalDebit += Number(row.debit)
    })
    accounting_receipt.value.difference_amount = totalDebit - totalCredit
    accounting_receipt.value.total_amount_credits = totalCredit
    accounting_receipt.value.total_amount_debits = totalDebit
  }

  const daysOptions = computed(() =>
    Array.from({ length: daysInMonth.value }, (_, i) => i + 1)
  )

  const validateAccountingReceipt = () => {
    return (
      informationForm.value?.validate() &&
      accounting_receipt.value.difference_amount === 0
    )
  }

  const setThirdParty = async (item: IVoucherAmount, event: number) => {
    item.third_party_id = event
    const selectedThirdParty = third_parties.value.find(
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

  const getPayloadData = () => {
    const voucherData = accounting_receipt.value.voucher_data.map((item) => {
      const itemData: IVoucherAmount = {
        nature: item.nature,
        account_id: item.account_id,
        third_party_id: item.third_party_id,
        register_detail: item.register_detail,
        foreign_currency: item.foreign_currency,
      }
      if (item.nature === 'Débito') {
        itemData.debit = item.debit
      } else {
        itemData.credit = item.credit
      }
      if (item.cost_center_id) {
        itemData.cost_center_id = item.cost_center_id
      }
      return itemData
    })
    return {
      business_trust_id: accounting_receipt.value.business_trust_id,
      registration_date: accounting_receipt.value.registration_date,
      registration_day: accounting_receipt.value.registration_day,
      receipt_type_id: accounting_receipt.value.receipt_type_id,
      sub_receipt_type_id: accounting_receipt.value.sub_receipt_type_id,
      voucher_data: voucherData,
      total_amount_credits: accounting_receipt.value.total_amount_credits,
      total_amount_debits: accounting_receipt.value.total_amount_debits,
      difference_amount: accounting_receipt.value.difference_amount,
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    const resourcePromise = _getAccountingResources(
      `keys[]=${keys.join('&keys[]=')}`
    )

    const receiptPromise =
      props.action !== 'create' && props.id
        ? _getAccountingReceipt(props.id)
        : Promise.resolve(null)

    Promise.all([resourcePromise, receiptPromise])
      .then(([, receiptResolve]) => {
        third_parties.value = third_parties.value.map(
          (item: IThirdPartyResource) => {
            const name = item.natural_person
              ? `${item.natural_person.name} ${item.natural_person.last_name}`
              : `${item.legal_person?.business_name ?? ''}`
            return {
              ...item,
              value: item.id ?? '',
              label: `${item.document} - ${name}`,
            }
          }
        )
        business_trust.value = business_trust.value.filter(
          (item) => item.account?.current_period
        )
        receipt_types.value = receipt_types.value.map((item) => ({
          ...item,
          label: `${item.code} - ${item.label}`,
          value: item.id ?? 0,
        }))
        if (receiptResolve) {
          amountsTableProps.value.rows = accounting_receipt.value.voucher_data
          accounting_receipt.value.receipt_type_id =
            accounting_receipt.value.receipt_type.id

          accounting_receipt.value.sub_receipt_type_id =
            accounting_receipt.value.sub_receipt_type.id

          selectedBusiness.value = accounting_receipt.value.business_trust

          selectedBusiness.value.account.current_period =
            accounting_receipt.value.registration_date

          accounting_receipt.value.registration_date = useUtils().formatDate(
            accounting_receipt.value.registration_date,
            'DD/MM/YYYY'
          )
          accounting_receipt.value.business_trust_id = selectedBusiness.value.id
          selectedAccountStructure.value =
            selectedBusiness.value.account?.accounting_structure ?? null

          accounting_receipt.value.voucher_data.forEach((item) => {
            item.account_id = item.account?.id ?? 0
            item.third_party_id = item.third_party?.id ?? 0
            item.cost_center_id = item.cost_center?.id ?? 0
          })
        }
      })
      .finally(() => {
        openMainLoader(false)
      })
  })

  onBeforeUnmount(() => {
    _cleanAccountingReceiptsData
  })

  return {
    accounting_receipt,
    accounts_charts,
    amountsTableProps,
    business_trust,
    cost_center,
    informationForm,
    third_parties,
    voucher_natures,
    receipt_types,
    sub_receipt_types,
    selectedBusiness,
    selectedAccountStructure,
    daysOptions,
    isView,
    customColumns,
    isReexpressed,
    hasCostCenter,
    removeAmount,
    addReceiptAmount,
    downloadAccountingReceipt,
    selectBusiness,
    setThirdParty,
    getPayloadData,
    validateAccountingReceipt,
  }
}

export default useInformationForm
