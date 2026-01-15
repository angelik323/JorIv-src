//Core
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
//Composables
import { useUtils, useMainLoader, useRouteValidator } from '@/composables'
//Interfaces
import { WriteActionType } from '@/interfaces/global'
import { IBudgetMovementsList } from '@/interfaces/customs/budget/BudgetLevels'
import { IFieldFilters } from '@/interfaces/customs/Filters'
//Constants
import { BUDGET_BALANCE_ACTIONS } from '@/constants/resources/budget'
//Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetMovementsStore } from '@/stores/budget/budget-movements'

const useBudgetMovementsList = () => {
  const { styleColumn, formatParamsCustom, defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const {
    _getBudgetMovementsList,
    _cleanData,
    _deleteAction,
    _setEditingItem,
    _clearEditingItem,
    _setSelectedBudgetLevel,
    _downloadBudgetMovements,
  } = useBudgetMovementsStore('v1')
  const {
    budget_movements_list,
    budget_movements_pages,
    selected_budget_level_id,
  } = storeToRefs(useBudgetMovementsStore('v1'))
  const { code_movements } = storeToRefs(useBudgetResourceStore('v1'))

  const formModalRef = ref<{
    openModal: () => Promise<void>
    closeModal: () => Promise<void> | void
  } | null>(null)
  const deleteModalRef = ref<{
    openModal: () => Promise<void>
    closeModal: () => Promise<void> | void
  } | null>(null)
  const deleteRowId = ref<number | null>(null)

  const modalAction = ref<WriteActionType | undefined>(undefined)
  const modalFormRef = ref<{
    submit: () => Promise<boolean>
    saveAllRows: () => Promise<boolean>
    validateForm: () => boolean
    addRow: () => void
    getFormData: () => void
  } | null>(null)
  const selectedRow = ref<IBudgetMovementsList | null>(null)

  const openDeleteModal = async (id: number) => {
    deleteRowId.value = id
    await deleteModalRef.value?.openModal()
  }

  const openFormModal = async (
    action: WriteActionType,
    row?: IBudgetMovementsList
  ) => {
    modalAction.value = action
    if (action === 'edit' && row) {
      selectedRow.value = row
      _setEditingItem(row)
    } else {
      selectedRow.value = null
      _clearEditingItem()
    }
    await formModalRef.value?.openModal()
  }

  const handleModalClose = async () => {
    await formModalRef.value?.closeModal()
    selectedRow.value = null
    modalAction.value = undefined
    _clearEditingItem()
  }

  const handleAddRow = async () => {
    modalFormRef.value?.addRow()
  }

  const handleSubmitForm = async () => {
    if (!modalFormRef.value) return

    const success = await modalFormRef.value.saveAllRows()
    if (!success) return

    if (selected_budget_level_id.value) {
      await refreshListAndFilterOptions()
    }

    await handleModalClose()
  }

  const confirmDelete = async () => {
    if (deleteRowId.value === null) return
    await deleteModalRef.value?.closeModal()
    await deleteRowTable(deleteRowId.value)
    deleteRowId.value = null
  }

  let perPage = 20

  const tableProps = ref({
    title: 'Listado de códigos de movimiento por nivel',
    no_data_title: 'Realice una búsqueda para ver los datos',
    no_data_subtitle: 'Aquí visualizará los resultados de su búsqueda',
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
        name: 'code',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: (row: IBudgetMovementsList) =>
          `${row.code_movement.movement_code} - ${row.code_movement.movement_description}`,
        style: styleColumn(200),
      },
      {
        name: 'level',
        required: true,
        label: 'Nivel',
        align: 'left',
        field: (row: IBudgetMovementsList) =>
          row.budget_level
            ? `${row.budget_level.level} - ${row.budget_level.description}`
            : '',
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'decrease',
        required: true,
        label: 'Disminuye saldo',
        align: 'left',
        field: (row: IBudgetMovementsList) => row.decrease_balance,
        sortable: false,
      },
      {
        name: 'increase',
        required: true,
        label: 'Aumenta saldo',
        align: 'left',
        field: (row: IBudgetMovementsList) => row.increase_balance,
        sortable: false,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IBudgetMovementsList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Código movimiento',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'balance_type',
      label: '',
      type: 'q-option-group',
      radioType: 'radio',
      value: null,
      class: 'col-4 flex items-center',
      options: BUDGET_BALANCE_ACTIONS,
      disable: false,
      clean_value: true,
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    if (!selected_budget_level_id.value) {
      tableProps.value.rows = []
      tableProps.value.loading = false
      return
    }

    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getBudgetMovementsList(filters)
    tableProps.value.loading = false
  }

  const updateFilterOptionsFromMovements = (
    movementsList: IBudgetMovementsList[]
  ) => {
    const searchField = filterConfig.value.find(
      (field) => field.name === 'search'
    )

    if (
      !searchField ||
      !selected_budget_level_id.value ||
      movementsList.length === 0
    ) {
      if (searchField && !selected_budget_level_id.value) {
        searchField.options = []
        searchField.value = null
      }
      return
    }

    const uniqueCodes = new Map<string, { value: string; label: string }>()

    for (const movement of movementsList) {
      if (!movement.code_movement?.movement_code) continue

      const codeValue = movement.code_movement.movement_code
      if (!uniqueCodes.has(codeValue)) {
        uniqueCodes.set(codeValue, {
          value: codeValue,
          label: `${movement.code_movement.movement_code} - ${movement.code_movement.movement_description}`,
        })
      }
    }

    searchField.options = Array.from(uniqueCodes.values())
  }

  const refreshListAndFilterOptions = async () => {
    if (!selected_budget_level_id.value) {
      return
    }

    const baseFilters = {
      'filter[budget_level_id]': selected_budget_level_id.value,
    }
    const mergedFilters = { ...baseFilters, ...filtersFormat.value }
    const queryString = formatParamsCustom(mergedFilters)

    await listAction(queryString ? '&' + queryString : '')

    if (
      selected_budget_level_id.value &&
      budget_movements_list.value.length > 0
    ) {
      updateFilterOptionsFromMovements(budget_movements_list.value)
    }
  }

  const handleFilter = ($filters: Record<string, string | number | null>) => {
    if (!selected_budget_level_id.value) {
      tableProps.value.rows = []
      return
    }

    const search = $filters['filter[search]']
    const balanceType = $filters['filter[balance_type]']

    const transformed: Record<string, string | number> = {
      'filter[budget_level_id]': selected_budget_level_id.value,
    }

    if (search) transformed['filter[search]'] = search

    if (balanceType === 'increase') {
      transformed['filter[increase_balance]'] = 1
    } else if (balanceType === 'decrement') {
      transformed['filter[decrease_balance]'] = 1
    }

    filtersFormat.value = transformed
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const downloadBudgetMovements = async () => {
    openMainLoader(true)
    const mergedFilters = {
      ...filtersFormat.value,
      'filter[budget_level_id]': selected_budget_level_id.value,
    }
    const queryString = formatParamsCustom(mergedFilters)
    await _downloadBudgetMovements(queryString)
    openMainLoader(false)
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const deleteRowTable = async (id: number) => {
    if (await _deleteAction(id)) {
      _cleanData()
      if (selected_budget_level_id.value) {
        await refreshListAndFilterOptions()
      }
    }
  }

  const forceCleanState = () => {
    _cleanData()
    _setSelectedBudgetLevel(null)

    const searchField = filterConfig.value.find(
      (field) => field.name === 'search'
    )
    if (searchField) {
      searchField.options = []
      searchField.value = null
    }

    code_movements.value = []
  }

  const clearFilters = () => {
    if (selected_budget_level_id.value) {
      filtersFormat.value = {
        'filter[budget_level_id]': selected_budget_level_id.value,
      }

      const searchField = filterConfig.value.find(
        (field) => field.name === 'search'
      )
      if (searchField) {
        searchField.value = null
      }

      const balanceTypeField = filterConfig.value.find(
        (field) => field.name === 'balance_type'
      )
      if (balanceTypeField) {
        balanceTypeField.value = null
      }

      listAction(`filter[budget_level_id]=${selected_budget_level_id.value}`)
    } else {
      forceCleanState()
    }
  }

  onMounted(() => {
    forceCleanState()
  })

  watch(
    () => budget_movements_list.value,
    (newMovementsList) => {
      if (selected_budget_level_id.value) {
        tableProps.value.rows = newMovementsList
        updateFilterOptionsFromMovements(newMovementsList)
      } else {
        tableProps.value.rows = []
      }
    }
  )

  watch(
    () => budget_movements_pages.value,
    () => {
      tableProps.value.pages = budget_movements_pages.value
    }
  )

  watch(
    () => selected_budget_level_id.value,
    async (newLevelId, oldLevelId) => {
      if (newLevelId !== oldLevelId) {
        if (newLevelId) {
          await listAction(`filter[budget_level_id]=${newLevelId}`)
        } else {
          forceCleanState()
        }
      }
    },
    { immediate: true }
  )

  return {
    tableProps,
    filterConfig,
    selected_budget_level_id,
    formModalRef,
    deleteModalRef,
    modalFormRef,
    modalAction,
    selectedRow,
    defaultIconsLucide,
    handleFilter,
    updatePage,
    updatePerPage,
    clearFilters,
    openDeleteModal,
    confirmDelete,
    downloadBudgetMovements,
    openFormModal,
    handleModalClose,
    handleAddRow,
    handleSubmitForm,
    validateRouter,
  }
}

export default useBudgetMovementsList
