// core
import { computed, onBeforeUnmount, onMounted, Ref, ref } from 'vue'
import type { QTable } from 'quasar'

// stores
import { useAccoutingReportStore, useResourceManagerStore } from '@/stores'

// interfaces y constantes
import type { ITabs } from '@/interfaces/global'
import type {
  IOpeningRecord,
  IOpeningRecordResponse,
  OpeningRecordFormExpose,
  OpeningLegacyRow,
  ReportTypes,
  ApiRow,
} from '@/interfaces/customs'

// utils y composables
import { defaultIconsLucide } from '@/utils'
import { useUtils } from '@/composables'

const { _getResources, _resetKeys } = useResourceManagerStore('v1')

type LegacyStatusData = {
  increment_resources?: ApiRow[]
  decrease_resources?: ApiRow[]
  results?: ApiRow[]
  patrimony?: { period?: number | string; comparative?: number | string }
  final_balance?: { period?: number | string; comparative?: number | string }
}

const useLegacyReportCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const legacyStatus = useAccoutingReportStore(
    'v1',
    'legacyStatus'
  ) as ReportTypes['legacyStatus']
  const isFormValid = ref(false)
  const utils = useUtils()

  const headerOpeningRecord = {
    title: 'Reporte estado de cambios en el patrimonio',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes Contables', route: 'AccoutingReportList' },
      { label: 'Generar' },
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
      field: (row: OpeningLegacyRow) => row.code,
      sortable: true,
      style: 'width: 150px',
      align: 'center',
      headerStyle: 'text-align: center;',
    },
    {
      name: 'name',
      label: 'Nombre de la cuenta',
      field: (row: OpeningLegacyRow) => row.name,
      sortable: true,
      style: 'width: 150px',
      align: 'center',
      headerStyle: 'text-align: center;',
    },
    {
      name: 'period',
      label: 'Periodo',
      field: (row: OpeningLegacyRow) => row.period,
      sortable: true,
      style: 'width: 150px',
      align: 'center',
      headerStyle: 'text-align: center;',
      format: (val: number) =>
        utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
    },
    {
      name: 'comparative',
      label: 'Comparativo',
      field: (row: OpeningLegacyRow) => row.comparative,
      sortable: true,
      style: 'width: 150px',
      align: 'center',
      format: (val: number) =>
        utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
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

  const sectionTables = computed(() => {
    const payloadUnknown = legacyStatus.legacy_status_list as unknown
    const data: LegacyStatusData =
      ((payloadUnknown as { data?: LegacyStatusData })?.data ??
        (payloadUnknown as LegacyStatusData)) ||
      {}

    const inc: ApiRow[] = data.increment_resources ?? []
    const dec: ApiRow[] = data.decrease_resources ?? []
    const res: ApiRow[] = data.results ?? []

    const makeSection = (title: string, arr: ApiRow[]) => {
      const rows: OpeningLegacyRow[] = arr.map((r) => ({
        id: r.code,
        code: r.code,
        name: r.name,
        period: toNum(r.period),
        comparative: toNum(r.comparative),
      }))

      const totals = rows.reduce(
        (acc, r) => {
          acc.current_period += r.period || 0
          acc.previous_period += r.comparative || 0
          return acc
        },
        { current_period: 0, previous_period: 0 }
      )
      const totalsFull = {
        ...totals,
        variation: totals.current_period - totals.previous_period,
      }

      return {
        title,
        columns: commonColumns,
        rows,
        totals: totalsFull,
      }
    }

    return [
      makeSection('Incremento de recursos', inc),
      makeSection('Disminución de recursos', dec),
      makeSection('Resultados', res),
    ]
  })

  const headerBalances = computed(() => {
    const payloadUnknown = legacyStatus.legacy_status_list as unknown
    const d: LegacyStatusData =
      ((payloadUnknown as { data?: LegacyStatusData })?.data ??
        (payloadUnknown as LegacyStatusData)) ||
      {}

    return {
      initial: {
        period: toNum(d.patrimony?.period),
        comparative: toNum(d.patrimony?.comparative),
      },
      final: {
        period: toNum(d.final_balance?.period),
        comparative: toNum(d.final_balance?.comparative),
      },
    }
  })

  const rows = computed<OpeningLegacyRow[]>(() =>
    sectionTables.value.flatMap((s) => s.rows)
  )

  const downloadExcel = () => {
    legacyStatus.downloadPeriodicBalanceExcel()
  }

  const downloadPdf = () => {
    legacyStatus.downloadPeriodicBalancePdf()
  }

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
    headerBalances,
    formatMoney,
    showPreviewTab,
    downloadExcel,
    downloadPdf,
  }
}

export default useLegacyReportCreate
