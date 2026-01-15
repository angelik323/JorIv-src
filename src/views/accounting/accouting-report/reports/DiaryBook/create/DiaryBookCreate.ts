// core
import { onMounted, Ref, ref, watch } from 'vue'
import { QTable } from 'quasar'

// stores
import { useAccoutingReportStore, useResourceManagerStore } from '@/stores'

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

const useDiaryBookCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const { _getResources } = useResourceManagerStore('v1')
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const diaryBook = useAccoutingReportStore(
    'v1',
    'diaryBook'
  ) as ReportTypes['diaryBook']
  const isFormValid = ref(false)
  const utils = useUtils()

  const headerOpeningRecord = {
    title: 'Reporte libro diario',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes Contables', route: 'AccoutingReportList' },
      { label: 'Reporte libro diario' },
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
    columns: NonNullable<QTable['columns']>
    rows: IOpeningRecord[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: '',
    loading: false,
    columns: [
      {
        name: 'date',
        label: 'Fecha',
        field: 'date',
        sortable: true,
        align: 'center',
        format: (val: string) => {
          if (!val) return ''
          const [y, m, d] = String(val).split('-')
          return `${d?.padStart(2, '0')}/${m?.padStart(2, '0')}/${y}`
        },
      },
      {
        name: 'receipt_type_code',
        label: 'Comprobante',
        field: 'receipt_type_code',
        sortable: true,
        align: 'center',
      },
      {
        name: 'sub_receipt_type_code',
        label: 'Subtipo de comprobante',
        field: 'sub_receipt_type_code',
        sortable: true,
        align: 'center',
      },
      {
        name: 'consecutive',
        label: 'Consecutivo',
        field: 'consecutive',
        sortable: true,
        align: 'center',
      },
      {
        name: 'account_code',
        label: 'Cuenta',
        field: 'account_code',
        sortable: true,
        align: 'center',
      },
      {
        name: 'account_name',
        label: 'Nombre de la cuenta',
        field: 'account_name',
        sortable: true,
        align: 'center',
      },
      {
        name: 'third_party_document',
        label: 'Auxiliar',
        field: 'third_party_document',
        sortable: true,
        align: 'center',
      },
      {
        name: 'credit',
        label: 'Crédito',
        field: 'credit',
        sortable: true,
        align: 'center',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'debit',
        label: 'Débito',
        field: 'debit',
        sortable: true,
        align: 'center',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'foreign_currency',
        label: 'Moneda extranjera',
        field: 'foreign_currency',
        sortable: true,
        align: 'center',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
    ],
    rows: [],
    pages: diaryBook.diary_book_pages,
  })

  const totalDebit = ref(0)
  const totalCredit = ref(0)

  watch(
    () => diaryBook.diary_book_list,
    () => {
      const src = diaryBook.diary_book_list
      tableProps.value.rows = src

      totalDebit.value = tableProps.value.rows.reduce(
        (acc: number, row: IOpeningRecord) => {
          return acc + toNum(row.debit)
        },
        0
      )
      totalCredit.value = tableProps.value.rows.reduce(
        (acc: number, row: IOpeningRecord) => {
          return acc + toNum(row.credit)
        },
        0
      )
    }
  )

  const updatePerPage = async (perPage: number) => {
    previewFilters.rows = perPage
    previewFilters.page = 1

    tableProps.value.loading = true
    await diaryBook._getDiaryBookBalance(previewFilters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    previewFilters.page = page

    tableProps.value.loading = true
    await diaryBook._getDiaryBookBalance(previewFilters)
    tableProps.value.loading = false
  }

  const downloadExcel = () => {
    diaryBook.downloadPeriodicBalanceExcel()
  }

  const downloadPdf = () => {
    diaryBook.downloadPeriodicBalancePdf()
  }

  onMounted(async () => {
    await Promise.all([
      _getResources({ accounting: ['business_trusts_basic'] }, '', 'v1'),
      _getResources({ accounting: ['template'] }, '', 'v2'),
    ])
  })

  const toNum = (v: unknown) =>
    typeof v === 'number' ? v : Number(String(v).replace(/[^\d.-]/g, '')) || 0

  const formatMoney = (n: number | string) =>
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
    totalDebit,
    totalCredit,
    formatMoney,
    showPreviewTab,
    downloadExcel,
    downloadPdf,
    updatePerPage,
    updatePage,
  }
}

export default useDiaryBookCreate
