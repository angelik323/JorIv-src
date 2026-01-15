import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { IGBTOtherCurrenciesModel, ReportTypes } from '@/interfaces/customs'
import {
  useAccountingResourceStore,
  useOpeningRecordStore,
  useResourceManagerStore,
  useAccoutingReportStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'
import { defaultIconsLucide, fullName } from '@/utils'
import { ActionType } from '@/interfaces/global'
import { useMainLoader } from '@/composables'
const useGBTOtherOcurrenciesForm = (
  props: {
    action: ActionType
    data?: IGBTOtherCurrenciesModel
  },
  emits: Function
) => {
  const resourceManagerStore = useResourceManagerStore('v1')
  const accountingStoreV1 = useAccountingResourceStore('v1')
  const openingRecordStore = useOpeningRecordStore('v1')
  const { accounting_coins: coins } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { openMainLoader } = useMainLoader()

  const otherOcurrencies = useAccoutingReportStore(
    'v1',
    'otherOcurrencies'
  ) as ReportTypes['otherOcurrencies']

  const {
    business_trust,
    amount_types,
    accounts_by_structure,
    structure_by_business,
    structure_levels_report,
    third_parties,
    template,
    business_trusts_with_description,
  } = storeToRefs(accountingStoreV1)

  const { opening_bussines_list } = storeToRefs(openingRecordStore)

  const { _getResources } = resourceManagerStore

  const openingReportForm = ref()
  const isEdit = computed(() => props.action === 'edit')
  const showTable = ref(false)

  const models = ref<IGBTOtherCurrenciesModel>({
    report_template_id: '',
    business_trust_id: 0,
    account_structure_id: '',
    level: '',
    from_period: '',
    to_period: '',
    from_account_id: 0,
    to_account_id: 0,
    show_auxiliaries: true,
    from_auxiliaries_id: null,
    to_auxiliaries_id: null,
    rate_code: '',
    rate: '',
  })

  if (props.action === 'edit' && props.data) {
    models.value = { ...models.value, ...props.data }
  }

  const pagination = ref({
    page: 1,
    rowsPerPage: 5,
  })

  const validate = async () => {
    const result = await openingReportForm.value?.validate?.()
    return result
  }

  // Validacion correcta de estructura contable
  const accountStructureOptions = computed(() => {
    const selectedTrust = business_trust.value.find(
      (bt) => bt.value === models.value.business_trust_id
    )

    if (!selectedTrust) return []

    return selectedTrust.account?.business_trust_account_structure?.map(
      (btas) => {
        const s = btas.account_structure
        return {
          label: `${s.code} - ${s.purpose}`,
          value: s.id,
        }
      }
    )
  })

  // Validacion temporal de estructuras contables
  const accountStructureOptionsTemporally = computed(() => {
    const selectedTrust = business_trust.value.find(
      (bt) => bt.value === models.value.business_trust_id
    )

    if (!selectedTrust) return []

    const structure = selectedTrust.account?.accounting_structure
    return [
      {
        label: `${structure?.code} - ${structure?.purpose}`,
        value: structure?.id,
      },
    ]
  })

  const setFormData = () => {
    if (!props.data) return
  }

  const getFormData = () => {
    const data = JSON.parse(JSON.stringify(models.value))

    return data
  }

  const handleContinue = async () => {
    openMainLoader(true)
    const params: Record<string, string | number | null> = {
      report_template_id: models.value.report_template_id,
      'filter[business_trust_id]': models.value.business_trust_id,
      'filter[account_structure_id]': models.value.account_structure_id,
      'filter[level]': models.value.level,
      'filter[from_period]': models.value.from_period,
      'filter[to_period]': models.value.to_period,
      'filter[from_account_id]': models.value.from_account_id,
      'filter[to_account_id]': models.value.to_account_id,
      'filter[show_auxiliaries]': models.value.show_auxiliaries ? 1 : 0,
      'filter[rate_code]': models.value.rate_code,
      'filter[rate]': models.value.rate,
      paginate: 1,
    }

    if (models.value.show_auxiliaries) {
      params['filter[from_auxiliary_id]'] = models.value.from_auxiliaries_id
      params['filter[to_auxiliary_id]'] = models.value.to_auxiliaries_id
    }

    const result = await otherOcurrencies._getTrialBalanceOtherCurrencies(
      params
    )
    openMainLoader(false)

    if (result) {
      emits('enable-preview-tab', params)
    }
  }

  const isFormValid = computed(() => {
    const m = models.value
    return (
      !!m.report_template_id &&
      !!m.business_trust_id &&
      !!m.account_structure_id &&
      !!m.level &&
      !!m.from_period &&
      !!m.to_period &&
      !!m.from_account_id &&
      !!m.to_account_id &&
      !!m.rate_code &&
      !!m.rate &&
      (!m.show_auxiliaries ||
        (!!m.from_auxiliaries_id && !!m.to_auxiliaries_id))
    )
  })

  onMounted(async () => {
    await _getResources({ accounting: ['business_trusts_with_description'] })
    setFormData()
  })

  watch(
    () => models.value.show_auxiliaries,
    (newValue) => {
      if (!newValue) {
        models.value.from_auxiliaries_id = null
        models.value.to_auxiliaries_id = null
      }
    }
  )

  watch(
    () => models.value.rate_code,
    (newCode) => {
      if (!newCode) {
        models.value.rate = ''
        return
      }

      const coin = coins.value.find((c) => c.value === newCode)
      if (coin) {
        models.value.rate = String(coin.rate ?? '')
      }
    }
  )

  watch(
    () => models.value.business_trust_id,
    async (businessTrustId) => {
      models.value.account_structure_id = ''
      models.value.level = ''
      models.value.from_account_id = 0
      models.value.to_account_id = 0

      if (!businessTrustId) return

      await _getResources(
        { accounting: ['structure_by_business'] },
        `filter[business_id]=${businessTrustId}`,
        'v1'
      )
    }
  )

  watch(
    () => models.value.account_structure_id,
    async (accountStructureId) => {
      models.value.level = ''
      models.value.from_account_id = 0
      models.value.to_account_id = 0

      if (!accountStructureId) return

      await _getResources(
        { accounting: ['structure_levels'] },
        `filter[id]=${accountStructureId}`,
        'v2'
      )

      await _getResources(
        { accounting: ['accounts_by_structure'] },
        `filter[account_structure_id]=${accountStructureId}`,
        'v1'
      )
    }
  )

  watch(
    () => props.data,
    () => setFormData()
  )

  watch(models, () => emits('update'), { deep: true })

  return {
    openingReportForm,
    models,
    isEdit,
    pagination,
    defaultIconsLucide,
    business_trust,
    business_trusts_with_description,
    coins,
    template,
    structure_by_business,
    structure_levels_report,
    amount_types,
    accountStructureOptions,
    accountStructureOptionsTemporally,
    accounts_by_structure,
    fullName,
    isFormValid,
    opening_bussines_list,
    showTable,
    validate,
    handleContinue,
    third_parties,
    getFormData,
  }
}

export default useGBTOtherOcurrenciesForm
