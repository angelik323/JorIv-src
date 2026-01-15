// Vue - Vue Router - Pinia
import { ref, onBeforeMount, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IGroundsBlockingInvestmentPlanItemList } from '@/interfaces/customs/fics/GroundsBlockingInvestmentPlan'
import { ITabs } from '@/interfaces/global'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useGroundsBlockingInvestmentPlanStore } from '@/stores/fics/grounds-blocking-investment-plan'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useGroundsBlockingInvestmentPlanEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const route = useRoute()

  const {
    _clearData,
    _updateGroundsBlockingInvestment,
    _getByIdGroundsBlockingInvestment,
  } = useGroundsBlockingInvestmentPlanStore('v1')

  const { rounds_blocking_investment_plan_response } = storeToRefs(
    useGroundsBlockingInvestmentPlanStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()

  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  const key = {
    fics: ['status_blocking_reason_investment'],
  }

  const headerProps = {
    title: 'Editar causal de bloqueo plan de inversión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Causales de bloqueos plan de inversión',
        route: 'GroundsBlockingInvestmentPlanList',
      },
      {
        label: 'Editar',
        route: 'GroundsBlockingInvestmentPlanEdit',
      },
      {
        label: id,
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
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const makeDataRequest = (): IGroundsBlockingInvestmentPlanItemList => {
    const form = rounds_blocking_investment_plan_response.value

    return {
      code: form?.code ?? null,
      description: form?.description ?? '',
      status_id: form?.status_id ?? '',
    }
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) {
      showAlert('El registro no pudo ser actualizado.', 'error')
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateGroundsBlockingInvestment(payload, Number(id))

    if (success) handleGoToList()

    openMainLoader(false)
  }

  const handleGoToList = () =>
    goToURL('GroundsBlockingInvestmentPlanList', undefined, { reload: true })

  onMounted(async () => await _getResources(key))

  onBeforeMount(() => {
    _clearData()
    openMainLoader(true)

    _resetKeys(key)
    _getByIdGroundsBlockingInvestment(Number(id))

    openMainLoader(false)
  })

  return {
    tabs,
    onSubmit,
    tabActive,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    informationFormRef,
  }
}

export default useGroundsBlockingInvestmentPlanEdit
