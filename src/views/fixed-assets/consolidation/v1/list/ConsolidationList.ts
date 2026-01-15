// vue - pinia - quasar
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// interfaces
import { IConsolidationList } from '@/interfaces/customs/fixed-assets/v1/Consolidation'
import { IFieldFilters } from '@/interfaces/customs/Filters'

// composables
import { useRules } from '@/composables/useRules'
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'

// stores
import { useConsolidationStore } from '@/stores/fixed-assets/consolidation'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useConsolidationList = () => {
  // imports
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const { _getConsolidationList } = useConsolidationStore('v1')

  const { headerPropsDefault } = storeToRefs(useConsolidationStore('v1'))
  const { defaultIconsLucide, formatParamsCustom } = useUtils()

  // breadcrumb
  const headerPropsList = {
    title: headerPropsDefault.value.title,
    breadcrumbs: headerPropsDefault.value.breadcrumbs,
  }

  const keys = ref({
    fixed_assets: [
      'impairments',
      'impairments_business_trust',
      'impairments_types',
      'impairments_status',
    ],
    trust_business: ['business_trusts'],
  })

  const { _getResources } = useResourceManagerStore('v1')

  const {} = storeToRefs(useFixedAssetsResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { consolidation_sources, fixed_assets_types, fixed_assets_subtypes } =
    storeToRefs(useFixedAssetsResourceStore('v1'))

  // filters
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'origin',
      label: 'Fuente',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: consolidation_sources,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'type',
      label: 'Tipo activo fijo o bien',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: fixed_assets_types,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'subtype',
      label: 'Subtipo activo fijo o bien',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: fixed_assets_subtypes,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'code',
      label: 'Código englobe',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: [],
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'business_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'start_date',
      label: 'Fecha desde',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
    },
    {
      name: 'end_date',
      label: 'Fecha hasta',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
      rules: [(val: string) => useRules().max_length(val, 50)],
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = async ($filters: {
    'filter[origin]': string
    'filter[type]': string
    'filter[subtype]': string
    'filter[code]': string
    'filter[business_id]': string
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: filtersFormat.value.rows || 20,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  // table
  const tableProps = ref({
    title: 'Listado de englobe',
    loading: false,

    columns: [
      {
        name: 'code',
        label: 'Código englobe',
        align: 'left',
        field: (row: IConsolidationList) => row.id,
        sortable: true,
      },
      {
        name: 'origin',
        label: 'Fuente',
        align: 'left',
        field: (row: IConsolidationList) => row.type_source_label,
        sortable: true,
      },
      {
        name: 'type',
        label: 'Tipo activo fijo o bien',
        align: 'left',
        field: (row: IConsolidationList) =>
          `${row.fixed_assets_type.code} - ${row.fixed_assets_type.description}`,
        sortable: true,
      },
      {
        name: 'subtype',
        label: 'Subtipo activo fijo o bien',
        align: 'left',
        field: (row: IConsolidationList) =>
          `${row.fixed_assets_subtype.code} - ${row.fixed_assets_subtype.description}`,
        sortable: true,
      },
      {
        name: 'business',
        label: 'Negocio',
        align: 'left',
        field: (row: IConsolidationList) =>
          `${row.business_trust.business_code} - ${row.business_trust.name}`,
        sortable: true,
      },
      {
        name: 'date',
        label: 'Fecha englobe',
        align: 'left',
        field: (row: IConsolidationList) => row.created_at,
        sortable: true,
      },
      {
        name: 'value',
        label: 'Valor englobe',
        align: 'right',
        field: (row: IConsolidationList) => row.created_at,
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'left',
        field: (row: IConsolidationList) => row.status?.name ?? '-',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: () => null,
      },
    ] as QTable['columns'],

    rows: [] as IConsolidationList[],

    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // actions
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    const data_list = await _getConsolidationList(filters)

    tableProps.value.rows = data_list.consolidation_list
    tableProps.value.pages = {
      currentPage: data_list.consolidation_pages?.currentPage || 0,
      lastPage: data_list.consolidation_pages?.lastPage || 0,
    }
    tableProps.value.loading = false
  }

  const changeStatusAction = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)
    // await _deleteConsolidation(alertModalConfig.value.entityId as number)

    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
    openMainLoader(false)
  }

  // modals
  const alertModalRef = ref()
  const showMore = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el englobe?`
  }

  // filter more-filters
  const handleShowFilters = () => {
    showMore.value = !showMore.value
    const hiddenFilters = ['search', 'start_date', 'end_date', 'business_id']

    filterConfig.value.forEach((field) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !showMore.value
      }
    })
  }

  // lifecycles
  onMounted(async () => {
    await _getResources(keys.value)

    filtersFormat.value = {
      page: 1,
      rows: 20,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  })

  return {
    headerPropsList,
    tableProps,
    filtersFormat,
    alertModalRef,
    alertModalConfig,
    filterConfig,

    handleFilter,
    handleShowFilters,
    handleClearFilters,
    validateRouter,
    updatePage,
    updateRowsPerPage,
    listAction,
    changeStatusAction,
    openAlertModal,
    setAlertModalDescription,
  }
}

export default useConsolidationList
