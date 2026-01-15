// Vue - pinia - moment
import { ref, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters, ResourceTypes } from '@/interfaces/customs'
import { IBudgetDocumentsListItem } from '@/interfaces/customs/budget/BudgetDocuments'

// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { usePaginatedTableList } from '@/composables/useTableList'
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useRules } from '@/composables/useRules'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/composables'

// Stores
import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetDocumentsStore } from '@/stores/budget/budget-documents'

const useBudgetDocumentsList = () => {
  const {
    is_required,
    min_value,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
  } = useRules()
  const { openMainLoader } = useMainLoader()
  const {
    getDateValidationRange,
    formatDate,
    formatCurrency,
    defaultIconsLucide,
  } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { business_trusts_selector: business_trusts } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const {
    _getDocumentsList,
    _downloadDocument,
    _clearFiltersFormat,
    _setFiltersFormat,
  } = useBudgetDocumentsStore('v1')

  const {
    budget_document_types_by_business,
    budget_document_number,
    operation_logs_authorized,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const accountingKeys: ResourceTypes = {
    accounting: ['business_trusts_selector'],
  }

  const budgetDocumentTypesKey: ResourceTypes = {
    budget: ['budget_document_types_by_business'],
  }

  const budgetDocumentNumbersKey: ResourceTypes = {
    budget: ['budget_document_number'],
  }

  const budgetAdditionKey: ResourceTypes = {
    budget: ['operation_logs_authorized'],
  }

  const headerConfig = {
    title: 'Consultas de documentos presupuestales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuesto',
        route: '',
      },
      {
        label: 'Consultas de documentos presupuestales',
        route: 'BudgetDocumentsList',
      },
    ],
  }

  // Refs & computed props

  const selectedValidityPeriod = ref<string | undefined>()

  const filtersRef = ref<InstanceType<typeof FiltersComponentV2> | null>(null)

  const currentDocumentFilters = ref<{
    businessTrustId?: number
    validityPeriod?: string
    budgetDocumentTypeId?: number
    documentNumberFrom?: number
    documentNumberTo?: number
    additionNumberFrom?: number
    additionNumberTo?: number
  }>({})

  const filtersConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
      onChange: (value: number | null) => {
        currentDocumentFilters.value.businessTrustId = value ?? undefined

        getDocumentTypesSelector(
          currentDocumentFilters.value.businessTrustId,
          currentDocumentFilters.value.validityPeriod
        )

        getDocumentNumbersSelector(
          currentDocumentFilters.value.businessTrustId,
          currentDocumentFilters.value.validityPeriod,
          currentDocumentFilters.value.budgetDocumentTypeId
        )
      },
    },
    {
      name: 'vigency',
      label: 'Vigencia*',
      type: 'q-date',
      value: null,
      placeholder: 'YYYY',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      mask: 'YYYY',
      navigation_min_year: '2000/01',
      onChange: (value: string | null) => {
        selectedValidityPeriod.value = value ?? undefined
        currentDocumentFilters.value.validityPeriod = value ?? undefined

        getDocumentTypesSelector(
          currentDocumentFilters.value.businessTrustId,
          currentDocumentFilters.value.validityPeriod
        )

        getDocumentNumbersSelector(
          currentDocumentFilters.value.businessTrustId,
          currentDocumentFilters.value.validityPeriod,
          currentDocumentFilters.value.budgetDocumentTypeId
        )
      },
      rules: [(val: string) => is_required(val)],
    },
    {
      name: 'to_vigency',
      label: 'Hasta fecha*',
      type: 'q-date',
      value: formatDate(new Date().toISOString(), 'YYYY-MM-DD'),
      placeholder: 'YYYY-MM-DD',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      option_calendar: (value) =>
        getDateValidationRange(
          selectedValidityPeriod.value
            ? Number(selectedValidityPeriod.value)
            : undefined
        )(value),
      rules: [
        (val: string) => is_required(val),
        (val: string) => date_before_or_equal_to_the_current_date(val),
        (val: string) => {
          if (!val || !selectedValidityPeriod.value) return true
          return date_after_or_equal_to_specific_date(
            val,
            `${selectedValidityPeriod.value}-01-01`,
            'vigencia'
          )
        },
      ],
    },
    {
      name: 'document_type',
      label: 'Tipo de documento*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: budget_document_types_by_business,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
      display_label: 'formatted_label',
      filter_options: ['label', 'formatted_label'],
      onChange: (value: number | null) => {
        currentDocumentFilters.value.budgetDocumentTypeId = value ?? undefined

        getDocumentNumbersSelector(
          currentDocumentFilters.value.businessTrustId,
          currentDocumentFilters.value.validityPeriod,
          currentDocumentFilters.value.budgetDocumentTypeId
        )
      },
    },
    {
      name: 'document_number_from',
      label: 'Número de documento desde*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: budget_document_number,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      onChange: (val: number | null) => {
        currentDocumentFilters.value.documentNumberFrom = val ?? undefined
        filtersRef.value?.cleanFiltersByNames(['document_number_to'])

        getAdditionNumbersSelector(
          currentDocumentFilters.value.documentNumberFrom,
          currentDocumentFilters.value.documentNumberTo
        )
      },
      rules: [(val: string) => is_required(val)],
    },
    {
      name: 'document_number_to',
      label: 'Número de documento hasta*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: budget_document_number,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      onChange: (val: number | null) => {
        currentDocumentFilters.value.documentNumberTo = val ?? undefined
        getAdditionNumbersSelector(
          currentDocumentFilters.value.documentNumberFrom,
          currentDocumentFilters.value.documentNumberTo
        )
      },
      rules: [
        (val: string) => is_required(val),
        () => {
          if (
            currentDocumentFilters.value.documentNumberTo &&
            currentDocumentFilters.value.documentNumberFrom
          )
            return min_value(
              currentDocumentFilters.value.documentNumberTo,
              currentDocumentFilters.value.documentNumberFrom
            )
          return true
        },
      ],
    },
    {
      name: 'addition_from',
      label: 'Adición desde',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: operation_logs_authorized,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      onChange: (val: number | null) => {
        currentDocumentFilters.value.additionNumberFrom = val ?? undefined
        filtersRef.value?.cleanFiltersByNames(['addition_to'])
      },
      rules: [
        (val: string) => {
          if (currentDocumentFilters.value.additionNumberTo)
            return is_required(val)
          return true
        },
      ],
    },
    {
      name: 'addition_to',
      label: 'Adición hasta',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: operation_logs_authorized,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      onChange: (val: number | null) => {
        currentDocumentFilters.value.additionNumberTo = val ?? undefined
      },
      rules: [
        (val: string) => {
          if (currentDocumentFilters.value.additionNumberFrom)
            return is_required(val)
          return true
        },

        () => {
          if (
            currentDocumentFilters.value.additionNumberTo &&
            currentDocumentFilters.value.additionNumberFrom
          )
            return min_value(
              currentDocumentFilters.value.additionNumberTo,
              currentDocumentFilters.value.additionNumberFrom
            )
          return true
        },
      ],
    },
  ])

  const tableProps = ref<IBaseTableProps<IBudgetDocumentsListItem>>({
    title: 'Listado de documentos presupuestales',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        sortable: true,
        align: 'left',
      },
      {
        name: 'business',
        field: (row) => row.business_trust?.code ?? '-',
        label: 'Negocio',
        sortable: true,
        align: 'left',
      },
      {
        name: 'business_description',
        field: (row) => row.business_trust?.name ?? '-',
        label: 'Descripción negocio',
        sortable: true,
        align: 'left',
      },
      {
        name: 'validity',
        field: 'vigency',
        label: 'Vigencia',
        sortable: true,
        align: 'left',
      },
      {
        name: 'date',
        field: (row) => formatDate(row.date, 'YYYY-MM-DD'),
        label: 'Fecha',
        sortable: true,
        align: 'left',
      },
      {
        name: 'document_type',
        field: (row) => row.budget_document_type.code ?? '-',
        label: 'Tipo de documento',
        sortable: true,
        align: 'left',
      },
      {
        name: 'document_type_description',
        field: (row) => row.budget_document_type.description ?? '-',
        label: 'Descripción de tipo documento',
        sortable: true,
        align: 'left',
      },
      {
        name: 'document_number',
        field: 'budget_document_number',
        label: 'Número de documento',
        sortable: true,
        align: 'left',
      },
      {
        name: 'addition',
        field: (row) => row.operation_log_document?.id ?? '-',
        label: 'Adición',
        sortable: true,
        align: 'left',
      },
      {
        name: 'responsability_area',
        field: (row) => row.responsability_area.code ?? '-',
        label: 'Área solicitante',
        sortable: true,
        align: 'left',
      },
      {
        name: 'responsability_area_description',
        field: (row) => row.responsability_area.description ?? '-',
        label: 'Descripción área solicitante',
        sortable: true,
        align: 'left',
      },
      {
        name: 'city',
        field: (row) => row.city?.id ?? '-',
        label: 'Ciudad',
        sortable: true,
        align: 'left',
      },
      {
        name: 'city_description',
        field: (row) => row.city?.name ?? '-',
        label: 'Descripción ciudad',
        sortable: true,
        align: 'left',
      },
      {
        name: 'third_party',
        field: (row) => {
          if (!row.third_party) return '-'
          return row.third_party.document
        },
        label: 'Beneficiario',
        sortable: true,
        align: 'left',
      },
      {
        name: 'third_party_description',
        field: (row) => {
          if (!row.third_party) return '-'
          return (
            row.third_party.name ??
            row.third_party.legal_person?.business_name ??
            row.third_party.natural_person?.full_name ??
            '-'
          )
        },
        label: 'Descripción beneficiario',
        sortable: true,
        align: 'left',
      },
      {
        name: 'value',
        field: (row) => formatCurrency(row.value),
        label: 'Valor',
        sortable: true,
        align: 'left',
      },
      {
        name: 'observations',
        field: (row) => row.observations ?? '-',
        label: 'Observaciones',
        sortable: true,
        align: 'left',
      },
      {
        name: 'status',
        field: 'status',
        label: 'Estado',
        required: false,
        sortable: false,
        align: 'left',
      },
      {
        name: 'actions',
        field: 'id',
        label: 'Acciones',
        required: false,
        sortable: false,
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableCustomColumns = ['status', 'actions']

  const isDownloadingFile = ref(false)

  const isEnableToDownloadFile = computed<boolean>(() => {
    return !isDownloadingFile.value && tableProps.value.rows.length > 0
  })

  const selectedDocumentAssociatedDocs = ref<IBudgetDocumentsListItem | null>(
    null
  )

  const selectedDocumentAccountingVoucher =
    ref<IBudgetDocumentsListItem | null>(null)

  const selectedDocumentOrderPayment = ref<IBudgetDocumentsListItem | null>(
    null
  )

  const accountingVoucherModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const paymentOrderModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const getDocumentTypesSelector = async (
    businessTrustId?: number,
    validityPeriod?: string
  ) => {
    filtersRef.value?.cleanFiltersByNames(['document_type'])
    _resetKeys(budgetDocumentTypesKey)

    if (!validityPeriod) {
      return
    }

    openMainLoader(true)
    const filters = businessTrustId
      ? `filter[business_trust_id]=${businessTrustId}&filter[vigency]=${validityPeriod}`
      : `filter[vigency]=${validityPeriod}`
    await _getResources(budgetDocumentTypesKey, filters)
    openMainLoader(false)
  }

  const builBudgetDocumentNumbersFilters = (
    businessTrustId?: number,
    validityPeriod?: string,
    budgetDocumentTypeId?: number
  ): string => {
    if (businessTrustId && budgetDocumentTypeId)
      return `filter[validity]=${validityPeriod}&filter[business_trust_ids]=${businessTrustId}&filter[budget_document_type_id]=${budgetDocumentTypeId}`

    if (businessTrustId && !budgetDocumentTypeId)
      return `filter[validity]=${validityPeriod}&filter[business_trust_ids]=${businessTrustId}`

    if (!businessTrustId && budgetDocumentTypeId)
      return `filter[validity]=${validityPeriod}&filter[budget_document_type_id]=${budgetDocumentTypeId}`

    return `filter[validity]=${validityPeriod}`
  }

  const getDocumentNumbersSelector = async (
    businessTrustId?: number,
    validityPeriod?: string,
    budgetDocumentTypeId?: number
  ) => {
    filtersRef.value?.cleanFiltersByNames([
      'document_number_from',
      'document_number_to',
    ])
    _resetKeys(budgetDocumentNumbersKey)

    if (!validityPeriod) return

    openMainLoader(true)

    const filters = builBudgetDocumentNumbersFilters(
      businessTrustId,
      validityPeriod,
      budgetDocumentTypeId
    )

    await _getResources(budgetDocumentNumbersKey, filters)
    openMainLoader(false)
  }

  const getAdditionNumbersSelector = async (
    documentFrom?: number,
    documentTo?: number
  ) => {
    filtersRef.value?.cleanFiltersByNames(['addition_from', 'addition_to'])

    _resetKeys(budgetAdditionKey)

    if (!documentFrom || !documentTo) return

    openMainLoader(true)
    const filters = `filter[budget_document_range]=true&document_number_from=${documentFrom}&document_number_to=${documentTo}`
    await _getResources(budgetAdditionKey, filters)
    openMainLoader(false)
  }

  // Functions/Methods

  const {
    handleClearFilters,
    handleFilterSearch,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    getFilterFormatValues,
  } = usePaginatedTableList({
    tableProps,
    listPromiseFn: _getDocumentsList,
  })

  const isEnabledViewAction = (): boolean => {
    if (!validateRouter('Budget', 'BudgetDocumentsList', 'show')) return false
    return true
  }

  const isEnabledDownloadAction = (): boolean => {
    if (!validateRouter('Budget', 'BudgetDocumentsList', 'export')) return false
    return true
  }

  const handleDownloadDocument = async () => {
    isDownloadingFile.value = true
    await _downloadDocument(getFilterFormatValues())
    isDownloadingFile.value = false
  }

  const handleAssociatedDocumentClick = (row: IBudgetDocumentsListItem) => {
    selectedDocumentAssociatedDocs.value = row
  }

  const handleAccountingVoucherActionClick = async (
    row: IBudgetDocumentsListItem
  ) => {
    selectedDocumentAccountingVoucher.value = row
    await accountingVoucherModalRef.value?.openModal()
  }

  const handlePaymentOrderActionClick = async (
    row: IBudgetDocumentsListItem
  ) => {
    selectedDocumentOrderPayment.value = row
    await paymentOrderModalRef.value?.openModal()
  }

  const handleGoToShowView = (row: IBudgetDocumentsListItem) => {
    _setFiltersFormat(getFilterFormatValues())
    goToURL('BudgetDocumentsView', row.id)
  }

  // Life cycle hooks

  onBeforeMount(async () => {
    _clearFiltersFormat()
    openMainLoader(true)
    await _getResources(
      accountingKeys,
      'filter[has_budget]=true&filter[can]=true',
      'v2'
    )
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(accountingKeys)
    _resetKeys(budgetDocumentTypesKey)
    _resetKeys(budgetDocumentNumbersKey)
    _resetKeys(budgetAdditionKey)
  })

  return {
    // composable refs and variables
    defaultIconsLucide,

    // Refs and computed props
    headerConfig,
    filtersRef,
    filtersConfig,
    tableProps,
    tableCustomColumns,
    isEnableToDownloadFile,
    isEnabledDownloadAction,
    selectedDocumentAssociatedDocs,
    selectedDocumentAccountingVoucher,
    selectedDocumentOrderPayment,
    accountingVoucherModalRef,
    paymentOrderModalRef,

    // Functions/Methods
    handleClearFilters,
    handleFilterSearch,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    isEnabledViewAction,
    handleDownloadDocument,
    handleAssociatedDocumentClick,
    handleAccountingVoucherActionClick,
    handlePaymentOrderActionClick,
    handleGoToShowView,
  }
}

export default useBudgetDocumentsList
