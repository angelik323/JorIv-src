// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { IEquivalenceParameterListItem } from '@/interfaces/customs/normative/EquivalenceParameters'

// Composables - constants
import {
  useUtils,
  useRouteValidator,
  useGoToUrl,
  useRules,
  useMainLoader,
} from '@/composables'

// Stores
import { useEquivalenceParametersStore } from '@/stores/normative/equivalence-parameters'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useNormativeResourceStore } from '@/stores/resources-manager/normative'

const useEquivalenceParametersList = () => {
  const {
    _getListAction,
    _clearData,
    _getConceptDetail,
    _clearConceptDetailOptions,
  } = useEquivalenceParametersStore('v1')
  const {
    headerPropsDefault,
    equivalence_parameter_list,
    equivalence_parameter_pages,
    conceptDetailOptions,
    equivalenceOptions,
  } = storeToRefs(useEquivalenceParametersStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { equivalency_parameters_formats, equivalency_parameters_concepts } =
    storeToRefs(useNormativeResourceStore('v1'))

  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const headerProperties = headerPropsDefault.value

  const filterComponentRef = ref()

  const handleConceptChange = async (conceptId: number | null) => {
    filterComponentRef.value.cleanFiltersByNames([
      'concept_detail_id',
      'equivalence_detail_id',
    ])
    // Limpia los listados
    _clearConceptDetailOptions()
    if (!conceptId) return

    openMainLoader(true)
    await _getConceptDetail(Number(conceptId))
    openMainLoader(false)
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'format_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Formato',
      placeholder: 'Seleccione',
      value: null,
      options: equivalency_parameters_formats,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'concept_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Concepto',
      placeholder: 'Seleccione',
      value: null,
      options: equivalency_parameters_concepts,
      clean_value: true,
      autocomplete: true,
      disable: false,
      onChange: handleConceptChange,
    },
    {
      name: 'search',
      type: 'q-input',
      class: 'col-12 col-md-4',
      label: 'Buscador',
      placeholder: 'Buscar por código',
      prepend_icon: defaultIconsLucide.magnify,
      value: null,
      clean_value: true,
      disable: false,
      rules: [(val: string) => useRules().max_length(val, 50)],
    },
    {
      name: 'concept_detail_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Detalle concepto',
      placeholder: 'Seleccione',
      value: null,
      options: conceptDetailOptions,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'equivalence_detail_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Equivalencia',
      placeholder: 'Seleccione',
      value: null,
      options: equivalenceOptions,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const tableProperties = ref<IBaseTableProps<IEquivalenceParameterListItem>>({
    title: 'Listado de parámetros equivalencias transmisiones',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'format',
        required: false,
        label: 'Formato',
        align: 'left',
        field: 'format_name',
        sortable: true,
      },
      {
        name: 'concept',
        required: false,
        label: 'Concepto',
        align: 'left',
        field: 'concept_name',
        sortable: true,
      },
      {
        name: 'concept_detail',
        required: false,
        label: 'Detalle concepto',
        align: 'left',
        field: 'concept_detail_value',
        sortable: true,
      },
      {
        name: 'equivalence',
        required: false,
        label: 'Equivalencia',
        align: 'left',
        field: 'equivalence_detail_name',
        sortable: true,
      },
      {
        name: 'equivalence_name',
        required: false,
        label: 'Descripción equivalencia',
        align: 'left',
        field: 'equivalence_detail_name',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getListAction(filters)
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[format_id]': string
    'filter[concept_id]': string
    'filter[concept_detail_id]': string
    'filter[equivalence_detail_id]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
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
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    equivalence_parameter_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = equivalence_parameter_pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    defaultIconsLucide,
    headerProperties,
    tableProperties,
    filterComponentRef,
    filterConfig,
    validateRouter,
    goToURL,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
  }
}

export default useEquivalenceParametersList
