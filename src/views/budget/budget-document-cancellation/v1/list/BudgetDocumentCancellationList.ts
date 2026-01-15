// Vue - pinia - moment
import { ref, onBeforeMount, onBeforeUnmount, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QForm } from 'quasar'
import { IBaseTableProps } from '@/interfaces/global'
import {
  IFieldFilters,
  IFiltersFormat,
  IGenericResource,
  ResourceTypes,
} from '@/interfaces/customs'
import {
  IBudgetDocumentAccountingVoucherForm,
  IBudgetDocumentCancellation,
  IBudgetDocumentCancellationOperation,
  IBudgetDocumentCancellationPayload,
  IBudgetDocumentDetail,
  IBudgetDocumentErrorLogPayload,
  IBudgetOperation,
  IBudgetTransfer,
} from '@/interfaces/customs/budget/BudgetDocumentCancellation'

// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Composables
import { useRules, useMainLoader, useUtils, useAlert } from '@/composables'

// Stores
import {
  useAccountingResourceStore,
  useResourceManagerStore,
} from '@/stores/resources-manager'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetDocumentCancellationStore } from '@/stores/budget/budget-document-cancellation'

// Constants
import { BUDGET_DOCUMENT_CANCELLATION_CANCELLABLE_STATUSES } from '@/constants/resources/budget'

