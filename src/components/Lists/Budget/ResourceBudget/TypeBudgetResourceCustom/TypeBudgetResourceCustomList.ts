// Core - API - Pinia
import { computed, onMounted, ref } from 'vue'
// Composables
import { useUtils } from '@/composables'
// Interfaces & types
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import { IBudgetResourceType } from '@/interfaces/customs/budget/ResourceBudget'

const useTypeBudgetResourceCustomList = (props: {
  actionModal: ActionType
  data: IBudgetResourceType
}) => {
  const tableRef = ref()
  const { defaultIconsLucide } = useUtils()
  const baseColumns: IBaseTableProps<IBudgetResourceType>['columns'] = [
    { name: 'id', label: '#', field: 'id', align: 'center', sortable: false },
    {
      name: 'code',
      label: 'Código tipo',
      field: 'code',
      align: 'left',
      sortable: false,
    },
    {
      name: 'description',
      label: 'Descripción',
      field: 'description',
      align: 'left',
      sortable: false,
    },
  ]
  const getColumns = (): IBaseTableProps<IBudgetResourceType>['columns'] => {
    if (props.actionModal === 'create') {
      return [
        ...baseColumns,
        {
          name: 'actions',
          label: 'Acciones',
          field: 'id',
          align: 'center',
        },
      ]
    }
    return baseColumns
  }
  const tableProps = ref<IBaseTableProps<IBudgetResourceType>>({
    title: 'Listado de tipos de recursos',
    loading: false,
    columns: getColumns(),
    rows: [props.data],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  // Columnas personalizadas condicionales
  const customColumns = computed(() => {
    return props.actionModal === 'create'
      ? ['code', 'description', 'actions']
      : ['code', 'description']
  })

  const getRowData = () => {
    return tableProps.value.rows[0]
  }

  const setRowData = (rowData: IBudgetResourceType | null) => {
    if (props.actionModal === 'edit' && rowData) {
      tableProps.value.rows = [rowData]
    }
  }
  onMounted(() => {
    setRowData(props.data ?? null)
  })

  const clearData = (rowId: number) => {
    tableProps.value.rows = tableProps.value.rows.filter(
      (row) => row?.id !== rowId
    )
  }

  const addEmptyRow = () => {
    const maxId = Math.max(
      ...tableProps.value.rows.map((r) => Number(r?.id) || 0),
      0
    )
    const newId = maxId + 1
    tableProps.value.rows.push({
      id: newId,
      code: null,
      description: null,
    })
  }

  const getAllRowsData = () => {
    return tableProps.value.rows
  }

  return {
    tableProps,
    defaultIconsLucide,
    getRowData,
    setRowData,
    clearData,
    addEmptyRow,
    getAllRowsData,
    customColumns,
    tableRef,
  }
}

export default useTypeBudgetResourceCustomList
