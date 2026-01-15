import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useUtils } from '@/composables'

import { IQuotasIssuingPermitsRequest } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import {
  useResourceManagerStore,
  useTreasuryResourceStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'

const useInformationForm = (props: { action: ActionType; data?: {} }) => {
  const { formatCurrencyString } = useUtils()

  const { _getResources } = useResourceManagerStore('v1')

  const {
    investment_portfolio,
    emitter: emitterIdSelect,
    type_investment: typeInvestmentSelect,
    paper_type: paperTypeSelect,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { bank_account_third_party_quotas: bankAccountSelect } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const selectedBankAccountIds = ref<number[]>([])
  const informationFormRef = ref()
  const thirdPartyId = ref('')

  const formData = ref<IQuotasIssuingPermitsRequest>({
    absolute_value_general_quota: '',
    absolute_value_of_issue: '',
    investment_portfolio_id: 0,
    emission_percentage: '',
    has_bank_accounts: 0,
    quota_generates: '',
    general_quota: 0,
    paper_type_id: 0,
    issuing_banks: [],
    has_emission: 0,
    issue_value: '',
    emitter_id: null,
  })

  const handleEmitterIdChange = (value: number) => {
    formData.value.emitter_id = value

    const selected = emitterIdSelect.value.find((item) => item.value === value)
    formData.value.description_emitter_name = selected?.description || ''
    thirdPartyId.value = selected?.third_party_id?.toString() || ''
  }

  const handlePortfolioIdChange = (value: number | string) => {
    formData.value.investment_portfolio_id = Number(value)

    const selected = investment_portfolio.value.find(
      (item) => item.value === value
    )
    formData.value.description_portfolio_name = selected?.description || ''
  }

  const handleTypeInvestmentChange = async (value: string) => {
    if (!isEdit.value) {
      formData.value.paper_type_id = 0
    }

    const selected = typeInvestmentSelect.value.find(
      (item) => item.value === value
    )
    const label = selected?.label || (typeof value === 'string' ? value : '')

    if (!label) return

    await _getResources(
      { investment_portfolio: ['paper_type'] },
      `filter[investment_type]=${label}`
    )
  }

  const handleBankAccountSelection = () => {
    formData.value.issuing_banks = bankAccountSelect.value
      .filter((acc) => selectedBankAccountIds.value.includes(acc.id))
      .map((acc) => ({
        id: acc.id,
        account_number: acc.account_number,
        coin_type: acc.coin_type,
      }))
  }

  const hasBankAccountsBool = computed({
    get: () =>
      formData.value.has_bank_accounts === 1 ||
      formData.value.has_bank_accounts === true,
    set: async (val: boolean) => {
      formData.value.has_bank_accounts = val ? 1 : 0
    },
  })

  const hasEmissionBool = computed({
    get: () =>
      formData.value.has_emission === 1 || formData.value.has_emission === true,
    set: (val: boolean) => {
      formData.value.has_emission = val ? 1 : 0

      formData.value.issue_value = ''
      formData.value.emission_percentage = ''
      formData.value.absolute_value_of_issue = ''
      formData.value.quota_generates = ''
      formData.value.absolute_value_general_quota = ''
    },
  })

  const disableAbsoluteValue = computed(() =>
    hasEmissionBool.value
      ? !!formData.value.emission_percentage
      : !!formData.value.quota_generates
  )

  const disableEmissionPercentage = computed(() =>
    hasEmissionBool.value
      ? !!formData.value.absolute_value_of_issue
      : !!formData.value.absolute_value_general_quota
  )

  const isView = computed(() => props.action === 'view')
  const isEdit = computed(() => props.action === 'edit')
  const isEditable = computed(() => ['create', 'edit'].includes(props.action))

  watch(
    () => props.data,
    (newData) => {
      if (newData) {
        formData.value = { ...formData.value, ...newData }
      }
    },
    { immediate: true }
  )

  watch(
    () => thirdPartyId.value,
    async (thirdPartyId) => {
      if (thirdPartyId)
        await _getResources(
          { treasury: ['bank_account_third_party'] },
          `third_party_id=${thirdPartyId}`
        )
    }
  )

  onMounted(async () => {
    if (hasBankAccountsBool.value && thirdPartyId.value) {
      await _getResources(
        { treasury: ['bank_account_third_party'] },
        `third_party_id=${thirdPartyId.value}`
      )
    }
    if (formData.value.issuing_banks?.length) {
      selectedBankAccountIds.value = formData.value.issuing_banks.map(
        (bank) => bank.id!
      )
    }

    if (isEdit.value && formData.value.type_of_investment) {
      await handleTypeInvestmentChange(formData.value.type_of_investment)
    }
  })

  return {
    isView,
    isEdit,
    formData,
    isEditable,
    emitterIdSelect,
    hasEmissionBool,
    paperTypeSelect,
    bankAccountSelect,
    informationFormRef,
    hasBankAccountsBool,
    disableAbsoluteValue,
    typeInvestmentSelect,
    formatCurrencyString,
    handleEmitterIdChange,
    selectedBankAccountIds,
    handlePortfolioIdChange,
    disableEmissionPercentage,
    handleBankAccountSelection,
    handleTypeInvestmentChange,
    investment_portfolio,
  }
}

export default useInformationForm
