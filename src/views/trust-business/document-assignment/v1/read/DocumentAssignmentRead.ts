// Composables
import { useMainLoader } from '@/composables'

// Interfaces
import {
  IDocumentAssignmentResponse,
  IDocumentAssignmentForm,
} from '@/interfaces/customs/trust-business/DocumentAssignment'
import { ITabs } from '@/interfaces/global/Tabs'

// Stores
import { useDocumentAssignmentStore } from '@/stores/trust-business/document-assignment'

// Utils
import { defaultIconsLucide } from '@/utils'

// Vue - Pinia
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useDocumentAssignmentRead = () => {
  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { _showDocumentAssignmentById, _clearData } =
    useDocumentAssignmentStore('v1')
  const { document_assignment_response } = storeToRefs(
    useDocumentAssignmentStore('v1')
  )
  const { openMainLoader } = useMainLoader()

  const data_information_form = ref<IDocumentAssignmentForm | null>(null)
  const headerProps = {
    title: 'Ver asignación de documentos por negocio',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
        route: 'DocumentAssigns',
      },
      {
        label: 'Asignación de documentos por negocio',
        route: 'DocumentAssigns',
      },
      {
        label: 'Ver',
        route: 'DocumentAssignmentRead',
      },
      {
        label: `${searchId}`,
      },
    ],
  }
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const goToList = () => {
    router.push({ name: 'DocumentAssigns' })
  }

  const setFormRead = (data: IDocumentAssignmentResponse) => {
    data_information_form.value = {
      id: data.id,
      business_id: data.business_id,
      document_type_id: data.document_type_id,
      related_items: data.related_items,
    }
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _showDocumentAssignmentById(searchId)
    openMainLoader(false)
  })

  watch(
    () => document_assignment_response.value,
    (val) => {
      if (!val) return
      setFormRead(val)
    }
  )

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    document_assignment_response,
    goToList,
  }
}

export default useDocumentAssignmentRead
