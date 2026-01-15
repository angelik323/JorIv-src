// vue - router - quasar
import { ref, onBeforeUnmount, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { ITypeCommissionsInformationFormV2 } from '@/interfaces/customs/settlement-commissions/TypeCommissionsV2'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTypeCommissionsStore } from '@/stores/settlement-commissions/type-commissions'

const useTypeCommissionsCreate = () => {
  const { _createTypeCommissions, _clearData } = useTypeCommissionsStore('v2')
  const { headerPropsDefault } = storeToRefs(useTypeCommissionsStore('v2'))

  // Data de formularios
  const data_information_form = ref<ITypeCommissionsInformationFormV2 | null>(
    null
  )

  // Referencias a formularios
  const informationFormRef = ref()

  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    settlement_commissions: [
      'commission_class_catalogs',
      'commission_type_catalogs',
    ],
  }

  const headerProperties = {
    title: 'Crear tipo de comisión',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'TypeCommissionsCreate',
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
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: ITypeCommissionsInformationFormV2 | null
  ) => {
    if (!data) return {}

    const request: Partial<ITypeCommissionsInformationFormV2> = {
      description: data.description ?? null,
      commission_class_catalog_id: data.commission_class_catalog_id ?? null,
      commission_type_catalog_id: data.commission_type_catalog_id ?? null,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ITypeCommissionsInformationFormV2> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createTypeCommissions(payload)
    if (success) {
      goToURL('CommissionTypesList')
    }
    openMainLoader(false)
  }

  const isFormValid = computed(() => {
    return Boolean(
      data_information_form.value?.description &&
        data_information_form.value?.commission_class_catalog_id &&
        data_information_form.value?.commission_type_catalog_id
    )
  })

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    data_information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    isFormValid,

    onSubmit,
    goToURL,
  }
}

export default useTypeCommissionsCreate
