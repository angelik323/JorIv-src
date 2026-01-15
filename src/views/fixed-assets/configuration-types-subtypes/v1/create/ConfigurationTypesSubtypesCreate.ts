// vue - quasar
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IAssetTypeForm,
  IConfigurationTypesSubtypesCreateRequest
} from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'

// composables
import { useAlert, useMainLoader, useUtils, useGoToUrl } from '@/composables'

// stores
import { useConfigurationTypesSubtypesStore } from '@/stores/fixed-assets/configuration-types-subtypes'

const useConfigurationTypesSubtypesCreate = () => {
  // composables
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  // imports stores
  const { headerPropsDefault } = storeToRefs(useConfigurationTypesSubtypesStore('v1'))
  const { _createConfigurationTypesSubtypes } = useConfigurationTypesSubtypesStore('v1')

  // breadcrumb
  const headerPropsCreate = {
    title: 'Crear configuración de activos fijos y bienes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Crear',
          route: 'ConfigurationTypesSubtypesCreate'
        }
      ]
    ]
  }

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

  const makeDataRequest = (): IConfigurationTypesSubtypesCreateRequest | null => {
    const formData = formInformation.value?.model as IAssetTypeForm | null
    if (!formData || !formData.asset_class || !formData.code || !formData.type) return null

    return {
      code: formData.code,
      type: formData.type,
      description: formData.description ?? '',
      asset_class: formData.asset_class,
      subtypes: formData.subtypes.map((subtype) => ({
        code: subtype.code!,
        description: subtype.description ?? '',
        life_span: subtype.life_span ?? 0,
        depreciation: subtype.depreciation ?? 0
      }))
    }
  }

  const goToList = () => {
    goToURL('ConfigurationTypesSubtypesList')
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    if (!payload) {
      openMainLoader(false)
      return showAlert('No hay datos para crear', 'error', undefined, 3000)
    }

    const response = await _createConfigurationTypesSubtypes(payload)

    if (response) {
      showAlert('Registro creado exitosamente', 'success', undefined, 3000)
      goToList()
    }

    openMainLoader(false)
  }

  return {
    headerPropsCreate,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,

    onSubmit,
    goToList
  }
}

export default useConfigurationTypesSubtypesCreate
