// Vue - Quasar
import { onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// Interfaces - Constants
import { ActionType, StatusID } from '@/interfaces/global'
import { status } from '@/constants'
import {
  IOperatingOfficeChildExtended,
  IOperatingOfficeExtended,
} from '@/interfaces/customs/fics/OperatingOffices'

// Composables
import { useAlert, useMainLoader, useUtils } from '@/composables'

// Stores
import { useOperatingOfficesStore } from '@/stores/fics/operating-offices'

const useInformationForm = (props: {
  action: ActionType
  data?: IOperatingOfficeExtended
}) => {
  const { _setDataOperatingOffices } = useOperatingOfficesStore('v1')

  const { showAlert } = useAlert()
  const { isEmptyOrZero } = useUtils()
  const { openMainLoader } = useMainLoader()

  const addOfficesModalRef = ref()
  const informationFormRef = ref()
  const modalFormRef = ref()

  const extendedScheduleEndRef = ref({ validate: () => Promise.resolve(true) })
  const statusSelectorRef = ref({ validate: () => Promise.resolve(true) })

  const selectedOption = ref<'si' | 'no'>()
  const customColumns = ['status', 'actions']

  const formData = ref<IOperatingOfficeExtended>({
    id: 0,
    regional_code: '',
    regional_description: '',
    web: false,
    status_id: 1,
    offices: [] as IOperatingOfficeChildExtended[],
  })

  const modalOfficesData = ref<IOperatingOfficeChildExtended>({
    id: 0,
    office_code: '',
    office_description: '',
    office_schedule_start: formData.value.web ? '00:00' : '',
    office_schedule_end: '',
    extended_schedule_start: '',
    extended_schedule_end: '',
    status_id: 1,
  })

  const tableProps = ref({
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
        name: 'office_code',
        required: false,
        label: 'Código oficina',
        align: 'left',
        field: 'office_code',
        sortable: true,
      },
      {
        name: 'office_description',
        required: false,
        label: 'Descripción oficina',
        align: 'left',
        field: 'office_description',
        sortable: true,
      },
      {
        name: 'office_schedule_start',
        required: false,
        label: 'H. oficina inicial',
        align: 'left',
        field: 'office_schedule_start',
        sortable: true,
      },
      {
        name: 'office_schedule_end',
        required: false,
        label: 'H. oficina final',
        align: 'left',
        field: 'office_schedule_end',
        sortable: true,
      },
      {
        name: 'extended_schedule_start',
        required: false,
        label: 'H. extendido inicial',
        align: 'left',
        field: 'extended_schedule_start',
        sortable: true,
      },
      {
        name: 'extended_schedule_end',
        required: false,
        label: 'H. extendido final',
        align: 'left',
        field: 'extended_schedule_end',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'status_id',
      },
      ...(['create', 'edit'].includes(props.action)
        ? [
            {
              name: 'actions',
              required: true,
              label: 'Acciones',
              align: 'center',
              field: 'actions',
            },
          ]
        : []),
    ] as QTable['columns'],
    rows: [] as IOperatingOfficeChildExtended[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const handleOpenModal = () => {
    const { regional_code, regional_description, web } = formData.value

    if (!regional_code || !regional_description) {
      showAlert('Todos los campos son obligatorios', 'warning')
      return
    }
    modalOfficesData.value = {
      id: 0,
      office_code: '',
      office_description: '',
      office_schedule_start: web ? '00:00' : '',
      office_schedule_end: web ? '23:59' : '',
      extended_schedule_start: '',
      extended_schedule_end: '',
      status_id: 1,
    }

    addOfficesModalRef.value?.openModal?.()
  }

  const handleCloseModal = () => {
    addOfficesModalRef.value?.closeModal?.()
  }

  const validateForm = async () => {
    return (await modalFormRef.value?.validate()) ?? false
  }

  const handleAdd = async () => {
    const existingIndex = formData.value.offices?.findIndex(
      (item) => item.id === modalOfficesData.value.id
    )

    if (existingIndex === undefined || existingIndex < 0) {
      const isDuplicateOfficeCode = formData.value.offices?.some(
        (item) => item.office_code === modalOfficesData.value.office_code
      )

      if (isDuplicateOfficeCode) {
        showAlert('El codigo de oficina ya existe', 'error')
        return
      }
    }

    if (await validateForm()) {
      if (existingIndex !== undefined && existingIndex >= 0) {
        formData.value.offices[existingIndex] = {
          ...modalOfficesData.value,
        }
      } else {
        const { id, ...rest } = modalOfficesData.value
        formData.value.offices?.push({
          ...rest,
        })
      }
      tableProps.value.rows = [...formData.value.offices]
      handleCloseModal()
    }
  }

  const handleEdit = (id: number) => {
    const item = formData.value.offices?.find((item) => item.id === id)
    if (item) {
      modalOfficesData.value = { ...item }
      addOfficesModalRef.value?.openModal?.()
    }
  }

  const loadData = () => {
    if (props.action !== 'create' && props.data) {
      formData.value = {
        ...props.data,
        status_id: props.data?.status_id ?? null,
        regional_code: props.data?.regional_code ?? '',
        offices:
          props.data?.offices?.map((office) => ({
            ...office,
            office_code: office.office_code ?? '',
            extended_schedule_start: office.extended_schedule_start ?? '',
            extended_schedule_end: office.extended_schedule_end ?? '',
          })) || [],
      }

      tableProps.value.rows = [...(formData.value.offices ?? [])]
    }
  }

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
    statusId: null as number | null,
  })

  const openAlertModal = async (row: IOperatingOfficeChildExtended) => {
    alertModalConfig.value.description = setAlertModalDescription(
      Number(row.status_id)
    )
    alertModalConfig.value.entityId = row.id ?? null
    alertModalConfig.value.statusId = row.status_id
    await alertModalRef.value.openModal()
  }

  const changeStatusAction = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.entityId) return

    const officeIndex = formData.value.offices?.findIndex(
      (office) => office.id === alertModalConfig.value.entityId
    )

    if (officeIndex !== undefined && officeIndex >= 0) {
      formData.value.offices[officeIndex].status_id =
        alertModalConfig.value.statusId === StatusID.ACTIVE
          ? StatusID.INACTIVE
          : StatusID.ACTIVE

      showAlert('¡Registro actualizado exitosamente!', 'success')
    }
    openMainLoader(false)
  }
  const setAlertModalDescription = (statusId: number) => {
    const action = statusId === StatusID.ACTIVE ? 'inactivar' : 'activar'
    return `¿Desea ${action} la oficina?`
  }

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: loadData,
      edit: setFormEdit,
      view: setFormEdit,
    }
    actionHandlers[action]?.()
  }
  const setFormEdit = () => {
    clearForm()
    const data = props.data
    if (data) {
      Object.assign(formData.value, {
        ...data,
      })
    }
  }

  const clearForm = () => {
    formData.value = {
      id: 0,
      regional_code: '',
      regional_description: '',
      web: false,
      status_id: 1,
      offices: [],
    }
    tableProps.value.rows = []
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => formData.value,
    () => {
      if (isEmptyOrZero(formData.value)) {
        _setDataOperatingOffices(null)
        tableProps.value.rows = []
      } else {
        _setDataOperatingOffices({
          ...formData.value,
          offices: formData.value.offices?.map((office) => ({
            ...office,
          })),
        })
        tableProps.value.rows = [...formData.value.offices]
      }
    },
    { deep: true }
  )

  onMounted(() => {
    handlerActionForm(props.action)
  })

  return {
    addOfficesModalRef,
    formData,
    informationFormRef,
    modalFormRef,
    status,
    selectedOption,
    tableProps,
    modalOfficesData,
    customColumns,
    statusSelectorRef,
    extendedScheduleEndRef,
    alertModalConfig,
    alertModalRef,
    openAlertModal,
    isRowActive,
    handleOpenModal,
    handleCloseModal,
    handleAdd,
    handleEdit,
    changeStatusAction,
  }
}

export default useInformationForm
