// vue | quasar | router
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// store
import { useIsinesCodesStore, useResourceManagerStore } from '@/stores'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'

const useIsinesCodesView = () => {
  const { _getByIdIsinesCodes } = useIsinesCodesStore('v1')
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id
  const informationFormRef = ref()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // props
  const headerProps = {
    title: 'Ver Código ISIN',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Códigos ISINES',
        route: 'IsinesCodesList',
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
    router.push({ name: 'IsinesCodesList' })
  }

  // lifecycle hooks
  const keys = {
    investment_portfolio: [
      'administrators_codes',
      'titles_classes',
      'perioricities',
      'emitter_codes',
      'rate',
      'rates_behaviors',
    ],
  }
  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    await Promise.all([_getResources(keys), _getByIdIsinesCodes(Number(id))])
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

export default useIsinesCodesView
