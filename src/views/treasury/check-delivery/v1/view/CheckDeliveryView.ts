// vue | quasar | router
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

// store
import { useCheckDeliveryStore } from '@/stores'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'

const useCheckDeliveryView = () => {
  const { _getByIdCheckDelivery } = useCheckDeliveryStore('v1')

  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  // props
  const informationFormRef = ref()

  const headerBreadcrumbs = {
    title: 'Entrega de cheques',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Ver entrega de cheques',
        route: 'CheckDeliveryList',
      },
      {
        label: 'Ver',
        route: '',
      },
      {
        label: id,
        route: '',
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

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // lifecycle hooks
  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdCheckDelivery(Number(id))
    openMainLoader(false)
  })

  return {
    informationFormRef,
    headerBreadcrumbs,
    filteredTabs,
    tabActiveIdx,
    tabActive,
  }
}

export default useCheckDeliveryView
