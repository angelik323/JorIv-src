// core
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// composables - utils - assets
import excelIcon from '@/assets/images/excel.svg'
import { useGoToUrl, useMainLoader, useRules, useUtils } from '@/composables'
import { handleFileObjectToUrlConversion } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'
import { IFileTableRecordTransfer } from '@/interfaces/customs/trust-business/RecordTransfers'
import {
  IMovementManagementCreateBulkPayload,
  IMovementManagementFileErrorJson,
  IMovementManagementFileErrorJsonRow,
} from '@/interfaces/customs/accounts-payable/MovementManagement'

// constants
import { disbursementTypeOptions } from '@/constants/resources'

// store
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useMovementManagementStore } from '@/stores/accounts-payable/movement-management'

const useMovementManagementImport = () => {
  // hooks
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { is_required } = useRules()
  const { openMainLoader } = useMainLoader()

  // store
  const {
    _downloadExcelMovementManagementTemplate,
    _downloadExcelMovementManagementErrors,
    _downloadExcelMovementManagementErrorsJson,
    _createBulkMovementManagement,
  } = useMovementManagementStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { code_movements_types_contracting, budget_document_transfer_type } =
    storeToRefs(useBudgetResourceStore('v1'))
  const { sub_receipt_types_voucher } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { treasury_movement_codes } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { movements_codes_nfi } = storeToRefs(useFicResourceStore('v1'))

  // refs
  const keys = ref({
    budget: ['code_movements', 'budget_document_types_selector'],
    accounting: ['sub_receipt_types'],
    treasury: ['treasury_movement_codes'],
    fics: ['movements_codes'],
  })
  const validatingForm = ref(false)
  const globalFile = ref()
  const errors = ref()
  const validated = ref()
  const disbursementType = ref()
  const currentPage = ref(1)
  const perPage = ref(20)
  const selectorBudgetReference = ref()
  const selectorBudgetGenerateDocument = ref()
  const selectorBudgetGenerateMovement = ref()
  const selectorFundMovement = ref()
  const selectorSubtype = ref()
  const selectorTreasuryFunds = ref()
  const selectorTreasuryBank = ref()
  const formBulk = ref()

  // configs
  const headerProps = {
    title: 'Importar tipos de movimiento por pagar',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Gestión de movimientos de cuentas por pagar',
        route: 'MovementManagementList',
      },
      {
        label: 'Importar',
        route: 'MovementManagementImport',
      },
    ],
    btn: {
      label: 'Descargar plantilla',
      icon: excelIcon,
      color: 'orange',
      class: 'custom',
      textColor: 'black',
    },
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

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: '',
    description: '¿Desea eliminar el cargue?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: 0 as number,
    type: 'eliminar_archivo' as 'eliminar_archivo' | 'cargo_parcial',
  })

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%;',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: true,
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
    customColumns: string[]
  }>({
    title: 'Listado de cargue de movimientos por pagar',
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
        align: 'left',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as IFileTableRecordTransfer[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    hiddeBottom: true,
    customColumns: ['status', 'actions'],
  })

  const tableValidatingProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IMovementManagementFileErrorJsonRow[]
    pages: {
      currentPage: number
      lastPage: number
    }
    hiddeBottom: boolean
    customColumns: string[]
  }>({
    title: 'Listado de cargue de movimientos por pagar',
    loading: false,
    columns: [
      {
        name: 'name',
        required: false,
        label: 'Nombre del código de movimiento',
        field: 'name',
        sortable: true,
      },
      {
        name: 'disbursement_type',
        required: false,
        label: 'Tipo de desembolso',
        field: 'disbursement_type',
        sortable: true,
      },
      {
        name: 'has_handle_budget',
        required: false,
        label: '¿Maneja presupuesto?',
        field: 'has_handle_budget',
        sortable: true,
      },
      {
        name: 'budget_reference_document_type_id',
        required: false,
        label: 'Documento presupuestal a referenciar',
        field: 'budget_reference_document_type_id',
        sortable: true,
      },
      {
        name: 'budget_generate_document_type_id',
        required: false,
        label: 'Documento presupuestal a generar',
        field: 'budget_generate_document_type_id',
        sortable: true,
      },
      {
        name: 'budget_generate_movement_id',
        required: false,
        label: 'Movimiento presupuestal a generar',
        field: 'budget_generate_movement_id',
        sortable: true,
      },
      {
        name: 'has_requests_invoice',
        required: false,
        label: '¿Solicita factura?',
        field: 'has_requests_invoice',
        sortable: true,
      },
      {
        name: 'has_contract_execution',
        required: false,
        label: '¿Ejecución de contratos?',
        field: 'has_contract_execution',
        sortable: true,
      },
      {
        name: 'has_validates_final_act',
        required: false,
        label: '¿Válida acta final?',
        field: 'has_validates_final_act',
        sortable: true,
      },
      {
        name: 'has_generates_accrual',
        required: false,
        label: '¿Genera causación?',
        field: 'has_generates_accrual',
        sortable: true,
      },
      {
        name: 'has_generates_treasury',
        required: false,
        label: '¿Cumplimiento sin tesorería?',
        field: 'has_generates_treasury',
        sortable: true,
      },
      {
        name: 'has_amortizes_fund',
        required: false,
        label: '¿Amortiza fondo?',
        field: 'has_amortizes_fund',
        sortable: true,
      },
      {
        name: 'fund_movement_code_id',
        required: false,
        label: 'Código de movimiento de fondo',
        field: 'fund_movement_code_id',
        sortable: true,
      },
      {
        name: 'accounting_accrual_subtype_id',
        required: false,
        label: 'Subtipo de comprobante contable causación',
        field: 'accounting_accrual_subtype_id',
        sortable: true,
      },
      {
        name: 'treasury_funds_payment_movement_id',
        required: false,
        label: 'Movimiento de tesorería pagos fondos',
        field: 'treasury_funds_payment_movement_id',
        sortable: true,
      },
      {
        name: 'treasury_bank_payment_movement_id',
        required: false,
        label: 'Movimiento de tesorería pagos cuentas bancarias',
        field: 'treasury_bank_payment_movement_id',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
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
    rows: [] as IMovementManagementFileErrorJsonRow[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    hiddeBottom: false,
    customColumns: [
      'name',
      'disbursement_type',
      'budget_reference_document_type_id',
      'budget_generate_document_type_id',
      'budget_generate_movement_id',
      'has_handle_budget',
      'has_requests_invoice',
      'has_contract_execution',
      'has_validates_final_act',
      'has_generates_accrual',
      'has_generates_treasury',
      'has_amortizes_fund',
      'fund_movement_code_id',
      'accounting_accrual_subtype_id',
      'treasury_funds_payment_movement_id',
      'treasury_bank_payment_movement_id',
      'status',
      'actions',
    ],
  })

  // actions
  const handleDownloadTemplate = () => {
    _downloadExcelMovementManagementTemplate()
  }

  const handleDownloadErrors = (index: number) => {
    _downloadExcelMovementManagementErrors(globalFile.value[index])
  }

  const handleAddFile = async (file: File[]) => {
    errors.value = []
    validated.value = []
    validatingForm.value = false

    // Se usa for y no foreach para que se respete el asincronismo y no se sature de peticiones el back
    for (let index = 0; index < file.length; index++) {
      const auxFile = handleFileObjectToUrlConversion(file[index] as never)

      if (auxFile) {
        tableProps.value.rows[index] = {
          id: 1,
          is_new: false,
          url: auxFile,
          name: file[index].name,
          status_id: 68,
          size: 0,
        }

        const fileResponse: IMovementManagementFileErrorJson | null =
          await _downloadExcelMovementManagementErrorsJson(file[index])

        if (fileResponse) {
          errors.value.push(fileResponse.error_rows)
          validated.value.push(fileResponse.validated_rows)

          tableProps.value.rows[index].status_id =
            fileResponse.error_rows.length > 0 ? 66 : 67
          tableProps.value.rows[index].size = fileResponse.summary.total
        }
      }
    }
    globalFile.value = file
  }

  const openAlertModal = async (
    type: 'eliminar_archivo' | 'cargo_parcial',
    index: number = 0
  ) => {
    alertModalConfig.value = {
      ...alertModalConfig.value,
      type,
      id: index,
    }

    if (type === 'eliminar_archivo') {
      return showModal('¿Desea eliminar el cargue?')
    }

    const hasErrors = errors.value[0].length > 0
    const hasValidated = validated.value[0].length > 0

    if (!hasErrors && hasValidated) {
      tableValidatingProps.value.rows = validated.value[0]

      searchCodes()

      tableValidatingProps.value.pages.lastPage = Math.ceil(
        validated.value[0].length / perPage.value
      )
      validatingForm.value = true
      return
    }

    if (!hasValidated) {
      return showModal('Todo el archivo presentó error', 'No se puede cargar')
    }

    return showModal(
      `El archivo presentó (${errors.value.length}) error${
        errors.value.length > 1 ? 'es' : ''
      }`,
      '¿Desea cargar parcialmente?'
    )
  }

  const searchCodes = () => {
    tableValidatingProps.value.rows = tableValidatingProps.value.rows.map(
      (row) => {
        const foundMovement = movements_codes_nfi.value.find(
          (m) =>
            String(m.code).trim().replace(/^0+/, '') ===
            String(row.fund_movement_code_id).trim().replace(/^0+/, '')
        )

        const foundSubtype = sub_receipt_types_voucher.value.find(
          (m) =>
            String(m.label.split('-')[0]).trim().replace(/^0+/, '') ===
            String(row.accounting_accrual_subtype_id).trim().replace(/^0+/, '')
        )

        const foundDocumentReference = budget_document_transfer_type.value.find(
          (m) =>
            String(m.code).trim().replace(/^0+/, '') ===
            String(row.budget_reference_document_type_id)
              .trim()
              .replace(/^0+/, '')
        )

        const foundDocumentGenerate = budget_document_transfer_type.value.find(
          (m) =>
            String(m.code).trim().replace(/^0+/, '') ===
            String(row.budget_generate_document_type_id)
              .trim()
              .replace(/^0+/, '')
        )

        const foundContracting = code_movements_types_contracting.value.find(
          (m) =>
            String(m.movement_code).trim().replace(/^0+/, '') ===
            String(row.budget_generate_movement_id).trim().replace(/^0+/, '')
        )

        const foundFund = treasury_movement_codes.value.find(
          (m) =>
            String(m.label.split('-')[0]).trim().replace(/^0+/, '') ===
            String(row.treasury_funds_payment_movement_id)
              .trim()
              .replace(/^0+/, '')
        )

        const foundBank = treasury_movement_codes.value.find(
          (m) =>
            String(m.label.split('-')[0]).trim().replace(/^0+/, '') ===
            String(row.treasury_bank_payment_movement_id)
              .trim()
              .replace(/^0+/, '')
        )

        Object.keys(row).forEach((key) => {
          const k = key as keyof typeof row

          if (k.startsWith('has_')) {
            type HasKey = Extract<keyof typeof row, `has_${string}`>
            const hasKey = k as HasKey

            if (row[hasKey] === null || row[hasKey] === undefined) {
              row[hasKey] = false
            }
          }
        })

        return {
          ...row,

          fund_movement_code_id: foundMovement
            ? Number(foundMovement.value)
            : null,

          accounting_accrual_subtype_id: foundSubtype
            ? Number(foundSubtype.value)
            : null,

          budget_reference_document_type_id: foundDocumentReference
            ? Number(foundDocumentReference.value)
            : null,

          budget_generate_document_type_id: foundDocumentGenerate
            ? Number(foundDocumentGenerate.value)
            : null,

          budget_generate_movement_id: foundContracting
            ? Number(foundContracting.value)
            : null,

          treasury_funds_payment_movement_id: foundFund
            ? Number(foundFund.value)
            : null,

          treasury_bank_payment_movement_id: foundBank
            ? Number(foundBank.value)
            : null,
        }
      }
    )
  }

  const showModal = (title: string, description: string = '') => {
    alertModalConfig.value.title = title
    alertModalConfig.value.description = description
    alertModalRef.value?.openModal()
  }

  const handleConfirm = async () => {
    if (alertModalConfig.value.type === 'eliminar_archivo') {
      tableProps.value.rows.splice(alertModalConfig.value.id, 1)
      errors.value.splice(alertModalConfig.value.id, 1)
      validated.value.splice(alertModalConfig.value.id, 1)
    } else {
      if (validated.value[0].length > 0) {
        tableValidatingProps.value.rows = validated.value[0]

        searchCodes()

        tableValidatingProps.value.pages.lastPage = Math.ceil(
          validated.value[0].length / perPage.value
        )
        validatingForm.value = true
      }
    }
    alertModalRef.value?.closeModal()
  }

  const handleCancel = () => {
    tableProps.value.rows = []
    tableValidatingProps.value.rows = []
    errors.value = []
    validated.value = []
  }

  const disableLoad = () => {
    return tableProps.value.rows.some((item) => item.status_id === 68)
  }

  const makePayload = () => {
    return {
      movement_codes: tableValidatingProps.value.rows,
    } as IMovementManagementCreateBulkPayload
  }

  const handleCreate = async () => {
    if (await formBulk.value?.validate()) {
      const payload = makePayload()
      openMainLoader(true)
      const success = await _createBulkMovementManagement(payload)
      openMainLoader(false)
      if (success) {
        goToURL('MovementManagementList')
      }
    }
  }

  const handleDelete = (index: number) => {
    tableValidatingProps.value.rows.splice(index, 1)
    validated.value.splice(index, 1)
  }

  const handleAdd = () => {
    const nextRowNumber =
      tableValidatingProps.value.rows.length > 0
        ? Math.max(
            ...tableValidatingProps.value.rows.map((r) => r.row_number)
          ) + 1
        : 1

    tableValidatingProps.value.rows.push({
      row_number: nextRowNumber,
      name: '',
      disbursement_type: 'Pago',
      has_handle_budget: false,
      budget_reference_document_type_id: null,
      budget_generate_document_type_id: null,
      budget_generate_movement_id: null,
      has_requests_invoice: false,
      has_contract_execution: false,
      has_validates_final_act: false,
      has_generates_accrual: false,
      accounting_accrual_subtype_id: null,
      has_compliance_without_treasury: false,
      has_amortizes_fund: false,
      fund_movement_code_id: null,
      has_generates_treasury: false,
      treasury_funds_payment_movement_id: null,
      treasury_bank_payment_movement_id: null,
      has_error: false,
      error_message: '',
    })

    tableValidatingProps.value.pages.lastPage = Math.ceil(
      tableValidatingProps.value.rows.length / perPage.value
    )
  }

  const handleBudgetChange = (
    $event: boolean,
    row: IMovementManagementFileErrorJsonRow
  ) => {
    selectorBudgetReference.value.resetValidation()
    selectorBudgetGenerateDocument.value.resetValidation()
    selectorBudgetGenerateMovement.value.resetValidation()

    row.has_handle_budget = $event
    row.budget_reference_document_type_id = null
    row.budget_generate_document_type_id = null
    row.budget_generate_movement_id = null
  }

  const handleAccrualChange = (
    $event: boolean,
    row: IMovementManagementFileErrorJsonRow
  ) => {
    selectorSubtype.value.resetValidation()

    row.has_generates_accrual = $event
    row.accounting_accrual_subtype_id = null
  }

  const handleTreasuryChange = (
    $event: boolean,
    row: IMovementManagementFileErrorJsonRow
  ) => {
    selectorTreasuryFunds.value.resetValidation()
    selectorTreasuryBank.value.resetValidation()

    row.has_generates_treasury = $event
    row.treasury_funds_payment_movement_id = null
    row.treasury_bank_payment_movement_id = null
  }

  const handleAmortizeChange = (
    $event: boolean,
    row: IMovementManagementFileErrorJsonRow
  ) => {
    selectorFundMovement.value.resetValidation()

    row.has_amortizes_fund = $event
    row.fund_movement_code_id = null
  }

  // la paginacion NO interactua con back solo es con datos que ya estan en el front cargados desde un excel
  const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return tableValidatingProps.value.rows.slice(start, end)
  })

  const updatePage = async (page: number) => {
    currentPage.value = page
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    currentPage.value = 1
    tableValidatingProps.value.pages.lastPage = Math.ceil(
      tableValidatingProps.value.rows.length / rowsPerPage
    )
  }

  // lifecycle hooks
  onMounted(async () => {
    await _getResources(keys.value)
  })

  onBeforeUnmount(() => _resetKeys(keys.value))

  onBeforeMount(() => {
    disbursementType.value = disbursementTypeOptions.filter(
      (item) => item.value != 'Todos'
    )
  })

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    uploadProps,
    tableProps,
    alertModalRef,
    alertModalConfig,
    tableValidatingProps,
    paginatedRows,

    // refs
    validatingForm,
    selectorBudgetReference,
    selectorBudgetGenerateDocument,
    selectorBudgetGenerateMovement,
    selectorFundMovement,
    selectorSubtype,
    selectorTreasuryFunds,
    selectorTreasuryBank,
    formBulk,

    // selects
    disbursementType,
    budget_document_transfer_type,
    code_movements_types_contracting,
    sub_receipt_types_voucher,
    treasury_movement_codes,
    movements_codes_nfi,

    // utils
    defaultIconsLucide,
    is_required,

    // methods
    handleDownloadTemplate,
    handleDownloadErrors,
    handleAddFile,
    openAlertModal,
    handleConfirm,
    disableLoad,
    handleCancel,
    handleCreate,
    handleDelete,
    handleAdd,
    handleBudgetChange,
    handleAccrualChange,
    handleTreasuryChange,
    handleAmortizeChange,
    updatePage,
    updatePerPage,
    goToURL,
  }
}

export default useMovementManagementImport
