// core
import { computed, onBeforeUnmount, onMounted, Ref, ref } from 'vue'
import type { QTable } from 'quasar'

// stores
import { useAccoutingReportStore, useResourceManagerStore } from '@/stores'

// interfaces y constantes
import type {
  IOpeningRecord,
  IOpeningRecordResponse,
  OpeningRecordFormExpose,
  OpeningGeneralRow,
  ReportTypes,
  ApiRowInOut,
} from '@/interfaces/customs'

// utils
import { defaultIconsLucide } from '@/utils'
import { useUtils } from '@/composables'

const { _getResources, _resetKeys } = useResourceManagerStore('v1')

type TotalsShape = {
  saldo_periodo?: unknown
  saldo_comparativo?: unknown
  variacion?: unknown
}
type GeneralResultsData = {
  ingresos?: ApiRowInOut[]
  gastos?: ApiRowInOut[]
  totales?: { ingresos?: TotalsShape; gastos?: TotalsShape }
}

const useGeneralReportCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const generalResults = useAccoutingReportStore(
    'v1',
    'generalResults'
  ) as ReportTypes['generalResults']
  const isFormValid = ref(false)
  const utils = useUtils()

  const headerOpeningRecord = {
    title: 'Estado de resultados generales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes Contables', route: 'AccoutingReportList' },
      { label: 'Generar' },
    ],
    showBackBtn: true,
  }

  const tabs = ref([
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
  const viewerFileComponentRef = ref<unknown>(null)

  const showPreviewTab = () => {
    const previewTab = tabs.value.find((t) => t.name === 'preview')
    if (previewTab) {
      previewTab.show = true
      activeTab.value = 'preview'
    }
  }

  const commonColumns: QTable['columns'] = [
    {
      name: 'code',
      label: 'Cuenta',
      field: (r: OpeningGeneralRow) => r.code,
      sortable: true,
      style: 'width:150px',
      align: 'center',
      headerStyle: 'text-align:center;',
    },
    {
      name: 'name',
      label: 'Nombre',
      field: (r: OpeningGeneralRow) => r.name,
      sortable: true,
      style: 'width:150px',
      align: 'center',
      headerStyle: 'text-align:center;',
    },
    {
      name: 'period',
      label: 'Saldo periodo',
      field: (r: OpeningGeneralRow) => r.period,
      sortable: true,
      style: 'width:150px',
      align: 'center',
      headerStyle: 'text-align:center;',
      format: (v: number) =>
        utils.formatCurrencyString(v, { currency: 'COP', locale: 'es-CO' }),
    },
    {
      name: 'comparative',
      label: 'Comparativo',
      field: (r: OpeningGeneralRow) => r.comparative,
      sortable: true,
      style: 'width:150px',
      align: 'center',
      format: (v: number) =>
        utils.formatCurrencyString(v, { currency: 'COP', locale: 'es-CO' }),
    },
    {
      name: 'variation',
      label: 'Variación',
      field: (r: OpeningGeneralRow) => r.variation,
      sortable: true,
      style: 'width:150px',
      align: 'center',
      format: (v: number) =>
        utils.formatCurrencyString(v, { currency: 'COP', locale: 'es-CO' }),
    },
  ]

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IOpeningRecord[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: '',
    loading: false,
    columns: commonColumns,
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const toNum = (v: unknown) => {
    if (typeof v === 'number') return v
    if (typeof v === 'string') return Number(v.replace(/,/g, '')) || 0
    return 0
  }
  const apiBody = ref<GeneralResultsData | null>(null)
  const dataSource = computed<GeneralResultsData>(() => {
    const fromStore = generalResults.general_results_list as unknown
    const src = (apiBody.value ?? fromStore) as any
    if (
      src &&
      typeof src === 'object' &&
      'data' in src &&
      !Array.isArray(src.data)
    ) {
      return (src.data as GeneralResultsData) ?? {}
    }
    return (src as GeneralResultsData) ?? {}
  })

  const sectionTables = computed(() => {
    const data = dataSource.value || {}

    const ingresos: ApiRowInOut[] = data.ingresos ?? []
    const gastos: ApiRowInOut[] = data.gastos ?? []
    const totales = data.totales ?? {}

    const makeSection = (
      title: string,
      arr: ApiRowInOut[],
      totalsApi?: TotalsShape
    ) => {
      const rows: OpeningGeneralRow[] = (arr || []).map((r) => {
        const period = toNum((r as any).saldo_periodo ?? (r as any).period)
        const comparative = toNum(
          (r as any).saldo_comparativo ?? (r as any).comparative
        )
        const variation = toNum(
          (r as any).variacion ?? (r as any).variation ?? period - comparative
        )
        return {
          id: r.code,
          code: r.code,
          name: r.name,
          period,
          comparative,
          variation,
        }
      })

      const totals = {
        current_period: toNum(totalsApi?.saldo_periodo),
        previous_period: toNum(totalsApi?.saldo_comparativo),
        variation: toNum(totalsApi?.variacion),
      }

      return { title, columns: commonColumns, rows, totals }
    }

    return [
      makeSection('Ingresos', ingresos, totales.ingresos),
      makeSection('Gastos', gastos, totales.gastos),
    ]
  })

  const rows = computed<OpeningGeneralRow[]>(() =>
    sectionTables.value.flatMap((s) => s.rows)
  )

  const downloadExcel = () => generalResults.downloadPeriodicBalanceExcel()
  const downloadPdf = () => generalResults.downloadPeriodicBalancePdf()

  onMounted(() => {
    _getResources({
      accounting: ['business_trusts_basic', 'amount_types', 'templates'],
    })
  })

  onBeforeUnmount(() => {
    _resetKeys({
      accounting: ['business_trusts_basic', 'amount_types', 'templates'],
    })
  })

  const formatMoney = (n: number) =>
    utils.formatCurrencyString(n, { currency: 'COP', locale: 'es-CO' })

  return {
    headerOpeningRecord,
    tabs,
    activeTab,
    activeTabIdx,
    openingReportForm,
    processData,
    isFormValid,
    viewerFileComponentRef,
    rows,
    tableProps,
    sectionTables,
    formatMoney,
    showPreviewTab,
    downloadExcel,
    downloadPdf,
    apiBody,
  }
}

export default useGeneralReportCreate