const useBudgetDocumentCancellationList = () => {
  const { is_required } = useRules()
  const { openMainLoader } = useMainLoader()
  const { formatCurrency, isEmptyObject } = useUtils()
  const { showAlert } = useAlert()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { budget_document_types, budget_document_number_unique_value } =
    storeToRefs(useBudgetResourceStore('v1'))

  const { business_trusts_selector: business_trusts } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const {
    _getDocumentCancellationWithDetailsById,
    _cancelBudgetDocument,
    _downloadDocumentCancellationErrorLogs,
  } = useBudgetDocumentCancellationStore('v1')

  const documentCancellation = ref<IBudgetDocumentCancellation | null>(null)

  const headerConfig = {
    title: 'Anulación de documentos presupuestales',
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
        label:
          'Anulación de documentos presupuestales de comisiones fiduciarias',
        route: 'BudgetDocumentCancellationsList',
      },
    ],
  }

  // Refs & computed props

  const filtersRef = ref<InstanceType<typeof FiltersComponentV2> | null>(null)

  const filtersFormat = ref<IFiltersFormat>({})

  const filtersConfig = ref<IFieldFilters[]>([
    {
      name: 'validity_period',
      label: 'Vigencia',
      type: 'q-date',
      value: null,
      placeholder: 'YYYY',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      mask: 'YYYY',
      navigation_min_year: '2000/01',
      rules: [(val: string) => is_required(val)],
    },
    {
      name: 'business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [(val: string) => is_required(val)],
    },
    {
      name: 'business_trust_description',
      label: 'Descripción Negocio',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'budget_document_type_id',
      label: 'Tipo de documento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: budget_document_types,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [(val: string) => is_required(val)],
    },
    {
      name: 'budget_document_type_description',
      label: 'Descripción tipo de documento',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'id',
      label: 'Número de documento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: budget_document_number_unique_value,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [(val: string) => is_required(val)],
    },
  ])

  const details = computed(() => {
    if (documentCancellation.value?.operation)
      return documentCancellation.value.operation.details

    if (documentCancellation.value?.transfer)
      return documentCancellation.value.transfer.details

    return []
  })

  const documentCancellationData = computed<
    IBudgetOperation | IBudgetTransfer | null
  >(() => {
    if (documentCancellation.value?.operation)
      return documentCancellation.value.operation
    if (documentCancellation.value?.transfer)
      return documentCancellation.value.transfer
    return null
  })

  const detailsTableProps = ref<IBaseTableProps<IBudgetDocumentDetail>>({
    title: 'Listado de registros de documentos presupuestales',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'validity_period',
        field: () => {
          if (documentCancellationData.value)
            return documentCancellationData.value.document_year
          return '-'
        },
        label: 'Vigencia',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'month',
        field: 'month',
        label: 'Mes',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'budget_item',
        field: (row: IBudgetDocumentDetail) => row.budget_item.code,
        label: 'Rubro presupuestal',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'budget_item_description',
        field: (row: IBudgetDocumentDetail) => row.budget_item.description,
        label: 'Descripción rubro presupuestal',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'resource',
        field: (row: IBudgetDocumentDetail) => row.budget_resource.code,
        label: 'Recurso',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'resource_description',
        field: (row: IBudgetDocumentDetail) => row.budget_resource.description,
        label: 'Descripción recurso',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'area',
        field: (row: IBudgetDocumentDetail) => row.areas_responsibility.code,
        label: 'Área',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'area_description',
        field: (row: IBudgetDocumentDetail) =>
          row.areas_responsibility.description,
        label: 'Descripción área',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'observations',
        field: () => {
          if (documentCancellation.value?.operation)
            return documentCancellation.value.operation.observations

          if (documentCancellation.value?.transfer)
            return documentCancellation.value.transfer.observations
        },
        label: 'Observaciones',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'value',
        field: (row: IBudgetDocumentDetail) => formatCurrency(row.value),
        label: 'Valor',
        required: false,
        sortable: true,
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const isDisabledErrorLogsButton = ref<boolean>(true)

  const isDisabledCancelButton = computed<boolean>(() => {
    if (detailsTableProps.value.rows.length > 0) return false
    return true
  })

  const accountingVoucherFormRef = ref<InstanceType<typeof QForm> | null>(null)

  const accountingVoucherFormInitValues: IBudgetDocumentAccountingVoucherForm =
    { period: '', cancellation_date: '' }

  const accountingVoucherFormModels = ref<IBudgetDocumentAccountingVoucherForm>(
    { ...accountingVoucherFormInitValues }
  )

  const futureValidityModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const pastValidityModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const documentStatusModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const documentMovementsModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const documentDerivativeContractingModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const documentAccountingVoucherModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const documentAccountingVoucherFormModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const documentCancellationConfirmModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  // Functions/Methods
  const setFieldDescription = (
    fieldName: string,
    optionId: number | undefined,
    options: IGenericResource[]
  ) => {
    if (!optionId) {
      filtersRef.value?.cleanFiltersByNames([fieldName])
      return
    }

    const option = options.find((item) => item.id === optionId)

    if (!option) return

    filtersRef.value?.setFieldValueByName(fieldName, option.description ?? '-')
  }

  const handleFiltersUpdate = (filters: IFiltersFormat) => {
    const {
      'filter[budget_document_type_id]': budgetDocumentTypeId,
      'filter[business_trust_id]': businessTrustId,
    } = filters

    setFieldDescription(
      'budget_document_type_description',
      budgetDocumentTypeId as number | undefined,
      budget_document_types.value
    )

    setFieldDescription(
      'business_trust_description',
      businessTrustId as number | undefined,
      business_trusts.value
    )
  }

  const hasMatchedOperationTypeInResponse = (
    operationType: IBudgetDocumentCancellationOperation,
    response: IBudgetDocumentCancellation | null
  ): boolean => {
    if (!response) return false
    if (response[operationType] !== null) return true
    return false
  }

  const getDocumentAction = async (filters: IFiltersFormat) => {
    const { 'filter[id]': documentNumberValue, ...restFilters } = filters

    const documentNumber = budget_document_number_unique_value.value.find(
      (d) => d.value === documentNumberValue
    )

    if (!documentNumber) return

    detailsTableProps.value.rows = []
    detailsTableProps.value.loading = true

    const resp = await _getDocumentCancellationWithDetailsById({
      ...restFilters,
      'filter[id]': documentNumber.id,
      operation_type: documentNumber.operation_type,
    })

    const hasResponseMatched = hasMatchedOperationTypeInResponse(
      documentNumber.operation_type as IBudgetDocumentCancellationOperation,
      resp
    )

    if (hasResponseMatched) documentCancellation.value = resp

    detailsTableProps.value.loading = false
  }

  const handleClearFilters = () => {
    detailsTableProps.value.rows = []
  }

  const handleFilterSearch = async (rawFilters: IFiltersFormat) => {
    const {
      'filter[budget_document_type_description]': _budgetDocumentTypeDesc,
      'filter[business_trust_description]': _businessTrustDesc,
      ...filters
    } = rawFilters

    filtersFormat.value = { ...filters }

    isDisabledErrorLogsButton.value = true

    const selectedBusiness = business_trusts.value.find(
      (b) => b.id === filters['filter[business_trust_id]']
    )

    const validityPeriod = Number(filters['filter[validity_period]'])

    if (!selectedBusiness || !selectedBusiness.budget) {
      showAlert(
        'El negocio no maneja presupuesto. No se puede realizar anulación',
        'error'
      )
      return
    }

    // Future validity
    if (validityPeriod > selectedBusiness.budget.validity) {
      await futureValidityModalRef.value?.openModal()
      return
    }

    // Past validity
    if (validityPeriod < selectedBusiness.budget.validity) {
      await pastValidityModalRef.value?.openModal()
      return
    }

    // Present validity
    await getDocumentAction(filtersFormat.value)
  }

  const documentDetailsPerPage = ref<number>(20)

  const setDetailsListPagination = () => {
    detailsTableProps.value.pages.lastPage =
      details.value.length > 0
        ? Math.ceil(details.value.length / documentDetailsPerPage.value)
        : 1

    const page =
      detailsTableProps.value.pages.currentPage <=
      detailsTableProps.value.pages.lastPage
        ? detailsTableProps.value.pages.currentPage
        : 1

    detailsTableProps.value.rows = details.value.slice(
      (page - 1) * documentDetailsPerPage.value,
      page * documentDetailsPerPage.value
    )
  }

  const handleUpdatePage = async (page: number) => {
    detailsTableProps.value.pages.currentPage = page
    setDetailsListPagination()
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    documentDetailsPerPage.value = rows
    detailsTableProps.value.pages.currentPage = 1
    setDetailsListPagination()
  }

  const isDocumentOperation = (
    documentData: IBudgetOperation | IBudgetTransfer
  ): documentData is IBudgetOperation => 'business_trust_id' in documentData

  const buildErrorLogsPayload = (): IBudgetDocumentErrorLogPayload | null => {
    const { 'filter[id]': documentId } = filtersFormat.value

    if (
      !documentId ||
      !documentCancellation.value ||
      !documentCancellationData.value
    )
      return null

    return {
      id: documentId as number,
      operation_type: isDocumentOperation(documentCancellationData.value)
        ? 'operation'
        : 'transfer',
    }
  }

  const buildCancellationPayload =
    (): IBudgetDocumentCancellationPayload | null => {
      const { 'filter[business_trust_id]': businessTrustId } =
        filtersFormat.value

      if (
        !businessTrustId ||
        !documentCancellation.value ||
        !documentCancellationData.value
      )
        return null

      const accountingVoucherFormData = !isEmptyObject(
        accountingVoucherFormModels.value
      )
        ? {
            ...accountingVoucherFormModels.value,
            period: Number(
              accountingVoucherFormModels.value.period.replace('-', '')
            ),
          }
        : {}

      return {
        id: documentCancellationData.value.id,
        operation_type: isDocumentOperation(documentCancellationData.value)
          ? 'operation'
          : 'transfer',
        business_trust_id: businessTrustId as number,
        ...accountingVoucherFormData,
      }
    }

  const handlePastValidityModalConfirm = async () => {
    pastValidityModalRef.value?.closeModal()
    await getDocumentAction(filtersFormat.value)
  }

  const handleDocumentStatusModalConfirm = () => {
    documentStatusModalRef.value?.closeModal()
  }

  const handleDocumentMovementsModalConfirm = () => {
    documentMovementsModalRef.value?.closeModal()
  }

  const handleDocumentDerivativeContractingModalConfirm = () => {
    documentDerivativeContractingModalRef.value?.closeModal()
  }

  const handleDocumentAccountingVoucherConfirm = async () => {
    accountingVoucherFormModels.value = { ...accountingVoucherFormInitValues }
    await documentAccountingVoucherFormModalRef.value?.openModal()
    documentAccountingVoucherModalRef.value?.closeModal()
  }

  const handleDocumentAccountingVoucherFormConfirm = async () => {
    documentAccountingVoucherFormModalRef.value?.closeModal()
    await documentCancellationConfirmModalRef.value?.openModal()
  }

  const handleDocumentCancellationCancel = async () => {
    accountingVoucherFormModels.value = { ...accountingVoucherFormInitValues }
  }

  const handleDocumentCancellationConfirm = async () => {
    const payload = buildCancellationPayload()

    if (!payload) return

    openMainLoader(true)
    const response = await _cancelBudgetDocument(payload)
    openMainLoader(false)

    isDisabledErrorLogsButton.value = !response.hasGeneratedErrorLogs

    documentCancellationConfirmModalRef.value?.closeModal()
  }

  const handleCancelDocument = async () => {
    if (!documentCancellation.value || !documentCancellationData.value) return

    // Modal validations
    // Document Status
    if (
      !BUDGET_DOCUMENT_CANCELLATION_CANCELLABLE_STATUSES.includes(
        documentCancellationData.value.status.id
      )
    ) {
      await documentStatusModalRef.value?.openModal()
      return
    }

    // Document movements
    if (documentCancellation.value.has_movements) {
      await documentMovementsModalRef.value?.openModal()
      return
    }

    // Document contract validation
    if (documentCancellation.value.has_derivative_contracting) {
      await documentDerivativeContractingModalRef.value?.openModal()
      return
    }

    // Document accounting voucher validation
    if (documentCancellation.value.has_accounting_vouchers) {
      await documentAccountingVoucherModalRef.value?.openModal()
      return
    }

    await documentCancellationConfirmModalRef.value?.openModal()
  }

  const handleDownloadErrorLogs = async () => {
    if (isDisabledErrorLogsButton.value) return
    const payload = buildErrorLogsPayload()

    if (!payload) return

    openMainLoader(true)
    await _downloadDocumentCancellationErrorLogs(payload)
    openMainLoader(false)
  }

  // Watchers
  watch(details, () => setDetailsListPagination())

  // Life cycle hooks

  const bugetKeys: ResourceTypes = {
    budget: ['budget_document_types', 'budget_document_number'],
  }

  const accountingKeys: ResourceTypes = {
    accounting: ['business_trusts_selector'],
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await Promise.all([
      _getResources(bugetKeys),
      _getResources(
        accountingKeys,
        'filter[has_budget]=true&filter[can]=true',
        'v2'
      ),
    ])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({ ...bugetKeys, ...accountingKeys })
  })

  return {
    // composable functions
    is_required,

    // Refs and computed props
    headerConfig,
    filtersRef,
    filtersConfig,
    detailsTableProps,
    isDisabledErrorLogsButton,
    isDisabledCancelButton,
    accountingVoucherFormRef,
    accountingVoucherFormModels,
    futureValidityModalRef,
    pastValidityModalRef,
    documentStatusModalRef,
    documentMovementsModalRef,
    documentDerivativeContractingModalRef,
    documentAccountingVoucherModalRef,
    documentAccountingVoucherFormModalRef,
    documentCancellationConfirmModalRef,

    // Functions/Methods
    handleFiltersUpdate,
    handleClearFilters,
    handleFilterSearch,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    handlePastValidityModalConfirm,
    handleCancelDocument,
    handleDownloadErrorLogs,
    handleDocumentStatusModalConfirm,
    handleDocumentMovementsModalConfirm,
    handleDocumentDerivativeContractingModalConfirm,
    handleDocumentAccountingVoucherConfirm,
    handleDocumentAccountingVoucherFormConfirm,
    handleDocumentCancellationCancel,
    handleDocumentCancellationConfirm,
  }
}

export default useBudgetDocumentCancellationList
