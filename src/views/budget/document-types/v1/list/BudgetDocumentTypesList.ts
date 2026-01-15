import { storeToRefs } from 'pinia'
// Core
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IBalanceValidationItemResponse,
  IBudgetDocumentTypeItem,
} from '@/interfaces/customs/budget/BudgetDocumentTypes'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetDocumentTypesStore } from '@/stores/budget/document-types'

const useBudgetDocumentTypesList = () => {
  const router = useRouter()
  const { defaultIconsLucide } = useUtils()

  const {
    budget_level_for_documents: budget_levels,
    budget_document_validities,
    budget_document_types_selector,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _getDocumentTypes,
    _getDocumentTypesBalanceValidations,
    _downloadDocumentTypes,
    _deleteAction,
    _deleteBalanceValidation,
    _setEditBalanceValidation,
  } = useBudgetDocumentTypesStore('v1')

  const {
    budget_document_types_list,
    budget_document_types_pages,
    balance_validations_list,
    balance_validations_pages,
  } = storeToRefs(useBudgetDocumentTypesStore('v1'))

  const headerProps = {
    title: 'Tipos de documentos presupuestales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Tipos de documentos presupuestales',
        route: 'BudgetDocumentTypesList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'budget_level_id',
      label: 'Nivel',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: budget_levels,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
    {
      name: 'document_type',
      label: 'Tipo de documento',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: budget_document_types_selector,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'validity',
      label: 'Vigencia',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: budget_document_validities,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código',
    },
  ])

  const filters = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const documentTypeTableProps = ref<IBaseTableProps<IBudgetDocumentTypeItem>>({
    title: 'Listado de documentos presupuestales',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'radio',
        label: 'Seleccionar',
        align: 'center',
        field: 'id',
      },
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
      },
      {
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: (row) => `${row.code ?? '-'}`,
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: (row) => `${row.description || '-'}`,
        sortable: true,
      },
      {
        name: 'level',
        required: true,
        label: 'Nivel',
        align: 'left',
        field: (row) =>
          `${row.level?.name || ''} - ${row.level?.description || ''}`,
        sortable: true,
      },
      {
        name: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: (row) => `${row.validity || '-'}`,
        sortable: true,
      },
      {
        name: 'requires_authorization',
        required: true,
        label: 'Requiere autorización',
        align: 'left',
        field: (row) => `${row.requires_authorization || '-'}`,
        sortable: true,
      },
      {
        name: 'allows_adjustments',
        required: true,
        label: 'Permite ajustes',
        align: 'left',
        field: (row) => `${row.allows_adjustments || '-'}`,
        sortable: true,
      },
      {
        name: 'validity_closure',
        required: true,
        label: 'Cierre de vigencia',
        align: 'left',
        field: (row) => `${row.validity_closure || '-'}`,
        sortable: true,
      },
      {
        name: 'creates_new_document',
        required: true,
        label: 'Constituye nuevo documento',
        align: 'left',
        field: (row) => `${row.creates_new_document || '-'}`,
        sortable: true,
      },
      {
        name: 'allows_additions',
        required: true,
        label: 'Aplica adiciones',
        align: 'left',
        field: (row) => `${row.allows_additions || '-'}`,
        sortable: true,
      },
      {
        name: 'allows_deductions',
        required: true,
        label: 'Aplica deducciones',
        align: 'left',
        field: (row) => `${row.allows_deductions || '-'}`,
        sortable: true,
      },
      {
        name: 'validates_area',
        required: true,
        label: 'Valida área',
        align: 'left',
        field: (row) => `${row.validates_area || '-'}`,
        sortable: true,
      },
      {
        name: 'requires_city',
        required: true,
        label: 'Solicitar ciudad',
        align: 'left',
        field: (row) => `${row.requires_city || '-'}`,
        sortable: true,
      },
      {
        name: 'has_expiration_date',
        required: true,
        label: 'Fecha de expiración',
        align: 'left',
        field: (row) => `${row.has_expiration_date || '-'}`,
        sortable: true,
      },
      {
        name: 'expiration_periodicity',
        required: true,
        label: 'Periodicidad de expiración',
        align: 'left',
        field: (row) => `${row.expiration_periodicity || '-'}`,
        sortable: true,
      },
      {
        name: 'numbering_type',
        required: true,
        label: 'Numeración',
        align: 'left',
        field: (row) => `${row.numbering_type || '-'}`,
        sortable: true,
      },
      {
        name: 'requires_balance_validation_by_document_type',
        required: true,
        label: 'Requiere validación de saldos por tipo de documento',
        align: 'left',
        field: (row) =>
          `${row.requires_balance_validation_by_document_type || ''}`,
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
    pages: { currentPage: 1, lastPage: 1 },
  })

  const listAction = async () => {
    documentTypeTableProps.value.rows = []
    documentTypeTableProps.value.loading = true
    await _getDocumentTypes(filters.value)
    documentTypeTableProps.value.loading = false
  }

  watch(
    () => budget_document_types_list.value,
    () => {
      documentTypeTableProps.value.rows = budget_document_types_list.value
      documentTypeTableProps.value.pages = {
        ...budget_document_types_pages.value,
      }
    }
  )

  const search = ($filters: Record<string, string | number>) => {
    filters.value = {
      ...$filters,
      page: 1,
      rows: filters.value.rows,
    }

    listAction()
  }

  const updatePage = async (page: number) => {
    filters.value.page = page
    await listAction()
  }

  const updateRowsPerPage = async (rows: number) => {
    filters.value.page = 1
    filters.value.rows = rows

    await listAction()
  }

  const clearFilters = () => {
    documentTypeTableProps.value.rows = []
    filters.value = {
      rows: filters.value.rows,
      page: 1,
    }
  }

  const balanceValidationFilters = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const selectedDocumentType = ref<IBudgetDocumentTypeItem | null>(null)

  const getDocumentTypeBalancesValidation = () => {
    balanceValidationTableProps.value.rows = []
    if (!selectedDocumentType.value) return
    _getDocumentTypesBalanceValidations(
      selectedDocumentType.value.id,
      balanceValidationFilters.value
    )
  }

  const selectDocumentType = (selected: IBudgetDocumentTypeItem) => {
    documentTypeTableProps.value.rows = documentTypeTableProps.value.rows.map(
      (row) => ({
        ...row,
        selected: row.id === selected.id,
      })
    )
    selectedDocumentType.value = { ...selected }
    getDocumentTypeBalancesValidation()
  }

  const updateBalanceValidationPage = async (page: number) => {
    balanceValidationFilters.value.page = page
    getDocumentTypeBalancesValidation()
  }

  const updateBalanceValidationRowsPerPage = async (rows: number) => {
    balanceValidationFilters.value.page = 1
    balanceValidationFilters.value.rows = rows

    getDocumentTypeBalancesValidation()
  }

  const balanceValidationTableProps = ref<
    IBaseTableProps<IBalanceValidationItemResponse>
  >({
    title: 'Listado de validación de saldos por tipo de documento',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
      },
      {
        name: 'structure',
        required: true,
        label: 'Estructura presupuestal',
        align: 'left',
        field: (row) =>
          `${row.budget_item_structure.code}-${row.area_structure.code}`,
        sortable: true,
      },
      {
        name: 'movement_code',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: (row) => `${row.movement_code.code || '-'}`,
        sortable: true,
      },
      {
        name: 'movement_code_description',
        required: true,
        label: 'Descripción código de movimiento',
        align: 'left',
        field: (row) => `${row.movement_code.description || ''}`,
        sortable: true,
      },
      {
        name: 'level',
        required: true,
        label: 'Nivel del que valida el saldo',
        align: 'left',
        field: (row) => `${row.balance_validation_level.level || '-'}`,
        sortable: true,
      },
      {
        name: 'level_description',
        required: true,
        label: 'Descripción nivel',
        align: 'left',
        field: (row) => `${row.balance_validation_level.description || '-'}`,
        sortable: true,
      },
      {
        name: 'document_type',
        required: true,
        label: 'Tipo de documento del que valida el saldo',
        align: 'left',
        field: (row) => `${row.validates_document_type.code || '-'}`,
        sortable: true,
      },
      {
        name: 'document_type description',
        required: true,
        label: 'Descripción tipo de documento',
        align: 'left',
        field: (row) => `${row.validates_document_type.description || '-'}`,
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
    pages: { currentPage: 1, lastPage: 1 },
  })

  watch(
    () => balance_validations_list.value,
    () => {
      balanceValidationTableProps.value.rows = balance_validations_list.value

      balanceValidationTableProps.value.pages = {
        ...balance_validations_pages.value,
      }
    }
  )

  const downloadDocumentTypes = () => {
    const { rows, page, ...exportFilters } = filters.value
    _downloadDocumentTypes(exportFilters)
  }

  onMounted(() => {
    _resetKeys({
      budget: [
        'budget_levels',
        'budget_document_validities',
        'budget_document_types',
      ],
    })
    _getResources({
      budget: [
        'budget_levels',
        'budget_document_validities',
        'budget_document_types',
      ],
    })
  })

  const deleteDocumentTypeModalRef = ref()
  let selectedDocumentTypeId = 0

  const openDeleteConfirmationModal = (id: number) => {
    selectedDocumentTypeId = id
    deleteDocumentTypeModalRef.value.openModal()
  }

  const deleteDocumentType = async () => {
    const success = await _deleteAction(selectedDocumentTypeId)
    if (success) {
      deleteDocumentTypeModalRef.value.closeModal()
      listAction()
    }
    selectedDocumentTypeId = 0
  }

  const editBalanceValidation = (
    data: IBalanceValidationItemResponse,
    balanceValidationId: number
  ) => {
    _setEditBalanceValidation(data)
    router.push({
      name: 'BudgetDocumentTypesBalanceValidationEdit',
      params: { id: selectedDocumentType.value?.id || '' },
      query: { balanceValidationId: balanceValidationId.toString() },
    })
  }

  const deleteBalanceValidationModalRef = ref()
  let selectedBalanceValidationId = 0

  const openDeleteBalanceValidationModal = (id: number) => {
    selectedBalanceValidationId = id
    deleteBalanceValidationModalRef.value.openModal()
  }

  const deleteBalanceValidation = async () => {
    const success = await _deleteBalanceValidation(selectedBalanceValidationId)
    if (success) {
      deleteBalanceValidationModalRef.value.closeModal()
      getDocumentTypeBalancesValidation()
    }
    selectedBalanceValidationId = 0
  }

  return {
    headerProps,
    filterConfig,
    defaultIconsLucide,
    selectedDocumentType,
    documentTypeTableProps,
    deleteDocumentTypeModalRef,
    deleteBalanceValidationModalRef,
    balanceValidationTableProps,
    search,
    updatePage,
    clearFilters,
    updateRowsPerPage,
    selectDocumentType,
    deleteDocumentType,
    downloadDocumentTypes,
    openDeleteConfirmationModal,
    openDeleteBalanceValidationModal,
    deleteBalanceValidation,
    updateBalanceValidationPage,
    updateBalanceValidationRowsPerPage,
    editBalanceValidation,
  }
}

export default useBudgetDocumentTypesList
