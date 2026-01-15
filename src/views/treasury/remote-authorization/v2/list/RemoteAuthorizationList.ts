// Vue & Vue Router
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
//pinia & quasar & utils
import { storeToRefs } from 'pinia'
import { QTableColumn } from 'quasar'
import { defaultIconsLucide } from '@/utils'
// Stores
import {
  useRemoteAuthorization,
  useTreasuryResourceStore,
  useResourceManagerStore,
} from '@/stores'
// Interfaces
import { IRemoteAuthorizationItem, IFieldFilters } from '@/interfaces/customs'
import { TreasuryStatusID } from '@/interfaces/global'
// Composables

const useRemoteTreasuryAuthorizationList = () => {
  const router = useRouter()

  const raStore = useRemoteAuthorization('v2')
  const { _getListAction } = raStore

  const {
    remote_authorization_statuses,
    remote_authorization_modules,
    remote_authorization_processes,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const keysV2 = {
    treasury: [
      'remote_authorization_statuses',
      'remote_authorization_modules',
      'remote_authorization_processes',
    ],
  }

  const headerProps = {
    title: 'Autorización remota de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      {
        label: 'Solicitudes de autorización',
        route: 'RemoteAuthorizationList',
      },
    ],
  }

  const filters = ref<IFieldFilters[]>([
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: remote_authorization_statuses,
      hide: false,
      autocomplete: true,
    },
    {
      name: 'module',
      label: 'Módulo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: remote_authorization_modules,
      hide: false,
      autocomplete: true,
    },
    {
      name: 'process',
      label: 'Proceso',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: remote_authorization_processes,
      hide: false,
      autocomplete: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      prepend_icon: 'mdi-magnify',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
      hide: false,
    },
    {
      name: 'date_from',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      hide: true,
    },
    {
      name: 'date_to',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      hide: true,
    },
  ])

  const filtersKey = computed(() =>
    filters.value.map((f) => `${f.name}:${f.hide ? 1 : 0}`).join('|')
  )

  const tableRef = ref()
  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTableColumn<IRemoteAuthorizationItem>[]
    rows: IRemoteAuthorizationItem[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Listado de solicitudes de autorización',
    loading: false,
    columns: [
      {
        name: 'status',
        label: 'Estado',
        align: 'left',
        field: (row) => row.status?.name ?? '—',
        sortable: true,
      },
      {
        name: 'module',
        label: 'Módulo',
        align: 'left',
        field: (row) => row.module ?? '—',
        sortable: true,
      },
      {
        name: 'user',
        label: 'Usuario',
        align: 'left',
        field: (row) => row.created_by?.name ?? '—',
        sortable: true,
      },
      {
        name: 'auth_code',
        label: 'Número de autorización',
        align: 'left',
        field: (row) => row.authorization_code ?? '—',
        sortable: true,
      },
      {
        name: 'register',
        label: 'Registro',
        align: 'left',
        field: (row) => row.id ?? '—',
        sortable: true,
      },
      {
        name: 'process',
        label: 'Procesos',
        align: 'left',
        field: (row) => row.process ?? '—',
      },
      {
        name: 'description',
        label: 'Descripción',
        align: 'left',
        field: (row) => row.description ?? '—',
      },
      {
        name: 'motives',
        label: 'Observaciones',
        align: 'left',
        field: (row) => row.motives ?? '—',
      },
      {
        name: 'requested_at',
        label: 'Fecha solicitud',
        align: 'left',
        field: (row) => row.authorization_request_date ?? '—',
        sortable: true,
      },
      { name: 'actions', label: 'Acciones', align: 'center', field: () => '' },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const selectedRows = ref<IRemoteAuthorizationItem[]>([])
  const onUpdateSelected = (val: IRemoteAuthorizationItem[]) => {
    selectedRows.value = val
  }

  const showState = ref(0)
  const isListEmpty = ref(true)
  const showMoreFilters = ref(false)

  const openForm = ref(false)
  const formMode = ref<'authorize' | 'reject'>('authorize')

  const isValidDateRange = (
    start?: string | null,
    end?: string | null
  ): boolean => {
    if (!start || !end) return true
    const s = new Date(start).getTime()
    const e = new Date(end).getTime()
    if (Number.isNaN(s) || Number.isNaN(e)) return true
    return s <= e
  }

  const customSelectionFilter = (selected: IRemoteAuthorizationItem[]) =>
    selected.filter(
      (item: IRemoteAuthorizationItem) =>
        item.status?.id !== TreasuryStatusID.AUTHORIZED &&
        item.status?.id !== TreasuryStatusID.REJECTED
    )

  const remoteAuthorizationFilters = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.loading = true
    const remoteAuthorizationParameters = await _getListAction(filters)
    if (remoteAuthorizationParameters) {
      tableProps.value.rows = remoteAuthorizationParameters.list.map((row) => ({
        ...row,
        disabled:
          row.status?.id === TreasuryStatusID.AUTHORIZED ||
          row.status?.id === TreasuryStatusID.REJECTED,
      }))
      tableProps.value.pages = remoteAuthorizationParameters.pages
    }
    const hasResults = tableProps.value.rows.length > 0
    showState.value = 1
    isListEmpty.value = !hasResults
    tableProps.value.loading = false
  }

  const handleUpdateFilters = async ($filters: {
    'filter[status]': string
    'filter[module]': string
    'filter[search]': string
    'filter[date_from]': string
    'filter[date_to]': string
  }) => {
    if (
      !isValidDateRange(
        $filters['filter[date_from]'],
        $filters['filter[date_to]']
      )
    )
      return

    remoteAuthorizationFilters.value = {
      ...$filters,
      page: 1,
      rows: remoteAuthorizationFilters.value.rows,
    }

    await listAction(remoteAuthorizationFilters.value)
  }

  const updatePage = async (page: number) => {
    remoteAuthorizationFilters.value.page = page
    await listAction(remoteAuthorizationFilters.value)
  }

  const updatePerPage = async (rows: number) => {
    remoteAuthorizationFilters.value.page = 1
    remoteAuthorizationFilters.value.rows = rows

    await listAction(remoteAuthorizationFilters.value)
  }

  const handleShowFilters = (showMore: boolean): void => {
    showMoreFilters.value = !!showMore
    filters.value = filters.value.map((f) =>
      ['date_from', 'date_to'].includes(f.name)
        ? { ...f, hide: !showMoreFilters.value }
        : f
    )
  }

  const toggleOptions = (): void => handleShowFilters(!showMoreFilters.value)

  const onToggleOptions = (val?: boolean): void => {
    if (typeof val === 'boolean') handleShowFilters(val)
    else toggleOptions()
  }

  const handleClear = (): void => {
    tableProps.value.rows = []
    tableProps.value.pages = { currentPage: 1, lastPage: 1 }
    isListEmpty.value = true
    showState.value = 0
    handleShowFilters(false)
    onUpdateSelected([])
  }

  const openAuthorizeForm = (): void => {
    if (!selectedRows.value.length) return
    formMode.value = 'authorize'
    openForm.value = true
  }

  const openRejectForm = (): void => {
    if (!selectedRows.value.length) return
    formMode.value = 'reject'
    openForm.value = true
  }

  const handleFormDone = async (): Promise<void> => {
    await listAction({ ...remoteAuthorizationFilters.value })
    selectedRows.value = []
    openForm.value = false
    tableRef.value.clearSelection()
  }

  const handleView = (row: IRemoteAuthorizationItem): void => {
    router.push({ name: 'RemoteAuthorizationView', params: { id: row.id } })
  }

  onMounted(async () => {
    await _getResources(keysV2, '', 'v2')
    tableProps.value.rows = []
    tableProps.value.pages = { currentPage: 1, lastPage: 1 }
    isListEmpty.value = true
    showState.value = 0
    handleShowFilters(false)
  })

  return {
    headerProps,
    filters,
    filtersKey,
    tableProps,
    selectedRows,
    showState,
    isListEmpty,
    openForm,
    formMode,
    defaultIconsLucide,
    tableRef,
    onToggleOptions,
    handleUpdateFilters,
    handleClear,
    updatePage,
    updatePerPage,
    onUpdateSelected,
    openAuthorizeForm,
    openRejectForm,
    handleFormDone,
    handleView,
    customSelectionFilter,
  }
}

export default useRemoteTreasuryAuthorizationList
