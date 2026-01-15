// core
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// interfaces
import { ITabs } from '@/interfaces/global'
import { IConfigurationActiveForm } from '@/interfaces/customs/fixed-assets/ConfigurationActiveNoveltyTypes'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// stores
import { useActiveConfigNoveltyStore } from '@/stores/fixed-assets/configuration-active-novelty-types'

const useConfigurationActiveNoveltyTypeRead = () => {
  // hooks
  const route = useRoute()
  const id = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // refs

  const basicDataFormRef = ref()
  const novelty_form = ref<IConfigurationActiveForm | null>()

  // stores

  const { _getActiveNoveltyById } = useActiveConfigNoveltyStore('v1')

  // configs
  const headerProps = {
    title: 'Ver configuración de tipos de novedad activos fijos / bienes',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Activos fijos',
        route: '',
      },
      {
        label: 'Configuración de tipos de novedad activos fijos/bienes',
        route: 'ConfigurationActiveNoveltyTypesList',
      },
      {
        label: 'Ver',
        route: 'ConfigurationActiveNoveltyTypesView',
      },
      {
        label: `${id}`,
        route: '',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // actions

  const handleView = async () => {
    openMainLoader(true)

    goToURL('ConfigurationActiveNoveltyTypesList')

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks

  onMounted(async () => {
    openMainLoader(true)
    novelty_form.value = await _getActiveNoveltyById(id)

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    novelty_form,

    // methods
    handleView,
    goToURL,
  }
}

export default useConfigurationActiveNoveltyTypeRead
