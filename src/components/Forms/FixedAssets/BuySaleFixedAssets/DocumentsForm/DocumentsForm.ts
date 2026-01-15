// vue - pinia - quasar
import { onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// interfaces
import { ActionType, IUploadedFile } from '@/interfaces/global'
import {
  IDocumentsBuySale,
  IBuySaleTransactionDocument
} from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'

// composables - assets
import { useUtils } from '@/composables/useUtils'
import { useAlert } from '@/composables/useAlert'
import { downloadFile, handleFileObjectToUrlConversion } from '@/utils'

const useDocumentsForm = (
  props: {
    action: ActionType
    data?: IBuySaleTransactionDocument[] | null
    initialDocuments?: IDocumentsBuySale[] | null
  },
  emit: Function
) => {
  // imports
  const { showAlert } = useAlert()
  const { defaultIconsLucide } = useUtils()

  // refs
  const attachDocumentRef = ref()
  const models = ref<{ documents: IDocumentsBuySale[] }>({
    documents: []
  })
  const isInitialized = ref(false)

  // upload
  const MAX_FILE_SIZE_MB = 10
  const MAX_FILE_COUNT = 3

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione los archivos para subir',
    multiple: true,
    bordered: false,
    accept: '.pdf, .doc, .jpg'
  }

  const addedFiles = (files: IUploadedFile[]) => {
    files.forEach((element) => {
      const newFileSizeMB = element.size / (1024 * 1024)

      if (isFileTooLarge(newFileSizeMB)) {
        handleLargeFile()
        attachDocumentRef.value?.removeSingleFile(element.name, element.size)
        return
      }

      if (models.value.documents.length >= MAX_FILE_COUNT) {
        showAlert('¡Solo se pueden adjuntar 3 archivos!', 'error')
        attachDocumentRef.value?.removeSingleFile(element.name, element.size)
        return
      }

      const auxFile = handleFileObjectToUrlConversion(element as never)
      models.value.documents.push({
        file: element as unknown as File,
        name: element.name,
        size: element.size,
        url: auxFile,
        document_type: element.type,
        file_size: element.size
      })
    })
  }

  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const handleLargeFile = () => {
    showAlert('¡El archivo supera el tamaño máximo permitido (10MB)!', 'error')
  }

  const deleteFiles = () => {
    models.value.documents = []
    attachDocumentRef.value?.removeFilesRemote()
  }

  const rejectedFiles = (fileRejected: { failedPropValidation?: string }[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    deleteFiles()
  }

  const deleteFileManual = (row: IDocumentsBuySale) => {
    attachDocumentRef.value?.removeSingleFile(row.name, row.size)

    const index = models.value.documents?.findIndex(
      (f) => f.name === row.name && f.url === row.url
    )

    if (index !== -1) {
      models.value.documents?.splice(index!, 1)
    }

    if (models.value.documents?.length === 0) {
      attachDocumentRef.value?.removeFilesRemote()
    }
  }

  const downloadFileS3 = (row: IDocumentsBuySale) => {
    if (row.url && row.name) {
      downloadFile(row.url, row.name)
    }
  }

  const validateForm = async (): Promise<boolean> => {
    if (!models.value.documents || models.value.documents.length === 0) {
      showAlert('Debe cargar al menos un documento', 'warning')
      return false
    }

    return true
  }

  // table
  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: false
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: false
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions'
      }
    ] as QTable['columns'],
    pages: { currentPage: ref(1), lastPage: ref(1) },
    rows: [] as IDocumentsBuySale[]
  })

  // actions
  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: () => {
        if (!isInitialized.value) {
          if (props.initialDocuments && props.initialDocuments.length > 0) {
            models.value.documents = props.initialDocuments.map((doc) => ({
              id: doc.id,
              name: doc.name,
              document_type: doc.document_type,
              file_size: doc.file_size,
              size: doc.size,
              url: doc.url
            }))
          } else {
            models.value.documents = []
          }
        }
      },
      edit: () => {
        if (props.data && !isInitialized.value) {
          models.value.documents = props.data.map((doc) => ({
            id: doc.id,
            name: doc.original_name,
            document_type: doc.document_type,
            file_size: doc.file_size,
            size: doc.file_size,
            url: doc.file_path
          }))
        }
      },
      view: () => {
        if (props.data) {
          models.value.documents = props.data.map((doc) => ({
            id: doc.id,
            name: doc.original_name,
            document_type: doc.document_type,
            file_size: doc.file_size,
            size: doc.file_size,
            url: doc.file_path
          }))
        }
      }
    }
    actionHandlers[action]?.()
  }

  // watch
  watch(
    () => models.value.documents,
    (newDocs) => {
      tableProps.value.rows =
        newDocs.map((item, index) => ({
          id: item.id ?? index + 1,
          name: item.name,
          url: item.url ?? '',
          size: item.size
        })) ?? []
      emit('update:models', newDocs.length > 0 ? newDocs : [])
    },
    { deep: true, immediate: false }
  )

  watch(
    () => props.data,
    (val) => {
      const hasData = Array.isArray(val) && val.length > 0
      if (hasData && !isInitialized.value && props.action !== 'create') {
        handlerActionForm(props.action)
        isInitialized.value = true
      }
    },
    { immediate: false }
  )

  // Watch for initialDocuments (used in Import)
  watch(
    () => props.initialDocuments,
    (val, oldVal) => {
      if (props.action === 'create') {
        
        const isInitialMount = oldVal === undefined
        const hasNewInitialDocs = val && val.length > 0

        if (hasNewInitialDocs) {
          models.value.documents = val.map((doc) => ({
            id: doc.id,
            name: doc.name,
            document_type: doc.document_type,
            file_size: doc.file_size,
            size: doc.size,
            url: doc.url
          }))
        } else if (isInitialMount) {
          
          models.value.documents = []
        }
      }
    },
    { immediate: true, deep: true }
  )

  // lifecycle
  onMounted(() => {
    handlerActionForm(props.action)
    if (props.action === 'create') {
      isInitialized.value = true
    }
  })

  return {
    defaultIconsLucide,

    attachDocumentRef,
    tableProps,
    uploadProps,

    addedFiles,
    rejectedFiles,
    deleteFiles,
    deleteFileManual,
    downloadFileS3,

    validateForm
  }
}

export default useDocumentsForm
