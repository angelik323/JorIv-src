import { computed, onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue'
import { defaultIconsLucide } from '@/utils'
import { QTable } from 'quasar'
import type { ITabs } from '@/interfaces/global'
import type {
  IOpeningRecordResponse,
  IOtherCurrenciesTableRow,
  OpeningRecordFormExpose,
  ReportTypes,
} from '@/interfaces/customs'
import {
  useAccoutingReportStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
const useBGPOtherCurrenciesCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const otherOcurrencies = useAccoutingReportStore(
    'v1',
    'otherOcurrencies'
  ) as ReportTypes['otherOcurrencies']
  const resourceManagerStore = useResourceManagerStore('v1')
  const { _getResources, _resetKeys } = resourceManagerStore
  const { accounting_coins: coins } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const isFormValid = ref(false)

  const headerOpeningRecord = {
    title: 'Balance general otras monedas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes' },
      { label: 'Reportes Contables', route: 'AccoutingReportList' },
      { label: 'Balance general de pruebas otras monedas' },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'preview',
      label: 'Vista previa',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: false,
      required: false,
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: NonNullable<QTable['columns']>
    rows: IOtherCurrenciesTableRow[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Balance de otras monedas',
    loading: false,
    columns: [
      {
        name: 'account_code',
        label: 'Cuenta',
        field: 'account_code',
        align: 'center' as const,
      },
      {
        name: 'auxiliary_name',
        label: 'Auxiliar',
        field: 'auxiliary_name',
        align: 'center' as const,
      },
      {
        name: 'account_name',
        label: 'Nombre de la cuenta',
        field: 'account_name',
        align: 'center' as const,
      },
      {
        name: 'initial_balance',
        label: 'Saldo inicial',
        field: 'initial_balance',
        align: 'right' as const,
      },
      {
        name: 'debit',
        label: 'Débitos',
        field: 'debit',
        align: 'right' as const,
      },
      {
        name: 'credit',
        label: 'Créditos',
        field: 'credit',
        align: 'right' as const,
      },
      {
        name: 'final_balance',
        label: 'Saldo final',
        field: 'final_balance',
        align: 'right' as const,
      },
    ],
    rows: [],
    pages: otherOcurrencies.other_ocurrencies_pages,
  })

  const activeTab = ref<string>(tabs.value[0].name)
  const activeTabIdx = ref<number>(0)
  const viewerFileComponentRef = ref()

  const tableTotals = computed(() => {
    const rows = tableProps.value.rows

    return {
      initial_balance: rows.reduce((sum, r) => sum + r.initial_balance, 0),
      debit: rows.reduce((sum, r) => sum + r.debit, 0),
      credit: rows.reduce((sum, r) => sum + r.credit, 0),
      total: rows.reduce((sum, r) => sum + r.final_balance, 0),
    }
  })

  let previewFilters = {
    rows: 20,
    page: 1,
  }

  const showPreviewTab = (filters: Record<string, string | number>) => {
    const previewTab = tabs.value.find((t) => t.name === 'preview')
    if (previewTab) {
      previewTab.show = true
      activeTab.value = 'preview'
    }

    previewFilters = { ...previewFilters, ...filters }
  }

  watch(
    () => otherOcurrencies.other_ocurrencies_list,
    () => {
      const src = otherOcurrencies.other_ocurrencies_list.map((item) => ({
        account_code: item.account,
        auxiliary_name: item.auxiliary,
        account_name: item.name,
        initial_balance: item.initial_balance,
        debit: item.debit,
        credit: item.credit,
        final_balance: item.final_balance,
      }))
      tableProps.value.rows = src
    }
  )

  const updatePerPage = async (perPage: number) => {
    previewFilters.rows = perPage
    previewFilters.page = 1

    tableProps.value.loading = true
    await otherOcurrencies._getTrialBalanceOtherCurrencies(previewFilters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    previewFilters.page = page

    tableProps.value.loading = true
    await otherOcurrencies._getTrialBalanceOtherCurrencies(previewFilters)
    tableProps.value.loading = false
  }

  const downloadPdf = () => {
    otherOcurrencies.downloadBSOtherOcurrenciesPdf()
  }

  const downloadExcel = () => {
    otherOcurrencies.downloadBSOtherOcurrenciesExcel()
  }

  const pdfUrl = computed(() => otherOcurrencies.report_pdf_url)

  onMounted(async () => {
    await Promise.all([
      _getResources(
        {
          accounting: ['business_trust', 'third_parties'],
          investment_portfolio: ['coins'],
        },
        '',
        'v1'
      ),
      _getResources({ accounting: ['template'] }, '', 'v2'),
    ])
  })

  onBeforeUnmount(() => {
    _resetKeys({
      accounting: ['business_trust', 'third_parties', 'template'],
      investment_portfolio: ['coins'],
    })
    coins.value = []
  })

  return {
    headerOpeningRecord,
    tabs,
    activeTab,
    activeTabIdx,
    openingReportForm,
    processData,
    isFormValid,
    tableProps,
    viewerFileComponentRef,
    tableTotals,
    showPreviewTab,
    downloadExcel,
    downloadPdf,
    pdfUrl,
    updatePage,
    updatePerPage,
  }
}

export default useBGPOtherCurrenciesCreate
