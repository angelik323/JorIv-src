// Vue - Router - Quasar
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { QTableColumn } from 'quasar'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { IRemoteMassAuthorization } from '@/interfaces/customs/sarlaft/RemoteMassAuthorization'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// Store
import { useSarlaftResourceStore } from '@/stores/resources-manager/sarlaft'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useRemoteMassAuthorizationStore } from '@/stores/sarlaft/remote-mass-authorization'

const useRemoteMassAuthorizationView = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { finding_list_origin_modules } = storeToRefs(
    useSarlaftResourceStore('v1')
  )
  const remoteMassAuthorizationStore = useRemoteMassAuthorizationStore('v1')

  const hasSearched = ref(false)

  const headerProps = {
    title: 'Gestión de autorización remota masiva',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Sarlaft',
      },
      {
        label: 'Gestión de autorización remota masiva',
        route: 'SarlaftRemoteMassAuthorization',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'module',
      label: 'Módulo de origen',
      type: 'q-select',
      value: null,
      options: finding_list_origin_modules,
      class: 'col-12 col-md-12',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'date_from',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      class: 'col-12 col-md-6',
    },
    {
      name: 'date_to',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      class: 'col-12 col-md-6',
    },
  ])
  const tableProps = ref<IBaseTableProps<IRemoteMassAuthorization>>({
    loading: false,
    columns: [
      {
        name: 'request_date',
        label: 'Fecha de solicitud',
        field: 'request_date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'origin_module',
        label: 'Módulo de cargue masivo',
        field: 'origin_module',
        align: 'left',
        sortable: true,
        format: (val: number) => {
          const module = finding_list_origin_modules.value.find(
            (m) => m.value === val
          )
          return module ? module.label : val.toString()
        },
      },
      {
        name: 'coincidences',
        label: 'Número de coincidencias',
        field: 'coincidences',
        align: 'center',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        sortable: false,
      },
    ] as QTableColumn<IRemoteMassAuthorization>[],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const queryParamsFilters = ref<Record<string, string | number | boolean>>({})

  const onFilterHandler = (
    filters: Record<string, string | number | boolean>
  ) => {
    resetData()
    queryParamsFilters.value = {
      ...filters,
      paginate: 1,
    }
    setRemoteMassAuthorizationData(formatParamsCustom(queryParamsFilters.value))
  }

  const onPaginateHandler = (page: number) => {
    queryParamsFilters.value = {
      ...queryParamsFilters.value,
      page,
      paginate: true,
    }
    setRemoteMassAuthorizationData(formatParamsCustom(queryParamsFilters.value))
  }

  const onRowsPerPageHandler = (rows: number) => {
    queryParamsFilters.value = {
      ...queryParamsFilters.value,
      paginate: true,
      rows,
    }
    setRemoteMassAuthorizationData(formatParamsCustom(queryParamsFilters.value))
  }

  const onCleanFilters = () => {
    resetData()
  }

  const setRemoteMassAuthorizationData = async (
    queryParamsFilters: string = 'paginate=true'
  ) => {
    openMainLoader(true)
    hasSearched.value = true
    const response =
      await remoteMassAuthorizationStore._getRemoteMassAuthorizations(
        queryParamsFilters
      )
    if (response) {
      tableProps.value.rows = response.data
      tableProps.value.pages = response.pages
    }
    openMainLoader(false)
  }

  const resetData = () => {
    queryParamsFilters.value = {}
    tableProps.value.rows = []
    tableProps.value.pages = {
      currentPage: 0,
      lastPage: 0,
    }
    hasSearched.value = false
  }

  const handleManage = (row: { grupo_id: string }) => {
    goToURL('SarlaftRemoteMassAuthorizationDetail', row.grupo_id)
  }

  onMounted(async () => {
    await _getResources({ sarlaft: ['finding_list_origin_modules'] })
  })

  onBeforeUnmount(() =>
    _resetKeys({ sarlaft: ['finding_list_origin_modules'] })
  )

  return {
    headerProps,
    defaultIconsLucide,
    tableProps,
    filterConfig,
    handleManage,
    onFilterHandler,
    onPaginateHandler,
    onRowsPerPageHandler,
    onCleanFilters,
    hasSearched,
  }
}

export default useRemoteMassAuthorizationView
