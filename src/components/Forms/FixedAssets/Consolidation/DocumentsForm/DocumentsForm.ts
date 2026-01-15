// vue -  pinia - quasar
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QRejectedEntry } from 'quasar'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { IFileTableRecordTransfer } from '@/interfaces/customs/trust-business/RecordTransfers'
import { IUploadedFile } from '@/interfaces/global/File'
import {
  IConsolidationDocumentsForm,
  IFileConsolidation,
  IvoucherDoc,
} from '@/interfaces/customs/fixed-assets/v1/Consolidation'

import { IBaseTableProps } from '@/interfaces/global/Table'

// composables
import { useAlert } from '@/composables/useAlert'
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// stores
import { useRecordTransfersStore } from '@/stores/trust-business/record-transfers/index'

const useDocumentsForm = (props: {
  action: ActionType
  data?: IConsolidationDocumentsForm[] | null
}) => {
  const MAX_FILE_SIZE_MB = 5

  // imports
  const { handleFileObjectToUrlConversion, downloadFile } = useUtils()
  const { showAlert } = useAlert()
  const { data_documents_form } = storeToRefs(useRecordTransfersStore('v1'))
  const { _setIdToDelete } = useRecordTransfersStore('v1')

  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // refs
  const attachDocumentRef = ref()
  const models = ref<{
    documents: IFileConsolidation[]
  }>({
    documents: [],
  })

  const voucher = ref<IvoucherDoc>({
    voucher_id: null,
    voucher: null,
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

  const tableProps = ref<IBaseTableProps<IFileTableRecordTransfer>>({
    loading: false,
    wrapCells: true,
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
        style: `
          max-width: 300px;
          min-width: 300px;
          word-wrap: break-word;
          white-space: break-spaces;
        `,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
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
        document_type: null,
        field_name: null,
        upload_date: null,
        to_delete: false,
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

  const deleteFileManual = (row: IFileConsolidation) => {
    attachDocumentRef.value?.removeSingleFile(row.name, row.size)

    const index = models.value.documents.findIndex(
      (f) => f.name === row.name && f.size === row.size
    )

    if (index !== -1) {
      models.value.documents.splice(index, 1)
    }

    if (row.id && row.is_new) _setIdToDelete([row.id])
  }

  const downloadFileS3 = async (row: IFileConsolidation) => {
    if (!row.url) return

    const fileName = `${row.name}.${row.type || 'pdf'}`

    await downloadFile(row.url, fileName)
  }

  const handlerActionForm = (
    action: 'create' | 'edit' | 'view' | 'authorize'
  ) => {
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
    if (data_value && Array.isArray(data_value) && data_value.length > 0) {
      models.value.documents = data_value.map((item) => ({
        url: handleFileObjectToUrlConversion(item),
        name: item.name,
        size: item.size,
        document_type: null,
        field_name: null,
        upload_date: null,
        to_delete: false,
      }))
    }
  }

  const _setEditValue = () => {
    const data_value = props.data

    if (!data_value || !Array.isArray(data_value) || data_value.length === 0) {
      return
    }

    const validDocuments = data_value
      .filter((item) => {
        const isValid =
          item &&
          (item.original_name ||
            item.file_path ||
            item.name ||
            item.s3_file_path)

        return isValid
      })
      .map(
        (item): IFileConsolidation => ({
          id: item.id,
          is_new: item.is_new ?? true,
          url: item.file_path || item.s3_file_path || '',
          name: item.original_name || item.name || 'Documento sin nombre',
          size: item.file_size || 0,
          type: item.document_type || 'application/pdf',
          file: item.file,
          status_id: item.validation_status_id || 29,
          document_type: item.document_type || null,
          field_name: item.field_name || null,
          upload_date: item.upload_date || item.created_at || null,
          to_delete: false,
        })
      )

    if (validDocuments.length > 0) {
      models.value.documents = validDocuments
    }
  }

  const validateForm = (): boolean => {
    const validDocuments = models.value.documents.filter(
      (doc) =>
        doc.name && doc.name.trim() !== '' && doc.url && doc.url.trim() !== ''
    )
    const hasDocuments = validDocuments.length > 0
    return hasDocuments
  }

  const handleViewComprobante = (
    voucher_id: number | string | null | undefined
  ) => {
    if (voucher_id == null) return

    openMainLoader(true)

    goToURL('AccountingReceiptView', voucher_id)

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
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

  // Watch consolidado para actualizar la tabla
  watch(
    () => models.value.documents,
    (docs) => {
      if (!docs || docs.length === 0) return

      tableProps.value.rows = docs.map((item) => ({
        id: item.id,
        is_new: item.is_new ?? false,
        name: item.name,
        status_id: item.status_id || 29,
        url: item.url,
        size: item.size,
        file: item.file,
      }))
    },
    { deep: true }
  )

  // Watch para detectar cambios en props.data
  watch(
    () => props.data,
    (newData) => {
      if (newData) {
        handlerActionForm(props.action)
      }
    },
    { immediate: true, deep: true }
  )

  return {
    uploadProps,
    attachDocumentRef,
    models,
    voucher,
    tableProps,
    defaultIconsLucide,
    handleViewComprobante,
    validateForm,
    addedFiles,
    rejectedFiles,
    deleteFiles,
    deleteFileManual,
    downloadFileS3,
  }
}

export default useDocumentsForm
