// vue - quasar
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/global'
import { IAssetTypeResponse } from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// stores
import { useConfigurationTypesSubtypesStore } from '@/stores/fixed-assets/configuration-types-subtypes'

const useConfigurationTypesSubtypesRead = () => {
  // principal data store
  const { _getByIdConfigurationTypesSubtypes } =
    useConfigurationTypesSubtypesStore('v1')
  const { headerPropsDefault } = storeToRefs(
    useConfigurationTypesSubtypesStore('v1')
  )

  // composables
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  // route
  const route = useRoute()
  const searchId = +route.params.id

  // breadcrumb
  const headerPropsRead = {
    title: 'Ver configuración de activos fijos y bienes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Ver',
          route: 'ConfigurationTypesSubtypesRead'
        },
        {
          label: `${searchId}`
        }
      ]
    ]
  }

  const configuration_types_subtypes_response = ref<IAssetTypeResponse | null>(null)

  // form refs
  const formInformation = ref()

  // tabs
  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false
    }
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = ref(0)

  const onSubmit = async () => {
    openMainLoader(true)
    goToList()
    openMainLoader(false)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const goToList = () => {
    goToURL('ConfigurationTypesSubtypesList')
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    const response = await _getByIdConfigurationTypesSubtypes(searchId)
    configuration_types_subtypes_response.value = response
    openMainLoader(false)
  })

  return {
    headerPropsRead,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    configuration_types_subtypes_response,

    onSubmit,
    goToList
  }
}

export default useConfigurationTypesSubtypesRead
