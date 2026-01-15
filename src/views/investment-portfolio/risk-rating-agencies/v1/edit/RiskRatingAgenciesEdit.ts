import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { IRiskRatingAgencies } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import { useRiskRatingAgenciesStore } from '@/stores'

const useRiskRatingAgenciesEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()

  const { _showAction, _updateAction } = useRiskRatingAgenciesStore('v1')

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const initialData = ref<IRiskRatingAgencies>({
    id: 0,
    code: 0,
    description: '',
    guy: '',
  })

  const headerProperties = {
    title: 'Editar calificadora de riesgo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: 'Calificadoras de riesgo',
        route: 'RiskRatingAgenciesList',
      },
      {
        label: 'Editar',
        route: 'RiskRatingAgenciesEdit',
      },
      {
        label: id,
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

  const loadData = async () => {
    openMainLoader(true)

    const success = await _showAction(id)

    if (success) {
      const data = success
      initialData.value = data
      isLoaded.value = true
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleSubmitForm = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    const information = informationFormRef.value?.getValues()

    openMainLoader(true)

    const success = await _updateAction(id, information)

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

  onMounted(() => loadData())

  return {
    tabs,
    isLoaded,
    tabActive,
    initialData,
    tabActiveIdx,
    handleGoToList,
    handleSubmitForm,
    headerProperties,
    informationFormRef,
  }
}

export default useRiskRatingAgenciesEdit
