// vue | quasar | router
import { QTable } from 'quasar'
import { ref, watch } from 'vue'

// store
import { storeToRefs } from 'pinia'
import { useQualificationsMaintenanceStore } from '@/stores'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { IQualificationsMaintenance } from '@/interfaces/customs'
import { useRouteValidator } from '@/composables'

const useQualificationsMaintenanceList = () => {
  const { validateRouter } = useRouteValidator()
  const { _getListAction } = useQualificationsMaintenanceStore('v1')
  const { qualifications_list, qualifications_pages } = storeToRefs(
    useQualificationsMaintenanceStore('v1')
  )

  // props
  const headerProps = {
    title: 'Mantenimiento calificación emisor',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
        route: '',
      },
      {
        label: 'Mantenimiento calificación emisor',
        route: 'QualificationsMaintenanceList',
      },
    ],
  }
  const tableProps = ref({
    title: 'Listado de emisores',
    loading: false,
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
        name: 'document_third',
        required: false,
        label: 'Identificación',
        align: 'left',
        field: 'document_third',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'emitter_type',
        required: true,
        label: 'Tipo emisor',
        align: 'left',
        field: 'emitter_type',
        sortable: true,
      },
      {
        name: 'rating_agency',
        required: true,
        label: 'Calificadora',
        align: 'left',
        field: 'rating_agency',
        sortable: true,
      },
      {
        name: 'history_issuers_counter_party',
        required: true,
        label: 'Última actualización',
        align: 'left',
        field: (row) => row.history_issuers_counter_party.updated_at,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IQualificationsMaintenance[],
    pages: qualifications_pages,
  })

  // filter
  const filterConfig = ref([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
      prepend_icon: defaultIconsLucide.magnify,
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  // handlers / actions
  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }
  const listAction = async (filters: string = '', page = 1) => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getListAction(filters, page)
    tableProps.value.loading = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }
  const updateRows = (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      per_page: rows,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  // watchers
  watch(
    () => qualifications_list.value,
    () => {
      tableProps.value.rows = qualifications_list.value
      tableProps.value.pages = qualifications_pages.value
    }
  )

  return {
    filtersFormat,
    filterConfig,
    headerProps,
    tableProps,
    handleClearFilters,
    handleFilter,
    updatePage,
    updateRows,
    validateRouter,
  }
}

export default useQualificationsMaintenanceList
