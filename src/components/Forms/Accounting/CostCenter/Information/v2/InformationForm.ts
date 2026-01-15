// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { debounce } from 'quasar'

// Interfaces
import { IBaseTableProps, ActionType } from '@/interfaces/global'
import {
  ICostCenterInformationForm,
  ICostCenterTableItemForm,
} from '@/interfaces/customs/accounting/CostCenterV2'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

const useInformationForm = (
  props: {
    action: ActionType
    data: ICostCenterInformationForm | null
  },
  emit: Function
) => {
  const { available_cost_center_structures_code_label, cost_center_types } =
    storeToRefs(useAccountingResourceStore('v1'))

  const { defaultIconsLucide, getMaxId, isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: ICostCenterInformationForm = {
    account_structure: null,
    purpose: null,
    structure: null,
    status: null,
    costCenters: [],
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const searchFormElementRef = ref()
  const search = ref('')

  const tableProperties = ref<IBaseTableProps<ICostCenterTableItemForm>>({
    title: '',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre de centro de costos',
        align: 'left',
        field: 'name',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  if (props.action !== 'view') {
    tableProperties.value.columns = [
      ...tableProperties.value.columns,
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ]
  }

  const addRow = () => {
    const newItem = {
      id: getMaxId(models.value.costCenters) + 1,
      code: null,
      type: null,
      name: null,
      isNew: true,
    }

    models.value.costCenters = [...models.value.costCenters, newItem]
  }

  const updateRowField = (
    id: number,
    field: 'code' | 'type' | 'name',
    value: string | null
  ) => {
    const row = models.value.costCenters.find((item) => item.id === id)
    if (!row) return

    row[field] = value
  }

  const removeRow = (row: ICostCenterTableItemForm) => {
    if (!row.id) return

    if (row.isNew) {
      models.value.costCenters = models.value.costCenters.filter(
        ({ id }) => id !== row.id
      )
    } else {
      emit('delete:costCenter', row.id)
    }
  }

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  // Sincroniza el modelo con la prop 'data'
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  // Campos derivados de la estructura seleccionada
  watch(
    () => models.value.account_structure,
    (newVal) => {
      const structure = available_cost_center_structures_code_label.value.find(
        ({ value }) => value === newVal
      )

      models.value.purpose = structure?.purpose ?? null
      models.value.structure = structure?.structure ?? null
      models.value.status = structure?.status?.status ?? null
    }
  )

  // Busqueda en visualización
  watch(
    search,
    debounce(async (newVal: string) => {
      if (!(await searchFormElementRef.value?.validate())) return
      emit('search:costCenter', newVal)
    }, 1000)
  )

  watch(
    () => models.value.costCenters,
    (val) => {
      tableProperties.value.rows = [...val]
    },
    { immediate: true }
  )

  return {
    available_cost_center_structures_code_label,
    cost_center_types,
    defaultIconsLucide,
    formElementRef,
    models,
    searchFormElementRef,
    search,
    tableProperties,
    addRow,
    updateRowField,
    removeRow,
  }
}

export default useInformationForm
