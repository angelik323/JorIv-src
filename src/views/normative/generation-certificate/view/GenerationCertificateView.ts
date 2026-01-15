// Vue - pinia
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useGenerationCertificateStore } from '@/stores/normative/generation-certificate'

const useGenerateCertificateView = () => {
  const { headerPropsDefault, routerGroupList, url } =
    useGenerationCertificateStore('v1')

  const { defaultIconsLucide } = useUtils()
  const router = useRouter()

  const pdfViewerConfig = ref({
    title: 'Certificado PDF',
    isLoading: false,
    hasError: false,
    errorMessage: '',
    pdfUrl: url,
  })

  const id = Number(router.currentRoute.value.params.id)

  const information_form = ref(null)

  const headerProperties = {
    title: 'Ver certificado',
    breadcrumbs: [
      ...headerPropsDefault.breadcrumbs,
      {
        label: 'Ver',
        route: '',
      },
      {
        label: id.toString(),
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

  return {
    information_form,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    pdfViewerConfig,
    routerGroupList,
  }
}

export default useGenerateCertificateView
