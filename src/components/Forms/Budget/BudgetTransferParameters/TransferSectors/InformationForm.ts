//Core
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
//Interfaces
import {
  IBudgetTransferSectorCreate,
  IBudgetTransferBudgetItemParameter,
} from '@/interfaces/customs/budget/BudgetTransferParameter'
import { ActionType } from '@/interfaces/global/Action'
import { IBaseTableProps } from '@/interfaces/global'
//Composables
import { useRouteValidator, useUtils, useRules } from '@/composables'
//Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useTransferSectorsForm = (props: {
  action: ActionType
  data?: IBudgetTransferSectorCreate[]
}) => {
  const { validateRouter } = useRouteValidator()
  const { getLabel, defaultIconsLucide } = useUtils()
  const {
    budget_item_codes_source_destination,
    budget_document_transfer_type,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const formRef = ref()

  const customsColumns = [
    'actions',
    'from_budget_item_source_id',
    'from_description_item_source',
    'to_budget_item_source_id',
    'to_description_item_source',
    'from_budget_item_target_id',
    'from_description_item_target',
    'to_budget_item_target_id',
    'to_description_item_target',
  ]

  let rowId = 1

  const models = ref<IBudgetTransferSectorCreate[]>([])

  watch(
    () => props.data,
    () => {
      if (props.data && props.data.length > 0) {
        models.value = [...props.data]
      } else {
        models.value = [
          {
            id: rowId++,
            from_budget_item_source_id: null,
            to_budget_item_source_id: null,
            from_budget_item_target_id: null,
            to_budget_item_target_id: null,
          },
        ]
      }
    },
    { immediate: true }
  )

  const updateRow = (
    rowId: number | null,
    field: keyof IBudgetTransferSectorCreate,
    value: unknown
  ) => {
    const rowIndex = models.value.findIndex((row) => row.id === rowId)
    if (rowIndex > -1) {
      models.value[rowIndex] = {
        ...models.value[rowIndex],
        [field]: value,
      }
    }
  }

  const baseColumns = [
    {
      name: 'id',
      required: true,
      label: '#',
      align: 'left' as const,
      field: (row: IBudgetTransferSectorCreate) => row.id,
      sortable: true,
    },
    {
      name: 'from_budget_item_source_id',
      required: true,
      label: 'Desde rubro fuente',
      align: 'left' as const,
      field: (row: IBudgetTransferSectorCreate) =>
        row.from_budget_item_source_id,
      sortable: true,
    },
    {
      name: 'from_description_item_source',
      required: true,
      label: 'Descripción rubro',
      align: 'left' as const,
      field: (row: IBudgetTransferSectorCreate) =>
        row.from_description_item_source,
      sortable: true,
    },
    {
      name: 'to_budget_item_source_id',
      required: true,
      label: 'Hasta rubro fuente',
      align: 'left' as const,
      field: (row: IBudgetTransferSectorCreate) => row.to_budget_item_source_id,
      sortable: true,
    },
    {
      name: 'to_description_item_source',
      required: true,
      label: 'Descripción rubro',
      align: 'left' as const,
      field: (row: IBudgetTransferSectorCreate) =>
        row.to_description_item_source,
      sortable: true,
    },
    {
      name: 'from_budget_item_target_id',
      required: true,
      label: 'Desde rubro destino',
      align: 'left' as const,
      field: (row: IBudgetTransferSectorCreate) =>
        row.from_budget_item_target_id,
      sortable: true,
    },
    {
      name: 'from_description_item_target',
      required: true,
      label: 'Descripción rubro',
      align: 'left' as const,
      field: (row: IBudgetTransferSectorCreate) =>
        row.from_description_item_target,
      sortable: true,
    },
    {
      name: 'to_budget_item_target_id',
      required: true,
      label: 'Hasta rubro destino',
      align: 'left' as const,
      field: (row: IBudgetTransferSectorCreate) => row.to_budget_item_target_id,
      sortable: true,
    },
    {
      name: 'to_description_item_target',
      required: true,
      label: 'Descripción rubro',
      align: 'left' as const,
      field: (row: IBudgetTransferSectorCreate) =>
        row.to_description_item_target,
      sortable: true,
    },
  ]

  if (props.action !== 'view') {
    baseColumns.push({
      name: 'actions',
      required: true,
      label: 'Acciones',
      align: 'left' as const,
      field: (row: IBudgetTransferSectorCreate) => row.id,
      sortable: false,
    })
  }

  const tableProps = ref<IBaseTableProps<IBudgetTransferSectorCreate>>({
    title: 'Listado traslados entre rubros',
    loading: false,
    columns: baseColumns,
    rows: models.value,
    pages: { currentPage: 0, lastPage: 0 },
  })

  const handleAddRow = () => {
    const newRow: IBudgetTransferSectorCreate = {
      id: rowId++,
      from_budget_item_source_id: null,
      to_budget_item_source_id: null,
      from_budget_item_target_id: null,
      to_budget_item_target_id: null,
    }
    models.value.push(newRow)
  }

  const handleDelete = (id: number | null) => {
    const index = models.value.findIndex((row) => row.id === id)
    if (index > -1) {
      models.value.splice(index, 1)
    }
  }

  const setInitialData = (data: IBudgetTransferBudgetItemParameter[]) => {
    if (data && data.length > 0) {
      models.value = data.map((item) => ({
        id: item.id ?? rowId++,
        from_budget_item_source_id: item.from_budget_item_source_id ?? null,
        to_budget_item_source_id: item.to_budget_item_source_id ?? null,
        from_budget_item_target_id: item.from_budget_item_target_id ?? null,
        to_budget_item_target_id: item.to_budget_item_target_id ?? null,
      }))
    }
  }

  return {
    models,
    budget_item_codes_source_destination,
    tableProps,
    customsColumns,
    defaultIconsLucide,
    budget_document_transfer_type,
    formRef,
    useRules,
    validateRouter,
    getLabel,
    handleAddRow,
    handleDelete,
    updateRow,
    setInitialData,
  }
}

export default useTransferSectorsForm
