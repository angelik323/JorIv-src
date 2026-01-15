//Vue-Pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

//Qasar
import { QTable } from 'quasar'

//Router
import router from '@/router'
//Composables - Utils
import { useMainLoader, useRouteValidator, useUtils } from '@/composables'
//Interfaces
import {
  IFieldFilters,
  IQuotasIssuingPermitsResponse,
} from '@/interfaces/customs'
//Stores
import { useQuotasIssuingPermitsStore } from '@/stores'

const useQuotasIssuingPermitsList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  const quotasIssuingPermitsStore = useQuotasIssuingPermitsStore('v1')
  const { formatParamsCustom } = useUtils()
  const { quotas_issuing_permits_list, quotas_issuing_permits_pages } =
    storeToRefs(quotasIssuingPermitsStore)
  const { _listAction, _deleteAction } = quotasIssuingPermitsStore

  const filtersFormat = ref<Record<string, string | number>>({})
  const isQuotasIssuingPermitsEmpty = ref(true)
  const alertModalRef = ref()
  const showState = ref(0)

  let perPage = 20

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el cupo y permiso emisor?',
    id: null as number | null,
  })

  const headerProperties = {
    title: 'Definición cupos y permisos emisor',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: 'Definición cupos y permisos emisor',
        route: 'QuotasIssuingPermitsList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  const tableProperties = ref({
    title: 'Listado de cupos y permisos emisor',
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
        name: 'emitter_id',
        align: 'left',
        label: 'ID Emisor',
        field: 'emitter_id',
        sortable: true,
      },
      {
        name: 'description_emitter_name',
        align: 'left',
        label: 'Descripción',
        field: 'description_emitter_name',
        sortable: true,
      },
      {
        name: 'portfolio_code',
        align: 'left',
        label: 'Código Portafolio',
        field: 'portfolio_code',
        sortable: true,
      },
      {
        name: 'description_portfolio_name',
        align: 'left',
        label: 'Descripción',
        field: 'description_portfolio_name',
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'actions',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IQuotasIssuingPermitsResponse[],
    pages: quotas_issuing_permits_pages,
  })

  const loadData = async (filters: string = 'paginate=1') => {
    openMainLoader(true)

    await _listAction(filters)

    const hasResults = quotas_issuing_permits_list.value.length > 0

    showState.value = filters ? 1 : 0
    isQuotasIssuingPermitsEmpty.value = !hasResults

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
      paginate: 1,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleOptions = (option: string, id: number) => {
    if (option === 'edit') handleGoTo('QuotasIssuingPermitsEdit', id)
    else if (option === 'view') handleGoTo('QuotasIssuingPermitsView', id)
    else if (option === 'delete') {
      alertModalConfig.value.id = id
      alertModalRef.value.openModal()
    }
  }

  const handleDeleteItem = async () => {
    if (alertModalConfig.value.id != null) {
      await _deleteAction(alertModalConfig.value.id)
      await alertModalRef.value.closeModal()
      await handleUpdatePage(1)
      alertModalConfig.value.id = null
    }
  }

  const handleClearFilters = () => {
    showState.value = 0
    filtersFormat.value = {}
    tableProperties.value.rows = []
    isQuotasIssuingPermitsEmpty.value = true
  }

  const handleUpdatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleUpdatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      rows: perPage,
      paginate: 1,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleGoTo = (route: string, id?: number) =>
    router.push({ name: route, params: { id } })

  watch(
    () => quotas_issuing_permits_list.value,
    () => {
      tableProperties.value.rows = quotas_issuing_permits_list.value
      tableProperties.value.pages = quotas_issuing_permits_pages.value
    }
  )

  return {
    showState,
    handleGoTo,
    handleFilter,
    filterConfig,
    alertModalRef,
    handleOptions,
    tableProperties,
    headerProperties,
    handleUpdatePage,
    handleDeleteItem,
    alertModalConfig,
    handleClearFilters,
    defaultIconsLucide,
    handleUpdatePerPage,
    isQuotasIssuingPermitsEmpty,
    validateRouter,
  }
}

export default useQuotasIssuingPermitsList
