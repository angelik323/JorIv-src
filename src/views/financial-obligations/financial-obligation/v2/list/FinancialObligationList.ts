// vue - pinia
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IFinancialObligationListItemV2 } from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'
import { IFinancialObligationResource } from '@/interfaces/customs/resources/FinancialObligations'

// composables
import {
  useUtils,
  useRouteValidator,
  useGoToUrl,
  useMainLoader,
} from '@/composables'
import { useLogin } from '@/stores'

// stores
import { useFinancialObligationStore } from '@/stores/financial-obligations/financial-obligation'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFinantialObligationResourceStore } from '@/stores/resources-manager/finantial-obligations'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

// assets
import excelIcon from '@/assets/images/excel.svg'

const AUTHORIZE_STATUS_MAP: Record<string, number> = {
  Autorizado: 71,
  Registrado: 63,
  Pendiente: 25,
  Rechazado: 5,
}

const useFinancialObligationList = () => {
  const {
    _getFinancialObligationList,
    _downloadObligationDetail,
    _downloadFinancialObligationListByIds,
  } = useFinancialObligationStore('v2')
  const { _authorize } = useFinancialObligationStore('v2')
  const { headerPropsDefault } = storeToRefs(useFinancialObligationStore('v2'))

  const { getResources: getTreasuryResources } = useTreasuryResourceStore('v1')
  const { banks_initial_balance } = storeToRefs(useTreasuryResourceStore('v1'))

  const { getResources: getFinantialObligationResources } =
    useFinantialObligationResourceStore('v1')
  const { obligation_status, credit_types, financial_obligations } =
    storeToRefs(useFinantialObligationResourceStore('v1'))

  const { getResources: getFinantialObligationResourcesV2 } =
    useFinantialObligationResourceStore('v2')
  const { register_statuses } = storeToRefs(
    useFinantialObligationResourceStore('v2')
  )

  const { getResources: getTrustBusinessResources } =
    useTrustBusinessResourceStore('v1')
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { defaultIconsLucide, formatCurrencyString } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { isAdmin } = storeToRefs(useLogin())

  const headerProperties = headerPropsDefault.value

  const financial_obligation_list = ref<IFinancialObligationListItemV2[]>([])
  const financial_obligation_pages = ref({ currentPage: 1, lastPage: 1 })

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Nombre del negocio',
      placeholder: 'Todos',
      value: null,
      options: business_trusts,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'bank_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Banco',
      placeholder: 'Todos',
      value: null,
      options: banks_initial_balance,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'search',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Buscador',
      placeholder: 'Buscar por número de la obligación o ID',
      value: null,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      disable: false,
      autocomplete: true,
      options: [],
    },
    {
      name: 'obligation_status_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Estado',
      placeholder: 'Todos',
      value: null,
      options: obligation_status,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'credit_type_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Tipo de crédito',
      placeholder: 'Todos',
      value: null,
      options: credit_types,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'authorized',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Estado del registro',
      placeholder: 'Todas',
      value: null,
      options: register_statuses,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
  ])

  const financialObligationsOptions = computed(() =>
    (financial_obligations.value ?? []).map(
      (item: IFinancialObligationResource) => ({
        label: `${item.id} - ${item.obligation_number ?? ''}`,
        value: String(item.obligation_number ?? item.id ?? ''),
      })
    )
  )

  watch(
    financialObligationsOptions,
    (val) => {
      const idx = filterConfig.value.findIndex((f) => f.name === 'search')
      if (idx >= 0) filterConfig.value[idx].options = val
    },
    { immediate: true }
  )

  watch(
    () => filterConfig.value.find((f) => f.name === 'business_trust_id')?.value,
    async (businessId) => {
      const keys = ['financial_obligations']
      const params = businessId
        ? `?keys[]=${keys.join(
            '&keys[]='
          )}&filter[business_trust_id]=${businessId}`
        : `?keys[]=${keys.join('&keys[]=')}`
      await getFinantialObligationResources(params)

      const searchIdx = filterConfig.value.findIndex((f) => f.name === 'search')
      if (searchIdx >= 0) {
        filterConfig.value[searchIdx].value = null
      }

      const businessFilter: Record<string, string | number> = {
        'filter[business_trust_id]': businessId ?? '',
        page: 1,
        rows: filtersFormat.value.rows,
      }

      await listAction(businessFilter)
    }
  )

  watch(
    () => filterConfig.value.find((f) => f.name === 'search')?.value,
    async (searchValue) => {
      const businessId = filterConfig.value.find(
        (f) => f.name === 'business_trust_id'
      )?.value

      const filters: Record<string, string | number> = {
        page: 1,
        rows: filtersFormat.value.rows,
      }

      if (businessId) filters['filter[business_trust_id]'] = String(businessId)
      if (searchValue) filters['filter[search]'] = String(searchValue)

      await listAction(filters)
    }
  )

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const tableProperties = ref<IBaseTableProps<IFinancialObligationListItemV2>>({
    title: 'Listado de obligaciones financieras',
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
        name: 'business_trust_name',
        required: false,
        label: 'Nombre del negocio',
        align: 'left',
        field: (row) =>
          row.business_trust
            ? `${row.business_trust.code} - ${row.business_trust.name}`
            : '',
        sortable: true,
      },
      {
        name: 'obligation_number',
        required: false,
        label: 'Obligación financiera',
        align: 'left',
        field: (row) => `${row.obligation_number ?? ''}`,
        sortable: true,
      },
      {
        name: 'bank_name',
        required: false,
        label: 'Banco',
        align: 'left',
        field: (row) => row.bank?.name ?? '',
        sortable: true,
      },
      {
        name: 'credit_type_name',
        required: false,
        label: 'Tipo de crédito',
        align: 'left',
        field: (row) => row.credit_type?.name ?? '',
        sortable: true,
      },
      {
        name: 'amount',
        required: false,
        label: 'Valor del crédito',
        align: 'right',
        field: (row) => formatCurrencyString(row.amount),
        sortable: true,
      },
      {
        name: 'balance',
        required: false,
        label: 'Saldo por pagar',
        align: 'right',
        field: (row) => formatCurrencyString(row.balance),
        sortable: true,
      },
      {
        name: 'obligation_status',
        required: false,
        label: 'Estado',
        align: 'center',
        field: (row) => row.obligation_status?.name ?? '',
        sortable: true,
      },
      {
        name: 'authorize_status',
        required: false,
        label: 'Estado de registro',
        align: 'center',
        field: 'authorize_status',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true

    const { list, pages } = await _getFinancialObligationList(filters)
    financial_obligation_list.value = list
    financial_obligation_pages.value = pages

    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
    financial_obligation_list.value = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[business_trust_id]': string
    'filter[bank_id]': string
    'filter[search]': string
    'filter[obligation_status_id]': string
    'filter[credit_type_id]': string
    'filter[authorized]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    await listAction(filtersFormat.value)
  }

  const handleUpdateValues = async (
    values: Record<string, string | number>
  ) => {
    const businessId = values['filter[business_trust_id]']
    const searchValue = values['filter[search]']

    if (businessId !== undefined) {
      const keys = ['financial_obligations']
      const params = businessId
        ? `?keys[]=${keys.join(
            '&keys[]='
          )}&filter[business_trust_id]=${businessId}`
        : `?keys[]=${keys.join('&keys[]=')}`

      await getFinantialObligationResources(params)

      const searchIdx = filterConfig.value.findIndex((f) => f.name === 'search')
      if (searchIdx >= 0) filterConfig.value[searchIdx].value = null

      const filters: Record<string, string | number> = {
        page: 1,
        rows: filtersFormat.value.rows,
      }
      if (businessId) filters['filter[business_trust_id]'] = String(businessId)

      await listAction(filters)
      return
    }

    if (searchValue !== undefined) {
      const businessIdExisting = filterConfig.value.find(
        (f) => f.name === 'business_trust_id'
      )?.value

      const filters: Record<string, string | number> = {
        page: 1,
        rows: filtersFormat.value.rows,
      }
      if (businessIdExisting)
        filters['filter[business_trust_id]'] = String(businessIdExisting)
      if (searchValue) filters['filter[search]'] = String(searchValue)

      await listAction(filters)
      return
    }
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    await listAction(filtersFormat.value)
  }

  const exportXLSX = async () => {
    if (tableProperties.value.rows.length === 0) return

    openMainLoader(true)

    const ids = tableProperties.value.rows.map((r) => r.id)
    const params = ids.map((id) => `ids[]=${id}`).join('&')
    const paramString = params ? `?${params}` : ''

    await _downloadFinancialObligationListByIds(paramString)

    openMainLoader(false)
  }

  const exportObligationDetail = async (obligationId: number) => {
    openMainLoader(true)
    await _downloadObligationDetail(obligationId)
    openMainLoader(false)
  }

  const authorizeModalOpen = ref(false)
  const authorizeObservation = ref('')
  const authorizeSelectedId = ref<number | null>(null)

  const openAuthorizeModal = (row: IFinancialObligationListItemV2) => {
    authorizeSelectedId.value = row.id
    authorizeObservation.value = ''
    authorizeModalOpen.value = true
  }

  const closeAuthorizeModal = () => {
    authorizeSelectedId.value = null
    authorizeObservation.value = ''
    authorizeModalOpen.value = false
  }

  const submitAuthorize = async (action: boolean) => {
    if (!authorizeObservation.value || authorizeObservation.value.trim() === '')
      return

    openMainLoader(true)
    const id = authorizeSelectedId.value ?? 0
    const success = await _authorize(
      id,
      action,
      authorizeObservation.value.trim()
    )
    if (success) {
      await listAction(filtersFormat.value)
      closeAuthorizeModal()
    }
    openMainLoader(false)
  }

  const canAuthorize = (): boolean => {
    const hasAuthorizePermission = validateRouter(
      'BusinessTrust',
      'FinancialObligationList',
      'edit'
    )

    const adminWithCreate =
      isAdmin.value &&
      validateRouter('BusinessTrust', 'FinancialObligationList', 'create')

    return hasAuthorizePermission || adminWithCreate
  }

  const treasury_keys = ['banks']
  const financial_obligation_keys = [
    'obligation_statuses',
    'credit_types',
    'financial_obligations',
  ]
  const trust_business_keys = ['business_trusts']
  const financial_obligation_keys_v2 = ['register_statuses']

  onMounted(async () => {
    openMainLoader(true)

    await getTreasuryResources(`?keys[]=${treasury_keys.join('&keys[]=')}`)
    await getFinantialObligationResources(
      `?keys[]=${financial_obligation_keys.join('&keys[]=')}`
    )
    await getTrustBusinessResources(
      `?keys[]=${trust_business_keys.join('&keys[]=')}`
    )
    await getFinantialObligationResourcesV2(
      `?keys[]=${financial_obligation_keys_v2.join('&keys[]=')}`
    )

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    financial_obligation_list.value = []
    financial_obligation_pages.value = { currentPage: 1, lastPage: 1 }
  })

  watch(
    financial_obligation_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = financial_obligation_pages.value
      tableProperties.value.pages = { currentPage, lastPage }
    },
    { deep: true }
  )

  const getAuthorizeStatusId = (status: string | null): number => {
    if (!status) return 0
    return AUTHORIZE_STATUS_MAP[status] ?? 0
  }

  return {
    defaultIconsLucide,
    excelIcon,
    headerProperties,
    tableProperties,
    filterComponentRef,
    filterConfig,
    validateRouter,
    goToURL,
    handleClearFilters,
    handleFilterSearch,
    handleUpdateValues,
    updatePage,
    updateRowsPerPage,
    exportXLSX,
    exportObligationDetail,
    getAuthorizeStatusId,
    authorizeModalOpen,
    authorizeObservation,
    openAuthorizeModal,
    closeAuthorizeModal,
    submitAuthorize,
    canAuthorize,
  }
}

export default useFinancialObligationList
