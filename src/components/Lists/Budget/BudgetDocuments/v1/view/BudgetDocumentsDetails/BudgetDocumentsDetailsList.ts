// Vue - pinia - moment
import { ref, onBeforeMount, onBeforeUnmount, watch } from 'vue'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import {
  IBudgetDocumentDetailsListItem,
  IBudgetDocumentsTableEmits,
} from '@/interfaces/customs/budget/BudgetDocuments'

// Composables
import { usePaginatedTableList } from '@/composables/useTableList'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useBudgetDocumentsStore } from '@/stores/budget/budget-documents'

// Constants

const useBudgetDocumentsDetailsList = (
  props: { operationLogId: number },
  emits: IBudgetDocumentsTableEmits
) => {
  const { formatCurrency } = useUtils()

  const { _getDocumentDetailsById } = useBudgetDocumentsStore('v1')

  // Refs and computed props
  const tableProps = ref<IBaseTableProps<IBudgetDocumentDetailsListItem>>({
    title: 'Listado detalle de registros',
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
        name: 'validity',
        field: 'vigency',
        label: 'Vigencia',
        sortable: true,
        align: 'left',
      },
      {
        name: 'month',
        field: 'month',
        label: 'Mes',
        sortable: true,
        align: 'left',
      },
      {
        name: 'day',
        field: 'day',
        label: 'Día',
        sortable: true,
        align: 'left',
      },
      {
        name: 'responsability_area',
        field: (row) => row.area_responsability.code,
        label: 'Área',
        sortable: true,
        align: 'left',
      },
      {
        name: 'responsability_area_description',
        field: (row) => row.area_responsability.description,
        label: 'Descripción área',
        sortable: true,
        align: 'left',
      },
      {
        name: 'code_movement',
        field: (row) => row.code_movement.code,
        label: 'Código de movimiento',
        sortable: true,
        align: 'left',
      },
      {
        name: 'code_movement_description',
        field: (row) => row.code_movement.description,
        label: 'Descripción código de movimiento',
        sortable: true,
        align: 'left',
      },
      {
        name: 'budget_item',
        field: (row) => row.budget_item.code,
        label: 'Rubro presupuestal',
        sortable: true,
        align: 'left',
      },
      {
        name: 'budget_item_description',
        field: (row) => row.budget_item.description,
        label: 'Descripción rubro presupuestal',
        sortable: true,
        align: 'left',
      },
      {
        name: 'budget_resource',
        field: (row) => row.budget_resource.code,
        label: 'Recurso',
        sortable: true,
        align: 'left',
      },
      {
        name: 'budget_resource_description',
        field: (row) => row.budget_resource.description,
        label: 'Descripción recurso',
        sortable: true,
        align: 'left',
      },
      {
        name: 'balance',
        field: (row) => formatCurrency(row.balance),
        label: 'Valor',
        sortable: true,
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  // Functions/Methods
  const {
    getFilterFormatValues,
    handleFilterSearch,
    handleUpdatePage,
    handleUpdateRowsPerPage,
  } = usePaginatedTableList({
    tableProps,
    listPromiseFn: _getDocumentDetailsById,
  })

  // Watchers

  watch(
    tableProps,
    (table) => {
      emits('update:table', {
        loading: table.loading ?? false,
        length: table.rows.length,
      })
    },
    { deep: true, immediate: true }
  )

  // Life cycle hooks
  onBeforeMount(async () => {
    await handleFilterSearch({
      ...getFilterFormatValues(),
      operationLogId: props.operationLogId,
    })
  })

  onBeforeUnmount(() => {
    emits('update:table', { loading: false, length: 0 })
  })

  return {
    // Refs and computed props
    tableProps,

    // Functions/Methods
    handleUpdatePage,
    handleUpdateRowsPerPage,
  }
}

export default useBudgetDocumentsDetailsList
