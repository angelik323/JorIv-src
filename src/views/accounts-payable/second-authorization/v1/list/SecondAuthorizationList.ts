// Vue - Pinia
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ISecondAuthorizationListItem } from '@/interfaces/customs/accounts-payable/SecondAuthorization'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { SecondAuthorizationOrderStatuses } from '@/interfaces/global/Status'

// Composables
import {
  useAlert,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Stores
import { useSecondAuthorizationStore } from '@/stores/accounts-payable/second-authorization'
import { useLogin } from '@/stores/login'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useSecondAuthorizationList = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const {
    _getSecondAuthorizationList,
    _executeAuthorizationAction,
    _downloadPdfPaymentRequest,
  } = useSecondAuthorizationStore('v1')

  const { offices_code_label } = storeToRefs(useFicResourceStore('v1'))

  const { loggedUser } = storeToRefs(useLogin())

  const {
    payment_request_businesses,
    payment_requests,
    first_authorization_tax_settlement_generation_statuses,
    orpa_payment_order_statuses,
    payment_autorizers,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { showAlert } = useAlert()

  const { defaultIconsLucide, formatCurrency } = useUtils()

  const showState = ref(false)
  const isSecondAuthorizationListEmpty = ref(true)

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    action: '' as 'return' | 'authorize' | 'reject',
    id: null as null | number,
  })

  const headerProps = {
    title: 'Autorización 2 - Generacion ORPA - Pago giros',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Autorización 2 - Generacion ORPA - Pago giros',
        route: 'SecondAuthorizationList',
      },
    ],
    btn: {
      icon: defaultIconsLucide.plusCircleOutline,
      label: 'Crear',
    },
  }

  const selectedOrders = ref<ISecondAuthorizationListItem[]>([])

  const filteredOrderStatus = ref()

  const showAuthorizationButtons = computed(() => {
    if (!selectedOrders.value.length) return false

    // Si se filtra por alguna de estos tipos de ordenes de pago no se deben mostrar los botones
    if (filteredOrderStatus.value) {
      if (
        [
          SecondAuthorizationOrderStatuses.PAID,
          SecondAuthorizationOrderStatuses.LEGALIZED,
          SecondAuthorizationOrderStatuses.PARTIAL_PAID,
        ].includes(filteredOrderStatus.value)
      ) {
        return false
      }
    }

    const mapSelectedStatus = selectedOrders.value.map(
      (selected) => selected.status?.id ?? 0
    )

    // Si no se selecciona algun registro con estado autorizado o causado no deben mostrarse los botones
    if (
      !mapSelectedStatus.some((status) =>
        [
          SecondAuthorizationOrderStatuses.REGISTERED,
          SecondAuthorizationOrderStatuses.CAUSED,
        ].includes(status)
      )
    )
      return false

    return true
  })

  const findFilter = (filter_name: string) => {
    return filterConfig.value.find((filter) => filter.name === filter_name)
  }

  const selectedOffice = ref<string | null>(null)

  const onChangeOfficeFilter = (selected_office: string) => {
    const filter = findFilter('office_description')
    selectedOffice.value = selected_office
    filterRequest()
    if (filter) {
      filter.value = '-'
      if (!selected_office) return
      const finded_office = offices_code_label.value.find(
        (office) => office.value === selected_office
      )
      if (finded_office) {
        filter.value = finded_office.name
      }
    }
  }

  const selectedFromBusiness = ref<string | null>(null)

  const onChangeBusinessFrom = (selected_business: string) => {
    const filter = findFilter('from_business_description')
    selectedFromBusiness.value = selected_business
    filterRequest()
    if (filter) {
      filter.value = '-'
      if (!selected_business) return
      const finded_business = payment_request_businesses.value.find(
        (business) => business.value === selected_business
      )
      if (finded_business) {
        filter.value = finded_business.label
      }
    }
  }

  const selectedToBusiness = ref<string | null>(null)

  const onChangeBusinessTo = (selected_business: string) => {
    const filter = findFilter('to_business_description')
    selectedToBusiness.value = selected_business
    filterRequest()
    if (filter) {
      filter.value = '-'
      if (!selected_business) return
      const finded_business = payment_request_businesses.value.find(
        (business) => business.value === selected_business
      )
      if (finded_business) {
        filter.value = finded_business.label
      }
    }
  }

  const minValueRequestFilter = ref(1)

  const onChangeFromRequestNumber = (val: string) => {
    minValueRequestFilter.value = 1
    if (!val) return
    minValueRequestFilter.value = Number(val)
  }

  const filterRequest = () => {
    const filters = ['filter[status_id]=5,8']
    _resetKeys({ accounts_payable: ['payment_requests'] })
    if (selectedOffice.value) {
      filters.push(`filter[office_id]=${selectedOffice.value}`)
    }

    if (selectedFromBusiness.value) {
      filters.push(
        `filter[business_id]=${selectedFromBusiness.value}${
          selectedToBusiness.value ? ',' + selectedToBusiness.value : ''
        }`
      )
    }

    if (filters.length > 1) {
      _getResources(
        { accounts_payable: ['payment_requests'] },
        filters.join('&')
      )
    }
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'office_id',
      label: 'Código oficina*',
      type: 'q-select',
      value: null,
      class: 'col-3',
      options: offices_code_label,
      custom_selection_label: 'office_code',
      autocomplete: true,
      disable: false,
      clean_value: true,
      onChange: onChangeOfficeFilter,
      rules: [
        (val: string) => useRules().is_required(val, 'La oficina es requerida'),
      ],
      placeholder: 'Seleccione',
    },
    {
      name: 'office_description',
      label: 'Descripción oficina*',
      type: 'q-input',
      value: '',
      class: 'col-3',
      disable: true,
      clean_value: true,
      isForceValue: true,
      placeholder: '-',
    },
    {
      name: 'from_business_id',
      label: 'Desde negocio*',
      type: 'q-select',
      value: null,
      class: 'col-3',
      options: payment_request_businesses,
      autocomplete: true,
      disable: false,
      clean_value: true,
      onChange: onChangeBusinessFrom,
      rules: [
        (val: string) =>
          useRules().is_required(val, 'El negocio desde es requerido'),
      ],
      placeholder: 'Seleccione',
    },

    {
      name: 'from_business_description',
      label: 'Nombre negocio*',
      type: 'q-input',
      value: '',
      class: 'col-3',
      disable: true,
      clean_value: true,
      isForceValue: true,
      placeholder: '-',
    },
    {
      name: 'to_business_id',
      label: 'Hasta negocio*',
      type: 'q-select',
      value: null,
      class: 'col-3',
      options: payment_request_businesses,
      autocomplete: true,
      disable: false,
      clean_value: true,
      onChange: onChangeBusinessTo,
      rules: [
        (val: string) =>
          useRules().is_required(val, 'El negocio hasta es requerido'),
      ],
      placeholder: 'Seleccione',
    },
    {
      name: 'to_business_description',
      label: 'Nombre negocio*',
      type: 'q-input',
      value: '',
      class: 'col-3',
      disable: true,
      isForceValue: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'from_request_number',
      label: 'Desde solicitud*',
      type: 'q-select',
      value: null,
      class: 'col-3',
      options: payment_requests,
      autocomplete: true,
      disable: false,
      clean_value: true,
      onChange: onChangeFromRequestNumber,
      rules: [
        (val: string) =>
          useRules().is_required(val, 'La solicitud desde es requerida'),
      ],
      placeholder: 'Seleccione',
    },
    {
      name: 'to_request_number',
      label: 'Hasta solicitud*',
      type: 'q-select',
      value: null,
      class: 'col-3',
      options: payment_requests,
      autocomplete: true,
      disable: false,
      clean_value: true,
      rules: [
        (val: string) =>
          useRules().is_required(val, 'La solicitud hasta es requerida'),
        (val: string) =>
          useRules().min_value(
            val,
            minValueRequestFilter.value,
            'Debe ser mayor o igual a solicitud desde'
          ),
      ],
      placeholder: 'Seleccione',
    },
    {
      name: 'first_authorization_tax_settlement_generation_status_id',
      label: 'Estado autorización',
      type: 'q-select',
      value: 'todos',
      class: 'col-3',
      options: first_authorization_tax_settlement_generation_statuses,
      disable: false,
      clean_value: true,
      hide: true,
      rules: [],
      placeholder: 'Seleccione',
    },
    {
      name: 'from_ammount',
      label: 'Monto desde',
      type: 'q-input',
      value: '',
      class: 'col-3',
      disable: true,
      clean_value: false,
      isForceValue: true,
      hide: true,
      placeholder: '-',
    },
    {
      name: 'to_ammount',
      label: 'Monto hasta',
      type: 'q-input',
      value: '',
      class: 'col-3',
      disable: true,
      isForceValue: true,
      hide: true,
      clean_value: false,
      placeholder: '-',
    },
    {
      name: 'orpa_status_id',
      label: 'Estado orden de pago',
      type: 'q-select',
      value: null,
      class: 'col-3',
      options: orpa_payment_order_statuses,
      disable: false,
      clean_value: true,
      hide: true,
      rules: [],
      placeholder: 'Seleccione',
    },
  ])

  const handleShowFilters = (showMore: boolean) => {
    for (const field of filterConfig.value) {
      if (
        [
          'orpa_status_id',
          'first_authorization_tax_settlement_generation_status_id',
          'from_ammount',
          'to_ammount',
        ].includes(field.name)
      ) {
        field.hide = !showMore
      }
    }
  }

  const tableProps = ref<IBaseTableProps<ISecondAuthorizationListItem>>({
    title: 'Listado de autorización 2',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
        align: 'left',
      },
      {
        name: 'office',
        required: false,
        label: 'Oficina',
        field: (row) =>
          `${row.office.office_code} - ${row.office.office_description}`,
        sortable: true,
        align: 'left',
      },
      {
        name: 'business',
        required: false,
        label: 'Negocio',
        field: (row) =>
          row.business_trust
            ? `${row.business_trust.business_code} - ${row.business_trust.name}`
            : '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'from_payment_request_id',
        required: false,
        label: 'Desde solicitud',
        field: 'from_payment_request_id',
        sortable: true,
        align: 'left',
      },
      {
        name: 'to_payment_request_id',
        required: false,
        label: 'Hasta solicitud',
        field: 'to_payment_request_id',
        sortable: true,
        align: 'left',
      },
      {
        name: 'has_instructions',
        required: false,
        label: 'Instrucción de pago',
        field: 'has_instructions',
        sortable: true,
        align: 'left',
      },
      {
        name: 'request_number',
        required: false,
        label: 'Número solicitud de pago',
        field: 'request_number',
        sortable: true,
        align: 'left',
      },
      {
        name: 'status',
        required: false,
        label: 'Estado solicitud',
        field: 'status',
        sortable: true,
        align: 'left',
      },
      {
        name: 'first_authorization_tax_settlement_generation_status',
        required: false,
        label: 'Estado de autorización',
        field: 'first_authorization_tax_settlement_generation_status',
        sortable: true,
        align: 'left',
      },
      {
        name: 'orpa_number',
        required: false,
        label: 'Número de ORPA',
        field: 'orpa_number',
        sortable: true,
        align: 'left',
      },
      {
        name: 'orpa_status',
        required: false,
        label: 'Estado orden de pago',
        field: 'orpa_status',
        sortable: true,
        align: 'left',
      },
      {
        name: 'cancellation_rejection_reason',
        required: false,
        label: 'Motivo de anulación',
        field: (row) => row.cancellation_rejection_reason?.description ?? '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'value',
        required: false,
        label: 'Valor',
        field: (row) => formatCurrency(row.value),
        sortable: true,
        align: 'left',
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'id',
        align: 'center',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const listAction = async (
    filters: Record<string, string | number | null>,
    showMessage: boolean = true
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const result = await _getSecondAuthorizationList(filters, showMessage)
    if (result) {
      tableProps.value.rows = result.list
      tableProps.value.pages = result.pages
    }
    tableProps.value.loading = false
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const handleFilter = async ($filters: {
    'filter[office_id]': string
    'filter[office_description]'?: string
    'filter[from_business_id]': string
    'filter[from_business_description]'?: string
    'filter[to_business_id]': string
    'filter[to_business_description]'?: string
    'filter[from_request_number]': string
    'filter[to_request_number]': string
    'filter[first_authorization_tax_settlement_generation_status_id]': string
    'filter[orpa_status_id]': string
  }) => {
    filtersFormat.value = {
      'filter[office_id]': $filters['filter[office_id]'],
      'filter[business_id]': `${$filters['filter[from_business_id]']},${$filters['filter[to_business_id]']}`,
      'filter[from_payment_request_id]':
        $filters['filter[from_request_number]'],
      'filter[to_payment_request_id]': $filters['filter[to_request_number]'],
      'filter[orpa_status_id]': $filters['filter[orpa_status_id]'],
      page: 1,
      rows: filtersFormat.value.rows,
    }

    if (
      $filters[
        'filter[first_authorization_tax_settlement_generation_status_id]'
      ] !== 'todos'
    ) {
      filtersFormat.value = {
        ...filtersFormat.value,
        'filter[first_authorization_tax_settlement_generation_status_id]':
          $filters[
            'filter[first_authorization_tax_settlement_generation_status_id]'
          ] ?? '0',
      }
    }

    filteredOrderStatus.value = $filters['filter[orpa_status_id]'] ?? null

    clearData()

    await listAction(filtersFormat.value)

    showState.value = true
    isSecondAuthorizationListEmpty.value = tableProps.value.rows.length === 0
  }

  const handleClearFilters = async () => {
    clearData()
    isSecondAuthorizationListEmpty.value = true
    showState.value = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction(filtersFormat.value)
  }

  const updateRowsPerPage = (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    listAction(filtersFormat.value)
  }

  const clearData = () => {
    tableProps.value.rows = []
    tableProps.value.pages = {
      currentPage: 1,
      lastPage: 1,
    }
  }

  const openAlertModal = (action: 'return' | 'authorize' | 'reject') => {
    alertModalConfig.value.action = action
    let action_name = ''

    if (action === 'authorize') {
      action_name = 'autorizar'
    } else if (action === 'reject') {
      action_name = 'rechazar'
    } else {
      action_name = 'devolver'
    }

    alertModalConfig.value.title = `¿Desea ${action_name} las órdenes de pago seleccionadas?`

    alertModalRef.value?.openModal()
  }

  const handleConfirmButtonModal = async () => {
    if (!selectedOrders.value.length) return
    alertModalRef.value.closeModal()
    openMainLoader(true)

    const result = await _executeAuthorizationAction(
      {
        payment_request_ids: selectedOrders.value.map(
          (selected) => selected.id
        ),
      },
      alertModalConfig.value.action
    )

    openMainLoader(false)

    if (result) {
      setTimeout(() => {
        if (result.passed.length > 0) {
          for (let i = 0; i < result.passed.length; i++) {
            setTimeout(() => {
              showAlert(result.passed[i].message, 'success', undefined, 2000)
            }, i * 3000)
          }
        }

        if (result.failed.length > 0) {
          for (let i = 0; i < result.failed.length; i++) {
            setTimeout(() => {
              showAlert(result.failed[i].reason, 'error', undefined, 2000)
            }, i * 3000)
          }
        }

        selectedOrders.value = []

        listAction(filtersFormat.value, false)
      }, 1000)
    }
  }

  const handleDownloadPdf = (id: number) => {
    _downloadPdfPaymentRequest(id)
  }
  onMounted(async () => {
    openMainLoader(true)

    await Promise.all([
      _getResources(
        { accounts_payable: ['payment_autorizers'] },
        `filter[autorized_user_id]=${loggedUser.value?.user.id}`
      ),
      _getResources(
        { accounts_payable: ['payment_request_businesses'] },
        `filter[status_id]=67,57,59`
      ),
      _getResources({
        accounts_payable: [
          'first_authorization_tax_settlement_generation_statuses',
          'orpa_payment_order_statuses',
        ],
      }),
      _getResources(
        {
          fics: ['offices'],
        },
        `filter[validate_per_auth]=${loggedUser.value?.user.id}`
      ),
    ])

    const filterOrphaStatus = findFilter(
      'first_authorization_tax_settlement_generation_status_id'
    )

    if (filterOrphaStatus) {
      filterOrphaStatus.options.unshift({ label: 'Todos', value: 'todos' })
    }

    if (payment_autorizers.value.length > 0) {
      const fromAmmountFilter = findFilter('from_ammount')

      if (fromAmmountFilter) {
        fromAmmountFilter.value = formatCurrency(
          payment_autorizers.value[0].amount_from
        )
      }

      const toAmmountFilter = findFilter('to_ammount')

      if (toAmmountFilter) {
        toAmmountFilter.value = formatCurrency(
          payment_autorizers.value[0].amount_to
        )
      }
    }
    openMainLoader(false)
  })

  onBeforeUnmount(() =>
    _resetKeys({
      accounts_payable: [
        'payment_autorizers',
        'payment_request_businesses',
        'first_authorization_tax_settlement_generation_statuses',
        'orpa_payment_order_statuses',
        'payment_requests',
      ],
      fics: ['offices'],
    })
  )

  return {
    defaultIconsLucide,
    headerProps,
    filterConfig,
    selectedOrders,
    tableProps,
    showState,
    isSecondAuthorizationListEmpty,
    alertModalRef,
    alertModalConfig,
    showAuthorizationButtons,
    handleFilter,
    handleClearFilters,
    handleShowFilters,
    openAlertModal,
    handleConfirmButtonModal,
    updatePage,
    updateRowsPerPage,
    handleDownloadPdf,
    goToURL,
    validateRouter,
  }
}

export default useSecondAuthorizationList
