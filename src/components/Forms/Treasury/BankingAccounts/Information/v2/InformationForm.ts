// Vue- pinia
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ActionType, IResource } from '@/interfaces/global'
import { IBankAccount, IStatusBankAccount } from '@/interfaces/customs'

// Utils
import { isEmptyOrZero } from '@/utils'

// Stores
import {
  useBankingAccountsStore,
  useResourceManagerStore,
  useResourceStore,
  useTreasuryResourceStore,
} from '@/stores'

const useInformationForm = (props: {
  action: ActionType
  data?: IBankAccount
}) => {
  const { data_information_form } = storeToRefs(useBankingAccountsStore('v2'))
  const {
    bank_account_status,
    bank_account_business,
    treasury_banks,
    active_third_parties,
    operation_types,
    account_types,
    product_types,
    bank_branches_third_party,
    bank_account_accounting_account_gmf,
    bank_account_accounting_accounts,
    bank_account_cost_centers,
    gmf_decimals,
    treasury_movement_codes,
    local_currency_type,
    foreign_currency_type,
  } = storeToRefs(useResourceStore('v1'))

  const { format_check } = storeToRefs(useTreasuryResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _setDataBasicBankingAccount,
    _dataBasicError,
    _setBusinessTrustHasCostCenter,
  } = useBankingAccountsStore('v2')
  const { _getResourcesTreasuries, _getInvestmentPortfolioResources } =
    useResourceStore('v1')

  const keys = [
    'banks',
    'bank_account_business',
    'third_parties',
    'operation_types',
    'account_types',
    'product_types',
    'gmf_decimals',
    'treasury_movement_codes',
    'bank_account_status',
  ]

  const keysInvestmentPortfolio = [
    'local_currency_type',
    'foreign_currency_type',
  ]

  const keysBusiness = [
    'bank_account_accounting_account_gmf',
    'bank_account_cost_centers',
    'bank_account_accounting_accounts',
  ]

  const keysv2 = {
    treasury: ['format_check'],
  }

  const radioCoin = ref(true)
  const radioTaxedGmf = ref(false)
  const radioHandlesCheckbook = ref(false)
  const formInformation = ref()
  const businessTrustHasCostCenter = ref(false)
  const accountingAccountHasCostCenter = ref(false)
  const accountingAccountSelected = ref(false)
  const gmfAccountingAccountSelected = ref(false)
  const gmfAccountingAccountHasCostCenter = ref(false)
  const isControlBalanceDisabled = ref(false)
  const openingDateDisabled = ref(props.action == 'edit')

  // Guarda el obj del negocio seleccionado
  const businessSelected = ref<IResource | null>(null)

  const isCostCenterDisable = computed(() => {
    if (businessTrustHasCostCenter.value && !accountingAccountSelected.value) {
      return false
    }
    return (
      models.value.business_id === 0 ||
      models.value.business_id === null ||
      !businessTrustHasCostCenter.value ||
      !accountingAccountHasCostCenter.value
    )
  })

  const isGmfCostCenterDisable = computed(() => {
    if (
      businessTrustHasCostCenter.value &&
      !gmfAccountingAccountSelected.value
    ) {
      return false
    }
    return (
      models.value.business_id === 0 ||
      models.value.business_id === null ||
      !businessTrustHasCostCenter.value ||
      !gmfAccountingAccountHasCostCenter.value
    )
  })

  const filteredCurrency = computed(() => {
    if (
      models.value.coin_type == 'Local' ||
      models.value.coin_type == undefined
    ) {
      return local_currency_type.value
    } else {
      return foreign_currency_type.value
    }
  })

  const models = ref<{
    business_id: number | null
    bank_id: number | null
    account_name: string | null
    account_bank: string | null
    account_number: string | null
    responsible_owner_id: number | null
    operation_type: string | null
    account_type: string | null
    product_type: string | null
    bank_branch_id: number | null
    opening_date: string | null
    treasury_concillation_closing_date: string | null
    treasury_closing_date: string | null
    control_balance?: boolean
    accounting_account_id: number | null
    accounting_account_code?: string | null
    accounting_account_name?: string | null
    cost_center_id: number | null
    taxed_withholding?: boolean
    taxed_gmf: number | boolean | null
    gmf_rate: string | null
    accounting_account_gmf: number | null
    gmf_business_accounting_account_id: number | null
    cost_center_gmf_id: number | null
    gmf_fund_accounting_account_id: number | null
    gmf_decimals: number | null
    gmf_movements: number | null
    coin_type: string | null
    coin: number | null
    handles_checkbook: number | boolean | null
    format: string | null
    status: IStatusBankAccount | null
    status_id: number | null
    blocking_reasons: string | null
    cancellation_date: string | null
    cancellation_reasons: string | null
    responsible_owner_document: string | null
    responsible_owner_name: string | null
    bank_account_id: string | null
    gmf_business_accounting_account_name: string | null
    gmf_business_accounting_account_code: string | null
    cost_center_code: string | null
    cost_center_description: string | null
    cost_center_gmf_code: string | null
    cost_center_gmf_description: string | null
    gmf_fund_accounting_account_code: string | null
    gmf_fund_accounting_account_name: string | null
    gmf_movements_code: string | null
    gmf_movements_description: string | null
    inactive_days: string | null
    coin_id?: number | null
  }>({
    business_id: null,
    bank_id: null,
    account_name: null,
    account_bank: null,
    account_number: null,
    responsible_owner_id: null,
    operation_type: null,
    account_type: null,
    product_type: null,
    bank_branch_id: null,
    opening_date: null,
    treasury_concillation_closing_date: null,
    treasury_closing_date: null,
    control_balance: undefined,
    accounting_account_id: null,
    accounting_account_code: null,
    accounting_account_name: null,
    cost_center_id: null,
    taxed_withholding: undefined,
    taxed_gmf: null,
    gmf_rate: null,
    accounting_account_gmf: null,
    gmf_business_accounting_account_id: null,
    cost_center_gmf_id: null,
    gmf_fund_accounting_account_id: null,
    gmf_decimals: null,
    gmf_movements: null,
    coin_type: null,
    coin: null,
    handles_checkbook: null,
    format: null,
    status: null,
    status_id: null,
    blocking_reasons: null,
    cancellation_date: null,
    cancellation_reasons: null,
    responsible_owner_document: null,
    responsible_owner_name: null,
    bank_account_id: null,
    gmf_business_accounting_account_name: null,
    gmf_business_accounting_account_code: null,
    cost_center_code: null,
    cost_center_description: null,
    cost_center_gmf_code: null,
    cost_center_gmf_description: null,
    gmf_fund_accounting_account_code: null,
    gmf_fund_accounting_account_name: null,
    gmf_movements_code: null,
    gmf_movements_description: null,
    inactive_days: null,
    coin_id: null,
  })

  const updateUpperCase = <K extends keyof typeof models.value>(
    key: K,
    value: unknown
  ) => {
    if (typeof value === 'string') {
      models.value[key] = value.toUpperCase() as (typeof models.value)[K]
    }
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setValueModel,
      edit: data_information_form.value ? setValueModel : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setValueModel = () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
      radioCoin.value = data_information_form.value.coin_type == 'Local'
    }
  }

  const setFormView = () => {
    if (props.data) {
      models.value = {
        ...props.data,
        coin_type: props.data.coin_type ?? 'Local',
      }

      radioCoin.value = props.data.coin_type == 'Local'
      radioTaxedGmf.value = props.data.taxed_gmf as boolean
      radioHandlesCheckbook.value =
        !props.data.handles_checkbook || props.data.handles_checkbook == 1
    }
  }

  const setFormEdit = () => {
    if (props.data) {
      models.value = {
        ...props.data,
        coin_type: props.data.coin_type ?? 'Local',
        accounting_account_gmf: props.data.gmf_business_accounting_account_id,
        status_id: props.data?.status?.id ?? null,
        account_type: props.data.account_type ?? null,
      }

      models.value.coin = props.data.coin_id ?? null

      radioCoin.value = props.data.coin_type == 'Local'
      radioTaxedGmf.value = props.data.taxed_gmf as boolean
      radioHandlesCheckbook.value =
        !props.data.handles_checkbook || props.data.handles_checkbook == 1
    }
  }

  const clearFormat = (val: boolean) => {
    models.value.handles_checkbook = val ? 1 : 0
    models.value.format = ''
  }

  const clearGmf = (val: boolean) => {
    models.value.taxed_gmf = val ? 1 : 0
    models.value.gmf_rate = ''
    models.value.accounting_account_gmf = null
    models.value.gmf_business_accounting_account_id = null
    models.value.cost_center_gmf_id = null
    models.value.gmf_fund_accounting_account_id = null
    models.value.gmf_decimals = null
    models.value.gmf_movements = null
  }

  const isGmfFundAccountingDisabled = computed(() => {
    return (
      !models.value.business_id ||
      !models.value.taxed_gmf ||
      ![1, 9].includes(businessSelected.value?.business_type_id ?? -1)
    )
  })

  const clearStatus = (val: number) => {
    models.value.status_id = val

    if (models.value.status_id == 1 || models.value.status_id == 2) {
      models.value.cancellation_date = ''
      models.value.cancellation_reasons = ''
      models.value.blocking_reasons = ''
    }

    if (models.value.status_id == 39) {
      models.value.blocking_reasons = ''
    }

    if (models.value.status_id == 51) {
      models.value.cancellation_date = ''
      models.value.cancellation_reasons = ''
    }
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => models.value.coin_type,
    (newVal, oldVal) => {
      if (oldVal != undefined && newVal) {
        models.value.coin = null
      }
    }
  )

  watch(
    () => models.value.business_id,
    (val) => {
      if (val) {
        const selected_business =
          bank_account_business.value.find(
            (business) => business.value == val
          ) || null

        businessSelected.value = selected_business

        businessTrustHasCostCenter.value = selected_business
          ? selected_business.has_cost_center ?? false
          : false

        _setBusinessTrustHasCostCenter(businessTrustHasCostCenter.value)

        _getResourcesTreasuries(
          `business_id=${models.value.business_id}&keys[]=${keysBusiness.join(
            '&keys[]='
          )}`
        )
      }
    }
  )
  watch(
    () => models.value.accounting_account_id,
    (val) => {
      accountingAccountHasCostCenter.value = false
      accountingAccountSelected.value = false
      if (val) {
        accountingAccountSelected.value = true
        const accounting_account = bank_account_accounting_accounts.value.find(
          (account) => account.value == val
        )
        accountingAccountHasCostCenter.value = accounting_account
          ? accounting_account.has_cost_center ?? false
          : false
      }
    }
  )

  watch(
    () => models.value.accounting_account_gmf,
    (val) => {
      gmfAccountingAccountHasCostCenter.value = false
      gmfAccountingAccountSelected.value = false
      if (val) {
        gmfAccountingAccountSelected.value = true
        const accounting_account = bank_account_accounting_accounts.value.find(
          (account) => account.value == val
        )
        gmfAccountingAccountHasCostCenter.value = accounting_account
          ? accounting_account.has_cost_center ?? false
          : false
      }
    }
  )

  watch(
    () => models.value.bank_id,
    (newVal, oldVal) => {
      if (oldVal != undefined) {
        models.value.bank_branch_id = null
      }

      if (newVal) {
        _getResourcesTreasuries(
          `bank_id=${newVal}&keys[]=bank_branches_third_party`
        )
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataBasicBankingAccount(null)
      } else {
        if (models.value.business_id == null) {
          businessTrustHasCostCenter.value = false
          models.value.business_id = null
          models.value.accounting_account_id = null
          models.value.cost_center_id = null
          models.value.accounting_account_gmf = null
          models.value.gmf_business_accounting_account_id = null
          models.value.cost_center_gmf_id = null
          models.value.gmf_fund_accounting_account_id = null
        }

        _setDataBasicBankingAccount({
          business_id: models.value.business_id ?? 0,
          bank_id: models.value.bank_id ?? 0,
          account_name: models.value.account_name ?? '',
          account_bank: models.value.account_bank ?? '',
          account_number: models.value.account_number ?? '',
          responsible_owner_id: models.value.responsible_owner_id ?? 0,
          operation_type: models.value.operation_type ?? '',
          account_type: models.value.account_type ?? '',
          product_type: models.value.product_type ?? '',
          bank_branch_id: models.value.bank_branch_id ?? 0,
          opening_date: models.value.opening_date ?? '',
          treasury_concillation_closing_date:
            models.value.treasury_concillation_closing_date ?? '',
          treasury_closing_date: models.value.treasury_closing_date ?? '',
          control_balance: models.value.control_balance ?? false,
          accounting_account_id: models.value.accounting_account_id ?? null,
          accounting_account_code: models.value.accounting_account_code ?? null,
          accounting_account_name: models.value.accounting_account_name ?? null,
          cost_center_id: models.value.cost_center_id ?? null,
          taxed_withholding: models.value.taxed_withholding ?? false,
          taxed_gmf: models.value.taxed_gmf ?? 0,
          gmf_rate: models.value.gmf_rate ?? '',
          accounting_account_gmf: models.value.accounting_account_gmf ?? null,
          gmf_business_accounting_account_id:
            models.value.accounting_account_gmf ?? null,
          cost_center_gmf_id: models.value.cost_center_gmf_id ?? null,
          gmf_fund_accounting_account_id:
            models.value.gmf_fund_accounting_account_id ?? null,
          gmf_decimals: models.value.gmf_decimals ?? 0,
          gmf_movements: models.value.gmf_movements ?? 0,
          coin_type: models.value.coin_type ?? 'Local',
          coin: models.value.coin ?? null,
          handles_checkbook: models.value.handles_checkbook ?? 0,
          format: models.value.format ?? '',
          status: models.value.status ?? null,
          status_id: models.value.status_id ?? 1,
          blocking_reasons: models.value.blocking_reasons ?? '',
          cancellation_date: models.value.cancellation_date ?? '',
          cancellation_reasons: models.value.cancellation_reasons ?? '',
          responsible_owner_document:
            models.value.responsible_owner_document ?? '',
          responsible_owner_name: models.value.responsible_owner_name ?? '',
          bank_account_id: models.value.bank_account_id ?? '',
          gmf_business_accounting_account_name:
            models.value.gmf_business_accounting_account_name ?? '',
          gmf_business_accounting_account_code:
            models.value.gmf_business_accounting_account_code ?? '',
          cost_center_code: models.value.cost_center_code ?? '',
          cost_center_description: models.value.cost_center_description ?? '',
          cost_center_gmf_code: models.value.cost_center_gmf_code ?? '',
          cost_center_gmf_description:
            models.value.cost_center_gmf_description ?? '',
          gmf_fund_accounting_account_code:
            models.value.gmf_fund_accounting_account_code ?? '',
          gmf_fund_accounting_account_name:
            models.value.gmf_fund_accounting_account_name ?? '',
          gmf_movements_code: models.value.gmf_movements_code ?? '',
          gmf_movements_description:
            models.value.gmf_movements_description ?? '',
          inactive_days: models.value.inactive_days ?? '',
        })
        _dataBasicError(null)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.business_id,
    (businessId) => {
      if (props.action !== 'edit' && props.action !== 'create') return

      const businessType = bank_account_business.value.find(
        (item) => item.value === businessId
      )

      const business_type_id = businessType?.business_type_id

      const query =
        business_type_id === 10
          ? 'keys[]=operation_types'
          : 'keys[]=operation_types&param=1'

      _getResourcesTreasuries(query)
    }
  )

  watch(
    () => models.value.operation_type,
    (operationType, oldOperationType) => {
      if (props.action !== 'edit' && props.action !== 'create') return

      if (
        oldOperationType &&
        operationType &&
        oldOperationType !== operationType
      ) {
        models.value.account_type = null
      }

      const isSebra = operationType === 'SEBRA'
      isControlBalanceDisabled.value = isSebra

      const query = isSebra
        ? 'keys[]=account_types&param=1'
        : 'keys[]=account_types'

      _getResourcesTreasuries(query)
    }
  )

  watch(
    () => models.value.account_type,
    (accountType, oldAccountType) => {
      if (props.action !== 'edit' && props.action !== 'create') return

      if (oldAccountType && accountType && oldAccountType !== accountType) {
        models.value.product_type = null
      }

      const isCashDesk = accountType === 'Ventanilla - Caja'

      const query = isCashDesk
        ? 'keys[]=product_types&param=1'
        : 'keys[]=product_types'

      _getResourcesTreasuries(query)
    }
  )

  watch(
    () => models.value.status?.id,
    (newStatus, oldStatus) => {
      if (props.action == 'edit' && (oldStatus == 51 && newStatus == 1)) {
        openingDateDisabled.value = false
      }
    },
    { immediate: true }
  )

  onMounted(async () => {
    await _getResources(keysv2, '', 'v1')
  })

  onBeforeUnmount(() => _resetKeys(keysv2))

  onMounted(async () => {
    handlerActionForm(props.action)
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
    await _getInvestmentPortfolioResources(
      `keys[]=${keysInvestmentPortfolio.join('&keys[]=')}`
    )
  })

  return {
    models,
    formInformation,
    bank_account_status,
    bank_account_business,
    treasury_banks,
    active_third_parties,
    operation_types,
    account_types,
    product_types,
    bank_branches_third_party,
    bank_account_accounting_account_gmf,
    bank_account_accounting_accounts,
    bank_account_cost_centers,
    isCostCenterDisable,
    gmf_decimals,
    treasury_movement_codes,
    format_check,
    filteredCurrency,
    radioCoin,
    radioTaxedGmf,
    radioHandlesCheckbook,
    isGmfFundAccountingDisabled,
    isGmfCostCenterDisable,
    isControlBalanceDisabled,
    openingDateDisabled,
    clearGmf,
    clearFormat,
    clearStatus,
    updateUpperCase,
  }
}
export default useInformationForm
