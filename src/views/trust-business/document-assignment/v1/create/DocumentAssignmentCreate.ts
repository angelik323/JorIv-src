// vue - quasar - router
import { useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
// pinia
import { storeToRefs } from 'pinia'

// store
import { useDocumentAssignmentStore } from '@/stores/trust-business/document-assignment'
import { useResourceManagerStore } from '@/stores/resources-manager'

// composables
import { useMainLoader, useS3Documents } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { IFile } from '@/interfaces/global/File'
import { ITabs } from '@/interfaces/global/Tabs'
import { IDocumentAssignmentCreate } from '@/interfaces/customs/trust-business/DocumentAssignment'

const useDocumentAssignmentCreate = () => {
  // imports
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { data_information_form, data_documents_form } = storeToRefs(
    useDocumentAssignmentStore('v1')
  )
  const { _saveDocumentsS3 } = useS3Documents()

  const { _setDataInformationForm, _createDocumentAssignment, _addFile } =
    useDocumentAssignmentStore('v1')

  const keys = { trust_business: ['business_trusts'] }

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Crear asignación de documentos por negocio',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'homeView',
      },
      {
        label: 'Negocios Fiduciarios',
        route: 'DocumentAssigns',
      },
      {
        label: 'Asignación de documentos por negocio',
        route: 'DocumentAssignmentCreate',
      },
      {
        label: 'Crear',
      },
    ],
  }

  // tabs
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

  const makeDataRequest = (ids: string): IDocumentAssignmentCreate => {
    return {
      id: data_information_form.value?.id
        ? data_information_form.value?.id
        : null,
      businessTrustId: data_information_form.value?.business_id
        ? Number(data_information_form.value?.business_id)
        : null,
      document_type_id: data_information_form.value?.document_type_id
        ? Number(data_information_form.value?.document_type_id)
        : null,
      name: 'documento',
      related_items: data_information_form.value?.related_items || null,
      file: {
        id: ids,
        is_validated: true,
      },
    }
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  const handleDocumentsUpload = async (files: IFile[]): Promise<string[]> => {
    const documentIds: string[] = []
    const uploadUrls: string[] = []
    const filesToUpload: IFile[] = []

    for (const fileField of files) {
      const file = fileField
      if (!file) continue

      const { success, documentId, uploadUrl } = await _addFile(
        file.name,
        file.type
      )

      if (!success || !documentId || !uploadUrl) continue

      documentIds.push(documentId.toString())
      uploadUrls.push(uploadUrl)
      filesToUpload.push(file)
    }

    if (!uploadUrls.length || !filesToUpload.length) return []

    await _saveDocumentsS3(uploadUrls, filesToUpload)

    return documentIds
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)

      if (data_documents_form.value) {
        const ids = await handleDocumentsUpload(data_documents_form.value)
        const payload: IDocumentAssignmentCreate = makeDataRequest(ids[0] || '')

        if (await _createDocumentAssignment(payload)) {
          router.push({ name: 'DocumentAssigns', query: { reload: 1 } })
        }
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    data_information_form,
    onSubmit,
    handlerGoTo,
  }
}

export default useDocumentAssignmentCreate
