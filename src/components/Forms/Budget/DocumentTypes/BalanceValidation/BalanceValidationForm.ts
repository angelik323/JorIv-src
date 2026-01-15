// Core
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps, WriteActionType } from '@/interfaces/global'
import { IBalanceValidationItemModel } from '@/interfaces/customs/budget/BudgetDocumentTypes'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useBalanceValidationForm = (props: {
  action: WriteActionType
  data?: IBalanceValidationItemModel[]
}) => {
  const {
    budget_level_for_documents: budget_levels,
    budget_document_validities,
    budget_document_numbering_types,
    budget_document_expiration_periodicities,
    code_movements_types_contracting: code_movements,
    budget_document_transfer_type: budget_document_types_selector,
    accounting_budget_mapping_parameters,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const { defaultIconsLucide } = useUtils()

  const formRef = ref()

  const models = ref<IBalanceValidationItemModel[]>([
    {
      accounting_budget_mapping_parameter_id: null,
      budget_item_structure: null,
      resource_structure: null,
      area_structure: null,
      code_movement_id: null,
      movement_code_description: null,
      balance_validation_level_id: null,
      balance_validation_level_description: null,
      validates_document_type: false,
      validated_document_type_id: null,
      validated_document_type_description: null,
    },
  ])

  const tableProps = ref<IBaseTableProps<IBalanceValidationItemModel>>({
    title: 'Listado de saldos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'budget_accounting_mapping_parameter_id',
        required: true,
        label: 'Estructura presupuestal',
        align: 'left',
        field: (row) => `${row.accounting_budget_mapping_parameter_id ?? ''}`,
        sortable: true,
      },
      {
        name: 'budget_item_structure',
        required: true,
        label: 'Estructura rubro presupuestal',
        align: 'left',
        field: (row) => `${row.budget_item_structure ?? ''}`,
        sortable: true,
      },
      {
        name: 'resource_structure',
        required: true,
        label: 'Estructura recurso',
        align: 'left',
        field: (row) => `${row.resource_structure ?? ''}`,
        sortable: true,
        style: 'min-width: 250px',
      },
      {
        name: 'area_structure',
        required: true,
        label: 'Estructura área',
        align: 'left',
        field: (row) => `${row.area_structure ?? ''}`,
        sortable: true,
        style: 'min-width: 250px',
      },
      {
        name: 'code_movement_id',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: (row) => `${row.code_movement_id ?? ''}`,
        sortable: true,
      },
      {
        name: 'movement_code_description',
        required: true,
        label: 'Descripción código de movimiento',
        align: 'left',
        field: (row) => `${row.movement_code_description ?? ''}`,
        sortable: true,
      },
      {
        name: 'balance_validation_level_id',
        required: true,
        label: 'Nivel del que valida el saldo',
        align: 'left',
        field: (row) => `${row.balance_validation_level_id ?? ''}`,
        sortable: true,
      },
      {
        name: 'balance_validation_level_description',
        required: true,
        label: 'Descripción nivel',
        align: 'left',
        field: (row) => `${row.balance_validation_level_description ?? ''}`,
        sortable: true,
        style: 'min-width: 250px',
      },
      {
        name: 'validates_document_type',
        required: true,
        label: 'Valida tipo de documento',
        align: 'left',
        field: (row) => `${row.validates_document_type ?? ''}`,
        sortable: true,
      },
      {
        name: 'validated_document_type_id',
        required: true,
        label: 'Tipo de documento del que valida el saldo',
        align: 'left',
        field: (row) => `${row.validated_document_type_id ?? ''}`,
        sortable: true,
      },
      {
        name: 'validation_documento_type_description',
        required: true,
        label: 'Descripción tipo de documento',
        align: 'left',
        field: (row) => `${row.validated_document_type_description ?? ''}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'accounting_budget_mapping_parameter_id',
      },
    ],
    rows: [...models.value],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const addBalanceRow = () => {
    models.value.push({
      accounting_budget_mapping_parameter_id: null,
      budget_item_structure: null,
      resource_structure: null,
      area_structure: null,
      code_movement_id: null,
      movement_code_description: null,
      balance_validation_level_id: null,
      balance_validation_level_description: null,
      validates_document_type: false,
      validated_document_type_id: null,
      validated_document_type_description: null,
    })
    tableProps.value.rows = models.value
    updateTableRows()
  }

  const selectBudgetStructure = (
    row: IBalanceValidationItemModel,
    accounting_budget_mapping_parameter_id: number
  ) => {
    row.accounting_budget_mapping_parameter_id =
      accounting_budget_mapping_parameter_id
    const selectedBudgetStructure =
      accounting_budget_mapping_parameters.value.find(
        (item) => item.id === accounting_budget_mapping_parameter_id
      )

    if (!selectedBudgetStructure) return
    row.budget_item_structure = `${selectedBudgetStructure.budgetItem.code} - ${selectedBudgetStructure.budgetItem.description}`
    row.resource_structure = `${selectedBudgetStructure.budgetResource.code} - ${selectedBudgetStructure.budgetResource.description}`
    row.area_structure = `${selectedBudgetStructure.responsabilityArea.code} - ${selectedBudgetStructure.responsabilityArea.description}`
  }

  let perPage = 20

  const updateTableRows = () => {
    tableProps.value.pages.lastPage = Math.ceil(models.value.length / perPage)
    let { currentPage } = tableProps.value.pages

    if (currentPage > tableProps.value.pages.lastPage) {
      currentPage = tableProps.value.pages.lastPage
    }

    tableProps.value.rows = models.value.slice(
      (currentPage - 1) * perPage,
      (currentPage - 1) * perPage + perPage
    )
  }

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
    updateTableRows()
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    tableProps.value.pages.lastPage = Math.ceil(models.value.length / perPage)
    updatePage(1)
  }

  watch(
    () => props.data,
    () => {
      if (props.data) models.value = [...props.data]
      tableProps.value.rows = models.value
    }
  )

  const deleteBalanceValidation = (row: IBalanceValidationItemModel) => {
    const index = models.value.indexOf(row)
    if (index > -1) {
      models.value.splice(index, 1)
      updateTableRows()
    }
  }

  return {
    models,
    formRef,
    tableProps,
    budget_levels,
    code_movements,
    defaultIconsLucide,
    budget_document_validities,
    budget_document_types_selector,
    budget_document_numbering_types,
    accounting_budget_mapping_parameters,
    budget_document_expiration_periodicities,
    updatePage,
    updatePerPage,
    addBalanceRow,
    selectBudgetStructure,
    deleteBalanceValidation,
  }
}

export default useBalanceValidationForm
