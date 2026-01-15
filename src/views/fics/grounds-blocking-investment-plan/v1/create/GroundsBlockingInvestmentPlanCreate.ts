// Vue - Pinia
import { onBeforeMount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { IGroundsBlockingInvestmentPlanItemList } from '@/interfaces/customs/fics/GroundsBlockingInvestmentPlan'
import { useGroundsBlockingInvestmentPlanStore } from '@/stores/fics/grounds-blocking-investment-plan'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useGroundsBlockingInvestmentPlanCreate = () => {
  const { _createGroundsBlockingInvestment } =
    useGroundsBlockingInvestmentPlanStore('v1')
  const { rounds_blocking_investment_plan_response } = storeToRefs(
    useGroundsBlockingInvestmentPlanStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()

  const informationFormRef = ref()

  const key = {
    fics: ['status_blocking_reason_investment'],
  }

  const headerProps = {
    title: 'Crear causal de bloqueo plan de inversión',
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
        label: 'Crear',
        route: 'GroundsBlockingInvestmentPlanCreate',
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

  const makeDataRequest =
    (): Partial<IGroundsBlockingInvestmentPlanItemList> => {
      const form = rounds_blocking_investment_plan_response.value
      if (!form)
        throw new Error('El formulario de bloque contable no está disponible.')

      return {
        code: form?.code ?? null,
        description: form?.description,
        status_id: form?.status_id,
      }
    }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) {
      showAlert('El registro no pudo ser creado.', 'error')
      return
    }
    showAlert('¡Registro creado exitosamente!', 'success')

    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createGroundsBlockingInvestment(payload)

    if (success) handleGoToList()

    openMainLoader(false)
  }

  const handleGoToList = () =>
    goToURL('GroundsBlockingInvestmentPlanList', undefined, { reload: true })

  onMounted(async () => await _getResources(key))

  onBeforeMount(() => _resetKeys(key))

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

export default useGroundsBlockingInvestmentPlanCreate
