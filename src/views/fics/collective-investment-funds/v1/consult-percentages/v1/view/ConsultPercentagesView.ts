// Vuew - Pinia - Router
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IConsultPercentageList,
  IConsultPercentageSummary,
} from '@/interfaces/customs/fics/CollectiveInvestmentFunds'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'

const useConsultPercentagesView = () => {
  const { defaultIconsLucide, formatCurrency, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    _listConsultPercentageAction,
    _summaryConsultPercentageAction,
    _exportExcelConsultPercentageAction,
  } = useCollectiveInvestmentFundsStore('v1')
  const { consult_percentage_list, consult_percentage_pages } = storeToRefs(
    useCollectiveInvestmentFundsStore('v1')
  )

  const formData = ref<IConsultPercentageSummary | null>(null)
  const isTableEmpty = ref(true)

  const id = route.params.id as string

  const headerProps = {
    title: 'Consultar porcentaje por inversionista',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Fondos de inversión colectiva',
        route: 'CollectiveInvestmentFundsList',
      },
      {
        label: 'Consultar porcentajes',
        route: 'ConsultPercentagesView',
      },
      {
        label: id,
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
      required: false,
    },
  ]

  const tableProps = ref<IBaseTableProps<IConsultPercentageList>>({
    title: 'Línea de inversionistas',
    loading: false,
    columns: [
      {
        name: 'holder_identification',
        label: 'Identificación titular',
        align: 'left',
        field: 'holder_identification',
        sortable: true,
        required: true,
      },
      {
        name: 'plan_inversion',
        label: 'Plan de inversión',
        align: 'left',
        field: (row: IConsultPercentageList) => row?.plan_code || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'status',
        label: 'Estado plan de inversión',
        align: 'left',
        field: (row: IConsultPercentageList) => row?.status || '-',
      },
      {
        name: 'date',
        label: 'Fecha de apertura',
        align: 'left',
        field: (row: IConsultPercentageList) => row?.created_at || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'amount',
        label: 'Saldo plan de inversión',
        align: 'left',
        field: (row: IConsultPercentageList) =>
          formatCurrency(row?.plan_balance || 0),
        sortable: true,
        required: true,
      },
      {
        name: 'percentage',
        label: 'Porcentaje de participación',
        align: 'left',
        field: (row: IConsultPercentageList) =>
          row?.participation_percentage
            ? `${row.participation_percentage.toFixed(2)}%`
            : '-',
        sortable: true,
        required: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const loadData = async () => {
    openMainLoader(true)
    tableProps.value.rows = []

    formData.value = await _summaryConsultPercentageAction(Number(id))
    await _listConsultPercentageAction(Number(id))

    const hasResults = consult_percentage_list.value.length > 0
    isTableEmpty.value = !hasResults

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleExportExcel = async () =>
    await _exportExcelConsultPercentageAction(Number(id))

  const handleGoToList = () =>
    goToURL('CollectiveInvestmentFundsList', undefined, { reload: true })

  onMounted(async () => await loadData())

  watch(
    consult_percentage_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = consult_percentage_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    tabs,
    formData,
    tabActive,
    formatDate,
    tableProps,
    headerProps,
    tabActiveIdx,
    isTableEmpty,
    handleGoToList,
    formatCurrency,
    handleExportExcel,
  }
}

export default useConsultPercentagesView
