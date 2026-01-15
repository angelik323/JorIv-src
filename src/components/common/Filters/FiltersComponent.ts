import { ref, onMounted, watch } from 'vue'
import { QInput, QSelect } from 'quasar'
import { IFieldFilters } from '@/interfaces/customs'
import { useFiltersStore } from '@/stores/filters-component'
import { storeToRefs } from 'pinia'
import { useAlert } from '@/composables/useAlert'

const useFiltersComponent = (props: any, emits: any) => {
  const { showAlert } = useAlert()
  const { filterState } = storeToRefs(useFiltersStore())

  const formFilter = ref()

  const formState = ref<IFieldFilters[] | []>([])

  const showMoreFields = ref(false)

  const showAdvancedFilters = ref(false)

  const showMoreFilters = (show: boolean) => {
    // showMoreFields.value = !showMoreFields.value
    emits('show-more', show)
  }

  const cleanFilters = () => {
    for (const key in formState.value) {
      if (filterState.value?.[key].clean_value) {
        formState.value[key].value = props.fields
          ? props.fields[key].value
          : null
      }
    }

    emits('clear-filters', null)
  }

  const getFieldComponent = (type: string) => {
    switch (type) {
      case 'q-input':
        return QInput
      case 'q-select':
        return QSelect
      case 'q-date':
        return 'q-date'
      default:
        return QInput
    }
  }

  const makeJsonFields = () => {
    return formState.value.reduce((acc: any, item: IFieldFilters) => {
      if (item.value !== null && item.value !== 0 && item.value !== '')
        acc[`filter[${item.name}]`] = item.value
      return acc
    }, {})
  }

  const updateValues = () => {
    emits('update:values', makeJsonFields())
  }

  const submitForm = () => {
    formFilter.value.validate().then((isValid: boolean) => {
      if (isValid) {
        emits('filter', makeJsonFields())
      } else {
        showAlert(
          'Diligencie los filtros correctamente',
          'error',
          undefined,
          2000
        )
      }
    })
  }

  const filterOption = (
    val: string,
    keyName: string,
    update: (cb: () => void) => void
  ) => {
    update(() => {
      const options =
        JSON.parse(
          JSON.stringify(
            filterState.value?.find((item) => item.name == keyName)?.options
          )
        ) ?? []

      if (val.length > 0) {
        const normalizedValue = val.toLowerCase()

        if (options?.length > 0) {
          const field = getFilterStateByKey(keyName)

          const opts =
            JSON.parse(
              JSON.stringify(
                field?.options
                  .filter(
                    (opt: any) =>
                      opt?.label?.toLowerCase().search(normalizedValue) > -1
                  )
                  .slice(0, 20)
              )
            ) ?? []

          const localFied = formState.value.find((item) => item.name == keyName)

          if (localFied?.name) {
            localFied.options = JSON.parse(JSON.stringify(opts))
          }
        }
      } else {
        formState.value.find((item) => {
          if (item.name == keyName) {
            item.options = options.slice(0, 20) ?? []
          }
        })
      }
    })
  }

  const getFilterStateByKey = (key: string) =>
    filterState.value?.find((item) => item.name == key)

  const closeModal = () => {
    showAdvancedFilters.value = false
  }

  const openModal = () => {
    showAdvancedFilters.value = true
  }

  const handleSearchByAdvancedFilters = (params: {
    [key: string]: string | number | null
  }) => {
    showAdvancedFilters.value = false
    emits('search-by-advanced-filters', params)
  }

  watch(
    filterState,
    (val) => {
      formState.value =
        val && val.length > 0 ? val.map((item) => ({ ...item })) : []
    },
    { deep: true }
  )

  watch(
    formState,
    () => {
      updateValues()
    },
    { deep: true }
  )

  onMounted(() => {
    formState.value = filterState.value
      ? filterState.value.map((item) => ({ ...item }))
      : []
  })

  return {
    // Data
    formFilter,
    formState,
    showMoreFields,

    // Methods
    showMoreFilters,
    cleanFilters,
    getFieldComponent,
    submitForm,
    updateValues,
    filterOption,

    //Modal advanced filters
    showAdvancedFilters,
    openModal,
    closeModal,
    handleSearchByAdvancedFilters,
  }
}

export default useFiltersComponent
