// vue - quasar
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// stores
import { useFinancialObligationStore } from '@/stores/financial-obligations/financial-obligation'

// interfaces
import {
  IFinancialObligationDocument,
  IFinancialObligationDetailV2,
} from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'

// composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

const useFinancialObligationEditDocuments = () => {
  // route
  const route = useRoute()
  const searchId = +route.params.id

  // composables
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()
  const { getFileFromS3 } = useUtils()

  // loader
  const { openMainLoader } = useMainLoader()

  // stores
  const { headerPropsDefault } = storeToRefs(useFinancialObligationStore('v2'))
  const { _getFinancialObligationById, _addFinancialObligationDocument } =
    useFinancialObligationStore('v2')

  // breadcrumb
  const headerPropsEditDocuments = {
    title: 'Editar documentos soportes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Editar',
          route: 'FinancialObligationEdit',
        },
        {
          label: `${searchId}`,
        },
        {
          label: 'Documentos soporte',
        },
      ],
    ],
  }

  // state
  const isLoading = ref(true)
  const responseData = ref<IFinancialObligationDetailV2 | null>(null)
  const documentsFormData = ref<IFinancialObligationDocument[]>([])

  // refs
  const formDocuments = ref()

  // computed
  const hasNewDocuments = () => {
    return documentsFormData.value.some(
      (doc) => doc.is_new && doc.upload_status === 'success'
    )
  }

  // handlers
  const setDocumentsFormData = (data: IFinancialObligationDocument[]) => {
    documentsFormData.value = data
  }

  const goBack = () => {
    goToURL('FinancialObligationEdit', { id: searchId })
  }

  const onSubmit = async () => {
    const newDocs = documentsFormData.value.filter(
      (doc) => doc.is_new && doc.upload_status === 'success' && !doc.is_saved
    )

    if (newDocs.length === 0) {
      showAlert(
        'No hay documentos nuevos para guardar',
        'warning',
        undefined,
        3000
      )
      return
    }

    openMainLoader(true)

    await handleDocumentsUpload(searchId, newDocs)

    // Marcar documentos como guardados
    documentsFormData.value = documentsFormData.value.map((doc) => {
      if (doc.is_new && doc.upload_status === 'success') {
        return { ...doc, is_saved: true, is_new: false }
      }
      return doc
    })

    openMainLoader(false)
    showAlert('Documento cargado exitosamente', 'success', undefined, 5000)
  }

  const handleDocumentsUpload = async (
    obligationId: number,
    files: IFinancialObligationDocument[]
  ): Promise<void> => {
    for (const fileField of files) {
      const file = fileField.file
      if (!file) continue

      await _addFinancialObligationDocument(obligationId, file)
    }
  }

  // lifecycles
  onBeforeMount(async () => {
    openMainLoader(true)

    responseData.value = await _getFinancialObligationById(searchId)
    isLoading.value = false

    openMainLoader(false)
  })

  // watchers
  watch(
    () => responseData.value,
    async (val) => {
      if (!val) return

      // Mapear documentos existentes
      if (val.attachments && val.attachments.length > 0) {
        documentsFormData.value = await Promise.all(
          val.attachments.map(
            async (item: Record<string, unknown>, index: number) => {
              const fileUrl = (item.url as string) ?? ''
              const fileName = (item.file_name as string) ?? ''
              const file = await getFileFromS3(fileUrl, fileName)
              return {
                id: index + 1,
                document_type: (item.file_mime_type as string) ?? null,
                name: fileName,
                upload_date: (item.created_at as string) ?? null,
                s3_file_path: fileUrl,
                original_name: fileName,
                file: file ?? undefined,
                is_new: false,
                to_delete: false,
                upload_status: 'success' as const,
                is_saved: true,
              }
            }
          )
        )
      }
    },
    { deep: true }
  )

  return {
    headerPropsEditDocuments,
    isLoading,
    formDocuments,
    documentsFormData,
    searchId,

    goBack,
    onSubmit,
    hasNewDocuments,
    setDocumentsFormData,
  }
}

export default useFinancialObligationEditDocuments
