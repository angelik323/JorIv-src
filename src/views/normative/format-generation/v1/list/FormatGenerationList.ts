// Vue - pinia
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { IFormatGenerationListItem } from '@/interfaces/customs/normative/FormatGeneration'

// Composables - constants
import { useUtils, useRouteValidator, useGoToUrl } from '@/composables'
import { FORMAT_GENERATION_TYPE_OPTIONS } from '@/constants/resources/normative'

// Stores
import { useFormatGenerationStore } from '@/stores/normative/format-generation'

const useFormatGenerationList = () => {
  const { _getListAction, _clearData } = useFormatGenerationStore('v1')
  const {
    headerPropsDefault,
    format_generation_list,
    format_generation_pages,
  } = storeToRefs(useFormatGenerationStore('v1'))

  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const headerProperties = headerPropsDefault.value

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'Tipo de Formato',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Tipo de Formato',
      placeholder: 'Seleccione',
      value: null,
      options: FORMAT_GENERATION_TYPE_OPTIONS,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'Fecha de generacion',
      type: 'q-date',
      class: 'col-12 col-md-4',
      label: 'Fecha de generacion',
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      value: null,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'Portafolio',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Portafolio',
      placeholder: 'Seleccione',
      value: null,
      options: [],
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'bussiness',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Negocio',
      placeholder: 'Seleccione',
      value: null,
      options: [],
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'fic',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'FIC',
      placeholder: 'Seleccione',
      value: null,
      options: [],
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

  const tableProperties = ref<IBaseTableProps<IFormatGenerationListItem>>({
    title: 'Listado de generación de formatos',
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
        name: 'Tipo de formato',
        required: false,
        label: 'Tipo de formato',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'Fecha de generación',
        required: false,
        label: 'Fecha de generación',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'Portafolio',
        required: false,
        label: 'Portafolio',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'portafolio_description',
        required: false,
        label: 'Descripción portafolio',
        align: 'left',
        field: 'portafolio_description',
        sortable: true,
      },
      {
        name: 'last_valuation_date',
        required: false,
        label: 'Última fecha de valoración',
        align: 'left',
        field: 'last_valuation_date',
        sortable: true,
      },
      {
        name: 'business',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'business',
        sortable: true,
      },
      {
        name: 'business_name',
        required: false,
        label: 'Nombre negocio',
        align: 'left',
        field: 'business_name',
        sortable: true,
      },
      {
        name: 'last_actualization_date',
        required: false,
        label: 'Última fecha de actualización',
        align: 'left',
        field: 'last_actualization_date',
        sortable: true,
      },
      {
        name: 'fic',
        required: false,
        label: 'FIC',
        align: 'left',
        field: 'fic',
        sortable: true,
      },
      {
        name: 'fic_description',
        required: false,
        label: 'Descripción FIC',
        align: 'left',
        field: 'fic_description',
        sortable: true,
      },
      {
        name: 'last_closing_date',
        required: false,
        label: 'Última fecha de cierre',
        align: 'left',
        field: 'last_closing_date',
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
    'filter[id]': string
    'filter[status_id]': string
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

  onMounted(async () => {
    _clearData()
  })

  watch(
    format_generation_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = format_generation_pages.value
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

export default useFormatGenerationList
