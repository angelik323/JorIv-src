// core
import { watch, Ref, ref } from 'vue'
import { QTable } from 'quasar'

// stores
import { useAccoutingReportStore } from '@/stores'

// interfaces y constantes
import type { ITabs } from '@/interfaces/global'
import type {
  IOpeningRecord,
  IOpeningRecordResponse,
  OpeningRecordFormExpose,
  ReportTypes,
} from '@/interfaces/customs'

// utils y composables
import { defaultIconsLucide } from '@/utils'
import { useUtils } from '@/composables'

const useConsolidatedBalanceCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const consolidatedBalance = useAccoutingReportStore(
    'v1',
    'consolidatedBalance'
  ) as ReportTypes['consolidatedBalance']
  const isFormValid = ref(false)
  const utils = useUtils()

  const headerOpeningRecord = {
    title: 'Reporte balance consolidado',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes Contables', route: 'AccoutingReportList' },
      { label: 'Reporte balance consolidado' },
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
      label: 'Informe general',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: false,
      required: false,
    },
  ])

  const activeTab = ref<string>(tabs.value[0].name)
  const activeTabIdx = ref<number>(0)
  const viewerFileComponentRef = ref()
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

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IOpeningRecord[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: '',
    loading: false,
    columns: [
      {
        name: 'code',
        label: 'Cuenta',
        field: 'code',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'business_code',
        label: 'Consolidado',
        field: 'business_code',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'account_name',
        label: 'Nombre',
        field: 'account_name',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'initial_balance',
        label: 'Saldo inicial',
        field: 'initial_balance',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'debits',
        label: 'Débitos',
        field: 'debits',
        sortable: false,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'credits',
        label: 'Créditos',
        field: 'credits',
        sortable: false,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'final_balance',
        label: 'Saldo final',
        field: 'final_balance',
        sortable: false,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
    ],
    rows: [],
    pages: consolidatedBalance.consolidated_balance_pages,
  })

  watch(
    () => consolidatedBalance.consolidated_balance_list,
    () => {
      const src = consolidatedBalance.consolidated_balance_list
      tableProps.value.rows = src
    }
  )

  const updatePerPage = async (perPage: number) => {
    previewFilters.rows = perPage
    previewFilters.page = 1

    tableProps.value.loading = true
    await consolidatedBalance._getConsolidatedBalanceBalance(previewFilters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    previewFilters.page = page

    tableProps.value.loading = true
    await consolidatedBalance._getConsolidatedBalanceBalance(previewFilters)
    tableProps.value.loading = false
  }

  const downloadExcel = () => {
    consolidatedBalance.downloadPeriodicBalanceExcel()
  }

  const downloadPdf = () => {
    consolidatedBalance.downloadPeriodicBalancePdf()
  }

  return {
    headerOpeningRecord,
    tabs,
    activeTab,
    activeTabIdx,
    openingReportForm,
    processData,
    isFormValid,
    viewerFileComponentRef,
    tableProps,
    showPreviewTab,
    downloadExcel,
    downloadPdf,
    updatePerPage,
    updatePage,
  }
}

export default useConsolidatedBalanceCreate
