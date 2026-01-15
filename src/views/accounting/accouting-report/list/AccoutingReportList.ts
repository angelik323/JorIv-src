import { ref, reactive, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import type { QTable } from 'quasar'
import {
  useOpeningRecordStore,
  useResourceManagerStore,
  useAccountingResourceStore,
} from '@/stores'
import type {
  IAccountingReport,
  DropdownOption,
  IFieldFilters,
} from '@/interfaces/customs'
import type { IFilters } from '@/interfaces/global'
import { useRouteValidator } from '@/composables'

const useAccoutingReportList = () => {
  const router = useRouter()
  const { validateRouter } = useRouteValidator()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _getListAction, _toggleOpeningRecordStatus, _selectOpeningRecord } =
    useOpeningRecordStore('v1')

  const { opening_record_list, opening_record_pages, selected_opening_record } =
    storeToRefs(useOpeningRecordStore('v1'))

  const { report_types, business_trust, opening_record_structures } =
    storeToRefs(useAccountingResourceStore('v1'))
  const keys = {
    accounting: ['business_trust'],
  }

  const keysFilter = {
    accounting: ['report_types'],
  }

  const headerProps = {
    title: 'Reportes contables',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes contables', route: 'AccoutingReportList' },
    ],
    btn: {
      label: 'Generar',
      icon: defaultIconsLucide.plusCircleOutline,
      options: [
        {
          label: 'Balance general comparativo',
          route: 'ComparativeStatementCreate',
        },
        {
          label: 'Estado financiero por periodo',
          route: 'PeriodStatementCreate',
        },
        {
          label: 'Balance general trimestral',
          route: 'QuarterlyBalanceCreate',
        },
        {
          label: 'Auxiliar acumulado por cuenta',
          route: 'AccumulatedAuxiliaryCreate',
        },
        { label: 'Estado de resultados general', route: 'GeneralReportCreate' },
        { label: 'Por Centro de costo', route: 'CostCenterReportCreate' },
        {
          label: 'Estado situación financiera',
          route: 'FinancialStatementCreate',
        },
        {
          label: 'Estado de cambios en el patrimonio',
          route: 'LegacyReportCreate',
        },
        { label: 'Balance diario', route: 'DailyBalanceCreate' },
        { label: 'Balance consolidado', route: 'ConsolidatedBalanceCreate' },
        { label: 'Libro diario', route: 'DiaryBookCreate' },
        { label: 'Libro mayor y balance', route: 'GeneralLedgerCreate' },
        {
          label: 'Listar comprobante contable',
          route: 'AccountingReportListReceiptsCreate',
        },
        { label: 'BGP otras monedas', route: 'BGPOtherCurrenciesCreate' },
      ],
      color: 'primary',
      textColor: 'white',
      size: 'md',
      class: 'btn-header',
      outline: false,
      disable: false,
    },
  }

  const btnOptions = computed<DropdownOption[]>(() =>
    headerProps.btn.options.map((o) => ({
      label: o.label,
      routeName: o.route || undefined,
    }))
  )

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IAccountingReport[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Listado de reportes contables',
    loading: false,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
      {
        name: 'period',
        label: 'Periodo',
        align: 'left',
        field: (row: IAccountingReport) => row.period,
        sortable: true,
      },
      {
        name: 'type',
        label: 'Tipo',
        align: 'left',
        field: (row: IAccountingReport) => row.type,
        sortable: true,
      },
      {
        name: 'title',
        label: 'Título',
        align: 'left',
        field: (row: IAccountingReport) => row.title,
        sortable: true,
      },
      {
        name: 'accounting_structure',
        label: 'Estructura contable',
        align: 'left',
        field: (row: IAccountingReport) => row.accounting_structure,
        sortable: true,
      },
      {
        name: 'business_trust',
        label: 'Negocio',
        align: 'left',
        field: (row: IAccountingReport) => row.business,
        sortable: true,
      },
      { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const filtersFormat = ref<Record<string, string | number | null>>({})

  const filterConfig = reactive<IFieldFilters[]>([
    {
      name: 'report_type_id',
      label: 'Tipo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      options: report_types,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'period',
      label: 'Periodo',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM',
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
    },
    {
      name: 'business_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      options: business_trust,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 q-py-md',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por nombre o descripción...',
    },
  ])

  const listAction = async (params = '') => {
    tableProps.value.loading = true
    await _getListAction(params)
    tableProps.value.loading = false
  }

  const handleFilter = (filters: IFilters) => {
    filtersFormat.value = { ...filters }
    const q = formatParamsCustom(filtersFormat.value)
    listAction(q ? '&' + q : '&paginate=1')
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    const q = formatParamsCustom(filtersFormat.value)
    listAction(q ? '&' + q : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    const q = formatParamsCustom(filtersFormat.value)
    listAction(q ? '&' + q : '&paginate=1')
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const costCenterStatus = computed(() => {
    const id =
      (selected_opening_record.value?.status as { id?: number })?.id ??
      selected_opening_record.value?.status_id
    return id === 1 ? 'inactivar' : 'activar'
  })

  onMounted(async () => {
    await _getResources(keys)
    _getResources(keysFilter, '', 'v2')
  })

  watch(opening_record_list, () => {
    tableProps.value.rows = opening_record_list.value
  })

  watch(opening_record_pages, () => {
    tableProps.value.pages = {
      currentPage: opening_record_pages.value.currentPage,
      lastPage: opening_record_pages.value.lastPage,
    }
  })

  const handleBtnSelect = (option: { label: string; routeName?: string }) => {
    if (option?.routeName) router.push({ name: option.routeName })
  }

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  const handleGoTo = (route: string, id?: number) =>
    router.push({ name: route, params: { id } })

  return {
    headerProps,
    tableProps,
    selected_opening_record,
    opening_record_structures,
    costCenterStatus,
    filterConfig,
    btnOptions,
    handleGoTo,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    _selectOpeningRecord,
    _toggleOpeningRecordStatus,
    handleBtnSelect,
    validateRouter,
  }
}

export default useAccoutingReportList
