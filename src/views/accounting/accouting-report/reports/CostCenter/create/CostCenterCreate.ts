// core
import { computed, onMounted, Ref, ref } from 'vue'

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
import { QTable } from 'quasar'
import { useUtils } from '@/composables'

const useCostCenterCreate = (
  openingReportForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordResponse['data'] | null>(null)
  const costCenter = useAccoutingReportStore(
    'v1',
    'costCenter'
  ) as ReportTypes['costCenter']
  const isFormValid = ref(false)
  const utils = useUtils()
  const resourceManagerStore = useResourceManagerStore('v1')
  const { _getResources } = resourceManagerStore

  const headerOpeningRecord = {
    title: 'Balance por centro de costo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes Contables', route: 'AccoutingReportList' },
      { label: 'Balance por centro de costo' },
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
      label: 'Informe generado',
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

  const rows = computed(() => costCenter.cost_center_list)

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
        name: 'account',
        label: 'Cuenta',
        field: 'account',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'cost_center',
        label: 'Centro de costo',
        field: 'cost_center',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'name',
        label: 'Nombre',
        field: 'name',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'initial_balance',
        label: 'Saldo inicial',
        field: 'initial_balance',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'debit',
        label: 'Débitos',
        field: 'debit',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'credit',
        label: 'Créditos',
        field: 'credit',
        sortable: false,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'final_balance',
        label: 'Saldo final',
        field: 'final_balance',
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

  const downloadExcel = async () => {
    costCenter.downloadPeriodicBalanceExcel()
  }

  const downloadPdf = async () => {
    costCenter.downloadPeriodicBalancePdf()
  }

  onMounted(async () => {
    await Promise.all([
      _getResources(
        { accounting: ['business_trusts_basic', 'amount_types'] },
        '',
        'v1'
      ),
      _getResources({ accounting: ['template'] }, '', 'v2'),
    ])
  })

  return {
    headerOpeningRecord,
    tabs,
    activeTab,
    activeTabIdx,
    openingReportForm,
    processData,
    isFormValid,
    tableProps,
    rows,
    viewerFileComponentRef,
    showPreviewTab,
    downloadExcel,
    downloadPdf,
  }
}

export default useCostCenterCreate
