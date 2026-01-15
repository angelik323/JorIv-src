import { IDefinitionSupportingDocumentsForm } from '@/interfaces/customs'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountingResourceStore } from '@/stores'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useUtils } from '@/composables'
import { ActionType } from '@/interfaces/global'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: IDefinitionSupportingDocumentsForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const { account_chart_structure_code_accounting } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const {
    definition_documentation_type,
    definition_documentation_module,
    definition_documentation_process,
    definition_documentation_support,
    definition_documentation_mandatory,
    definition_documentation_file_retention,
    definition_documentation_final_provision,
  } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const isSerieType = computed(() =>
    ['Serie', 'Subserie'].includes(models.value.type ?? '')
  )

  const formElementRef = ref()

  const initialModelsValues: IDefinitionSupportingDocumentsForm = {
    structure_id: null,
    structure: null,
    purpose: null,
    document_code: null,
    type: null,
    module: null,
    name: null,
    process: null,
    support: null,
    general_file_retention: null,
    mandatory: null,
    final_provision: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  watch(
    () => models.value.structure_id,
    (val) => {
      if (props.action !== 'view') {
        if (!val) {
          models.value.structure = null
          models.value.purpose = null
          return
        }

        const structure = account_chart_structure_code_accounting.value.find(
          (item) => item.value === val
        )
        if (structure) {
          models.value.structure = structure.structure ?? null
          models.value.purpose = structure.purpose ?? null
        }
      }
    }
  )

  const cleanValues = () => {
    models.value.module = null
    models.value.process = null
    models.value.support = null
    models.value.mandatory = null
    models.value.general_file_retention = null
    models.value.final_provision = null
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => isSerieType.value,
    (val) => {
      if (val) cleanValues()
    }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    isSerieType,
    account_chart_structure_code_accounting,
    definition_documentation_type,
    definition_documentation_module,
    definition_documentation_process,
    definition_documentation_support,
    definition_documentation_mandatory,
    definition_documentation_file_retention,
    definition_documentation_final_provision,
  }
}

export default useBasicDataForm
