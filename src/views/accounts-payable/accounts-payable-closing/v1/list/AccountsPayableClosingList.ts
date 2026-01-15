// Vue - Pinia
import { computed, ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters, ISelectorResources } from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'
import { IAccountsPayableClosing } from '@/interfaces/customs/accounts-payable/AccountsPayableClosing'

// Constants
import {
  ACCOUNTS_PAYABLE_CLOSING_TYPE_OPTIONS,
  ACCOUNTS_PAYABLE_CLOSING_STATUS_OPTIONS,
} from '@/constants/resources/accounts-payable-closing'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useUtils,
  useAlert,
} from '@/composables/index'

// Stores
import {
  useTrustBusinessResourceStore,
  useResourceManagerStore,
} from '@/stores/index'
import { useAccountsPayableClosingStore } from '@/stores/accounts-payable/accounts-payable-closing'

const useAccountsPayableClosingList = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatDate } = useUtils()
  const { showAlert } = useAlert()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const closingStore = useAccountsPayableClosingStore('v1')
  const { closing_list, closing_pages } = storeToRefs(closingStore)
  const { _listAction, _downloadErrorReport } = closingStore

  // keys
  const keys = {
    trust_business: ['business_trusts'],
  }

  // refs
  const showState = ref(0)
  const showAdvancedFilters = ref(false)
  const filterRef = ref<{
    cleanFilters: () => void
  } | null>(null)

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  // computed
  const businessTrustOptions = computed(() => {
    const localOptions = [...(business_trusts.value ?? [])]
    const defaultOptionIndex = localOptions.findIndex(
      (opt) => opt?.value === '' || opt?.value === null
    )

    if (defaultOptionIndex === -1) {
      localOptions.unshift({
        label: 'Todos',
        value: '',
      } as unknown as ISelectorResources)
    } else if (defaultOptionIndex > 0) {
      const [defaultOption] = localOptions.splice(defaultOptionIndex, 1)
      localOptions.unshift(defaultOption)
    }

    return localOptions
  })

  // props
  const headerProps = {
    title: 'Cierre cuentas por pagar',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Cierre cuentas por pagar',
        route: 'AccountsPayableClosingList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'closure_type',
      label: 'Tipo de cierre*',
      type: 'q-select',
      value: filtersFormat.value['filter[closure_type]'] ?? '',
      class: 'col-12 col-md-4',
      options: ACCOUNTS_PAYABLE_CLOSING_TYPE_OPTIONS,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: false,
    },
    {
      name: 'business_since',
      label: 'Negocio desde*',
      type: 'q-select',
      value: filtersFormat.value['filter[business_since]'] ?? '',
      class: 'col-12 col-md-4',
      options: businessTrustOptions.value,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'business_until',
      label: 'Negocio hasta*',
      type: 'q-select',
      value: filtersFormat.value['filter[business_until]'] ?? '',
      class: 'col-12 col-md-4',
      options: businessTrustOptions.value,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: filtersFormat.value['filter[status_id]'] ?? '',
      class: 'col-12 col-md-4',
      options: ACCOUNTS_PAYABLE_CLOSING_STATUS_OPTIONS,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: false,
      hide: true,
    },
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: filtersFormat.value['filter[start_date]'] ?? null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      placeholder: 'AAAA-MM-DD',
      hide: true,
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: filtersFormat.value['filter[end_date]'] ?? null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      placeholder: 'AAAA-MM-DD',
      hide: true,
    },
  ])

  const isTableEmpty = computed(() => (closing_list.value?.length ?? 0) === 0)

  const tableProps = computed<IBaseTableProps<IAccountsPayableClosing>>(() => ({
    title: 'Listado de cierres',
    loading: tableLoading.value,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_trust',
        required: true,
        label: 'Código/Negocio',
        align: 'left',
        field: 'business_trust',
        sortable: true,
      },
      {
        name: 'period',
        required: true,
        label: 'Periodo',
        align: 'left',
        field: 'period',
        sortable: true,
        format: (val: string) => {
          if (!val) return '-'
          return val.replace('-', '/')
        },
      },
      {
        name: 'closure_type',
        required: true,
        label: 'Tipo de cierre',
        align: 'left',
        field: 'closure_type',
        sortable: true,
      },
      {
        name: 'last_closure_date_business',
        required: true,
        label: 'Fecha último cierre',
        align: 'left',
        field: 'last_closure_date_business',
        sortable: true,
        format: (val: string) => (val ? formatDate(val, 'YYYY-MM-DD') : '-'),
      },
      {
        name: 'closure_date',
        required: true,
        label: 'Fecha de cierre',
        align: 'left',
        field: 'closure_date',
        sortable: true,
        format: (val: string) => (val ? formatDate(val, 'YYYY-MM-DD') : '-'),
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'id',
        sortable: true,
      },
    ],
    rows: Array.isArray(closing_list.value)
      ? (closing_list.value as IAccountsPayableClosing[])
      : [],
    pages: {
      currentPage: closing_pages.value?.currentPage ?? 1,
      lastPage: closing_pages.value?.lastPage ?? 1,
    },
  }))

  const tableLoading = ref(false)

  // methods
  const buildFilterParamKey = (name: string) => `filter[${name}]`

  const loadResource = async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  }

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableLoading.value = true

    await _listAction(filters)

    const hasResults = closing_list.value.length > 0

    const appliedFilters = Object.keys(filters).filter((key) =>
      key.startsWith('filter[')
    )
    showState.value = hasResults || appliedFilters.length > 0 ? 1 : 0

    tableLoading.value = false
    openMainLoader(false)
  }

  const handleFilter = async ($filters: Record<string, string | number>) => {
    const statusFilterKey = buildFilterParamKey('status_id')
    const statusValue = $filters[statusFilterKey] as string | undefined
    if (!statusValue || statusValue === '') {
      delete $filters[statusFilterKey]
    }

    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows ?? 20,
    }

    await loadData(filtersFormat.value)
  }

  const handleClearFilters = () => {
    filtersFormat.value = { page: 1, rows: 20 }
    closingStore._clearData()
    showState.value = 0
    showAdvancedFilters.value = false

    const fieldsToHide = ['status_id', 'start_date', 'end_date']
    filterConfig.value.forEach((field) => {
      if (fieldsToHide.includes(field.name)) {
        field.hide = true
      }
    })
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await loadData(filtersFormat.value)
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    await loadData(filtersFormat.value)
  }

  const viewDetail = (row?: IAccountsPayableClosing) => {
    const business_trust_id = row?.business_trust_id
    if (business_trust_id) {
      goToURL('AccountsPayableClosingView', business_trust_id, {
        ...filtersFormat.value,
      })
    }
  }

  const downloadReport = async (row?: IAccountsPayableClosing) => {
    if (!row) return

    if (row.status?.name !== 'Con error') {
      showAlert(
        'Solo se puede descargar el reporte de errores para registros con estado "Con error"',
        'warning'
      )
      return
    }

    openMainLoader(true)

    const arrayBuffer = await _downloadErrorReport(row.business_trust_id)
    if (arrayBuffer) {
      const { downloadBlobXlsx } = await import('@/utils')
      const fileName = 'Reporte_Error_Cierre_Negocios'
      const blob = new Blob([arrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      downloadBlobXlsx(blob, fileName)
      showAlert('Reporte descargado exitosamente', 'success')
    }

    openMainLoader(false)
  }

  const handleOptions = () => {
    showAdvancedFilters.value = !showAdvancedFilters.value

    const fieldsToToggle = ['status_id', 'start_date', 'end_date']
    filterConfig.value.forEach((field) => {
      if (fieldsToToggle.includes(field.name)) {
        field.hide = !showAdvancedFilters.value
      }
    })
  }

  watch(
    businessTrustOptions,
    (newVal) => {
      const businessFields = ['business_since', 'business_until']
      filterConfig.value.forEach((field) => {
        if (businessFields.includes(field.name)) {
          field.options = newVal
        }
      })
    },
    { deep: true }
  )

  // lifecycle
  onMounted(async () => {
    await loadResource()
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    goToURL,
    defaultIconsLucide,
    headerProps,
    filterConfig,
    filterRef,
    tableProps,
    isTableEmpty,
    showState,
    showAdvancedFilters,
    filtersFormat,
    handleFilter,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,
    viewDetail,
    downloadReport,
    handleOptions,
  }
}

export default useAccountsPayableClosingList
