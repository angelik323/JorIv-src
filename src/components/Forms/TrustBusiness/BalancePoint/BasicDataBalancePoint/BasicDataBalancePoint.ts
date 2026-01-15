import { useAlert, useMainLoader, useUtils } from '@/composables'
import {
  IBalancePointBasicDataForm,
  IBalancePointCharacteristicsDetails,
  IBalancePointDocumentRow,
  ITrustBusinessDocumentsForm,
  IUploadedDocumentFile,
} from '@/interfaces/customs'
import { ActionType, IFileField, IUploadedFile } from '@/interfaces/global'
import {
  useBalancePointStore,
  useResourceManagerStore,
  useTrustBusinessResourceStore,
} from '@/stores'
import { isEmptyOrZero } from '@/utils'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { QRejectedEntry, QTable } from 'quasar'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const useBasicDataBalancePointForm = (props: { action: ActionType }) => {
  const basicDataFormRef = ref()
  const { openMainLoader } = useMainLoader()
  const { downloadFile } = useUtils()

  const { data_documents_form, balance_point_response } = storeToRefs(
    useBalancePointStore('v1')
  )
  const {
    _getCharacteristicDocumentDetailsByID,
    _setDataBasicDataForm,
    _setDataDocumentsForm,
    _setCharacteristicDocumentDetails,
  } = useBalancePointStore('v1')

  const models = ref<IBalancePointBasicDataForm>({
    business_trust_id: null,
    business_status: null,
    project_id: null,
    project_status: '',
    registration_date: moment().format('YYYY-MM-DD'),
    break_even_status: 'Registrado',
    document_code_id: null,
    characteristics: [],
    documents: [],
  })

  const initialModelsValues: ITrustBusinessDocumentsForm = {
    documentFiles: [],
    uploadedDocumentFiles: [],
    documentIdsToDelete: [],
  }

  const documentsAttached = ref<typeof initialModelsValues>({
    ...initialModelsValues,
  })
  const attachDocumentRef = ref()
  const { defaultIconsLucide } = useUtils()

  const {
    equilibrium_points_business_trust,
    equilibrium_points_real_estate_project,
    characteristic_document,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { showAlert } = useAlert()
  const { getMaxId } = useUtils()

  const tableDocumentCharacteristicsProperties = ref({
    title: 'Listado de características de documento',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'characteristics',
        required: true,
        label: 'Características',
        align: 'left',
        field: 'characteristics',
        sortable: true,
      },
      {
        name: 'detail_information',
        required: true,
        label: 'Información detalle',
        align: 'left',
        field: 'detail_information',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as Array<{
      id: number
      characteristics: string
      detail_information: string
    }>,
    wrapCells: true,
  })

  const tableDocumentsProperties = ref({
    title: 'Listado de documentos',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'upload_date',
        required: true,
        label: 'Fecha de carga',
        align: 'left',
        field: 'upload_date',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'left',
      },
    ] as QTable['columns'],
    rows: [] as IBalancePointDocumentRow[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    wrapCells: true,
  })

  const MAX_FILE_SIZE_MB = 5
  const MAX_FILE_COUNT = 5

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: true,
    bordered: false,
    accept: 'application/pdf',
    classNameTitle: 'text-weight-medium text-grey-6 q-mt-md q-mb-xs',
  }

  const mapToDocumentRow = (
    file: IUploadedDocumentFile | IFileField
  ): IBalancePointDocumentRow => {
    if ('file' in file) {
      return {
        id: file.id,
        name: file.description || file.file.name,
        type: file.file.type,
        filePath: '',
        isNew: true,
        raw: file,
        upload_date: moment().format('YYYY-MM-DD'),
        size: file.file.size,
      }
    } else {
      return {
        id: file.id,
        name: file.original_name,
        type: file.document_type,
        filePath: file.s3_file_path,
        isNew: false,
        raw: file,
        upload_date: moment().format('YYYY-MM-DD'),
        size: file.size,
      }
    }
  }

  const unifiedTableRows = computed<IBalancePointDocumentRow[]>(() => {
    return [
      ...documentsAttached.value.uploadedDocumentFiles.map(mapToDocumentRow),
      ...documentsAttached.value.documentFiles.map(mapToDocumentRow),
    ]
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: () => ({}),
      view: () => ({}),
    }
    actionHandlers[action]?.()
  }

  const _setValueModel = () => {
    if (!data_documents_form.value) return

    const { documentFiles, uploadedDocumentFiles, documentIdsToDelete } =
      data_documents_form.value

    documentsAttached.value.documentFiles = documentFiles ?? []
    documentsAttached.value.uploadedDocumentFiles = uploadedDocumentFiles ?? []
    documentsAttached.value.documentIdsToDelete = documentIdsToDelete ?? []
  }

  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const canAddMoreFiles = (): boolean => {
    return documentsAttached.value.documentFiles.length < MAX_FILE_COUNT
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

    documentsAttached.value.documentFiles.push(newFile)
    models.value.documents = unifiedTableRows.value
    tableDocumentsProperties.value.rows = models.value.documents
  }

  const rejectedFiles = (fileRejected: QRejectedEntry[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
  }

  const removeFile = (row: IBalancePointDocumentRow) => {
    const fileArray = row.isNew
      ? documentsAttached.value.documentFiles
      : documentsAttached.value.uploadedDocumentFiles

    // Convertir IDs para comparación consistente
    const rowId = typeof row.id === 'string' ? row.id : row.id.toString()
    const index = fileArray.findIndex((file) => {
      const fileId = typeof file.id === 'string' ? file.id : file.id.toString()
      return fileId === rowId
    })

    if (index === -1) {
      showAlert('¡El archivo no se encontró en la lista!', 'error')
      return
    }

    fileArray.splice(index, 1)
    models.value.documents = unifiedTableRows.value
    tableDocumentsProperties.value.rows = models.value.documents

    attachDocumentRef.value?.removeSingleFile(row.name, row.size)

    if (row.isNew) {
      attachDocumentRef.value?.removeFilesRemote()
    } else {
      documentsAttached.value.documentIdsToDelete.push(row.id.toString())
    }
  }

  const viewFile = async (file: IBalancePointDocumentRow) => {
    const { filePath, name } = file
    if (!filePath) return

    openMainLoader(true)
    await downloadFile(filePath, name)
    openMainLoader(false)
  }

  const handleUpdateBusinessTrust = async (businessId: string) => {
    // Reset form fields that depend on business trust selection
    models.value.business_trust_id = null
    models.value.business_status = ''
    models.value.project_id = null
    models.value.project_status = ''
    models.value.document_code_id = null
    models.value.characteristics = []

    if (!['edit', 'view'].includes(props.action)) {
      documentsAttached.value = { ...initialModelsValues }
    }

    tableDocumentCharacteristicsProperties.value.rows = []
    basicDataFormRef.value?.reset()

    if (!businessId) return

    models.value.business_trust_id = Number(businessId)
    models.value.business_status = String(
      equilibrium_points_business_trust.value.find(
        (item) => item.value === businessId
      )?.status_name ?? '-'
    )

    await _getResources(
      {
        trust_business: ['equilibrium_points_real_estate_project'],
      },
      `filter[business_trust_id]=${businessId}`
    )
    await _getResources(
      {
        trust_business: ['characteristic_document'],
      },
      `filter[business_trust_id]=${businessId}`
    )
    const equilibriumPointFilter =
      props.action === 'edit' && balance_point_response.value?.id
        ? `&filter[equilibrium_point_id]=${balance_point_response.value.id}`
        : ''

    await _getResources(
      {
        trust_business: ['general_order'],
      },
      `filter[business_trust_id]=${businessId}&filter[not_asocied_equilibrium]=true${equilibriumPointFilter}`
    )
  }

  const handleUpdateProject = async (projectId: number) => {
    if (!projectId) return

    models.value.project_id = projectId
    models.value.project_status =
      equilibrium_points_real_estate_project.value.find(
        (item) => item.id === projectId
      )?.status_name ?? '-'

    await _getResources(
      {
        trust_business: ['project_stage'],
      },
      `filter[business_trust_real_estate_project_id]=${projectId}`
    )
  }

  const characteristicDocumentDetails = ref<
    IBalancePointCharacteristicsDetails[]
  >([])

  const handleChangeCharacteristicDocument = async (documentId: number) => {
    models.value.characteristics = []
    tableDocumentCharacteristicsProperties.value.rows = []

    if (!documentId) return

    tableDocumentCharacteristicsProperties.value.loading = true
    models.value.document_code_id = documentId
    characteristicDocumentDetails.value =
      await _getCharacteristicDocumentDetailsByID(documentId)

    // Guardar los detalles de las características en el store para usarlos en Summary
    _setCharacteristicDocumentDetails(characteristicDocumentDetails.value)

    tableDocumentCharacteristicsProperties.value.rows =
      characteristicDocumentDetails.value.map((item) => {
        const name = `${item.business_trust_document_structure.characteristic_code} - ${item.business_trust_document_structure.description}`

        const detailInfo =
          balance_point_response.value?.characteristic_document.find(
            (char) =>
              char.characteristic_detail_id ===
              item.business_trust_document_structure.id
          )

        return {
          id: item.id,
          characteristics: name,
          detail_information: detailInfo?.information_detail || '',
        }
      })

    models.value.characteristics =
      tableDocumentCharacteristicsProperties.value.rows.map((row) => ({
        characteristic_document_detail_id: row.id,
        information_detail: row.detail_information,
      }))
    tableDocumentCharacteristicsProperties.value.loading = false
  }

  const getTypeDataCharacteristics = (index: number) => {
    return characteristicDocumentDetails.value[index]
      .business_trust_document_structure.type_data
  }

  const changeInputCharacteristicDescription = (
    id: number,
    value: string,
    index: number
  ) => {
    const characteristicOnTable =
      tableDocumentCharacteristicsProperties.value.rows[index]
    characteristicOnTable.detail_information = value

    models.value.characteristics[index] = {
      characteristic_document_detail_id: id,
      information_detail: characteristicOnTable.detail_information,
    }
  }

  const keysToReset = {
    trust_business: [
      'equilibrium_points_real_estate_project',
      'characteristic_document',
      'project_stage',
    ],
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onBeforeUnmount(() => {
    _resetKeys(keysToReset)
  })

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataBasicDataForm(null)
      } else {
        _setDataBasicDataForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => documentsAttached.value,
    () => {
      if (isEmptyOrZero(documentsAttached.value)) {
        _setDataDocumentsForm(null)
      } else {
        _setDataDocumentsForm({ ...documentsAttached.value })
      }
    },
    { deep: true }
  )

  watch(
    () => balance_point_response.value,
    (balancePoint) => {
      if (balancePoint) {
        // Mapear los documentos existentes a uploadedDocumentFiles
        documentsAttached.value.uploadedDocumentFiles =
          balancePoint.attachments.map((doc) => ({
            id: doc.id,
            original_name: doc.original_name,
            document_type: 'application/pdf',
            file_path: doc.s3_file_path,
            s3_file_path: doc.s3_file_path,
            uploaded_by_id: 0,
            uploaded_by: {
              id: 0,
              name: '',
              last_name: '',
              document: '',
            },
            size: 0,
          }))

        models.value = {
          business_trust_id: balancePoint.business_trust.id,
          business_status: balancePoint.business_trust.status,
          project_id: balancePoint.project.id,
          project_status: balancePoint.project.status,
          registration_date: '',
          break_even_status: balancePoint.status,
          document_code_id: balancePoint.document.id,
          characteristics: [],
          documents: unifiedTableRows.value,
        }

        tableDocumentsProperties.value.rows = models.value.documents

        handleUpdateBusinessTrust(balancePoint.business_trust.id.toString())
      }
    }
  )

  watch(
    () => balance_point_response.value,
    () => {
      if (['edit', 'view'].includes(props.action)) {
        handleChangeCharacteristicDocument(
          balance_point_response.value?.document.id!
        )
        handleUpdateProject(balance_point_response.value?.project.id!)
      }
    }
  )

  return {
    models,
    basicDataFormRef,
    tableDocumentCharacteristicsProperties,
    uploadProps,
    tableDocumentsProperties,
    defaultIconsLucide,
    equilibrium_points_business_trust,
    equilibrium_points_real_estate_project,
    characteristic_document,
    balance_point_response,
    attachDocumentRef,
    addedFiles,
    rejectedFiles,
    removeFile,
    viewFile,
    handleUpdateBusinessTrust,
    handleUpdateProject,
    handleChangeCharacteristicDocument,
    getTypeDataCharacteristics,
    changeInputCharacteristicDescription,
  }
}

export default useBasicDataBalancePointForm
