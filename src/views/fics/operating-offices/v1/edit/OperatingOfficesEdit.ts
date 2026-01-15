// Vue - Vue Router - Pinia
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useOperatingOfficesStore } from '@/stores/fics/operating-offices'
import { ITabs } from '@/interfaces/global'

const useOperatingOfficesEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _updateOperatingOffices, _getByIdOperatingOffices } =
    useOperatingOfficesStore('v1')
  const { operating_offices_response } = storeToRefs(
    useOperatingOfficesStore('v1')
  )

  const informationFormRef = ref()

  const operatingOfficesId = +route.params.id

  const headerProperties = {
    title: 'Editar oficinas de operación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Oficinas de operación',
        route: 'OperatingOfficesList',
      },
      {
        label: 'Editar',
        route: 'OperatingOfficesEdit',
      },
      {
        label: operatingOfficesId.toString(),
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'InformationForm',
      label: 'Datos básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const activeTab = tabs[0].name
  const tabActiveIdx = 0

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }
  const onSubmit = async () => {
    const isValid = await validateForm()
    if (!isValid) return
    openMainLoader(true)

    const data = informationFormRef.value?.getValues()

    const payload = {
      ...data,
    }

    const success = await _updateOperatingOffices(payload, operatingOfficesId)
    if (success) handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    goToURL('OperatingOfficesList', undefined, { reload: true })

  onMounted(async () => {
    openMainLoader(true)

    await _getByIdOperatingOffices(operatingOfficesId)

    openMainLoader(false)
  })

  return {
    tabs,
    onSubmit,
    activeTab,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    informationFormRef,
    operating_offices_response,
  }
}

export default useOperatingOfficesEdit
