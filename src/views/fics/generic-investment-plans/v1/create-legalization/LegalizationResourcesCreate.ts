// Vue - Pinia - Route
import { ref, onUnmounted, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Components
import LegalizationResourcesForm from '@/components/Forms/Fics/GenericInvestmentPlans/LegalizationResources/LegalizationResourcesForm.vue'

// Interfaces
import { IGenericInvestmentPlansLegalizeResponse } from '@/interfaces/customs/fics/GenericInvestmentPlans'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

import { useGenericInvestmentPlansStore } from '@/stores/fics/generic-investment-plans'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useLegalizationResourcesCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    _showGenericPlanById,
    _createInvestmentPlansLegalization,
    _clearGenericPlanUnidentifedContributions,
    _listGenericPlanUnidentifiedContributionsById,
  } = useGenericInvestmentPlansStore('v1')

  const {
    generic_investment_plan_unidentified_contributions_list,
    generic_investment_plan_unidentified_contributions_pages,
  } = storeToRefs(useGenericInvestmentPlansStore('v1'))

  const genericInvestmentPlan =
    ref<IGenericInvestmentPlansLegalizeResponse | null>(null)

  const legalizationResourceFormRef = ref<InstanceType<
    typeof LegalizationResourcesForm
  > | null>(null)
  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const keys = {
    fics: ['funts_to_investment_plans'],
  }

  const headerProps = {
    title: 'Legalización de recursos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Planes de inversión genéricos',
        route: 'GenericInvestmentPlansList',
      },
      {
        label: 'Legalización de recursos',
        route: 'GenericInvestmentPlansLegalizeCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const loadData = async () => {
    isLoaded.value = false

    const genericPlanData = await _showGenericPlanById(id)

    await _listGenericPlanUnidentifiedContributionsById(id)

    if (genericPlanData) genericInvestmentPlan.value = genericPlanData

    isLoaded.value = true
  }

  const handleSubmitForm = async () => {
    openMainLoader(true)

    if (
      !(await legalizationResourceFormRef.value?.validateForm()) ||
      !legalizationResourceFormRef.value?.validateOperationCost()
    ) {
      openMainLoader(false)
      return
    }

    const payload = legalizationResourceFormRef.value.getFormValues()

    const success = await _createInvestmentPlansLegalization(
      Number(id),
      payload
    )

    if (success) await loadData()

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleGoToList = () =>
    goToURL('GenericInvestmentPlansList', undefined, { reload: 'true' })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await loadData()
    openMainLoader(false)
  })

  onUnmounted(() => {
    _resetKeys({
      ...keys,
      fics: [...keys.fics, 'fiduciary_investment_plans'],
    })

    _clearGenericPlanUnidentifedContributions()
  })

  return {
    tabs,
    isLoaded,
    tabActive,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    handleSubmitForm,
    informationFormRef,
    genericInvestmentPlan,
    legalizationResourceFormRef,
    generic_investment_plan_unidentified_contributions_list,
    generic_investment_plan_unidentified_contributions_pages,
  }
}

export default useLegalizationResourcesCreate
