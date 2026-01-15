// core
import { onBeforeUnmount, onMounted, ref } from 'vue'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'

import {
  IConfigurationActiveCreate,
  IConfigurationActiveForm,
} from '@/interfaces/customs/fixed-assets/ConfigurationActiveNoveltyTypes'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useActiveConfigNoveltyStore } from '@/stores/fixed-assets/configuration-active-novelty-types'

const useConfigurationActiveNoveltyTypeCreate = () => {
  // hooks
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // refs
  const keys = ref({
    fixed_assets: ['affectation_type'],
  })

  const basicDataFormRef = ref()
  const novelty_form = ref<IConfigurationActiveForm | null>()

  // stores
  const fixedAssetsResourceStore = useFixedAssetsResourceStore('v1')
  const { _createActiveNovelty } = useActiveConfigNoveltyStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  // configs
  const headerProps = {
    title: 'Crear configuración de tipos de novedad activos fijos / bienes',
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
        label: 'Crear',
        route: 'ConfigurationActiveNoveltyTypesCreate',
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

  const makePayload = (): IConfigurationActiveCreate[] => {
    return novelty_form.value?.configuration_active_novelty_types || []
  }

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!novelty_form.value) return

    openMainLoader(true)
    const payload = makePayload()
    if (await _createActiveNovelty(payload)) {
      goToURL('ConfigurationActiveNoveltyTypesList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onMounted(async () => {
    await _getResources(keys.value)
    await _getResources(keys.value)
    fixedAssetsResourceStore.affectation_type = [
      ...fixedAssetsResourceStore.affectation_type,
    ]
    await _getResources(keys.value)
  })

  onBeforeUnmount(() => _resetKeys(keys.value))

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
    handleCreate,
    goToURL,
  }
}

export default useConfigurationActiveNoveltyTypeCreate
