import { Ref, ref, watch } from 'vue'
import { defaultIconsLucide } from '@/utils'
import type { ITabs } from '@/interfaces/global'
import type {
  IOpeningRecord,
  IOpeningRecordResponse,
  OpeningRecordFormExpose,
} from '@/interfaces/customs'
import { useAccoutingReportV1 } from '@/stores/accounting/accounting-report/accouting-report-v1'
import { QTable } from 'quasar'
import { useUtils } from '@/composables'
const usePeriodStatementCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const { period } = useAccoutingReportV1()
  const isFormValid = ref(false)
  const utils = useUtils()

  const headerOpeningRecord = {
    title: 'Reporte de estado financiero por periodo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes Contables', route: 'AccoutingReportList' },
      { label: 'Reporte de estado financiero por periodo' },
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
        name: 'row',
        label: '#',
        field: (r) => r.__index ?? r.index ?? '',
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
        align: 'center',
        style: 'width: 120px',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'account_name',
        label: 'Nombre de la cuenta',
        field: 'account_name',
        sortable: true,
        align: 'center',
        style: 'min-width: 220px',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'third_party_id',
        label: 'Auxiliar',
        field: 'third_party_id',
        sortable: true,
        align: 'center',
        style: 'width: 140px',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'third_party_name',
        label: 'Nombre del auxiliar',
        field: 'third_party_name',
        sortable: true,
        align: 'center',
        style: 'min-width: 220px',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'cost_center_code',
        label: 'Centro de costo',
        field: 'cost_center_code',
        sortable: true,
        align: 'center',
        style: 'width: 140px',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'cost_center_name',
        label: 'Nombre del centro de costo',
        field: 'cost_center_name',
        sortable: true,
        align: 'center',
        style: 'min-width: 220px',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'initial_balance',
        label: 'Saldo inicial',
        field: 'initial_balance',
        sortable: true,
        align: 'center',
        style: 'width: 160px',
        headerStyle: 'text-align: center;',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'debit',
        label: 'Débito',
        field: 'debit',
        sortable: true,
        align: 'center',
        style: 'width: 160px',
        headerStyle: 'text-align: center;',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'credit',
        label: 'Crédito',
        field: 'credit',
        sortable: true,
        align: 'center',
        style: 'width: 160px',
        headerStyle: 'text-align: center;',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'total',
        label: 'Saldo final',
        field: 'total',
        sortable: true,
        align: 'center',
        style: 'width: 160px',
        headerStyle: 'text-align: center;',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
    ],
    rows: [],
    pages: period.period_financial_pages,
  })

  watch(
    () => period.period_financial_list,
    () => {
      const src = period.period_financial_list
      tableProps.value.rows = src
    }
  )

  const updatePerPage = async (perPage: number) => {
    previewFilters.rows = perPage
    previewFilters.page = 1

    tableProps.value.loading = true
    await period._getPeriodStatementBalance(previewFilters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    previewFilters.page = page

    tableProps.value.loading = true
    await period._getPeriodStatementBalance(previewFilters)
    tableProps.value.loading = false
  }

  const downloadExcel = () => {
    period.downloadPeriodicBalanceExcel()
  }

  const downloadPdf = () => {
    period.downloadPeriodicBalancePdf()
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

export default usePeriodStatementCreate
