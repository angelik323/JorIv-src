// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IQuerySystemAccessAuditList } from '@/interfaces/customs/audit/QuerySystemAccessAudit'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'

// Stores
import { useQuerySystemAccessAuditStore } from '@/stores/audit/query-system-access-audit'
import { useAuditResourcesStore } from '@/stores/resources-manager/audit'
import { useUserResourceStore } from '@/stores/resources-manager/users'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useQuerySystemAccessAuditList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { is_required } = useRules()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _listAction } = useQuerySystemAccessAuditStore('v1')

  const { authentication_type } = storeToRefs(useAuditResourcesStore('v1'))
  const { user_roles } = storeToRefs(useUserResourceStore('v1'))

  const isTableEmpty = ref(true)
  const showState = ref(0)

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const keys = {
    audit: ['authentication_type'],
    user: ['roles'],
  }

  const headerProps = {
    title: 'Consultar auditoría de ingreso al sistema',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Auditoría',
      },
      {
        label: 'Consultar auditoría de ingreso al sistema',
        route: 'QuerySystemAccessAuditList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'initial_date',
      label: 'Fecha inicial*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      rules: [
        (val: string) => is_required(val, 'La fecha inicial es requerida'),
      ],
    },
    {
      name: 'final_date',
      label: 'Fecha final*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      rules: [(val: string) => is_required(val, 'La fecha final es requerida')],
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por nombre / usuario / IP',
    },
    {
      name: 'role_id',
      label: 'Rol',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: user_roles,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
    {
      name: 'type',
      label: 'Tipo de evento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: authentication_type,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
  ])

  const tableProps = ref<IBaseTableProps<IQuerySystemAccessAuditList>>({
    title: 'Listado de la consulta auditoría de ingreso al sistema',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'left',
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'type',
        align: 'left',
        label: 'Tipo de evento',
        field: (row) => row.type || '-',
        sortable: true,
      },
      {
        name: 'ip_address',
        align: 'left',
        label: 'IP',
        field: (row) => row.ip_address || '-',
        sortable: true,
      },
      {
        name: 'user_name',
        align: 'left',
        label: 'Nombre del usuario',
        field: (row) => row.user.name || '-',
        sortable: true,
      },
      {
        name: 'user_role',
        align: 'left',
        label: 'Rol',
        field: (row) => row.user.role || '-',
        sortable: true,
      },
      {
        name: 'used_at',
        align: 'left',
        label: 'Fecha y hora',
        field: (row) => row.used_at || '-',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources(keys)

    setTimeout(() => openMainLoader(false), 1000)
  }

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    const response = await _listAction(filters)

    if (response) {
      tableProps.value.rows = response.list
      tableProps.value.pages = response.pages
    }

    isTableEmpty.value = !tableProps.value.rows.length
    showState.value = filters ? 1 : 0

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleFilter = async ($filters: {
    'filter[initial_date]': string
    'filter[final_date]': string
    'filter[role_id]': string
    'filter[search]': string
    'filter[type]': string
  }) => {
    filtersFormat.value = {
      'filter[dateRange]':
        $filters['filter[initial_date]'] + ',' + $filters['filter[final_date]'],
      'filter[role_id]': $filters['filter[role_id]'],
      'filter[search]': $filters['filter[search]'],
      'filter[type]': $filters['filter[type]'],
      page: 1,
      rows: filtersFormat.value.rows,
    }
    await loadData(filtersFormat.value)
  }

  const handleClearFilters = () => {
    showState.value = 0
    isTableEmpty.value = true
    tableProps.value.rows = []
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    await loadData(filtersFormat.value)
  }

  const handleUpdatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value)
  }

  onMounted(async () => await loadResources())

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    showState,
    tableProps,
    headerProps,
    filterConfig,
    isTableEmpty,
    handleFilter,
    handleUpdatePage,
    handleClearFilters,
    handleUpdatePerPage,
  }
}

export default useQuerySystemAccessAuditList
