// Core
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IPaymentInstructionsFilters,
  IPaymentInstructionsItem,
} from '@/interfaces/customs/accounts-payable/PaymentInstructions'

// Composables
import {
  useCalendarRules,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { usePaymentInstructionsStore } from '@/stores/accounts-payable/payment-instructions'

const usePaymentInstructionsList = () => {
  // Composables
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, clearFilters, toggleFilterVisibility } =
    useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const {
    valid_format_date,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
  } = useRules()
  const { only_until } = useCalendarRules()

  // Strores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getPaymentInstructionsList } = usePaymentInstructionsStore()
  const {
    payment_request_businesses,
    payment_request_statuses,
    payment_request_numbers,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))
  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  // Refs
  const filtersFormat = ref<Record<string, string | number>>({})
  const hideFilters = ref<boolean>(true)
  const currentPage = ref(1)
  const perPage = ref(20)
  const requestBusinesses = ref()
  const officeLabelMap = ref<Record<string, string>>({})
  const businessLabelMap = ref<Record<string, string>>({})

  // Configs
  const keys = {
    accounts_payable: [
      'payment_request_businesses',
      'payment_request_statuses',
      'payment_request_numbers',
    ],
  }

  const keysOffice = {
    fics: ['offices'],
  }

  const keysBusiness = {
    trust_business: ['business_trusts'],
  }

  const headerProps = {
    title: 'Instrucciones de pago',
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
        label: 'Instrucciones de pago',
        route: 'PaymentInstructionsList',
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
      name: 'from_business_code',
      label: 'Desde negocio',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: requestBusinesses,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'to_business_code',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: requestBusinesses,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'from_request_id',
      label: 'Desde solicitud',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: payment_request_numbers,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'to_request_id',
      label: 'Hasta solicitud',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: payment_request_numbers,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'start_date',
      label: 'Fecha inicial*',
      type: 'q-date',
      value: '',
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
      onChange: (value: string) => (filterConfig.value[4].value = value),
    },
    {
      name: 'end_date',
      label: 'Fecha final*',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
        (val: string) => date_before_or_equal_to_the_current_date(val),
        (val: string): true | string => {
          const dateFromField = filterConfig.value.find(
            (f) => f.name === 'start_date'
          )
          const startDate = dateFromField?.value

          if (!val || !startDate) return true
          return date_after_or_equal_to_specific_date(val, startDate)
        },
      ],
      option_calendar: only_until(moment().format('YYYY-MM-DD')),
      hide: true,
    },
    {
      name: 'request_status',
      label: 'Estado solicitud',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: payment_request_statuses,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
  ])

  const tableProps = ref<IBaseTableProps<IPaymentInstructionsItem>>({
    title: 'Listado de instrucciones de pago',
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
        name: 'payment_request_date',
        required: false,
        label: 'Fecha de registro',
        align: 'left',
        field: (row) =>
          moment(row.payment_request.created_at).format('YYYY-MM-DD'),
        sortable: true,
      },
      {
        name: 'radicated_code',
        required: false,
        label: 'Número de solicitud de pago',
        align: 'left',
        field: (row) => row.payment_request.request_number,
        sortable: true,
      },
      {
        name: 'office_id',
        required: false,
        label: 'Oficina',
        align: 'left',
        field: (row) =>
          officeLabelMap.value[String(row.payment_request.office_id)] ?? '—',
        sortable: true,
      },
      {
        name: 'business_id',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: (row) =>
          businessLabelMap.value[
            String(row.payment_request.detail?.business_id)
          ] ?? '—',
        sortable: true,
      },
      {
        name: 'payment_type_label',
        required: false,
        label: 'Tipo de pago',
        align: 'left',
        field: (row) => row.payment_type_label,
        sortable: true,
      },
      {
        name: 'payment_request_status_id',
        required: false,
        label: 'Estado de la solicitud',
        align: 'left',
        field: (row) => row.payment_request.status_id,
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado de la orden de pago',
        align: 'left',
        field: (row) => row.status_id,
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

  // Methods
  const listAction = async (filters: typeof filtersFormat.value) => {
    tableProps.value.loading = true

    filters = {
      ...filters,
      rows: perPage.value,
      page: currentPage.value,
    }

    const list = await _getPaymentInstructionsList(filters)

    tableProps.value.rows = list?.data ?? []
    tableProps.value.pages = list?.pages ?? { currentPage: 1, lastPage: 1 }

    completeLabels()

    tableProps.value.loading = false
  }

  const completeLabels = async () => {
    const rows = tableProps.value.rows

    const officeIds = new Set<number>()
    const businessIds = new Set<number>()

    rows.forEach((row) => {
      const officeId = row.payment_request?.office_id
      const businessId = row.payment_request?.detail?.business_id

      if (officeId != null) officeIds.add(officeId)
      if (businessId != null) businessIds.add(businessId)
    })

    const officeIdsString = [...officeIds].join(',')
    const businessIdsString = [...businessIds].join(',')

    await _getResources(keysOffice, `filter[id]=${officeIdsString}`)
    await _getResources(keysBusiness, `filter[id]=${businessIdsString}`)

    officeLabelMap.value = {}
    offices.value.forEach((office) => {
      officeLabelMap.value[office.value] = office.label
    })

    businessLabelMap.value = {}
    business_trusts.value.forEach((business) => {
      businessLabelMap.value[business.value] = business.label
    })
  }

  const handleFilter = async ($filters: IPaymentInstructionsFilters) => {
    filtersFormat.value = { ...$filters }
    await listAction(filtersFormat.value)
  }

  const handleClear = () => {
    tableProps.value.rows = []
    clearFilters(filterConfig.value)
  }

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    toggleFilterVisibility(filterConfig.value, 3, 7, hideFilters.value)
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

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    requestBusinesses.value = payment_request_businesses.value.map((item) => ({
      ...item,
      value: item.label?.split('-')[0]?.trim() ?? item.value,
    }))
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysOffice)
    _resetKeys(keysBusiness)
  })

  return {
    // Configs
    headerProps,
    filterConfig,
    tableProps,

    // Composables
    defaultIconsLucide,
    goToURL,

    // Methods
    handleFilter,
    handleClear,
    handleShowMoreFilters,
    updatePage,
    updatePerPage,
  }
}

export default usePaymentInstructionsList
