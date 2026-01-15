// Vue - Pinia - Quasar
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

const useIndexingIpcCreate = () => {
  const { defaultIconsLucide, formatCurrency } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const {
    _cleanData,
    _createIndexingIpc,
    _processIndexingIpc,
    _downloadIndexingIpc,
  } = useIndexingIpcStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    indexing_fund,
    indexing_ipc_process_list,
    indexing_process_ipc_pages,
  } = storeToRefs(useIndexingIpcStore('v1'))

  const filtersFormat = ref<Record<string, string | number>>({})
  const indexingIpcForm = ref()

  let perPage = 20

  const keys = {
    fics: ['funds'],
  }

  const headerProps = {
    title: 'Crear indexación IPC',
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
        label: 'Crear',
        route: 'IndexingIpcCreate',
      },
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
    await _processIndexingIpc(
      indexing_fund.value.fund_id!,
      indexing_fund.value.fund_rate
    )
    tableProps.value.loading = false
  }

  const validateForms = async () => {
    return indexingIpcForm?.value?.validateForm()
  }

  const onProcess = async () => {
    if (indexing_fund.value.fund_id !== null) {
      if (await validateForms()) {
        openMainLoader(true)
        listAction()
      }
    }

    setTimeout(() => openMainLoader(false), 1000)
  }

  const onCreate = async () => {
    if (
      await _createIndexingIpc(
        indexing_fund.value.fund_id!,
        indexing_fund.value.fund_rate
      )
    )
      handleGoToList()

    setTimeout(() => openMainLoader(false), 1000)
  }

  const onDownload = async () => {
    if (indexing_fund.value.fund_id) {
      await _downloadIndexingIpc(
        indexing_fund.value.fund_id,
        indexing_fund.value.fund_info.fund_code,
        'create'
      )
    }
  }

  const handleGoToList = () =>
    goToURL('IndexingIpcList', undefined, { reload: true })

  onMounted(async () => {
    openMainLoader(true)
    indexing_fund.value.fund_id = null
    indexing_ipc_process_list.value = []
    await _getResources(keys)
    await _getResources(
      {
        investment_portfolio: ['interest_rates'],
      },
      'filter[search]=IPC&filter[payment_frequency]=Periodo'
    )
    openMainLoader(false)
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
    onCreate,
    tabActive,
    onProcess,
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

export default useIndexingIpcCreate
