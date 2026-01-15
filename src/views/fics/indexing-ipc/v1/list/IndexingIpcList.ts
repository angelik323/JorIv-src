// Vue - Vue Router - Pinia - Quasar
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IIndexingIpcItem,
  IIndexingListRequest,
} from '@/interfaces/customs/fics/IndexingIpc'

// Composables
import { useGoToUrl, useMainLoader, useRouteValidator, useUtils } from '@/composables'

// Stores
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useIndexingIpcStore } from '@/stores/fics/indexing-ipc'

const useIndexingIpcList = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { indexing_ipc_list, indexing_ipc_pages } = storeToRefs(
    useIndexingIpcStore('v1')
  )
  const { _getIndexingIpcList, _downloadIndexingIpc, _cleanData } =
    useIndexingIpcStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { funds } = storeToRefs(useFicResourceStore('v1'))

  const filtersFormat = ref<Record<string, string | number>>({})
  const isTableEmpty = ref(true)
  const showState = ref(0)

  let perPage = 20

  const keys = {
    fics: ['funds'],
  }

  const headerProps = {
    title: 'Indexación IPC',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Indexación IPC',
        routr: 'IndexingIpcList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'collective_investment_fund_id',
      label: 'Fondo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      options: funds,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'created_at',
      label: 'Fecha de cierre',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      disable: false,
      prepend_icon: defaultIconsLucide.calendar,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
  ])

  const tableProps = ref({
    title: 'Listado de indexaciones realizadas',
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
        name: 'fund',
        required: true,
        label: 'Código',
        align: 'left',
        field: (row: IIndexingIpcItem) => `${row.fund}`,
        sortable: true,
      },
      {
        name: 'business_trust',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row: IIndexingIpcItem) => `${row.business_trust}`,
        sortable: true,
      },
      {
        name: 'last_closing_date',
        required: true,
        label: 'Fecha de cierre',
        align: 'left',
        field: (row: IIndexingIpcItem) => `${row.last_closing_date ?? '-'}`,
        sortable: true,
      },
      {
        name: 'rate',
        required: true,
        label: 'Tasa',
        align: 'left',
        field: (row: IIndexingIpcItem) =>
          row.rate !== null && row.rate !== undefined ? `${row.rate}%` : '-',
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
    rows: [] as IIndexingIpcItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
    }
    listAction(formatParamsCustom(filtersFormat.value))
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    listAction(formatParamsCustom(filtersFormat.value))
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    listAction(formatParamsCustom(filtersFormat.value))
  }

  const listAction = async (filters: string = '') => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _getIndexingIpcList(filters)

    const hasResults = indexing_ipc_list.value.length > 0

    isTableEmpty.value = !hasResults
    showState.value = filters ? 1 : 0

    setTimeout(() => openMainLoader(false), 1000)
  }

  const organizedDataTable = (array: IIndexingListRequest[]) => {
    return array.map((item: IIndexingListRequest) => ({
      id_fund: item.fund.id,
      id: item.id,
      fund: `${item.fund.fund_code} - ${item.fund.fund_name}`,
      business_trust: `${item.business_trust.business_code} - ${item.business_trust.name}`,
      last_closing_date: item.fund.last_closing_date ?? '---',
      rate: item.rate,
    }))
  }

  const onDownload = async (id: string, code: string) => {
    const code_fund = code.split(' - ')[0]
    await _downloadIndexingIpc(id, code_fund, 'list')
  }

  const onCleanData = () => {
    showState.value = 0
    isTableEmpty.value = true

    _cleanData()
  }

  onMounted(async () => {
    onCleanData()

    if (route.query.reload === 'true') await listAction()

    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    () => indexing_ipc_list.value,
    () => (tableProps.value.rows = organizedDataTable(indexing_ipc_list.value))
  )

  watch(
    () => indexing_ipc_pages.value,
    () => (tableProps.value.pages = indexing_ipc_pages.value)
  )

  return {
    goToURL,
    showState,
    updatePage,
    tableProps,
    onDownload,
    headerProps,
    onCleanData,
    filterConfig,
    handleFilter,
    isTableEmpty,
    updatePerPage,
    validateRouter,
    defaultIconsLucide,
  }
}

export default useIndexingIpcList
