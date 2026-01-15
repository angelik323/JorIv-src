// vue - router - pinia
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'
// Interfaces & types
import type { IFieldFilters } from '@/interfaces/customs/Filters'
import type {
  IOperationAuthorization,
  IOperationAuthorizationRow,
  ISelectedOperationItem,
} from '@/interfaces/customs/budget/OperationAuthorizations'
// Composable
import {
  useMainLoader,
  useGoToUrl,
  useUtils,
  useRouteValidator,
  useRules,
} from '@/composables'
// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useOperationAuthorizationsStore } from '@/stores/budget/operation-authorizations'
import { IBaseTableProps } from '@/interfaces/global'

const useOperationAuthorizationsList = () => {
  const { defaultIconsLucide, formatCurrency } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const {
    business_trusts,
    budget_document_transfer_type: budget_document_types_selector,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _clearData, _listAction, _processAction } =
    useOperationAuthorizationsStore('v1')

  const { operations_list, operations_pages } = storeToRefs(
    useOperationAuthorizationsStore('v1')
  )

  const { openMainLoader } = useMainLoader()

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await Promise.all([
      _getResources(
        { budget: ['business_trusts'] },
        'filter[status_id]=59,57,67&can_manage=true'
      ),
      _getResources({ budget: ['budget_document_types_selector'] }),
    ])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({
      budget: ['business_trusts', 'budget_document_types_selector'],
    })
  })

  const headerProps = {
    title: 'Autorización de operaciones',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Autorización de operaciones',
        route: 'OperationAuthorizationsList',
      },
    ],
  }

  // Estado para las operaciones seleccionadas
  const selectedOperations = ref<IOperationAuthorizationRow[]>([])

  const tableProps = ref<IBaseTableProps<IOperationAuthorization>>({
    title: 'Listado de operaciones',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'rowNumber',
        required: true,
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'document_type',
        required: true,
        label: 'Tipo de documento',
        field: (row: IOperationAuthorization) =>
          `${row.budget_document_type?.code || '-'} - ${
            row.budget_document_type?.description || '-'
          }`,
        align: 'left',
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'Número de documento',
        field: (row: IOperationAuthorization) =>
          row.budget_document_type?.id ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'transfer_number',
        label: 'Número de traslado',
        field: 'resolution_number',
        align: 'left',
        sortable: true,
      },
      {
        name: 'nature',
        label: 'Naturaleza',
        field: (row: IOperationAuthorization) =>
          row.details
            ?.map((detail) => detail.nature?.toString() ?? '')
            .filter(Boolean)
            .join(', ') || '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'addition_number',
        label: 'Adición',
        field: 'addition_number',
        align: 'left',
        sortable: true,
      },
      {
        name: 'operation_date',
        label: 'Fecha',
        field: 'date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'value',
        label: 'Valor',
        field: (row: IOperationAuthorization) =>
          formatCurrency(
            `${
              row.operation_type === 'operation'
                ? row.total_value
                : row.total_amount ?? '0.00'
            }`
          ),
        align: 'right',
        sortable: true,
      },
      {
        name: 'third_party',
        label: 'Tercero',
        field: (row: IOperationAuthorization) => {
          const beneficiary = row.third_party_beneficiary?.[0]
          if (!beneficiary) return '-'
          const name =
            beneficiary.legal_person?.business_name ??
            beneficiary.natural_person?.full_name ??
            '-'
          return `${beneficiary.document} - ${name}`
        },
        align: 'left',
        sortable: true,
      },
      {
        name: 'rejection_reason',
        label: 'Motivos de rechazo',
        field: 'rejection_reason',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const filtersRef = ref()

  const setBusinessDescription = (business_trust_id: number) => {
    filtersRef.value.cleanFiltersByNames(['business_description'])
    const selectedBusiness = business_trusts.value.find(
      (item) => item.value === business_trust_id
    )
    if (selectedBusiness) {
      filtersRef.value.setFieldValueByName(
        'business_description',
        selectedBusiness.name
      )
    }
  }

  const setDocumentTypeDescription = (document_type_id: number) => {
    filtersRef.value.cleanFiltersByNames(['document_type_description'])
    const selectedDocumentType = budget_document_types_selector.value.find(
      (item) => item.value === document_type_id
    )
    if (selectedDocumentType) {
      filtersRef.value.setFieldValueByName(
        'document_type_description',
        selectedDocumentType.description
      )
    }
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      autocomplete: true,
      options: business_trusts,
      custom_selection_label: 'business_code',
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
      rules: [(val) => useRules().is_required(val, 'El negocio es requerido')],
      onChange: setBusinessDescription,
    },
    {
      name: 'business_description',
      label: 'Descripción negocio*',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-4 q-py-md',
      placeholder: '',
      disable: true,
      clean_value: true,
      readonly: true,
    },
    {
      name: 'validity_period',
      label: 'Vigencia*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA',
      mask: 'YYYY',
      rules: [(val) => useRules().is_required(val, 'La vigencia es requerida')],
    },
    {
      name: 'budget_document_type_id',
      label: 'Tipo de documento*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: budget_document_types_selector,
      custom_selection_label: 'code',
      autocomplete: true,
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
      rules: [
        (val) =>
          useRules().is_required(val, 'El tipo de documento es requerido'),
      ],
      onChange: setDocumentTypeDescription,
    },
    {
      name: 'document_type_description',
      label: 'Descripción documento*',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-4 q-py-md',
      placeholder: '',
      disable: true,
      clean_value: false,
      readonly: true,
    },
    {
      name: 'date',
      label: 'Fecha*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      placeholder: 'AAAA-MM-DD',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      rules: [(val) => useRules().is_required(val, 'La fecha es requerida')],
    },
  ])

  // Filtros
  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const handleFilter = async (filters: Record<string, string | number>) => {
    filtersFormat.value = {
      ...filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    await listAction()
  }

  const handleClearFilters = async () => {
    _clearData()
    selectedOperations.value = []
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value.rows = rowsPerPage
    filtersFormat.value.page = 1
    listAction()
  }

  const listAction = async () => {
    tableProps.value.loading = true
    await _listAction(filtersFormat.value)
    tableProps.value.loading = false
  }

  // Modales para autorizar y rechazar
  const approveModalRef = ref()
  const rejectModalRef = ref()
  const rejectionReasonRef = ref('')

  const openApproveModal = () => {
    if (selectedOperations.value.length === 0) return
    approveModalRef.value.openModal()
  }

  const openRejectModal = () => {
    if (selectedOperations.value.length === 0) return
    rejectionReasonRef.value = ''
    rejectModalRef.value.openModal()
  }

  const getSelectedOperationItems = (): ISelectedOperationItem[] => {
    return selectedOperations.value.map((item: IOperationAuthorizationRow) => ({
      id: item.id as string,
      type: item.operation_type || 'operation',
    }))
  }

  const handleApprove = async () => {
    approveModalRef.value.closeModal()
    openMainLoader(true)

    const success = await _processAction({
      action: 'authorize',
      operations: getSelectedOperationItems(),
    })

    openMainLoader(false)

    if (success) {
      selectedOperations.value = []
      await listAction()
    }
  }

  const handleReject = async () => {
    rejectModalRef.value.closeModal()
    openMainLoader(true)

    const success = await _processAction({
      action: 'reject',
      rejection_reason: rejectionReasonRef.value,
      operations: getSelectedOperationItems(),
    })

    openMainLoader(false)

    if (success) {
      selectedOperations.value = []
      rejectionReasonRef.value = ''
      await listAction()
    }
  }

  // Computed para habilitar/deshabilitar botones
  const hasSelectedOperations = computed(
    () => selectedOperations.value.length > 0
  )

  // Verificar si la operación es editable (solo "Origen" en traslados)
  const isOperationEditable = (row: IOperationAuthorization) => {
    // Nueva lógica basada en operation_type
    if (row.operation_type === 'transfer') {
      // Editable solo si alguna detail indica ORIGEN
      const hasOrigin = Array.isArray(row.details)
        ? row.details.some((d) => String(d?.nature).toUpperCase() === 'ORIGEN')
        : false
      return hasOrigin
    }
    // Operaciones normales son editables
    return true
  }

  // Watch para actualizar rows cuando cambie el store
  watch(
    () => operations_list.value,
    () => {
      tableProps.value.rows = operations_list.value

      tableProps.value.pages = {
        currentPage: operations_pages.value.currentPage,
        lastPage: operations_pages.value.lastPage,
      }
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    defaultIconsLucide,
    selectedOperations,
    approveModalRef,
    rejectModalRef,
    rejectionReasonRef,
    hasSelectedOperations,
    filtersRef,
    handleFilter,
    updatePage,
    handleClearFilters,
    validateRouter,
    updatePerPage,
    goToURL,
    openApproveModal,
    openRejectModal,
    handleApprove,
    handleReject,
    isOperationEditable,
  }
}

export default useOperationAuthorizationsList
