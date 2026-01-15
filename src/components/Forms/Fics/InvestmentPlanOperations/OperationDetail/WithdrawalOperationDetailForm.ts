// Vue - Pinia - Quasar
import { computed, ref, watch } from 'vue'
import { QForm, QTable } from 'quasar'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFiduciaryInvestmentPlanResource } from '@/interfaces/customs/resources'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'
import {
  IWithdrawalOperationDetailAccount,
  IWithdrawalOperationDetailAccountCreate,
  IWithdrawalOperationDetailModel,
  IInvestmentPlanOperationsBasicDataForm,
  IPlanAccountResource,
} from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Composables
import { useUtils, useMainLoader } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useTreasuryResourceStore } from '@stores/resources-manager/treasury'
import { useFicResourceStore } from '@stores/resources-manager/fics'
import { useResourceManagerStore } from '@stores/resources-manager'

const useWithdrawalOperationDetailForm = (props: {
  subtype: IInvestmentPlanOperationsBasicDataForm['subtype'] | undefined
  fiduciaryInvestmentPlanId: number | null
  fundId: number | null
}) => {
  const { _getResources } = useResourceManagerStore('v1')

  const { _getBankingAccountList, _createBankingAccount } =
    useFiduciaryInvestmentPlanStore('v1')

  const { banking_account_list, fiduciary_investment_plan_pages } = storeToRefs(
    useFiduciaryInvestmentPlanStore('v1')
  )

  const { means_of_payments, third_parties } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const {
    banks_collective_investment_funds: banks,
    identification_types_for_plans,
    account_types,
    funts_to_investment_plans,
    fiduciary_investment_plans,
    plan_accounts,
    fic_bank_accounts_operations,
  } = storeToRefs(useFicResourceStore('v1'))

  const { formatParamsCustom } = useUtils()

  const { openMainLoader } = useMainLoader()

  const flatBankAccounts = computed(() => {
    return fic_bank_accounts_operations.value.flatMap((item) => {
      if (!Array.isArray(item.bank_account)) return []
      return item.bank_account
    })
  })

  const styleColumn = (width: number = 200) => ({
    'white-space': 'nowrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'text-overflow': 'ellipsis',
  })

  const initialColumns = [
    'radio',
    'id',
    'collection_type',
    'description',
    'value',
    'is_registered',
    'account',
    'actions',
  ]

  const tableProps = ref({
    title: 'Listado de operaciones',
    loading: false,
    columns: [
      {
        name: 'radio',
        required: false,
        label: '',
        align: 'left',
        field: 'id',
        sortable: true,
        style: styleColumn(50),
      },
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
        style: styleColumn(50),
      },
      {
        name: 'collection_type',
        required: true,
        label: 'Forma de pago*',
        align: 'left',
        field: (row: IWithdrawalOperationDetailModel) =>
          `${row.means_of_payment_id}`,
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción forma de pago*',
        align: 'left',
        field: (row: IWithdrawalOperationDetailModel) =>
          `${row.means_of_payment_description}`,
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor*',
        align: 'left',
        field: (row: IWithdrawalOperationDetailModel) => `${row.value}`,
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'adjustment',
        label: 'Ajuste',
        align: 'left',
        field: (row: IWithdrawalOperationDetailModel) => `${row.adjustment}`,
        sortable: true,
        style: styleColumn(50),
      },
      {
        name: 'is_registered',
        required: true,
        label: 'Inscrita',
        align: 'left',
        field: (row: IWithdrawalOperationDetailModel) => `${row.is_registered}`,
        sortable: true,
        style: styleColumn(50),
      },
      {
        name: 'account',
        required: true,
        label: 'Cuenta',
        align: 'left',
        field: (row: IWithdrawalOperationDetailModel) => `${row.check_bank_id}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    visibleColumns:
      props.subtype === 'parcial'
        ? initialColumns
        : [...initialColumns, 'adjustment'],
    rows: [] as IWithdrawalOperationDetailModel[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const details = ref<IWithdrawalOperationDetailModel[]>([])

  const customBottomRowValueTitle = computed<string>(() => {
    if (props.subtype === 'cancelacion') return 'Valor disponible'
    return 'Valor retiro'
  })

  const incremental = ref(1)

  const addDetail = () => {
    details.value.push({
      id: incremental.value,
      means_of_payment_id: null,
      means_of_payment_description: '',
      has_registered_accounts: false,
      adjustment: false,
      bank_or_fund_id: null,
      destination_account_number: null,
      destination_plan_id: null,
      value: null,
      disabled: false,
      treasury_collection_bank_id: null,
      treasury_collection_bank_description: null,
      fic_account_bank_id: null,
      fic_account_bank_description: null,
      fic_account_bank_type: null,
      fic_account_bank_balance: null,
      observations: '',
      selected: false,
      is_registered: false,
      check_bank_id: null,
    })
    incremental.value += 1
    tableProps.value.rows = details.value
  }

  const removeDetail = (detailRow: IWithdrawalOperationDetailModel) => {
    const index = details.value.indexOf(detailRow)
    if (detailRow === selectedRow.value) {
      selectedRow.value = null
    }
    if (index > -1) {
      details.value.splice(index, 1)
    }
    tableProps.value.rows = details.value
  }

  const selectedRow = ref<IWithdrawalOperationDetailModel | null>(null)

  const totalValue = computed(() =>
    tableProps.value.rows.reduce(
      (accumulator: number, item: IWithdrawalOperationDetailModel) => {
        return !isNaN(Number(item.value))
          ? accumulator + Number(item.value)
          : accumulator
      },
      0
    )
  )

  const selectDetail = (selected: IWithdrawalOperationDetailModel) => {
    tableProps.value.rows.forEach((row) => {
      row.selected = false
      if (row === selected) {
        row.selected = true
      }
    })
    selectedRow.value = selected
  }

  const selectCollectionType = (
    row: IWithdrawalOperationDetailModel,
    collectionTypeId: number
  ) => {
    const selectedItem = means_of_payments.value.find(
      (item) => item.id === collectionTypeId
    )
    if (!selectedItem) return
    row.means_of_payment_id = collectionTypeId
    row.means_of_payment_description = String(
      selectedItem.type_mean_of_payments
    )
  }

  const isEnableToOpenAccountModal = (row: IWithdrawalOperationDetailModel) => {
    if (
      row.means_of_payment_description === 'Transferencia' ||
      row.means_of_payment_description === 'Traslado'
    )
      return true

    return false
  }

  const selectBank = async (bankId: number) => {
    if (!selectedRow.value) return

    selectedRow.value.treasury_collection_bank_description = null
    selectedRow.value.fic_account_bank_id = null
    selectedRow.value.fic_account_bank_description = null

    const selectedItem = banks.value.find((item) => item.value === bankId)
    if (!selectedItem) return

    const row = details.value.find(
      (detail) => detail.id === selectedRow.value?.id
    )

    if (!row) return

    await _getResources(
      { fics: ['fic_bank_accounts_operations'] },
      `filter[bank_id]=${bankId}&filter[fund_id]=${props.fundId}`
    )

    row.treasury_collection_bank_description = selectedItem.description ?? ''
    row.treasury_collection_bank_id = bankId
  }

  const selectBankAccount = (bankAccountId: number | null) => {
    if (!selectedRow.value) return

    selectedRow.value.fic_account_bank_description = null
    selectedRow.value.fic_account_bank_id = null
    selectedRow.value.fic_account_bank_type = null

    const selectedItem = flatBankAccounts.value.find(
      (account) => account.value === bankAccountId
    )

    if (!selectedItem) return

    const row = details.value.find(
      (detail) => detail.id === selectedRow.value?.id
    )
    if (!row) return

    row.fic_account_bank_id = bankAccountId
    row.fic_account_bank_description = selectedItem.account_name ?? null
    row.fic_account_bank_type = selectedItem.account_type ?? '-'
  }

  const accountModalRef = ref<InstanceType<typeof AlertModalComponent> | null>(
    null
  )

  const clickedDetail = ref<IWithdrawalOperationDetailModel | null>(null)

  const operationDetailForm = ref<InstanceType<typeof QForm> | null>(null)
  const accountDetailForm = ref<InstanceType<typeof QForm> | null>(null)

  const getFormData = (): (IWithdrawalOperationDetailModel & {
    type: 'retiro'
  })[] => {
    return details.value.map((detail) => ({
      ...detail,
      type: 'retiro',
    }))
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12',
      disable: false,
      prepend_icon: useUtils().defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o finalidad',
    },
  ])

  const filtersFormat = ref<
    { page: number; rows: number } & Record<string, string | number>
  >({ page: 1, rows: 20 })

  const accountsTableProps = ref<
    IBaseTableProps<IWithdrawalOperationDetailAccount>
  >({
    loading: false,
    columns: [
      {
        name: 'radio',
        required: false,
        label: '',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'bank',
        required: true,
        label: 'Fondo/banco',
        align: 'left',
        field: (row: IWithdrawalOperationDetailAccount) => {
          if (row.destination_bank)
            return `${row.destination_bank.bank_code} - ${row.destination_bank.description}`
          if (row.destination_fund)
            return `${row.destination_fund.fund_code} - ${row.destination_fund.fund_name}`
          if (row.destination_plan)
            return `${row.destination_plan.id} - ${row.destination_plan.name}`
          return '-'
        },
        sortable: true,
      },
      {
        name: 'account_number',
        required: true,
        label: 'Número de cuenta/plan de inversión',
        align: 'left',
        field: (row: IWithdrawalOperationDetailAccount) =>
          `${row.account_number ?? '-'}`,
        sortable: true,
      },
      {
        name: 'account_type',
        required: true,
        label: 'Tipo de cuenta',
        align: 'left',
        field: (row: IWithdrawalOperationDetailAccount) =>
          `${row.account_type ?? '-'}`,
        sortable: true,
      },
      {
        name: 'document_type',
        label: 'Tipo de documento',
        required: true,
        align: 'left',
        field: (row: IWithdrawalOperationDetailAccount) =>
          `${row.identification_type}`,
        sortable: true,
      },
      {
        name: 'holder_id',
        required: true,
        label: 'Identificación titular',
        align: 'left',
        field: (row: IWithdrawalOperationDetailAccount) =>
          `${row.identification_number}`,
        sortable: true,
      },
      {
        name: 'holder_name',
        required: true,
        label: 'Nombre del titular',
        align: 'left',
        field: (row: IWithdrawalOperationDetailAccount) => `${row.people_name}`,
        sortable: true,
      },
      {
        name: 'register',
        required: true,
        label: '¿Inscribir?',
        align: 'center',
        field: 'register',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const initialNewAccount = (): IWithdrawalOperationDetailAccountCreate => ({
    selected: false,
    register: false,
    bank_or_fund_id: null,
    account_type: null,
    account_number: null,
    plan_id: null,
    document_type: null,
    holder_document: null,
    holder_name: null,
  })

  const newAccount = ref<IWithdrawalOperationDetailAccountCreate>(
    initialNewAccount()
  )

  const selectedAccount = ref<
    | IWithdrawalOperationDetailAccount
    | IWithdrawalOperationDetailAccountCreate
    | null
  >(null)

  const hasSelectedAccount = computed<boolean>(() => {
    if (newAccount.value.selected) return true

    if (selectedAccount.value?.selected) return true

    return false
  })

  const banksOrFunds = computed(() => {
    if (!clickedDetail.value) return []

    if (clickedDetail.value.means_of_payment_description === 'Transferencia')
      return banks.value
    if (clickedDetail.value.means_of_payment_description === 'Traslado')
      return funts_to_investment_plans.value

    return []
  })

  const newAccountPlansOptions = ref<IFiduciaryInvestmentPlanResource[]>([])

  const isTransfer = computed(() => {
    if (
      !clickedDetail.value ||
      !clickedDetail.value.means_of_payment_description ||
      clickedDetail.value.means_of_payment_description === 'Traslado'
    )
      return false

    return true
  })

  const openAccountModal = async (
    detailRow: IWithdrawalOperationDetailModel
  ) => {
    selectedAccount.value = null
    newAccount.value = initialNewAccount()

    accountModalRef.value?.openModal()
    clickedDetail.value = detailRow
    await bankAccountsListAction(filtersFormat.value)
  }

  const isWithdrawalOperationDetailAccountCreate = (
    value:
      | IWithdrawalOperationDetailAccount
      | IWithdrawalOperationDetailAccountCreate
  ) => {
    return value && 'bank_or_fund_id' in value
  }

  const isWithdrawalOperationDetailAccount = (
    value:
      | IWithdrawalOperationDetailAccount
      | IWithdrawalOperationDetailAccountCreate
  ) => {
    return (
      value &&
      ('destination_fund' in value ||
        'destination_plan' in value ||
        'destination_bank' in value)
    )
  }

  const closeAccountModal = async () => {
    if (
      !selectedAccount.value ||
      !clickedDetail.value ||
      !props.fiduciaryInvestmentPlanId
    )
      return

    if (isWithdrawalOperationDetailAccountCreate(selectedAccount.value)) {
      if (!(await accountDetailForm.value?.validate())) return

      const selectedPlan = newAccountPlansOptions.value.find(
        (plan) => plan.id === newAccount.value.plan_id
      )
      if (!selectedPlan) return

      // NOTE: This in case we don't want to register the account
      if (selectedAccount.value.register) {
        const meanOfPaymentType = means_of_payments.value.find(
          (mean) => mean.id === clickedDetail.value?.means_of_payment_id
        )

        if (!meanOfPaymentType) return

        openMainLoader(true)

        const createdBankResponse = await _createBankingAccount({
          plan_id: props.fiduciaryInvestmentPlanId,
          payment_method_id: meanOfPaymentType.id,

          destination_fund_id:
            meanOfPaymentType.type_mean_of_payments === 'Traslado'
              ? selectedAccount.value.bank_or_fund_id
              : null,

          destination_bank_id:
            meanOfPaymentType.type_mean_of_payments === 'Transferencia'
              ? selectedAccount.value.bank_or_fund_id
              : null,

          account_type: selectedAccount.value.account_type as string,

          destination_plan:
            meanOfPaymentType.type_mean_of_payments === 'Traslado'
              ? String(selectedPlan.code)
              : null,

          account_number:
            meanOfPaymentType.type_mean_of_payments === 'Transferencia'
              ? selectedAccount.value.account_number
              : null,

          identification_id: null,
          identification_type: selectedAccount.value.document_type as string,
          identification_number: selectedAccount.value.holder_document,
          people_name: selectedAccount.value.holder_name as string,

          operation_count_per_day: null,
          maximum_value_per_operation: null,
          total_amount_per_day: null,
          inscription_status_id: 1, // Default active status value
        })
        openMainLoader(false)

        if (!createdBankResponse) return

        clickedDetail.value.bank_or_fund_id =
          selectedAccount.value.bank_or_fund_id
        clickedDetail.value.destination_plan_id = selectedAccount.value.plan_id
        clickedDetail.value.destination_account_number =
          selectedAccount.value.account_number
      }

      accountModalRef.value?.closeModal()
      return
    }

    if (isWithdrawalOperationDetailAccount(selectedAccount.value)) {
      // This is in case we want to grab information from the already existing records.
      clickedDetail.value.bank_or_fund_id =
        selectedAccount.value.destination_bank?.id ??
        selectedAccount.value.destination_fund?.fund_id ??
        null
      clickedDetail.value.destination_plan_id = selectedAccount.value.plan_id
      clickedDetail.value.destination_account_number = selectedAccount.value
        .account_number as number

      accountModalRef.value?.closeModal()
      return
    }
  }

  const selectAccount = (
    accountRow:
      | IWithdrawalOperationDetailAccount
      | IWithdrawalOperationDetailAccountCreate
  ) => {
    newAccount.value.selected = accountRow === newAccount.value

    accountsTableProps.value.rows.forEach((row) => {
      row.selected = false
      if (row === accountRow) {
        row.selected = true
      }
    })

    selectedAccount.value = accountRow
  }

  const bankAccountsListAction = async (
    filters: Record<string, string | number>
  ) => {
    accountsTableProps.value.rows = []
    accountsTableProps.value.loading = true
    openMainLoader(true)

    const queryParams = !props.fiduciaryInvestmentPlanId
      ? { ...filters }
      : { ...filters, 'filter[plan_id]': props.fiduciaryInvestmentPlanId }

    const queryString = formatParamsCustom(queryParams)

    await _getBankingAccountList(queryString ? '&' + queryString : '')
    openMainLoader(false)
    accountsTableProps.value.loading = false
  }

  const handleBankAccountsClearFilters = () => {
    accountsTableProps.value.rows = []
  }

  const handleBankAccountsFilter = async (
    filters: Record<string, string | number>
  ) => {
    filtersFormat.value = {
      ...filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await bankAccountsListAction(filtersFormat.value)
  }

  const handleBankAccountsUpdatePage = async (page: number) => {
    filtersFormat.value.page = page
    await bankAccountsListAction(filtersFormat.value)
  }

  const handleBankAccountsUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    await bankAccountsListAction(filtersFormat.value)
  }

  watch(
    banking_account_list,
    (list) => {
      accountsTableProps.value.rows = list
    },
    { deep: true }
  )

  watch(
    fiduciary_investment_plan_pages,
    (pages) => {
      accountsTableProps.value.pages = pages
    },
    { deep: true }
  )

  watch(
    () => newAccount.value.bank_or_fund_id,
    async (bank_or_fund_id) => {
      if (!bank_or_fund_id) return

      openMainLoader(true)

      try {
        if (isTransfer.value) {
          await _getResources(
            { fics: ['plan_accounts'] },
            `filter[plan_id]=${props.fiduciaryInvestmentPlanId}&filter[accounts]=true&filter[bank_id]=${bank_or_fund_id}`
          )
        } else {
          await _getResources(
            { fics: ['fiduciary_investment_plans'] },
            `filter[collective_investment_fund_id]=${bank_or_fund_id}`
          )

          newAccountPlansOptions.value = fiduciary_investment_plans.value.map(
            (item) => ({
              ...item,
              label: item.label || '',
              value: item.id ?? '',
            })
          )
        }
      } finally {
        openMainLoader(false)
      }
    },
    { immediate: true }
  )

  // transferencia
  watch(
    () => newAccount.value.account_number,
    (account_number) => {
      if (!account_number || !isTransfer.value) return

      const selectedAccount = (
        plan_accounts.value as IPlanAccountResource[]
      ).find((acc) => acc.value === account_number)

      if (selectedAccount) {
        newAccount.value.holder_name = selectedAccount.people_name || ''
        newAccount.value.document_type =
          selectedAccount.identification_type || null
        newAccount.value.holder_document =
          String(selectedAccount.identification_number || '') || null
        newAccount.value.account_type = selectedAccount.account_type || null
      }
    }
  )

  // traslado
  watch(
    () => newAccount.value.plan_id,
    async (plan_id) => {
      if (!plan_id || isTransfer.value) return

      const selectedPlan = newAccountPlansOptions.value.find(
        (plan) => plan.id === plan_id
      )

      if (selectedPlan?.fip_holder_identifications?.holder_id) {
        openMainLoader(true)
        await _getResources(
          { treasury: ['third_parties'] },
          `filter[id]=${selectedPlan.fip_holder_identifications.holder_id}`,
          'v2'
        )
        openMainLoader(false)

        if (third_parties.value.length > 0) {
          const thirdParty = third_parties.value[0]
          newAccount.value.holder_name = thirdParty.name || ''

          const documentType = identification_types_for_plans.value.find(
            (type) => type.value === thirdParty.document_type?.abbreviation
          )
          newAccount.value.document_type = documentType?.value
            ? String(documentType.value)
            : null
          newAccount.value.holder_document = thirdParty.document || ''
        }
      }
    }
  )

  return {
    account_types,
    identification_types_for_plans,
    plan_accounts,

    banks,
    tableProps,
    totalValue,
    newAccount,
    selectedRow,
    selectedAccount,
    hasSelectedAccount,
    flatBankAccounts,
    filterConfig,
    accountModalRef,
    means_of_payments,
    accountsTableProps,
    operationDetailForm,
    accountDetailForm,
    banksOrFunds,
    newAccountPlansOptions,
    isTransfer,
    customBottomRowValueTitle,
    addDetail,
    selectBank,
    getFormData,
    removeDetail,
    selectDetail,
    selectAccount,
    openAccountModal,
    closeAccountModal,
    selectBankAccount,
    selectCollectionType,
    isEnableToOpenAccountModal,
    handleBankAccountsClearFilters,
    handleBankAccountsFilter,
    handleBankAccountsUpdatePage,
    handleBankAccountsUpdateRowsPerPage,
  }
}

export default useWithdrawalOperationDetailForm
