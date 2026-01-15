// Vue
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

import { IAccountingReportList } from '@/interfaces/customs/accounting/v2/AccountingReport'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useOpeningRecordStore } from '@/stores/accounting/opening-record'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAccountingReportList = () => {
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _listAction } = useOpeningRecordStore('v2')

  const {
    business_trusts_to_consolidate,
    structure_levels,
    report_modules,
    report_types,
  } = storeToRefs(useAccountingResourceStore('v1'))

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
    accounting: [
      'business_trusts_to_consolidate ',
      'structure_levels ',
      'report_modules',
      'report_types',
    ],
  }

  const headerProps = {
    title: 'Reportes contables',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
      },
      {
        label: 'Reportes contables',
        route: 'AccoutingReportList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'report_type_id',
      label: 'Tipo de reporte',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: report_modules,
      hide: false,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'report_name_id',
      label: 'Nombre del reporte',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: report_types,
      hide: false,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'from_business_trust_id',
      label: 'Desde negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts_to_consolidate,
      hide: false,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'to_business_trust_id',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts_to_consolidate,
      hide: false,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'current_period',
      label: 'Período',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM',
      class: 'col-12 col-md-3',
      hide: true,
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
    },
    {
      name: 'accounting_structure_id',
      label: 'Estructura',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: structure_levels,
      hide: true,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<IBaseTableProps<IAccountingReportList>>({
    title: 'Listado de reportes contables',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'consecutive',
        label: 'Consecutivo',
        align: 'left',
        field: 'consecutive',
        sortable: true,
      },
      {
        name: 'user_generate',
        label: 'Usuario que generó',
        align: 'left',
        field: (r) => r.user_generate?.complete_name ?? '—',
        sortable: true,
      },
      {
        name: 'current_period',
        label: 'Periodo',
        align: 'left',
        field: 'current_period',
        sortable: true,
      },
      {
        name: 'report_type',
        label: 'Tipo del informe',
        align: 'left',
        field: (r) => r.report?.type?.name ?? '—',
        sortable: true,
      },
      {
        name: 'accounting_structure',
        label: 'Estructura contable',
        align: 'left',
        field: (r) => r.accounting_structure?.purpose ?? '—',
        sortable: true,
      },
      {
        name: 'from_business',
        label: 'Desde negocio',
        align: 'left',
        field: (r) => r.from_business?.name ?? '—',
        sortable: true,
      },
      {
        name: 'to_business',
        label: 'Hasta negocio',
        align: 'left',
        field: (r) => r.to_business?.name ?? '—',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: (r) => r.id,
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

    await _getResources(keys, '', 'v2')

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

  const downloadReport = (
    row: IAccountingReportList,
    type: 'PDF' | 'EXCEL'
  ) => {
    const file = row.reports_generated.find((r) => r.mime_type?.type === type)!

    window.open(file.url_to_download_for_s3!, '_blank')
  }

  const handleFilter = async ($filters: {
    'filter[accounting_structure_id]': string
    'filter[from_business_trust_id]': string
    'filter[to_business_trust_id]': string
    'filter[report_type_id]': string
    'filter[report_name_id]': string
    'filter[current_period]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await loadData(filtersFormat.value)
  }

  const onChangeFilter = async (values: Record<string, string | number>) => {
    const val = values['filter[report_type_id]']

    if (val)
      await _getResources(
        { accounting: ['report_types'] },
        `filter[report_module_id]=${val}`,
        'v2'
      )
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

    filtersFormat.value = {
      page: 1,
      rows: 20,
    }
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    await loadData(filtersFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value)
  }

  onMounted(async () => await loadResources())

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    showState,
    tableProps,
    filtersRef,
    headerProps,
    handleFilter,
    filterConfig,
    isTableEmpty,
    validateRouter,
    onChangeFilter,
    downloadReport,
    handleUpdatePage,
    defaultIconsLucide,
    handleClearFilters,
    handleShowMoreFilters,
    handleUpdateRowsPerPage,
  }
}

export default useAccountingReportList
