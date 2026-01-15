import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { uid } from 'quasar'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useGenericSelectorComponent = (props: any, emit: any) => {
  const valueRequest = ref([])
  const genericSelectorRef = ref()

  const selectorProperties = ref<{
    loading: boolean
    returnObject: boolean
    disable: boolean
    options: object[] | string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
    label: string
  }>({
    loading: false,
    returnObject: false,
    disable: false,
    options: [] as object[] | string[],
    value: null,
    label: props.label,
  })

  const labelClass = computed(() =>
    `${props.label_class} ${props.label_color}`.trim()
  )

  // ID único para el selector
  const inputId = computed(() => props.id || `genericSelector-${uid()}`)

  const init = async () => {
    selectorProperties.value.loading = true
    selectorProperties.value.disable = true
    valueRequest.value = []

    switch (props.entity_name) {
      case 'Specialty':
        // await _getSpecialtiesSelector()
        break
      case 'Procedures':
        if (props.filter_request) {
          // await _getProceduresSelector()
        } else if (props.without_filters) {
          // await _getProceduresSelector()
        } else {
          selectorProperties.value.disable = true
          selectorProperties.value.loading = false
        }
        break
      case 'Specialty-Report':
      case 'Professional-Report':
        if (props.filter_request) {
          if (props.entity_name === 'Professional-Report') {
            // await _getProfessionalsReportSelector()
          }
          if (props.entity_name === 'Specialty-Report') {
            // await _getSpecialtiesReportSelector()
          }
        } else {
          selectorProperties.value.disable = true
          selectorProperties.value.loading = false
        }

        break
      default:
        selectorProperties.value.disable = true
        selectorProperties.value.options = []
        if (props.manual_option?.length > 0) {
          selectorProperties.value.options = [
            ...props.manual_option,
          ] as object[]
        }
        selectorProperties.value.disable = false
        selectorProperties.value.loading = false
        break
    }

    if (props.disabled) {
      selectorProperties.value.loading = false
      selectorProperties.value.disable = true
    }

    if (props.default_value) {
      selectorProperties.value.value = props.default_value
    }
  }

  // Filter AutoComplete
  const filterOptionV1 = (val: string, update: (arg0: () => void) => void) => {
    update(() => {
      if (val.length > 0) {
        selectorProperties.value.options = []

        if (props.manual_option.length > 0) {
          if (!props.map_options) {
            selectorProperties.value.options = props.manual_option
              ?.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (v: any) => v.toLowerCase().search(val.toLowerCase()) > -1
              )
              .slice(0, 24) as string[]
          } else {
            selectorProperties.value.options = props.manual_option
              ?.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (v: any) =>
                  v[props.first_filter_option]
                    ?.toLowerCase()
                    .search(val.toLowerCase()) > -1 ||
                  v[props.second_filter_option]
                    ?.toLowerCase()
                    .search(val.toLowerCase()) > -1
              )
              .slice(0, 24) as string[]
          }
        } else {
          selectorProperties.value.options = valueRequest.value
            ?.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (v: any) =>
                v[props.first_filter_option]
                  .toLowerCase()
                  .search(val.toLowerCase()) > -1 ||
                v[props.second_filter_option]
                  .toLowerCase()
                  .search(val.toLowerCase()) > -1
            )
            .slice(0, 24) as object[]
        }
      } else if (props.manual_option.length > 0) {
        selectorProperties.value.options = props.manual_option.slice(
          0,
          24
        ) as object[]
      } else {
        selectorProperties.value.options = valueRequest.value.slice(0, 24)
      }
    })
  }
  const filterOptionV2 = (val: string, update: (cb: () => void) => void) => {
    const normalizedValue = val.toLowerCase()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterItems = (items: any[], filterFn: (item: any) => boolean) => {
      if (props.should_slice_options) {
        return items.filter(filterFn).slice(0, 24)
      }

      return items.filter(filterFn)
    }

    const createFilterFn = (optionKeys: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (item: any) =>
        optionKeys.some((key) => {
          const value = String(item[key] ?? '').toLowerCase()
          return props.match_mode === 'exact'
            ? value.startsWith(normalizedValue)
            : value.includes(normalizedValue)
        })
    }

    const handleFilter = () => {
      if (normalizedValue.length > 0) {
        selectorProperties.value.options = []

        if (props.manual_option.length > 0) {
          if (props.use_advanced_filter) {
            const filtered = filterFlow(normalizedValue, props.manual_option)
            selectorProperties.value.options = (
              props.should_slice_options ? filtered.slice(0, 24) : filtered
            ) as object[]
          } else {
            const filterFn = props.map_options
              ? createFilterFn([
                  props.first_filter_option,
                  props.second_filter_option,
                ])
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (item: any) =>
                  props.match_mode === 'exact'
                    ? item?.toLowerCase().startsWith(normalizedValue)
                    : item?.toLowerCase().includes(normalizedValue)

            selectorProperties.value.options = filterItems(
              props.manual_option,
              filterFn
            )
          }
        } else {
          if (props.use_advanced_filter) {
            const filtered = filterFlow(normalizedValue, valueRequest.value)
            selectorProperties.value.options = (
              props.should_slice_options ? filtered.slice(0, 24) : filtered
            ) as object[]
          } else {
            const filterFn = createFilterFn([
              props.first_filter_option,
              props.second_filter_option,
            ])
            selectorProperties.value.options = filterItems(
              valueRequest.value,
              filterFn
            )
          }
        }
      } else {
        const options =
          props.manual_option.length > 0
            ? props.manual_option
            : valueRequest.value
        if (props.should_slice_options) {
          selectorProperties.value.options = options.slice(0, 24)
        } else {
          selectorProperties.value.options = options
        }
      }
    }

    update(handleFilter)
  }

  const filterFlow = (normalizedValue: string, options: unknown[]) => {
    if (!normalizedValue.trim()) {
      return options
    }

    const searchParts = normalizedValue.trim().split(' ').filter(Boolean)
    const optionsList = options as Record<string, unknown>[]

    const containsAllWords = (text: string, words: string[]) => {
      return words.every((word) => text.includes(word))
    }

    const startsWithAnyWord = (text: string, words: string[]) => {
      return words.some((word) => text.startsWith(word))
    }

    const containsWordsConsecutive = (text: string, searchValue: string) => {
      return text.includes(searchValue)
    }

    const getSearchText = (item: Record<string, unknown>) => {
      return String(item['full_label'] ?? item['label'] ?? '').toLowerCase()
    }

    if (searchParts.length === 1) {
      const searchWord = searchParts[0]

      const startsWithWord = optionsList.filter((item) => {
        const searchableText = getSearchText(item)
        return searchableText.startsWith(searchWord)
      })

      const containsWord = optionsList.filter((item) => {
        const searchableText = getSearchText(item)
        return (
          searchableText.includes(searchWord) &&
          !searchableText.startsWith(searchWord)
        )
      })

      const uniqueStartsWith = Array.from(
        new Map(startsWithWord.map((item) => [item['value'], item])).values()
      )

      const uniqueContains = Array.from(
        new Map(containsWord.map((item) => [item['value'], item])).values()
      )

      return [...uniqueStartsWith, ...uniqueContains]
    }

    const itemsWithAllWords = optionsList.filter((item) => {
      const searchableText = getSearchText(item)
      return containsAllWords(searchableText, searchParts)
    })

    const startsWithConsecutive = itemsWithAllWords.filter((item) => {
      const searchableText = getSearchText(item)
      return searchableText.startsWith(normalizedValue)
    })

    const containsConsecutive = itemsWithAllWords.filter((item) => {
      const searchableText = getSearchText(item)
      return (
        containsWordsConsecutive(searchableText, normalizedValue) &&
        !searchableText.startsWith(normalizedValue)
      )
    })

    const startsWithAny = itemsWithAllWords.filter((item) => {
      const searchableText = getSearchText(item)
      const hasConsecutive = containsWordsConsecutive(
        searchableText,
        normalizedValue
      )
      return !hasConsecutive && startsWithAnyWord(searchableText, searchParts)
    })

    const notStartsWith = itemsWithAllWords.filter((item) => {
      const searchableText = getSearchText(item)
      const hasConsecutive = containsWordsConsecutive(
        searchableText,
        normalizedValue
      )
      return !hasConsecutive && !startsWithAnyWord(searchableText, searchParts)
    })

    const uniqueStartsWithConsecutive = Array.from(
      new Map(
        startsWithConsecutive.map((item) => [item['value'], item])
      ).values()
    )

    const uniqueContainsConsecutive = Array.from(
      new Map(containsConsecutive.map((item) => [item['value'], item])).values()
    )

    const uniqueStartsWith = Array.from(
      new Map(startsWithAny.map((item) => [item['value'], item])).values()
    )

    const uniqueNotStartsWith = Array.from(
      new Map(notStartsWith.map((item) => [item['value'], item])).values()
    )

    return [
      ...uniqueStartsWithConsecutive,
      ...uniqueStartsWith,
      ...uniqueContainsConsecutive,
      ...uniqueNotStartsWith,
    ]
  }

  onMounted(async () => {
    await init()

    if (genericSelectorRef.value?.$el) {
      const innerControl =
        genericSelectorRef.value.$el.querySelector('.q-field__control')

      if (innerControl) {
        innerControl.addEventListener('click', () => emit('click'))
      }
    }
  })

  onBeforeUnmount(() => {
    if (genericSelectorRef.value?.$el) {
      const innerControl =
        genericSelectorRef.value.$el.querySelector('.q-field__control')

      if (innerControl) {
        innerControl.removeEventListener('click', () => emit('click'))
      }
    }
  })

  watch(
    () => [
      props.disabled,
      props.entity_name,
      props.filter_request,
      props.map_options,
      props.manual_option,
    ],
    () => {
      init()
    }
  )

  watch(
    () => props.default_value,
    (val) => {
      selectorProperties.value.value = val
    }
  )

  return {
    // Data
    selectorProperties,
    genericSelectorRef,
    labelClass,
    inputId,

    // Methods
    filterOptionV1,
    filterOptionV2,
    setValue: (value: string | number | string[] | number[]) => {
      const valueModify = value ?? (props.multiple ? [] : value)
      emit('update:modelValue', valueModify)
    },
  }
}

export default useGenericSelectorComponent
