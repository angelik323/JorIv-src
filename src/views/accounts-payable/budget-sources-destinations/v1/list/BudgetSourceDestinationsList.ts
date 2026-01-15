// Vue - Vue Router - Pinia - Quasar
import { onBeforeUnmount, onMounted, ref, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IBudgetSourceDestination } from '@/interfaces/customs/accounts-payable/BudgetSourcesDestinations'
import { IFieldFilters, ISelectorResources } from '@/interfaces/customs/Filters'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useBudgetSourcesDestinationsStore } from '@/stores/accounts-payable/budget-sources-destinations'
import {
  useAccountsPayableResourceStore,
  useResourceManagerStore,
} from '@/stores'

const useBudgetSourceDestinationsList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const budgetSourcesDestinationsStore = useBudgetSourcesDestinationsStore('v1')
  const {
    budget_sources_destinations_list,
    budget_sources_destinations_pages,
  } = storeToRefs(budgetSourcesDestinationsStore)
  const { _listAction, _deleteAction } = budgetSourcesDestinationsStore

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    sources_destinations_modules,
    sources_destinations_code_movements,
    sources_destinations_processes,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const keys = {
    accounts_payable: [
      'sources_destinations_modules',
      'sources_destinations_processes',
      'sources_destinations_code_movements',
    ],
  }

  const movements_destinations = ref<ISelectorResources[]>([])
  const movements_origins = ref<ISelectorResources[]>([])

  const isTableEmpty = ref(true)
  const showState = ref(0)
  const showTable = ref(true)

  const rowsPerPageOptions = computed(() => {
    const defaultOptions = [20, 50, 100]
    const currentRows = filtersFormat.value.rows || 20
    if (defaultOptions.includes(currentRows)) {
      defaultOptions.indexOf(currentRows)
      return [
        currentRows,
        ...defaultOptions.filter((val) => val !== currentRows),
      ]
    }
    return defaultOptions
  })

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la fuente y destino?',
    id: null as number | null,
  })

  const filterRef = ref()

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  let moduleID: string | number | null = null

  const headerProperties = {
    title: 'Fuentes y destinos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
      },
      {
        label: 'Fuentes y destinos',
        route: 'BudgetSourceDestinationsList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'source_module',
      label: 'Módulo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: sources_destinations_modules,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'source_process',
      label: 'Proceso',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: sources_destinations_processes,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'source_reference_id',
      label: 'Fuente',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: movements_origins,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'destination_reference_id',
      label: 'Destino',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: movements_destinations,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
  ])

  const tableProperties = ref<IBaseTableProps<IBudgetSourceDestination>>({
    title: 'Listado de fuentes y destinos',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'source_module',
        required: true,
        label: 'Módulo',
        align: 'left',
        field: 'source_module',
        sortable: true,
      },
      {
        name: 'source_process_label',
        required: true,
        label: 'Proceso',
        align: 'left',
        field: 'source_process_label',
        sortable: true,
      },
      {
        name: 'source_reference_label',
        required: true,
        label: 'Fuente',
        align: 'left',
        field: 'source_reference_label',
        sortable: true,
      },
      {
        name: 'source_description',
        required: true,
        label: 'Descripción fuente',
        align: 'left',
        field: 'source_description',
        sortable: true,
      },
      {
        name: 'destination_module',
        required: true,
        label: 'Módulo',
        align: 'left',
        field: 'destination_module',
        sortable: true,
      },
      {
        name: 'destination_process_label',
        required: true,
        label: 'Proceso',
        align: 'left',
        field: 'destination_process_label',
        sortable: true,
      },
      {
        name: 'destination_reference_label',
        required: true,
        label: 'Destino',
        align: 'left',
        field: 'destination_reference_label',
        sortable: true,
      },
      {
        name: 'destination_description',
        required: true,
        label: 'Descripción destino',
        align: 'left',
        field: 'destination_description',
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const loadResource = async () => {
    openMainLoader(true)
    await _getResources({
      accounts_payable: [
        'sources_destinations_modules',
        'sources_destinations_processes',
      ],
    })

    openMainLoader(false)
  }

  const loadData = async (filters?: Record<string, string | number>) => {
    openMainLoader(true)
    tableProperties.value.rows = []

    const paramsToUse = filters || filtersFormat.value
    const params: Record<string, string | number> = {
      ...paramsToUse,
      page: Number(paramsToUse.page) || 1,
      rows: Number(paramsToUse.rows) || 20,
    }

    filtersFormat.value = {
      ...filtersFormat.value,
      ...params,
    }

    await _listAction(params)

    const hasResults = budget_sources_destinations_list.value.length > 0

    showState.value = Object.keys(paramsToUse).length > 2 ? 1 : 0
    isTableEmpty.value = !hasResults

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleFilter = async ($filters: {
    'filter[source_module]': string
    'filter[source_process]': string
    'filter[source_reference_id]': number
    'filter[destination_reference_id]': number
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await loadData(filtersFormat.value)
  }

  const handleClearFilters = () => {
    filtersFormat.value = {
      page: 1,
      rows: filtersFormat.value.rows || 20,
    }
    tableProperties.value.rows = []
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await loadData(filtersFormat.value)
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1,
      rows: rows,
    }

    showTable.value = false
    await nextTick()

    await loadData(filtersFormat.value)

    await nextTick()
    showTable.value = true
    await nextTick()
  }

  const openDeleteModal = async (id: number) => {
    alertModalConfig.value.id = id
    if (alertModalRef.value?.openModal) await alertModalRef.value.openModal()
  }

  const deleteItem = async () => {
    if (!alertModalConfig.value.id) return

    openMainLoader(true)
    await _deleteAction(alertModalConfig.value.id)
    await alertModalRef.value.closeModal()

    await loadData(filtersFormat.value)

    alertModalConfig.value.id = null
    openMainLoader(false)
  }

  const extractValue = (val: unknown): string | number | null => {
    if (!val) return null
    if (typeof val === 'object' && !Array.isArray(val)) {
      const objValue = val as { value?: string | number; id?: string | number }
      return objValue.value ?? objValue.id ?? null
    }
    return val as string | number
  }

  const updateFilterConfigOptions = async (
    fieldName: string,
    options: ISelectorResources[]
  ) => {
    await nextTick()
    const fieldIndex = filterConfig.value.findIndex((f) => f.name === fieldName)
    if (fieldIndex !== -1) {
      filterConfig.value[fieldIndex].options = [...options]
    }
  }

  const loadAndUpdateMovements = async (
    module: string | number,
    targetRef: typeof movements_origins,
    filterFieldName: string,
    type: 'source' | 'destination'
  ) => {
    await _getResources(
      { accounts_payable: ['sources_destinations_code_movements'] },
      `filter[module]=${module}&filter[type]=${type}`
    )

    targetRef.value = sources_destinations_code_movements.value
    await updateFilterConfigOptions(
      filterFieldName,
      sources_destinations_code_movements.value
    )
  }

  const onChangeFilter = async (values: Record<string, string | number>) => {
    const val = extractValue(values['filter[source_module]'])

    if (!val || val === '') {
      filterRef.value.setFieldValueByName('source_reference_id', null)
      filterRef.value.setFieldValueByName('destination_reference_id', null)
      moduleID = null
      return
    }

    if (moduleID === val) return

    moduleID = val

    await loadAndUpdateMovements(
      val,
      movements_origins,
      'source_reference_id',
      'source'
    )
    await loadAndUpdateMovements(
      val,
      movements_destinations,
      'destination_reference_id',
      'destination'
    )
  }

  onMounted(async () => {
    await loadResource()

    filterConfig.value[0].options.unshift({ label: 'Todos', value: '' })
    filterConfig.value[1].options.unshift({ label: 'Todos', value: '' })

    if (route.query.reload === 'true') await loadData({})
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    budget_sources_destinations_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = budget_sources_destinations_pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }

      isTableEmpty.value = tableProperties.value.rows.length === 0
      showState.value = isTableEmpty.value ? 0 : 1
    },
    { deep: true }
  )

  return {
    goToURL,
    showState,
    openDeleteModal,
    alertModalRef,
    alertModalConfig,
    handleFilter,
    filterConfig,
    tableProperties,
    headerProperties,
    updatePage,
    handleClearFilters,
    defaultIconsLucide,
    updateRowsPerPage,
    isTableEmpty,
    filterRef,
    onChangeFilter,
    deleteItem,
    filtersFormat,
    showTable,
    rowsPerPageOptions,
  }
}

export default useBudgetSourceDestinationsList
