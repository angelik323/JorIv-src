// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IEquivalenceParameterInformationForm,
  IEquivalenceParameterToCreate,
} from '@/interfaces/customs/normative/EquivalenceParameters'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useEquivalenceParametersStore } from '@/stores/normative/equivalence-parameters'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useEquivalenceParametersCreate = () => {
  const { _createEquivalenceParameter, _clearData } =
    useEquivalenceParametersStore('v1')
  const { headerPropsDefault } = storeToRefs(
    useEquivalenceParametersStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  // Data de formularios
  const information_form = ref<IEquivalenceParameterInformationForm | null>(
    null
  )

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear parámetros de equivalencia',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'EquivalenceParametersCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information_form',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx >= 0 && tabActiveIdx < forms.length) {
      try {
        valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  // Information form
  const makeBaseInfoRequest = (
    data: IEquivalenceParameterInformationForm | null
  ) => {
    if (!data) return {}

    const request: IEquivalenceParameterToCreate = {
      format_id: Number(data.format),
      concept_id: Number(data.concept),
      concept_detail_id: String(data.concept_detail),
      concept_detail_value: String(data.concept_detail_value),
      equivalence_detail_id: Number(data.equivalence),
    }

    return cleanEmptyFields(request, true)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IEquivalenceParameterToCreate> = {
      ...makeBaseInfoRequest(information_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createEquivalenceParameter(payload)
    if (success) goToURL('EquivalenceParametersList')

    openMainLoader(false)
  }

  const keys = {
    normative: [
      'equivalency_parameters_formats',
      'equivalency_parameters_concepts',
      'certificate_types',
    ],
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    goToURL,
    onSubmit,
  }
}

export default useEquivalenceParametersCreate
