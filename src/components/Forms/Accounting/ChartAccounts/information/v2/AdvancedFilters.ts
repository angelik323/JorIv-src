import { computed, ref } from 'vue'

import { useAccountingResourceStore } from '@/stores'

const useAdvancedFilters = () => {
  const {
    type_operators,
    type_nature,
    catalog_limit_types,
    catalog_limit_groups_balance,
    catalog_limit_groups_results,
    catalog_limit_groups_control,
  } = useAccountingResourceStore('v1')

  const advancedFilters = ref<{
    code_operator: string | null
    code_value: string | null
    name_operator: string | null
    name_value: string | null
    nature: string | null
    type: 'Balance' | 'Resultados' | 'Control' | null
    group: null
  }>({
    code_operator: null,
    code_value: null,
    name_operator: null,
    name_value: null,
    nature: null,
    type: null,
    group: null,
  })

  const groupOptions = computed(() => {
    const types = {
      Balance: catalog_limit_groups_balance,
      Resultados: catalog_limit_groups_results,
      Control: catalog_limit_groups_control,
    }

    if (advancedFilters.value.type) return types[advancedFilters.value.type]
  })

  const selectCodeOperator = (operator: string) => {
    advancedFilters.value.code_operator = operator
    if (!operator) advancedFilters.value.code_value = null
  }

  const selectNameOperator = (operator: string) => {
    advancedFilters.value.name_operator = operator

    if (!operator) advancedFilters.value.name_value = null
  }

  const selectType = (type: 'Balance' | 'Resultados' | 'Control' | null) => {
    advancedFilters.value.type = type
    advancedFilters.value.group = null
  }

  return {
    advancedFilters,
    type_operators,
    type_nature,
    catalog_limit_types,
    groupOptions,
    selectType,
    selectCodeOperator,
    selectNameOperator,
  }
}

export default useAdvancedFilters
