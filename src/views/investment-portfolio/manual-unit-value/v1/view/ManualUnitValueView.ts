// vue | quasar | router
import { ref, onBeforeMount, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// store
import { useManualUnitValueStore, useResourceManagerStore } from '@/stores'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'

const useManualUnitValueView = () => {
  const { _getByIdManualUnitValue } = useManualUnitValueStore('v1')
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const route = useRoute()
  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  // pros
  const informationFormRef = ref()

  const headerProps = {
    title: 'Ver registro manual valor unidad',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Registro manual valor unidad',
        route: 'ManualUnitValueView',
      },
      {
        label: 'Ver',
      },
      {
        label: id,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
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

  // handlers / actions
  const onClose = async () => {
    router.push({ name: 'ManualUnitValueList' })
  }

  // lifecycle hooks
  const keys = { investment_portfolio: ['emitter', 'actions'] }
  onUnmounted(async () => {
    _resetKeys(keys)
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    Promise.all([_getByIdManualUnitValue(Number(id)), _getResources(keys)])
    openMainLoader(false)
  })

  return {
    informationFormRef,
    tabActiveIdx,
    headerProps,
    tabActive,
    tabs,
    onClose,
  }
}

export default useManualUnitValueView
