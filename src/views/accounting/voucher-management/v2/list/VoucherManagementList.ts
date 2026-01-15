import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { formatParamsCustom } from '@/utils'
import { IFieldFilters } from '@/interfaces/customs'
import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'
import { useVoucherManagementStore } from '@/stores/accounting/voucher-management'
import { IVoucherManagementListItem } from '@/interfaces/customs/accounting/VoucherManagement'
import { IBaseTableProps } from '@/interfaces/global'

const useVoucherManagementList = () => {
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatDate } = useUtils()

  const { headerPropsDefault } = storeToRefs(useVoucherManagementStore('v1'))
  const { _getVoucherManagementList, _exportXlsxVoucherManagementList } =
    useVoucherManagementStore('v1')

  const headerProperties = headerPropsDefault.value

  const {
    business_trust_label_sort_by_code,
    accounting_account_structures,
    vouchers_validation_status,
    validation_vouchers_process_result,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const alertModalRef = ref()
  const hideFilters = ref<boolean>(true)

  let perPage = 20

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'account_structure_code',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: accounting_account_structures,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'period',
      label: 'Periodo',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
    },
    {
      name: 'status',
      label: 'Proceso realizado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: vouchers_validation_status,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'from_business_trust_id',
      label: 'Desde negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trust_label_sort_by_code,
      disable: false,
      clean_value: true,
      hide: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'to_business_trust_id',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      options: business_trust_label_sort_by_code,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      hide: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'result',
      label: 'Resultado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: validation_vouchers_process_result,
      disable: false,
      hide: true,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProps = ref<IBaseTableProps<IVoucherManagementListItem>>({
    title: 'Listado de procesos gestionados',
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
        name: 'period',
        required: true,
        label: 'Periodo',
        align: 'left',
        field: (row) => `${formatDate(row.period_date ?? '', 'YYYY-MM')}`,
        sortable: true,
      },
      {
        name: 'structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: (row) => `${row.structure}`,
        sortable: true,
      },
      {
        name: 'from',
        required: true,
        label: 'Desde negocio',
        align: 'left',
        field: (row) => `${row.from_business_trust_id?.business_name}`,
        sortable: true,
      },
      {
        name: 'to',
        required: true,
        label: 'Hasta negocio',
        align: 'left',
        field: (row) => `${row.to_business_trust_id?.business_name}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Proceso realizado',
        align: 'left',
        field: (row) => `${row.status.id}`,
        sortable: true,
      },
      {
        name: 'process_result',
        required: true,
        label: 'Resultado',
        align: 'left',
        field: (row) => `${row.process_result ?? '-'}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const keys = ['business_trust', 'vouchers_validation_status']

  const keys_v2 = [
    'validation_vouchers_process_result',
    'accounting_account_structures',
  ]

  const handleFilter = ($filters: {
    'filter[account_structure_code]': string
    'filter[period]': string
    'filter[from_business_trust_id]': string
    'filter[to_business_trust_id]': string
    'filter[initial_date]': string
    'filter[final_date]': string
    'filter[status]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const clearFilters = () => {
    tableProps.value.rows = []
    tableProps.value.pages = {
      currentPage: 0,
      lastPage: 0,
    }
    filtersFormat.value = {}
  }

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    filterConfig.value[3].hide = hideFilters.value
    filterConfig.value[4].hide = hideFilters.value
    filterConfig.value[5].hide = hideFilters.value
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const downloadAction = async () => {
    openMainLoader(true)
    const queryString = formatParamsCustom(filtersFormat.value)
    await _exportXlsxVoucherManagementList(queryString)
    openMainLoader(false)
  }

  // Computed property to check if download button should be disabled
  const isDownloadDisabled = computed(() => {
    // Check if table has data
    const hasTableData =
      tableProps.value.rows && tableProps.value.rows.length > 0

    return !hasTableData
  })

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const voucher_management_list = await _getVoucherManagementList(filters)
    tableProps.value.rows = voucher_management_list.data
    tableProps.value.pages = voucher_management_list.pages
    tableProps.value.loading = false
  }

  onMounted(async () => {
    await _getResources({ accounting: keys })
    await _getResources({ accounting: keys_v2 }, '', 'v2')
  })

  onBeforeUnmount(() => {
    _resetKeys({ accounting: keys })
    _resetKeys({ accounting: keys_v2 })
  })

  return {
    headerProperties,
    tableProps,
    alertModalRef,
    filterConfig,
    isDownloadDisabled,
    defaultIconsLucide,
    handleFilter,
    clearFilters,
    handleShowMoreFilters,
    goToURL,
    updatePage,
    updatePerPage,
    downloadAction,
    validateRouter,
  }
}

export default useVoucherManagementList
