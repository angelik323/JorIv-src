// vue - pinia - quasar
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { IConfigurationTypesSubtypesItemList } from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'

// composables
import { useCalendarRules } from '@/composables'
import { useUtils, useGoToUrl } from '@/composables'

// stores
import { useConfigurationTypesSubtypesStore } from '@/stores/fixed-assets/configuration-types-subtypes'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useConfigurationTypesSubtypesList = () => {
  // principal data store
  const { _getConfigurationTypesSubtypesList } =
    useConfigurationTypesSubtypesStore('v1')
  const { headerPropsDefault } = storeToRefs(useConfigurationTypesSubtypesStore('v1'))

  // resources stores
  const { code, asset_class, type } = storeToRefs(useFixedAssetsResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // composables
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { goToURL } = useGoToUrl()

  // keys para consumir recursos
  const keys = {
    fixed_assets: ['configuration_type_code', 'asset_class', 'type']
  }

  // breadcrumb
  const headerPropsList = {
    title: headerPropsDefault.value.title,
    breadcrumbs: headerPropsDefault.value.breadcrumbs
  }

  // filters
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'code',
      label: 'Código',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: code,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos'
    },
    {
      name: 'type',
      label: 'Tipo de activo o bien',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: type,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos'
    },
    {
      name: 'asset_class',
      label: 'Clase de bien',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: asset_class,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos'
    },
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      option_calendar: useCalendarRules().only_until(
        new Date().toISOString().slice(0, 10).replace(/-/g, '/')
      )
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true
    }
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = async ($filters: {
    'filter[code]': string
    'filter[type]': string
    'filter[asset_class]': string
    'filter[start_date]': string
    'filter[end_date]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: filtersFormat.value.rows || 20,
      paginate: 1
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = async () => {
    tableProps.value.rows = []
  }

  // table
  const tableProps = ref<IBaseTableProps<IConfigurationTypesSubtypesItemList>>({
    title: 'Listado de activos fijos y bienes',
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: true, required: true },
      {
        name: 'code',
        label: 'Código',
        field: 'code',
        align: 'left',
        sortable: true,
        required: true
      },
      {
        name: 'type',
        label: 'Tipo de activo / bien',
        field: 'type',
        align: 'left',
        sortable: true,
        required: true
      },
      {
        name: 'asset_class',
        label: 'Clase de bien',
        field: 'asset_class',
        align: 'left',
        sortable: true,
        required: true
      },
      { name: 'actions', label: 'Acciones', field: 'id', align: 'center' }
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 }
  })

  const updatePage = async (paginate: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      paginate: paginate
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      paginate: 1 as number,
      rows: rowsPerPage
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // actions
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    const response = await _getConfigurationTypesSubtypesList(filters)

    tableProps.value.rows = response.list
    tableProps.value.pages = response.pages
    tableProps.value.loading = false
  }

  // modals
  const alertModalRef = ref()

  // lifecycles
  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerPropsList,
    tableProps,
    filterConfig,
    alertModalRef,
    defaultIconsLucide,

    goToURL,
    handleFilter,
    updatePage,
    updateRowsPerPage,
    handleClearFilters
  }
}

export default useConfigurationTypesSubtypesList
