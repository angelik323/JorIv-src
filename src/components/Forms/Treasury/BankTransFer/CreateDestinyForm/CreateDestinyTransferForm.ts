import { useAlert, useMainLoader, useUtils } from '@/composables'
import {
  IBankAccountResource,
  IBankAndAccountsResource,
  IBankTransferDetail,
  IBankTransferTypeAction,
  IFormTransfer,
  IGenericResource,
  IOriginInfo,
  ISelectorResources,
} from '@/interfaces/customs'
import { IResource } from '@/interfaces/global'
import {
  useBankTransferStore,
  useFicResourceStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const { formatCurrencyString } = useUtils()

const useCreateTransferDestinyForm = () => {
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
    type_receive_with_name,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { _updateTransferBankTab, _updateDestinyForm, _updateDestinyCard } =
    useBankTransferStore('v1')
  const { formDestiny, formOriginToDestiny, currentBankTransferTab } =
    storeToRefs(useBankTransferStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()

  const { showAlert } = useAlert()

  const nonApplyStatus = ref<string>('No aplica')
  const accountOptions = ref<IBankAccountResource[]>([])

  const formManagerDestinyBankTransfer = ref<IFormTransfer>({
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
    natureValue: 'Ingreso',
    costValue: null,
    costCenter: null,
    cashFlow: null,
    bankAccountBalance: null,
    investmentPlanBalance: null,
  })

  const getBankDescription = computed(
    () => formManagerDestinyBankTransfer.value.bankDescription ?? ''
  )

  const getBusinessId = computed(
    () => formManagerDestinyBankTransfer.value.businessId
  )

  const getAccountValue = computed(
    () => formManagerDestinyBankTransfer.value.bankAccountValue
  )

  const getCurrencyValue = computed(
    () => formManagerDestinyBankTransfer.value.currencyValue
  )

  const getDisableByMoneyType = computed(
    () =>
      formManagerDestinyBankTransfer.value.currencyValue === 'Local' ||
      !formManagerDestinyBankTransfer.value.currencyValue
  )

  const getBusinessTrustOptions = computed<ISelectorResources[]>(
    () => business_trusts_egreso.value ?? []
  )

  const getBankAccountOptions = computed<IBankAccountResource[]>(
    () => accountOptions.value ?? []
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
    () => cash_flow_structure_egreso.value ?? 2
  )

  const getTypeReceive = computed(() => type_receive_with_name.value ?? [])

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

  const updateDestinyCard = () => {
    const destinyInfo: IOriginInfo | null = formDestiny.value
      ? {
          id: String(
            formDestiny.value.business_trust_id ?? nonApplyStatus.value
          ),
          businessCode:
            checkSelectLabel(
              getBusinessTrustOptions.value,
              formDestiny.value.business_trust_id
            ) ?? nonApplyStatus.value,
          movement:
            checkSelectLabel(
              getMovementsOptions.value,
              formDestiny.value.movement_id
            ) ?? nonApplyStatus.value,
          bankName:
            checkSelectLabel(getBankOptions.value, formDestiny.value.bank_id) ??
            nonApplyStatus.value,
          bankAccount:
            checkSelectLabel(
              getBankAccountOptions.value,
              formManagerDestinyBankTransfer.value.bankAccountValue
            ) ?? nonApplyStatus.value,
          founderType:
            checkSelectLabel(
              getFundsOptions.value,
              formManagerDestinyBankTransfer.value.fundValue
            ) ?? nonApplyStatus.value,
          bussinessPlan:
            checkSelectLabel(
              getInversionPlan.value,
              formManagerDestinyBankTransfer.value.inversionPlan
            ) ?? nonApplyStatus.value,
          paymentType:
            checkSelectLabel(
              getPaymentsOptions.value,
              formManagerDestinyBankTransfer.value.paymentMethod
            ) ?? nonApplyStatus.value,
          coinValue: String(
            formatCurrencyString(
              formManagerDestinyBankTransfer.value.amountInForeignCurrency
            ) ?? nonApplyStatus.value
          ),
          coin:
            formManagerDestinyBankTransfer.value.currencyValue ??
            nonApplyStatus.value,
          valueTRM: formManagerDestinyBankTransfer.value.trmValue
            ? formManagerDestinyBankTransfer.value.trmValue
            : nonApplyStatus.value,
          natureType: String(
            formManagerDestinyBankTransfer.value.natureValue ??
              nonApplyStatus.value
          ),
          onlyValue: String(
            formatCurrencyString(
              formManagerDestinyBankTransfer.value.costValue
            ) ?? nonApplyStatus.value
          ),
          costCenter:
            checkSelectLabel(
              getCostCenterOptions.value,
              formManagerDestinyBankTransfer.value.costCenter
            ) ?? nonApplyStatus.value,
          cashFlow:
            checkSelectLabel(
              getCashFlowStructureEgresoOptions.value,
              formManagerDestinyBankTransfer.value.cashFlow
            ) ?? nonApplyStatus.value,
          balance: String(
            formManagerDestinyBankTransfer.value.bankAccountBalance
              ? formatCurrencyString(
                  formManagerDestinyBankTransfer.value.bankAccountBalance
                )
              : '-'
          ),
          planInvesment: String(
            formManagerDestinyBankTransfer.value.investmentPlanBalance
              ? formatCurrencyString(
                  formManagerDestinyBankTransfer.value.investmentPlanBalance
                )
              : nonApplyStatus.value
          ),
        }
      : null

    if (destinyInfo) {
      _updateDestinyCard(destinyInfo)
    }
  }

  const waitForTimeout = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms))

  const updateDestinyForm = async (formInfo: IBankTransferDetail | null) => {
    if (formInfo) {
      await waitForTimeout(400)
      formManagerDestinyBankTransfer.value.businessId =
        formInfo.business_trust_id
      formManagerDestinyBankTransfer.value.movementValue = formInfo.movement_id

      await waitForTimeout(600)
      formManagerDestinyBankTransfer.value.bankDescription = formInfo.bank_id
      await waitForTimeout(600)
      formManagerDestinyBankTransfer.value.bankAccountValue =
        formInfo.bank_account_id
      formManagerDestinyBankTransfer.value.inversionPlan =
        formInfo.investment_plans_id
      formManagerDestinyBankTransfer.value.paymentMethod =
        formInfo.type_receive_id ?? null
      formManagerDestinyBankTransfer.value.trmValue = formInfo.trm
      formManagerDestinyBankTransfer.value.costCenter = formInfo.cost_center_id
      formManagerDestinyBankTransfer.value.cashFlow = formInfo.cash_flow_id
      formManagerDestinyBankTransfer.value.amountInForeignCurrency =
        formInfo.foreign_currency_value
      formManagerDestinyBankTransfer.value.fundValue = formInfo.found_id
    }
  }

  const handlerGoNextTab = (
    nextTab: IBankTransferTypeAction,
    infoForm: IFormTransfer
  ) => {
    _updateDestinyForm(infoForm)
    updateDestinyCard()
    _updateTransferBankTab(nextTab)
  }

  const handlerGoPrevTab = (goTab: IBankTransferTypeAction) => {
    _updateTransferBankTab(goTab)
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
      `business_bank_accounts&business_id=${businessId}`,
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
      { key: 'inversionPlan', label: 'Plan de inversión' },
      { key: 'paymentMethod', label: 'Tipo de recaudo' },
    ]

    const missing = requiredFields.filter(({ key }) => {
      const value = formManagerDestinyBankTransfer.value[key]
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
    handlerGoNextTab('show-data', formManagerDestinyBankTransfer.value)
  }

  watch(
    getAccountValue,
    (newVal) => {
      formManagerDestinyBankTransfer.value.currencyValue = null
      formManagerDestinyBankTransfer.value.trmValue = null
      formManagerDestinyBankTransfer.value.amountInForeignCurrency = null

      formManagerDestinyBankTransfer.value.bankAccountBalance = null
      formManagerDestinyBankTransfer.value.investmentPlanBalance = null

      if (newVal) {
        const selectedBank = accountOptions.value.find(
          (item) => item.value === newVal
        )
        const currentBalance = selectedBank?.bank_transfer_balance ?? null

        const currentTRM = selectedBank?.TRM ?? null
        const currentCointType = selectedBank?.coin_type ?? null
        formManagerDestinyBankTransfer.value.currencyValue = currentCointType
        formManagerDestinyBankTransfer.value.trmValue = currentTRM
        formManagerDestinyBankTransfer.value.bankAccountBalance = currentBalance
        formManagerDestinyBankTransfer.value.investmentPlanBalance = null
      }
    },
    { deep: true }
  )

  watch(getBankDescription, (newVal) => {
    accountOptions.value = []
    formManagerDestinyBankTransfer.value.bankAccountValue = null
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
      business_bank_accounts_check.value = []
      formManagerDestinyBankTransfer.value.bankDescription = null

      funds.value = []
      formManagerDestinyBankTransfer.value.fundValue = null

      formManagerDestinyBankTransfer.value.inversionPlan = null
      formManagerDestinyBankTransfer.value.businessType = null

      cost_centers.value = []
      formManagerDestinyBankTransfer.value.costCenter = null

      cash_flow_structure_egreso.value = []
      formManagerDestinyBankTransfer.value.cashFlow = null

      if (newVal) {
        const businessType = getBusinessTrustOptions.value.find(
          (item) => item.value === newVal
        )
        formManagerDestinyBankTransfer.value.businessType =
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

  watch(getCurrencyValue, async (newVal) => {
    if (!newVal) {
      formManagerDestinyBankTransfer.value.trmValue = null
      formManagerDestinyBankTransfer.value.amountInForeignCurrency = null
    }
    if (newVal === 'Extranjera') {
      formManagerDestinyBankTransfer.value.amountInForeignCurrency = null
    }

    if (newVal === 'Local') {
      formManagerDestinyBankTransfer.value.trmValue = null
      formManagerDestinyBankTransfer.value.amountInForeignCurrency = null
    }
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources({
      treasury: ['business_trusts_egreso'],
    })

    await _getResources({ treasury: ['movement'] }, 'nature=ingreso')
    await _getResources(
      {
        treasury: ['typeReceive'],
      },
      `filter[type_receive]=Traslado`
    )
    currentBankTransferTab.value = 'destiny-data'
    await _getResources({
      treasury: ['payments'],
    })
    await updateDestinyForm(formDestiny.value)

    formManagerDestinyBankTransfer.value.investmentPlanBalance =
      formOriginToDestiny.value?.investment_plan_balance ?? null
    formManagerDestinyBankTransfer.value.costValue =
      formOriginToDestiny.value?.value ?? null
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
    formManagerDestinyBankTransfer,
    getCostCenterOptions,
    getBusinessTrustOptions,
    getMovementsOptions,
    getBankAccountOptions,
    getBankOptions,
    getInversionPlan,
    getCashFlowStructureEgresoOptions,
    getFundsOptions,
    getDisableByMoneyType,
    getPaymentsOptions,
    formDestiny,
    cost_centers,
    getTypeReceive,
    handlerGoPrevTab,
    handlerGoNextTab,
    handleContinue,
  }
}

export default useCreateTransferDestinyForm
