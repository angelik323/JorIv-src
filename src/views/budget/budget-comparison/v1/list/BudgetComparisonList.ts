// Vue
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Interfaces
import {
  IBudgetComparisonList,
  IBudgetComparisonValidity,
} from '@/interfaces/customs/budget/BudgetComparison'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useMainLoader, useRules, useUtils } from '@/composables'
// Stores
import { useBudgetResourceStore, useResourceManagerStore } from '@/stores'
import { useBudgetComparisonModuleStore } from '@/stores/budget/budget-comparison'
import { storeToRefs } from 'pinia'

const useBudgetComparisonList = () => {
  const { is_required, only_number, max_length } = useRules()
  const { openMainLoader } = useMainLoader()
  const { formatCurrency } = useUtils()
  const {
    business_trusts_with_budget_documents,
    budget_item_codes_source_destination,
    areas_resposabilities_codes,
    budget_resource_codes,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Store de comparativo presupuestal
  const { _listAction, _downloadExcelAction, _downloadPdfAction } =
    useBudgetComparisonModuleStore('v1')
  const { budget_comparison_list, budget_comparison_pages } = storeToRefs(
    useBudgetComparisonModuleStore('v1')
  )

  const BudgetKeys = [
    'business_trusts_with_budget_documents',
    'budget_item_codes',
    'areas_resposabilities_codes',
    'budget_resource_codes',
  ]

  onMounted(async () => {
    _getResources({ budget: BudgetKeys })
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
  })
  const isTableEmpty = ref(true)
  const showState = ref(0)
  const vigenciaAnteriorValue = ref<string | number | null>(null)
  const vigenciaActualValue = ref<string | number | null>(null)

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const headerProps = {
    title: 'Comparativo presupuestal',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuesto',
      },
      {
        label: 'Comparativo presupuestal',
        route: 'BudgetComparisonList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_with_budget_documents,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val)],
    },
    {
      name: 'validity_range][validity_previous',
      label: 'Vigencia anterior*',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string) => max_length(val, 4),
        (val: string) => only_number(val),
        (val: string) => is_required(val),
      ],
    },
    {
      name: 'validity_range][validity_current',
      label: 'Vigencia actual*',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string) => max_length(val, 4),
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
      options: budget_item_codes_source_destination,
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
      options: budget_resource_codes,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
    {
      name: 'area_responsability_id',
      label: 'Área',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: areas_resposabilities_codes,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
  ])

  const tableProps = ref<IBaseTableProps<IBudgetComparisonList>>({
    title: 'Listado de saldos comparativos',
    loading: false,
    columns: [
      {
        name: '_row_number',
        align: 'center',
        label: '#',
        field: (row) => String(row._row_number ?? 0).padStart(2, '0'),
        sortable: true,
      },
      {
        name: 'rubro_presupuestal',
        align: 'left',
        label: 'Rubro presupuestal',
        field: 'rubro_presupuestal',
        sortable: true,
      },
      {
        name: 'descripcion_rubro_presupuestal',
        align: 'left',
        label: 'Descripción rubro presupuestal',
        field: 'descripcion_rubro_presupuestal',
        sortable: true,
      },
      {
        name: 'recurso',
        align: 'left',
        label: 'Recurso',
        field: 'recurso',
        sortable: true,
      },
      {
        name: 'descripcion_recurso',
        align: 'left',
        label: 'Descripción recurso',
        field: 'descripcion_recurso',
        sortable: true,
      },
      {
        name: 'area',
        align: 'left',
        label: 'Área',
        field: 'area',
        sortable: true,
      },
      {
        name: 'descripcion_area',
        align: 'left',
        label: 'Descripción área',
        field: 'descripcion_area',
        sortable: true,
      },
      {
        name: 'saldos_presupuestados_anterior',
        align: 'center',
        label: 'Vigencia anterior - Saldo presupuestado',
        field: (row) => {
          const data = row as unknown as Record<string, unknown>
          const vigencia = data[
            `vigencia_anterior_${vigenciaAnteriorValue.value}`
          ] as IBudgetComparisonValidity | undefined
          return formatCurrency(vigencia?.saldos_presupuestados ?? 0)
        },
        sortable: false,
      },
      {
        name: 'saldos_ejecutados_anterior',
        align: 'center',
        label: 'Vigencia anterior - Saldo ejecutado',
        field: (row) => {
          const data = row as unknown as Record<string, unknown>
          const vigencia = data[
            `vigencia_anterior_${vigenciaAnteriorValue.value}`
          ] as IBudgetComparisonValidity | undefined
          return formatCurrency(vigencia?.saldos_ejecutados ?? 0)
        },
        sortable: false,
      },
      {
        name: 'saldos_presupuestados_actual',
        align: 'center',
        label: 'Vigencia actual - Saldo presupuestado',
        field: (row) => {
          const data = row as unknown as Record<string, unknown>
          const vigencia = data[
            `vigencia_actual_${vigenciaActualValue.value}`
          ] as IBudgetComparisonValidity | undefined
          return formatCurrency(vigencia?.saldos_presupuestados ?? 0)
        },
        sortable: false,
      },
      {
        name: 'saldos_ejecutados_actual',
        align: 'center',
        label: 'Vigencia actual - Saldo ejecutado',
        field: (row) => {
          const data = row as unknown as Record<string, unknown>
          const vigencia = data[
            `vigencia_actual_${vigenciaActualValue.value}`
          ] as IBudgetComparisonValidity | undefined
          return formatCurrency(vigencia?.saldos_ejecutados ?? 0)
        },
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  // Watch para actualizar rows cuando cambie el store
  watch(
    () => budget_comparison_list.value,
    () => {
      tableProps.value.rows = budget_comparison_list.value
      tableProps.value.pages.currentPage =
        budget_comparison_pages.value.currentPage
      tableProps.value.pages.lastPage = budget_comparison_pages.value.lastPage
      showState.value = budget_comparison_list.value.length > 0 ? 1 : 0
      isTableEmpty.value = budget_comparison_list.value.length === 0
    },
    { immediate: true, deep: true }
  )

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    // Guardar vigencias de los filtros
    const vigenciaAnteriorKey = 'filter[validity_range][validity_previous]'
    const vigenciaActualKey = 'filter[validity_range][validity_current]'
    vigenciaAnteriorValue.value = filters[vigenciaAnteriorKey] ?? null
    vigenciaActualValue.value = filters[vigenciaActualKey] ?? null

    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, String(value))
      }
    })

    await _listAction(queryParams.toString())

    openMainLoader(false)
  }

  const handleFilter = async ($filters: Record<string, string | number>) => {
    filtersFormat.value = { ...filtersFormat.value, ...$filters }
    await loadData({ ...$filters })
  }

  const handleClearFilters = () => {
    showState.value = 0
    isTableEmpty.value = true
    tableProps.value.rows = []
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    await loadData(filtersFormat.value)
  }

  const handleUpdatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value)
  }

  const handleDownloadExcel = async () => {
    openMainLoader(true)

    const queryParams = new URLSearchParams()
    Object.entries(filtersFormat.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, String(value))
      }
    })

    await _downloadExcelAction(queryParams.toString())
    openMainLoader(false)
  }

  const handleDownloadPdf = async () => {
    openMainLoader(true)

    const queryParams = new URLSearchParams()
    Object.entries(filtersFormat.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, String(value))
      }
    })

    await _downloadPdfAction(queryParams.toString())
    openMainLoader(false)
  }

  return {
    showState,
    tableProps,
    headerProps,
    filterConfig,
    handleFilter,
    isTableEmpty,
    handleUpdatePage,
    handleClearFilters,
    handleUpdatePerPage,
    handleDownloadExcel,
    handleDownloadPdf,
    vigenciaAnteriorValue,
    vigenciaActualValue,
  }
}

export default useBudgetComparisonList
