// core
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { QTable } from 'quasar'

// stores
import { useAccoutingReportStore, useResourceManagerStore } from '@/stores'

// interfaces y constantes
import type { ITabs } from '@/interfaces/global'
import type {
  IOpeningRecord,
  IOpeningRecordResponse,
  OpeningRecordFormExpose,
  OpeningRow,
  ReportTypes,
} from '@/interfaces/customs'

// utils y composables
import { defaultIconsLucide } from '@/utils'
import { useGoToUrl, useUtils } from '@/composables'

const { _getResources, _resetKeys } = useResourceManagerStore('v1')

const useAccoutingReportCreate = () => {
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const financial = useAccoutingReportStore(
    'v1',
    'financial'
  ) as ReportTypes['financial']
  const openingRecordForm = ref<OpeningRecordFormExpose | null>(null)

  const isFormValid = ref(false)
  const utils = useUtils()
  const { goToURL } = useGoToUrl()

  const headerOpeningRecord = {
    title: 'Reporte estado de situación financiera',
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
  const viewerFileComponentRef = ref()

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
      field: (row: OpeningRow) => row.code,
      sortable: true,
      style: 'width: 150px',
      align: 'center',
      headerStyle: 'text-align: center;',
    },
    {
      name: 'name',
      label: 'Nombre de la cuenta',
      field: (row: OpeningRow) => row.name,
      sortable: true,
      style: 'width: 150px',
      align: 'center',
      headerStyle: 'text-align: center;',
    },
    {
      name: 'current_period',
      label: 'Saldo periodo',
      field: (row: OpeningRow) => row.current_period,
      sortable: true,
      style: 'width: 150px',
      align: 'center',
      headerStyle: 'text-align: center;',
      format: (val: number) =>
        utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
    },

    {
      name: 'previous_period',
      label: 'Saldo comparativo',
      field: (row: OpeningRow) => row.previous_period,
      sortable: true,
      style: 'width: 150px',
      align: 'center',
      format: (val: number) =>
        utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
    },
    {
      name: 'variation',
      label: 'Variación periódico',
      field: (row: OpeningRow) => row.variation,
      sortable: false,
      style: 'width: 150px',
      align: 'center',
      headerStyle: 'text-align: center;',
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

  const sectionTables = computed(() => {
    const raw = financial.opening_record_list as unknown

    const asObj = (x: unknown) =>
      x && typeof x === 'object' ? (x as Record<string, unknown>) : {}
    const asArr = (x: unknown) => (Array.isArray(x) ? (x as unknown[]) : [])

    let sections: unknown[] = []

    if (Array.isArray(raw)) {
      if (raw.length > 0 && asObj(raw[0]).sections) {
        sections = asArr(asObj(raw[0]).sections)
      } else {
        sections = raw
      }
    } else if (raw && typeof raw === 'object') {
      const obj = asObj(raw)
      if (obj.sections) {
        sections = asArr(obj.sections)
      } else if (asObj(obj.data).sections) {
        sections = asArr(asObj(obj.data).sections)
      } else if (Array.isArray(asObj(obj).data)) {
        sections = asArr(obj.data)
      }
    }

    return sections.map((secUnknown) => {
      const sec = asObj(secUnknown)
      const title = String(sec.title ?? '')

      const rawRows = asArr(sec.rows)
      const rows: OpeningRow[] = rawRows.map((r) => {
        const [code, name, cur, prev, variation] = Array.isArray(r) ? r : []
        return {
          id: String(code ?? ''),
          code: String(code ?? ''),
          name: String(name ?? ''),
          current_period: Number(cur ?? 0),
          previous_period: Number(prev ?? 0),
          variation: Number(variation ?? 0),
        }
      })

      const totalArr = asArr(sec.total)
      const totals = {
        current_period: Number(totalArr[0] ?? 0),
        previous_period: Number(totalArr[1] ?? 0),
        variation: Number(totalArr[2] ?? 0),
      }

      return {
        title,
        columns: commonColumns,
        rows,
        totals,
      }
    })
  })

  const rows = computed<OpeningRow[]>(() =>
    sectionTables.value.flatMap((s) => s.rows)
  )

  const downloadExcel = () => {
    financial.downloadPeriodicBalanceExcel()
  }

  const downloadPdf = () => {
    financial.downloadPeriodicBalancePdf()
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
    openingRecordForm,
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
    goToURL,
  }
}

export default useAccoutingReportCreate
