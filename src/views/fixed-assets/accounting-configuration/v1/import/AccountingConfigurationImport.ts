// vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IAccountingConfigFileValidation,
  IAccountingConfigValidatedRow,
} from '@/interfaces/customs/fixed-assets/v1/AcountingConfiguration'
import { IFileTableRecordTransfer } from '@/interfaces/customs/trust-business/RecordTransfers'

// composables - assets
import { useUtils } from '@/composables'
import { handleFileObjectToUrlConversion } from '@/utils'
import excelIcon from '@/assets/images/excel.svg'

// stores
import { useAccountingConfigurationStore } from '@/stores'

const useAccountingConfigurationImport = () => {
  // imports
  const router = useRouter()
  const { defaultIconsLucide } = useUtils()

  // principal data store
  const {
    _downloadExcelAccountingConfigTemplate,
    _downloadExcelAccountingConfigErrorsFile,
    _validateAccountingConfigFile,
    _createAccountingConfigBulk,
  } = useAccountingConfigurationStore('v1')
  const { headerPropsDefault } = storeToRefs(
    useAccountingConfigurationStore('v1')
  )

  // breadcrumb
  const headerPropsImport = {
    title: `Importar ${headerPropsDefault.value.title.toLowerCase()}`,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Importar',
          route: 'AccountingConfigurationImport',
        },
      ],
    ],
    btn: {
      label: 'Descargar plantilla',
      icon: excelIcon,
      color: 'orange',
      class: 'custom',
      textColor: 'black',
    },
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
      required: false,
    },
  ])
  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)
  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  // File management
  const showDownloadTemplateBtn = ref(true)
  const handleDownloadTemplate = (): void => {
    _downloadExcelAccountingConfigTemplate()
  }

  const files = ref<IFileTableRecordTransfer[]>([])
  const originalFile = ref<File | null>(null)
  const validatingFiles = ref(false)
  const hasDownloadedErrors = ref(false)
  const fileValidationResponse = ref<IAccountingConfigFileValidation | null>(
    null
  )
  const batchId = ref<string | null>(null)
  const validatedRows = ref<IAccountingConfigValidatedRow[]>([])

  const handleAddFile = async (file: File[]) => {
    originalFile.value = file[0]
    const auxFile = handleFileObjectToUrlConversion(file[0] as never)

    files.value = [
      {
        id: 1,
        is_new: false,
        url: auxFile,
        name: file[0].name,
        status_id: 68,
        size: 0,
      },
    ]

    if (auxFile) {
      validatingFiles.value = true

      fileValidationResponse.value = await _validateAccountingConfigFile(
        file[0]
      )

      if (!fileValidationResponse.value) {
        files.value[0].status_id = 66
        validatingFiles.value = false
        return
      }

      if (fileValidationResponse.value && files.value.length > 0) {
        batchId.value = fileValidationResponse.value.batch_id as string

        if (validatedRows.value.length > 0) {
          const newValidatedRows = fileValidationResponse.value.validated_rows
          validatedRows.value = [...validatedRows.value, ...newValidatedRows]
        } else {
          validatedRows.value = [...fileValidationResponse.value.validated_rows]
        }

        files.value[0].status_id = fileValidationResponse.value.has_errors
          ? 66
          : 67
        files.value[0].size = fileValidationResponse.value.size as number
        showDownloadTemplateBtn.value = false
      }

      validatingFiles.value = false
    }
  }

  const handleDownloadErrors = async (): Promise<void> => {
    if (!batchId.value) return
    if (!fileValidationResponse.value?.has_errors) return

    await _downloadExcelAccountingConfigErrorsFile(batchId.value as string)
    hasDownloadedErrors.value = true
  }

  const updateFileInputRef = ref<HTMLInputElement | null>(null)

  const triggerFileInput = () => {
    updateFileInputRef.value?.click()
  }

  const handleUpdateFile = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (!target.files || !target.files[0]) return

    await handleAddFile([target.files[0]])

    target.value = ''
  }

  const handleClearFile = () => {
    files.value = []
    originalFile.value = null
    fileValidationResponse.value = null
    batchId.value = null
    validatedRows.value = []
    validatingForm.value = false
    hasDownloadedErrors.value = false
  }

  // import file management
  const uploadProps = {
    title: '',
    styleCustom: 'width: 100%;',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: false,
    bordered: false,
    accept: '.xlsx',
    classNameTitle: 'text-weight-medium text-grey-6 q-mb-xs',
  }

  const tableProps = ref<IBaseTableProps<IFileTableRecordTransfer>>({
    title: 'Listado cargue de configuraciones contables',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        field: 'name',
        sortable: true,
      },
      {
        name: 'total_records',
        required: false,
        label: 'Total de registros',
        field: 'size',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado de cargue',
        field: 'status_id',
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })
  // modal management
  const validatingForm = ref(false)
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: '',
    description: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    type: 'eliminar_archivo' as 'eliminar_archivo' | 'cargo_parcial',
  })

  const showValidatedRowsPreview = ref(false)

  const openAlertModal = (type: 'eliminar_archivo' | 'cargo_parcial') => {
    alertModalConfig.value.type = type

    if (type === 'eliminar_archivo') {
      alertModalConfig.value.title = '¿Desea eliminar el cargue?'
      alertModalConfig.value.description = ''
      alertModalRef.value?.openModal()
      return
    }

    if (!fileValidationResponse.value) return

    const hasErrors = fileValidationResponse.value.has_errors
    const hasValidated = fileValidationResponse.value.validated_rows.length > 0

    // Caso: Todo presentó error → No se puede cargar
    if (!hasValidated) {
      alertModalConfig.value.title = 'Todo el archivo presentó error'
      alertModalConfig.value.description = 'No se puede cargar'
      alertModalRef.value?.openModal()
      return
    }

    validatedRows.value = [...fileValidationResponse.value.validated_rows]
    // Caso: Sin errores y tiene registros válidos → Cargar directo
    if (!hasErrors && hasValidated) {
      showValidatedRowsPreview.value = true
      return
    }

    // Caso: Tiene errores pero también registros válidos → Cargo parcial
    alertModalConfig.value.title = 'El archivo presentó errores'
    alertModalConfig.value.description = '¿Desea procesar parcialmente?'
    alertModalRef.value?.openModal()
  }

  const handleConfirmModal = () => {
    if (alertModalConfig.value.type === 'eliminar_archivo') {
      handleClearFile()
    }
    if (validatedRows.value.length > 0) {
      showValidatedRowsPreview.value = true
    }
    alertModalRef.value?.closeModal()
  }

  // actions
  const goToList = () => {
    router.push({ name: 'AccountingConfigurationList' })
  }

  const handleConfirm = async () => {
    if (showValidatedRowsPreview.value) {
      if (!batchId.value) return
      const success = await _createAccountingConfigBulk(batchId.value as string)
      if (success) {
        goToList()
      }
    } else {
      openAlertModal('cargo_parcial')
    }
  }

  // preview table
  const tablePreviewProps = ref<IBaseTableProps<IAccountingConfigValidatedRow>>(
    {
      title: 'Importar configuración contable de activos fijos y bienes',
      loading: false,
      columns: [
        {
          name: 'id',
          required: false,
          label: '#',
          field: 'row_number',
          sortable: true,
        },
        {
          name: 'source',
          required: false,
          label: 'Fuente',
          field: 'source',
          sortable: true,
        },
        {
          name: 'business_id',
          required: false,
          label: 'Negocio',
          field: 'business_trust_id',
          style: 'max-width: 60px; min-width: 60px;',
          headerStyle: 'white-space: normal; max-width: 60px; min-width: 60px;',
        },
        {
          name: 'business_description',
          required: false,
          label: 'Negocio',
          field: 'business_trust_description',
        },
        {
          name: 'account_structure',
          required: false,
          label: 'Estructura contable',
          field: 'account_structure_code',
        },
        {
          name: 'cost_center_structure',
          required: false,
          label: 'Estructura centro de costos',
          field: 'cost_center_structure_code',
        },
        {
          name: 'receipt_type',
          required: false,
          label: 'Tipo de comprobante',
          field: 'receipt_type_code',
          style: 'max-width: 80px; min-width: 80px;',
          headerStyle: 'white-space: normal; max-width: 80px; min-width: 80px;',
        },
        {
          name: 'receipt_type_description',
          required: false,
          label: 'Descripción comprobante',
          field: 'receipt_type_description',
        },
        {
          name: 'receipt_subtype',
          required: false,
          label: 'Subtipo de comprobante',
          field: 'receipt_subtype_code',
          style: 'max-width: 80px; min-width: 80px;',
          headerStyle: 'white-space: normal; max-width: 80px; min-width: 80px;',
        },
        {
          name: 'receipt_subtype_description',
          required: false,
          label: 'Descripción subtipo comprobante',
          field: 'receipt_subtype_description',
        },
        {
          name: 'configuration_type_code',
          required: false,
          label: 'Código de tipo',
          field: 'configuration_type_code',
          style: 'max-width: 60px; min-width: 60px;',
          headerStyle: 'white-space: normal; max-width: 60px; min-width: 60px;',
        },
        {
          name: 'configuration_type_description',
          required: false,
          label: 'Tipo',
          field: 'configuration_type_description',
        },
        {
          name: 'configuration_subtype_code',
          required: false,
          label: 'Código de subtipo',
          field: 'configuration_subtype_code',
          style: 'max-width: 60px; min-width: 60px;',
          headerStyle: 'white-space: normal; max-width: 60px; min-width: 60px;',
        },
        {
          name: 'configuration_subtype_description',
          required: false,
          label: 'Subtipo',
          field: 'configuration_subtype_description',
        },
        {
          name: 'configuration_novelty_type_code',
          required: false,
          label: 'Código novedad',
          field: 'configuration_novelty_type_code',
          style: 'max-width: 60px; min-width: 60px;',
          headerStyle: 'white-space: normal; max-width: 60px; min-width: 60px;',
        },
        {
          name: 'debit_nature',
          required: false,
          label: 'Naturaleza de partida',
          field: 'debit_nature',
          style: 'max-width: 60px; min-width: 60px;',
          headerStyle: 'white-space: normal; max-width: 60px; min-width: 60px;',
        },
        {
          name: 'debit_accounts_chart',
          required: false,
          label: 'Cuenta contable partida',
          field: 'debit_accounts_chart_id',
          style: 'max-width: 60px; min-width: 60px;',
          headerStyle: 'white-space: normal; max-width: 60px; min-width: 60px;',
        },
        {
          name: 'credit_nature',
          required: false,
          label: 'Naturaleza de partida',
          field: 'credit_nature',
          style: 'max-width: 60px; min-width: 60px;',
          headerStyle: 'white-space: normal; max-width: 60px; min-width: 60px;',
        },
        {
          name: 'credit_accounts_chart',
          required: false,
          label: 'Cuenta contable contrapartida',
          field: 'credit_accounts_chart_id',
          style: 'max-width: 60px; min-width: 60px;',
          headerStyle: 'white-space: normal; max-width: 60px; min-width: 60px;',
        },
        {
          name: 'detail_transaction',
          required: false,
          label: 'Detalle de movimiento',
          field: 'detail_transaction',
        },
      ],
      rows: [] as IAccountingConfigValidatedRow[],
      pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }
  )

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
    defaultIconsLucide,
    headerPropsImport,
    showDownloadTemplateBtn,
    alertModalRef,
    alertModalConfig,
    uploadProps,
    showValidatedRowsPreview,

    tabs,
    tabActive,
    tabActiveIdx,

    files,
    validatingFiles,
    hasDownloadedErrors,

    tableProps,
    tablePreviewProps,

    goToList,

    handleDownloadTemplate,
    handleAddFile,
    handleDownloadErrors,
    handleUpdateFile,
    handleClearFile,
    triggerFileInput,
    handleConfirm,

    handleConfirmModal,
    openAlertModal,
  }
}

export default useAccountingConfigurationImport
