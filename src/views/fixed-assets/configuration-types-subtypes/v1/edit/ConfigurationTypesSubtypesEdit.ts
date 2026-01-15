// vue - quasar
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IAssetTypeForm,
  IAssetTypeRequest,
  IAssetTypeResponse
} from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'

// composables
import { useAlert, useMainLoader, useUtils, useGoToUrl } from '@/composables'

// stores
import { useConfigurationTypesSubtypesStore } from '@/stores/fixed-assets/configuration-types-subtypes'

const useConfigurationTypesSubtypesEdit = () => {
  // principal data store
  const { _getByIdConfigurationTypesSubtypes, _updateConfigurationTypesSubtypes } =
    useConfigurationTypesSubtypesStore('v1')
  const { headerPropsDefault } = storeToRefs(useConfigurationTypesSubtypesStore('v1'))

  // composables
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  // router
  const route = useRoute()
  const searchId = +route.params.id

  // breadcrumb
  const headerPropsEdit = {
    title: 'Editar configuración de activos fijos y bienes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Editar',
          route: 'ConfigurationTypesSubtypesEdit'
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

  const validateForms = async () => {
    try {
      return (await formInformation.value?.validateForm()) ?? false
    } catch {
      return false
    }
  }

  const makeDataRequest = (): IAssetTypeRequest | null => {
    const formData = formInformation.value?.model as IAssetTypeForm | null
    const deleted = (formInformation.value?.deletedSubtypes as number[]) ?? []

    if (!formData) return null

    return {
      code: formData.code!,
      type: formData.type!,
      description: formData.description ?? '',
      asset_class: formData.asset_class!,
      subtypes: [
        ...formData.subtypes.map((subtype) => ({
          ...(subtype.id ? { id: subtype.id } : {}),
          code: subtype.code!,
          description: subtype.description ?? '',
          life_span: subtype.life_span ?? 0,
          depreciation: subtype.depreciation ?? 0
        })),
        ...deleted.map((id) => ({
          id: id,
          delete: true as const
        }))
      ]
    }
  }

  const onSubmit = async () => {
    if (!(await validateForms()))
      return showAlert(
        'Formulario incompleto. ¡Rellene todos los campos y documentos!',
        'error',
        undefined,
        3000
      )

    openMainLoader(true)

    const payload = makeDataRequest()
    if (!payload) {
      openMainLoader(false)
      return showAlert('No hay datos para actualizar', 'error', undefined, 3000)
    }

    const response = await _updateConfigurationTypesSubtypes(searchId, payload)

    if (response) {
      goToList()
    }

    openMainLoader(false)
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
    headerPropsEdit,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    configuration_types_subtypes_response,

    onSubmit,
    goToList
  }
}

export default useConfigurationTypesSubtypesEdit
