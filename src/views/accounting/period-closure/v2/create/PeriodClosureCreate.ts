// Vue - Router - Pinia
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IReportItem } from '@/interfaces/customs/accounting/PeriodClosure'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { usePeriodClosureStore } from '@/stores/accounting/period-closure'
import { QTable } from 'quasar'

const usePeriodClosureCreate = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const periodClosureForm = ref<{
    closureStatus?: string
    pendingProcesses?: Array<Record<string, string>>
    closureData?: {
      period?: string
      pending?: Array<Record<string, string>>
    } | null
    validateForm?: () => Promise<boolean> | boolean
    handleSubmit?: () => Promise<
      | {
          status: 'pending_processes' | 'success' | 'error'
          message: string
          pending: unknown[]
        }
      | undefined
    >
  } | null>(null)

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _downloadPeriodClosureReport } = usePeriodClosureStore('v2')

  const key_v2 = [
    'business_trusts_per_clousure_period',
    'account_structures_accounting_accounts',
  ]

  const headerProps = {
    title: 'Crear cierre de período',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      { label: 'Cierre de período', route: 'PeriodClosureList' },
      { label: 'Crear', route: 'PeriodClosureCreate' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'report',
      label: 'Informe de procesos',
      icon: defaultIconsLucide.clipboardPlay,
      outlined: true,
      disable: false,
      show: false,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const closureStatus = computed(
    () => periodClosureForm.value?.closureStatus ?? ''
  )

  const pendingProcesses = computed<Array<Record<string, string>>>(() => {
    const raw = periodClosureForm.value?.pendingProcesses
    return (Array.isArray(raw) ? raw : []) as Array<Record<string, string>>
  })

  const closureData = computed<{
    period?: string
    pending?: Array<Record<string, string>>
  } | null>(() => periodClosureForm.value?.closureData ?? null)

  const reportItems = ref<IReportItem[]>([])
  const tableProps = ref({
    title: 'Informe de procesos pendientes',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left' as const,
        sortable: true,
      },
      {
        name: 'structure',
        label: 'Estructura contable',
        field: 'structure',
        align: 'left' as const,
        sortable: true,
      },
      {
        name: 'business_code',
        label: 'Código del negocio',
        field: 'business_code',
        align: 'left' as const,
        sortable: true,
      },
      {
        name: 'business_name',
        label: 'Nombre del negocio',
        field: 'business_name',
        align: 'left' as const,
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: 'status',
        align: 'left' as const,
        sortable: true,
      },
      {
        name: 'detail',
        label: 'Detalle',
        field: 'detail',
        align: 'left' as const,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IReportItem[],
    pages: {
      currentPage: ref(0),
      lastPage: ref(0),
    },
  })

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
  }

  const updatePerPage = () => {
    // TODO: implementar lógica si en el futuro se requiere manejar el cambio de página
  }

  const activateReportTab = () => {
    const reportTab = tabs.value.find((t) => t.name === 'report')
    const infoTab = tabs.value.find((t) => t.name === 'information')

    if (reportTab) reportTab.show = true
    if (infoTab) infoTab.disable = true

    tableProps.value.rows = pendingProcesses.value.map((item, idx) => ({
      id: idx + 1,
      business_code: item['Código del negocio'] ?? '',
      business_name: item['Nombre del negocio'] ?? '',
      detail: item['Detalle'] ?? '',
      status: item['Estado'] ?? '',
      structure: item['Estructura contable'] ?? '',
    }))

    tabActive.value = 'report'
    tabActiveIdx.value = filteredTabs.value.findIndex(
      (t) => t.name === 'report'
    )
  }

  const handleDownloadExcel = async () => {
    const dataClosure = closureData.value

    if (!dataClosure || !Array.isArray(dataClosure.pending)) return

    const payloadData = dataClosure.pending.map((item) => ({
      'Estructura contable': item['Estructura contable'] ?? '',
      'Código del negocio': item['Código del negocio'] ?? '',
      'Nombre del negocio': item['Nombre del negocio'] ?? '',
      Estado: item['Estado'] ?? '',
      Detalle: item['Detalle'] ?? '',
    }))

    await _downloadPeriodClosureReport({
      period: dataClosure.period ?? '',
      data: JSON.stringify(payloadData),
    })
  }

  const onSubmit = async () => {
    const result = await periodClosureForm.value?.handleSubmit?.()

    if (!result) return

    if (result.status === 'pending_processes') {
      activateReportTab()
      return
    }

    if (result.status === 'success') {
      openMainLoader(true)
      router.push({ name: 'PeriodClosureList' })

      setTimeout(() => openMainLoader(false), 500)
    }
  }

  const handleBackToForm = () => {
    tabActive.value = 'information'
    tabActiveIdx.value = filteredTabs.value.findIndex(
      (tab) => tab.name === 'information'
    )
  }

  onMounted(async () => {
    await _getResources({ accounting: key_v2 }, '', 'v2')
  })

  onBeforeMount(async () => {
    await _resetKeys({ accounting: [...key_v2] })
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    periodClosureForm,
    reportItems,
    tableProps,
    closureStatus,
    handleBackToForm,
    handleDownloadExcel,
    updatePerPage,
    updatePage,
    activateReportTab,
    onSubmit,
    goToURL,
  }
}

export default usePeriodClosureCreate
