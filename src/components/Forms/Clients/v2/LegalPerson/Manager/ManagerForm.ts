// vue
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { QTable } from 'quasar'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  ILegalClientManager,
  IManager,
} from '@/interfaces/customs/clients/Clients'
import { PersonType } from '@/interfaces/global/Clients'

// Composables
import { useUtils } from '@/composables/useUtils'

// stores
import { useClientsStore } from '@/stores'

// TODO: Falta refactor de composable
const useManagerForm = (props: {
  action: ActionType
  managerDataForm?: ILegalClientManager | null
}) => {
  const { formatFullName, isEmptyOrZero } = useUtils()
  const { _setDataLegalCLientsManager } = useClientsStore('v2')

  const formManager = ref()
  const isSelectionOpen = ref(false)
  const isGeneratorOpen = ref(false)
  const personType = ref<PersonType>(PersonType.NATURAL)
  const formType = ref<ActionType>('create')
  const itemToEdit = ref<IManager | null>(null)

  const models = ref<ILegalClientManager>({
    board_directors: false,
    managers: [],
  })

  const tableProperties = reactive({
    title: 'Listado de consejo directivo agregados',
    loading: false,
    columns: [
      {
        name: '#',
        required: true,
        label: '#',
        align: 'left',
        field: (row) => row.id,
        sortable: true,
        style: {
          'max-width': '50px',
          'overflow-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'person_type',
        required: true,
        label: 'Tipo de persona',
        align: 'left',
        field: (row) => {
          return row.person_type?.toLowerCase() === PersonType.NATURAL
            ? PersonType.NATURAL
            : PersonType.LEGAL
        },
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre / Razón social',
        align: 'left',
        field: (row) => {
          return row.person_type?.toLowerCase() === PersonType.NATURAL
            ? formatFullName({
                firstName: row.natural_person?.name,
                middleName: row.natural_person?.middle_name,
                lastName: row.natural_person?.last_name,
                secondLastName: row.natural_person?.second_last_name,
              })
            : row.legal_person.business_name
        },
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'Documento',
        align: 'left',
        field: (row) => row.document,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: computed(() => models.value?.managers || []),
  })

  const handleOptions = async ({
    option,
    type,
    row,
  }: {
    option: string
    type?: PersonType
    row?: IManager
  }) => {
    switch (option) {
      case 'create':
        if (type) handleCreation(type)
        break
      case 'edit':
        if (row) handleEdition(row)
        break
      case 'view':
        if (row) handleVisualization(row)
        break
      case 'delete':
        if (row?.id) deleteRow(row.id)
        break
      default:
        break
    }
  }

  const handleCreation = (type: PersonType) => openGenerator(type, 'create')

  const handleEdition = (manager: IManager) => {
    if (!manager.person_type) return
    openGenerator(manager.person_type as PersonType, 'edit', manager)
  }

  const handleVisualization = (manager: IManager) => {
    if (!manager.person_type) return
    openGenerator(manager.person_type as PersonType, 'view', manager)
  }

  const openGenerator = (
    type: PersonType,
    action: ActionType,
    manager?: IManager
  ) => {
    itemToEdit.value = manager ? { ...manager } : null
    personType.value = type
    formType.value = action
    isGeneratorOpen.value = true
  }

  const maxId = () =>
    models.value.managers.reduce(
      (max, item) => (item.id !== undefined ? Math.max(max, item.id) : max),
      0
    )

  const handleSave = (newItem: IManager) => {
    const { managers } = models.value

    if (newItem.id) {
      const index = managers.findIndex((item) => item.id === newItem.id)
      if (index !== -1) {
        // Se edita el registro en el array
        managers[index] = { ...managers[index], ...newItem }
      }
    } else {
      const itemData: IManager = {
        ...newItem,
        id: maxId() + 1,
      }

      if (itemData.id) {
        // Se agrega un nuevo registro
        managers.push({ ...itemData })
      }
    }
  }

  const deleteRow = (id: number | string) => {
    models.value.managers = models.value.managers.filter(
      (item) => item.id !== id
    )
  }

  const setValueModel = () => {
    clearForm()
    const data = props.managerDataForm

    if (data) {
      models.value.board_directors = !!data?.managers?.length
      models.value.managers =
        data?.managers?.map((it: IManager) => {
          const manager = { ...it }
          Object.assign(manager, {
            person_type: it.third_party_category ?? null,
            document_type_id: it.document_type_id ?? null,
            document: it.document ?? null,
          })
          return manager as IManager
        }) ?? []
    }
  }

  const clearForm = () => {
    models.value.board_directors = false
    models.value.managers = []
  }

  onMounted(async () => {
    setValueModel()
  })

  watch(
    () => props.managerDataForm,
    (val) => {
      if (val) {
        setValueModel()
      }
    }
  )

  watch(
    () => [models.value.board_directors, models.value.managers],
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataLegalCLientsManager(null)
      } else {
        _setDataLegalCLientsManager({
          board_directors: models.value.board_directors ?? undefined,
          managers: models.value.managers ?? [],
        })
      }
    }
  )

  return {
    models,
    isSelectionOpen,
    isGeneratorOpen,
    personType,
    formType,
    itemToEdit,
    formManager,
    tableProperties,
    handleOptions,
    handleSave,
  }
}

export default useManagerForm
