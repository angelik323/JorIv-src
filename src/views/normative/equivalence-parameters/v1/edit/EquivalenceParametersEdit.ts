// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IEquivalenceParameterInformationForm,
  IEquivalenceParameterResponse,
  IEquivalenceParameterToEdit,
} from '@/interfaces/customs/normative/EquivalenceParameters'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useEquivalenceParametersStore } from '@/stores/normative/equivalence-parameters'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useEquivalenceParametersEdit = () => {
  const {
    _getByParameterId,
    _getConceptDetail,
    _updateEquivalenceParameter,
    _clearData,
  } = useEquivalenceParametersStore('v1')
  const { headerPropsDefault, equivalence_parameter_response } = storeToRefs(
    useEquivalenceParametersStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const router = useRouter()

  const equivalenceParameterId = Number(router.currentRoute.value.params.id)

  const isDataReady = ref(false)

  // Data de formularios
  const information_form = ref<IEquivalenceParameterInformationForm | null>(
    null
  )

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Editar parámetros de equivalencia',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'EquivalenceParametersEdit',
      },
      {
        label: equivalenceParameterId.toString(),
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

  // Information form request
  const makeInformationRequest = (
    data: IEquivalenceParameterInformationForm | null
  ) => {
    if (!data) return {}

    const request: IEquivalenceParameterToEdit = {
      format_id: Number(data.format),
      concept_id: Number(data.concept),
      concept_detail_id: String(data.concept_detail),
      concept_detail_value: String(data.concept_detail_value),
      equivalence_detail_id: Number(data.equivalence),
    }

    return cleanEmptyFields(request, true)
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeInformationRequest(information_form.value)
    const success = await _updateEquivalenceParameter(
      payload,
      equivalenceParameterId
    )
    if (success) goToURL('EquivalenceParametersList')

    openMainLoader(false)
  }

  // Seteo del formulario
  const setFormEdit = (data: IEquivalenceParameterResponse) => {
    information_form.value = {
      id: data.id,
      format: Number(data.format_id) || null,
      concept: Number(data.concept_id) || null,
      concept_detail: Number(data.concept_detail_id) || null,
      concept_detail_value: data.concept_detail_value || null,
      equivalence: Number(data.equivalence_detail_id) || null,
      equivalence_name: data.equivalence_detail_name ?? null,
    }
  }

  const initialize = async () => {
    await _getByParameterId(equivalenceParameterId)
    if (!equivalence_parameter_response.value) return

    const data = equivalence_parameter_response.value

    // Se cargan listados dependiendes del concepto
    const conceptId = Number(data.concept_id)
    if (conceptId) {
      await _getConceptDetail(conceptId)
    }

    setFormEdit(data)
    isDataReady.value = true
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
    await Promise.all([_getResources(keys), initialize()])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    isDataReady,
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

export default useEquivalenceParametersEdit
