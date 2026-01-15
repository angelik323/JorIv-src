import { ref, onMounted, watch } from 'vue'
import { QInput, QSelect } from 'quasar'
import {
  IFieldFilters,
  IFilterProps,
  IGenericResource,
} from '@/interfaces/customs'
import { useAlert } from '@/composables/useAlert'

const useFiltersComponent = (props: IFilterProps, emits: Function) => {
  const { showAlert } = useAlert()

  const formFilter = ref()

  const formState = ref<IFieldFilters[] | []>([])

  const showMoreFields = ref(false)

  const showAdvancedFilters = ref(false)

  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  const showMoreFilters = (show: boolean) => {
    emits('show-more', show)
  }

  const cleanFilters = () => {
    if (props.filtersLocked) return

    for (const key in formState.value) {
      if (props.fields?.[key].clean_value) {
        formState.value[key].value = props.fields
          ? props.fields[key].value
          : null
      }
    }

    formFilter.value?.reset()

    emits('clear-filters', null)
  }

  const cleanFiltersByNames = (fieldNames: string[]) => {
    if (!Array.isArray(fieldNames)) return

    for (const name of fieldNames) {
      const field = formState.value.find((f) => f.name === name)
      if (field?.clean_value) field.value = null
    }
  }

  const enableFieldByName = (name: string, disable: boolean) => {
    const field = formState.value.find((f) => f.name === name)
    if (field) {
      field.disable = disable
    }
  }

  const setFieldValueByName = (name: string, value: string | number) => {
    const field = formState.value.find((f: IFieldFilters) => f.name === name)
    if (field) {
      field.value = value
    }
  }

  const getFieldComponent = (type: string) => {
    switch (type) {
      case 'q-input':
        return QInput
      case 'q-select':
        return QSelect
      case 'q-date':
        return 'q-date'
      case 'q-option-group':
        return 'q-option-group'
      case 'q-checkbox':
        return 'q-checkbox'
      default:
        return QInput
    }
  }

  const makeJsonFields = () => {
    return formState.value.reduce(
      (acc: Record<string, string | number>, item: IFieldFilters) => {
        if (
          item.value !== null &&
          item.value !== 0 &&
          item.value !== '' &&
          !item.readonly
        )
          acc[`filter[${item.name}]`] =
            item.multiple && !item.separate_values
              ? `[${item.value.join(',')}]`
              : item.value
        return acc
      },
      {}
    )
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

  /**
   * Creates a predicate function to filter an array of options based on a search value.
   *
   * The returned function checks whether at least one of the specified keys
   * of an item contains the normalized search value.
   *
   * @param normalizedValue - Lowercased and normalized string used for filtering.
   * @param optionKeys - List of object keys to be evaluated during filtering. Defaults to ['label'].
   *
   * @returns A predicate function that returns `true` when an item matches
   *          the filtering criteria.
   */
  const createFilterFn = (
    normalizedValue: string,
    optionKeys: string[] = ['label']
  ) => {
    return (item: IGenericResource & Record<string, string | number>) =>
      optionKeys.some((key) => {
        const value = String(item[key] ?? '').toLowerCase()
        return value.includes(normalizedValue)
      })
  }

  const filterOption = (
    val: string,
    keyName: string,
    update: (cb: () => void) => void
  ) => {
    update(() => {
      const field = getFilterStateByKey(keyName)

      if (
        field?.remote === true &&
        field.onChange &&
        typeof field.onChange === 'function'
      ) {
        const onChangeFn = field.onChange

        if (searchTimeout) clearTimeout(searchTimeout)

        searchTimeout = setTimeout(async () => {
          await onChangeFn(val ?? '')
        }, 400)

        return
      }

      const options = field?.options as
        | Array<IGenericResource & Record<string, string | number>>
        | undefined

      if (val.length > 0 && options && options.length > 0) {
        const normalizedValue = val.toLowerCase()

        const filteredOptions = options
          .filter(createFilterFn(normalizedValue, field?.filter_options))
          .slice(0, 20)

        const localFied = formState.value.find((item) => item.name == keyName)

        if (localFied?.name) {
          localFied.options = JSON.parse(JSON.stringify(filteredOptions))
        }
      } else {
        formState.value.find((item) => {
          if (item.name == keyName) {
            item.options = options?.slice(0, 20) ?? []
          }
        })
      }
    })
  }

  const getFilterStateByKey = (key: string) =>
    props.fields?.find((item: IFieldFilters) => item.name == key)

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
    props.fields,
    (val) => {
      if (val && val.length > 0) {
        const currentValues = formState.value.reduce(
          (acc: Record<string, string | number>, item: IFieldFilters) => {
            acc[item.name] = item.value
            return acc
          },
          {}
        )

        const newFormState = val.map((item: IFieldFilters) => ({
          ...item,
          value:
            currentValues[item.name] !== undefined && !item.isForceValue
              ? currentValues[item.name]
              : item.value,
        }))

        const changed =
          JSON.stringify(formState.value) !== JSON.stringify(newFormState)

        if (changed) {
          formState.value = newFormState
        }
      } else {
        formState.value = []
      }
    },
    { deep: true }
  )

  watch(
    formState,
    () => {
      if (!props.trigger_event_by_field) updateValues()
    },
    { deep: true }
  )

  watch(
    () => formState.value.map((f) => f.value),
    (newValues, oldValues) => {
      newValues.forEach((v, i) => {
        if (
          v !== oldValues[i] &&
          formState.value[i].onChange &&
          typeof formState.value[i].onChange === 'function'
        ) {
          formState.value[i].onChange(v, `filter[${formState.value[i].name}]`)
        }
      })
    }
  )

  onMounted(() => {
    formState.value = props.fields
      ? props.fields.map((item: IFieldFilters) => ({ ...item }))
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
    cleanFiltersByNames,
    enableFieldByName,
    setFieldValueByName,
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
