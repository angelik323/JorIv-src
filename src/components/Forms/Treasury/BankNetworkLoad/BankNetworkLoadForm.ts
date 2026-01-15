// Vue
import { ref, watch, computed, nextTick, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import moment from 'moment'

// Interfaces & Utils
import { ActionType } from '@/interfaces/global'
import type {
  IBankNetworkLoadModel,
  IILoadedRecordPages,
  ILoadedRecord,
  ILoadedFileInfo,
  IBankNetworkUploadRequest,
} from '@/interfaces/customs'

// Composables
import {
  useAlert,
  useGoToUrl,
  useMainLoader,
  useS3Documents,
  useUtils,
} from '@/composables'

// Stores
import {
  useBankNetworkLoadStore,
  useFicResourceStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
  useTrustBusinessResourceStore,
} from '@/stores'

const useBankNetworkLoadForm = (_props: {
  action: ActionType
  data?: IBankNetworkLoadModel
  readonly?: boolean
}) => {
  const {
    banks_label_code: banks,
    bank_account,
    bank_structures,
    banking_network_upload_request_types,
    treasury_movement_codes,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { banking_network_upload_business_trusts } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { defaultIconsLucide, getHolidaysByYear } = useUtils()
  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const {
    validation_result,
    signed_url_response,
    upload_response,
    file_loaded_response,
  } = storeToRefs(useBankNetworkLoadStore('v1'))
  const {
    _downloadTemplate,
    _getFileSignedUrl,
    _createBankNetworkUpload,
    _updateBankNetworkUpload,
    _getFileLoaded,
    _exportFailures,
    _validateBankNetworkUpload,
    _deleteBankNetworkLoadFile,
    _processBankNetworkUpload,
  } = useBankNetworkLoadStore('v1')

  const { _saveDocumentsS3 } = useS3Documents()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()

  const bankNetworkUploadId = ref<number | null>(null)
  const hasErrorRecords = ref(false)
  const statsProps = ref()
  const attachDocumentRef = ref()
  const statusImport = ref(false)
  const isProcessingNetwork = ref(false)
  const isFileLoaded = ref(false)
  const isValidated = ref(false)
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: '',
    description: '',
    show: false,
  })

  const models = ref<IBankNetworkLoadModel>({
    id: undefined,
    type: '',
    office_id: '',
    business_id: '',
    business_name: '',
    bank_id: '',
    bank_name: '',
    format_id: '',
    format_name: '',
    closing_date: '',
    upload_date: moment().format('YYYY-MM-DD'),
    bank_account_id: '',
    bank_account_name: '',
    documentFiles: [],
    treasury_movement_code_id: '',
  })

  const filteredBusiness = computed(() => {
    if (
      !models.value.type ||
      !banking_network_upload_business_trusts.value.length
    ) {
      return []
    }

    const type = Number(models.value.type)

    if (type === 4) {
      return []
    }

    return banking_network_upload_business_trusts.value.filter(() => {
      return true
    })
  })

  const showBusinessFields = computed(() => {
    const type = String(models.value.type)
    return type && type !== 'Multicash'
  })

  const showBankAccountField = computed(() => {
    const type = String(models.value.type)
    return type && type !== 'Multicash'
  })

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ILoadedRecord[]
    pages: IILoadedRecordPages
  }>({
    title: 'Listado registros archivo bancario',
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
      {
        name: 'row',
        label: 'Fila',
        field: 'row',
        align: 'left',
        sortable: true,
      },
      {
        name: 'record',
        label: 'Registro',
        field: 'record',
        align: 'left',
        sortable: false,
      },
      {
        name: 'status',
        label: 'Estado de cargue',
        field: 'status',
        align: 'center',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const addedFiles = async (files: File[]) => {
    statusImport.value = false

    for (const file of files) {
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > 5) {
        showAlert('El archivo excede el tamaño máximo permitido (5MB)', 'error')
        continue
      }

      models.value.documentFiles = [file]
      showAlert('Archivo seleccionado exitosamente', 'success')
    }
  }

  const removeFile = async (_removedFile?: File | string) => {
    if (models.value.documentFiles.length > 0) {
      models.value.documentFiles = []
      loadedFiles.value = []
      fileTableProps.value.rows = []
      statusImport.value = false
      isFileLoaded.value = false
      isValidated.value = false

      await nextTick()

      if (attachDocumentRef.value?.clearFiles) {
        attachDocumentRef.value.clearFiles()
      }

      if (signed_url_response.value?.data?.document_id) {
        await _deleteBankNetworkLoadFile(
          signed_url_response.value.data.document_id
        )
      }

      setStatsProps()
    }
  }

  const removeFileFromTable = async (fileId: number) => {
    const fileIndex = loadedFiles.value.findIndex((f) => f.id === fileId)
    if (fileIndex !== -1) {
      const fileToRemove = loadedFiles.value[fileIndex]
      const fileName = fileToRemove.name

      loadedFiles.value.splice(fileIndex, 1)
      fileTableProps.value.rows = loadedFiles.value

      models.value.documentFiles = models.value.documentFiles.filter(
        (f) => f.name !== fileName
      )

      if (loadedFiles.value.length === 0) {
        statusImport.value = false
        isFileLoaded.value = false
        isValidated.value = false
        await nextTick()
        if (attachDocumentRef.value?.removeFilesRemote) {
          attachDocumentRef.value.removeFilesRemote()
        }
      }
      if (signed_url_response.value?.data?.document_id) {
        await _deleteBankNetworkLoadFile(
          signed_url_response.value.data.document_id
        )
      }
      setStatsProps()
    }
  }

  const currentFile = computed(() => {
    const hasFiles = models.value.documentFiles.length > 0
    const file = hasFiles ? models.value.documentFiles[0] : null
    return file
  })

  const rejectedFiles = (
    fileRejected: Array<{ failedPropValidation: string }>
  ) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert(
        'Formato de archivo no válido. Solo se permiten archivos .txt, .csv, .xml',
        'error'
      )
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('Este archivo ya ha sido cargado previamente', 'warning')
  }

  const uploadProps = {
    title: 'Cargar Archivo',
    styleCustom:
      'width: 100% !important; border-radius: 20px !important; min-height: 50px !important; max-height: 300px !important; display: inherit !important; border: 3px dashed #dcdcdc !important',
    labelBtn: 'Seleccione los archivos para subir',
    multiple: false,
    bordered: false,
    accept: '.txt,.csv,.xml',
    showBorder: false,
  }

  const loadedFiles = ref<ILoadedFileInfo[]>([])

  const fileTableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ILoadedFileInfo[]
    pages: IILoadedRecordPages
  }>({
    title: 'Archivos Cargados',
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
      {
        name: 'file_name',
        label: 'Nombre',
        field: 'name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'total_records',
        label: 'Total de registros',
        field: 'totalRecords',
        align: 'center',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const formatFilePath = (file: File): string => {
    let realPath = ''

    if (file.webkitRelativePath) {
      realPath = file.webkitRelativePath
    } else {
      realPath = `${file.name}`
    }

    return realPath.length > 300 ? `${realPath.substring(0, 297)}...` : realPath
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileExtension = (fileName: string): string => {
    return fileName.substring(fileName.lastIndexOf('.') + 1).toUpperCase()
  }

  const getFilePath = (file: File): string => {
    return formatFilePath(file)
  }

  const canDownloadTemplate = computed(() => {
    return !!(models.value.bank_id && models.value.format_id)
  })

  const downloadTemplate = async () => {
    if (!canDownloadTemplate.value) {
      showAlert(
        'Debe seleccionar un banco y formato antes de descargar la plantilla',
        'warning'
      )
      return
    }

    await _downloadTemplate(Number(models.value.format_id))
  }

  const generateErrorReport = async () => {
    if (!bankNetworkUploadId.value) {
      showAlert('No hay ID de cargue disponible', 'warning')
      return
    }

    await _exportFailures(bankNetworkUploadId.value)
  }

  const onClickLoad = async () => {
    if (models.value.documentFiles.length === 0) {
      showAlert('No hay archivos para cargar', 'warning')
      return
    }

    const file = models.value.documentFiles[0]
    const fileExtension = getFileExtension(file.name).toLowerCase()

    tableProps.value.rows = []
    fileTableProps.value.loading = true

    const fileData = {
      name: file.name,
      document_type: fileExtension,
    }

    await _getFileSignedUrl(fileData)
    openMainLoader(true)
    if (
      !signed_url_response.value?.data?.upload_url ||
      !signed_url_response.value?.data?.document_id
    ) {
      fileTableProps.value.loading = false
      openMainLoader(false)
      return
    }

    await _saveDocumentsS3(
      [signed_url_response.value.data.upload_url],
      [file],
      false
    )

    const uploadData = {
      request_type: models.value.type,
      business_trust_id: models.value.business_id || null,
      bank_id: models.value.bank_id || null,
      format_type_id: models.value.format_id || null,
      bank_account_id: models.value.bank_account_id || null,
      document_id: signed_url_response.value.data.document_id,
      office_id: models.value.office_id || null,
      treasury_movement_code_id: models.value.treasury_movement_code_id || null,
    }

    if (_props.action == 'create') {
      await _createBankNetworkUpload(uploadData as IBankNetworkUploadRequest)
    } else {
      await _updateBankNetworkUpload(
        uploadData as IBankNetworkUploadRequest,
        bankNetworkUploadId.value ?? null
      )
    }

    if (!upload_response.value) {
      showAlert('Error al crear el cargue de red bancaria', 'error')
      fileTableProps.value.loading = false
      openMainLoader(false)
      return
    }

    if (upload_response.value.data?.structure_validation?.summary) {
      bankNetworkUploadId.value =
        upload_response.value.data.banking_network_upload?.id ?? null
      hasErrorRecords.value =
        upload_response.value.data?.structure_validation?.summary?.has_errors
      setStatsProps(upload_response.value.data.structure_validation.summary)
    }

    await _getFileLoaded(signed_url_response.value.data.document_id)

    if (file_loaded_response.value?.success) {
      const newFileInfo: ILoadedFileInfo = {
        id: loadedFiles.value.length + 1,
        name: file_loaded_response.value.data.file_name,
        totalRecords: file_loaded_response.value.data.total_count,
        documentId: file_loaded_response.value.data.document_id,
        fileExtension: file_loaded_response.value.data.file_extension,
      }

      loadedFiles.value = [newFileInfo]
      fileTableProps.value.rows = loadedFiles.value
      statusImport.value = true
      isFileLoaded.value = true
      fileTableProps.value.loading = false
    } else {
      showAlert('Error al procesar el archivo cargado', 'error')
      openMainLoader(false)
      fileTableProps.value.loading = false
    }
    openMainLoader(false)
    fileTableProps.value.loading = false
  }

  const setStatsProps = (summary?: {
    total_records: number
    valid_records: number
    failed_records: number
    no_apply_records: number
  }) => {
    statsProps.value = [
      {
        count: summary?.total_records ?? 0,
        image: defaultIconsLucide.equal,
        label: 'Total',
      },
      {
        count: summary?.valid_records ?? 0,
        image: defaultIconsLucide.circleCheckBig,
        label: 'Exitosos',
      },
      {
        count: summary?.failed_records ?? 0,
        image: defaultIconsLucide.circleOff,
        label: 'Errores',
      },
      {
        count: summary?.no_apply_records ?? 0,
        image: defaultIconsLucide.circleOff,
        label: 'N/A',
      },
    ]
  }

  const processNetworkWithErrors = (): Promise<boolean> => {
    return new Promise((resolve) => {
      alertModalConfig.value = {
        title: 'Registros con errores',
        description:
          'El cargue contiene registros con errores. ¿Desea procesar el archivo parcialmente?',
        show: true,
      }

      alertModalRef.value.modalResolve = resolve
      alertModalRef.value.openModal()
    })
  }

  const confirmProcessWithErrors = () => {
    if (alertModalRef.value?.modalResolve) {
      alertModalRef.value.modalResolve(true)
      alertModalRef.value.modalResolve = null
    }
  }

  const onClickProcess = async () => {
    if (!statusImport.value || tableProps.value.rows.length === 0) {
      showAlert('No hay registros cargados para procesar', 'warning')
      return
    }

    if (!bankNetworkUploadId.value) {
      showAlert('No hay ID de cargue disponible para procesar', 'warning')
      return
    }

    const hasErrors = false

    if (hasErrors) {
      const shouldProcess = await processNetworkWithErrors()
      if (!shouldProcess) {
        return
      }
    }

    isProcessingNetwork.value = true

    const result = await _processBankNetworkUpload(bankNetworkUploadId.value)
    isProcessingNetwork.value = false

    if (result?.success) {
      openMainLoader(true)
      goToURL('BankNetworkLoadList')
      openMainLoader(false)
    }
  }

  const canProcessNetwork = computed(() => {
    return (
      statusImport.value &&
      tableProps.value.rows.length > 0 &&
      !isProcessingNetwork.value
    )
  })

  const getValidationStatusId = (validationStatus: string): number => {
    switch (validationStatus) {
      case 'valid':
        return 1
      case 'invalid':
        return 4
      case 'no_apply':
        return 3
      default:
        return 0
    }
  }

  const resetBusinessFields = () => {
    models.value.business_id = ''
    models.value.business_name = ''
    models.value.closing_date = ''
  }

  const resetBankFields = () => {
    models.value.office_id = ''
    models.value.bank_id = ''
    models.value.bank_name = ''
    models.value.format_id = ''
    models.value.format_name = ''
    models.value.bank_account_id = ''
    models.value.bank_account_name = ''
    models.value.treasury_movement_code_id = ''
  }

  const resetAccountFields = () => {
    models.value.bank_account_id = ''
    models.value.bank_account_name = ''
  }

  const canSubmitForm = computed(() => {
    if (!models.value.type || !models.value.documentFiles.length) {
      return false
    }

    if (showBusinessFields.value && !models.value.business_id) {
      return false
    }

    if (!models.value.bank_id || !models.value.format_id) {
      return false
    }

    if (showBankAccountField.value && !models.value.bank_account_id) {
      return false
    }

    if (!models.value.upload_date) {
      return false
    }

    if (!models.value.treasury_movement_code_id) {
      return false
    }

    if (models.value.type !== 'Multicash') {
      if (showBusinessFields.value && !models.value.business_id) {
        return false
      }

      if (showBankAccountField.value && !models.value.bank_account_id) {
        return false
      }
    }

    if (!models.value.documentFiles.length) {
      return false
    }

    if (isFileLoaded.value) {
      return false
    }

    return true
  })

  const validate = async () => {
    if (!bankNetworkUploadId.value) {
      showAlert('No hay ID de cargue disponible para validar', 'warning')
      return
    }

    tableProps.value.loading = true

    await _validateBankNetworkUpload(bankNetworkUploadId.value)

    if (validation_result.value?.data?.validation_details?.records) {
      const validRecords =
        validation_result.value.data.validation_details.records

      tableProps.value.rows = validRecords.map(
        (
          record: {
            line_number: number
            record_type: string
            validation_status: string
            data: Record<string, string>
          },
          index: number
        ) => ({
          id: index + 1,
          row: record.line_number.toString(),
          record: record.record_type,
          status: getValidationStatusId(record.validation_status),
        })
      )
      isValidated.value = true
    }

    tableProps.value.loading = false
  }

  const holidays = ref<string[]>([])

  const handlerHolidays = async ({ year }: { year: number }) => {
    holidays.value = getHolidaysByYear(year)
  }

  onBeforeMount(() => {
    handlerHolidays({ year: new Date().getFullYear() })
  })

  watch(
    () => _props.data,
    (val) => {
      if (val && _props.data) {
        models.value = _props.data
        bankNetworkUploadId.value = _props.data.id ?? null

        if (_props.data.file_name && _props.data.total_count) {
          const fileInfo: ILoadedFileInfo = {
            id: 1,
            name: _props.data.file_name,
            totalRecords: Number(_props.data.total_count),
          }
          loadedFiles.value = [fileInfo]
          fileTableProps.value.rows = [fileInfo]
          statusImport.value = true
        }

        if (_props.data.details && Array.isArray(_props.data.details)) {
          tableProps.value.rows = _props.data.details.map((detail, index) => ({
            id: index + 1,
            row: String(index + 1),
            record: detail.voucher || '',
            status: detail.status?.id || 0,
          }))
        }

        if (_props.data.structure_validation_summary) {
          setStatsProps(_props.data.structure_validation_summary)
        }
      }
    },
    { immediate: true }
  )

  watch(
    () => models.value.type,
    () => {
      if (_props.action === 'create') {
        resetBusinessFields()
        resetBankFields()
      }
    }
  )

  // Bancos relacionados a un negocio
  watch(
    () => models.value.business_id,
    async (newVal) => {
      if (_props.action === 'create') {
        _resetKeys({ treasury: ['banks', 'banks_label_code'] })
        models.value.business_name = ''
        models.value.bank_id = ''
        models.value.closing_date = ''
      }

      if (!newVal) return

      const business = filteredBusiness.value.find(
        ({ value }) => value === Number(newVal)
      )

      if (business) {
        models.value.business_name = business?.name ?? ''
        models.value.closing_date = business?.treasurie.last_close_date ?? ''
      }

      await _getResources(
        { treasury: ['banks'] },
        `filter[business_trust]=${newVal}`,
        'v2'
      )
    }
  )

  watch(
    () => models.value.type,
    async (newType) => {
      if (_props.action === 'create') {
        resetBusinessFields()
      }

      if (!newType) return

      await _getResources(
        { trust_business: ['banking_network_upload_business_trusts'] },
        `filter[request_type]=${newType}`
      )
    }
  )

  watch(
    () => models.value.type,
    async (newType) => {
      if (!newType) return

      if (newType === 'Multicash') {
        if (_props.action === 'create') {
          models.value.business_id = ''
          models.value.business_name = ''
          models.value.bank_id = ''
          models.value.closing_date = ''
          _resetKeys({ treasury: ['banks', 'banks_label_code'] })
        }

        await _getResources({ treasury: ['banks'] })
      }
    },
    { immediate: _props.action === 'create' }
  )

  watch(
    () => models.value.bank_id,
    (newVal) => {
      const bank = banks.value.find(({ value }) => value === Number(newVal))

      if (bank) {
        models.value.bank_name = bank?.description ?? ''
      }

      if (_props.action === 'create') {
        resetAccountFields()
      }
    }
  )

  watch(
    () => models.value.format_id,
    (newVal) => {
      const bankStructure = bank_structures.value.find(
        ({ value }) => value === Number(newVal)
      )

      if (bankStructure) {
        models.value.format_name = bankStructure?.label ?? ''
      }
    }
  )

  watch(
    () => models.value.bank_account_id,
    (newVal) => {
      const bankAccount = bank_account.value.find(
        ({ value }) => value === Number(newVal)
      )

      if (bankAccount) {
        models.value.bank_account_name = bankAccount?.account_name ?? ''
      }
    }
  )

  watch(
    () => models.value.bank_id,
    async (newVal) => {
      if (_props.action === 'create') {
        _resetKeys({ treasury: ['bank_structures'] })
        models.value.format_id = ''
      }

      if (!newVal) return

      await _getResources(
        { treasury: ['bank_structures'] },
        `filter[bank_id]=${newVal}&filter[format_type]=Entrada`,
        'v2'
      )
    }
  )

  // Cuentas bancarias por negocio y banco
  watch(
    () => ({
      business: models.value.business_id,
      bank: models.value.bank_id,
    }),
    async ({ business, bank }) => {
      if (_props.action === 'create') {
        _resetKeys({ treasury: ['bank_account'] })
        models.value.bank_account_id = ''
      }

      if (!business || !bank) return

      await _getResources(
        { treasury: ['bank_account'] },
        `filter[business_id]=${business}&filter[bank_id]=${bank}`
      )
    }
  )

  return {
    models,
    banks,
    offices,
    banking_network_upload_business_trusts,
    banking_network_upload_request_types,
    bank_account,
    filteredBusiness,
    bank_structures,
    showBusinessFields,
    showBankAccountField,
    addedFiles,
    rejectedFiles,
    uploadProps,
    attachDocumentRef,
    onClickLoad,
    tableProps,
    statusImport,
    canSubmitForm,
    canDownloadTemplate,
    downloadTemplate,
    removeFile,
    currentFile,
    formatFileSize,
    getFileExtension,
    getFilePath,
    fileTableProps,
    removeFileFromTable,
    hasErrorRecords,
    generateErrorReport,
    onClickProcess,
    canProcessNetwork,
    isProcessingNetwork,
    alertModalRef,
    alertModalConfig,
    confirmProcessWithErrors,
    validate,
    statsProps,
    goToURL,
    useUtils,
    holidays,
    handlerHolidays,
    treasury_movement_codes,
    isValidated,
  }
}

export default useBankNetworkLoadForm
