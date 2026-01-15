// Vue - Pinia - Router - Quasar
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useAlert, useS3Documents, useUtils } from '@/composables'

// Interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IContractRegistrationDocumentStructure,
  IContractRegistrationGeneralDataForm,
  IGeneratePresignedUrlContractRegistration,
} from '@/interfaces/customs/derivative-contracting/ContractRegistration'

// Stores
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useContractRegistrationStore } from '@/stores/derivative-contracting/contract-registration'

const useDocumentaryStructureForm = (
  props: {
    action: ActionType
    data?: IContractRegistrationGeneralDataForm | null
  },
  emit: Function
) => {
  const { contract_attachments } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )
  const { _generatePresignedUrl } = useContractRegistrationStore('v1')

  const { _saveDocumentsS3 } = useS3Documents()

  const { isEmptyOrZero, defaultIconsLucide, getBlobFromUrl } = useUtils()
  const { showAlert } = useAlert()

  const formElementRef = ref()
  const viewerFileComponentRef = ref()
  const alertModalRef = ref()
  const alertModalConfig = ref({
    id: null as number | null,
    title: 'Advertencia',
    description: '',
    description2: '',
    showCloseBtn: false,
  })

  const models = ref<Partial<IContractRegistrationGeneralDataForm>>({
    annex_documents: [],
  })

  const tableDocumentsProperties = ref<
    IBaseTableProps<IContractRegistrationDocumentStructure>
  >({
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'document',
        required: true,
        label: 'Documento',
        align: 'left',
        field: 'document',
        sortable: true,
      },
      {
        name: 'file_name',
        required: true,
        label: 'Nombre del archivo',
        align: 'left',
        field: 'file_name',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'left',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const setValueModel = () => {
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  const viewFile = async (fileProxy: string | null) => {
    if (!fileProxy) {
      return showAlert(`No hay archivo para mostrar`, 'error', undefined, 1000)
    }

    try {
      const blob = await getBlobFromUrl(fileProxy)
      await viewerFileComponentRef.value.showFile(blob)
    } catch (error) {
      showAlert(`Error al procesar el archivo`, 'error', undefined, 3000)
      return error
    }
  }

  const removeFile = (id: number) => {
    const filteredDocuments = models.value.annex_documents?.filter(
      (file) => file.id !== id
    )
    if (filteredDocuments) {
      models.value.annex_documents = filteredDocuments
    }

    alertModalRef.value.closeModal()
  }

  const handleOpenAlertModal = (id: number) => {
    const file = models.value.annex_documents?.find((doc) => doc.id === id)
    if (!file) return

    alertModalConfig.value.id = id
    alertModalConfig.value.description =
      '¿Desea eliminar el documento anexo seleccinado?'
    alertModalConfig.value.description2 = 'Se eliminará el registro asociado'

    alertModalRef.value.openModal()
  }

  const handleFileChange = async (file: File, name: string, id: number) => {
    const payload: IGeneratePresignedUrlContractRegistration = {
      name: file.name,
      file_type: file.type,
      file_size: file.size,
      annex_document_id: id,
    }

    const response = await _generatePresignedUrl(payload)
    if (!response) return
    await _saveDocumentsS3([response.upload_url], [file])

    const fileToAdd = {
      id: response?.document_id ?? null,
      annex_document_id: id,
      file_name: file.name,
      document: name,
      file_path: response?.upload_url ?? '',
      size: file.size,
      is_validated: true,
    }
    models.value.annex_documents?.push(fileToAdd)

    showAlert(`Documento: ${file.name} agregado correctamente`, 'success')
  }

  const dataUpload = ref<
    {
      position: number
      class: string
      title: string
      subtitle: string
      required: boolean
      file: File | null | string
      id: number | null
    }[]
  >([])

  watch(
    () => models.value?.annex_documents,
    (val) => {
      tableDocumentsProperties.value.rows = (val ||
        []) as IContractRegistrationDocumentStructure[]
    },
    { immediate: true, deep: true }
  )

  watch(
    [contract_attachments, () => models.value.annex_documents],
    ([attachments]) => {
      if (!attachments) return

      dataUpload.value = attachments.map((item, index) => {
        const isUploaded = models.value?.annex_documents?.some(
          (doc) =>
            Number(doc.annex_document_id) ===
            Number(item.type_attached_document?.id)
        )

        return {
          position: index,
          class: 'mt-1',
          title: item.label || '-',
          subtitle: '',
          required: item.mandatory === 'Obligatorio' && !isUploaded,
          file: isUploaded ? '' : null,
          id: Number(item.type_attached_document?.id),
        }
      })
    },
    { immediate: true, deep: true }
  )

  return {
    formElementRef,
    viewerFileComponentRef,
    alertModalRef,
    tableDocumentsProperties,
    defaultIconsLucide,
    alertModalConfig,
    dataUpload,

    viewFile,
    removeFile,
    handleOpenAlertModal,
    handleFileChange,
  }
}

export default useDocumentaryStructureForm
