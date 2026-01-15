import { ref, onBeforeMount, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useS3Documents, useAlert } from '@/composables'

// Stores
import { useDocumentAssignmentStore } from '@/stores/trust-business/document-assignment'

// Interfaces
import { IDocumentAssignmentCreate } from '@/interfaces/customs/trust-business/DocumentAssignment'
import { IFile } from '@/interfaces/global/File'
import { ITabs } from '@/interfaces/global/Tabs'

const useDocumentAssignmentEdit = () => {
  const {
    _updateDocumentAssignment,
    _showDocumentAssignmentById,
    _clearData,
    _addFile,
  } = useDocumentAssignmentStore('v1')
  const {
    document_assignment_response,
    data_documents_form,
    data_information_form,
  } = storeToRefs(useDocumentAssignmentStore('v1'))

  // Referencias a formularios
  const basicDataFormRef = ref()

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { _saveDocumentsS3 } = useS3Documents()
  const { showAlert } = useAlert()

  const headerProps = {
    title: 'Editar asignación de documentos por negocio',
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
        route: 'DocumentAssigns',
      },
      {
        label: 'Editar',
        route: 'DocumentAssignmentEdit',
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

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const isUpdateDisabled = computed(() => {
    if (!basicDataFormRef.value) return true
    const hasChangesValue = basicDataFormRef.value.hasChanges()
    return !hasChangesValue
  })

  const makeDataRequest = (ids: string): IDocumentAssignmentCreate => {
    return {
      id: data_information_form.value?.id
        ? data_information_form.value?.id
        : null,
      businessTrustId: data_information_form.value?.business_trust_id
        ? Number(data_information_form.value?.business_trust_id)
        : null,
      document_type_id: data_information_form.value?.document_type_id
        ? Number(data_information_form.value?.document_type_id)
        : null,
      name: 'documento',
      related_items:
        data_information_form.value?.related_items?.map((item) => ({
          structure_id: item.structure_id ?? 0,
          id: item.id ?? 0,
          characteristic: item.characteristic ?? '',
          name: item.name ?? '',
          value: item.value ?? null,
        })) || null,
      file: {
        id: ids,
        is_validated: true,
      },
    }
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

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
    if (await validateForms()) {
      openMainLoader(true)

      if (data_documents_form.value) {
        const ids = await handleDocumentsUpload(data_documents_form.value)

        if (ids[0]) {
          const payload: IDocumentAssignmentCreate = makeDataRequest(
            ids[0] || ''
          )

          if (await _updateDocumentAssignment(payload, searchId)) {
            router.push({ name: 'DocumentAssigns', query: { reload: 1 } })
          }
        } else {
          showAlert('Debe agregar al menos un documento.', 'error')
        }

        setTimeout(() => {
          openMainLoader(false)
        }, 1000)
      }
    }
  }

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _showDocumentAssignmentById(searchId)
    openMainLoader(false)
  })

  return {
    document_assignment_response,
    data_information_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    isUpdateDisabled,

    nextTab,
    backTab,
    onSubmit,
  }
}

export default useDocumentAssignmentEdit
