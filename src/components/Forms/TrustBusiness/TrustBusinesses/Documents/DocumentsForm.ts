import {
  IDocumentRow,
  ITrustBusinessDocumentsForm,
  ITrustBusinessResponse,
  IUploadedDocumentFile,
} from '@/interfaces/customs'
import { IFileField, IUploadedFile } from '@/interfaces/global'
import { QTable, QRejectedEntry } from 'quasar'
import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAlert, useUtils, useMainLoader } from '@/composables'
import { useTrustBusinessStore } from '@/stores'

const useDocumentsForm = (props: any) => {
  const { _setDataDocumentsForm } = useTrustBusinessStore('v1')
  const { data_documents_form, business_type } = storeToRefs(
    useTrustBusinessStore('v1')
  )

  const { showAlert } = useAlert()
  const { downloadFile, getMaxId } = useUtils()
  const { openMainLoader } = useMainLoader()

  const formElementRef = ref()
  const attachDocumentRef = ref()

  const initialModelsValues: ITrustBusinessDocumentsForm = {
    documentFiles: [],
    uploadedDocumentFiles: [],
    documentIdsToDelete: [],
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })
  const isSociety = computed(() => business_type.value === 'Sociedad' || false)

  const MAX_FILE_SIZE_MB = 5
  const MAX_FILE_COUNT = 5

  const uploadProps = {
    title: 'Seleccione archivo PDF',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: true,
    bordered: false,
    accept: 'application/pdf',
    classNameTitle: 'text-weight-medium text-grey-6 q-mb-xs',
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
    rows: [] as IDocumentRow[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const mapToDocumentRow = (
    file: IUploadedDocumentFile | IFileField
  ): IDocumentRow => {
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
        type: file.document_type,
        filePath: file.s3_file_path,
        isNew: false,
        raw: file,
      }
    }
  }

  const unifiedTableRows = computed<IDocumentRow[]>(() => {
    return [
      ...models.value.uploadedDocumentFiles.map(mapToDocumentRow),
      ...models.value.documentFiles.map(mapToDocumentRow),
    ]
  })

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_documents_form.value ? _setValueModel : setForm,
      view: setForm,
    }
    actionHandlers[action]?.()
  }

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const setForm = () => {
    clearForm()
    const data: ITrustBusinessResponse = props.data
    if (!data) return

    const { files } = data
    models.value.uploadedDocumentFiles = files ?? []
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

  const removeFile = (fileId: number | string, isNew: boolean) => {
    const fileArray = isNew
      ? models.value.documentFiles
      : models.value.uploadedDocumentFiles

    const index = fileArray.findIndex((file) => file.id === fileId)

    if (index === -1) {
      showAlert('¡El archivo no se encontró en la lista!', 'error')
      return
    }

    fileArray.splice(index, 1)

    if (isNew) {
      attachDocumentRef.value?.removeFilesRemote()
    } else {
      models.value.documentIdsToDelete.push(fileId.toString())
    }
  }

  const viewFile = async (file: IDocumentRow) => {
    const { filePath, name } = file
    if (!filePath) return

    openMainLoader(true)
    await downloadFile(filePath, name)
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
      if (isEmpty(models.value)) {
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
    isSociety,
    uploadProps,
    tableProps,
    addedFiles,
    rejectedFiles,
    removeFile,
    viewFile,
  }
}

export default useDocumentsForm
