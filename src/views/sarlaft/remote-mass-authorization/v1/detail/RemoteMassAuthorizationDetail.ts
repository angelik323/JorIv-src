// Vue - router - quasar
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { QTableColumn } from 'quasar'

// Interfaces
import {
  IRemoteMassAuthorizationThirdParty,
  IRemoteMassAuthorizationDetailItem,
} from '@/interfaces/customs/sarlaft/RemoteMassAuthorization'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// Store
import { useRemoteMassAuthorizationStore } from '@/stores/sarlaft/remote-mass-authorization'

const useRemoteMassAuthorizationDetail = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const remoteMassAuthorizationStore = useRemoteMassAuthorizationStore('v1')

  const authorizationId = route.params.id as string

  const headerProps = {
    title: 'Gestionar solicitud masiva',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Sarlaft',
      },
      {
        label: 'Gestión autorización remota masiva',
        route: 'SarlaftRemoteMassAuthorization',
      },
      {
        label: 'Gestionar solicitud',
        route: 'SarlaftRemoteMassAuthorizationDetail',
      },
      {
        label: authorizationId,
      },
    ],
  }

  const columnsDefinition: QTableColumn<IRemoteMassAuthorizationThirdParty>[] =
    [
      {
        name: 'index',
        label: '#',
        field: 'index',
        align: 'left',
        sortable: false,
      },
      {
        name: 'identificationNumber',
        label: 'No. Identificación',
        field: 'identificationNumber',
        align: 'left',
        sortable: true,
      },
      {
        name: 'name',
        label: 'Nombre',
        field: 'name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'matchLevel',
        label: 'Nivel de coincidencia',
        field: 'matchLevelStatusId',
        align: 'center',
        sortable: true,
      },
      {
        name: 'precautionaryList',
        label: 'Sistema de coincidencia',
        field: 'precautionaryList',
        align: 'left',
        sortable: true,
      },
      {
        name: 'ownList',
        label: 'Lista propia',
        field: 'ownList',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: 'statusId',
        align: 'center',
        sortable: true,
      },
    ]

  const selectedRows = ref<IRemoteMassAuthorizationThirdParty[]>([])
  const tableProps = ref<IBaseTableProps<IRemoteMassAuthorizationThirdParty>>({
    loading: false,
    columns: columnsDefinition,
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })
  const alertModalRef = ref()
  const tableListRef = ref()
  const openModal = ref(false)
  const actionType = ref<'authorize' | 'reject' | null>(null)
  const justification = ref('')

  const queryParamsFilters = ref<Record<string, string | number | boolean>>({
    paginate: true,
  })

  const hasSelectedRows = computed(() => selectedRows.value.length > 0)

  const modalTitle = computed(() => {
    if (actionType.value === 'authorize') {
      return 'Autorizar solicitud'
    } else if (actionType.value === 'reject') {
      return 'Rechazar solicitud'
    }
    return ''
  })

  watch(openModal, (val) => {
    if (val) {
      alertModalRef.value?.openModal()
    } else {
      alertModalRef.value?.closeModal()
    }
  })

  const onUpdateSelected = (val: IRemoteMassAuthorizationThirdParty[]) => {
    selectedRows.value = val
  }

  const handleAuthorize = () => {
    if (!hasSelectedRows.value) return
    actionType.value = 'authorize'
    justification.value = ''
    openModal.value = true
  }

  const handleReject = () => {
    if (!hasSelectedRows.value) return
    actionType.value = 'reject'
    justification.value = ''
    openModal.value = true
  }

  const onConfirmAction = async () => {
    if (!justification.value.trim()) {
      return
    }

    const isAuthorize = actionType.value === 'authorize' ? 1 : 0
    const payload = {
      ids: selectedRows.value.map((row) => row.id),
      action: isAuthorize,
      justification: justification.value,
    }

    openMainLoader(true)
    const response = await remoteMassAuthorizationStore
      ._putRemoteMassAuthorizationUpdate(payload)
      .finally(() => openMainLoader(false))

    if (response && response.success) {
      selectedRows.value = []
      tableListRef.value?.clearSelection()
      openModal.value = false
      actionType.value = null
      justification.value = ''
      openMainLoader(true)
      setTimeout(async () => {
        await fetchDetailData(formatParamsCustom(queryParamsFilters.value))
        openMainLoader(false)
      }, 2000)
    }
  }

  const onCancelAction = () => {
    openModal.value = false
    actionType.value = null
    justification.value = ''
  }

  const mapDetailItemToThirdParty = (
    item: IRemoteMassAuthorizationDetailItem,
    index: number
  ): IRemoteMassAuthorizationThirdParty => {
    return {
      id: item.id,
      index: index + 1,
      identificationNumber: item.identification_number,
      name: item.name,
      matchLevelStatusId: item.match_level,
      precautionaryList: item.watchlist,
      statusId: item.status_id,
      ownList: item.own_list,
    }
  }

  const onPaginateHandler = (page: number) => {
    queryParamsFilters.value = {
      ...queryParamsFilters.value,
      page,
      paginate: true,
    }
    fetchDetailData(formatParamsCustom(queryParamsFilters.value))
  }

  const onRowsPerPageHandler = (rows: number) => {
    queryParamsFilters.value = {
      ...queryParamsFilters.value,
      paginate: true,
      rows,
    }
    fetchDetailData(formatParamsCustom(queryParamsFilters.value))
  }

  const fetchDetailData = async (queryParams: string = 'paginate=true') => {
    tableProps.value.rows = []
    openMainLoader(true)
    const response = await remoteMassAuthorizationStore
      ._getRemoteMassAuthorizationDetail(authorizationId, queryParams)
      .finally(() => openMainLoader(false))
    if (response && response.data) {
      tableProps.value.rows = response.data.map((item, index) =>
        mapDetailItemToThirdParty(item, index)
      )
      tableProps.value.pages = {
        currentPage: response.pages.currentPage,
        lastPage: response.pages.lastPage,
      }
    }
  }

  onMounted(() => {
    fetchDetailData()
  })

  return {
    headerProps,
    defaultIconsLucide,
    tableProps,
    selectedRows,
    hasSelectedRows,
    modalTitle,
    justification,
    alertModalRef,
    goToURL,
    onUpdateSelected,
    handleAuthorize,
    handleReject,
    onConfirmAction,
    onCancelAction,
    fetchDetailData,
    onPaginateHandler,
    onRowsPerPageHandler,
    tableListRef,
  }
}

export default useRemoteMassAuthorizationDetail
