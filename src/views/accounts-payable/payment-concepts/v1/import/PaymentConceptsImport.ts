import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'
import {
  IFileTableRecordTransfer,
  IPaymentConceptsFileValidationResponse,
  IPaymentConceptsItemFileValidation,
  IPaymentConceptsItemFileValidationCreate,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import {
  useAccountingResourceStore,
  useAccountsPayableResourceStore,
  usePaymentConceptsStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export const usePaymentConceptsImport = () => {
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { defaultIconsLucide, handleFileObjectToUrlConversion, styleColumn } =
    useUtils()

  const { openMainLoader } = useMainLoader()

  const { account_structures_payment_concepts } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const {
    _downloadExcelPaymentConceptsTemplate,
    _validatePaymentConceptsFile,
    _downloadExcelFileValidationErrors,
    _createPaymentConceptsBulk,
  } = usePaymentConceptsStore('v1')

  const {
    payment_concept_types,
    payment_concept_nature_types,
    payment_concept_activity_types,
    payment_concept_obligation_types,
    payment_concept_pension_types,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()
  const files = ref<IFileTableRecordTransfer[]>([])
  const validatedRows = ref<IPaymentConceptsItemFileValidation[]>([])

  const validatingFiles = ref(false)

  const fileValidationResponse =
    ref<IPaymentConceptsFileValidationResponse | null>(null)

  const isUploadButtonDisabled = computed(() => {
    if (files.value.length === 0 || validatingFiles.value) {
      return true
    }
    return false
  })

  const keys = {
    accounting: ['account_structures'],
    accounts_payable: [
      'payment_concept_types',
      'payment_concept_nature_types',
      'payment_concept_activity_types',
      'payment_concept_obligation_types',
      'payment_concept_pension_types',
    ],
  }

  const headerProps = {
    title: 'Importar conceptos de pago',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Conceptos de pago',
        route: 'PaymentConceptsList',
      },
      {
        label: 'Importar',
        route: 'PaymentConceptsImport',
      },
    ],
  }

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

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%;',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: false,
    bordered: false,
    accept: '.xlsx',
    classNameTitle: 'text-weight-medium text-grey-6 q-mb-xs',
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IFileTableRecordTransfer[]
    pages: {
      currentPage: number
      lastPage: number
    }
    hiddeBottom: boolean
  }>({
    title: 'Listado de cargue de conceptos de pago',
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
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'size',
        required: false,
        label: 'Total de registros',
        align: 'left',
        field: (row) => (row.size > 0 ? row.size : '-'),
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado de cargue',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as IFileTableRecordTransfer[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    hiddeBottom: true,
  })

  const tablePropsValidatedRows = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IPaymentConceptsItemFileValidationCreate[]
    pages: {
      currentPage: number
      lastPage: number
    }
  }>({
    title: 'Listado de cargue de conceptos de pago',
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
        name: 'structure_code',
        required: false,
        label: 'Código de estructura',
        align: 'left',
        field: 'structure_code',
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'structure_purpose',
        required: false,
        label: 'Finalidad',
        align: 'left',
        field: 'structure_purpose',
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'structure_structure',
        required: false,
        label: 'Estructura',
        align: 'left',
        field: 'structure_structure',
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'concept_code',
        required: false,
        label: 'Código concepto de pago',
        align: 'left',
        field: 'concept_code',
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'concept_name',
        required: false,
        label: 'Nombre del concepto de pago',
        align: 'left',
        field: 'concept_name',
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'concept_type',
        required: false,
        label: 'Tipo',
        align: 'left',
        field: 'concept_type',
        sortable: true,
        style: styleColumn(250),
      },
      {
        name: 'nature_type',
        required: false,
        label: 'Naturaleza',
        align: 'left',
        field: 'nature_type',
        sortable: true,
        style: styleColumn(250),
      },
      {
        name: 'activity_type',
        required: false,
        label: 'Tipo de actividad',
        align: 'left',
        field: 'activity_type',
        sortable: true,
        style: styleColumn(180),
      },
      {
        name: 'obligation_type',
        required: false,
        label: 'Tipo de obligación',
        align: 'left',
        field: 'obligation_type',
        sortable: true,
        style: styleColumn(200),
      },

      {
        name: 'pension_type',
        required: false,
        label: 'Manejo pensional',
        align: 'left',
        field: 'pension_type',
        sortable: true,
        style: styleColumn(180),
      },
      {
        name: 'liquidates_taxes',
        required: false,
        label: '¿Liquida impuestos?',
        align: 'left',
        field: 'liquidates_taxes',
        sortable: true,
      },
      {
        name: 'is_advance',
        required: false,
        label: '¿Es un anticipo?',
        align: 'left',
        field: 'is_advance',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as IPaymentConceptsItemFileValidationCreate[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: '',
    description: '¿Desea eliminar el cargue?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
    type: 'eliminar_archivo' as 'eliminar_archivo' | 'cargo_parcial',
  })

  const handleDownloadTemplate = () => {
    _downloadExcelPaymentConceptsTemplate()
  }

  const handleAddFile = async (file: File[]) => {
    const auxFile = handleFileObjectToUrlConversion(file[0] as never)
    files.value.push({
      id: 1,
      is_new: false,
      url: auxFile,
      name: file[0].name,
      status_id: 68,
      size: 0,
    })
    if (auxFile) {
      validatingFiles.value = true
      fileValidationResponse.value = await _validatePaymentConceptsFile(file[0])
      if (fileValidationResponse.value && files.value.length > 0) {
        files.value[0].status_id = fileValidationResponse.value.summary
          .has_errors
          ? 66
          : 67

        files.value[0].size = fileValidationResponse.value.summary.total
      }

      validatingFiles.value = false
    }
  }

  const handleCancelImport = () => {
    files.value = []
  }

  const handleDownloadErrors = () => {
    if (!fileValidationResponse.value) return
    if (
      !fileValidationResponse.value.summary.has_errors ||
      fileValidationResponse.value.error_rows.length === 0
    )
      return

    _downloadExcelFileValidationErrors({
      errors: fileValidationResponse.value.error_rows,
    })
  }

  const openAlertModal = (type: 'eliminar_archivo' | 'cargo_parcial') => {
    alertModalConfig.value.type = type
    if (type === 'eliminar_archivo') {
      alertModalConfig.value.title = '¿Desea eliminar el cargue?'
      alertModalConfig.value.description = ''
    } else {
      alertModalConfig.value.title = 'El archivo presento errores'
      alertModalConfig.value.description = '¿Desea procesar parcialmente?'
    }

    alertModalRef.value?.openModal()
  }

  const handleConfirm = () => {
    if (alertModalConfig.value.type === 'eliminar_archivo') {
      files.value = []
    } else {
      if (!fileValidationResponse.value) return
      validatedRows.value = [...fileValidationResponse.value.validated_rows]
    }
    alertModalRef.value?.closeModal()
  }

  const changeAccountStructure = (
    row: IPaymentConceptsItemFileValidationCreate,
    newVal: number
  ) => {
    row.structure_id = newVal
    row.structure_purpose = '-'
    row.structure_structure = '-'
    row.structure_code = ''
    row.concept_code_length = 1
    if (!newVal) {
      row.concept_type = 'totalizador'
      return
    }
    const selected_structure = account_structures_payment_concepts.value.find(
      (account_structure) => account_structure.id === newVal
    )
    if (selected_structure) {
      row.structure_purpose = selected_structure.purpose ?? '-'
      row.structure_structure = selected_structure.structure ?? '-'
      row.structure_code = selected_structure.code ?? ''

      if (selected_structure.structure) {
        const coincidences = selected_structure.structure.match(/0/g)
        row.concept_code_length = coincidences ? coincidences.length : 1
      }
    }
  }

  const changeConceptCode = (
    row: IPaymentConceptsItemFileValidationCreate,
    newVal: string
  ) => {
    row.concept_code = newVal
    if (newVal) {
      if (
        row.concept_type === 'operativo' &&
        newVal.length < row.concept_code_length
      ) {
        row.concept_type = 'totalizador'
      }

      if (newVal.length === row.concept_code_length) {
        row.concept_type = 'operativo'
      }
    } else {
      row.concept_type = null
    }
  }

  const changeConceptType = (
    row: IPaymentConceptsItemFileValidationCreate,
    newVal: string
  ) => {
    if (
      (newVal === 'operativo' &&
        row.concept_code_length !== row.concept_code?.length) ||
      row.structure_id === null
    ) {
      row.concept_type = 'totalizador'
    }

    if (
      newVal === 'totalizador' &&
      row.concept_code_length === row.concept_code?.length
    ) {
      row.concept_type = 'operativo'
    }
  }

  const changeObligationType = (
    row: IPaymentConceptsItemFileValidationCreate,
    newVal: string
  ) => {
    row.obligation_type = newVal
    if (newVal !== 'pensional') {
      row.pension_type = null
    }
    row.liquidates_taxes = true
    row.is_advance = true
    row.disabled_pension_type = true
    row.disabled_liquidates_taxes = false
    row.disabled_is_advance = false
    if (!newVal) return
    row.disabled_pension_type = newVal !== 'pensional'

    if (['credito', 'obligacion_financiera'].includes(newVal)) {
      row.liquidates_taxes = false
      row.is_advance = false
      row.disabled_liquidates_taxes = true
      row.disabled_is_advance = true
    }
  }

  const handleAddValidatedRow = () => {
    tablePropsValidatedRows.value.rows.push({
      row_number: tablePropsValidatedRows.value.rows.length + 1,
      structure_id: null,
      structure_code: '',
      concept_code: '',
      concept_name: '',
      concept_code_length: 1,
      concept_type: 'totalizador',
      nature_type: 'egreso',
      activity_type: 'no_aplica',
      obligation_type: 'no_aplica',
      pension_type: null,
      liquidates_taxes: true,
      is_advance: true,
      structure_purpose: '-',
      structure_structure: '-',
      disabled_pension_type: true,
      disabled_liquidates_taxes: false,
      disabled_is_advance: false,
      error_message: null,
      has_error: false,
    })
  }

  const handleDeleteValidatedRow = (
    row: IPaymentConceptsItemFileValidationCreate
  ) => {
    const index_delete = tablePropsValidatedRows.value.rows.findIndex(
      (validated_row) => validated_row.row_number === row.row_number
    )
    if (index_delete === -1) return
    tablePropsValidatedRows.value.rows.splice(index_delete, 1)
  }

  const handleLoad = () => {
    if (!fileValidationResponse.value) return
    if (fileValidationResponse.value.validated_rows.length === 0) {
      showAlert(`No se encontraron registros para agregar`, 'error')
      return
    }
    if (
      fileValidationResponse.value.summary.has_errors ||
      fileValidationResponse.value.error_rows.length > 0
    ) {
      openAlertModal('cargo_parcial')
      return
    }

    validatedRows.value = [...fileValidationResponse.value.validated_rows]
  }

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validate()
    if (tablePropsValidatedRows.value.rows.length === 0) return
    if (!isValid) return
    openMainLoader(true)
    const payload = {
      concepts: [...tablePropsValidatedRows.value.rows],
    }
    const createPaymentConceptsBulkResponse = await _createPaymentConceptsBulk(
      payload
    )
    if (createPaymentConceptsBulkResponse) {
      if (createPaymentConceptsBulkResponse.success_count > 0) {
        showAlert(
          `Se crearon ${createPaymentConceptsBulkResponse.success_count} registros exitosamente`,
          'success'
        )
      }
      if (createPaymentConceptsBulkResponse.error_count > 0) {
        showAlert(
          `No se pudieron crear ${createPaymentConceptsBulkResponse.error_count} registros`,
          'error'
        )
        if (
          createPaymentConceptsBulkResponse.error_count ===
          tablePropsValidatedRows.value.rows.length
        ) {
          openMainLoader(false)
          return
        }
      }
      goToURL('PaymentConceptsList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  watch(
    () => files.value,
    (val) => {
      tableProps.value.rows = val
    },
    {
      deep: true,
    }
  )

  watch(
    () => validatedRows.value,
    (val) => {
      tablePropsValidatedRows.value.rows = val.map((row) => {
        const newRow = {
          row_number: row.row_number,
          structure_code: row.structure_code ?? '',
          structure_id: row.structure_id ?? null,
          concept_code: row.concept_code ?? '',
          concept_name: row.concept_name ?? '',
          concept_code_length: 1,
          concept_type: row.concept_type.value ?? null,
          nature_type: row.nature_type.value ?? null,
          activity_type: row.activity_type.value ?? null,
          obligation_type: row.obligation_type.value ?? null,
          pension_type: row.pension_type?.value ?? null,
          liquidates_taxes: row.liquidates_taxes ?? false,
          is_advance: row.is_advance ?? false,
          structure_purpose: '-',
          structure_structure: '-',
          disabled_pension_type: false,
          disabled_liquidates_taxes: false,
          disabled_is_advance: false,
          error_message: row.error_message,
          has_error: row.has_error,
        }
        changeAccountStructure(newRow, row.structure_id)
        changeConceptCode(newRow, row.concept_code)
        changeConceptType(newRow, newRow.concept_type)
        changeObligationType(newRow, newRow.obligation_type)

        return newRow
      })
    },
    {
      deep: true,
    }
  )

  onMounted(async () => {
    await _getResources(
      keys,
      'filter[type]=Catálogo%20de%20conceptos%20pago&filter[status_id]=1'
    )
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    defaultIconsLucide,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    uploadProps,
    tableProps,
    alertModalRef,
    alertModalConfig,
    isUploadButtonDisabled,
    validatingFiles,
    tablePropsValidatedRows,
    account_structures_payment_concepts,
    payment_concept_types,
    payment_concept_nature_types,
    payment_concept_activity_types,
    payment_concept_obligation_types,
    payment_concept_pension_types,
    basicDataFormRef,
    goToURL,
    handleDownloadTemplate,
    handleAddFile,
    handleCancelImport,
    openAlertModal,
    handleConfirm,
    handleLoad,
    handleDownloadErrors,
    changeAccountStructure,
    changeConceptCode,
    changeConceptType,
    changeObligationType,
    handleAddValidatedRow,
    handleDeleteValidatedRow,
    handleCreate,
  }
}

export default usePaymentConceptsImport
