// Vue - pinia
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useConsolidationTreeStore } from '@/stores/accounting/consolidation-tree'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useConsolidationTreeView = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { headerPropsDefault } = storeToRefs(useConsolidationTreeStore('v1'))

  const { _getBusinessByID } = useConsolidationTreeStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const consolidationTreeId = router.currentRoute.value.params.id

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Ver árbol de consolidación',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'ConsolidationTreeView',
      },
      {
        label: consolidationTreeId.toString(),
      },
    ],
  }

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])
  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const keys = {
    accounting: ['bussines_parent'],
    trust_business: ['business_trust_statuses'],
  }

  onMounted(async () => {
    if (consolidationTreeId) {
      openMainLoader(true)
      await _getResources(keys)
      await _getBusinessByID(Number(consolidationTreeId.toString()))
      openMainLoader(false)
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    goToURL,
  }
}

export default useConsolidationTreeView
