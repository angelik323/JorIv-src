// Vue - Vue Router
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useInvestmentPlanOperationStore } from '@/stores/fics/investment-plan-operations'

const useInvestmentPlanOperationAnnulate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    _annulateOperation,
    _getInvestmentPlanOperation,
    _getInvestmentPlanOperationDetails,
  } = useInvestmentPlanOperationStore('v1')

  const annulateModalRef = ref()
  const annulateForm = ref()

  const investmentPlanOperationId = +route.params.id

  const headerProps = {
    title: 'Anulación operaciones monetarias',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      { label: 'Fics' },
      {
        label: 'Registro de operaciones para Aportes/Retiros',
        route: 'InvestmentPlanOperationList',
      },
      {
        label: 'Anulación operaciones monetarias',
        route: 'InvestmentPlanOperationAnnulate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
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

  const confirmAnnulation = () => annulateModalRef.value.openModal()

  const annulateOperation = async () => {
    annulateModalRef.value.closeModal()
    const success = await _annulateOperation(investmentPlanOperationId)
    if (success) handleGoToList()
  }

  const handleGoToList = () =>
    goToURL('InvestmentPlanOperationList', undefined, { reload: true })

  onMounted(async () => {
    openMainLoader(true)

    await _getInvestmentPlanOperation(investmentPlanOperationId)
    _getInvestmentPlanOperationDetails(investmentPlanOperationId)

    openMainLoader(false)
  })

  return {
    tabs,
    tabActive,
    headerProps,
    tabActiveIdx,
    annulateForm,
    handleGoToList,
    annulateModalRef,
    annulateOperation,
    confirmAnnulation,
    investmentPlanOperationId,
  }
}

export default useInvestmentPlanOperationAnnulate
