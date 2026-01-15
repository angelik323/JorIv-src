// Core
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { ActionType } from '@/interfaces/global'
import { IMovementCodesDestinationResponse } from '@/interfaces/customs/budget/MovementCodes'

// Composables
import { useRules, useUtils } from '@/composables'

// Store
import { useBudgetResourceStore } from '@/stores/resources-manager'

const useBasicDataDestinationForm = (props: {
  action: ActionType
  data?: IMovementCodesDestinationResponse | null
}) => {
  const { is_required } = useRules()

  const {
    movement_codes_source_destination,
    code_movements_source_destination_modules,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const { styleColumn, defaultIconsLucide } = useUtils()

  const formInformationRef = ref()
  const moduleRef = ref()
  const movementSourceCodeRef = ref()
  const movementSourceDescriptionRef = ref()
  const movementDestinationCodeRef = ref()
  const movementDestinationDescriptionRef = ref()

  const defaultForm = (): IMovementCodesDestinationResponse => ({
    id: null,
    module: '',
    movement_source_code: '',
    movement_source_description: '',
    movement_destination_code: '',
    movement_destination_description: '',
  })

  const models = ref<IMovementCodesDestinationResponse[]>([defaultForm()])

  const tableProps = ref({
    title: 'Listado de códigos de movimiento',
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
        name: 'module',
        required: true,
        label: 'Módulo',
        align: 'left',
        field: (row: IMovementCodesDestinationResponse) => `${row.module}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'movement_source_code',
        required: true,
        label: 'Código fuente',
        align: 'left',
        field: (row: IMovementCodesDestinationResponse) =>
          `${row.movement_source_code}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'movement_source_description',
        required: true,
        label: 'Descripción fuente',
        align: 'left',
        field: (row: IMovementCodesDestinationResponse) =>
          `${row.movement_source_description}`,
        sortable: true,
      },
      {
        name: 'movement_destination_code',
        required: true,
        label: 'Código destino',
        align: 'left',
        field: (row: IMovementCodesDestinationResponse) =>
          `${row.movement_destination_code}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'movement_destination_description',
        required: true,
        label: 'Descripción destino',
        align: 'left',
        field: (row: IMovementCodesDestinationResponse) =>
          `${row.movement_destination_description}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: models.value,
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const visibleColumns = [
    ...(props.action === 'edit' ? ['id'] : []),
    'module',
    'movement_source_code',
    'movement_source_description',
    'movement_destination_code',
    'movement_destination_description',
    ...(props.action === 'create' ? ['actions'] : []),
  ]

  const customColumns = [
    'module',
    'movement_source_code',
    'movement_source_description',
    'movement_destination_code',
    'movement_destination_description',
    ...(props.action === 'create' ? ['actions'] : []),
  ]

  const clearEvent = (row: IMovementCodesDestinationResponse) => {
    const index = tableProps.value.rows.indexOf(row)
    if (index !== -1) {
      tableProps.value.rows.splice(index, 1)
    }

    setTimeout(() => {
      formInformationRef.value?.resetValidation()
    }, 200)
  }

  const selectSourceCode = (
    row: IMovementCodesDestinationResponse,
    event: number
  ) => {
    row.source_id = event

    const movementCodeSelected = movement_codes_source_destination.value.find(
      (item) => item.value === event
    )
    if (movementCodeSelected) {
      row.movement_source_description =
        movementCodeSelected.movement_description
    }
  }

  const selectDestinationCode = (
    row: IMovementCodesDestinationResponse,
    event: number
  ) => {
    row.destination_id = event

    const movementCodeSelected = movement_codes_source_destination.value.find(
      (item) => item.value === event
    )
    if (movementCodeSelected) {
      row.movement_destination_description =
        movementCodeSelected.movement_description
    }
  }

  const addRow = () => {
    const newRow: IMovementCodesDestinationResponse = {
      ...defaultForm(),
    }
    tableProps.value.rows.push(newRow)
  }

  const _setValueModel = () => {
    if (props.action === 'edit' && props.data) {
      models.value = [props.data]
      tableProps.value.rows = models.value
    }
  }

  const getModelsData = () => {
    return models.value
  }

  onMounted(async () => {
    _setValueModel()
  })

  return {
    tableProps,
    customColumns,
    visibleColumns,
    defaultIconsLucide,
    models,
    formInformationRef,
    moduleRef,
    movementSourceCodeRef,
    movementSourceDescriptionRef,
    movementDestinationCodeRef,
    movementDestinationDescriptionRef,
    movement_codes_source_destination,
    code_movements_source_destination_modules,
    is_required,
    clearEvent,
    selectSourceCode,
    selectDestinationCode,
    getModelsData,
    addRow,
  }
}

export default useBasicDataDestinationForm
