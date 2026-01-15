// Vue
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

// Composables
import { useMainLoader } from '@/composables'

// Utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import { IFiduciaryTrust } from '@/interfaces/customs/trust-business/FiduciaryTrust'
import { ITabs } from '@/interfaces/global/Tabs'

// Stores
import { useFiduciaryTrustStore } from '@/stores/trust-business/fiduciary-trust'

import router from '@/router'

const useFiduciaryTrustRead = () => {
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { _showAction } = useFiduciaryTrustStore('v1')

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const initialData = ref<IFiduciaryTrust>({
    id: 0,
    name: '',
    business_trust_id: 0,
    real_estate_project_id: 0,
    stage_id: 0,
    currency: '',
    status_id: 0,
    investment_fund_id: 0,
  })

  const headerProps = {
    title: 'Ver encargo fiduciario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Encargos fiduciarios',
        route: 'FiduciaryTrustList',
      },
      {
        label: 'Ver',
        route: 'FiduciaryTrustRead',
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

  const handleGoToList = () =>
    router.push({ name: 'FiduciaryTrustList', query: { reload: 'true' } })

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

export default useFiduciaryTrustRead
