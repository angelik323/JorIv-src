// Vue - Pinia - Moment
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

//  Interfaces - Constants
import { IFicsExtractGenerationRequest } from '@/interfaces/customs/fics/GenerateExtractst'
import { generateExtractsOptions as radioOptions } from '@/constants/resources'

// Composables
import { useUtils } from '@/composables'

// Stores
import { ITrustBusinessResponse } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useResourceStore } from '@/stores/resources-selects'

const useInformationForm = () => {
  const { selectItemByID } = useUtils()

  const { funds, extract_types, fiduciary_investment_plans_by_holder } =
    storeToRefs(useFicResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { third_parties } = storeToRefs(useTreasuryResourceStore('v1'))
  const { year_list } = storeToRefs(useResourceStore('v1'))

  const { _showBusinessTrustsByHolder } = useFiduciaryInvestmentPlanStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  const dateToday = moment().format('YYYY-MM-DD')
  const informationFormRef = ref()

  const formData = ref<IFicsExtractGenerationRequest>({
    extract_type: '',
    generation_type: 'masivo',
    period_from: '',
    period_to: '',
  })

  const isIndividual = computed(
    () => formData.value.generation_type === 'individual'
  )

  const titularSelected = computed(() => !!formData.value.identification_id)

  const selectOptions = computed(() => ({
    fiduciary_investment_plans: fiduciary_investment_plans_by_holder.value,
    business_trusts: business_trusts.value,
    third_parties: third_parties.value,
    extract_types: extract_types.value,
    years: year_list.value,
    funds: funds.value,
  }))

  const disablePlan = computed(() => {
    if (!isIndividual.value) return true
    if (!titularSelected.value) return true
    if (formData.value.business_trust_id) return true
    return false
  })

  const disableBusiness = computed(() => {
    if (!isIndividual.value) return true
    if (!titularSelected.value) return true
    if (formData.value.fiduciary_investment_plan_id) return true
    return false
  })

  const excludeSelectedYear = (
    selected: string | number | null,
    list: number[]
  ) =>
    list
      .filter((year) => year !== Number(selected || 0))
      .map((year) => ({ label: year.toString(), value: year }))

  const cleanDisabledFields = (tipo: string) => {
    if (tipo === 'individual') {
      formData.value.initial_fund_id = null
      formData.value.initial_fund = null
      formData.value.final_fund_id = null
      formData.value.final_fund = null
    } else if (tipo === 'masivo') {
      formData.value.identification_id = null
      formData.value.identification = null
      formData.value.fiduciary_investment_plan_id = null
      formData.value.business_trust_id = null
    }

    formData.value.period_from = ''
    formData.value.period_to = ''
  }

  const onSelectThirdParty = (selectedId: number | null) => {
    if (!selectedId) {
      formData.value.identification_id = null
      formData.value.identification = null
      formData.value.fiduciary_investment_plan_id = null
      formData.value.business_trust_id = null
      return
    }

    selectItemByID(selectOptions.value.third_parties, selectedId, formData, {
      identification_id: 'value',
      identification: 'document',
    })
  }

  const onSelectInitialFund = (selectedId: number) =>
    selectItemByID(selectOptions.value.funds, selectedId, formData, {
      initial_fund_id: 'value',
      initial_fund: 'fund_code',
    })

  const onSelectFinalFund = (selectedId: number) =>
    selectItemByID(selectOptions.value.funds, selectedId, formData, {
      final_fund_id: 'value',
      final_fund: 'fund_code',
    })

  watch(
    () => formData.value.generation_type,
    (newType) => cleanDisabledFields(newType)
  )

  watch(
    () => formData.value.period_from,
    (newValue) => (formData.value.period_to = newValue)
  )

  watch(
    () => formData.value.identification_id,
    async (newVal) => {
      if (!newVal) return

      await _getResources(
        {
          fics: ['fiduciary_investment_plans_by_holder'],
        },
        `filter[holder_id]=${newVal}`
      )

      const response = await _showBusinessTrustsByHolder(newVal)

      business_trusts.value = response.map((item: ITrustBusinessResponse) => ({
        ...item,
        value: item.id,
        label: `${item.business_code} - ${item.name}`,
      }))
    }
  )

  watch(
    () => formData.value.fiduciary_investment_plan_id,
    (newValue) => {
      if (newValue) {
        formData.value.business_trust_id = null
      }
    }
  )

  watch(
    () => formData.value.business_trust_id,
    (newValue) => {
      if (newValue) {
        formData.value.fiduciary_investment_plan_id = null
      }
    }
  )

  return {
    formData,
    dateToday,
    disablePlan,
    radioOptions,
    isIndividual,
    selectOptions,
    disableBusiness,
    onSelectFinalFund,
    onSelectThirdParty,
    informationFormRef,
    onSelectInitialFund,
    excludeSelectedYear,
  }
}

export default useInformationForm
