// core
import { Ref, ref, watch } from 'vue'
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

const useQuarterlyBalanceCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const quarterlyBalance = useAccoutingReportStore(
    'v1',
    'quarterlyBalance'
  ) as ReportTypes['quarterlyBalance']
  const isFormValid = ref(false)
  const utils = useUtils()

  const headerOpeningRecord = {
    title: 'Balance general trimestral',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes Contables', route: 'AccoutingReportList' },
      { label: 'Balance general trimestral' },
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
        name: 'index',
        label: '#',
        field: (r: IOpeningRecord) => r.index ?? '',
        sortable: false,
        align: 'center',
        style: 'width: 70px',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'account_code',
        label: 'Cuenta',
        field: 'account_code',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'account_name',
        label: 'Nombre de la cuenta',
        field: 'account_name',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'current_period_balance',
        label: 'Saldo periodo',
        field: 'current_period_balance',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'comparative_period_balance',
        label: 'Saldo comparativo',
        field: 'comparative_period_balance',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'periodic_variation',
        label: 'Variación periódico',
        field: 'periodic_variation',
        sortable: false,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
    ],
    rows: [],
    pages: quarterlyBalance.quarterly_balance_pages,
  })

  watch(
    () => quarterlyBalance.quarterly_balance_list,
    () => {
      const src = quarterlyBalance.quarterly_balance_list.map((row, idx) => ({
        ...row,
        index: idx + 1,
      })) as IOpeningRecord[]
      tableProps.value.rows = src
    }
  )

  const updatePerPage = async (perPage: number) => {
    previewFilters.rows = perPage
    previewFilters.page = 1

    tableProps.value.loading = true
    await quarterlyBalance._getQuarterlyStatementBalance(previewFilters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    previewFilters.page = page

    tableProps.value.loading = true
    await quarterlyBalance._getQuarterlyStatementBalance(previewFilters)
    tableProps.value.loading = false
  }

  const downloadExcel = () => {
    quarterlyBalance.downloadPeriodicBalanceExcel()
  }

  const downloadPdf = () => {
    quarterlyBalance.downloadPeriodicBalancePdf()
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

export default useQuarterlyBalanceCreate
