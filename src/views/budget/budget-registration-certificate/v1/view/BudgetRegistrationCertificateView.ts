// Vue - pinia
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Composables
import { useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useBudgetRegistrationCertificateStore } from '@/stores/budget/budget-registration-certificate'

const useBudgetRegistrationCertificateView = () => {
  const { _getBlobPreview } = useBudgetRegistrationCertificateStore('v1')

  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const router = useRouter()

  const pdfViewerConfig = ref({
    title: 'Certificado de Registro Presupuestal',
    isLoading: false,
    hasError: false,
    errorMessage: '',
    pdfBlob: null as Blob | null,
  })

  const certificateId = Number(router.currentRoute.value.params.id)

  const headerProperties = {
    title: 'Ver certificado de registro presupuestal',
    btn: () => goToURL('BudgetRegistrationCertificateList'),
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuesto',
      },
      {
        label: 'Certificado de registro presupuestal',
        route: 'BudgetRegistrationCertificateList',
      },
      {
        label: 'Ver',
      },
      {
        label: certificateId.toString(),
      },
    ],
  }

  const setPdfBlob = async (id: number) => {
    pdfViewerConfig.value.isLoading = true
    pdfViewerConfig.value.hasError = false
    pdfViewerConfig.value.errorMessage = ''

    const blob = await _getBlobPreview(id)

    if (blob) {
      pdfViewerConfig.value.pdfBlob = blob
    } else {
      pdfViewerConfig.value.hasError = true
      pdfViewerConfig.value.errorMessage = 'No se pudo cargar el documento PDF.'
    }

    pdfViewerConfig.value.isLoading = false
  }

  onMounted(async () => {
    openMainLoader(true)
    await setPdfBlob(certificateId)
    openMainLoader(false)
  })

  return {
    headerProperties,
    pdfViewerConfig,
  }
}

export default useBudgetRegistrationCertificateView
