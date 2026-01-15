// vue
import { ref, computed, watch, onMounted } from 'vue'

// interfaces
import { ActionType, IUploadedFile } from '@/interfaces/global'
import {
  IFinancialObligationDocument,
  DocumentUploadStatus,
} from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'

// composables
import { useAlert, useUtils } from '@/composables'

// constants
import { MAX_FILE_SIZE_MB } from '@/constants/files'

const ALLOWED_FILE_TYPES = '.pdf,.xlsx,.xls,.txt,.doc,.docx'

// Mapeo de estados de cargue a IDs del DEFAULT_STATUS_MAP
const UPLOAD_STATUS_MAP: Record<DocumentUploadStatus, number> = {
  loading: 20, // Cargando
  success: 104, // Exitoso
  error: 105, // Con errores
}

const COLUMNS = [
  {
    name: '#',
    label: '#',
    field: 'id',
    align: 'center' as const,
    sortable: true,
  },
  {
    name: 'item',
    label: 'Ítem',
    field: 'id',
    align: 'center' as const,
    sortable: true,
  },
  {
    name: 'name',
    label: 'Nombre',
    field: 'name',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'upload_status',
    label: 'Estado de cargue',
    field: 'upload_status',
    align: 'center' as const,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center' as const,
  },
]

const useDocumentsForm = (
  props: {
    action: ActionType
    data?: IFinancialObligationDocument[] | null
  },
  emit: (e: 'update:models', value: IFinancialObligationDocument[]) => void
) => {
  // composables
  const { showAlert } = useAlert()
  const { downloadBlobXlxx, defaultIconsLucide } = useUtils()

  // state
  let documentCounter = 0

  // refs
  const alertModalRef = ref()
  const attachDocumentRef = ref()
  const uploaderKey = ref(0)

  // models
  const models = ref<{ documents: IFinancialObligationDocument[] }>({
    documents: [],
  })

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    row: null as IFinancialObligationDocument | null,
  })

  // props - UploadFile
  const uploadProps = {
    title: 'Cargar documento',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: false,
    bordered: false,
    accept: ALLOWED_FILE_TYPES,
  }

  // computed
  const isView = computed(() => props.action === 'view')
  const columns = COLUMNS

  // handlers - file operations
  const addedFiles = (files: IUploadedFile[]) => {
    const file = files[0] as unknown as File
    const newFileSizeMB = file.size / (1024 * 1024)

    if (newFileSizeMB > MAX_FILE_SIZE_MB) {
      showAlert(
        `¡El archivo supera el tamaño máximo permitido (${MAX_FILE_SIZE_MB}mb)!`,
        'error'
      )
      attachDocumentRef.value?.removeFilesRemote()
      return
    }

    const isDuplicate = models.value.documents.some(
      (doc) => doc.name === file.name && !doc.to_delete
    )
    if (isDuplicate) {
      showAlert('El archivo ya ha sido añadido.', 'warning')
      attachDocumentRef.value?.removeFilesRemote()
      return
    }

    documentCounter++

    const newDocument: IFinancialObligationDocument = {
      id: documentCounter,
      document_type: file.type,
      name: file.name,
      upload_date: new Date().toISOString().split('T')[0],
      file,
      is_new: true,
      to_delete: false,
      upload_status: 'loading' as DocumentUploadStatus,
      is_saved: false,
    }

    models.value.documents.push(newDocument)

    // Simular proceso de carga
    setTimeout(() => {
      const docIndex = models.value.documents.findIndex(
        (doc) => doc.id === newDocument.id
      )
      if (docIndex !== -1) {
        models.value.documents[docIndex].upload_status = 'success'
        showAlert('Documento cargado exitosamente', 'success', undefined, 5000)
      }
    }, 1500)

    attachDocumentRef.value?.removeFilesRemote()
    uploaderKey.value++
  }

  const rejectedFiles = (fileRejected: { failedPropValidation: string }[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
  }

  const removeFile = () => {
    attachDocumentRef.value?.removeFilesRemote()
    uploaderKey.value++
  }

  const downloadDocument = async (row: IFinancialObligationDocument) => {
    if (row.file) {
      await downloadBlobXlxx(row.file, row.file.name)
    }
  }

  // handlers - delete operations
  const openDeleteModal = async (row: IFinancialObligationDocument) => {
    alertModalConfig.value.row = row
    alertModalConfig.value.description =
      '¿Está seguro de eliminar el documento?'
    await alertModalRef.value.openModal()
  }

  const deleteDocument = () => {
    models.value.documents = models.value.documents.filter(
      (doc) => doc !== alertModalConfig.value.row
    )
    alertModalRef.value.closeModal()
  }

  // helpers
  const getUploadStatusId = (status: DocumentUploadStatus): number => {
    return UPLOAD_STATUS_MAP[status] ?? 0
  }

  // private methods
  const _setValueModel = () => {
    if (props.data && props.data.length > 0) {
      if (models.value.documents.length === 0) {
        models.value.documents = [...props.data]
        documentCounter = props.data.length
      }
    }
  }

  // lifecycle
  onMounted(() => {
    _setValueModel()
  })

  // watchers
  watch(
    () => props.data,
    (newData, oldData) => {
      if ((!oldData || oldData.length === 0) && newData && newData.length > 0) {
        _setValueModel()
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.documents,
    () => {
      emit('update:models', models.value.documents)
    },
    { deep: true }
  )

  return {
    // state
    models,

    // refs
    alertModalRef,
    attachDocumentRef,
    uploaderKey,

    // computed
    isView,
    columns,
    alertModalConfig,
    defaultIconsLucide,

    // props
    uploadProps,

    // handlers
    addedFiles,
    rejectedFiles,
    removeFile,
    openDeleteModal,
    deleteDocument,
    downloadDocument,
    getUploadStatusId,
  }
}

export default useDocumentsForm
