// Vue - pinia
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  IFixedVariable,
  UseFixedVariablesFormOptions,
} from '@/interfaces/customs/normative/CertifiedParameters'

// Stores
import { useNormativeResourceStore } from '@/stores/resources-manager/normative'

const useFixedVariablesForm = ({
  onAddVariable,
}: UseFixedVariablesFormOptions) => {
  const normativeResourceStore = useNormativeResourceStore('v1')
  const { fixed_variables } = storeToRefs(normativeResourceStore)

  const addVariableToEditor = (variable: IFixedVariable) => {
    const formattedVariable = {
      code: `{${variable.name}}`,
      name: variable.name,
    }

    onAddVariable?.(formattedVariable)

    return formattedVariable
  }

  const hasVariables = computed(() => {
    return fixed_variables.value.length > 0
  })

  return {
    fixed_variables,
    hasVariables,
    addVariableToEditor,
  }
}

export default useFixedVariablesForm
