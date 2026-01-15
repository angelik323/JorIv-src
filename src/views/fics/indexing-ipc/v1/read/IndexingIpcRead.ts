// Vue - Vue Router - Pinia - Quasar
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IIndexingIpcProcessItem } from '@/interfaces/customs/fics/IndexingIpc'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useIndexingIpcStore } from '@/stores/fics/indexing-ipc'

const useIndexingIpcRead = () => {
  const { defaultIconsLucide, formatCurrency } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _processIndexingIpc, _downloadIndexingIpc, _cleanData } =
    useIndexingIpcStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    indexing_fund,
    indexing_ipc_process_list,
    indexing_process_ipc_pages,
  } = storeToRefs(useIndexingIpcStore('v1'))

  const id: number | string | string[] = route.params.id

  const filtersFormat = ref<Record<string, string | number>>({})
  const indexingIpcForm = ref()

  let perPage = 20

  const keys = {
    fics: ['funds'],
  }

  const headerProps = {
    title: 'Ver indexación IPC',
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
        route: 'IndexingIpcList',
      },
      {
        label: 'Ver',
        route: 'IndexingIpcRead',
      },
      { label: `${id}` },
    ],
  }
  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tableProps = ref({
    title: 'Listado de planes de inversión indexados',
    loading: false,
    columns: [
      {
        name: 'investment_plan_id',
        required: false,
        label: '#',
        align: 'left',
        field: 'investment_plan_id',
        sortable: true,
      },
      {
        name: 'investment_plan_code',
        required: true,
        label: 'Plan de inversión',
        align: 'left',
        field: (row: IIndexingIpcProcessItem) => `${row.investment_plan_code}`,
        sortable: true,
      },
      {
        name: 'initial_balance',
        required: true,
        label: 'Saldo inicial',
        align: 'left',
        field: (row: IIndexingIpcProcessItem) =>
          formatCurrency(row.initial_balance ?? 0),
        sortable: true,
      },
      {
        name: 'indexation_value',
        required: true,
        label: 'Valor indexado',
        align: 'left',
        field: (row: IIndexingIpcProcessItem) =>
          formatCurrency(row.indexation_value ?? 0),
        sortable: true,
      },
      {
        name: 'yields',
        required: true,
        label: 'Rendimentos',
        align: 'left',
        field: (row: IIndexingIpcProcessItem) =>
          formatCurrency(row.yields ?? 0),
        sortable: true,
      },
      {
        name: 'final_balance',
        required: true,
        label: 'Saldo final',
        align: 'left',
        field: (row: IIndexingIpcProcessItem) =>
          formatCurrency(row.final_balance ?? 0),
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IIndexingIpcProcessItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }

    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }

    listAction()
  }

  const listAction = async () => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _processIndexingIpc(id)
    tableProps.value.loading = false
  }

  const onDownload = async () => {
    if (indexing_fund.value.fund_id) {
      await _downloadIndexingIpc(
        indexing_fund.value.fund_id!,
        indexing_fund.value.fund_info.fund_code,
        'read'
      )
    }
  }

  const handleGoToList = () =>
    goToURL('IndexingIpcList', undefined, { reload: true })

  onMounted(() => {
    indexing_fund.value.fund_id = null
    indexing_ipc_process_list.value = []
    openMainLoader(true)
    setTimeout(async () => {
      await _getResources(keys)
      indexing_fund.value.fund_id = id
      await listAction()
      openMainLoader(false)
    }, 3000)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _cleanData()
  })

  watch(
    () => indexing_ipc_process_list.value,
    () => (tableProps.value.rows = indexing_ipc_process_list.value)
  )

  watch(
    () => indexing_process_ipc_pages.value,
    () => (tableProps.value.pages = indexing_process_ipc_pages.value)
  )

  return {
    tabs,
    tabActive,
    tableProps,
    updatePage,
    onDownload,
    headerProps,
    tabActiveIdx,
    updatePerPage,
    handleGoToList,
    indexingIpcForm,
    indexing_ipc_process_list,
  }
}

export default useIndexingIpcRead
