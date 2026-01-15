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
  OpeningGeneralRow,
  ReportTypes,
  AccountBlockGeneral,
} from '@/interfaces/customs'

// utils y composables
import { defaultIconsLucide } from '@/utils'
import { useUtils } from '@/composables'

const { _getResources, _resetKeys } = useResourceManagerStore('v1')

const useGeneralLedgerReportCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const generalLedger = useAccoutingReportStore(
    'v1',
    'generalLedger'
  ) as ReportTypes['generalLedger']
  const isFormValid = ref(false)
  const utils = useUtils()

  const headerOpeningRecord = {
    title: 'Libro mayor y balance por cuentas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes Contables', route: 'AccoutingReportList' },
      { label: 'Libro mayor y balance por cuentas' },
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
      field: (r: OpeningGeneralRow) => r.code,
      sortable: true,
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

  const fmtDate = (val: string) => {
    if (!val) return ''
    const [y, m, d] = String(val).split('-')
    return `${d?.padStart(2, '0')}/${m?.padStart(2, '0')}/${y}`
  }

  const toNum = (v: unknown) =>
    typeof v === 'number' ? v : Number(String(v).replace(/[^\d.-]/g, '')) || 0

  const columnsPerAccount: QTable['columns'] = [
    {
      name: 'index',
      label: '#',
      field: (r: any) => r.index,
      align: 'center',
      style: 'width: 70px',
      headerStyle: 'text-align:center;',
    },
    {
      name: 'date',
      label: 'Fecha',
      field: (r: any) => r.date,
      align: 'center',
      style: 'width: 130px',
      headerStyle: 'text-align:center;',
      format: (v: string) => fmtDate(v),
      sortable: true,
    },
    {
      name: 'receipt_type_code',
      label: 'Comprobante',
      field: (r: any) => r.receipt_type_code,
      align: 'center',
      style: 'width: 120px',
      headerStyle: 'text-align:center;',
      sortable: true,
    },
    {
      name: 'sub_receipt_type_code',
      label: 'Subtipo de comprobante',
      field: (r: any) => r.sub_receipt_type_code,
      align: 'center',
      headerStyle: 'text-align:center;',
      sortable: true,
    },
    {
      name: 'consecutive',
      label: 'Consecutivo',
      field: (r: any) => r.consecutive,
      align: 'center',
      headerStyle: 'text-align:center;',
      sortable: true,
    },
    {
      name: 'detail',
      label: 'Detalle',
      field: (r: any) => r.detail,
      align: 'left',
      headerStyle: 'text-align:center;',
      sortable: false,
    },
    {
      name: 'debit',
      label: 'Débito',
      field: (r: any) => r.debit,
      align: 'right',
      headerStyle: 'text-align:right;',
      sortable: true,
      format: (v: string | number) =>
        utils.formatCurrencyString(v, { currency: 'COP', locale: 'es-CO' }),
    },
    {
      name: 'credit',
      label: 'Crédito',
      field: (r: any) => r.credit,
      align: 'right',
      headerStyle: 'text-align:right;',
      sortable: true,
      format: (v: string | number) =>
        utils.formatCurrencyString(v, { currency: 'COP', locale: 'es-CO' }),
    },
  ]

  const sectionTables = computed(() => {
    const payload: unknown = (generalLedger as any).general_ledger_list

    let list: AccountBlockGeneral[] = []
    if (Array.isArray(payload)) {
      list = Array.isArray(payload[0])
        ? (payload[0] as AccountBlockGeneral[])
        : (payload as AccountBlockGeneral[])
    } else if (payload && Array.isArray((payload as any).data)) {
      const inner = (payload as any).data
      list = Array.isArray(inner[0])
        ? (inner[0] as AccountBlockGeneral[])
        : (inner as AccountBlockGeneral[])
    }

    return list.map((block, blockIdx) => {
      const rows = (block.movements || []).map((m, i) => ({
        id: `${blockIdx}-${i}`,
        index: i + 1,
        date: m.date,
        receipt_type_code: m.receipt_type_code,
        sub_receipt_type_code: m.sub_receipt_type_code,
        consecutive: m.consecutive,
        detail: m.register_detail,
        debit: m.debit,
        credit: m.credit,
        foreign_currency: m.foreign_currency,
        account_name: m.account_name,
        account_code: (m as any).account_code, // por si viene a nivel movimiento
      }))

      // título: intenta tomar code/name del bloque o del primer movimiento
      const first = rows[0]
      const accountCode = block.account_code || first?.account_code || '' // si tu API no lo envía, quedará vacío
      const accountName = block.account_name || first?.account_name || 'Cuenta'

      const totals = rows.reduce(
        (acc, r) => {
          acc.debit += toNum(r.debit)
          acc.credit += toNum(r.credit)
          return acc
        },
        { debit: 0, credit: 0 }
      )

      return {
        title: accountCode ? `${accountCode} - ${accountName}` : accountName,
        header: {
          initial_balance: toNum(block.initial_balance),
          initial_foreign_currency: toNum(block.initial_foreign_currency),
          final_balance: toNum(block.final_balance),
          final_foreign_currency: toNum(block.final_foreign_currency),
        },
        columns: columnsPerAccount,
        rows,
        totals,
      }
    })
  })

  const downloadExcel = () => {
    generalLedger.downloadPeriodicBalanceExcel()
  }

  const downloadPdf = () => {
    generalLedger.downloadPeriodicBalancePdf()
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
    tableProps,
    sectionTables,
    formatMoney,
    showPreviewTab,
    downloadExcel,
    downloadPdf,
  }
}

export default useGeneralLedgerReportCreate
