// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICertifiedParametersView,
  ICertifiedParametersResponse,
} from '@/interfaces/customs/normative/CertifiedParameters'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useCertifiedParametersStore } from '@/stores/normative/certified-parameters'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCertifiedParametersView = () => {
  const { _getCertifiedBlobPreview, _getCertifiedParametersById } =
    useCertifiedParametersStore('v1')
  const { headerPropsDefault } = useCertifiedParametersStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const router = useRouter()

  const pdfViewerConfig = ref({
    title: 'Certificado PDF',
    isLoading: false,
    hasError: false,
    errorMessage: '',
    pdfBlob: null as Blob | null,
  })

  const keys = {
    normative: ['certificate_types'],
  }

  const parameterId = Number(router.currentRoute.value.params.id)

  const information_form = ref<ICertifiedParametersView | null>(null)

  const headerProperties = {
    title: 'Ver parámetros certificados',
    breadcrumbs: [
      ...headerPropsDefault.breadcrumbs,
      {
        label: 'Ver',
        route: 'CertifiedParametersView',
      },
      {
        label: parameterId.toString(),
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information_form',
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
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const setFormView = (data: ICertifiedParametersResponse) => {
    information_form.value = {
      certificate_type: data.certificate_type || null,
      generation_date: data.generation_date || null,
    }
  }

  const setPdfBlob = async (id: number) => {
    pdfViewerConfig.value.isLoading = true
    pdfViewerConfig.value.hasError = false
    pdfViewerConfig.value.errorMessage = ''

    const blob = await _getCertifiedBlobPreview(id)

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
    const response = await _getCertifiedParametersById(parameterId)
    await Promise.all([_getResources(keys), setPdfBlob(parameterId)])
    if (response) {
      setFormView(response)
    }
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    information_form,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    pdfViewerConfig,
  }
}

export default useCertifiedParametersView
