//Core
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
//Interfaces
import {
  IBudgetTransferAreaCreate,
  IBudgetTransferAreaParameter,
} from '@/interfaces/customs/budget/BudgetTransferParameter'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
//Composables
import { useRouteValidator, useUtils, useRules } from '@/composables'
//Stores
import { ActionType } from '@/interfaces/global/Action'
import { IBaseTableProps } from '@/interfaces/global'

const useTransferAreasForm = (props: {
  action: ActionType
  data?: IBudgetTransferAreaCreate[]
}) => {
  const { validateRouter } = useRouteValidator()
  const { getLabel, defaultIconsLucide } = useUtils()
  const { areas_resposabilities_codes, budget_document_transfer_type } =
    storeToRefs(useBudgetResourceStore('v1'))

  const formRef = ref()

  const customsColumns = [
    'actions',
    'from_area_source_id',
    'from_description_area_source',
    'to_area_source_id',
    'to_description_area_source',
    'from_area_target_id',
    'from_description_area_target',
    'to_area_target_id',
    'to_description_area_target',
  ]

  let rowId = 1

  const models = ref<IBudgetTransferAreaCreate[]>([])

  watch(
    () => props.data,
    () => {
      if (props.data && props.data.length > 0) {
        models.value = [...props.data]
      } else {
        models.value = [
          {
            id: rowId++,
            from_area_source_id: null,
            to_area_source_id: null,
            from_area_target_id: null,
            to_area_target_id: null,
          },
        ]
      }
    },
    { immediate: true }
  )

  const updateRow = (
    rowId: number | null,
    field: keyof IBudgetTransferAreaCreate,
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
      field: (row: IBudgetTransferAreaCreate) => row.id,
      sortable: true,
    },
    {
      name: 'from_area_source_id',
      required: true,
      label: 'Desde área fuente',
      align: 'left' as const,
      field: (row: IBudgetTransferAreaCreate) => row.from_area_source_id,
      sortable: true,
    },
    {
      name: 'from_description_area_source',
      required: true,
      label: 'Descripción área',
      align: 'left' as const,
      field: (row: IBudgetTransferAreaCreate) =>
        row.from_description_area_source,
      sortable: true,
    },
    {
      name: 'to_area_source_id',
      required: true,
      label: 'Hasta área fuente',
      align: 'left' as const,
      field: (row: IBudgetTransferAreaCreate) => row.to_area_source_id,
      sortable: true,
    },
    {
      name: 'to_description_area_source',
      required: true,
      label: 'Descripción área',
      align: 'left' as const,
      field: (row: IBudgetTransferAreaCreate) => row.to_description_area_source,
      sortable: true,
    },
    {
      name: 'from_area_target_id',
      required: true,
      label: 'Desde área destino',
      align: 'left' as const,
      field: (row: IBudgetTransferAreaCreate) => row.from_area_target_id,
      sortable: true,
    },
    {
      name: 'from_description_area_target',
      required: true,
      label: 'Descripción área',
      align: 'left' as const,
      field: (row: IBudgetTransferAreaCreate) =>
        row.from_description_area_target,
      sortable: true,
    },
    {
      name: 'to_area_target_id',
      required: true,
      label: 'Hasta área destino',
      align: 'left' as const,
      field: (row: IBudgetTransferAreaCreate) => row.to_area_target_id,
      sortable: true,
    },
    {
      name: 'to_description_area_target',
      required: true,
      label: 'Descripción área',
      align: 'left' as const,
      field: (row: IBudgetTransferAreaCreate) => row.to_description_area_target,
      sortable: true,
    },
  ]

  if (props.action !== 'view') {
    baseColumns.push({
      name: 'actions',
      required: true,
      label: 'Acciones',
      align: 'left' as const,
      field: (row: IBudgetTransferAreaCreate) => row.id,
      sortable: false,
    })
  }

  const tableProps = ref<IBaseTableProps<IBudgetTransferAreaCreate>>({
    title: 'Listado traslados entre áreas',
    loading: false,
    columns: baseColumns,
    rows: models.value,
    pages: { currentPage: 0, lastPage: 0 },
  })

  const handleAddRow = () => {
    const newRow: IBudgetTransferAreaCreate = {
      id: rowId++,
      from_area_source_id: null,
      to_area_source_id: null,
      from_area_target_id: null,
      to_area_target_id: null,
    }
    models.value.push(newRow)
  }

  const handleDelete = (id: number | null) => {
    const index = models.value.findIndex((row) => row.id === id)
    if (index > -1) {
      models.value.splice(index, 1)
    }
  }

  const setInitialData = (data: IBudgetTransferAreaParameter[]) => {
    if (data && data.length > 0) {
      models.value = data.map((item) => ({
        id: item.id ?? rowId++,
        from_area_source_id: item.from_area_source_id ?? null,
        to_area_source_id: item.to_area_source_id ?? null,
        from_area_target_id: item.from_area_target_id ?? null,
        to_area_target_id: item.to_area_target_id ?? null,
      }))
    }
  }

  return {
    models,
    areas_resposabilities_codes,
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

export default useTransferAreasForm
