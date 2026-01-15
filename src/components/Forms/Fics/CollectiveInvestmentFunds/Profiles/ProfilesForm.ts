// Vue - Pinia - Quasar
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces - Constants
import { collective_investment_funds_options as select_options } from '@/constants/resources'
import { IProfileUser } from '@/interfaces/customs/fics/CollectiveInvestmentFunds'
import { ActionType, StatusID } from '@/interfaces/global'

// Composables
import { useAlert, useUtils } from '@/composables'

// Stores
import { useAssetResourceStore } from '@/stores/resources-manager/assets'

const useProfilesForm = (props: {
  action: ActionType
  data?: IProfileUser[]
}) => {
  const { users } = storeToRefs(useAssetResourceStore('v1'))
  const { defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()

  const profilesFormRef = ref()
  const alertModalRef = ref()
  const addModalRef = ref()

  const MANAGER_USER_TYPE = 1
  const ADVISOR_USER_TYPE = 2

  const formData = ref({
    hasManager: false,
    hasAdvisors: false,
  })

  const referedRow = ref()

  const modalData = ref<IProfileUser>({
    id: 0,
    user: '',
    user_id: 0,
    description: '',
    is_active: 1,
    type_user: 1,
  })

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
  })

  const tablePropsManager = ref({
    title: 'Usuario gerente',
    loading: false,
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
        name: 'user',
        required: true,
        label: 'Usuario',
        align: 'left',
        field: 'user',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'is_active',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'is_active',
      },
    ] as QTable['columns'],
    rows: [] as IProfileUser[],
  })

  const tablePropsAdvisors = ref({
    title: 'Usuario asesor',
    loading: false,
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
        name: 'user',
        required: true,
        label: 'Usuario',
        align: 'left',
        field: 'user',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'is_active',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'is_active',
      },
    ] as QTable['columns'],
    rows: [] as IProfileUser[],
  })

  const sections = computed(() => [
    {
      key: MANAGER_USER_TYPE,
      label: 'Gerente FIC',
      model: formData.value.hasManager,
      modelKey: 'hasManager' as const,
      tableProps: tablePropsManager,
    },
    {
      key: ADVISOR_USER_TYPE,
      label: 'Asesores FIC',
      model: formData.value.hasAdvisors,
      modelKey: 'hasAdvisors' as const,
      tableProps: tablePropsAdvisors,
    },
  ])

  const loadData = () => {
    if (!props.data) return

    const managers: IProfileUser[] = []
    const advisors: IProfileUser[] = []

    let managerId = 1
    let advisorId = 1

    const getUserLabel = (userId: string | number | undefined) =>
      Array.isArray(users.value)
        ? users.value.find((opt) => opt.value === userId)?.label ?? '-'
        : '-'

    const createProfileUser = (item: IProfileUser, id: number) => ({
      id: item.id ?? id,
      user_id: item.user,
      user: getUserLabel(item.user),
      description: 'Rol no especificado',
      is_active: item.status?.id ?? 1,
      type_user: item.type_user,
    })

    for (const item of props.data) {
      if (item.type_user === MANAGER_USER_TYPE) {
        managers.push(createProfileUser(item, managerId++))
      } else if (item.type_user === ADVISOR_USER_TYPE) {
        advisors.push(createProfileUser(item, advisorId++))
      }
    }

    formData.value.hasManager = props.data.some(
      (item) => item.type_user === MANAGER_USER_TYPE && item.active_type_user
    )

    formData.value.hasAdvisors = props.data.some(
      (item) => item.type_user === ADVISOR_USER_TYPE && item.active_type_user
    )

    tablePropsManager.value.rows = managers
    tablePropsAdvisors.value.rows = advisors
  }

  const formatBoolean = (value: boolean | undefined | null): string => {
    if (value === true) return 'Sí'
    if (value === false) return 'No'
    return '-'
  }

  const handleOpenAlertModal = (row: IProfileUser) => {
    referedRow.value = row
    const statusText =
      row.is_active === StatusID.ACTIVE ? 'inactivar' : 'activar'
    alertModalConfig.value.description = `¿Desea ${statusText} el perfil seleccionado?`
    alertModalRef.value?.openModal()
  }

  const handleChangeStatusAlertModal = () => {
    if (referedRow.value) {
      let filteredRegister = null
      if (referedRow.value.type_user === MANAGER_USER_TYPE) {
        filteredRegister = tablePropsManager.value.rows.find(
          (row) => row.id === referedRow.value.id
        )
      } else {
        filteredRegister = tablePropsAdvisors.value.rows.find(
          (row) => row.id === referedRow.value.id
        )
      }

      if (filteredRegister) {
        filteredRegister.is_active =
          filteredRegister.is_active === StatusID.ACTIVE
            ? StatusID.INACTIVE
            : StatusID.ACTIVE
        alertModalRef.value?.closeModal()
        return showAlert(
          'Estado actualizado correctamente.',
          'success',
          undefined,
          1000
        )
      }
    }
  }

  const handleChangeStatus = (row: IProfileUser) => {
    row.is_active =
      row.is_active === StatusID.ACTIVE ? StatusID.INACTIVE : StatusID.ACTIVE
  }

  const handleOpenModal = (type: number) => {
    modalData.value = {
      id: 0,
      user: '',
      user_id: 0,
      description: '',
      is_active: 1,
      type_user: type,
    }

    addModalRef.value?.openModal?.()
  }

  const handleCloseModal = () => addModalRef.value?.closeModal?.()

  const handleAddRow = () => {
    const { user, is_active, type_user } = modalData.value
    const selectedUser = users.value.find((u) => u.value === user)

    if (!selectedUser) {
      showAlert('Usuario no válido', 'warning')
      return
    }

    const fullName = selectedUser.label
    const role = 'Rol no especificado'

    const targetTable =
      type_user === MANAGER_USER_TYPE
        ? tablePropsManager.value.rows
        : tablePropsAdvisors.value.rows

    const alreadyExists = targetTable.some((item) => item.user === user)
    if (alreadyExists) {
      showAlert('El usuario ya ha sido agregado.', 'warning')
      return
    }

    const newRow: IProfileUser = {
      id: targetTable.length + 1,
      user_id: Number(selectedUser.value),
      user: fullName,
      description: role,
      is_active,
      type_user,
    }

    targetTable.push(newRow)

    showAlert('¡Usuario agregado exitosamente!', 'success', undefined, 1000)
    handleCloseModal()
  }

  const getValues = () => {
    const result = []

    const hasManagerUsers = tablePropsManager.value.rows.length > 0
    const hasAdvisorUsers = tablePropsAdvisors.value.rows.length > 0

    result.push({
      type_user: MANAGER_USER_TYPE,
      active_type_user: hasManagerUsers,
      users: tablePropsManager.value.rows.map(({ user_id, is_active }) => ({
        user_id,
        status_id: is_active,
      })),
    })

    result.push({
      type_user: ADVISOR_USER_TYPE,
      active_type_user: hasAdvisorUsers,
      users: tablePropsAdvisors.value.rows.map(({ user_id, is_active }) => ({
        user_id,
        status_id: is_active,
      })),
    })

    return result
  }

  const validateForm = async () => {
    for (const section of sections.value) {
      const modelKey = section.modelKey
      const isChecked = formData.value[modelKey]

      if (isChecked && !section.tableProps.value.rows.length) {
        showAlert(
          `Debe agregar al menos un usuario en la sección: "${section.label}".`,
          'warning'
        )
        return false
      }
    }

    return true
  }

  const isView = computed(() => ['view'].includes(props.action))
  const isDisabled = computed(() => ['edit'].includes(props.action))
  const isEditable = computed(() => ['create', 'edit'].includes(props.action))

  const isFormValid = computed(() => {
    const { user, is_active } = modalData.value

    return (
      !!user &&
      user.toString().trim() !== '' &&
      (!isEditable.value || (is_active !== undefined && is_active !== null))
    )
  })

  watch(
    [() => props.data, () => users.value],
    ([data, usersLoaded]) => {
      if (data && Array.isArray(usersLoaded) && usersLoaded.length > 0) {
        loadData()
      }
    },
    { immediate: true, deep: true }
  )

  return {
    users,
    isView,
    sections,
    formData,
    getValues,
    modalData,
    isDisabled,
    isEditable,
    addModalRef,
    isFormValid,
    validateForm,
    handleAddRow,
    alertModalRef,
    formatBoolean,
    select_options,
    handleOpenModal,
    profilesFormRef,
    alertModalConfig,
    handleCloseModal,
    defaultIconsLucide,
    handleChangeStatus,
    handleOpenAlertModal,
    handleChangeStatusAlertModal,
  }
}

export default useProfilesForm
