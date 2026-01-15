import router from '@/router'
import { ref } from 'vue'

import { useMainLoader, useUtils } from '@/composables'

import { ITabs } from '@/interfaces/global'

import { useRiskRatingAgenciesStore } from '@/stores'

const useRiskRatingAgenciesCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _createAction } = useRiskRatingAgenciesStore('v1')

  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear calificadora de riesgo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: 'Calificadoras de riesgo',
        route: 'RiskRatingAgenciesList',
      },
      {
        label: 'Crear',
        route: 'RiskRatingAgenciesCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const handleSubmitForm = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    const information = informationFormRef.value?.getValues()

    openMainLoader(true)

    const success = await _createAction(information)

    if (success) handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    router.push({
      name: 'RiskRatingAgenciesList',
      query: { reload: 'true' },
    })

  return {
    tabs,
    tabActive,
    tabActiveIdx,
    handleGoToList,
    handleSubmitForm,
    headerProperties,
    informationFormRef,
  }
}

export default useRiskRatingAgenciesCreate
