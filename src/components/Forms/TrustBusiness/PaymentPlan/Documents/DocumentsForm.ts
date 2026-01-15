import {
  IPaymentPlanDocumentRow,
  IPaymentPlanDocumentsForm,
  IPaymentPlanResponse,
  IPaymentPlanAttachment,
} from '@/interfaces/customs'
import { ActionType, IFileField, IUploadedFile } from '@/interfaces/global'
import { QTable, QRejectedEntry } from 'quasar'
import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAlert, useUtils, useMainLoader } from '@/composables'
import { TIMEOUTS } from '@/constants/alerts'
import { usePaymentPlanStore } from '@/stores'

const useDocumentsForm = (props: {
  action: ActionType
  data?: IPaymentPlanResponse | null
}) => {
  const { _setDataDocumentsForm, _deletePaymentPlanFile } =
    usePaymentPlanStore('v1')
  const { data_documents_form } = storeToRefs(usePaymentPlanStore('v1'))

  const { showAlert } = useAlert()
  const { downloadFile, getMaxId, isEmptyOrZero } = useUtils()
  const { openMainLoader } = useMainLoader()

  const formElementRef = ref()
  const attachDocumentRef = ref()

  const initialModelsValues: IPaymentPlanDocumentsForm = {
    documentFiles: [],
    uploadedDocumentFiles: [],
    documentIdsToDelete: [],
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const MAX_FILE_SIZE_MB = 5
  const MAX_FILE_COUNT = 5

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: true,
    bordered: false,
    accept: '.xlsx, .pdf',
    classNameTitle: 'text-weight-medium text-grey-6 q-mb-xs',
  }

  const tableProps = ref({
    title: 'Documentos de amortización',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: false,
      },
      {
        name: 'item',
        required: false,
        label: 'Item',
        align: 'left',
        field: 'id',
        sortable: false,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: (row) => row.name ?? 'Error',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IPaymentPlanDocumentRow[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const mapToDocumentRow = (
    file: IPaymentPlanAttachment | IFileField
  ): IPaymentPlanDocumentRow => {
    if ('file' in file) {
      return {
        id: file.id,
        name: file.description || file.file.name,
        type: file.file.type,
        filePath: '',
        isNew: true,
        raw: file,
      }
    } else {
      return {
        id: file.id,
        name: file.original_name,
        filePath: file.s3_file_path,
        isNew: false,
        raw: file,
      }
    }
  }

  const unifiedTableRows = computed<IPaymentPlanDocumentRow[]>(() => {
    return [
      ...models.value.uploadedDocumentFiles.map(mapToDocumentRow),
      ...models.value.documentFiles.map(mapToDocumentRow),
    ]
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_documents_form.value ? _setValueModel : setForm,
      view: setForm,
    }
    actionHandlers[action]?.()
  }

  const setForm = () => {
    clearForm()

    if (!props.data) return
    const data: IPaymentPlanResponse = props.data

    const { attachments } = data
    models.value.uploadedDocumentFiles = attachments ?? []
  }

  const _setValueModel = () => {
    if (!data_documents_form.value) return

    const { documentFiles, uploadedDocumentFiles, documentIdsToDelete } =
      data_documents_form.value

    models.value.documentFiles = documentFiles ?? []
    models.value.uploadedDocumentFiles = uploadedDocumentFiles ?? []
    models.value.documentIdsToDelete = documentIdsToDelete ?? []
  }

  const clearForm = () => {
    models.value = { ...initialModelsValues }
  }

  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const canAddMoreFiles = (): boolean => {
    return models.value.documentFiles.length < MAX_FILE_COUNT
  }

  const handleLargeFile = () => {
    showAlert('¡El archivo supera el tamaño máximo permitido (5mb)!', 'error')
  }

  const addedFiles = (file: IUploadedFile[]) => {
    const newFileSizeMB = file[0].size / (1024 * 1024)

    if (isFileTooLarge(newFileSizeMB)) {
      handleLargeFile()
      return
    }
    if (canAddMoreFiles()) {
      addNewFile(file[0])
    } else {
      showAlert('¡Solo se pueden adjuntar 5 archivos!', 'error')
      attachDocumentRef.value?.removeFilesRemote()
    }
  }

  const addNewFile = async (file: IUploadedFile) => {
    const newFile: IFileField = {
      id: (getMaxId(unifiedTableRows.value) + 1).toString(),
      description: file.name,
      file: file,
    }

    models.value.documentFiles.push(newFile)
  }

  const rejectedFiles = (fileRejected: QRejectedEntry[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
  }

  const deleteModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Desea eliminar el documento?',
    entityId: null as number | null,
    isNew: null as boolean | null,
  })

  const openModalDelete = async (row: IPaymentPlanDocumentRow) => {
    alertModalConfig.value.entityId = Number(row.id) || null
    alertModalConfig.value.isNew = row.isNew || null
    deleteModalRef.value.openModal()
  }

  const handleDeletePaymentFile = async () => {
    const fileId = alertModalConfig.value.entityId
    if (!fileId) return

    deleteModalRef.value.closeModal()
    const isNew = alertModalConfig.value.isNew

    if (isNew) {
      models.value.documentFiles = (models.value.documentFiles ?? []).filter(
        (item) => item.id !== fileId.toString()
      )
      attachDocumentRef.value?.removeFilesRemote()

      showAlert(
        'Registro eliminado exitosamente',
        'success',
        undefined,
        TIMEOUTS.SEC_5
      )
    } else {
      openMainLoader(true)
      const success = await _deletePaymentPlanFile(fileId)

      if (success) {
        models.value.uploadedDocumentFiles = (
          models.value.uploadedDocumentFiles ?? []
        ).filter((item) => item.id !== fileId)
      }
      openMainLoader(false)
    }
  }

  const viewFile = async (file: IPaymentPlanDocumentRow) => {
    const { filePath, name, isNew, raw } = file
    openMainLoader(true)

    const utils = useUtils()

    if (!isNew && filePath) {
      await downloadFile(filePath, name)
      openMainLoader(false)
      return
    }

    if (isNew && raw && 'file' in raw) {
      const blob = raw.file as unknown as File
      const fileName = blob.name
      utils.downloadBlobXlxx(blob, fileName)
      openMainLoader(false)
      return
    }

    openMainLoader(false)
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataDocumentsForm(null)
      } else {
        _setDataDocumentsForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    unifiedTableRows,
    (val) => {
      if (!Array.isArray(val) || val.length === 0) {
        tableProps.value.rows = []
        return
      }

      tableProps.value.rows = val
    },
    { immediate: true }
  )

  return {
    formElementRef,
    attachDocumentRef,
    models,
    uploadProps,
    tableProps,
    deleteModalRef,
    alertModalConfig,
    addedFiles,
    rejectedFiles,
    viewFile,
    openModalDelete,
    handleDeletePaymentFile,
  }
}

export default useDocumentsForm
