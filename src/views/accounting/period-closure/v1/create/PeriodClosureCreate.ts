import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { IReportItem } from '@/interfaces/customs'
import { usePeriodClosureStore, useResourceManagerStore } from '@/stores'

const { _downloadPeriodClosureReport } = usePeriodClosureStore('v1')

const handleDownloadExcel = async () => {
  await _downloadPeriodClosureReport()
}

const usePeriodClosureCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const periodClosureForm = ref()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const key_v1 = ['account_structures_with_purpose']

  const key_v2 = ['business_trusts_per_clousure_period']

  const headerProps = {
    title: 'Crear cierre de periodo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      { label: 'Cierre de periodo', route: 'PeriodClosureList' },
      { label: 'Crear', route: '' },
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

  const activateReportTab = () => {
    const reportTab = tabs.value.find((t) => t.name === 'report')
    const infoTab = tabs.value.find((t) => t.name === 'information')

    if (reportTab) reportTab.show = true
    if (infoTab) infoTab.disable = true

    tabActive.value = 'report'
    tabActiveIdx.value = filteredTabs.value.findIndex(
      (t) => t.name === 'report'
    )
  }

  const validateForms = async () => {
    return periodClosureForm.value?.validateForm?.()
  }

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
        name: 'detail',
        label: 'Detalle',
        field: 'detail',
        align: 'left' as const,
        sortable: true,
      },
    ],
    rows: [] as IReportItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
  }

  const updatePerPage = () => {
    // TODO: implementar lógica si en el futuro se requiere manejar el cambio de página
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const success = await periodClosureForm.value?.handleSubmit?.()
      if (success) {
        router.push({ name: 'PeriodClosureList' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  const closureStatus = computed(() => periodClosureForm.value?.closureStatus)

  const handleBackToForm = () => {
    tabActive.value = 'information'
    tabActiveIdx.value = filteredTabs.value.findIndex(
      (tab) => tab.name === 'information'
    )
  }

  onMounted(async () => {
    await _getResources({ accounting: key_v1 }, undefined, 'v1')
    await _getResources({ accounting: key_v2 }, '', 'v2')
  })

  onBeforeMount(async () => {
    await _resetKeys({ accounting: [...key_v1, ...key_v2] })
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
    _downloadPeriodClosureReport,
    updatePerPage,
    updatePage,
    activateReportTab,
    onSubmit,
  }
}

export default usePeriodClosureCreate
