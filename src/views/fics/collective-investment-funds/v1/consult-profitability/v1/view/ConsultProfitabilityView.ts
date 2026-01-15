// Vue - Vue Router - Pinia
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IConsultProfitabilityList,
  IConsultPercentageSummary,
} from '@/interfaces/customs/fics/CollectiveInvestmentFunds'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'

const useConsultPercentagesView = () => {
  const { defaultIconsLucide, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    _listConsultProfitabilityAction,
    _summaryConsultPercentageAction,
    _exportExcelConsultProfitabilityAction,
  } = useCollectiveInvestmentFundsStore('v1')
  const { consult_profitability_list, consult_profitability_pages } =
    storeToRefs(useCollectiveInvestmentFundsStore('v1'))

  const formData = ref<IConsultPercentageSummary | null>(null)
  const selectedDate = ref<string>('')
  const isTableEmpty = ref(true)
  const showState = ref(0)

  const id = route.params.id as string

  const headerProps = {
    title: 'Consultar rentabilidades del fondo',
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
        label: 'Consultar rentabilidades del fondo',
        route: 'ConsultProfitabilityView',
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

  const tableProps = ref<IBaseTableProps<IConsultProfitabilityList>>({
    title: 'Listado de rentabilidades por tipo de participación',
    loading: false,
    columns: [
      {
        name: 'participation_type_code',
        label: 'Tipo de participación',
        align: 'left',
        field: (row: IConsultProfitabilityList) =>
          row.participation_type_code || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'participation_type_description',
        label: 'Descripción tipo de participación',
        align: 'left',
        field: (row: IConsultProfitabilityList) =>
          row.participation_type_description || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'return_day',
        label: 'Rent. Día',
        align: 'left',
        field: (row: IConsultProfitabilityList) =>
          row.return_day ? `${Number(row.return_day).toFixed(2)}%` : '-',
        sortable: true,
        required: true,
      },
      {
        name: 'return_week_days',
        label: 'Rent. 7 Días',
        align: 'left',
        field: (row: IConsultProfitabilityList) =>
          row.return_week_days ? `${Number(row.return_week_days).toFixed(2)}%` : '-',
        sortable: true,
        required: true,
      },
      {
        name: 'return_last_month',
        label: 'Rent. Último mes',
        align: 'left',
        field: (row: IConsultProfitabilityList) =>
          row.return_last_month
            ? `${Number(row.return_last_month).toFixed(2)}%`
            : '-',
        sortable: true,
        required: true,
      },
      {
        name: 'return_last_year',
        label: 'Rent. Último año',
        align: 'left',
        field: (row: IConsultProfitabilityList) =>
          row.return_last_year
            ? `${Number(row.return_last_year).toFixed(2)}%`
            : '-',
        sortable: true,
        required: true,
      },
      {
        name: 'return_last_2_years',
        label: 'Rent. Último 2 años',
        align: 'left',
        field: (row: IConsultProfitabilityList) =>
          row.return_last_2_years
            ? `${Number(row.return_last_2_years).toFixed(2)}%`
            : '-',
        required: true,
        sortable: true,
      },
      {
        name: 'return_last_3_years',
        label: 'Rent. Último 3 años',
        align: 'left',
        field: (row: IConsultProfitabilityList) =>
          row.return_last_3_years
            ? `${Number(row.return_last_3_years).toFixed(2)}%`
            : '-',
        required: true,
        sortable: true,
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

    formData.value = await _summaryConsultPercentageAction(Number(id))

    setTimeout(() => openMainLoader(false), 1000)
  }

  const loadDataList = async () => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _listConsultProfitabilityAction(Number(id), selectedDate.value)

    const hasResults = consult_profitability_list.value.length > 0
    showState.value = selectedDate.value ? 1 : 0
    isTableEmpty.value = !hasResults

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleExportExcel = async () =>
    await _exportExcelConsultProfitabilityAction(Number(id), selectedDate.value)

  const handleGoToList = () =>
    goToURL('CollectiveInvestmentFundsList', undefined, { reload: true })

  onMounted(async () => await loadData())

  watch(
    consult_profitability_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = consult_profitability_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(selectedDate, async (newDate) => {
    if (!newDate) return

    await loadDataList()
  })

  return {
    tabs,
    formData,
    tabActive,
    showState,
    formatDate,
    tableProps,
    headerProps,
    tabActiveIdx,
    selectedDate,
    isTableEmpty,
    handleGoToList,
    handleExportExcel,
  }
}

export default useConsultPercentagesView
