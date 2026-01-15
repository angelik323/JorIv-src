// pinia - vue - quasar
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QRejectedEntry, QTable } from 'quasar'

// stores
import { useRecordTransfersStore } from '@/stores'

// interfaces
import {
  IFileTableRecordTransfer,
  IResponseDocuments,
} from '@/interfaces/customs'
import { IUploadedFile } from '@/interfaces/global'

// utils
import { handleFileObjectToUrlConversion, urlToFile } from '@/utils'

// composables
import { useAlert, useUtils } from '@/composables'

const useDocumentsForm = (props: {
  action: 'create' | 'edit' | 'view' | 'authorize'
  data?: IResponseDocuments[] | null
}) => {
  const MAX_FILE_SIZE_MB = 5

  // imports
  const { downloadFile } = useUtils()

  const { showAlert } = useAlert()

  const { data_documents_form } = storeToRefs(useRecordTransfersStore('v1'))

  const { _setDataDocumentsTab, _setIdToDelete } = useRecordTransfersStore('v1')

  // refs
  const attachDocumentRef = ref()
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
  }

  const rejectedFiles = (fileRejected: QRejectedEntry[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
  }

  const deleteFiles = () => {
    models.value.documents = []

    const ids_to_delete: number[] = tableProps.value.rows
      .filter((item) => item.is_new && typeof item.id === 'number')
      .map((item) => item.id as number)

    tableProps.value.rows = []
    if (ids_to_delete.length) _setIdToDelete(ids_to_delete)
  }

  const deleteFileManual = (row: IFileTableRecordTransfer) => {
    attachDocumentRef.value?.removeSingleFile(row.name, row.size)

    const index = models.value.documents.findIndex(
      (f) => f.name === row.name && f.size === row.size
    )

    if (index !== -1) {
      models.value.documents.splice(index, 1)
    }

    if (row.id && row.is_new) _setIdToDelete([row.id])
  }

  const downloadFileS3 = (row: IFileTableRecordTransfer) => {
    downloadFile(row.url, row.name)
  }

  const handlerActionForm = (
    action: 'create' | 'edit' | 'view' | 'authorize'
  ) => {
    clearForm()
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: _setEditValue,
      view: _setEditValue,
      authorize: _setEditValue,
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
        url: item.path,
        name: item.name,
      }))
    }
  }

  onMounted(() => {
    handlerActionForm(props.action)
  })

  onUnmounted(() => {
    clearForm()
  })

  const clearForm = () => {
    attachDocumentRef.value?.removeFilesRemote()
    models.value.documents = []
    tableProps.value.rows = []
  }

  // watch
  watch(
    () => models.value.documents,
    () => {
      tableProps.value.rows = models.value.documents.map((item) => ({
        id: item.id,
        is_new: item.is_new ?? false,
        name: item.name,
        status_id: 29,
        url: item.url,
        size: item.size,
      }))
    },
    { deep: true, immediate: true }
  )

  watch(
    () => props.data,
    () => {
      handlerActionForm(props.action)
    },
    { immediate: true }
  )

  watch(
    () => models.value.documents,
    async () => {
      if (models.value.documents.length === 0) {
        _setDataDocumentsTab([])
      } else {
        const filesData = await Promise.all(
          models.value.documents.map(async (item) => {
            if (!item.url || !item.name) return undefined
            if (item.is_new) return undefined
            return await urlToFile(
              item.url,
              item.name,
              item.type || 'application/pdf'
            )
          })
        )
        const cleanedFiles: File[] = filesData.filter(
          (file): file is File => file !== undefined
        )
        _setDataDocumentsTab(cleanedFiles)
      }
    },
    { deep: true }
  )

  return {
    uploadProps,
    attachDocumentRef,
    models,
    tableProps,

    addedFiles,
    rejectedFiles,
    deleteFiles,
    deleteFileManual,
    downloadFileS3,
  }
}
export default useDocumentsForm
