// vue - quasar
import { computed, ref, watch } from 'vue'
import { QTableColumn } from 'quasar/dist/types/api/qtable'

// interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import { IVisitRecordDetail } from '@/interfaces/customs/fixed-assets/v1/VisitRecords'

// composables
import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'

const useVisitDetailList = (
  props: {
    modelValue: IVisitRecordDetail[]
    action: ActionType
  },
  emit: Function
) => {
  // imports
  const { defaultIconsLucide, getOptionLabel } = useUtils()
  const {
    is_required,
    min_length,
    max_length,
    date_before_or_equal_to_the_current_date,
  } = useRules()

  // table
  const createEmptyRow = (): IVisitRecordDetail => ({
    id: null,
    visit_date: null,
    responsible_id: null,
    visitor_id: null,
    visit_reason: null,
    physical_condition: null,
    asset_rating: null,
    recommendations: null,
  })

  const tableProps = ref<IBaseTableProps<IVisitRecordDetail>>({
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        align: 'left',
        style: 'max-width: 40px; min-width: 40px;',
        headerStyle: 'white-space: normal; max-width: 40px; min-width: 40px;',
      },
      {
        name: 'visit_date',
        field: 'visit_date',
        label: 'Fecha visita',
        align: 'left',
        style: 'max-width: 160px; min-width: 160px;',
        headerStyle: 'white-space: normal; max-width: 160px; min-width: 160px;',
      },
      {
        name: 'responsible',
        field: 'responsible_id',
        label: 'Responsable interno / Externo',
        align: 'left',
        style: 'max-width: 160px; min-width: 160px;',
        headerStyle: 'white-space: normal; max-width: 160px; min-width: 160px;',
      },
      {
        name: 'visit_reason',
        field: 'visit_reason',
        label: 'Motivo visita',
        align: 'left',
        style: 'max-width: 140px; min-width: 140px;',
        headerStyle: 'white-space: normal; max-width: 140px; min-width: 140px;',
      },
      {
        name: 'visitor',
        field: 'visitor_id',
        label: 'Visitador',
        align: 'left',
        style: 'max-width: 140px; min-width: 140px;',
        headerStyle: 'white-space: normal; max-width: 140px; min-width: 140px;',
      },
      {
        name: 'physical_condition',
        field: 'physical_condition',
        label: 'Estado físico',
        align: 'left',
        style: 'max-width: 120px; min-width: 120px;',
        headerStyle: 'white-space: normal; max-width: 120px; min-width: 120px;',
      },
      {
        name: 'asset_rating',
        field: 'asset_rating',
        label: 'Calificación activo',
        align: 'left',
        style: 'max-width: 140px; min-width: 140px;',
        headerStyle: 'white-space: normal; max-width: 140px; min-width: 140px;',
      },
      {
        name: 'recommendations',
        field: 'recommendations',
        label: 'Recomendaciones',
        align: 'left',
        style: 'max-width: 140px; min-width: 140px;',
        headerStyle: 'white-space: normal; max-width: 140px; min-width: 140px;',
      },
      ...(props.action !== 'view'
        ? [
            {
              name: 'actions',
              field: '',
              label: 'Acciones',
              align: 'left',
              style: 'max-width: 100px; min-width: 100px;',
            },
          ]
        : []),
    ] as QTableColumn<IVisitRecordDetail>[],
    rows:
      props.modelValue?.length > 0 ? [...props.modelValue] : [createEmptyRow()],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  // form management
  const visitDetailListFormRef = ref()

  const visibleColumns = computed(() => {
    const hasIds = tableProps.value.rows.some((row) => row.id !== null)

    const baseColumns = [
      'visit_date',
      'responsible',
      'visit_reason',
      'visitor',
      'physical_condition',
      'asset_rating',
      'recommendations',
      'actions',
    ]

    return hasIds ? ['id', ...baseColumns] : baseColumns
  })

  const updateRow = (
    index: number,
    field: keyof IVisitRecordDetail,
    value: string | null
  ) => {
    tableProps.value.rows[index] = {
      ...tableProps.value.rows[index],
      [field]: value,
    }
    emit('update:modelValue', tableProps.value.rows)
  }

  const addNewRow = () => {
    tableProps.value.rows.push(createEmptyRow())
    emit('update:modelValue', tableProps.value.rows)
  }
  const removeRow = (index: number) => {
    tableProps.value.rows.splice(index, 1)
    emit('update:modelValue', tableProps.value.rows)
  }
  const validateAndAddRow = async () => {
    const isValid = await visitDetailListFormRef.value?.validate()

    if (isValid) {
      addNewRow()
    }
  }

  // watch
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue && newValue.length > 0) {
        tableProps.value.rows = [...newValue]
      }
    },
    { deep: true }
  )

  return {
    visitDetailListFormRef,

    tableProps,
    visibleColumns,
    defaultIconsLucide,

    updateRow,
    removeRow,
    validateAndAddRow,
    getOptionLabel,

    is_required,
    min_length,
    max_length,
    date_before_or_equal_to_the_current_date,
  }
}

export default useVisitDetailList
