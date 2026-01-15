// Core
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IPaymentStatusFilters,
  IPaymentStatusItem,
  IPaymentStatusDetailHistoryItem,
} from '@/interfaces/customs/accounts-payable/PaymentStatus'

// Composables
import { useRules } from '@/composables/useRules'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { usePaymentStatusStore } from '@/stores/accounts-payable/payment-status'

const usePaymentStatusList = () => {
  // Composables
  const { defaultIconsLucide, clearFilters, formatCurrency } = useUtils()
  const { date_after_or_equal_to_specific_date } = useRules()
  const { openMainLoader } = useMainLoader()

  // Refs
  const filtersRef = ref()
  const filtersFormat = ref<Record<string, string | number>>({})
  const currentPage = ref(1)
  const perPage = ref(20)
  const alertModalRef = ref()

  // Stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getPaymentStatusList, _getPaymentStatusById } =
    usePaymentStatusStore('v1')
  const {
    payment_request_businesses,
    payment_request_statuses,
    payment_request_consecutive_codes,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const keys = {
    accounts_payable: [
      'payment_request_statuses',
      'payment_request_numbers',
      'payment_request_consecutive_codes',
    ],
  }
  const keysParams = {
    accounts_payable: ['payment_request_businesses'],
  }

  // Configs
  const headerProps = {
    title: 'Consulta estado de pagos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Consulta estado de pagos',
        route: 'PaymentRequestsList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_id',
      label: 'Negocio*',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-3',
      options: payment_request_businesses,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: (value: string) => (filterConfig.value[0].value = value),
    },
    {
      name: 'date_from',
      label: 'Desde fecha',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      options: [],
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      onChange: (value: string) => (filterConfig.value[1].value = value),
    },
    {
      name: 'date_to',
      label: 'Hasta fecha',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      options: [],
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (val: string): true | string => {
          const dateFromField = filterConfig.value.find(
            (f) => f.name === 'from_date'
          )
          const startDate = dateFromField?.value

          if (!val || !startDate) return true
          return date_after_or_equal_to_specific_date(val, startDate)
        },
      ],
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-3',
      options: payment_request_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: (value: string) => (filterConfig.value[3].value = value),
    },
    {
      name: 'request_from',
      label: 'Número de solicitud desde',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: payment_request_consecutive_codes,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'request_to',
      label: 'Número de solicitud hasta',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: payment_request_consecutive_codes,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<IBaseTableProps<IPaymentStatusItem>>({
    title: 'Listado de estado de pagos',
    loading: false,
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
        name: 'request_number',
        required: false,
        label: 'Número de solicitud',
        align: 'left',
        field: 'request_number',
        sortable: true,
      },
      {
        name: 'orpa_number',
        required: false,
        label: 'Número ORPA',
        align: 'left',
        field: 'orpa_number',
        sortable: true,
      },
      {
        name: 'beneficiary',
        required: false,
        label: 'Beneficiario',
        align: 'left',
        field: (row) =>
          row.supplier.natural_person?.full_name ??
          row.supplier.legal_person?.business_name ??
          '',
        sortable: true,
      },
      {
        name: 'reception_date',
        required: false,
        label: 'Fecha registro',
        align: 'left',
        field: 'reception_date',
        sortable: true,
      },
      {
        name: 'total_value',
        required: false,
        label: 'Valor pago',
        align: 'left',
        field: (row) => formatCurrency(row.total_value ?? ''),
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const alertModalConfig = ref({
    title: 'Estado solicitud de pago',
    id: null as null | number,
    data: {} as IPaymentStatusItem,
  })

  const tableDetailProps = ref<
    IBaseTableProps<IPaymentStatusDetailHistoryItem>
  >({
    loading: false,
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
        name: 'date',
        required: false,
        label: 'Fecha',
        align: 'left',
        field: 'date',
        sortable: true,
      },
      {
        name: 'hour',
        required: false,
        label: 'Hora',
        align: 'left',
        field: 'hour',
        sortable: true,
      },
      {
        name: 'user',
        required: false,
        label: 'Usuario',
        align: 'left',
        field: 'user',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  // Methods
  const listAction = async (filters: typeof filtersFormat.value) => {
    tableProps.value.loading = true

    filters = {
      ...filters,
      rows: perPage.value,
      page: currentPage.value,
    }

    const list = await _getPaymentStatusList(filters)
    tableProps.value.rows = list?.data ?? []
    tableProps.value.pages = list?.pages ?? { currentPage: 1, lastPage: 1 }

    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: IPaymentStatusFilters) => {
    filtersFormat.value = { ...$filters }

    await listAction(filtersFormat.value)
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
    clearFilters(filterConfig.value)
  }

  const updatePage = async (page: number) => {
    currentPage.value = page
    await listAction(filtersFormat.value)
  }

  const updatePerPage = async (rowsPerPage: number) => {
    currentPage.value = 1
    perPage.value = rowsPerPage
    await listAction(filtersFormat.value)
  }

  const openDetailModal = async (row: IPaymentStatusItem) => {
    alertModalConfig.value.data = row

    if (!row.id) return

    const payment = await _getPaymentStatusById(row.id)
    tableDetailProps.value.rows = payment.status_history ?? []

    alertModalRef.value?.openModal()
  }

  const resetFieldIfNull = (fieldName: string) => {
    const field = filterConfig.value.find((f) => f.name === fieldName)
    if (!field) return

    field.value = ''
    filtersRef.value.setFieldValueByName(fieldName, '')
  }

  watch(
    () => filterConfig.value.find((f) => f.name === 'status_id')?.value,
    (newVal, oldVal) => {
      if (newVal !== oldVal && newVal === null) {
        resetFieldIfNull('status_id')
      }
    }
  )

  watch(
    () => filterConfig.value.find((f) => f.name === 'business_id')?.value,
    (newVal, oldVal) => {
      if (newVal !== oldVal && newVal === null) {
        resetFieldIfNull('business_id')
      }
    }
  )

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(keysParams, 'can_manage=true')
    payment_request_statuses.value = [
      { value: '', label: 'Todos' },
      ...payment_request_statuses.value,
    ]
    payment_request_businesses.value = [
      { value: '', label: 'Todos' },
      ...payment_request_businesses.value,
    ]
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysParams)
  })

  return {
    // Configs
    headerProps,
    filtersRef,
    filterConfig,
    tableProps,
    defaultIconsLucide,
    alertModalConfig,
    tableDetailProps,

    // Refs
    alertModalRef,

    // Methods
    handleFilter,
    handleClearFilters,
    updatePage,
    updatePerPage,
    openDetailModal,
  }
}

export default usePaymentStatusList
