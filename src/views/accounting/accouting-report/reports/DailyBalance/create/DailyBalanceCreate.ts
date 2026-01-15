import { watch, Ref, ref } from 'vue'
import { defaultIconsLucide } from '@/utils'
import type { ITabs } from '@/interfaces/global'
import type {
  IOpeningRecord,
  IOpeningRecordResponse,
  OpeningRecordFormExpose,
  ReportTypes,
} from '@/interfaces/customs'
import { QTable } from 'quasar'
import { useUtils } from '@/composables'
import { useAccoutingReportStore } from '@/stores'

const useDailyBalanceCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const dailyBalance = useAccoutingReportStore(
    'v1',
    'dailyBalance'
  ) as ReportTypes['dailyBalance']
  const isFormValid = ref(false)
  const utils = useUtils()

  const headerOpeningRecord = {
    title: 'Balance diario',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes Contables', route: 'AccoutingReportList' },
      { label: 'Balance diario' },
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

  const showPreviewTab = (filters: Record<string, unknown>) => {
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
        field: (r: IOpeningRecord & { __index?: number; index?: number }) =>
          r.__index ?? r.index ?? '',
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
        align: 'left',
        style: 'min-width: 220px',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'third_party_id',
        label: 'Auxiliar',
        field: (
          r: IOpeningRecord & { auxiliary?: { code?: string | null } | null }
        ) => r?.auxiliary?.code ?? ' -',
        sortable: true,
        align: 'center',
        style: 'width: 140px',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'center_cost',
        label: 'Centro de costo',
        field: (r: IOpeningRecord & { center_cost?: string | null }) =>
          r?.center_cost ?? ' - ',
        sortable: true,
        align: 'center',
        style: 'width: 140px',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'initial_balance',
        label: 'Saldo inicial',
        field: (r: IOpeningRecord & { initial_balance: string | number }) =>
          r?.initial_balance ?? 0,
        sortable: true,
        align: 'right',
        style: 'width: 160px',
        headerStyle: 'text-align: right;',
        format: (val: string | number) =>
          utils.formatCurrencyString(val ? val : 0, {
            currency: 'COP',
            locale: 'es-CO',
          }),
      },
      {
        name: 'debit',
        label: 'Débito',
        field: 'debit',
        sortable: true,
        align: 'right',
        style: 'width: 160px',
        headerStyle: 'text-align: right;',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'credit',
        label: 'Crédito',
        field: 'credit',
        sortable: true,
        align: 'right',
        style: 'width: 160px',
        headerStyle: 'text-align: right;',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'final_balance',
        label: 'Saldo final',
        field: 'final_balance',
        sortable: true,
        align: 'right',
        style: 'width: 160px',
        headerStyle: 'text-align: right;',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
    ],
    rows: [],
    pages: dailyBalance.daily_balance_pages,
  })

  watch(
    () => dailyBalance.daily_balance_list,
    (src) => {
      tableProps.value.rows = src.map(
        (
          r: IOpeningRecord & {
            initial_balance?: number | string
            debit?: number | string
            credit?: number | string
            final_balance?: number | string
          }
        ) => ({
          ...r,
          initial_balance: Number(
            String(r.initial_balance ?? '0').replace(/,/g, '')
          ),
          debit: Number(String(r.debit ?? '0').replace(/,/g, '')),
          credit: Number(String(r.credit ?? '0').replace(/,/g, '')),
          final_balance: Number(
            String(r.final_balance ?? '0').replace(/,/g, '')
          ),
        })
      )
    }
  )

  const updatePerPage = async (perPage: number) => {
    previewFilters.rows = perPage
    previewFilters.page = 1

    tableProps.value.loading = true
    await dailyBalance._getDailyBalance(previewFilters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    previewFilters.page = page

    tableProps.value.loading = true
    await dailyBalance._getDailyBalance(previewFilters)
    tableProps.value.loading = false
  }

  const downloadExcel = () => {
    dailyBalance.downloadPeriodicBalanceExcel()
  }

  const downloadPdf = () => {
    dailyBalance.downloadPeriodicBalancePdf()
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

export default useDailyBalanceCreate
