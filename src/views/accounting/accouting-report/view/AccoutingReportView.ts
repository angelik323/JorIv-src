import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import router from '@/router'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useOpeningRecordStore } from '@/stores'

const useAccoutingReportView = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()
  const { _showAction } = useOpeningRecordStore('v1')

  const pdfUrl = ref<string | null>(null)
  const excelUrl = ref<string | null>(null)
  const hasPdf = computed(() => !!pdfUrl.value)
  const hasExcel = computed(() => !!excelUrl.value)

  const id = route.params.id as string

  const headerProperties = {
    title: 'Ver reporte contable',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Reportes contables', route: 'AccoutingReportList' },
      { label: 'Ver', route: 'AccoutingReportView' },
      { label: id },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])
  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((t) => t.name === tabActive.value)
  )

  const pdfSrc = computed<string | undefined>(() => {
    if (!pdfUrl.value) return undefined
    const sep = pdfUrl.value.includes('#') ? '&' : '#'
    return `${pdfUrl.value}${sep}view=FitH&zoom=page-width`
  })

  const loadData = async () => {
    openMainLoader(true)
    const resp = await _showAction(id)

    if (resp) {
      const t = String(resp.type || '').toLowerCase()
      const rr = resp.related_report

      pdfUrl.value =
        t === 'pdf' ? resp.url : rr && rr.mime_type_id === 2 ? rr.url : null

      excelUrl.value =
        t === 'excel' ? resp.url : rr && rr.mime_type_id === 1 ? rr.url : null
    }

    openMainLoader(false)
  }

  const downloadPdf = () => {
    if (pdfUrl.value) window.open(pdfUrl.value, '_blank')
  }
  const downloadExcel = () => {
    if (excelUrl.value) window.open(excelUrl.value, '_blank')
  }
  const handleGoToList = () =>
    router.push({ name: 'AccoutingReportList', query: { reload: 'true' } })

  onMounted(loadData)

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    pdfUrl,
    excelUrl,
    hasPdf,
    hasExcel,
    pdfSrc,
    downloadPdf,
    downloadExcel,
    handleGoToList,
  }
}

export default useAccoutingReportView
