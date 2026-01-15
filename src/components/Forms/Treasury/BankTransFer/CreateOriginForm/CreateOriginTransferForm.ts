import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useAlert, useMainLoader, useUtils } from '@/composables'
import {
  IBankTransferDetail,
  IBankTransferTypeAction,
  IBankAndAccountsResource,
  IFormTransfer,
  IGenericResource,
  IOriginInfo,
  ISelectorResources,
  IBankAccountResource,
} from '@/interfaces/customs'
import { IResource } from '@/interfaces/global'
import {
  useBankTransferStore,
  useFicResourceStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

import { storeToRefs } from 'pinia'

const { formatCurrencyString } = useUtils()

const useCreateTransferForm = () => {
  const { funds, fiduciary_investment_plans_treasury } = storeToRefs(
    useFicResourceStore('v1')
  )

  const {
    business_trusts_egreso,
    movement_with_description,
    payments_with_code,
    cash_flow_structure_egreso,
    cost_centers,
    business_bank_accounts_check,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const {
    _updateTransferBankTab,
    _updateOriginForm,
    _updateOriginToDestinyForm,
    _updateOriginCard,
  } = useBankTransferStore('v1')
  const { formOrigin, currentBankTransferTab } = storeToRefs(
    useBankTransferStore('v1')
  )
  const { showAlert } = useAlert()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()

  const nonApplyStatus = ref<string>('No aplica')
  const accountOptions = ref<IBankAccountResource[]>([])

  const formManagerBankTransfer = ref<IFormTransfer>({
    businessId: null,
    businessType: null,
    movementValue: null,
    bankAccountValue: null,
    bankValue: null,
    bankDescription: null,
    fundValue: null,
    inversionPlan: null,
    paymentMethod: null,
    trustInvestmentPlan: null,
    collectionTypeValue: null,
    amountInForeignCurrency: null,
    foreignCurrencyValue: null,
    currencyValue: null,
    trmValue: null,
    natureValue: 'Egreso',
    costValue: null,
    costCenter: null,
    cashFlow: null,
    bankAccountBalance: null,
    investmentPlanBalance: null,
  })

  const getBankDescription = computed(
    () => formManagerBankTransfer.value.bankDescription ?? ''
  )

  const getAmountInForeignCurrency = computed(
    () => formManagerBankTransfer.value.amountInForeignCurrency ?? 0
  )

  const getBusinessId = computed(() => formManagerBankTransfer.value.businessId)

  const getAccountValue = computed(
    () => formManagerBankTransfer.value.bankAccountValue
  )

  const getBankAccountOptions = computed<IBankAccountResource[]>(
    () => accountOptions.value ?? []
  )

  const getCurrencyValue = computed(
    () => formManagerBankTransfer.value.currencyValue
  )

  const getDisableByMoneyType = computed(
    () =>
      formManagerBankTransfer.value.currencyValue === 'Local' ||
      formManagerBankTransfer.value.currencyValue === null ||
      !formManagerBankTransfer.value.currencyValue
  )

  const getDisableValue = computed(
    () =>
      formManagerBankTransfer.value.currencyValue === 'Extranjera' ||
      formManagerBankTransfer.value.currencyValue === null
  )

  const getBusinessTrustOptions = computed<ISelectorResources[]>(
    () => business_trusts_egreso.value ?? []
  )
  const getMovementsOptions = computed<ISelectorResources[]>(
    () => movement_with_description.value ?? []
  )
  const getPaymentsOptions = computed<IGenericResource[]>(
    () => payments_with_code.value ?? []
  )
  const getCostCenterOptions = computed<IGenericResource[]>(
    () => cost_centers.value ?? []
  )
  const getBankOptions = computed<IBankAndAccountsResource[]>(
    () => business_bank_accounts_check.value ?? []
  )

  const getFundsOptions = computed<IResource[]>(() => funds.value ?? [])

  const getInversionPlan = computed(() => {
    return fiduciary_investment_plans_treasury.value?.slice().sort((a, b) => {
      const numA = Number(a.code)
      const numB = Number(b.code)
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB
      return a.code.localeCompare(b.code)
    })
  })

  const getCashFlowStructureEgresoOptions = computed(
    () => cash_flow_structure_egreso.value ?? []
  )

  const checkSelectLabelAccount = (
    option: IBankAccountResource[],
    selectId: number | string | null
  ) => {
    if (!selectId) return

    const checkInOptions = option.find((item) => item.value === selectId)
    const banckAccout = checkInOptions?.account_number

    return banckAccout ?? nonApplyStatus.value
  }

  const checkSelectLabel = (
    option:
      | ISelectorResources[]
      | IGenericResource[]
      | IBankAndAccountsResource[],
    selectId: number | string | null
  ) => {
    if (!selectId) return
    const checkInOptions = option.find((item) => item.value === selectId)?.label
    return checkInOptions ?? nonApplyStatus.value
  }

  const updateOriginCard = () => {
    const originInfo: IOriginInfo | null = formOrigin.value
      ? {
          id: String(
            formOrigin.value.business_trust_id ?? nonApplyStatus.value
          ),
          businessCode:
            checkSelectLabel(
              getBusinessTrustOptions.value,
              formOrigin.value.business_trust_id
            ) ?? nonApplyStatus.value,
          movement:
            checkSelectLabel(
              getMovementsOptions.value,
              formOrigin.value.movement_id
            ) ?? nonApplyStatus.value,
          bankName:
            checkSelectLabel(getBankOptions.value, formOrigin.value.bank_id) ??
            nonApplyStatus.value,

          bankAccount:
            checkSelectLabelAccount(
              getBankAccountOptions.value,
              formManagerBankTransfer.value.bankAccountValue
            ) ?? nonApplyStatus.value,
          founderType:
            checkSelectLabel(
              getFundsOptions.value,
              formManagerBankTransfer.value.fundValue
            ) ?? nonApplyStatus.value,
          bussinessPlan:
            checkSelectLabel(
              getInversionPlan.value,
              formManagerBankTransfer.value.inversionPlan
            ) ?? nonApplyStatus.value,
          paymentType:
            checkSelectLabel(
              getPaymentsOptions.value,
              formManagerBankTransfer.value.paymentMethod
            ) ?? nonApplyStatus.value,
          coinValue: String(
            formatCurrencyString(
              formManagerBankTransfer.value.amountInForeignCurrency
            ) ?? nonApplyStatus.value
          ),
          coin:
            formManagerBankTransfer.value.currencyValue ?? nonApplyStatus.value,
          valueTRM: formManagerBankTransfer.value.trmValue
            ? formManagerBankTransfer.value.trmValue
            : nonApplyStatus.value,
          natureType: String(
            formManagerBankTransfer.value.natureValue ?? nonApplyStatus.value
          ),
          onlyValue: String(
            formatCurrencyString(formManagerBankTransfer.value.costValue) ??
              nonApplyStatus.value
          ),
          costCenter:
            checkSelectLabel(
              getCostCenterOptions.value,
              formManagerBankTransfer.value.costCenter
            ) ?? nonApplyStatus.value,
          cashFlow:
            checkSelectLabel(
              getCashFlowStructureEgresoOptions.value,
              formManagerBankTransfer.value.cashFlow
            ) ?? nonApplyStatus.value,
          balance: String(
            formManagerBankTransfer.value.bankAccountBalance
              ? formatCurrencyString(
                  formManagerBankTransfer.value.bankAccountBalance
                )
              : '-'
          ),
          planInvesment: String(
            formManagerBankTransfer.value.investmentPlanBalance
              ? formatCurrencyString(
                  formManagerBankTransfer.value.investmentPlanBalance
                )
              : nonApplyStatus.value
          ),
        }
      : null

    if (originInfo) {
      _updateOriginCard(originInfo)
    }
  }

  const waitForTimeout = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms))

  const updateOriginForm = async (formInfo: IBankTransferDetail | null) => {
    if (formInfo) {
      await waitForTimeout(400)
      formManagerBankTransfer.value.businessId = formInfo.business_trust_id
      formManagerBankTransfer.value.movementValue = formInfo.movement_id

      await waitForTimeout(600)
      formManagerBankTransfer.value.bankDescription = formInfo.bank_id

      await waitForTimeout(600)
      formManagerBankTransfer.value.bankAccountValue = formInfo.bank_account_id
      formManagerBankTransfer.value.inversionPlan = formInfo.investment_plans_id
      formManagerBankTransfer.value.paymentMethod =
        formInfo.means_of_payment_id ?? null
      formManagerBankTransfer.value.trmValue = formInfo.trm
      formManagerBankTransfer.value.costCenter = formInfo.cost_center_id
      formManagerBankTransfer.value.cashFlow = formInfo.cash_flow_id
      formManagerBankTransfer.value.fundValue = formInfo.found_id

      await waitForTimeout(400)
      formManagerBankTransfer.value.amountInForeignCurrency =
        formInfo.foreign_currency_value
      formManagerBankTransfer.value.costValue = formInfo.value
    }
  }

  const handlerGoNextTab = (
    nextTab: IBankTransferTypeAction,
    infoForm: IFormTransfer
  ) => {
    _updateOriginForm(infoForm)
    _updateOriginToDestinyForm(infoForm)
    updateOriginCard()
    _updateTransferBankTab(nextTab)
  }

  const loadFounds = async () => {
    await _getResources({
      fics: ['funds'],
    })
  }

  const loadBankAccountOptions = async (businessId: number) => {
    await _getResources(
      {
        treasury: ['business_bank_accounts'],
      },
      `business_id=${businessId}`,
      'v2'
    )
  }

  const loadFiduciaryInvestmentPlans = async () => {
    await _getResources({
      fics: ['fiduciary_investment_plans'],
    })
  }

  const loadCashFlow = async (businessId: number) => {
    await _getResources(
      {
        treasury: ['cash_flow_structure_egreso'],
      },
      `business_trust_id=${businessId}`
    )
  }

  const loadCostCenter = async (businessId: number) => {
    await _getResources(
      {
        treasury: ['cost_centers'],
      },
      `business_id=${businessId}`,
      'v2'
    )
  }

  const validateRequiredFields = () => {
    const requiredFields: { key: keyof IFormTransfer; label: string }[] = [
      { key: 'businessId', label: 'Negocio' },
      { key: 'movementValue', label: 'Movimiento' },
      { key: 'bankDescription', label: 'Banco' },
      { key: 'bankAccountValue', label: 'Cuenta bancaria' },
      { key: 'costValue', label: 'Valor' },
      { key: 'paymentMethod', label: 'Forma de pago' },
    ]

    const missing = requiredFields.filter(({ key }) => {
      const value = formManagerBankTransfer.value[key]
      return value === null || value === '' || value === undefined
    })

    if (missing.length) {
      const fieldNames = missing.map((f) => f.label).join(', ')
      showAlert(`Debe completar los siguientes campos: ${fieldNames}`, 'error')
      return false
    }

    return true
  }

  const handleContinue = () => {
    if (!validateRequiredFields()) return
    handlerGoNextTab('destiny-data', formManagerBankTransfer.value)
  }

  watch(
    getAccountValue,
    (newVal) => {
      formManagerBankTransfer.value.currencyValue = null
      formManagerBankTransfer.value.trmValue = null
      formManagerBankTransfer.value.amountInForeignCurrency = null

      formManagerBankTransfer.value.investmentPlanBalance = null
      formManagerBankTransfer.value.bankAccountBalance = null
      if (newVal) {
        const selectedBank = accountOptions.value.find(
          (item) => item.value === newVal
        )

        const currentTRM = selectedBank?.TRM ?? null
        const currentCointType = selectedBank?.coin_type ?? null
        const currentBalance = selectedBank?.bank_transfer_balance ?? null
        formManagerBankTransfer.value.currencyValue = currentCointType
        formManagerBankTransfer.value.trmValue = currentTRM
        formManagerBankTransfer.value.bankAccountBalance = currentBalance
        formManagerBankTransfer.value.investmentPlanBalance = null
      }
    },
    { deep: true }
  )

  watch(getBankDescription, (newVal) => {
    accountOptions.value = []
    formManagerBankTransfer.value.bankAccountValue = null
    if (newVal) {
      const setAccountOptions = business_bank_accounts_check.value.find(
        (item) => item.value === newVal
      )?.payload.account

      accountOptions.value = setAccountOptions ?? []
    }
  })

  watch(
    getBusinessId,
    async (newVal) => {
      formManagerBankTransfer.value.paymentMethod = null
      formManagerBankTransfer.value.inversionPlan = null
      formManagerBankTransfer.value.businessType = null

      business_bank_accounts_check.value = []
      formManagerBankTransfer.value.bankDescription = null

      funds.value = []
      formManagerBankTransfer.value.fundValue = null

      cost_centers.value = []
      formManagerBankTransfer.value.costCenter = null

      cash_flow_structure_egreso.value = []
      formManagerBankTransfer.value.cashFlow = null

      if (newVal) {
        const businessType = getBusinessTrustOptions.value.find(
          (item) => item.value === newVal
        )
        formManagerBankTransfer.value.businessType =
          businessType?.business_type_id ?? null
        await loadBankAccountOptions(newVal)
        await loadFounds()
        await loadFiduciaryInvestmentPlans()

        await loadCostCenter(newVal)
        await loadCashFlow(newVal)
      }
    },
    {
      deep: true,
    }
  )

  watch(getAmountInForeignCurrency, (newVal) => {
    const currentValueMont =
      Number(formManagerBankTransfer.value.trmValue) * newVal
    if (formManagerBankTransfer.value.currencyValue === 'Extranjera') {
      formManagerBankTransfer.value.costValue = Number(
        currentValueMont.toFixed(2)
      )
    }
  })

  watch(getCurrencyValue, async (newVal) => {
    if (!newVal) {
      formManagerBankTransfer.value.trmValue = null
      formManagerBankTransfer.value.amountInForeignCurrency = null
      formManagerBankTransfer.value.costValue = null
    }
    if (newVal === 'Extranjera') {
      formManagerBankTransfer.value.amountInForeignCurrency = null
      formManagerBankTransfer.value.costValue = null
    }

    if (newVal === 'Local') {
      formManagerBankTransfer.value.trmValue = null
      formManagerBankTransfer.value.amountInForeignCurrency = null
      formManagerBankTransfer.value.costValue = null
    }
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources({
      treasury: ['business_trusts_egreso'],
    })
    await _getResources(
      { treasury: ['movement'] },
      `filter[operation]=Traslado`
    )

    await _getResources(
      {
        treasury: ['payments'],
      },
      `filter[search]=Traslado`
    )
    await updateOriginForm(formOrigin.value)
    currentBankTransferTab.value = 'origin-data'
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({
      fics: ['funds'],
      treasury: [
        'business_trusts_egreso',
        'movement_with_description',
        'bank_account',
        'payments_with_code',
        'cash_flow_structure_egreso',
        'cost_centers',
        'typeReceive',
      ],
    })
  })

  return {
    formManagerBankTransfer,
    getCostCenterOptions,
    getBusinessTrustOptions,
    getBankOptions,
    getBankAccountOptions,
    getMovementsOptions,
    getInversionPlan,
    getCashFlowStructureEgresoOptions,
    getFundsOptions,
    getDisableByMoneyType,
    getDisableValue,
    getPaymentsOptions,
    cost_centers,
    handleContinue,
    handlerGoNextTab,
  }
}

export default useCreateTransferForm
