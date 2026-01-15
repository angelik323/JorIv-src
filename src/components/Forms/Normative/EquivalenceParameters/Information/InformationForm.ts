// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { IEquivalenceParameterInformationForm } from '@/interfaces/customs/normative/EquivalenceParameters'

// Composables
import { useUtils, useMainLoader } from '@/composables'

// Stores
import { useEquivalenceParametersStore } from '@/stores/normative/equivalence-parameters'
import { useNormativeResourceStore } from '@/stores/resources-manager/normative'

const useInformationForm = (
  props: {
    action: WriteActionType
    data: IEquivalenceParameterInformationForm | null
  },
  emit: Function
) => {
  const { conceptDetailOptions, equivalenceOptions } = storeToRefs(
    useEquivalenceParametersStore('v1')
  )
  const { _getConceptDetail, _clearConceptDetailOptions } =
    useEquivalenceParametersStore('v1')

  const { equivalency_parameters_formats, equivalency_parameters_concepts } =
    storeToRefs(useNormativeResourceStore('v1'))

  const { defaultIconsLucide, isEmptyOrZero } = useUtils()
  const { openMainLoader } = useMainLoader()

  const formElementRef = ref()

  const initialModelsValues: IEquivalenceParameterInformationForm = {
    format: null,
    concept: null,
    concept_detail: null,
    concept_detail_value: null,
    equivalence: null,
    equivalence_name: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  // Sincroniza el modelo con la prop 'data'
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  // Obtiene los listados dependientes del concepto seleccionado
  watch(
    () => models.value.concept,
    async (newVal) => {
      models.value.concept_detail = null
      models.value.equivalence = null

      // Limpia los listados
      _clearConceptDetailOptions()

      if (!newVal) return

      openMainLoader(true)
      await _getConceptDetail(Number(newVal))
      openMainLoader(false)
    }
  )

  watch(
    () => models.value.concept_detail,
    (newVal) => {
      const conceptDetail = conceptDetailOptions.value.find(
        ({ value }) => value === newVal
      )

      models.value.concept_detail_value = conceptDetail
        ? String(conceptDetail.name)
        : null
    }
  )

  // Campos derivados de la equivalencia seleccionada
  watch(
    () => models.value.equivalence,
    (newVal) => {
      const equivalence = equivalenceOptions.value.find(
        ({ value }) => value === newVal
      )

      models.value.equivalence_name = equivalence?.name ?? null
    }
  )

  return {
    equivalency_parameters_formats,
    equivalency_parameters_concepts,
    conceptDetailOptions,
    equivalenceOptions,
    defaultIconsLucide,
    formElementRef,
    models,
  }
}

export default useInformationForm
