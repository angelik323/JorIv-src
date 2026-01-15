// pinia - vue - quasar
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QRejectedEntry, QTable } from 'quasar'

// stores
import {
  useDocumentAssignmentStore,
  useResourceManagerStore,
  useTrustBusinessResourceStore,
} from '@/stores'

// interfaces
import {
  IDocumentAssignmentFormData,
  IDocumentAssignmentResponse,
  IFileTableRecordTransfer,
} from '@/interfaces/customs'
import { ActionType, IUploadedFile } from '@/interfaces/global'

// composables
import { useAlert, useUtils, useMainLoader } from '@/composables'
import {
  handleFileObjectToUrlConversion,
  isEmptyOrZero,
  urlToFile,
} from '@/utils'
const { downloadFile } = useUtils()

const useInformationForm = (props: {
  action: ActionType
  data?: IDocumentAssignmentResponse | null
}) => {
  const MAX_FILE_SIZE_MB = 5

  const { _getResources } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()

  const {
    _setDataInformationForm,
    _getlistOfDocumentCharacteristics,
    _setDataDocuments,
    _setIdToDelete,
  } = useDocumentAssignmentStore('v1')

  const { document_with_characteristics, data_information_form } = storeToRefs(
    useDocumentAssignmentStore('v1')
  )

  const { business_trusts, document_types, document_structures } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { showAlert } = useAlert()

  const formInformation = ref()
  const models = ref<IDocumentAssignmentResponse>({
    id: undefined,
    business_id: null,
    document_type_id: null,
    related_items: null,
    name: undefined,
    documents: [],
    date: undefined,
    upload_date: useUtils().formatDate('', 'YYYY-MM-DD'),
    state_id: undefined,
    business_trust_id: undefined,
    document_type: undefined,
  })

  const initialCharacteristics = ref<string>('')
  const initialDocumentId = ref<number | null>(null)
  const isInitialStateCaptured = ref(false)

  // table
  const tableProps = ref({
    title: 'Listado de características de documento',
    loading: false,
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
        name: 'characteristic',
        required: true,
        label: 'Características',
        align: 'left',
        field: (row: IDocumentAssignmentFormData) =>
          row.business_trust_document_structure.is_obligatory
            ? `${row.business_trust_document_structure.description} *`
            : row.business_trust_document_structure.description,
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Información detalle',
        align: 'left',
        field: 'value',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as (IDocumentAssignmentFormData & { is_new?: boolean })[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // upload file
  const attachDocumentRef = ref()

  const uploadProps = {
    title: 'Cargar archivos',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: false,
    bordered: false,
    accept: 'application/pdf',
    classNameTitle: 'text-weight-medium text-grey-6 q-mb-xs',
  }

  const addedFiles = async (files: IUploadedFile[]) => {
    files.forEach((element) => {
      const newFileSizeMB = element.size / (1024 * 1024)
      if (isFileTooLarge(newFileSizeMB)) {
        handleLargeFile()
        return
      }
      const auxFile = handleFileObjectToUrlConversion(element as never)
      models.value.documents?.push({
        is_new: false,
        url: auxFile,
        name: element.name,
        size: element.size,
      })
    })
  }
  const handleLargeFile = () => {
    showAlert('¡El archivo supera el tamaño máximo permitido (5mb)!', 'error')
  }

  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el documento?',
    row: null as IFileTableRecordTransfer | null,
  })

  const handleOptions = async (
    option: string,
    row: IFileTableRecordTransfer
  ) => {
    switch (option) {
      case 'download':
        downloadFileS3(row)
        break
      case 'delete':
        if (row && props.action !== 'create') {
          alertModalConfig.value.row = row
          await alertModalRef.value.openModal()
        } else {
          deleteFileManual(row)
        }
        break
      default:
        break
    }
  }

  const deleteDocumentSupport = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value) return

    if (alertModalConfig.value.row) {
      deleteFileManual(alertModalConfig.value.row)
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 500)
  }

  const deleteFileManual = (row: IFileTableRecordTransfer) => {
    attachDocumentRef.value?.removeSingleFile(row.name, row.size)

    const index = models.value.documents?.findIndex(
      (f) => f.name === row.name && f.url === row.url
    )

    if (index !== -1) {
      models.value.documents?.splice(index!, 1)
    }

    if (row.id && row.is_new) _setIdToDelete([row.id])
    showAlert('¡Documento eliminado exitosamente!', 'success')
  }

  const rejectedFiles = (fileRejected: QRejectedEntry[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      return showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      return showAlert('¡Este archivo ya ha sido añadido!', 'error')
  }

  const removeFile = () => {
    attachDocumentRef.value?.removeFilesRemote()
    models.value.file = undefined
    tablePropsUpload.value.rows = []
  }

  const downloadFileS3 = (row: IFileTableRecordTransfer) => {
    downloadFile(row.url, row.name)
  }

  // table upload
  const tablePropsUpload = ref({
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
        field: 'file_name',
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
        name: 'created_at',
        required: false,
        label: 'Fecha de carga',
        align: 'center',
        field: (row: IFileTableRecordTransfer) =>
          useUtils().formatDate(row.created_at ?? '', 'YYYY-MM-DD'),
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
    rows: [] as IFileTableRecordTransfer[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // actions
  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: _setFormEdit,
      view: _setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const _setFormEdit = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.business_id = `${data.business?.business_code} - ${data.business?.name}`
      models.value.document_type_trust = `${data.document_type?.document_code} - ${data.document_type?.description}`

      models.value.date = useUtils().formatDate(
        data.created_at ?? '',
        'YYYY-MM-DD'
      )
      models.value.upload_date = useUtils().formatDate(
        data.updated_at ?? '',
        'YYYY-MM-DD'
      )
      models.value.id = data.id ?? undefined
      models.value.document_type_id = data.document_type?.id ?? null

      const characteristics =
        data.characteristics?.map((item) => ({
          id: item.id ?? 0,
          structure_id: item.structure?.id ?? 0,
          characteristic: item.characteristic,
          value: String(item.value ?? ''),
          document_structure_id: item.id ?? 0,
          business_trust_document_structure: {
            description: item.characteristic ?? '',
            type: item.structure?.type ?? '',
          },
        })) ?? []

      tableProps.value.rows = characteristics

      if (!isInitialStateCaptured.value) {
        setTimeout(() => {
          initialCharacteristics.value = JSON.stringify(
            characteristics.map((row) => ({
              id: row.id,
              value: row.value,
            }))
          )
          initialDocumentId.value = data.files?.id ?? null
          isInitialStateCaptured.value = true
        }, 100)
      }

      tablePropsUpload.value.rows =
        data.documents?.map((item) => ({
          id: item.id,
          is_new: false,
          name: '',
          status_id: 29,
          url: ',',
          size: undefined,
          created_at: item.created_at,
        })) ?? []

      models.value.related_items = characteristics
      models.value.business_trust_id = data.business?.id
      models.value.files = {
        id: data.files?.id ?? 0,
        original_name: data.files?.original_name ?? '',
        is_validated: data.files?.is_validated ?? false,
        created_at: data.files?.created_at ?? '',
        s3_file_path: data.files?.s3_file_path ?? '',
      }
      models.value.documents = [
        {
          id: data.files?.id ?? 0,
          is_new: false,
          url: data.files?.s3_file_path ?? '',
          name: data.files?.original_name ?? '',
          size: undefined,
          created_at: data.created_at,
        },
      ]
    }
  }

  const _setModelValue = () => {
    clearForm()

    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  const clearForm = async () => {
    models.value.id = undefined
    models.value.business_id = null
    models.value.document_type_id = null
    models.value.related_items = undefined
    models.value.file = undefined
  }

  const updatePage = async (businessTrustDocumentType: number) => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getlistOfDocumentCharacteristics(businessTrustDocumentType)
    tableProps.value.loading = false
  }

  onMounted(() => {
    handlerActionForm(props.action)
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  // watch
  watch(
    () => props.data,
    () => {
      handlerActionForm(props.action)
    },
    { immediate: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({
          ...models.value,
        })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.business_id,
    (val) => {
      if (val && !['view'].includes(props.action)) {
        models.value.document_type_id = null
        const keys = {
          trust_business: [
            `document_types&business_trust_id=${val}`,
            `document_structures&business_trust_id=${val}`,
          ],
        }
        _getResources(keys)
      }
    }
  )

  watch(
    () => tablePropsUpload.value.rows,
    async () => {
      const filesData = await Promise.all(
        models.value.documents!.map(async (item) => {
          if (!item.url || !item.name) return undefined
          if (item.is_new) return undefined
          return await urlToFile(
            item.url,
            item.name,
            ['pdf', 'PDF'].includes(item.name)
              ? 'application/pdf'
              : 'image/tiff'
          )
        })
      )

      const cleanedFiles: File[] = filesData.filter(
        (file): file is File => file !== undefined
      )
      _setDataDocuments(cleanedFiles)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => document_with_characteristics.value,
    () => {
      tableProps.value.rows = document_with_characteristics.value
    }
  )

  watch(
    () => tableProps.value.rows,
    () => {
      if (props.action === 'create') {
        models.value.related_items = tableProps.value.rows.map((row) => ({
          characteristic:
            row.business_trust_document_structure.description ?? '',
          value: row.value,
          structure_id: row.document_structure_id,
        }))
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.documents,
    () => {
      tablePropsUpload.value.rows = models.value.documents!.map(
        (item, index) => ({
          id: item.id ?? index + 1,
          is_new: item.is_new ?? false,
          name: item.name,
          status_id: 29,
          url: item.url,
          size: item.size,
          created_at: item.created_at,
        })
      )
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.document_type_id,
    (documentId) => {
      if (!documentId) return
      if (props.action === 'create') {
        const selectedStructure = document_types.value.find(
          ({ id }) => id === documentId
        )
        models.value.date = selectedStructure?.created_at
          ? useUtils().formatDate(selectedStructure.created_at, 'YYYY-MM-DD')
          : undefined
      }
    }
  )

  watch(
    () => models.value.document_type_id,
    (val) => {
      if (val && !['view'].includes(props.action)) {
        tableProps.value.loading = true
        tableProps.value.rows = []
        updatePage(Number(val))
      }
    }
  )

  const hasChanges = computed(() => {
    if (props.action !== 'edit') {
      return false
    }

    const currentCharacteristics = JSON.stringify(
      tableProps.value.rows.map((row) => ({
        id: row.id,
        value: row.value,
      }))
    )
    const currentDocumentId = models.value.documents?.[0]?.id ?? null

    if (!initialCharacteristics.value) {
      return false
    }

    const characteristicsChanged =
      currentCharacteristics !== initialCharacteristics.value
    const documentChanged = currentDocumentId !== initialDocumentId.value

    return characteristicsChanged || documentChanged
  })

  return {
    formInformation,
    models,
    business_trusts,
    document_types,
    document_structures,
    tableProps,
    attachDocumentRef,
    uploadProps,
    tablePropsUpload,
    alertModalConfig,
    alertModalRef,
    hasChanges,
    handlerActionForm,
    addedFiles,
    rejectedFiles,
    removeFile,
    downloadFileS3,
    updatePage,
    deleteFileManual,
    handleOptions,
    deleteDocumentSupport,
  }
}
export default useInformationForm
