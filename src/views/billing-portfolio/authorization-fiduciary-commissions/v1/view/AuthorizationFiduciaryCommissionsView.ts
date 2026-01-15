import { ref, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader } from '@/composables'

// Stores
import { useAuthorizationFiduciaryCommissionsStore } from '@/stores'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Components
import InformationForm from '@/components/Forms/BillingPortfolio/AuthorizationFiduciaryCommissions/Information/InformationForm.vue'

const useAuthorizationFiduciaryCommissionsView = () => {
  const route = useRoute()
  const router = useRouter()

  const { _getCommissionById } = useAuthorizationFiduciaryCommissionsStore('v1')
  const { commission } = storeToRefs(
    useAuthorizationFiduciaryCommissionsStore('v1'),
  )

  const { openMainLoader } = useMainLoader()

  const commissionId = +route.params.id

  const headerConfig = {
    title: 'Ver detalle de la comisión fiduciaria',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Facturación y cartera',
        route: '',
      },
      {
        label: 'Ver detalle de la comisión fiduciaria',
        route: 'AuthorizationFiduciaryCommissionsView',
      },
      {
        label: String(commissionId),
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const activeTab = ref<string>(tabs.value[0].name)

  const activeTabIdx = computed<number>(() =>
    tabs.value.findIndex((tab) => tab.name === activeTab.value),
  )

  const informationFormRef = ref<InstanceType<typeof InformationForm> | null>(
    null,
  )

  const handleBackToListView = () => {
    router.push({ name: 'AuthorizationFiduciaryCommissionsList' })
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getCommissionById(commissionId)
    openMainLoader(false)
  })

  return {
    headerConfig,
    tabs,
    activeTab,
    activeTabIdx,
    informationFormRef,
    commission,

    handleBackToListView,
  }
}

export default useAuthorizationFiduciaryCommissionsView
