// pinia - vue - quasar
import { onMounted, ref, watch } from 'vue'
import { QRejectedEntry, QTable } from 'quasar'
import { storeToRefs } from 'pinia'

// stores
import { useAssignmentBuyerStore } from '@/stores'

// interfaces
import {
  IFileTableRecordTransfer,
  IResponseDocuments,
} from '@/interfaces/customs'
import { ActionType, IUploadedFile } from '@/interfaces/global'

// utils
import { handleFileObjectToUrlConversion } from '@/utils'

// composables
import { useAlert, useUtils } from '@/composables'

const useDocumentsForm = (props: {
  action: ActionType | 'authorize'
  data?: IResponseDocuments[] | null
}) => {
  const MAX_FILE_SIZE_MB = 5

  // imports
  const { downloadFile } = useUtils()

  const { showAlert } = useAlert()

  const { data_documents_form } = storeToRefs(useAssignmentBuyerStore('v1'))

  const { _setDataDocumentsTab } = useAssignmentBuyerStore('v1')

  // refs
  const attachDocumentRef = ref()
  const alertModalRef = ref()
  const selectedFileToDelete = ref<IFileTableRecordTransfer | null>(null)
  const models = ref<{
    documents: IFileTableRecordTransfer[]
  }>({
    documents: [],
  })

  // props
  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione los archivos para subir',
    multiple: true,
    bordered: false,
    accept: '.pdf, .tiff',
  }

  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'center',
        field: 'name',
        sortable: true,
      },
      {
        name: 'created_at',
        required: false,
        label: 'Fecha de cargue',
        align: 'center',
        field: 'created_at',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado de cargue',
        align: 'center',
        field: 'status_id',
        sortable: true,
        style: {
          'max-width': '300px',
          'min-width': '300px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    pages: { currentPage: ref(1), lastPage: ref(1) },
    rows: [] as IFileTableRecordTransfer[],
  })

  const addedFiles = async (files: IUploadedFile[]) => {
    files.forEach((element) => {
      const newFileSizeMB = element.size / (1024 * 1024)
      if (isFileTooLarge(newFileSizeMB)) {
        handleLargeFile()
        return
      }
      const auxFile = handleFileObjectToUrlConversion(element as never)
      models.value.documents.push({
        is_new: false,
        url: auxFile,
        name: element.name,
        size: element.size,
        type: element.type,
      })
    })
  }

  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const handleLargeFile = () => {
    showAlert('¡El archivo supera el tamaño máximo permitido (5mb)!', 'error')
    deleteFiles()
  }

  const rejectedFiles = (fileRejected: QRejectedEntry[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    deleteFiles()
  }

  const deleteFiles = () => {
    models.value.documents = []
    attachDocumentRef.value?.removeFilesRemote()
  }

  const _deleteFileManual = (row: IFileTableRecordTransfer) => {
    const index = models.value.documents.findIndex(
      (f) => f.name === row.name && f.size === row.size
    )

    if (index !== -1) {
      models.value.documents.splice(index, 1)
    }
  }

  const openDeleteModal = async (row: IFileTableRecordTransfer) => {
    selectedFileToDelete.value = row
    await alertModalRef.value.openModal()
  }

  const confirmDeleteFile = async () => {
    if (selectedFileToDelete.value) {
      _deleteFileManual(selectedFileToDelete.value)
      selectedFileToDelete.value = null
    }
    await alertModalRef.value.closeModal()
  }

  const downloadFileS3 = async (row: IFileTableRecordTransfer) => {
    await downloadFile(row.url, row.name)
  }

  const handlerActionForm = async (action: ActionType | 'authorize') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: await _setModelValue,
      edit: data_documents_form.value.length
        ? await _setModelValue
        : await _setEditValue,
      view: await _setEditValue,
      authorize: await _setEditValue,
    }
    actionHandlers[action]?.()
  }

  const _setModelValue = () => {
    const data_value = data_documents_form.value
    if (data_value) {
      models.value.documents = data_value.map((item) => ({
        url: handleFileObjectToUrlConversion(item),
        name: item.name,
        size: item.size,
      }))
    }
  }

  const _setEditValue = () => {
    const data_value = props.data

    if (data_value) {
      models.value.documents = data_value.map((item) => ({
        id: item.id,
        is_new: true,
        url: item.s3_file_path ?? '',
        name: item.original_name ?? '',
        created_at: item.created_at ?? '',
      }))
    }
  }

  onMounted(() => {
    models.value.documents = []
    handlerActionForm(props.action)
  })

  // watch
  watch(
    () => models.value.documents,
    async () => {
      tableProps.value.rows = models.value.documents.map((item) => ({
        id: item.id,
        is_new: item.is_new ?? false,
        name: item.name,
        created_at: item.created_at ?? '',
        status_id: 29,
        url: item.url,
        size: item.size,
      }))

      if (!models.value.documents.length) {
        attachDocumentRef.value?.removeFilesRemote()
        _setDataDocumentsTab([])
        return
      }

      const filesData = await Promise.all(
        models.value.documents.map(async (item) => {
          if (!item.url || !item.name) return undefined
          return await downloadFile(item.url, item.name, null, true)
        })
      )

      const cleanedFiles: File[] = filesData.filter(
        (file): file is File => file !== undefined
      )

      _setDataDocumentsTab(cleanedFiles)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    () => {
      handlerActionForm(props.action)
    },
    { deep: true }
  )

  return {
    uploadProps,
    attachDocumentRef,
    models,
    tableProps,
    alertModalRef,

    addedFiles,
    rejectedFiles,
    deleteFiles,
    openDeleteModal,
    confirmDeleteFile,
    downloadFileS3,
  }
}
export default useDocumentsForm
