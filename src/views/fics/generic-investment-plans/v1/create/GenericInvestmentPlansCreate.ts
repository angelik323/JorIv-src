// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Interfaces
import { IGenericInvestmentPlans } from '@/interfaces/customs/fics/GenericInvestmentPlans'
import { ITabs } from '@/interfaces/global'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useGenericInvestmentPlansStore } from '@/stores/fics/generic-investment-plans'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useGenericInvestmentPlansCreate = () => {
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useGenericInvestmentPlansStore('v1')

  const informationFormRef = ref()

  const keys = {
    fics: ['funts_to_investment_plans'],
    treasury: ['means_of_payments'],
  }

  const headerProps = {
    title: 'Crear plan de inversión genérico',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Fics', route: '' },
      {
        label: 'Planes de inversión genéricos',
        route: 'GenericInvestmentPlansList',
      },
      {
        label: 'Crear plan de inversión genérico',
        route: 'GenericInvestmentPlansCreate',
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

  const handleSubmitForm = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    openMainLoader(true)

    const info: IGenericInvestmentPlans = informationFormRef.value?.getValues()

    const success = await _createAction(info)

    if (success) handleGoToList()

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleGoToList = () =>
    goToURL('GenericInvestmentPlansList', undefined, { reload: 'true' })

  onMounted(async () => await _getResources(keys))

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    tabs,
    tabActive,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    handleSubmitForm,
    informationFormRef,
  }
}

export default useGenericInvestmentPlansCreate
