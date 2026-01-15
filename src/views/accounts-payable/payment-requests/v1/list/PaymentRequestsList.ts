// core
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IPaymentRequestItem,
  IPaymentRequestsFilters,
} from '@/interfaces/customs/accounts-payable/PaymentRequests'

// composables
import {
  useCalendarRules,
  useGoToUrl,
  useRouteValidator,
  useRules,
  useUtils,
  useMainLoader,
} from '@/composables'
import { IBaseTableProps } from '@/interfaces/global'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { usePaymentRequestsStore } from '@/stores/accounts-payable/payment-requests'

const usePaymentRequestsList = () => {
  // composables
  const {
    defaultIconsLucide,
    toggleFilterVisibility,
    clearFilters,
    formatCurrency,
  } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()
  const {
    valid_format_date,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
  } = useRules()
  const { only_until } = useCalendarRules()
  const { openMainLoader } = useMainLoader()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getPaymentRequestList } = usePaymentRequestsStore('v1')
  const {
    payment_request_businesses,
    payment_request_statuses,
    payment_request_consecutive_codes,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))

  // refs
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
  const hideFilters = ref<boolean>(true)
  const filtersFormat = ref<Record<string, string | number>>({})
  const filtersRef = ref()
  const currentPage = ref(1)
  const perPage = ref(20)
  const requestBusinesses = ref()

  // configs
  const headerProps = {
    title: 'Solicitudes de pago',
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
        label: 'Solicitudes de pago',
        route: 'PaymentRequestsList',
      },
    ],
    btn: {
      label: validateRouter('AccountsPayable', 'PaymentRequestsList', 'create')
        ? 'Crear'
        : undefined,
      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_from',
      label: 'Desde negocio',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: requestBusinesses,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'business_to',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: requestBusinesses,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: '',
      autocomplete: false,
      options: payment_request_statuses,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: false,
      placeholder: 'Seleccione',
      onChange: (value: string) => (filterConfig.value[2].value = value),
    },
    {
      name: 'request_number',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Número de solicitud',
    },
    {
      name: 'request_from',
      label: 'Desde solicitud',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: payment_request_consecutive_codes,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'request_to',
      label: 'Hasta solicitud',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: payment_request_consecutive_codes,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'date_from',
      label: 'Fecha inicial*',
      type: 'q-date',
      value: moment().format('YYYY-MM-DD'),
      class: 'col-12 col-md-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => valid_format_date(v, 'YYYY-MM-DD'),
        (v: string) => date_before_or_equal_to_the_current_date(v),
      ],
      option_calendar: only_until(moment().format('YYYY-MM-DD')),
      hide: true,
      onChange: (value: string) => (filterConfig.value[6].value = value),
    },
    {
      name: 'date_to',
      label: 'Fecha final',
      type: 'q-date',
      value: moment().format('YYYY-MM-DD'),
      class: 'col-12 col-md-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (val: string): true | string => {
          const dateFromField = filterConfig.value.find(
            (f) => f.name === 'date_from'
          )
          const startDate = dateFromField?.value

          if (!val || !startDate) return true
          return date_after_or_equal_to_specific_date(val, startDate)
        },
      ],
      option_calendar: useCalendarRules().only_until(
        moment().format('YYYY-MM-DD')
      ),
      hide: true,
    },
  ])

  const tableProps = ref<IBaseTableProps<IPaymentRequestItem>>({
    title: 'Listado de pagos solicitados',
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
        name: 'business_id',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: (item) => item?.detail?.business_label,
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
        name: 'movement_date',
        required: false,
        label: 'Fecha de movimiento',
        align: 'left',
        field: (item) => item?.detail?.movement_date,
        sortable: true,
      },
      {
        name: 'supplier_id',
        required: false,
        label: 'Proveedor / Emisor',
        align: 'left',
        field: 'supplier_name',
        sortable: true,
      },
      {
        name: 'total_value',
        required: false,
        label: 'Valor total',
        align: 'left',
        field: (item) => formatCurrency(String(item?.total_value ?? '')),
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

  // actions
  const listAction = async (filters: typeof filtersFormat.value) => {
    tableProps.value.loading = true

    let cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([key]) =>
        filterConfig.value.some(
          (field) => !field.hide && key.includes(field.name)
        )
      )
    )

    cleanedFilters = {
      ...cleanedFilters,
      rows: perPage.value,
      page: currentPage.value,
    }

    const list = await _getPaymentRequestList(cleanedFilters)

    tableProps.value.rows = list?.data ?? []
    tableProps.value.pages = list?.pages ?? { currentPage: 1, lastPage: 1 }

    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: IPaymentRequestsFilters) => {
    filtersFormat.value = { ...$filters }

    await listAction(filtersFormat.value)
  }

  const handleClear = () => {
    tableProps.value.rows = []
    clearFilters(filterConfig.value)
  }

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    toggleFilterVisibility(filterConfig.value, 4, 8, hideFilters.value)
  }

  const updatePage = async (page: number) => {
    currentPage.value = page
    await listAction({
      ...filtersFormat.value,
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    currentPage.value = 1
    perPage.value = rowsPerPage
    await listAction(filtersFormat.value)
  }

  watch(
    () => filterConfig.value.find((f) => f.name === 'status_id')?.value,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        if (newVal === null) {
          const field = filterConfig.value.find((f) => f.name === 'status_id')
          if (field) {
            field.value = ''
            filtersRef.value.setFieldValueByName('status_id', '')
          }
        }
      }
    }
  )

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(keysParams, 'can_manage=true')
    requestBusinesses.value = payment_request_businesses.value.map((item) => ({
      ...item,
      value: item.label?.split('-')[0]?.trim() ?? item.value,
    }))
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    // configs
    headerProps,
    filtersRef,
    filterConfig,
    tableProps,

    // utils
    defaultIconsLucide,

    // methods
    goToURL,
    handleShowMoreFilters,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
  }
}

export default usePaymentRequestsList
