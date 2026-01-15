//vue - router - quasar -pinia
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useOperatingOfficesStore } from '@/stores/fics/operating-offices'

const useOperatingOfficesView = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getByIdOperatingOffices } = useOperatingOfficesStore('v1')
  const { operating_offices_response } = storeToRefs(
    useOperatingOfficesStore('v1')
  )

  const informationFormRef = ref()

  const operatingOfficesId = +route.params.id

  const headerProperties = {
    title: 'Ver oficinas de operación',
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
        label: 'Ver',
        route: 'OperatingOfficesView',
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

  const onSubmit = async () => {
    handleGoToList()
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

export default useOperatingOfficesView
