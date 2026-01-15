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

const useComparativeStatementCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const comparative = useAccoutingReportStore(
    'v1',
    'comparative'
  ) as ReportTypes['comparative']
  const isFormValid = ref(false)
  const utils = useUtils()

  const headerOpeningRecord = {
    title: 'Balance general comparativo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes Contables', route: 'AccoutingReportList' },
      { label: 'Balance general comparativo' },
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
        name: 'name',
        label: 'Nombre de la cuenta',
        field: 'name',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'current_period',
        label: 'Saldo periodo',
        field: (r: IOpeningRecord & { current_period: string | number }) =>
          r?.current_period ?? 0,
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'previous_period',
        label: 'Saldo comparativo',
        field: (r: IOpeningRecord & { previous_period: string | number }) =>
          r?.previous_period ?? 0,
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        format: (val: string | number) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'variation',
        label: 'Variación periódico',
        field: 'variation',
        sortable: false,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  watch(
    () => comparative.comparative_financial_list,
    (src) => {
      tableProps.value.rows = src.map(
        (r: IOpeningRecord) =>
          ({
            ...r,
            current_period: Number(
              String(r.current_period ?? '0').replace(/,/g, '')
            ),
            previous_period: Number(
              String(r.previous_period ?? '0').replace(/,/g, '')
            ),
          } as IOpeningRecord)
      )
    }
  )

  const downloadExcel = () => {
    comparative.downloadPeriodicBalanceExcel()
  }

  const downloadPdf = () => {
    comparative.downloadPeriodicBalancePdf()
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
  }
}

export default useComparativeStatementCreate
