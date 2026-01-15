import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useAlert } from '@/composables'
import {
  useFiltersStore,
  useResourcesStore,
  usePermissionStore,
  usePermissionFormStore,
  useDataFormStore,
  useUserStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'

export const usePermissionsForm = (props: any, emit: Function) => {
  const { permissions_status, modules } = storeToRefs(useResourcesStore())
  const { permissionList, filteredItems, permissions } = storeToRefs(
    usePermissionFormStore()
  )
  const { setFiltersState } = useFiltersStore()
  const { _setPermissionsData, _setPermissionListData } =
    usePermissionFormStore()
  const { userDataForm } = storeToRefs(useDataFormStore())
  const { getPermissionList } = usePermissionStore()
  const { permissionListData, roleId } = storeToRefs(usePermissionStore())
  const { userRoleId, userData } = storeToRefs(useUserStore())

  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const filterParams = ref<{
    'filter[module]': string | number | null
    'filter[status_id]': number | string | null
    'filter[search]': string | null
  }>({
    'filter[module]': null,
    'filter[status_id]': null,
    'filter[search]': null,
  })

  const filterConfig = ref([
    {
      name: 'module',
      label: 'Módulo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: modules.value,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: permissions_status.value,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      disable: false,
      icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por permiso',
    },
  ])

  const tableProperties = ref({
    title: 'Listado de permisos',
    loading: false,
    columns: [
      {
        name: 'module',
        required: false,
        label: 'Módulo',
        align: 'left',
        field: 'module',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Permiso',
        align: 'left',
        field: 'description',
        sortable: true,
        style: 'white-space: pre-wrap',
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status',
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
    rows: filteredItems,
    rowsLength: [0],
    hiddeQta: true,
  })

  const bannerProps = ref({
    message:
      'El usuario debe volver a iniciar sesión para aplicar los cambios.',
  })

  const formValues = ref({
    permissions: null as string[] | null,
  })

  const filterPermissionList = (
    filters: {
      'filter[module]': string | number | null
      'filter[status_id]': number | string | null
      'filter[search]': string | null
    },
    notDisplayAlert?: boolean
  ) => {
    tableProperties.value.loading = true

    // Update current filters
    filterParams.value = filters

    if (filterParams.value['filter[status_id]'] === 0)
      filterParams.value['filter[status_id]'] = null

    filteredItems.value = permissionList.value.filter((item) => {
      // Filter by module
      const matchesModule = filterParams.value['filter[module]']
        ? item.module === filterParams.value['filter[module]']
        : true

      // Filter by status
      const matchesStatus =
        filterParams.value['filter[status_id]'] !== null
          ? item.status_id === Number(filterParams.value['filter[status_id]'])
          : true

      // Filter by text
      const matchesSearch = filterParams.value['filter[search]']
        ? item.description
            .toLowerCase()
            .includes(filterParams.value['filter[search]'].toLowerCase())
        : true

      // Return true if success all filters
      return matchesModule && matchesStatus && matchesSearch
    })

    if (filteredItems.value.length === 0 && !notDisplayAlert)
      showAlert('¡No hay datos para mostrar!', 'error')

    tableProperties.value.loading = false
  }

  const handleClickButton = () => {
    if (permissions.value.length > 0) {
      emit('onContinue', 'permissions')
    } else {
      showAlert(
        '¡Se debe establecer por lo menos 1 permiso!',
        'error',
        undefined,
        3000
      )
    }
  }

  const clearFilters = () => {
    filterParams.value['filter[module]'] = null
    filterParams.value['filter[status_id]'] = 0
    filterParams.value['filter[search]'] = null
    filterPermissionList(filterParams.value)
  }

  const updateStatus = (itemId: number, newStatus: number) => {
    const item = permissionList.value.find((perm) => perm.id === itemId)
    if (item) {
      item.status_id = newStatus
      filterPermissionList(filterParams.value)
      updatePermissionsArray()
    }
  }

  const updatePermissionsArray = () => {
    formValues.value.permissions = permissionList.value
      .filter((item) => item.status_id === 1)
      .map((item) => item.name)
  }

  const allowDisallowAllPermissions = (status_id: number) => {
    filteredItems.value.forEach((filteredItem) => {
      const itemInList = permissionList.value.find(
        (item) => item.id === filteredItem.id
      )
      if (itemInList) itemInList.status_id = status_id
    })
    filterPermissionList(filterParams.value)
    updatePermissionsArray()
  }

  const getPermissionsList = async () => {
    if (roleId.value !== userDataForm.value?.role) {
      openMainLoader(true)
      if (userDataForm.value?.role) {
        const success = await getPermissionList(userDataForm.value.role)
        if (success) {
          _setPermissionListData(permissionListData.value)
        }
      } else if (!userDataForm.value?.role) {
        _setPermissionListData([])
      }
      openMainLoader(false)
    }
  }

  const getPermissionsListEdit = async () => {
    if (userRoleId.value === userDataForm.value?.role) {
      roleId.value = null
      _setPermissionListData(userData.value?.permissions as [])
    } else if (userRoleId.value !== userDataForm.value?.role) {
      await getPermissionsList()
    }
  }

  onMounted(async () => {
    setFiltersState(filterConfig.value)
    if (props.formType === 'create') {
      filterPermissionList(filterParams.value, true)
      await getPermissionsList()
      _setPermissionsData(formValues.value.permissions)
    }
    if (props.formType === 'update') {
      await getPermissionsListEdit()
    }
    updatePermissionsArray()
  })

  watch(
    () => formValues.value.permissions,
    (val) => {
      if (val) _setPermissionsData(val)
    }
  )

  return {
    formValues,
    tableProperties,
    bannerProps,
    handleClickButton,
    filterPermissionList,
    clearFilters,
    updateStatus,
    allowDisallowAllPermissions,
  }
}
