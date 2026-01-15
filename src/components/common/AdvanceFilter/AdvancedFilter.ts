import { IFilterData } from '@/interfaces/customs'
import { useAdvancedFiltersStore } from '@/stores/advanced-filters'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref, watch } from 'vue'

export const useAdvanceFilterComponent = (props: any, emit: Function) => {
  const { getAdvancedFilters } = useAdvancedFiltersStore()
  const { advancedFilters } = storeToRefs(useAdvancedFiltersStore())

  const filterData = reactive<IFilterData>({
    name: null,
    selector: null,
    type: null,
    value: null,
  })

  const filtersSelected = ref<IFilterData[]>([])

  const addFilter = () => {
    const name = advancedFilters.value.find(
      (item) => item.value === filterData.selector
    )?.label

    if (name) {
      filterData.name = name
      if (
        !filtersSelected.value.some(
          (filter) => filter.selector === filterData.selector
        )
      ) {
        filtersSelected.value.push({ ...filterData })
      }
    }
  }

  const deleteFilterSelected = (selector: string | null) => {
    filtersSelected.value = filtersSelected.value.filter(
      (filter) => filter.selector !== selector
    )
  }

  const handleCleanFilters = () => {
    filtersSelected.value = []
    filterData.selector = null
    filterData.name = null
    filterData.type = null
    filterData.value = null
  }

  const handleSearch = () => {
    const params: { [key: string]: string | number | null } = {}

    if (filtersSelected.value.length > 0) {
      filtersSelected.value.forEach((filter) => {
        if (filter.selector !== null) {
          params[`filter[${String(filter.selector)}]`] =
            filter.type === 'boolean'
              ? String(Number(filter.value) * 1)
              : filter.value ?? ''
        }
      })

      emit('onSearch', params)
    }
  }

  onMounted(() => {
    getAdvancedFilters(props.module)
  })

  watch(
    () => filterData.selector,
    () => {
      const type = advancedFilters.value.find(
        (item) => item.value === filterData.selector
      )?.type

      if (type) {
        filterData.type = type
        filterData.value = null
      }
    }
  )
  return {
    advancedFilters,
    filterData,
    filtersSelected,
    addFilter,
    deleteFilterSelected,
    handleSearch,
    handleCleanFilters,
  }
}
