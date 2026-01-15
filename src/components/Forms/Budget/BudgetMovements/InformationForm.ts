//Core
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
//Composables
import {
  useAlert,
  useRules,
  useTable,
  useMainLoader,
  useUtils,
} from '@/composables'
//Interfaces
import { ActionType } from '@/interfaces/global'
//Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetMovementsStore } from '@/stores/budget/budget-movements'
import {
  IBudgetMovementsList,
  IBudgetMovementCreate,
} from '@/interfaces/customs/budget/BudgetLevels'

const { defaultIconsLucide, getOptionLabel } = useUtils()
const useInformationForm = (
  props: {
    action?: ActionType
    editData?: IBudgetMovementsList | null
    title: string
    selectedBudgetLevelId?: number | null
  },
  emit: Function
) => {
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { movement_codes_source_destination } = storeToRefs(
    useBudgetResourceStore('v1')
  )
  const { _createBudgetMovements } = useBudgetMovementsStore('v1')
  const {
    selected_budget_level_item,
    budget_movement_item,
    _updateBudgetMovements,
    _clearEditingItem,
    _getBudgetMovementsList,
  } = useBudgetMovementsStore('v1')

  const informationFormRef = ref()

  const currentAction = props.action || 'create'

  const baseColumns: QTable['columns'] = [
    { name: 'id', label: '#', field: 'id', align: 'center' },
    {
      name: 'budget_level_level',
      label: 'Nivel',
      field: (row: IBudgetMovementsList) => row.budget_level.level,
      align: 'left',
    },
    {
      name: 'budget_level_description',
      label: 'Descripción',
      field: (row: IBudgetMovementsList) => row.budget_level.description,
      align: 'left',
    },
    { name: 'class', label: 'Clase', field: 'class', align: 'left' },
    {
      name: 'code_movement_code',
      label: 'Código de movimiento',
      field: (row: IBudgetMovementsList) => row.code_movement.movement_code,
      align: 'left',
    },
    {
      name: 'code_movement_description',
      label: 'Descripción',
      field: (row: IBudgetMovementsList) =>
        row.code_movement.movement_description,
      align: 'left',
    },
    {
      name: 'decrease_balance',
      label: 'Disminuye saldo',
      field: 'decrease_balance',
      align: 'center',
    },
    {
      name: 'increase_balance',
      label: 'Aumenta saldo',
      field: 'increase_balance',
      align: 'center',
    },
    {
      name: 'actions',
      label: 'Acciones',
      field: 'actions',
      align: 'center',
    },
  ]

  const columns =
    currentAction === 'edit'
      ? baseColumns.filter((col) => col.name !== 'actions')
      : baseColumns

  const baseCustomColumns = [
    'budget_level_level',
    'budget_level_description',
    'class',
    'code_movement_code',
    'code_movement_description',
    'decrease_balance',
    'increase_balance',
    'actions',
  ]

  const customColumns =
    currentAction === 'edit'
      ? baseCustomColumns.filter((col) => col !== 'actions')
      : baseCustomColumns

  const tableProps = ref({
    columns: columns,
    rows: [] as IBudgetMovementsList[],
  })

  const { is_required_array } = useRules()
  const { removeRowById, updateRowById } = useTable(tableProps)

  const validateForm = async () => {
    const rowsValidation = is_required_array(
      tableProps.value.rows,
      'Debe agregar al menos una fila'
    )
    if (!rowsValidation) {
      showAlert(rowsValidation, 'warning')
      return false
    }

    return informationFormRef.value?.validate() ?? true
  }

  const makeDataRequest = () => {
    if (!selected_budget_level_item) return null

    const createRequests: IBudgetMovementCreate[] = tableProps.value.rows
      .filter((row) => row.code_movement.id)
      .map((row) => ({
        budget_level_id: selected_budget_level_item.id,
        code_movement_id: row.code_movement.id,
        class: row.class,
        increase_balance: row.increase_balance || 0,
        decrease_balance: row.decrease_balance || 0,
      }))

    return createRequests
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    const payload = makeDataRequest()
    if (!payload?.length) return
    openMainLoader(true)
    const success =
      currentAction === 'edit'
        ? await _updateBudgetMovements(budget_movement_item?.id!, payload[0])
        : await _createBudgetMovements(payload)
    if (success) {
      if (currentAction === 'create') resetForm()
      await handleSuccess()
    }
    openMainLoader(false)
  }

  const handleSuccess = async () => {
    await _getBudgetMovementsList(
      `filter[budget_level_id]=${selected_budget_level_item?.id}`
    )
    emit('submit')
    emit('cancel')
  }

  const resetForm = () => {
    if (selected_budget_level_item) {
      initializeTableData()
    }
  }
  let nextId = 1
  const addRow = () => {
    if (!selected_budget_level_item) {
      showAlert('Debe seleccionar un nivel presupuestal primero', 'warning')
      return
    }

    const newRow: IBudgetMovementsList = {
      id: nextId++,
      class: selected_budget_level_item.class,
      decrease_balance: 1,
      increase_balance: 0,
      budget_level: {
        id: selected_budget_level_item.id,
        level: selected_budget_level_item.level,
        description: selected_budget_level_item.description,
        class: selected_budget_level_item.class,
      },
      code_movement: {
        id: 0,
        movement_code: '',
        movement_description: '',
      },
    }

    tableProps.value.rows.push(newRow)
  }

  const removeRow = (id: number) => {
    if (tableProps.value.rows.length <= 1) {
      showAlert('Debe mantener al menos una fila', 'warning')
      return
    }
    removeRowById(id)
  }

  const updateRowCode = (rowId: number, value: string | number) => {
    const row = tableProps.value.rows.find((r) => r.id === rowId)
    if (!row) return

    row.code_movement.id = value as number
    const found = movement_codes_source_destination.value?.find(
      (cm) => cm.id === value
    )
    if (found) {
      row.code_movement.movement_code = found.movement_code
      row.code_movement.movement_description = found.movement_description
    }
  }

  const toggleRowNature = (
    rowId: number,
    nature: 'increase' | 'decrease',
    value: boolean
  ) => {
    if (nature === 'increase') {
      updateRowById(rowId, {
        increase_balance: value ? 1 : 0,
        decrease_balance: value ? 0 : 1,
      })
    } else {
      updateRowById(rowId, {
        decrease_balance: value ? 1 : 0,
        increase_balance: value ? 0 : 1,
      })
    }
  }

  const setFormData = (data: IBudgetMovementsList) => {
    if (!data) return

    if (currentAction === 'edit' && 'code_movement' in data) {
      if (tableProps.value.rows.length > 0) {
        const firstRow = tableProps.value.rows[0]
        firstRow.id = data.id
        firstRow.code_movement.id = data.code_movement.id || 0
        firstRow.code_movement.movement_code =
          data.code_movement?.movement_code || ''
        firstRow.code_movement.movement_description =
          data.code_movement?.movement_description || ''
        firstRow.increase_balance = data.increase_balance
        firstRow.decrease_balance = data.decrease_balance
      }
    }
  }

  const initializeTableData = () => {
    if (selected_budget_level_item) {
      nextId = 1
      const initialRow: IBudgetMovementsList = {
        id: nextId++,
        class: selected_budget_level_item.class,
        decrease_balance: 1,
        increase_balance: 0,
        budget_level: {
          id: selected_budget_level_item.id,
          level: selected_budget_level_item.level,
          description: selected_budget_level_item.description,
          class: selected_budget_level_item.class,
        },
        code_movement: {
          id: 0,
          movement_code: '',
          movement_description: '',
        },
      }
      tableProps.value.rows = [initialRow]
    }
  }

  const initializeData = () => {
    initializeTableData()
    if (currentAction === 'edit' && props.editData) {
      setFormData(props.editData)
    } else {
      resetForm()
    }
  }

  onMounted(async () => {
    initializeData()
  })

  watch(
    () => selected_budget_level_item,
    () => {
      initializeData()
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    _clearEditingItem()
  })

  return {
    informationForm: informationFormRef,
    movement_codes_source_destination,
    tableProps,
    columns,
    customColumns,
    defaultIconsLucide,
    selected_budget_level_item,
    currentAction,
    validateForm,
    onSubmit,
    resetForm,
    setFormData,
    addRow,
    removeRow,
    updateRowCode,
    toggleRowNature,
    getOptionLabel,
    useRules,
  }
}

export default useInformationForm
