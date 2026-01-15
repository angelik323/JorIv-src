// Vue - Vue Router - Pinia - Quasar
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Interfaces - Constants
import {
  IBudgetTransferQueryList,
  IBudgetTransferQueryParams,
} from '@/interfaces/customs/budget/BudgetTransferQuery'
import {
  IFieldFilters,
  IPaginatedFiltersFormat,
} from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'
import { ResourceTypes } from '@/interfaces/customs'
// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRules,
  useUtils,
  usePaginatedTableList,
} from '@/composables'
// Stores
import { useBudgetTransferStore } from '@/stores/budget/budget-transfer-query'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBudgetTransferQueryList = () => {
  const {
    is_required,
    max_length,
    min_value,
    only_number,
    date_not_before_year_2000,
  } = useRules()
  const { defaultIconsLucide, formatDate, formatCurrency } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { budget_document_types, budget_document_number } = storeToRefs(
    useBudgetResourceStore('v1')
  )
  const { _listAction, _downloadExcelAction } = useBudgetTransferStore('v1')

  const isTableEmpty = ref(true)
  const showState = ref(0)
  const currentFilters = ref<Record<string, string | number>>({})
  const currentVigency = ref(formatDate(new Date().toISOString(), 'YYYY'))

  const headerProps = {
    title: 'Consultas de traslados presupuestales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuestos',
      },
      {
        label: 'Consultas de traslados presupuestales',
        route: 'BudgetTransfersQueryList',
      },
    ],
  }

  const budgetKeys: ResourceTypes = {
    budget: ['budget_document_types'],
  }

  const budgetDocumentNumberKeys: ResourceTypes = {
    budget: ['budget_document_number'],
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await Promise.all([
      _getResources(budgetKeys, `filter[traslate]=${currentVigency.value}`),
      _getResources(
        budgetDocumentNumberKeys,
        `filter[operation_type]=transfer&filter[validity]=${
          currentVigency.value
        }&filter[budget_document_type_id]=${
          currentFilters.value.budget_document_type_id || ''
        }`
      ),
    ])
    openMainLoader(false)
  })

  watch(currentVigency, async (newVigency) => {
    if (newVigency) {
      openMainLoader(true)
      _resetKeys(budgetKeys)
      await _getResources(budgetKeys, `filter[traslate]=${newVigency}`)
      openMainLoader(false)
    }
  })

  watch(
    () => currentFilters.value.budget_document_type_id,
    async (newBudgetDocumentTypeId) => {
      if (newBudgetDocumentTypeId) {
        openMainLoader(true)
        _resetKeys(budgetDocumentNumberKeys)
        await _getResources(
          budgetDocumentNumberKeys,
          `filter[operation_type]=transfer&filter[validity]=${currentVigency.value}&filter[budget_document_type_id]=${newBudgetDocumentTypeId}`
        )
        openMainLoader(false)
      }
    }
  )

  onBeforeUnmount(() => {
    _resetKeys(budgetKeys)
    _resetKeys(budgetDocumentNumberKeys)
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'vigency',
      label: 'Vigencia*',
      type: 'q-date',
      value: currentVigency.value,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      mask: 'YYYY',
      rules: [
        (v: string) => is_required(v, 'El campo vigencia es requerido'),
        (v: string) => max_length(v, 4),
        (v: string) => date_not_before_year_2000(v, 'YYYY'),
      ],
      onChange: (v: string) => (currentVigency.value = v),
    },
    {
      name: 'date',
      label: 'Fecha*',
      type: 'q-date',
      value: formatDate(new Date().toISOString(), 'YYYY-MM-DD'),
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      rules: [(v: string) => is_required(v, 'El campo fecha es requerido')],
    },
    {
      name: 'budget_document_type_id',
      label: 'Tipo de documento*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: budget_document_types,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) =>
          is_required(v, 'El campo tipo de documento es requerido'),
      ],
      onChange: (v: string) =>
        (currentFilters.value.budget_document_type_id = v),
    },
    {
      name: 'from_number_traslate',
      label: 'Número de traslado desde*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: budget_document_number,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) =>
          is_required(v, 'El campo número de traslado desde es requerido'),
        (v: string) => only_number(v),
      ],
      onChange: (v: string) => (currentFilters.value.to_number_traslate = v),
    },
    {
      name: 'to_number_traslate',
      label: 'Número de traslado hasta*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: budget_document_number,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (v: string) =>
          is_required(v, 'El campo número de traslado hasta es requerido'),
        (v: string) => only_number(v),
        (v: string) =>
          min_value(v, Number(currentFilters.value.to_number_traslate)),
      ],
    },
  ])

  const tableProps = ref<IBaseTableProps<IBudgetTransferQueryList>>({
    title: 'Listado de traslados presupuestales',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
      },
      {
        name: 'transfer_number',
        label: 'Número de traslado',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'nature',
        label: 'Naturaleza',
        align: 'left',
        field: 'nature',
        sortable: true,
      },
      {
        name: 'business',
        label: 'Negocio',
        align: 'left',
        field: (row) => row.business_trust?.business_code,
        sortable: true,
      },
      {
        name: 'business_description',
        label: 'Descripción negocio',
        align: 'left',
        field: (row) => row.business_trust?.name,
        sortable: true,
      },
      {
        name: 'document_type',
        label: 'Tipo de documento',
        align: 'left',
        field: (row) => row.budget_document_type?.code,
        sortable: true,
      },
      {
        name: 'document_type_description',
        label: 'Descripción tipo de documento',
        align: 'left',
        field: (row) => row.budget_document_type?.description,
        sortable: true,
      },
      {
        name: 'budget_item',
        label: 'Rubro presupuestal',
        align: 'left',
        field: (row) => row.budget_item?.code,
        sortable: true,
      },
      {
        name: 'budget_item_description',
        label: 'Descripción rubro presupuestal',
        align: 'left',
        field: (row) => row.budget_item?.description,
        sortable: true,
      },
      {
        name: 'resource',
        label: 'Recurso',
        align: 'left',
        field: (row) => row.budget_resource?.code,
        sortable: true,
      },
      {
        name: 'resource_description',
        label: 'Descripción recurso',
        align: 'left',
        field: (row) => row.budget_resource?.description,
        sortable: true,
      },
      {
        name: 'area',
        label: 'Área',
        align: 'left',
        field: (row) => row.budget_area?.code,
        sortable: true,
      },
      {
        name: 'area_description',
        label: 'Descripción área',
        align: 'left',
        field: (row) => row.budget_area?.description,
        sortable: true,
      },
      {
        name: 'fiscal_year',
        label: 'Vigencia',
        align: 'left',
        field: 'fiscal_year',
        sortable: true,
      },
      {
        name: 'date',
        label: 'Fecha',
        align: 'left',
        field: (row) => formatDate(row.date ?? '', 'YYYY-MM-DD'),
        sortable: true,
      },
      {
        name: 'balance',
        label: 'Saldos',
        align: 'left',
        field: (row) => formatCurrency(row?.balance_adjust ?? 0),
        sortable: true,
      },
      {
        name: 'value',
        label: 'Valor',
        align: 'left',
        field: (row) => formatCurrency(row?.amount ?? 0),
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
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const expandListData = (data: IBudgetTransferQueryList[]) => {
    return data.flatMap((item) => {
      if (item.details && item.details.length > 0) {
        const { details, ...itemWithoutDetails } = item
        return item.details.map(
          (detail) =>
            ({
              ...itemWithoutDetails,
              nature: detail.nature,
              business_trust: detail.business_trust,
              budget_item: detail.budget_item,
              budget_resource: detail.budget_resource,
              budget_area: detail.budget_area,
              month: detail.month,
              amount: detail.amount,
              balance_adjust: detail.balance_adjust,
              operation_log: detail.operation_log,
            } as IBudgetTransferQueryList)
        )
      }
      return [item]
    })
  }

  const listPromiseFn = async (filters: IPaginatedFiltersFormat) => {
    const result = await _listAction(filters)
    const expandedList = expandListData(result.list)
    return {
      list: expandedList,
      pages: result.pages,
    }
  }

  const {
    handleClearFilters,
    handleFilterSearch,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    getFilterFormatValues,
  } = usePaginatedTableList({
    tableProps,
    listPromiseFn,
  })

  const handleFilter = async ($filters: IBudgetTransferQueryParams) => {
    openMainLoader(true)
    const filters = Object.entries($filters).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, string | number>)

    if (filters['filter[to_number_traslate]']) {
      filters['to_number_traslate'] = filters['filter[to_number_traslate]']
      delete filters['filter[to_number_traslate]']
    }

    currentFilters.value = filters

    const paginatedFilters: IPaginatedFiltersFormat = {
      page: 1,
      rows: 20,
      ...filters,
    }

    await handleFilterSearch(paginatedFilters)
    isTableEmpty.value = tableProps.value.rows.length === 0
    showState.value = Object.keys(filters).length > 0 ? 1 : 0
    openMainLoader(false)
  }

  const handleClearFiltersWrapper = () => {
    showState.value = 0
    isTableEmpty.value = true
    handleClearFilters()
  }

  const handleDownloadExcel = async () => {
    const filters = getFilterFormatValues()
    if (Object.keys(filters).length === 0) {
      return
    }
    openMainLoader(true)
    await _downloadExcelAction(filters)
    openMainLoader(false)
  }

  return {
    showState,
    tableProps,
    headerProps,
    isTableEmpty,
    filterConfig,
    defaultIconsLucide,
    goToURL,
    handleFilter,
    handleUpdatePage,
    handleClearFilters: handleClearFiltersWrapper,
    handleDownloadExcel,
    handleUpdateRowsPerPage,
    getFilterFormatValues,
  }
}

export default useBudgetTransferQueryList
