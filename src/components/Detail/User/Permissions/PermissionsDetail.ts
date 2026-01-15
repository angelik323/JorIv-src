import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { defaultIcons } from '@/utils'
// Stores
import {
  useFiltersStore,
  usePermissionFormStore,
  useResourcesStore,
  useUserStore,
} from '@/stores'
import { useAlert } from '@/composables'

export const usePermissionsDetail = () => {
  // Stores
  const { showAlert } = useAlert()
  const { permissions_status, modules } = storeToRefs(useResourcesStore())
  const { setFiltersState } = useFiltersStore()
  const { permissionList, filteredItems } = storeToRefs(
    usePermissionFormStore()
  )
  const { _setPermissionListData } = usePermissionFormStore()
  const { userData } = storeToRefs(useUserStore())

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
        align: 'center',
        field: 'status',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: filteredItems,
    rowsLength: [0],
    hiddeQta: true,
  })

  const filterPermissionList = (filters: {
    'filter[module]': string | number | null
    'filter[status_id]': number | string | null
    'filter[search]': string | null
  }) => {
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

    if (filteredItems.value.length === 0)
      showAlert('¡No hay datos para mostrar!', 'error')

    tableProperties.value.loading = false
  }

  const clearFilters = () => {
    filterParams.value['filter[module]'] = null
    filterParams.value['filter[status_id]'] = 0
    filterParams.value['filter[search]'] = null
    filterPermissionList(filterParams.value)
  }

  const getPermissionList = () => {
    _setPermissionListData(userData.value?.permissions as [])
  }

  onMounted(() => {
    setFiltersState(filterConfig.value)
    getPermissionList()
  })

  return { defaultIcons, tableProperties, filterPermissionList, clearFilters }
}
