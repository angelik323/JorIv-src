// vue | quasar | router
import { useRouter, useRoute } from 'vue-router'
import { ref, onBeforeMount } from 'vue'

// stores
import { usePermissionUserPorfolioStore } from '@/stores'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'

const usePermissionUserPorfolioView = () => {
  const { _getByIdPermissionUserPorfolio } =
    usePermissionUserPorfolioStore('v1')
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  // props
  const informationFormRef = ref()
  const headerProps = {
    title: 'Ver permisos de usuario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Permisos por portafolio',
        route: 'PermissionUserPorfolioList',
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
    router.push({ name: 'PermissionUserPorfolioList' })
  }
  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdPermissionUserPorfolio(Number(id))
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

export default usePermissionUserPorfolioView
