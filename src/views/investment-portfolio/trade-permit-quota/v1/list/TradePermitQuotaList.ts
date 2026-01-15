import { useMainLoader } from '@/composables'
import { IFieldFilters } from '@/interfaces/customs'
import { ITradePermitQuotaList } from '@/interfaces/customs/'
import { useTradePermitQuotaStore } from '@/stores'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { ref, watch } from 'vue'

export const useTradePermitQuotaList = () => {
  //Constantes - referencias
  const { trade_permit_quota_list, trade_permit_quota_pages } = storeToRefs(
    useTradePermitQuotaStore('v1')
  )
  const { _getTradePermitQuotaList, _deleteTradePermitQuota } =
    useTradePermitQuotaStore('v1')

  const alertModalRef = ref()
  const { openMainLoader } = useMainLoader()
  const headerProps = {
    title: 'Definición cupos y permisos Trader',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Definición cupos y permisos Trader',
        route: 'TradePermitQuotaList',
      },
    ],
  }
  let perPage = 20
  const filtersFormat = ref<Record<string, string | number>>({})
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Está seguro que desea eliminar el cupo y permiso trader?',
    id: null as number | null,
  })

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ITradePermitQuotaList[]
    pages: typeof trade_permit_quota_pages.value
    rowsPerPage: number
  }>({
    title: 'Listado de cupos y permisos Trader',
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
        name: 'portfolio_code',
        required: false,
        label: 'Código Portafolio',
        align: 'left',
        field: 'portfolio_code',
        sortable: true,
      },
      {
        name: 'description_portfolio_name',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description_portfolio_name',
        sortable: true,
      },
      {
        name: 'emitter_id',
        required: false,
        label: 'ID Emisor',
        align: 'left',
        field: 'emitter_id',
        sortable: true,
      },
      {
        name: 'description_emitter_name',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description_emitter_name',
        sortable: true,
      },
      {
        name: 'counterpart_id',
        required: false,
        label: 'ID Contraparte',
        align: 'left',
        field: 'counterpart_id',
        sortable: true,
      },
      {
        name: 'description_counterpart_name',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description_counterpart_name',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
        style: 'width: 150px;',
      },
    ] as QTable['columns'],
    rows: [],
    pages: trade_permit_quota_pages.value,
    rowsPerPage: perPage,
  })

  const filters = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      placeholder: 'Buscar por código o coincidencia',
      value: null,
      disable: false,
      clean_value: true,
      class: 'col-12 col-md-12',
    },
  ])

  //Funciones

  const handleFilter = ($filter: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filter,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    tableProps.value.rows = []
    filtersFormat.value = {}
  }

  const openAlertModal = (id: number) => {
    alertModalConfig.value.id = id
    alertModalRef.value.openModal()
  }

  const changeStatus = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteTradePermitQuota(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getTradePermitQuotaList(filters)
    tableProps.value.loading = false
  }
  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  watch(
    () => trade_permit_quota_list.value,
    () => {
      tableProps.value.rows = trade_permit_quota_list.value
    },
    { deep: true }
  )

  return {
    headerProps,
    alertModalConfig,
    tableProps,
    alertModalRef,
    filters,
    updatePage,
    updatePerPage,
    openAlertModal,
    changeStatus,
    handleFilter,
    handleClear,
  }
}
