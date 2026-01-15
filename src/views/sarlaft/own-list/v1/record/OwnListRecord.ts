// Vue - router - quasar
import { ref, computed, watch, onMounted } from 'vue'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IOwnList } from '@/interfaces/customs/sarlaft/OwnList'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// Stores
import { useOwnListStore } from '@/stores/sarlaft/own-list'

const useOwnListRecord = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { goToURL } = useGoToUrl()
  const ownListStore = useOwnListStore()
  const { openMainLoader, titleLoader, loaderMessage } = useMainLoader()

  titleLoader.value = 'Actualizando estado'
  loaderMessage.value = 'Por favor, espere un momento...'

  const headerProps = {
    title: 'Listas propias',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Sarlaft',
      },
      {
        label: 'Listas propias',
        route: 'SarlaftOwnList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search_name',
      label: 'Nombre/razón social',
      type: 'q-input',
      value: null,
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      class: 'col-12 col-md-6',
    },
    {
      name: 'search_status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      options: [
        {
          label: 'Activo',
          value: 'Activo',
        },
        {
          label: 'Inactivo',
          value: 'Inactivo',
        },
      ],
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])
  const tableProps = ref<IBaseTableProps<IOwnList>>({
    title: 'Listado de listas propias',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'nombre_razon_social',
        label: 'Nombre/razón social',
        field: 'name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: 'status',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'id',
        sortable: false,
      },
    ],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
    rows: [],
  })
  const openStateChangeModal = ref(false)
  const pendingStateChange = ref<{ row: IOwnList; newState: boolean } | null>(
    null
  )
  const alertModalRef = ref()
  const queryParamsFilters = ref<Record<string, string | number | boolean>>({})

  const stateChangeMessage = computed(() => {
    if (!pendingStateChange.value) return ''
    const action = pendingStateChange.value.newState ? 'activar' : 'desactivar'
    return `¿Está seguro que desea ${action} este registro?`
  })

  watch(openStateChangeModal, (val) => {
    if (val) {
      alertModalRef.value?.openModal()
    } else {
      alertModalRef.value?.closeModal()
    }
  })

  const onSwitchChange = (row: IOwnList, newValue: boolean) => {
    pendingStateChange.value = { row, newState: newValue }
    openStateChangeModal.value = true
  }

  const onConfirmStateChange = async () => {
    if (pendingStateChange.value) {
      const { row, newState } = pendingStateChange.value
      const estado = newState ? 'Activo' : 'Inactivo'
      try {
        openMainLoader(true)
        await ownListStore._toggleOwnListStatus(row.id.toString())
        row.status = estado
      } catch (error) {
      } finally {
        openMainLoader(false)
      }
    }
    openStateChangeModal.value = false
    pendingStateChange.value = null
  }

  const onCancelStateChange = () => {
    openStateChangeModal.value = false
    pendingStateChange.value = null
  }

  const onFilterHandler = (
    filters: Record<string, string | number | boolean>
  ) => {
    resetData()
    queryParamsFilters.value = {
      ...filters,
      paginate: 1,
    }
    const parsedFilters = formatParamsCustom(queryParamsFilters.value)
    setOwnListData(parsedFilters)
  }

  const onPaginateHandler = (page: number) => {
    queryParamsFilters.value = {
      ...queryParamsFilters.value,
      page,
      paginate: true,
    }
    const parsedFilters = formatParamsCustom(queryParamsFilters.value)
    setOwnListData(parsedFilters)
  }

  const onRowsPerPageHandler = (rows: number) => {
    queryParamsFilters.value = {
      ...queryParamsFilters.value,
      paginate: true,
      rows,
    }
    const parsedFilters = formatParamsCustom(queryParamsFilters.value)
    setOwnListData(parsedFilters)
  }

  const setOwnListData = async (
    queryParamsFilters: string = 'paginate=true'
  ) => {
    tableProps.value.loading = true
    const response = await ownListStore._getOwnList(queryParamsFilters)
    if (response) {
      tableProps.value.rows = response.data
      tableProps.value.pages = response.pages
    }
    tableProps.value.loading = false
  }

  const onCleanFilters = () => {
    resetData()
  }

  const resetData = () => {
    queryParamsFilters.value = {}
    tableProps.value.rows = []
    tableProps.value.pages = {
      currentPage: 0,
      lastPage: 0,
    }
  }

  onMounted(() => {
    setOwnListData()
  })

  return {
    headerProps,
    tableProps,
    defaultIconsLucide,
    filterConfig,
    openStateChangeModal,
    stateChangeMessage,
    alertModalRef,
    goToURL,
    onSwitchChange,
    onConfirmStateChange,
    onCancelStateChange,
    onFilterHandler,
    onPaginateHandler,
    onRowsPerPageHandler,
    onCleanFilters,
  }
}

export default useOwnListRecord
