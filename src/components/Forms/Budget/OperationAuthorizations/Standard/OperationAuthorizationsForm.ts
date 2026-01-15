// Vue - Router - Pinia
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Composables
import { useUtils, useRules } from '@/composables'
// Interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import type { QTableColumn } from 'quasar'
import { IOperationAuthorizationFormEdit } from '@/interfaces/customs/budget/OperationAuthorizations'
// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

export const useOperationAuthorizationForm = (props: {
  action: ActionType
  data: IOperationAuthorizationFormEdit[]
}) => {
  const { defaultIconsLucide, styleColumn } = useUtils()
  const {
    is_required,
    max_value,
    only_number_greater_than_zero_with_decimal,
    only_number_greater_than_zero,
  } = useRules()
  const {
    budget_item_codes_source_destination,
    areas_resposabilities_codes,
    movement_codes_source_destination,
    budget_resource_codes,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const formRef = ref()
  const isEdit = computed(() => props.action === 'edit')

  const operationRows = ref<IOperationAuthorizationFormEdit[]>([])



  // Watch para actualizar operationRows cuando cambien las props
  watch(
    () => props.data,
    (newData) => {
      operationRows.value = Array.isArray(newData) ? [...newData] : []
    },
    { immediate: true }
  )
  const baseColumns = computed(() => [
    { name: 'id', label: '#', field: 'id', align: 'left', sortable: false },
    {
      name: 'validity',
      label: 'Vigencia*',
      field: 'validity',
      align: 'left',
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'month',
      label: 'Mes*',
      field: 'month',
      align: 'left',
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'day',
      label: 'Día*',
      field: 'day',
      align: 'left',
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'area',
      label: 'Área*',
      field: 'area_id',
      align: 'left',
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'movement_code',
      label: 'Código de movimiento*',
      field: 'movement_code_id',
      align: 'left',
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'budget_item',
      label: 'Rubro presupuestal*',
      field: 'budget_item_id',
      align: 'left',
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'resource',
      label: 'Recurso*',
      field: 'resource_id',
      align: 'left',
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'value',
      label: 'Valor*',
      field: 'value',
      align: 'right',
      sortable: false,
      style: styleColumn(150),
    },
  ])
  const columns = computed(() =>
    isEdit.value
      ? [
        ...baseColumns.value,
        {
          name: 'actions',
          label: 'Acciones',
          field: 'actions',
          align: 'center',
        },
      ]
      : baseColumns.value
  )

  const tableProps = ref<IBaseTableProps<IOperationAuthorizationFormEdit>>({
    title: 'Listado de registro de operaciones',
    loading: false,
    columns: columns.value as QTableColumn<IOperationAuthorizationFormEdit>[],
    rows: operationRows.value,
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const customColumns = computed(() =>
    isEdit.value
      ? [
        'validity',
        'month',
        'day',
        'area',
        'movement_code',
        'budget_item',
        'resource',
        'value',
        'actions',
      ]
      : [
        'validity',
        'month',
        'day',
        'area',
        'movement_code',
        'budget_item',
        'resource',
        'value',
      ]
  )

  watch(
    () => operationRows.value,
    () => {
      tableProps.value.rows = operationRows.value
    },
    { deep: true }
  )

  const addRow = () => {
    operationRows.value.push({
      id: null, // ID único negativo para filas nuevas
      validity: null,
      month: null,
      day: null,
      area_id: null,
      movement_code_id: null,
      budget_item_id: null,
      resource_id: null,
      value: null,
    })
  }

  const deleteRow = (index: number) => {
    // Solo eliminar la fila, NO reasignar IDs
    // Reasignar IDs causa que Vue/Quasar pierda el tracking de las filas
    operationRows.value.splice(index, 1)
  }

  const getFormData = (): IOperationAuthorizationFormEdit[] => {
    return operationRows.value.map((row) => ({
      ...row,
      // Asegurar que mes, día y valor sean números cuando sea posible
      month: row.month != null ? Number(row.month) : null,
      day: row.day != null ? String(row.day) : null,
      value: row.value != null ? Number(row.value) : null,
    }))
  }

  const validateDay = (
    val: number | string | null,
    row: IOperationAuthorizationFormEdit
  ) => {
    const daysInMonth = new Date(
      Number(row.validity),
      Number(row.month),
      0
    ).getDate()
    const num = Number(val)
    return (
      (!isNaN(num) && num >= 1 && num <= daysInMonth) ||
      'El día debe ser menor al último día del mes'
    )
  }

  return {
    defaultIconsLucide,
    formRef,
    budget_item_codes_source_destination,
    areas_resposabilities_codes,
    movement_codes_source_destination,
    budget_resource_codes,
    operationRows,
    tableProps,
    customColumns,
    isEdit,
    addRow,
    max_value,
    deleteRow,
    getFormData,
    validateDay,
    is_required,
    only_number_greater_than_zero,
    only_number_greater_than_zero_with_decimal,
  }
}
