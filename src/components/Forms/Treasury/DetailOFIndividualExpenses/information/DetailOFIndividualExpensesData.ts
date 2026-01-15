//vue - router - quasar -pinia
import { useRouter } from 'vue-router'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// interfaces
import {
  IDetailOfIndividualExpensesRequest,
  ISelectorResources,
} from '@/interfaces/customs'
// store
import {
  useInvestmentPortfolioResourceStore,
  useRecordIndividualExpensesStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
// composables
import { ActionType } from '@/interfaces/global'

const useDetailOfIndividualExpensesData = (props: {
  data?: IDetailOfIndividualExpensesRequest | null
  action: ActionType
}) => {
  const {
    data_information_form,
    effective_date_filter,
    record,
    is_editing,
    selectedMovementHasCostCenter,
  } = storeToRefs(useRecordIndividualExpensesStore('v1'))

  const router = useRouter()
  const {
    payments,
    bank_account_cost_centers,
    banks_initial_balance,
    bank_accounts_with_name,
    cash_flow_structure_egreso,
    active_third_parties,
    third_parties,
    bank_account_third_parties,
    document_type,
    business_trusts_egreso,
    banks_third_parties,
    bank_branches_third_party,
    banks_record_expenses,
    treasury_movement_code_expense,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { coins } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')
  const paymentLabels = payments.value.map((payment) => ({
    label: `${payment.code} - ${payment.description}`,
    value: payment.id,
  }))
  const isBankAccountDisabled = ref(false)
  const isInstructionDisabled = ref(false)
  const isPaymentsDisabled = ref(false)
  const isCenterCostDisabled = ref(false)
  const isCashFlowDisabled = ref(false)
  const isBankBeneficiaryDisabled = ref(false)
  const isBankAccountThirdPartyDisabled = ref(false)
  const isBankBranchDisabled = ref(false)
  const hasInitialized = ref(false)
  const bank_third_partie = ref<ISelectorResources[]>([])
  const request_bank_withdrawal = ref(false)
  const generateSpecialContribution = ref(false)
  const taxedWithGmf = ref(false)

  const models = ref<IDetailOfIndividualExpensesRequest>({
    id: null,
    effective_date: null,
    method_payment_id: null,
    method_payment_name: '',
    cost_center_id: null,
    cost_center_name: '',
    cash_flow_id: null,
    cash_flow_name: '',
    bank_id: null,
    bank_name: '',
    bank_account_id: null,
    bank_account_name: '',
    concept: null,
    foreign_currency_value: 0,
    coin: null,
    trm: 0,
    value: 0,
    instructions: null,
    local_currency_value_total: null,
    local_currency_value: null,
    nit_third_party_id: null,
    nit_third_party_name: '',
    beneficiary_bank_id: null,
    beneficiary_bank_account: null,
    beneficiary_bank_account_name: '',
    authorized_document_type_id: null,
    identification_authorized: null,
    name_authorized: null,
    bank_branch_id: null,
    bank_branch_name: '',
    authorized_document_type_name: '',
    gmf: null,
  })
  const detailOfIndividualBasicDataRef = ref()

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormEdit = () => {
    clearForm()
    const data = record.value
    if (!data) return

    Object.assign(models.value, {
      ...data,
      local_currency_value_total: data.value ?? null,
    })
  }

  const setFormView = () => {
    clearForm()
    if (!props.data) return

    Object.assign(models.value, {
      ...props.data,
      local_currency_value_total: props.data.value ?? null,
    })
  }

  const clearForm = () => {
    Object.assign(models.value, {
      effective_date: null,
      method_payment_id: null,
      cost_center_id: null,
      cash_flow_id: null,
      bank_id: null,
      bank_account_id: null,
      concept: null,
      foreign_currency_value: 0,
      coin: null,
      trm: 0,
      value: 0,
      instructions: null,
      local_currency_value_total: null,
      local_currency_value: null,
      nit_third_party_id: null,
      beneficiary_bank_id: null,
      beneficiary_bank_account: null,
      authorized_document_type_id: null,
      identification_authorized: null,
      bank_branch_id: null,
    })
  }

  const _setValueModel = () => {
    if (!data_information_form.value) return

    models.value = {
      ...models.value,
      effective_date:
        models.value.effective_date ?? effective_date_filter.value,
      method_payment_id: models.value.method_payment_id ?? null,
      cost_center_id: models.value.cost_center_id ?? null,
      cash_flow_id: models.value.cash_flow_id ?? null,
      bank_id: models.value.bank_id ?? null,
      bank_account_id: models.value.bank_account_id ?? null,
      concept: models.value.concept ?? null,
      foreign_currency_value: models.value.foreign_currency_value ?? null,
      coin: models.value.coin ?? null,
      trm: models.value.trm ?? null,
      value: models.value.value ?? null,
      instructions: models.value.instructions ?? null,
      local_currency_value_total: models.value.value ?? null,
      local_currency_value: models.value.local_currency_value ?? null,
      nit_third_party_id: models.value.nit_third_party_id ?? null,
      beneficiary_bank_id: models.value.beneficiary_bank_id ?? null,
      beneficiary_bank_account: models.value.beneficiary_bank_account ?? null,
      authorized_document_type_id:
        models.value.authorized_document_type_id ?? null,
      identification_authorized: models.value.identification_authorized ?? null,
      bank_branch_id: models.value.bank_branch_id ?? null,
    }
  }

  const calculateForeignCurrency = () => {
    return models.value.trm * models.value.foreign_currency_value
  }

  const updateCoinType = () => {
    const selectedBankAccount = bank_accounts_with_name.value.find(
      (account) => account.value === models.value.bank_account_id
    )
    const previousCoin = models.value.coin
    models.value.coin = selectedBankAccount?.coin_type ?? 'Local'
    isBankAccountDisabled.value = models.value.coin === 'Extranjera'

    if (previousCoin && previousCoin !== models.value.coin) {
      models.value.foreign_currency_value = 0
      models.value.trm = 0
      models.value.value = 0
    }
  }

  const updateCostCenter = () => {
    const selectedCostCenter = business_trusts_egreso.value.find(
      (costCenter) =>
        costCenter.value === data_information_form.value?.business_id
    )
    isCenterCostDisabled.value =
      !(selectedCostCenter?.account.has_cost_center ?? false) ||
      !selectedMovementHasCostCenter.value
  }

  const updateCashFlow = () => {
    const selectedCashFlow = business_trusts_egreso.value.find(
      (cashFlow) => cashFlow.value === data_information_form.value?.business_id
    )
    isCashFlowDisabled.value =
      selectedCashFlow?.treasurie?.has_cash_flow ?? false
  }

  const updatePaymentInstructions = () => {
    const selectedPayments = payments.value.find(
      (instructions) => instructions.value === models.value.method_payment_id
    )
    const typeMeanOfPayment = selectedPayments?.type_mean_of_payments ?? ''
    isPaymentsDisabled.value = typeMeanOfPayment === 'Transferencia'
    isInstructionDisabled.value =
      !!selectedPayments && !!selectedPayments.payment_instructions

    if (!isPaymentsDisabled.value) {
      resetBeneficiaryBankAccount()
    }
    if (
      isInstructionDisabled.value &&
      props.action !== 'view' &&
      props.action !== 'edit'
    ) {
      resetAuthorizedDocumentDetails()
    }
    if (
      typeMeanOfPayment !== 'Transferencia' &&
      !selectedPayments?.request_bank_withdrawal
    ) {
      isBankBeneficiaryDisabled.value = true
      models.value.beneficiary_bank_id = null
    } else if (isPaymentsDisabled) {
      isBankBeneficiaryDisabled.value = false
      isBankBranchDisabled.value = true
    }
  }

  const resetBeneficiaryBankAccount = async () => {
    models.value.beneficiary_bank_account = null
  }

  const resetAuthorizedDocumentDetails = async () => {
    models.value.authorized_document_type_id = null
    models.value.identification_authorized = null
  }

  const updateBankAccountThirdParty = async () => {
    const selectedPayment = payments.value.find(
      (payment) => payment.value === models.value.method_payment_id
    )
    const typeMeanOfPayment = selectedPayment?.type_mean_of_payments ?? ''
    if (
      typeMeanOfPayment === 'Transferencia' &&
      models.value.nit_third_party_id
    ) {
      const key = {
        treasury: ['bank_account_third_parties'],
      }
      const query =
        `third_party_id=${models.value.nit_third_party_id}` +
        (models.value.beneficiary_bank_id
          ? `&bank_third_party_id=${models.value.beneficiary_bank_id}`
          : '')

      await _getResources(key, query)
    }
  }

  const updateAuthorizedDocumentType = () => {
    const selectedPayment = payments.value.find(
      (payment) => payment.value === models.value.method_payment_id
    )

    const authorized_payment = selectedPayment?.authorized_payment
    const typeMeanOfPayment = selectedPayment?.type_mean_of_payments ?? ''
    isBankAccountThirdPartyDisabled.value =
      typeMeanOfPayment === 'Cheque de oficina' && !!authorized_payment
  }

  const updateBranches = async () => {
    const { beneficiary_bank_id, method_payment_id } = models.value

    if (!beneficiary_bank_id) {
      isBankBranchDisabled.value = true
      models.value.bank_branch_id = null
      return
    }

    const selectedPayment = payments.value.find(
      (payment) => payment.value === method_payment_id
    )

    const requestBankWithdrawal = selectedPayment?.request_bank_withdrawal
    request_bank_withdrawal.value = !!requestBankWithdrawal
    isBankBranchDisabled.value = !!requestBankWithdrawal

    if (!requestBankWithdrawal) return
    const key = {
      treasury: ['bank_branches_third_party'],
    }
    await _getResources(key, `bank_id=${beneficiary_bank_id} `)
  }

  const updateBeneficiaryBankId = async () => {
    if (!models.value.method_payment_id && props.action === 'create') {
      models.value.nit_third_party_id = null
      models.value.bank_branch_id = null
      models.value.authorized_document_type_id = null
      models.value.identification_authorized = null
      return
    }

    if (!models.value.nit_third_party_id) {
      models.value.beneficiary_bank_id = null
      models.value.beneficiary_bank_account = null
      models.value.bank_branch_id = null
      bank_branches_third_party.value = []
      bank_third_partie.value = []
      bank_account_third_parties.value = []
      return
    }

    const selectedPayment = payments.value.find(
      (payment) => payment.value === models.value.method_payment_id
    )
    const requiresBankWithdrawal =
      selectedPayment?.request_bank_withdrawal ?? false

    const key = requiresBankWithdrawal
      ? { treasury: ['banks'] }
      : { treasury: ['banks_third_parties'] }

    const query = requiresBankWithdrawal
      ? undefined
      : `third_party_id=${models.value.nit_third_party_id}`

    await _getResources(key, query)

    bank_third_partie.value = requiresBankWithdrawal
      ? banks_initial_balance.value
      : banks_third_parties.value
    return bank_third_partie.value
  }

  const updateForeignCurrencyValue = () => {
    if (models.value.trm && models.value.foreign_currency_value) {
      models.value.value = calculateForeignCurrency()
    }
  }

  watch(
    () => models.value.beneficiary_bank_id,
    (newValue, oldValue) => {
      if (!hasInitialized.value) {
        hasInitialized.value = true
        return
      }

      if (props.action === 'edit' && newValue && newValue !== oldValue) {
        models.value.beneficiary_bank_account = ''
      }
    }
  )
  watch(
    () => [
      models.value.bank_account_id,
      models.value.method_payment_id,
      models.value.foreign_currency_value,
      models.value.trm,
      models.value.nit_third_party_id,
      models.value.cost_center_id,
      models.value.beneficiary_bank_id,
    ],
    async () => {
      updateBranches()
      updateCoinType()
      updatePaymentInstructions()
      updateForeignCurrencyValue()
      updateBeneficiaryBankId()
      updateBankAccountThirdParty()
      updateAuthorizedDocumentType()
    }
  )

  watch(
    () => models.value.identification_authorized,
    () => {
      const selectedThirdParty = active_third_parties.value.find(
        (item) => item.value === models.value.identification_authorized
      )

      if (
        selectedThirdParty &&
        models.value.identification_authorized !== selectedThirdParty.document
      ) {
        models.value.identification_authorized = selectedThirdParty.value ?? ''
        models.value.name_authorized = selectedThirdParty.name ?? ''
      }
    }
  )

  watch(
    () => models.value.method_payment_id,
    (newMethodPaymentId) => {
      if (newMethodPaymentId && props.action === 'create') {
        models.value.nit_third_party_id = null
        models.value.bank_branch_id = null
        models.value.authorized_document_type_id = null
        models.value.identification_authorized = null
        bank_branches_third_party.value = []
        bank_third_partie.value = []
        bank_account_third_parties.value = []
      }
    }
  )

  watch(
    () => models.value.nit_third_party_id,
    (newNitThirdPartyId) => {
      if (newNitThirdPartyId && props.action === 'create') {
        models.value.bank_branch_id = null
        models.value.beneficiary_bank_account = null
        models.value.beneficiary_bank_id = null
        bank_branches_third_party.value = []
        bank_third_partie.value = []
        bank_account_third_parties.value = []
      }
    }
  )

  watch(
    () => models.value.beneficiary_bank_id,
    async (newBeneficiaryBankId) => {
      if (newBeneficiaryBankId && props.action === 'create') {
        await updateBankAccountThirdParty()
        models.value.bank_branch_id = null
        if (request_bank_withdrawal.value) {
          isBankBranchDisabled.value = false
        }
      }
    }
  )

  watch(
    () => models.value.beneficiary_bank_id,
    (newVal, oldVal) => {
      if (props.action === 'edit') {
        if (newVal === oldVal || !newVal) {
          isBankBranchDisabled.value = true
        } else {
          isBankBranchDisabled.value = false
        }
      }
    }
  )

  watch(
    () => models.value.bank_id,
    async (newValue) => {
      models.value.bank_name =
        banks_record_expenses.value.find(
          (item) => item.value === models.value.bank_id
        )?.label ?? ''

      if (props.action === 'create') {
        models.value.bank_account_id = null
        if (newValue) {
          const key = {
            treasury: ['bank_account'],
          }
          const query = `filter[business_id]=${data_information_form.value?.business_id}&filter[bank_id]=${newValue}`
          await _getResources(key, query)
        }
      }
    }
  )

  watch(
    () => models.value.cash_flow_id,
    () => {
      models.value.cash_flow_name =
        cash_flow_structure_egreso.value.find(
          (item) => item.value === models.value.cash_flow_id
        )?.name ?? ''
    }
  )

  watch(
    () => models.value.bank_branch_id,
    () => {
      models.value.bank_branch_name =
        bank_branches_third_party.value.find(
          (item) => item.value === models.value.bank_branch_id
        )?.label ?? ''
    }
  )

  watch(
    () => models.value.beneficiary_bank_account,
    () => {
      models.value.beneficiary_bank_account_name =
        bank_account_third_parties.value.find(
          (item) => item.value === models.value.beneficiary_bank_account
        )?.label ?? ''
    }
  )

  watch(
    () => ({
      bank_account_id: models.value.bank_account_id,
      nit_third_party_id: models.value.nit_third_party_id,
      method_payment_id: models.value.method_payment_id,
      cost_center_id: models.value.cost_center_id,
      authorized_document_type_id: models.value.authorized_document_type_id,
    }),
    (newValue, oldValue) => {
      if (newValue.bank_account_id !== oldValue.bank_account_id) {
        models.value.bank_account_name =
          bank_accounts_with_name.value.find(
            (item) => item.value === newValue.bank_account_id
          )?.label ?? ''
      }

      if (newValue.nit_third_party_id !== oldValue.nit_third_party_id) {
        models.value.nit_third_party_name =
          active_third_parties.value.find(
            (item) => item.value === newValue.nit_third_party_id
          )?.label ?? ''
      }

      if (newValue.method_payment_id !== oldValue.method_payment_id) {
        models.value.method_payment_name =
          paymentLabels.find(
            (item) => item.value === newValue.method_payment_id
          )?.label ?? ''
      }

      if (newValue.cost_center_id !== oldValue.cost_center_id) {
        models.value.cost_center_name =
          bank_account_cost_centers.value.find(
            (item) => item.value === newValue.cost_center_id
          )?.label ?? ''
      }
      if (
        newValue.authorized_document_type_id !==
        oldValue.authorized_document_type_id
      ) {
        models.value.authorized_document_type_name =
          document_type.value.find(
            (item) => item.value === newValue.authorized_document_type_id
          )?.label ?? ''
      }
    }
  )

  watch(
    () => models.value.bank_account_id,
    async (newValue) => {
      const idCoin = bank_accounts_with_name.value.find(
        (account) => account.value === newValue
      )?.coin

      await _getResources({
        investment_portfolio: [`coins&filter[id]=${idCoin}`],
      })
      if (coins.value.length > 0 && isBankAccountDisabled.value) {
        models.value.trm = Number(coins.value[0].coin_value ?? 0)
      }

      taxedWithGmf.value =
        bank_accounts_with_name.value.find(
          (item) => item.id === models.value.bank_account_id
        )?.taxed_gmf ?? false
    },
    { deep: true }
  )

  watch(
    () =>
      generateSpecialContribution.value &&
      taxedWithGmf.value &&
      models.value.value,
    () => {
      if (generateSpecialContribution.value && taxedWithGmf.value) {
        const rate = Number(
          bank_accounts_with_name.value.find(
            (item) => item.id === models.value.bank_account_id
          )?.gmf_rate ?? 0
        )

        models.value.gmf = rate * models.value.value
      }
    },
    { immediate: true, deep: true }
  )

  onBeforeMount(() => {
    if (!data_information_form.value) {
      router.push({
        name: 'RecordIndividualExpensesList',
      })
    }
  })

  onMounted(async () => {
    handlerActionForm(props.action)
    updateCostCenter()
    updateCashFlow()
    await _getResources({
      treasury: ['filter[type_mean_of_payments]=Traslado&keys[]=payments'],
    })

    if (props.action === 'edit') {
      isBankBranchDisabled.value = true
    }

    generateSpecialContribution.value =
      treasury_movement_code_expense.value.find(
        (item) => item.id === data_information_form.value?.movement_id
      )?.generate_special_contribution ?? false

    taxedWithGmf.value =
      bank_accounts_with_name.value.find(
        (item) => item.id === models.value.bank_account_id
      )?.taxed_gmf ?? false
  })

  return {
    models,
    detailOfIndividualBasicDataRef,
    effective_date_filter,
    payments,
    paymentLabels,
    bank_account_cost_centers,
    selectedMovementHasCostCenter,
    banks_initial_balance,
    banks_third_parties,
    bank_accounts_with_name,
    active_third_parties,
    cash_flow_structure_egreso,
    isBankAccountDisabled,
    isInstructionDisabled,
    isPaymentsDisabled,
    bank_account_third_parties,
    document_type,
    business_trusts_egreso,
    isCenterCostDisabled,
    isCashFlowDisabled,
    bank_third_partie,
    isBankAccountThirdPartyDisabled,
    isBankBranchDisabled,
    is_editing,
    bank_branches_third_party,
    third_parties,
    isBankBeneficiaryDisabled,
    banks_record_expenses,
  }
}

export default useDetailOfIndividualExpensesData
