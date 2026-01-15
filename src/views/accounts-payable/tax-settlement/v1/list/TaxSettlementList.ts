// Vue - Pinia
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  ICancellationRejectionReasonsItem,
  IFieldFilters,
} from '@/interfaces/customs'
import { IOperatingOfficeChildExtended } from '@/interfaces/customs/fics/OperatingOffices'
import { IBaseTableProps } from '@/interfaces/global/Table'
import {
  IRejectionModal,
  ITaxSettlement,
} from '@/interfaces/customs/accounts-payable/TaxSettlement'

// Composables
import {
  useUtils,
  useAlert,
  useGoToUrl,
  useRules,
  useMainLoader,
} from '@/composables'

// Constants
import { ALLOWED_STATUSES } from '@/constants/resources/tax-settlement'

// Stores
import { useTaxSettlementStore } from '@/stores/accounts-payable/tax-settlement'
import {
  useAccountsPayableResourceStore,
  useFicResourceStore,
  useResourceManagerStore,
  useTrustBusinessResourceStore,
  useCancellationRejectionReasonsStore,
} from '@/stores'

const useTaxSettlementList = () => {
  const { defaultIconsLucide, formatDate } = useUtils()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()
  const { is_required } = useRules()
  const { openMainLoader } = useMainLoader()

  // stores
  const taxSettlementStore = useTaxSettlementStore('v1')
  const { _listAction, _clearData, _rejectAction, _exportExcelById } =
    taxSettlementStore
  const { tax_settlement_list, tax_settlement_pages } =
    storeToRefs(taxSettlementStore)

  const resourceManagerStore = useResourceManagerStore('v1')
  const { _getResources, _resetKeys } = resourceManagerStore

  const ficResourcesStore = useFicResourceStore('v1')
  const trustBusinessResourcesStore = useTrustBusinessResourceStore('v1')
  const accountsPayableResourcesStore = useAccountsPayableResourceStore('v1')

  const { offices } = storeToRefs(ficResourcesStore)
  const { business_trusts } = storeToRefs(trustBusinessResourcesStore)
  const {
    settlement_formula_person_types,
    payment_request_statuses,
    payment_requests,
  } = storeToRefs(accountsPayableResourcesStore)

  const cancellationStore = useCancellationRejectionReasonsStore('v1')
  const { cancellation_rejection_reasons_list } = storeToRefs(cancellationStore)

  // refs
  const isTableEmpty = ref(true)
  const showState = ref(0)
  const showAdvancedFilters = ref(false)
  const rejectionModalRef = ref()
  const rejectionModalConfig = ref({
    payment_request_id: null as number | null,
    cancellation_rejection_reason_id: 0 as number,
    observations: '',
  })

  const officesResourceKeys = {
    fics: ['offices'],
  }

  const businessTrustsResourceKeys = {
    trust_business: ['business_trusts'],
  }

  const settlementFormulaPersonTypesResourceKeys = {
    accounts_payable: ['settlement_formula_person_types'],
  }

  const paymentRequestStatusesResourceKeys = {
    accounts_payable: ['payment_request_statuses'],
  }

  const cancellationReasonTypesResourceKeys = {
    accounts_payable: ['cancellation_reason_types'],
  }

  const paymentRequestByBusinessResourceKeys = {
    accounts_payable: ['payment_requests'],
  }

  const headerProperties = {
    title: 'Liquidación tributaria',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Liquidación tributaria',
        route: 'TaxSettlementList',
      },
    ],
  }

  // methods
  const buildFilterParams = (
    filters?: Record<string, string | number>,
    page?: number,
    rows?: number,
    sortBy?: string,
    descending?: boolean
  ): Record<string, string | number | boolean> => {
    const getFilterValue = (name: string) =>
      filters?.[`filter[${name}]`] ||
      filterConfig.value.find((f) => f.name === name)?.value

    const params: Record<string, string | number | boolean> = {
      'filter[office_id]': getFilterValue('office_id'),
      'filter[business_id]': getFilterValue('business_id'),
      'filter[date_from]': getFilterValue('start_date'),
      'filter[date_to]': getFilterValue('end_date'),
      paginate: true,
    }

    if (page !== undefined) params.page = page
    if (rows !== undefined) params.rows = rows

    if (sortBy) {
      params.order_by = `${sortBy},${descending ? 'desc' : 'asc'}`
    } else {
      params.order_by = 'id,asc'
    }

    const status = getFilterValue('status')
    if (status && String(status).trim() !== '') {
      params['filter[status_id]'] = status
    }

    const personType = getFilterValue('person_type')
    if (personType && personType !== 0) {
      params['filter[person_type]'] = personType
    }

    return params
  }

  const executeListAction = async (
    params: Record<string, string | number | boolean>
  ) => {
    tableProperties.value.loading = true
    await _listAction(params)
    tableProperties.value.loading = false
  }

  const handleFilter = async (filters?: Record<string, string | number>) => {
    await executeListAction(buildFilterParams(filters))
  }

  const resetTableState = () => {
    _clearData()
    tableProperties.value.rows = []
    tableProperties.value.pages = { currentPage: 0, lastPage: 0 }
    isTableEmpty.value = true
    showState.value = 0
  }

  const handleClearFilters = () => {
    filterConfig.value.forEach((filter) => {
      if (filter.name === 'person_type') {
        filter.value = 0
      } else if (filter.name === 'status') {
        filter.value = ''
      } else {
        filter.value = null
      }
    })

    const paymentRequestFilter = filterConfig.value.find(
      (f) => f.name === 'payment_request_id'
    )
    if (paymentRequestFilter) {
      paymentRequestFilter.options = []
    }

    resetTableState()
    setAdvancedFiltersVisibility(false)
  }

  const updatePage = async (page: number) => {
    await executeListAction(buildFilterParams(undefined, page))
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    await executeListAction(buildFilterParams(undefined, 1, rowsPerPage))
  }

  const viewDetail = (row?: ITaxSettlement) => {
    if (row) goToURL('TaxSettlementView', row.id)
  }

  const editRecord = (row?: ITaxSettlement) => {
    if (row) goToURL('TaxSettlementEdit', row.id)
  }

  const downloadExcel = async (row?: ITaxSettlement) => {
    if (row) {
      await _exportExcelById(row.id)
    }
  }

  const setAdvancedFiltersVisibility = (visible: boolean) => {
    showAdvancedFilters.value = visible
    const filters = ['payment_request_id', 'person_type', 'status']
    filters.forEach((filterName) => {
      const filter = filterConfig.value.find((f) => f.name === filterName)
      if (filter) filter.hide = !visible
    })
  }

  const handleOptions = () => {
    setAdvancedFiltersVisibility(!showAdvancedFilters.value)
  }

  const loadPaymentRequestsByBusiness = async (
    businessId: number | string | null
  ) => {
    if (!businessId) {
      return
    }

    openMainLoader(true)
    await _getResources(
      paymentRequestByBusinessResourceKeys,
      `filter[business_id]=${businessId}`
    )
    openMainLoader(false)
  }

  const openRejectionModal = (row?: ITaxSettlement) => {
    if (row) {
      rejectionModalConfig.value = {
        payment_request_id: row.payment_request_id || row.id,
        cancellation_rejection_reason_id: 0,
        observations: '',
      }
      // cargar motivos de rechazo antes de abrir modal
      ;(async () => {
        await cancellationStore._getCancellationRejectionReasonsList({
          reason_type: 'Rechazo',
        })
        rejectionModalRef.value?.openModal()
      })()
    }
  }

  const handleRejectionReasonChange = (value: unknown) => {
    const selected =
      value && typeof value === 'object' && 'value' in (value as object)
        ? (value as { value: unknown }).value
        : (value as unknown)
    rejectionModalConfig.value.cancellation_rejection_reason_id =
      (selected as number) || 0

    const reasons = cancellation_rejection_reasons_list.value || []
    const found = reasons.find(
      (r: ICancellationRejectionReasonsItem) => r.id === (selected as number)
    )
    rejectionModalConfig.value.observations =
      found && found.description ? found.description : ''
  }

  const handleReject = async () => {
    tableProperties.value.loading = true

    const success = await _rejectAction(
      rejectionModalConfig.value.payment_request_id!,
      {
        cancellation_rejection_reason_id:
          rejectionModalConfig.value.cancellation_rejection_reason_id,
        observations: rejectionModalConfig.value.observations,
        payment_request_id: rejectionModalConfig.value.payment_request_id,
      } as IRejectionModal
    )

    tableProperties.value.loading = false

    if (success) {
      rejectionModalRef.value?.closeModal()
      const params = buildFilterParams()
      await _listAction(params)
      showAlert('¡Registro rechazado exitosamente!', 'success')
    }
  }

  const getStatusName = (row?: ITaxSettlement): string => {
    if (!row) return ''
    const statusName =
      typeof row.status === 'string' ? row.status : row.status?.name || ''
    return statusName.trim()
  }

  const canReject = (row?: ITaxSettlement) => {
    const statusName = getStatusName(row)
    return ALLOWED_STATUSES.some((allowed) => allowed.trim() === statusName)
  }

  const canEdit = (row?: ITaxSettlement) => {
    const statusName = getStatusName(row)
    return ALLOWED_STATUSES.some((allowed) => allowed.trim() === statusName)
  }

  const taxSettlementOptions = (row?: ITaxSettlement) => {
    const options: Array<{
      label: string
      icon?: string
      action: () => void
    }> = []

    if (canReject(row)) {
      options.push({
        label: 'Rechazar',
        icon: defaultIconsLucide.xCircle,
        action: () => openRejectionModal(row),
      })
    }

    options.push({
      label: 'Descargar excel',
      icon: defaultIconsLucide.fileText,
      action: () => downloadExcel(row),
    })

    return options
  }

  const updateTableData = () => {
    tableProperties.value.rows = [...tax_settlement_list.value]
    const hasResults = tax_settlement_list.value.length > 0
    isTableEmpty.value = !hasResults
    showState.value = hasResults ? 1 : 0
    tableProperties.value.pages = {
      currentPage: tax_settlement_pages.value.currentPage,
      lastPage: tax_settlement_pages.value.lastPage,
    }
  }

  // Computed
  const formattedOffices = computed(() => {
    return (
      (
        (offices.value as unknown as IOperatingOfficeChildExtended[]) ?? []
      ).sort((a, b) => {
        const codeA = String(a.office_code || '')
        const codeB = String(b.office_code || '')
        return codeA.localeCompare(codeB, undefined, { numeric: true })
      }) || []
    )
  })

  // configs
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'office_id',
      label: 'Oficina*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: formattedOffices,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (val: unknown) =>
          is_required(
            String(val ?? ''),
            'La oficina es obligatoria para la consulta'
          ),
        (val: unknown) => {
          if (!val) return true
          const selectedOffice = (
            (offices.value as unknown as IOperatingOfficeChildExtended[]) ?? []
          ).find((o) => o.id === val)
          if (!selectedOffice) return true

          const now = new Date()
          const currentTime = now.toLocaleTimeString('en-GB', {
            hour12: false,
          })

          const isWithin = (start?: string | null, end?: string | null) => {
            if (!start || !end) return false
            return currentTime >= start && currentTime <= end
          }

          const inRegular = isWithin(
            selectedOffice.office_schedule_start,
            selectedOffice.office_schedule_end
          )
          const inExtended = isWithin(
            selectedOffice.extended_schedule_start,
            selectedOffice.extended_schedule_end
          )

          if (!inRegular && !inExtended) {
            return 'Oficina se encuentra fuera de horario'
          }
          return true
        },
      ],
    },
    {
      name: 'business_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      onChange: (value: number | string | null) => {
        if (!value) return
        loadPaymentRequestsByBusiness(value)
      },
      rules: [
        (val: unknown) =>
          is_required(
            String(val ?? ''),
            'El negocio es obligatorio para la consulta'
          ),
      ],
    },
    {
      name: 'start_date',
      label: 'Fecha inicial*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      placeholder: 'AAAA-MM-DD',
      rules: [
        (val: unknown) =>
          is_required(
            String(val ?? ''),
            'La fecha inicial es obligatoria para la consulta'
          ),
      ],
    },
    {
      name: 'end_date',
      label: 'Fecha final*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      placeholder: 'AAAA-MM-DD',
      rules: [
        (val: unknown) =>
          is_required(
            String(val ?? ''),
            'La fecha final es obligatoria para la consulta'
          ),
        (val: string | null) => {
          const startDate = filterConfig.value.find(
            (f) => f.name === 'start_date'
          )?.value as string | null
          if (val && startDate) {
            if (val < startDate) {
              return 'La fecha final no puede ser menor a la fecha inicial'
            }
          }
          return true
        },
      ],
    },
    {
      name: 'payment_request_id',
      label: 'Número de solicitud',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: payment_requests,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      hide: true,
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-3',
      options: payment_request_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: false,
      hide: true,
    },
    {
      name: 'person_type',
      label: 'Tipo de persona',
      type: 'q-select',
      value: 0,
      class: 'col-12 col-md-3',
      options: settlement_formula_person_types,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: false,
      hide: true,
    },
  ])

  const tableProperties = ref<IBaseTableProps<ITaxSettlement>>({
    title: 'Listado de liquidación tributaria',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
        required: true,
      },
      {
        name: 'registration_date',
        required: true,
        label: 'Fecha de registro',
        align: 'left',
        field: 'registration_date',
        sortable: true,
        format: (val: string) => (val ? formatDate(val, 'DD/MM/YYYY') : '-'),
      },
      {
        name: 'payment_request',
        required: true,
        label: 'Solicitud de pago',
        align: 'left',
        field: 'payment_request',
        sortable: true,
      },
      {
        name: 'person_type',
        required: true,
        label: 'Tipo de persona',
        align: 'left',
        field: 'person_type',
        sortable: true,
      },
      {
        name: 'supplier',
        required: true,
        label: 'Proveedor/Emisor',
        align: 'left',
        field: 'supplier',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: ITaxSettlement) => {
          if (typeof row.status === 'string') {
            return row.status
          }
          return row.status?.name || '-'
        },
        sortable: true,
      },
      {
        name: 'origin',
        required: true,
        label: 'Origen',
        align: 'left',
        field: 'origin',
        sortable: true,
      },
      {
        name: 'settlement_formula',
        required: true,
        label: 'Fórmula liquidación',
        align: 'left',
        field: 'settlement_formula',
        sortable: true,
      },
      {
        name: 'ciuu',
        required: true,
        label: 'CIIU',
        align: 'left',
        field: 'ciuu',
        sortable: true,
      },
      {
        name: 'iva',
        required: true,
        label: 'IVA',
        align: 'center',
        field: 'iva',
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'id',
        required: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  // Watchers
  watch(tax_settlement_list, updateTableData, { deep: true })
  watch(tax_settlement_pages, updateTableData, { deep: true })

  // Lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)
    await _getResources(officesResourceKeys, 'filter[validate_per_auth]=1')
    openMainLoader(false)

    openMainLoader(true)
    await _getResources(
      businessTrustsResourceKeys,
      'filter[status_id]=59,57,67'
    )
    openMainLoader(false)

    openMainLoader(true)
    await _getResources(settlementFormulaPersonTypesResourceKeys)
    openMainLoader(false)

    openMainLoader(true)
    await _getResources(paymentRequestStatusesResourceKeys)
    openMainLoader(false)

    openMainLoader(true)
    await _getResources(cancellationReasonTypesResourceKeys)
    openMainLoader(false)

    resetTableState()
  })

  onBeforeUnmount(() => {
    _resetKeys(officesResourceKeys)
    _resetKeys(businessTrustsResourceKeys)
    _resetKeys(settlementFormulaPersonTypesResourceKeys)
    _resetKeys(paymentRequestStatusesResourceKeys)
    _resetKeys(cancellationReasonTypesResourceKeys)
    _resetKeys(paymentRequestByBusinessResourceKeys)
  })

  // Computed
  const rejection_reasons = computed(() => {
    return (
      (cancellation_rejection_reasons_list.value || []).map(
        (it: ICancellationRejectionReasonsItem) => ({
          label: it.description ?? it.reason_code ?? String(it.id),
          value: it.id,
        })
      ) || []
    )
  })

  return {
    // configs
    headerProperties,
    filterConfig,
    tableProperties,

    // selects
    offices,
    business_trusts,
    settlement_formula_person_types,
    payment_request_statuses,
    payment_requests,
    rejection_reasons,

    // refs
    isTableEmpty,
    showState,
    showAdvancedFilters,
    rejectionModalRef,
    rejectionModalConfig,

    // utils
    defaultIconsLucide,

    // rules
    is_required,

    // methods
    handleFilter,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,
    viewDetail,
    editRecord,
    downloadExcel,
    handleOptions,
    canReject,
    canEdit,
    openRejectionModal,
    handleReject,
    handleRejectionReasonChange,
    taxSettlementOptions,
  }
}

export default useTaxSettlementList
