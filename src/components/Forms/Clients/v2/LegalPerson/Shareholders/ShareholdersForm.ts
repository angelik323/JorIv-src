// Vue - pinia
import { ref, watch } from 'vue'

// Interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import { IBaseShareholdersForm } from '@/interfaces/customs/clients/Clients'

// Composables
import { useUtils, useAlert } from '@/composables'
import { IShareholder as IShareholderV1 } from '@/interfaces/customs/Clients'

const useShareholdersForm = (
  props: {
    action: ActionType
    data: IBaseShareholdersForm | null
  },
  emit: Function
) => {
  const { defaultIconsLucide, formatFullName, getMaxId, isEmptyOrZero } =
    useUtils()
  const { showAlert } = useAlert()

  const formElementRef = ref()

  const initialModelsValues: IBaseShareholdersForm = {
    has_shareholders: false,
    shareholders: [],
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  // Por refactorizar.
  type PersonType = 'Natural' | 'Juridica'
  type FormType = 'create' | 'edit' | 'view'

  const isSelectionOpen = ref(false)
  const isGeneratorOpen = ref(false)
  const personType = ref<PersonType>('Natural')
  const formType = ref<FormType>('create')
  const itemToEdit = ref<IShareholderV1 | undefined>(undefined)

  const tableProperties = ref<IBaseTableProps<IShareholderV1>>({
    title: 'Listado de accionistas agregados',
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
        style:
          'max-width: 50px; overflow-wrap: break-word; white-space: break-spaces;',
      },
      {
        name: 'person_type',
        required: true,
        label: 'Tipo de persona',
        align: 'left',
        field: (row) => {
          return row.person_type?.toLowerCase() === 'natural'
            ? 'Natural'
            : 'Jurídica'
        },
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre / Razón social',
        align: 'left',
        field: (row) => {
          return row.person_type?.toLowerCase() === 'natural'
            ? formatFullName({
                firstName: row.first_name || undefined,
                middleName: row.second_name || undefined,
                lastName: row.first_last_name || undefined,
                secondLastName: row.second_last_name || undefined,
              })
            : row.social_reason
        },
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'Documento',
        align: 'left',
        field: 'document_number',
        sortable: true,
      },
      {
        name: 'shareholder_type',
        required: true,
        label: 'Tipo de accionista',
        align: 'left',
        field: 'shareholder_type',
        sortable: true,
      },
      {
        name: 'participation_percent',
        required: true,
        label: 'Porcentaje de participación',
        align: 'left',
        field: (row) => `${row.participation_percent}%`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const handleOptions = async ({
    option,
    type,
    row,
  }: {
    option: string
    type?: PersonType
    row?: IShareholderV1
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

  const handleEdition = (shareholder: IShareholderV1) => {
    if (!shareholder.person_type) return
    openGenerator(shareholder.person_type as PersonType, 'edit', shareholder)
  }

  const handleVisualization = (shareholder: IShareholderV1) => {
    if (!shareholder.person_type) return
    openGenerator(shareholder.person_type as PersonType, 'view', shareholder)
  }

  const openGenerator = (
    type: PersonType,
    action: FormType,
    shareholder?: IShareholderV1
  ) => {
    itemToEdit.value = shareholder ? { ...shareholder } : undefined
    personType.value = type
    formType.value = action
    isGeneratorOpen.value = true
  }

  const handleSave = (newItem: IShareholderV1) => {
    const { shareholders } = models.value

    const newPercent = parseFloat(newItem.participation_percent || '0')

    if (newItem.shareholder_type === 'Directo') {
      const sum = shareholders
        .filter((e) => e.shareholder_type === newItem.shareholder_type)
        .reduce(
          (acc, r) =>
            r.id === newItem.id
              ? acc
              : acc + Number(r.participation_percent ?? 0),
          0
        )

      const projectedTotal = sum + newPercent

      if (projectedTotal > 100) {
        return showAlert(
          'La participación total de los accionistas directos excede el 100%',
          'error',
          undefined,
          5000
        )
      }
    }

    if (newItem.id) {
      const index = shareholders.findIndex((item) => item.id === newItem.id)
      if (index !== -1) {
        // Se edita el registro en el array
        shareholders[index] = { ...shareholders[index], ...newItem }
      }
    } else {
      const itemData: IShareholderV1 = {
        ...newItem,
        id: getMaxId(shareholders) + 1,
      }

      if (itemData.id) {
        // Se agrega un nuevo registro
        shareholders.push({ ...itemData })
      }
    }
  }

  const deleteRow = (id: number | string) => {
    models.value.shareholders = models.value.shareholders.filter(
      (item) => item.id !== id
    )
  }

  const validateTotalPercent = () => {
    const directRows = tableProperties.value.rows.filter(
      (e) => e.shareholder_type === 'Directo'
    )

    const sum = directRows.reduce(
      (acc, r) => acc + Number(r.participation_percent ?? 0),
      0
    )

    return Math.abs(sum - 100) < 0.001
  }

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

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

  watch(
    () => models.value.shareholders,
    (val) => (tableProperties.value.rows = [...val]),
    { immediate: true, deep: true }
  )

  return {
    defaultIconsLucide,
    formElementRef,
    models,

    isSelectionOpen,
    isGeneratorOpen,
    personType,
    formType,
    itemToEdit,

    tableProperties,
    handleOptions,
    handleSave,
    validateTotalPercent,
  }
}

export default useShareholdersForm
