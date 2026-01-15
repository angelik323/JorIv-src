import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import router from '@/router'

// Composables
import { useMainLoader } from '@/composables'

// Utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import { IGeneralRequests } from '@/interfaces/customs/trust-business/GeneralRequests'
import { ITabs } from '@/interfaces/global/Tabs'

// Stores
import { useGeneralRequestsStore } from '@/stores/trust-business/general-requests'

const useGeneralRequestsView = () => {
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { _showAction } = useGeneralRequestsStore('v1')

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const initialData = ref<IGeneralRequests>({
    id: 0,
    name: '',
    business_trust_id: 0,
    currency_id: 0,
    record_status_id: 0,
    fund_id: 0,
  })

  const headerProps = {
    title: 'Ver encargo general',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Encargos general',
        route: 'GeneralRequestsList',
      },
      {
        label: 'Ver',
        route: 'GeneralRequestsView',
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

    const success = await _showAction(Number(id))

    if (success) {
      initialData.value = success
      isLoaded.value = true
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () => router.push({ name: 'GeneralRequestsList' })

  onMounted(() => loadData())

  return {
    tabs,
    isLoaded,
    tabActive,
    initialData,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    informationFormRef,
  }
}

export default useGeneralRequestsView
