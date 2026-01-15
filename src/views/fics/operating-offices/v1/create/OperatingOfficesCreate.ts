// Vue
import { ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useOperatingOfficesStore } from '@/stores/fics/operating-offices'

const useOperatingOfficesCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _createOperatingOffices } = useOperatingOfficesStore('v1')

  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear oficinas de operación',
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
        label: 'Crear',
        route: 'OperatingOfficesCreate',
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

    const payload = { ...data }

    const success = await _createOperatingOffices(payload)
    if (success) handleGoToList()

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleGoToList = () =>
    goToURL('OperatingOfficesList', undefined, { reload: true })

  return {
    tabs,
    onSubmit,
    activeTab,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    informationFormRef,
  }
}

export default useOperatingOfficesCreate
