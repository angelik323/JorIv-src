// Vue - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBudgetBalanceQueryList } from '@/interfaces/customs/budget/BudgetBalanceQuery'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useRules } from '@/composables/useRules'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useBudgetBalanceQueryStore } from '@/stores/budget/budget-balance-query'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import {
  useAccountingResourceStore,
  useResourceManagerStore,
} from '@/stores/resources-manager'

const useBudgetBalanceQueryList = () => {
  const { is_required, only_number, max_length, min_value, max_value } =
    useRules()
  const { openMainLoader } = useMainLoader()
  const { formatCurrency } = useUtils()

  const {
    areas_responsability_operation_details: areasResourceSelector,
    budget_resource_operation_details: budgetResourceSelector,
    budget_item_operation_details: budgetItemSelector,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const { business_trusts_all_permission: businessResourceSelector } =
    storeToRefs(useAccountingResourceStore('v1'))

  const { _listAction, _exportExcelAction } = useBudgetBalanceQueryStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const isTableEmpty = ref(true)
  const hideFilters = ref(true)
  const filtersRef = ref()
  const showState = ref(0)

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const keys = {
    budget: [
      'areas_responsability_operation_details',
      'budget_resource_operation_details',
      'budget_item_operation_details',
    ],
  }

  const keysClean = {
    budget: [
      'areas_responsability_operation_details',
      'budget_resource_operation_details',
      'budget_item_operation_details',
    ],
    accounting: ['business_trusts_all_permission'],
  }

  const headerProps = {
    title: 'Consulta de saldos presupuestales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuesto',
      },
      {
        label: 'Consulta de saldos presupuestales',
        route: 'BudgetBalanceQueryList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: businessResourceSelector,
      hide: false,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val)],
    },
    {
      name: 'vigencia',
      label: 'Vigencia*',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      hide: false,
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string) =>
          min_value(val, 2000, 'La vigencia no puede ser menor al año 2000'),
        (val: string) => max_length(val, 4),
        (val: string) => only_number(val),
        (val: string) => is_required(val),
      ],
    },
    {
      name: 'from_month',
      label: 'Desde mes*',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      hide: false,
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string) => max_length(val, 2),
        (val: string) => max_value(val, 12),
        (val: string) => min_value(val, 1),
        (val: string) => only_number(val),
        (val: string) => is_required(val),
      ],
    },
    {
      name: 'to_month',
      label: 'Hasta mes*',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      hide: false,
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string) => max_length(val, 2),
        (val: string) => max_value(val, 12),
        (val: string) => min_value(val, 1),
        (val: string) => only_number(val),
        (val: string) => is_required(val),
      ],
    },
    {
      name: 'budget_item_id',
      label: 'Rubro presupuestal',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: budgetItemSelector,
      hide: true,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
    {
      name: 'budget_resource_id',
      label: 'Recurso',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: budgetResourceSelector,
      hide: true,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
    {
      name: 'areas_responsibility_id',
      label: 'Área',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: areasResourceSelector,
      hide: true,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
  ])

  const tableProps = ref<IBaseTableProps<IBudgetBalanceQueryList>>({
    title: 'Listado de saldos por nivel',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'center',
        label: '#',
        field: 'id',
      },
      {
        name: 'level',
        align: 'left',
        label: 'Nivel',
        field: 'level',
        sortable: true,
      },
      {
        name: 'budget_item_id',
        align: 'left',
        label: 'Rubro presupuestal',
        field: 'budget_item_code',
        sortable: true,
      },
      {
        name: 'budget_item_description',
        align: 'left',
        label: 'Descripción rubro presupuestal',
        field: 'budget_item_description',
        sortable: true,
      },
      {
        name: 'budget_resource_id',
        align: 'left',
        label: 'Recurso',
        field: 'budget_resource_code',
        sortable: true,
      },
      {
        name: 'budget_resource_description',
        align: 'left',
        label: 'Descripción recurso',
        field: 'budget_resource_description',
        sortable: true,
      },
      {
        name: 'areas_responsibility_id',
        align: 'left',
        label: 'Área',
        field: 'areas_responsibility_code',
        sortable: true,
      },
      {
        name: 'areas_responsibility_description',
        align: 'left',
        label: 'Descripción área',
        field: 'areas_responsibility_description',
        sortable: true,
      },
      {
        name: 'Acumulado',
        align: 'left',
        label: 'Acumulado',
        field: (row) => formatCurrency(row.acumulado ?? 0),
        sortable: true,
      },
      {
        name: 'Saldo',
        align: 'left',
        label: 'Saldo',
        field: (row) => formatCurrency(row.saldo ?? 0),
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources(
      { accounting: ['business_trusts_all_permission'] },
      'filter[can]=true',
      'v2'
    )
    await _getResources(keys)

    setTimeout(() => openMainLoader(false), 1000)
  }

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    const response = await _listAction(filters)

    if (response) {
      tableProps.value.rows = response.list
      tableProps.value.pages = response.pages
    }

    isTableEmpty.value = tableProps.value.rows.length === 0
    showState.value = filters ? 1 : 0

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleFilter = async ($filters: {
    'filter[areas_responsibility_id]': string
    'filter[budget_resource_id]': string
    'filter[business_trust_id]': string
    'filter[budget_item_id]': string
    'filter[from_month]': number
    'filter[vigencia]': number
    'filter[to_month]': number
  }) => {
    filtersFormat.value = {
      'filter[areas_responsibility_id]':
        $filters['filter[areas_responsibility_id]'],
      'filter[budget_resource_id]': $filters['filter[budget_resource_id]'],
      'filter[budget_item_id]': $filters['filter[budget_item_id]'],
      business_trust_id: $filters['filter[business_trust_id]'],
      from_month: $filters['filter[from_month]'],
      vigencia: $filters['filter[vigencia]'],
      to_month: $filters['filter[to_month]'],
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await loadData(filtersFormat.value)
  }

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value

    let index = 0
    for (const filter of filterConfig.value) {
      if (index >= 4) filter.hide = hideFilters.value
      index++
    }
  }

  const handleClearFilters = () => {
    showState.value = 0
    isTableEmpty.value = true
    tableProps.value.rows = []
  }

  const exportExcel = async () => await _exportExcelAction(filtersFormat.value)

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    await loadData(filtersFormat.value)
  }

  const handleUpdatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value)
  }

  onMounted(async () => await loadResources())

  onBeforeUnmount(() => _resetKeys(keysClean))

  return {
    showState,
    tableProps,
    filtersRef,
    headerProps,
    exportExcel,
    filterConfig,
    handleFilter,
    isTableEmpty,
    handleUpdatePage,
    handleClearFilters,
    handleUpdatePerPage,
    handleShowMoreFilters,
  }
}

export default useBudgetBalanceQueryList
