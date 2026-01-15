// vue - pinia
import { ref, onBeforeMount, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// stores
import { useFinancialObligationStore } from '@/stores/financial-obligations/financial-obligation'

// interfaces
import {
  IFinancialObligationDetailV2,
  IFinancialObligationDocument,
} from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'

// composables
import { useGoToUrl, useMainLoader } from '@/composables'

type AttachmentResponse = {
  id?: number | string | null
  file_mime_type?: string | null
  document_type?: string | null
  file_name?: string | null
  name?: string | null
  created_at?: string | number | null
  url?: string | null
  file_path?: string | null
  original_name?: string | null
}

const useFinancialObligationViewDocuments = () => {
  // route
  const route = useRoute()
  const searchId = +route.params.id

  // composables
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  // stores
  const { headerPropsDefault } = storeToRefs(useFinancialObligationStore('v2'))
  const { _getFinancialObligationById } = useFinancialObligationStore('v2')

  // breadcrumb
  const headerPropsViewDocuments = {
    title: 'Ver documentos soporte',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'FinancialObligationView',
      },
      {
        label: `${searchId}`,
      },
      {
        label: 'Documentos',
      },
    ],
  }

  // state
  const isLoading = ref(true)
  const responseData = ref<IFinancialObligationDetailV2 | null>(null)
  const documentsData = ref<IFinancialObligationDocument[]>([])

  // actions
  const goBack = () => {
    goToURL('FinancialObligationView', { id: searchId })
  }

  // lifecycle
  onBeforeMount(async () => {
    openMainLoader(true)

    const response = await _getFinancialObligationById(searchId)
    responseData.value = response

    documentsData.value =
      response?.attachments?.map((doc: AttachmentResponse) => ({
        id: doc?.id ? Number(doc.id) : undefined,
        document_type: doc?.file_mime_type ?? doc?.document_type ?? null,
        name: doc?.file_name ?? doc?.name ?? null,
        upload_date: doc?.created_at
          ? String(doc.created_at).slice(0, 10)
          : null,
        s3_file_path: doc?.url ?? doc?.file_path ?? null,
        original_name: doc?.original_name ?? null,
        file: undefined,
        is_new: false,
        to_delete: false,
        upload_status: 'success' as const,
        is_saved: true,
      })) ?? []

    isLoading.value = false
    openMainLoader(false)
  })

  onUnmounted(() => {
    responseData.value = null
    documentsData.value = []
  })

  return {
    headerPropsViewDocuments,
    isLoading,
    documentsData,
    goBack,
  }
}

export default useFinancialObligationViewDocuments
