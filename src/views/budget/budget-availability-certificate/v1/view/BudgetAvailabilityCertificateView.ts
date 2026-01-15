// Vue - pinia - moment
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute } from 'vue-router'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'

// Stores
import { useBudgetAvailabilityCertificateStore } from '@/stores/budget/budget-availability-certificate'

const useBudgetAvailabilityCertificateView = () => {
  const { params } = useRoute()
  const { goToURL } = useGoToUrl()

  const { _getCertificatePDFBlobById, _exportPDFActionById } =
    useBudgetAvailabilityCertificateStore('v1')

  const certificateId = +params.id

  const headerConfig = {
    title: 'Ver certificado de disponibilidad presupuestal',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuesto',
      },
      {
        label: 'Certificado de disponibilidad presupuestal',
        route: 'BudgetAvailabilityCertificateList',
      },
      {
        label: 'Ver certificado de disponibilidad presupuestal',
        route: 'BudgetAvailabilityCertificateView',
      },
      {
        label: `${certificateId}`,
      },
    ],
  }

  const pdfViewerConfig = ref({
    title: 'Certificado PDF',
    isLoading: false,
    hasError: false,
    errorMessage: '',
    pdfBlob: null as Blob | null,
  })

  const loadPDFBlob = async () => {
    pdfViewerConfig.value.isLoading = true
    pdfViewerConfig.value.hasError = false
    pdfViewerConfig.value.pdfBlob = null

    const blob = await _getCertificatePDFBlobById(certificateId)

    if (!blob) {
      pdfViewerConfig.value.hasError = true
      pdfViewerConfig.value.errorMessage =
        'No se pudo cargar el PDF del certificado.'
      pdfViewerConfig.value.isLoading = false
      return
    }

    pdfViewerConfig.value.pdfBlob = blob
    pdfViewerConfig.value.isLoading = false
  }

  const isDownloadingCertificate = ref<boolean>(false)

  const canDownloadCertificate = computed<boolean>(() => {
    if (
      !isDownloadingCertificate.value &&
      !pdfViewerConfig.value.isLoading &&
      !pdfViewerConfig.value.hasError
    )
      return true
    return false
  })

  const handleDownloadCertificate = async () => {
    isDownloadingCertificate.value = true
    await _exportPDFActionById(certificateId)
    isDownloadingCertificate.value = false
  }

  const handleGoToListView = () => {
    goToURL('BudgetAvailabilityCertificateList')
  }

  onBeforeMount(async () => await loadPDFBlob())

  return {
    headerConfig,
    pdfViewerConfig,
    canDownloadCertificate,
    handleGoToListView,
    handleDownloadCertificate,
  }
}

export default useBudgetAvailabilityCertificateView
