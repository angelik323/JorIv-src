// Vue - Pinia
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useRules } from '@/composables/useRules'
import { useAlert } from '@/composables/useAlert'
import { useUtils } from '@/composables/useUtils'

// Interfaces
import {
  IThirdPartiesFilter,
  IThirdPartiesFilterItem,
} from '@/interfaces/customs/accounting/ThirdPartiesFilter'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useThirdPartiesFilterStore } from '@/stores/advanced-filters/accounting/third-parties'
import { IBaseTableProps } from '@/interfaces/global'

const useThirdPartiesFilter = (emits: Function) => {
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { isEmptyOrZero } = useUtils()
  const { _advancedFiltersThirdParties } = useThirdPartiesFilterStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const thirdPartiesFilterFormRef = ref()

  const keysV2 = {
    accounting: ['reporte_third_filter_type_person', 'type_operators'],
  }

  const { reporte_third_filter_type_person, type_operators } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  let perPage = 20
  const filtersFormat = ref<Record<string, string | number>>({})
  const selectedThirdparty = ref<number | null>(null)

  const filterData = ref<IThirdPartiesFilter>({
    type_person: null,
    identification_operator: null,
    identification_value: null,
    name_operator: null,
    name_value: null,
  })

  const tableProps = ref<IBaseTableProps<IThirdPartiesFilterItem>>({
    title: 'Coincidencias de terceros',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'third_party',
        required: true,
        label: 'Tercero',
        align: 'left',
        field: (row) => `${row.number_document} - ${row.name}`,
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const selectOptions = computed(() => ({
    type_operators: type_operators.value,
    type_person: reporte_third_filter_type_person.value,
  }))

  const advancedFiltersModalRef = ref()
  const openAdvancedFilters = () => advancedFiltersModalRef.value?.openModal?.()

  const validateForm = async () => {
    return thirdPartiesFilterFormRef?.value?.validate()
  }

  const handleAdvancedFilters = async () => {
    if (isEmptyOrZero(filterData.value)) {
      tableProps.value.rows = []
      tableProps.value.pages = {
        currentPage: 0,
        lastPage: 0,
      }
      selectedThirdparty.value = null
      return
    }

    if (await validateForm()) {
      openMainLoader(true)

      filtersFormat.value = {
        ...filtersFormat.value,
        'filter[type_person]': filterData.value.type_person || '',
        'filter[identification][operator]':
          filterData.value.identification_operator || '',
        'filter[identification][value]':
          filterData.value.identification_value || '',
        'filter[name][operator]': filterData.value.name_operator || '',
        'filter[name][value]': filterData.value.name_value || '',
      }

      const response = await _advancedFiltersThirdParties(filtersFormat.value)

      if (response.success) {
        tableProps.value.rows = response.thirdPartiesData.data
        tableProps.value.pages.currentPage =
          response.thirdPartiesData.current_page
        tableProps.value.pages.lastPage = response.thirdPartiesData.last_page
      }

      openMainLoader(false)
    }
  }

  const resetForm = () => {
    filterData.value = {
      type_person: null,
      identification_operator: null,
      identification_value: null,
      name_operator: null,
      name_value: null,
    }
    tableProps.value.rows = []
    tableProps.value.pages = {
      currentPage: 0,
      lastPage: 0,
    }
    filtersFormat.value = {}
    selectedThirdparty.value = null
    thirdPartiesFilterFormRef.value?.resetValidation()
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    handleAdvancedFilters()
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    handleAdvancedFilters()
  }

  const handleSelectedThirdparty = ({
    selected,
  }: {
    selected: IThirdPartiesFilterItem[]
  }) => {
    selectedThirdparty.value = selected[0]?.id || null
  }

  const onIdentificationOperatorChange = (value: string) => {
    filterData.value.identification_operator = value

    if (!value) {
      filterData.value.identification_value = null
      handleAdvancedFilters()
    }
  }

  const onNameOperatorChange = (value: string) => {
    filterData.value.name_operator = value

    if (!value) {
      filterData.value.name_value = null
      handleAdvancedFilters()
    }
  }

  const closeAdvancedFilters = () => {
    if (!selectedThirdparty.value) {
      showAlert('Debe seleccionar un tercero válido', 'warning')
      return
    }

    emits('response:selectedThirdparty', selectedThirdparty.value)
    advancedFiltersModalRef.value?.closeModal?.()
  }

  onMounted(() => {
    _getResources(keysV2, '', 'v2')
  })

  onBeforeUnmount(() => {
    _resetKeys(keysV2)
  })

  return {
    filterData,
    selectOptions,
    advancedFiltersModalRef,
    thirdPartiesFilterFormRef,
    tableProps,
    useRules,
    openAdvancedFilters,
    handleAdvancedFilters,
    resetForm,
    updatePage,
    updatePerPage,
    handleSelectedThirdparty,
    onIdentificationOperatorChange,
    onNameOperatorChange,
    closeAdvancedFilters,
  }
}
export default useThirdPartiesFilter
