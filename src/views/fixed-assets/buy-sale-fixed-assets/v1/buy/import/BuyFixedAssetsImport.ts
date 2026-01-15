// vue - pinia
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// interfaces
import {
  IBuySaleFileTableRecord,
  IBuySaleFileValidation,
  IBuySaleValidatedRow,
  IDocumentsBuySale,
  IFixedAssetDocumentRequest,
  IUploadedDocumentMeta
} from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'
import { ITabs, IUploadedFile } from '@/interfaces/global'
import { IBaseTableProps } from '@/interfaces/global/Table'

// composables
import { useAlert, useGoToUrl, useMainLoader, useUtils, useS3Documents } from '@/composables'

// stores
import { useBuySaleFixedAssetsStore } from '@/stores/fixed-assets/buy-sale-fixed-assets'

// constants
import { TIMEOUTS } from '@/constants/alerts'

import excelIcon from '@/assets/images/excel.svg'

const useBuyFixedAssetsImport = () => {
  // stores
  const {
    _downloadExcelBuySaleTemplate,
    _validateBuySaleFile,
    _downloadExcelBuySaleErrorsFile,
    _createBuySaleBulk,
    _getPresignedUrls
  } = useBuySaleFixedAssetsStore('v1')
  const { headerPropsDefault } = storeToRefs(useBuySaleFixedAssetsStore('v1'))

  // composables
  const route = useRoute()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, getMaxId, getFileExtension } = useUtils()
  const { _saveDocumentsS3 } = useS3Documents()

  const purchaseOrderId = computed(() => route.query.purchase_order_id as string | undefined)

  const files = ref<IBuySaleFileTableRecord[]>([])
  const originalFile = ref<File | null>(null)
  const validatingFiles = ref(false)
  const hasDownloadedErrors = ref(false)
  const fileValidationResponse = ref<IBuySaleFileValidation | null>(null)
  const batchId = ref<string | null>(null)
  const validatedRows = ref<IBuySaleValidatedRow[]>([])

  const showValidatedRowsPreview = ref(false)
  const showDownloadTemplateBtn = ref(true)

  const headerPropsImport = {
    title: 'Importar compra de activos fijos y bienes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Importar',
        route: 'BuyFixedAssetsImport'
      }
    ],
    btn: {
      label: 'Descargar plantilla',
      icon: excelIcon,
      color: 'orange',
      class: 'custom',
      textColor: 'black'
    }
  }

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

  const tableProps = ref<IBaseTableProps<IBuySaleFileTableRecord>>({
    title: 'Listado cargue compra de activos fijos y bienes',
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
        name: 'total_records',
        required: false,
        label: 'Total de registros',
        align: 'center',
        field: 'size',
        sortable: false
      },
      {
        name: 'status',
        required: false,
        label: 'Estado de cargue',
        align: 'center',
        field: 'status_id',
        sortable: false
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
        sortable: false
      }
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 }
  })

  const tablePreviewProps = ref<IBaseTableProps<IBuySaleValidatedRow>>({
    title: 'Listado de cargue compra de activos fijos y bienes',
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: false },
      {
        name: 'asset_category',
        label: 'Categoría',
        field: 'asset_category',
        align: 'left',
        sortable: false
      },
      {
        name: 'business_trust',
        label: 'Negocio',
        field: 'business_trust_id',
        align: 'left',
        sortable: false
      },
      {
        name: 'third_party',
        label: 'Tercero',
        field: 'third_party_id',
        align: 'left',
        sortable: false
      },
      {
        name: 'transaction_date',
        label: 'Fecha compra',
        field: 'transaction_date',
        align: 'left',
        sortable: false
      },
      {
        name: 'transaction_value',
        label: 'Valor compra',
        field: 'transaction_value',
        align: 'right',
        sortable: false
      },
      {
        name: 'currency',
        label: 'Moneda',
        field: 'currency_id',
        align: 'left',
        sortable: false
      },
      {
        name: 'asset_type',
        label: 'Tipo',
        field: 'configuration_type_id',
        align: 'left',
        sortable: false
      },
      {
        name: 'subtype',
        label: 'Subtipo',
        field: 'configuration_subtype_id',
        align: 'left',
        sortable: false
      },
      {
        name: 'cost_center',
        label: 'Centro de costos',
        field: 'cost_center_id',
        align: 'left',
        sortable: false
      },
      {
        name: 'plate_code',
        label: 'Código placa',
        field: 'asset_tag_code',
        align: 'left',
        sortable: false
      },
      {
        name: 'responsible',
        label: 'Responsable',
        field: 'responsible_party_id',
        align: 'left',
        sortable: false
      },
      {
        name: 'revaluation',
        label: 'Valorización',
        field: (row) => (row.has_valoration ? 'Sí' : 'No'),
        align: 'center',
        sortable: false
      },
      {
        name: 'depreciation',
        label: 'Depreciación',
        field: (row) => (row.has_depreciation ? 'Sí' : 'No'),
        align: 'center',
        sortable: false
      },
      {
        name: 'visit',
        label: 'Visitas',
        field: (row) => (row.has_visit ? 'Sí' : 'No'),
        align: 'center',
        sortable: false
      },
      {
        name: 'description',
        label: 'Descripción',
        field: 'description',
        align: 'left',
        sortable: false
      },
      {
        name: 'documents',
        label: 'Documentos',
        field: 'id',
        align: 'center',
        sortable: false
      }
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 }
  })

  const showDocumentsModal = ref(false)
  const documentsFormRef = ref()
  const currentRowForDocuments = ref<IBuySaleValidatedRow | null>(null)
  const currentRowIndex = ref<number>(-1)  // Almacenar índice directamente
  const currentModalDocuments = ref<IDocumentsBuySale[]>([])
  const initialDocumentsForModal = ref<IDocumentsBuySale[]>([])

  const setDocumentsFormData = (data: IDocumentsBuySale[]) => {
    currentModalDocuments.value = data
  }

  const handleDocumentsUpload = async (files: IDocumentsBuySale[]): Promise<number[]> => {
    if (!files || files.length === 0) return []

    const newFiles = files.filter((f) => f.file)
    if (newFiles.length === 0) return []

    const documentsMetadata: IFixedAssetDocumentRequest[] = newFiles.map((fileField) => ({
      name: fileField.file?.name ?? fileField.name ?? '',
      model_name: 'FIXED_ASSET' as const,
      document_type: getFileExtension(fileField.file?.name ?? ''),
      file_size: fileField.file?.size ?? fileField.size ?? 0
    }))

    const presignedResponse = await _getPresignedUrls(documentsMetadata)

    if (!presignedResponse || !presignedResponse.success || presignedResponse.data.length === 0) {
      showAlert('Error al obtener URLs de carga', 'error')
      return []
    }

    const presignedData = presignedResponse.data

    const uploadUrls: string[] = []
    const filesToUpload: File[] = []
    const documentIds: number[] = []

    presignedData.forEach((presigned, index) => {
      const file = newFiles[index].file

      if (!file || !presigned.upload_url || !presigned.document_id) return

      uploadUrls.push(presigned.upload_url)
      filesToUpload.push(file)
      documentIds.push(presigned.document_id)
    })

    if (uploadUrls.length > 0 && filesToUpload.length > 0) {
      await _saveDocumentsS3(uploadUrls, filesToUpload, false)
    }

    return documentIds
  }

  const handleDownloadTemplate = async () => {
    openMainLoader(true)
    await _downloadExcelBuySaleTemplate()
    openMainLoader(false)
  }

  const handleAddFile = async (uploadedFiles: IUploadedFile[]) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return

    const file = uploadedFiles[0] as unknown as File

    originalFile.value = file

    const newFileRecord: IBuySaleFileTableRecord = {
      id: getMaxId(files.value) + 1,
      name: file.name,
      status_id: 68,
      url: URL.createObjectURL(file),
      size: 0,
      type: file.type,
      file: file
    }

    files.value = [newFileRecord]

    validatingFiles.value = true
    fileValidationResponse.value = await _validateBuySaleFile(file)

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

  const handleDownloadErrors = async () => {
    if (!batchId.value) return

    openMainLoader(true)
    await _downloadExcelBuySaleErrorsFile(batchId.value)
    hasDownloadedErrors.value = true
    openMainLoader(false)
  }

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-input-update')
    fileInput?.click()
  }

  const handleUpdateFile = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const file = target.files[0]
      await handleAddFile([file as unknown as IUploadedFile])
      hasDownloadedErrors.value = false
    }
  }

  const deleteModalRef = ref()
  const confirmModalRef = ref()

  const alertModalConfig = ref({
    type: '' as 'eliminar_archivo' | 'cargo_parcial' | '',
    title: '',
    description: '',
    description2: ''
  })

  const goToDocumentsTab = () => {
    tabActive.value = 'documents'
    tabActiveIdx.value = 1
    showValidatedRowsPreview.value = true
  }

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

  const handleClearFile = () => {
    files.value = []
    originalFile.value = null
    fileValidationResponse.value = null
    batchId.value = null
    validatedRows.value = []
    hasDownloadedErrors.value = false
    showValidatedRowsPreview.value = false
    showDownloadTemplateBtn.value = true
    // Reset tab to initial
    tabActive.value = 'information'
    tabActiveIdx.value = 0
  }

  const handleDeleteFile = () => {
    handleClearFile()
    deleteModalRef.value?.closeModal()
  }

  const openDocumentsModal = (row: IBuySaleValidatedRow, rowIdx: number) => {
    currentRowForDocuments.value = row
    currentRowIndex.value = rowIdx

    const currentRow = validatedRows.value[rowIdx]
    if (currentRow?.uploaded_documents && currentRow.uploaded_documents.length > 0) {
      const existingDocs: IDocumentsBuySale[] = currentRow.uploaded_documents.map((doc) => ({
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
        name: d.name || d.file?.name || ''
      }))
    }

    const allDocumentIds = [...existingIds, ...newDocumentIds]
    const allDocumentsMeta = [...existingMeta, ...newDocumentsMeta]

    validatedRows.value[rowIndexToUpdate] = {
      ...validatedRows.value[rowIndexToUpdate],
      document_ids: [...allDocumentIds],  
      uploaded_documents: [...allDocumentsMeta]
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

  const handleConfirm = () => {
    if (showValidatedRowsPreview.value) {
      handleCreate()
    } else {
      openAlertModal('cargo_parcial')
    }
  }

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

  const handleCreate = async () => {
    if (!validateAllRowsHaveDocuments()) {
      return
    }

    if (!batchId.value) {
      showAlert('No hay un batch para confirmar', 'error', undefined, TIMEOUTS.SEC_3)
      return
    }

    const records = validatedRows.value.map((row) => ({
      id: row.id,
      document_ids: row.document_ids || []
    }))

    openMainLoader(true)
    const success = await _createBuySaleBulk(batchId.value, records, purchaseOrderId.value)
    openMainLoader(false)

    if (success) {
      goToList()
    }
  }


  const goToList = () => {
    goToURL('BuySaleFixedAssetsList')
  }

  const handleBack = () => {
    goToList()
  }

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
    showValidatedRowsPreview,
    showDownloadTemplateBtn,

    // Tables
    tableProps,
    tablePreviewProps,

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
    handleBack,
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

export default useBuyFixedAssetsImport
