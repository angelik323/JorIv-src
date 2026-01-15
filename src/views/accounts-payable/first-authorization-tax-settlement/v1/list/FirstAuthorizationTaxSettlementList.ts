// Vue - Pinia
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'
import { IFirstAuthorizationTaxSettlementItem } from '@/interfaces/customs/accounts-payable/FirstAuthorizationTaxSettlement'

// Composables
import {
  useGoToUrl,
  useUtils,
  useRules,
  useRouteValidator,
  useMainLoader,
} from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useFirstAuthorizationTaxSettlementStore } from '@/stores/accounts-payable/first-authorization-tax-settlement'
import { useLogin } from '@/stores'

const useFirstAuthorizationTaxSettlementList = () => {
  const { defaultIconsLucide, formatCurrency } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { loggedUser } = storeToRefs(useLogin())

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const {
    payment_requests,
    payment_request_businesses,
    first_authorization_tax_settlement_generation_statuses,
    payment_autorizers,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))
  const { _getFirstAuthorizationTaxSettlementList } =
    useFirstAuthorizationTaxSettlementStore('v1')

  const officesFormatted = computed(() => {
    return offices.value.map((office) => {
      const parts = office.label?.split(' - ')
      return {
        value: office.value,
        label: office.label,
        office_code: parts && parts.length > 0 ? parts[0] : '',
        office_description: parts && parts.length > 1 ? parts[1] : '',
      }
    })
  })

  const businessesFormatted = computed(() => {
    return payment_request_businesses.value.map((business) => {
      const parts = business.label?.split(' - ')
      const businessCode = parts && parts.length > 0 ? parts[0] : ''
      return {
        value: businessCode,
        id: business.value,
        label: business.label,
        business_code: businessCode,
        business_name: parts && parts.length > 1 ? parts[1] : '',
      }
    })
  })

  const showState = ref(false)
  const showMore = ref(false)
  const isListEmpty = ref(true)
  const perPage = ref(20)
  const filtersFormat = ref<Record<string, string | number>>({})

  const selectedOffice = ref<string | null>(null)
  const selectedFromBusiness = ref<string | null>(null)
  const selectedToBusiness = ref<string | null>(null)
  const minValueRequestFilter = ref(1)

  const findFilter = (name: string) => {
    return filterConfig.value.find((f) => f.name === name)
  }

  const headerProps = {
    title: 'Autorización 1 - Liquidación tributaria',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas Por Pagar', route: '' },
      {
        label:
          'Autorización 1 - Liquidación tributaria - Generación ORPA - pagos',
        route: 'FirstAuthorizationTaxSettlementList',
      },
    ],
  }

  const filterRequest = () => {
    const filters = ['filter[status_id]=5,8']
    _resetKeys({ accounts_payable: ['payment_requests'] })

    if (selectedOffice.value) {
      filters.push(`filter[office_id]=${selectedOffice.value}`)
    }

    if (selectedFromBusiness.value) {
      const fromBusinessCode = Number(selectedFromBusiness.value)
      const toBusinessCode = selectedToBusiness.value
        ? Number(selectedToBusiness.value)
        : fromBusinessCode

      // Filtrar todos los negocios en el rango de códigos
      const businessesInRange = businessesFormatted.value.filter((business) => {
        const code = Number(business.business_code)
        return code >= fromBusinessCode && code <= toBusinessCode
      })

      // Extraer IDs para el endpoint de payment_requests
      const businessIds = businessesInRange
        .map((b) => b.id)
        .filter((id) => id != null)

      if (businessIds.length > 0) {
        filters.push(`filter[business_id]=${businessIds.join(',')}`)
      }
    }

    if (filters.length > 1) {
      _getResources(
        { accounts_payable: ['payment_requests'] },
        filters.join('&')
      )
    }
  }

  const onChangeFromRequestNumber = (val: string) => {
    minValueRequestFilter.value = 1
    if (!val) return
    minValueRequestFilter.value = Number(val)
  }

  const onOfficeChange = (val: number) => {
    filterConfig.value[1].value = ''

    if (val) {
      const selected_office = officesFormatted.value.find(
        (office) => office.value === val
      )
      if (selected_office) {
        filterConfig.value[1].value = selected_office.office_description
      }
    }

    selectedOffice.value = val ? String(val) : null
    filterRequest()
  }

  const onFromBusinessChange = (val: string) => {
    const filter = findFilter('from_business_name')

    if (filter) {
      filter.value = ''
      if (val) {
        const finded_business = businessesFormatted.value.find(
          (business) => business.value === val
        )
        if (finded_business) {
          filter.value = finded_business.business_name
        }
      }
    }

    selectedFromBusiness.value = val || null
    filterRequest()
  }

  const onToBusinessChange = (val: string) => {
    const filter = findFilter('to_business_name')

    if (filter) {
      filter.value = ''
      if (val) {
        const finded_business = businessesFormatted.value.find(
          (business) => business.value === val
        )
        if (finded_business) {
          filter.value = finded_business.business_name
        }
      }
    }

    selectedToBusiness.value = val || null
    filterRequest()
  }

  const handleShowFilters = () => {
    showMore.value = !showMore.value
    const hiddenFilters = ['authorization_status', 'amount_from', 'amount_to']

    filterConfig.value.forEach((field) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !showMore.value
      }
    })
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'office_id',
      label: 'Código oficina*',
      type: 'q-select',
      autocomplete: true,
      value: null,
      class: 'col-12 col-md-3',
      options: officesFormatted,
      custom_selection_label: 'office_code',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: (val: number) => onOfficeChange(val),
      rules: [
        (val: string) => useRules().is_required(val, 'La oficina es requerida'),
      ],
    },
    {
      name: 'office_description',
      label: 'Descripción oficina',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      placeholder: '',
      clean_value: true,
      isForceValue: true,
    },
    {
      name: 'from_business_code',
      label: 'Desde negocio*',
      type: 'q-select',
      autocomplete: true,
      value: null,
      class: 'col-12 col-md-3',
      options: businessesFormatted,
      custom_selection_label: 'business_code',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: (val: string) => onFromBusinessChange(val),
      rules: [
        (val: string) =>
          useRules().is_required(val, 'El negocio desde es requerido'),
      ],
    },
    {
      name: 'from_business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      placeholder: '',
      clean_value: true,
      isForceValue: true,
    },
    {
      name: 'to_business_code',
      label: 'Hasta negocio*',
      type: 'q-select',
      autocomplete: true,
      value: null,
      class: 'col-12 col-md-3',
      options: businessesFormatted,
      custom_selection_label: 'business_code',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: (val: string) => onToBusinessChange(val),
      rules: [
        (val: string) =>
          useRules().is_required(val, 'El negocio hasta es requerido'),
      ],
    },
    {
      name: 'to_business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      placeholder: '',
      clean_value: true,
      isForceValue: true,
    },
    {
      name: 'from_request_number',
      label: 'Desde solicitud*',
      type: 'q-select',
      autocomplete: true,
      value: null,
      class: 'col-12 col-md-3',
      options: payment_requests,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: onChangeFromRequestNumber,
      rules: [
        (val: string) =>
          useRules().is_required(val, 'La solicitud desde es requerida'),
      ],
    },
    {
      name: 'to_request_number',
      label: 'Hasta solicitud*',
      type: 'q-select',
      autocomplete: true,
      value: null,
      class: 'col-12 col-md-3',
      options: payment_requests,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
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
    },
    {
      name: 'authorization_status',
      label: 'Estado autorización',
      type: 'q-select',
      autocomplete: true,
      value: null,
      class: 'col-12 col-md-3',
      options: first_authorization_tax_settlement_generation_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      hide: true,
    },
    {
      name: 'amount_from',
      label: 'Monto desde',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      placeholder: '',
      clean_value: true,
      isForceValue: true,
      hide: true,
    },
    {
      name: 'amount_to',
      label: 'Monto hasta',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      placeholder: '',
      clean_value: true,
      isForceValue: true,
      hide: true,
    },
  ])

  const tableProperties = ref<
    IBaseTableProps<IFirstAuthorizationTaxSettlementItem>
  >({
    title: 'Listado de autorización 1',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'office',
        required: true,
        label: 'Oficina',
        align: 'left',
        field: (row: IFirstAuthorizationTaxSettlementItem) => {
          const office = row.office as Record<string, unknown> | undefined
          return `${office?.office_code ?? ''} - ${
            office?.office_description ?? ''
          }`
        },
        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row: IFirstAuthorizationTaxSettlementItem) => {
          const bt =
            typeof row.business_trust === 'object' &&
            row.business_trust !== null
              ? (row.business_trust as Record<string, unknown>)
              : null
          return bt ? `${bt.business_code ?? ''} - ${bt.name ?? ''}` : ''
        },
        sortable: true,
      },
      {
        name: 'payment_instruction',
        required: true,
        label: 'Instrucción de pago',
        align: 'center',
        field: (row: IFirstAuthorizationTaxSettlementItem) =>
          row.payment_instruction ?? 'N',
        sortable: true,
      },
      {
        name: 'request_number',
        required: true,
        label: 'Número solicitud de pago',
        align: 'left',
        field: 'request_number',
        sortable: true,
      },
      {
        name: 'request_status',
        required: true,
        label: 'Estado solicitud',
        align: 'center',
        field: (row: IFirstAuthorizationTaxSettlementItem) => {
          const status = row.request_status as
            | Record<string, unknown>
            | undefined
          return status?.name ?? ''
        },
        sortable: true,
      },
      {
        name: 'authorization_status',
        required: true,
        label: 'Estado de autorización',
        align: 'center',
        field: (row: IFirstAuthorizationTaxSettlementItem) => {
          const authStatus = row.authorizathion_status
          return typeof authStatus === 'object' && authStatus !== null
            ? (authStatus as Record<string, unknown>).name
            : authStatus ?? 'Sin estado'
        },
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'left',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.loading = true
    openMainLoader(true)

    const list = await _getFirstAuthorizationTaxSettlementList(filters)

    tableProperties.value.rows = list?.data ?? []
    tableProperties.value.pages = list?.pages ?? { currentPage: 1, lastPage: 1 }

    openMainLoader(false)
    tableProperties.value.loading = false
  }

  const handleFilter = async ($filters: Record<string, unknown>) => {
    const backendFilters: Record<string, string | number> = {}

    const officeId = $filters['filter[office_id]'] as number | null
    if (officeId) {
      backendFilters['filter[office_id]'] = officeId
    }

    const fromBusinessCode = $filters['filter[from_business_code]'] as
      | string
      | null
    if (fromBusinessCode) {
      backendFilters['filter[business_trust_code_since]'] = fromBusinessCode
    }

    const toBusinessCode = $filters['filter[to_business_code]'] as string | null
    if (toBusinessCode) {
      backendFilters['filter[business_trust_code_until]'] = toBusinessCode
    }

    const fromRequestNumber = $filters['filter[from_request_number]'] as
      | number
      | null
    if (fromRequestNumber) {
      backendFilters['filter[request_since]'] = fromRequestNumber
    }

    const toRequestNumber = $filters['filter[to_request_number]'] as
      | number
      | null
    if (toRequestNumber) {
      backendFilters['filter[request_until]'] = toRequestNumber
    }

    const authorizationStatus = $filters['filter[authorization_status]'] as
      | number
      | null
    if (authorizationStatus) {
      backendFilters['filter[authorization_status_id]'] = authorizationStatus
    }

    filtersFormat.value = { ...backendFilters, rows: perPage.value, page: 1 }
    await listAction(filtersFormat.value)

    const hasResults = tableProperties.value.rows.length > 0
    showState.value = Boolean(Object.keys(backendFilters).length)
    isListEmpty.value = !hasResults
  }

  const handleClearFilters = async () => {
    tableProperties.value.rows = []
    isListEmpty.value = true
    showState.value = false
  }

  const updatePage = async (page: number) => {
    await listAction({ ...filtersFormat.value, rows: perPage.value, page })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = { ...filtersFormat.value, rows: rowsPerPage, page: 1 }
    await listAction(filtersFormat.value)
  }

  const handleView = (rowId: number) => {
    // Leer códigos de negocio desde filtersFormat
    const fromBusiness = filtersFormat.value[
      'filter[business_trust_code_since]'
    ] as string | undefined
    const toBusiness = filtersFormat.value[
      'filter[business_trust_code_until]'
    ] as string | undefined
    const fromRequestId = filtersFormat.value['filter[request_since]'] as
      | number
      | undefined
    const toRequestId = filtersFormat.value['filter[request_until]'] as
      | number
      | undefined

    const fromRequestObj = payment_requests.value.find(
      (req) => req.value === fromRequestId
    )
    const toRequestObj = payment_requests.value.find(
      (req) => req.value === toRequestId
    )

    const fromBusinessNameFilter = findFilter('from_business_name')
    const toBusinessNameFilter = findFilter('to_business_name')

    const filterData = {
      fromBusiness: fromBusiness ? String(fromBusiness) : '',
      fromBusinessName: fromBusinessNameFilter?.value
        ? String(fromBusinessNameFilter.value)
        : '',
      toBusiness: toBusiness ? String(toBusiness) : '',
      toBusinessName: toBusinessNameFilter?.value
        ? String(toBusinessNameFilter.value)
        : '',
      fromRequest: fromRequestObj?.label || '',
      toRequest: toRequestObj?.label || '',
    }

    // Guardar en localStorage
    localStorage.setItem(
      'firstAuthTaxSettlementFilters',
      JSON.stringify(filterData)
    )

    goToURL('FirstAuthorizationTaxSettlementView', rowId)
  }

  const keys = {
    accounts_payable: [
      'first_authorization_tax_settlement_generation_statuses',
    ],
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
      _getResources(
        { fics: ['offices'] },
        `filter[validate_per_auth]=${loggedUser.value?.user.id}`
      ),
      _getResources(keys),
    ])

    if (payment_autorizers.value.length > 0) {
      const fromAmountFilter = findFilter('amount_from')

      if (fromAmountFilter) {
        fromAmountFilter.value = formatCurrency(
          payment_autorizers.value[0].amount_from
        )
      }

      const toAmountFilter = findFilter('amount_to')

      if (toAmountFilter) {
        toAmountFilter.value = formatCurrency(
          payment_autorizers.value[0].amount_to
        )
      }
    }
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys({ ...keys, fics: ['offices'] }))

  return {
    headerProps,
    defaultIconsLucide,
    validateRouter,
    filterConfig,
    handleFilter,
    handleClearFilters,
    handleShowFilters,
    showState,
    isListEmpty,
    tableProperties,
    updatePage,
    updatePerPage,
    handleView,
  }
}

export default useFirstAuthorizationTaxSettlementList
