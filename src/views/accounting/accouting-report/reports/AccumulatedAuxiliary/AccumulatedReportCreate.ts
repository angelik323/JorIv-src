// core
import { computed, onBeforeUnmount, onMounted, Ref, ref } from 'vue'
import type { QTable } from 'quasar'

// stores
import { useAccoutingReportStore, useResourceManagerStore } from '@/stores'

// interfaces y constantes
import type { ITabs } from '@/interfaces/global'
import type {
  AccountSection,
  AccumulatedAccount,
  IOpeningRecordResponse,
  MovementRow,
  OpeningRecordFormExpose,
  ReportTypes,
} from '@/interfaces/customs'

// utils y composables
import { defaultIconsLucide } from '@/utils'
import { useUtils } from '@/composables'

const { _getResources, _resetKeys } = useResourceManagerStore('v1')

// Extiende la sección para incluir los totales que usa el template
type AccountSectionWithTotals = AccountSection & {
  totals: { debit: number; credit: number }
}

const useAccumulatedReportCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const utils = useUtils()

  const processData = ref<IOpeningRecordResponse['data'] | null>(null)

  const accumulatedAuxiliary = useAccoutingReportStore(
    'v1',
    'accumulatedAuxiliary'
  ) as ReportTypes['accumulatedAuxiliary']

  const isFormValid = ref(false)

  const headerOpeningRecord = {
    title: 'Reporte auxiliar acumulado por cuenta',
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

  const tableProps = ref<{ loading: boolean }>({ loading: false })

  const detailColumns: QTable['columns'] = [
    {
      name: '#',
      label: '#',
      field: () => '',
      align: 'center',
      sortable: false,
      headerStyle: 'text-align:center;',
      style: 'width:60px',
    },
    {
      name: 'date',
      label: 'Fecha',
      field: (r: MovementRow) => r.registration_date,
      align: 'center',
      sortable: true,
      headerStyle: 'text-align:center;',
      style: 'width:140px',
    },
    {
      name: 'receipt_type',
      label: 'Comprobante',
      field: (r: MovementRow) => r.receipt_type,
      align: 'center',
      sortable: true,
      style: 'width:120px',
    },
    {
      name: 'sub_receipt_type',
      label: 'Subtipo de comprobante',
      field: (r: MovementRow) => r.sub_receipt_type,
      align: 'center',
      sortable: true,
      style: 'width:160px',
    },
    {
      name: 'consecutive',
      label: 'Consecutivo',
      field: (r: MovementRow) => r.consecutive,
      align: 'center',
      sortable: true,
      style: 'width:120px',
    },
    {
      name: 'detail',
      label: 'Detalle',
      field: (r: MovementRow) => r.detail,
      align: 'left',
      sortable: true,
      style: 'width:160px',
    },
    {
      name: 'debit',
      label: 'Débito',
      field: (r: MovementRow) => r.debit,
      align: 'right',
      sortable: true,
      format: (v: number) =>
        utils.formatCurrencyString(v, { currency: 'COP', locale: 'es-CO' }),
      style: 'width:140px',
    },
    {
      name: 'credit',
      label: 'Crédito',
      field: (r: MovementRow) => r.credit,
      align: 'right',
      sortable: true,
      format: (v: number) =>
        utils.formatCurrencyString(v, { currency: 'COP', locale: 'es-CO' }),
      style: 'width:140px',
    },
  ]

  const toNum = (v: unknown) => {
    if (typeof v === 'number') return v
    if (typeof v === 'string') return Number(v.replace(/,/g, '')) || 0
    return 0
  }

  const sectionTables = computed<AccountSectionWithTotals[]>(() => {
    const raw = accumulatedAuxiliary.accumulated_auxiliary_list as unknown

    const paginated = (raw as { data?: unknown; current_page?: number })
      ?.data as AccumulatedAccount[] | undefined

    const accounts: AccumulatedAccount[] = Array.isArray(paginated)
      ? paginated
      : (raw as AccumulatedAccount[]) ?? []

    return accounts.map((a) => {
      const rows: MovementRow[] = (a.movements ?? []).map((m, i) => ({
        id: `${a.account_code}-${m.receipt_type}-${m.consecutive}-${i}`,
        registration_date: m.registration_date,
        receipt_type: m.receipt_type,
        sub_receipt_type: m.sub_receipt_type,
        consecutive: m.consecutive,
        detail: m.detail,
        debit: toNum(m.debit),
        credit: toNum(m.credit),
        foreign_currency_movement: toNum(m.foreign_currency_movement),
      }))

      // Totales por cuenta (para el bottom-row)
      const totals = rows.reduce(
        (acc, r) => {
          acc.debit += r.debit || 0
          acc.credit += r.credit || 0
          return acc
        },
        { debit: 0, credit: 0 }
      )

      return {
        title: `Cuenta ${a.account_code} - ${a.account_name}`,
        header: {
          initial_balance: toNum(a.initial_balance),
          final_balance: toNum(a.final_balance),
          initial_foreign_balance: toNum(a.initial_foreign_balance),
          final_foreign_balance: toNum(a.final_foreign_balance),
          debit: toNum(a.debit),
          credit: toNum(a.credit),
        },
        columns: detailColumns,
        rows,
        totals,
      }
    })
  })

  const rows = computed<MovementRow[]>(() =>
    sectionTables.value.flatMap((s) => s.rows)
  )

  const downloadExcel = () => {
    accumulatedAuxiliary.downloadPeriodicBalanceExcel()
  }
  const downloadPdf = () => {
    accumulatedAuxiliary.downloadPeriodicBalancePdf()
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
    tableProps, // <-- ahora existe para el template
    sectionTables, // <-- ahora cada sección trae totals
    rows,
    downloadExcel,
    downloadPdf,
    formatMoney,
    showPreviewTab,
  }
}

export default useAccumulatedReportCreate
