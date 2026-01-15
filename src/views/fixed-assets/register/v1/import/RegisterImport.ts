// vue - pinia
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IDocumentsRegister,
  IRegisterFileValidation,
  IRegisterForm
} from '@/interfaces/customs/fixed-assets/v1/Register'
import { IFileTableRecordTransfer } from '@/interfaces/customs/trust-business/RecordTransfers'

// composables - assets
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { handleFileObjectToUrlConversion } from '@/utils'
import { useS3Documents } from '@/composables/useS3Documents'
import excelIcon from '@/assets/images/excel.svg'

// stores
import { useRegisterStore } from '@/stores/fixed-assets/register'

// constants
import { TIMEOUTS } from '@/constants/alerts'

// types
interface IUploadedDocumentMeta {
  id: number
  name: string
}

const useRegisterImport = () => {
  // imports
  const { defaultIconsLucide, getFileExtension } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()

  const { _saveDocumentsS3 } = useS3Documents()

  // principal data store
  const {
    _downloadExcelRegisterTemplate,
    _downloadExcelRegisterErrorsFile,
    _validateRegisterFile,
    _createRegisterBulk,
    _getPresignedUrls
  } = useRegisterStore('v1')
  const { headerPropsDefault } = storeToRefs(useRegisterStore('v1'))

  // breadcrumb
  const headerPropsImport = {
    title: `Importar ${headerPropsDefault.value.title.toLowerCase()}`,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Importar',
          route: 'RegisterImport'
        }
      ]
    ],
    btn: {
      label: 'Descargar plantilla',
      icon: excelIcon,
      color: 'orange',
      class: 'custom',
      textColor: 'black'
    }
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false
    },
    {
      name: 'documents',
      label: 'Documentos',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: true,
      show: true,
      required: false
    }
  ])

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)
  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  // Tab navigation
  const isInformationTab = computed(() => tabActive.value === 'information')
  const isDocumentsTab = computed(() => tabActive.value === 'documents')

  const nextTab = () => {
    const currentIndex = tabs.value.findIndex((tab) => tab.name === tabActive.value)
    if (currentIndex < tabs.value.length - 1) {
      tabActive.value = tabs.value[currentIndex + 1].name
      tabActiveIdx.value = currentIndex + 1
    }
  }

  const backTab = () => {
    const currentIndex = tabs.value.findIndex((tab) => tab.name === tabActive.value)
    if (currentIndex > 0) {
      tabActive.value = tabs.value[currentIndex - 1].name
      tabActiveIdx.value = currentIndex - 1
    }
  }

  const goToDocumentsTab = () => {
    tabActive.value = 'documents'
    tabActiveIdx.value = 1
  }

  // File management
  const showDownloadTemplateBtn = ref(true)
  const handleDownloadTemplate = async (): Promise<void> => {
    openMainLoader(true)
    await _downloadExcelRegisterTemplate()
    openMainLoader(false)
  }

  const files = ref<IFileTableRecordTransfer[]>([])
  const originalFile = ref<File | null>(null)
  const validatingFiles = ref(false)
  const hasDownloadedErrors = ref(false)
  const fileValidationResponse = ref<IRegisterFileValidation | null>(null)
  const batchId = ref<string | null>(null)
  const validatedRows = ref<IRegisterForm[]>([])

  const handleAddFile = async (newFiles: File[]) => {
    if (!newFiles || newFiles.length === 0) return

    const file = newFiles[0]
    originalFile.value = file

    const auxFile = handleFileObjectToUrlConversion(file as never)

    const newFileRecord: IFileTableRecordTransfer = {
      id: 1,
      is_new: false,
      url: auxFile,
      name: file.name,
      status_id: 68,
      size: 0
    }

    files.value = [newFileRecord]
    validatingFiles.value = true

    fileValidationResponse.value = await _validateRegisterFile(file)

    if (!fileValidationResponse.value) {
      files.value[0].status_id = 66
      validatingFiles.value = false
      return
    }

    if (fileValidationResponse.value && files.value.length > 0) {
      batchId.value = fileValidationResponse.value.batch_id || null

      if (validatedRows.value.length > 0) {
        const newValidatedRows = fileValidationResponse.value.validated_rows || []
        validatedRows.value = [...validatedRows.value, ...newValidatedRows]
      } else {
        validatedRows.value = [...(fileValidationResponse.value.validated_rows || [])]
      }

      files.value[0].status_id = fileValidationResponse.value.has_errors ? 66 : 67
      files.value[0].size = fileValidationResponse.value.size as number
      showDownloadTemplateBtn.value = false
    }

    validatingFiles.value = false
  }

  const handleDownloadErrors = async (): Promise<void> => {
    if (!batchId.value) return

    openMainLoader(true)
    await _downloadExcelRegisterErrorsFile(batchId.value)
    hasDownloadedErrors.value = true
    openMainLoader(false)
  }

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-input-update')
    fileInput?.click()
  }

  const handleUpdateFile = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (!target.files || target.files.length === 0) return

    await handleAddFile(Array.from(target.files))
    hasDownloadedErrors.value = false
    target.value = ''
  }

  const handleClearFile = () => {
    files.value = []
    originalFile.value = null
    fileValidationResponse.value = null
    batchId.value = null
    validatedRows.value = []
    hasDownloadedErrors.value = false
    showDownloadTemplateBtn.value = true
    // Reset tab to initial
    tabActive.value = 'information'
    tabActiveIdx.value = 0
  }

  const uploadProps = {
    title: '',
    styleCustom: 'width: 100%;',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: false,
    bordered: false,
    accept: '.xlsx',
    classNameTitle: 'text-weight-medium text-grey-6 q-mb-xs'
  }

  const tableProps = ref<IBaseTableProps<IFileTableRecordTransfer>>({
    title: 'Listado cargue de registros de activos fijos',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        field: 'name',
        sortable: true
      },
      {
        name: 'total_records',
        required: false,
        label: 'Total de registros',
        field: 'size',
        sortable: true
      },
      {
        name: 'status',
        required: false,
        label: 'Estado de cargue',
        field: 'status_id'
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'id'
      }
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0
    }
  })

  // modal management
  const deleteModalRef = ref()
  const confirmModalRef = ref()

  const alertModalConfig = ref({
    type: '' as 'eliminar_archivo' | 'cargo_parcial' | '',
    title: '',
    description: ''
  })

  const openAlertModal = (type: 'eliminar_archivo' | 'cargo_parcial') => {
    alertModalConfig.value.type = type

    if (type === 'eliminar_archivo') {
      alertModalConfig.value.title = '¿Desea eliminar el cargue?'
      alertModalConfig.value.description = ''
      deleteModalRef.value?.openModal()
      return
    }

    if (!fileValidationResponse.value) return

    const hasErrors = fileValidationResponse.value.has_errors
    const hasValidated = fileValidationResponse.value.validated_rows.length > 0

    if (!hasValidated) {
      alertModalConfig.value.title = 'Todo el archivo presentó error'
      alertModalConfig.value.description = 'No se puede cargar'
      confirmModalRef.value?.openModal()
      return
    }

    validatedRows.value = [...fileValidationResponse.value.validated_rows]

    if (!hasErrors && hasValidated) {
      goToDocumentsTab()
      return
    }

    alertModalConfig.value.title = 'El archivo presentó errores'
    alertModalConfig.value.description = '¿Desea procesar parcialmente?'
    confirmModalRef.value?.openModal()
  }

  const handleConfirmModal = () => {
    if (alertModalConfig.value.type === 'cargo_parcial') {
      const hasValidated = validatedRows.value.length > 0
      if (hasValidated) {
        goToDocumentsTab()
      }
    }
    confirmModalRef.value?.closeModal()
  }

  const handleDeleteFile = () => {
    handleClearFile()
    deleteModalRef.value?.closeModal()
  }

  // Documents modal management
  const showDocumentsModal = ref(false)
  const documentsFormRef = ref()
  const currentRowForDocuments = ref<IRegisterForm | null>(null)
  const currentRowIndex = ref<number>(-1)
  const currentModalDocuments = ref<IDocumentsRegister[]>([])
  const initialDocumentsForModal = ref<IDocumentsRegister[]>([])

  const setDocumentsFormData = (data: IDocumentsRegister[]) => {
    currentModalDocuments.value = data
  }

  const openDocumentsModal = (row: IRegisterForm, rowIdx: number) => {
    currentRowForDocuments.value = row
    currentRowIndex.value = rowIdx

    const currentRow = validatedRows.value[rowIdx]
    if (currentRow?.asset_documents && currentRow.asset_documents.length > 0) {
      const existingDocs: IDocumentsRegister[] = currentRow.asset_documents.map((doc) => ({
        id: doc.id,
        name: doc.name
      }))
      initialDocumentsForModal.value = [...existingDocs]
      currentModalDocuments.value = [...existingDocs]
    } else {
      initialDocumentsForModal.value = []
      currentModalDocuments.value = []
    }

    showDocumentsModal.value = true
  }

  const handleDocumentsUpload = async (documents: IDocumentsRegister[]): Promise<number[]> => {
    if (!documents || documents.length === 0) return []

    const newFiles = documents.filter((f) => f.file)
    if (newFiles.length === 0) return []

    const documentsMetadata: IDocumentsRegister[] = newFiles.map((fileField) => ({
      name: fileField.file?.name ?? fileField.name ?? '',
      model_name: 'FIXED_ASSET',
      document_type: getFileExtension(fileField.file?.name ?? ''),
      file_size: fileField.file?.size ?? fileField.size ?? 0
    }))

    const presignedData = await _getPresignedUrls(documentsMetadata)

    if (!presignedData || presignedData.length === 0) {
      showAlert('Error al obtener URLs de carga', 'error')
      return []
    }

    const uploadUrls: string[] = []
    const filesToUpload: File[] = []
    const documentIds: number[] = []

    presignedData.forEach((presigned, index) => {
      const file = newFiles[index].file

      if (!file || !presigned.upload_url || !presigned.document_id) return

      uploadUrls.push(presigned.upload_url)
      filesToUpload.push(file as File)
      documentIds.push(presigned.document_id)
    })

    if (uploadUrls.length > 0 && filesToUpload.length > 0) {
      await _saveDocumentsS3(uploadUrls, filesToUpload, false)
    }

    return documentIds
  }

  const handleSaveDocuments = async () => {
    const isValid = await documentsFormRef.value?.validateForm()

    if (!isValid) {
      return
    }

    const documentsToProcess = [...currentModalDocuments.value]
    const rowIndexToUpdate = currentRowIndex.value

    if (!documentsToProcess || documentsToProcess.length === 0) {
      showAlert('Debe cargar al menos un documento', 'warning')
      return
    }

    if (rowIndexToUpdate === -1 || rowIndexToUpdate >= validatedRows.value.length) {
      showAlert('Error: No se pudo identificar el registro a actualizar', 'error')
      return
    }

    openMainLoader(true)

    const newDocs = documentsToProcess.filter((d) => d.file)
    const existingDocs = documentsToProcess.filter((d) => !d.file && d.id)

    const existingIds = existingDocs.map((d) => d.id as number)
    const existingMeta: IUploadedDocumentMeta[] = existingDocs.map((d) => ({
      id: d.id as number,
      name: d.name || ''
    }))

    let newDocumentIds: number[] = []
    let newDocumentsMeta: IUploadedDocumentMeta[] = []

    if (newDocs.length > 0) {
      newDocumentIds = await handleDocumentsUpload(newDocs)

      if (newDocumentIds.length === 0 && newDocs.length > 0) {
        showAlert('Error al procesar los documentos nuevos', 'error')
        openMainLoader(false)
        return
      }

      newDocumentsMeta = newDocs.map((d, i) => ({
        id: newDocumentIds[i],
        name: d.name || (d.file as File)?.name || ''
      }))
    }

    const allDocumentIds = [...existingIds, ...newDocumentIds]
    const allDocumentsMeta = [...existingMeta, ...newDocumentsMeta]

    validatedRows.value[rowIndexToUpdate] = {
      ...validatedRows.value[rowIndexToUpdate],
      document_ids: [...allDocumentIds],
      asset_documents: allDocumentsMeta.map((meta) => ({
        id: meta.id,
        name: meta.name
      }))
    }

    tablePreviewProps.value.rows = [...validatedRows.value]

    openMainLoader(false)

    showDocumentsModal.value = false
    currentRowIndex.value = -1
    currentRowForDocuments.value = null

    setTimeout(() => {
      currentModalDocuments.value = []
      initialDocumentsForModal.value = []
    }, 0)

    showAlert('Documentos guardados correctamente', 'success', undefined, TIMEOUTS.SEC_3)
  }

  const handleCancelDocuments = () => {
    showDocumentsModal.value = false
    currentRowIndex.value = -1
    currentRowForDocuments.value = null

    setTimeout(() => {
      currentModalDocuments.value = []
      initialDocumentsForModal.value = []
    }, 0)
  }

  // preview table
  const tablePreviewProps = ref<IBaseTableProps<IRegisterForm>>({
    title: 'Importar registro de activos fijos y bienes',
    loading: false,
    columns: [
      {
        name: 'id',
        field: (row) => row.id,
        label: '#',
        sortable: true,
        align: 'left'
      },
      {
        name: 'record_type',
        field: (row) => row.record_type,
        label: 'Tipo de registro',
        sortable: true,
        align: 'left'
      },
      {
        name: 'reference',
        field: (row) => row.reference,
        label: 'Referencia',
        sortable: true,
        align: 'left'
      },
      {
        name: 'configuration_type',
        field: (row) => `${row.configuration_type?.code} - ${row.configuration_type?.description}`,
        label: 'Tipo de bien o activo fijo',
        align: 'left',
        sortable: true
      },
      {
        name: 'configuration_subtype',
        field: (row) =>
          `${row.configuration_subtype?.code} - ${row.configuration_subtype?.description}`,
        label: 'Subtipo de activo fijo/bien',
        align: 'left',
        sortable: true
      },
      {
        name: 'business_trust',
        field: (row) => `${row.business_trust?.business_code} - ${row.business_trust?.name}`,
        label: 'Negocio',
        align: 'left',
        sortable: true
      },
      {
        name: 'purchases',
        field: (row) => row.asset_transaction?.accounts_payable_status,
        label: 'Compras',
        align: 'left',
        sortable: true
      },
      {
        name: 'society',
        field: (row) => row.society,
        label: 'Sociedad',
        align: 'left',
        sortable: true
      },
      {
        name: 'created_at',
        field: (row) => row.created_at,
        label: 'Fecha',
        align: 'left',
        sortable: true
      },
      {
        name: 'chip_code',
        field: (row) => row.chip_code,
        label: 'Número de chip',
        align: 'left',
        sortable: true
      },
      {
        name: 'cadastral_id',
        field: (row) => row.cadastral_id,
        label: 'Número cédula catastral',
        align: 'left',
        sortable: true
      },
      {
        name: 'folio_number',
        field: (row) => row.folio_number,
        label: 'Número de folio',
        align: 'left',
        sortable: true
      },
      {
        name: 'licence_plate',
        field: (row) => row.license_plate,
        label: 'Número de placa',
        align: 'left',
        sortable: true
      },
      {
        name: 'chassis_number',
        field: (row) => row.chassis_number,
        label: 'Número de chasis',
        align: 'left',
        sortable: true
      },
      {
        name: 'responsible',
        field: (row) =>
          row.responsible?.full_name
            ? row.responsible?.full_name
            : row.responsible?.commercial_registration,
        label: 'Responsable del activo',
        align: 'left',
        sortable: true
      },
      {
        name: 'address',
        field: (row) => row.address_history,
        label: 'Ubicación activo fijo o bien',
        align: 'left',
        sortable: true
      },
      {
        name: 'status',
        field: (row) => row.status?.name,
        label: 'Estado',
        align: 'left',
        sortable: true
      },
      {
        name: 'guarantee_percentage',
        field: (row) => row.guarantee_percentage,
        label: 'Porcentaje de garantía',
        align: 'left',
        sortable: true
      },
      {
        name: 'transaction_value',
        field: (row) => row.asset_transaction?.transaction_value,
        label: 'Valor activo fijo o bien',
        align: 'left',
        sortable: true
      },
      {
        name: 'property_tax_date',
        field: (row) => row.property_tax_date,
        label: 'Fecha predial / impuesto',
        align: 'left',
        sortable: true
      },
      {
        name: 'uge',
        field: (row) => row.uge?.description,
        label: 'Uge',
        align: 'left',
        sortable: true
      },
      {
        name: 'measurement_model',
        field: (row) => row.measurement_model,
        label: 'Modelo de medición',
        align: 'left',
        sortable: true
      },
      {
        name: 'nit',
        field: (row) => row.responsible?.document,
        label: 'NIT',
        align: 'left',
        sortable: true
      },
      {
        name: 'documents',
        field: 'asset_documents',
        label: 'Documentos',
        align: 'center',
        sortable: false
      }
    ],
    rows: [] as IRegisterForm[],
    pages: {
      currentPage: 0,
      lastPage: 0
    }
  })

  // Validation
  const validateAllRowsHaveDocuments = (): boolean => {
    const rowsWithoutDocuments = validatedRows.value.filter(
      (row) => !row.document_ids || row.document_ids.length === 0
    )

    if (rowsWithoutDocuments.length > 0) {
      showAlert(
        `Faltan documentos en ${rowsWithoutDocuments.length} registro(s). Por favor, cargue los documentos correspondientes.`,
        'error',
        undefined,
        TIMEOUTS.SEC_5
      )
      return false
    }

    return true
  }

  // actions
  const handleConfirm = () => {
    openAlertModal('cargo_parcial')
  }

  const handleCreate = async () => {
    if (!validateAllRowsHaveDocuments()) {
      return
    }

    if (!batchId.value) {
      showAlert('No hay un batch para confirmar', 'error', undefined, TIMEOUTS.SEC_3)
      return
    }

    const records = validatedRows.value.map((row) => ({
      id: row.id as number,
      document_ids: row.document_ids || []
    }))

    openMainLoader(true)
    const success = await _createRegisterBulk(batchId.value, records)
    openMainLoader(false)

    if (success) {
      goToList()
    }
  }

  const goToList = () => {
    goToURL('RegisterList')
  }

  // watchers
  watch(
    () => files.value,
    (val) => {
      tableProps.value.rows = val
    },
    { deep: true }
  )

  watch(
    () => validatedRows.value,
    (val) => {
      tablePreviewProps.value.rows = val
    },
    { deep: true }
  )

  return {
    // Header & Tabs
    headerPropsImport,
    tabs,
    tabActive,
    tabActiveIdx,
    isInformationTab,
    isDocumentsTab,

    // Icons
    defaultIconsLucide,

    // Estado de archivos
    files,
    validatingFiles,
    hasDownloadedErrors,
    showDownloadTemplateBtn,

    // Tables
    tableProps,
    tablePreviewProps,
    uploadProps,

    // Modals
    deleteModalRef,
    confirmModalRef,
    alertModalConfig,
    showDocumentsModal,
    documentsFormRef,
    currentRowForDocuments,

    // Documents
    setDocumentsFormData,
    initialDocumentsForModal,

    // Métodos
    handleDownloadTemplate,
    handleAddFile,
    handleDownloadErrors,
    handleUpdateFile,
    triggerFileInput,
    handleClearFile,
    handleDeleteFile,
    handleConfirm,
    handleCreate,
    backTab,
    nextTab,
    openAlertModal,
    handleConfirmModal,
    openDocumentsModal,
    handleSaveDocuments,
    handleCancelDocuments,
    goToList
  }
}

export default useRegisterImport
