// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  ActionType,
  WriteActionType,
  IBaseTableProps,
  StatusID,
} from '@/interfaces/global'
import { IEconomicActivityCorporateForm } from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import { QForm } from 'quasar'

// Composables
import { useUtils } from '@/composables'
import { default_statuses } from '@/constants/resources'

// Stores
import { useAssetResourceStore } from '@/stores/resources-manager/assets'

const useEconomicActivitiesForm = (
  props: {
    action: ActionType
    data: IEconomicActivityCorporateForm[]
  },
  emit: Function
) => {
  const { ciius } = storeToRefs(useAssetResourceStore('v1'))

  const { defaultIconsLucide, getMaxId } = useUtils()

  const formElementRef = ref<QForm>()

  const initialModelsValues: IEconomicActivityCorporateForm = {
    economic_activity: null,
    economic_activity_code: null,
    economic_activity_desc: null,
    status: StatusID.ACTIVE, // Por defecto
    is_ciiu_primary: false,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const isModalOpen = ref(false)
  const modalConfig = ref({
    title: '',
    btnText: '',
    action: null as WriteActionType | null,
  })

  const tableProperties = ref<IBaseTableProps<IEconomicActivityCorporateForm>>({
    title: 'Listado de actividades económicas CIIU',
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
        label: 'Código CIIU',
        align: 'left',
        field: 'economic_activity_code',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'economic_activity_desc',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'main',
        required: true,
        label: 'Principal',
        align: 'left',
        field: (row) => (row.is_ciiu_primary ? 'Si' : '-'),
        sortable: true,
      },
    ],
    rows: props.data || [],
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

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const handleTableOptions = async (
    action: WriteActionType,
    row?: IEconomicActivityCorporateForm
  ) => {
    const isCreate = action === 'create'
    modalConfig.value = {
      title: `${isCreate ? 'Registro' : 'Edición'} de actividades económicas`,
      btnText: isCreate ? 'Crear' : 'Actualizar',
      action,
    }

    models.value = isCreate
      ? { ...initialModelsValues }
      : { ...(row ?? initialModelsValues) }

    isModalOpen.value = true
  }

  const handleDelete = (row: IEconomicActivityCorporateForm) => {
    const list = props.data
    const filteredList = list.filter(({ id }) => id !== row.id)
    emit('update:data', filteredList)
  }

  const onSave = async () => {
    if (!(await formElementRef.value?.validate())) return

    const activity = models.value
    const isEditing = Boolean(activity.id)
    const list = props.data

    if (isEditing) {
      const index = list.findIndex(({ id }) => id === activity.id)
      if (index === -1) return
      const updatedList = list.map((item, i) =>
        i === index ? { ...item, ...activity } : item
      )
      emit('update:data', updatedList)
    } else {
      const newItem = {
        ...activity,
        id: getMaxId(list) + 1,
      }
      emit('update:data', [...list, newItem])
    }

    isModalOpen.value = false
  }

  watch(
    () => props.data,
    (val) => (tableProperties.value.rows = [...val]),
    { immediate: true }
  )

  return {
    default_statuses,
    ciius,
    defaultIconsLucide,
    formElementRef,
    models,
    isModalOpen,
    modalConfig,
    tableProperties,
    isRowActive,
    handleTableOptions,
    handleDelete,
    onSave,
  }
}

export default useEconomicActivitiesForm
