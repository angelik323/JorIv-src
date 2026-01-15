// Vue - Pinia
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  IPaymentAuthorizersFileValidationResponse,
  IPaymentAuthorizersImportItemList,
} from '@/interfaces/customs/accounts-payable/PaymentAuthorizers'
import { IFileTableRecordTransfer } from '@/interfaces/customs/trust-business/RecordTransfers'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { usePaymentAuthorizersStore } from '@/stores/accounts-payable/payment-authorizers'
import { useUserResourceStore } from '@/stores/resources-manager/users'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const usePaymentAuthorizersImport = () => {
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { defaultIconsLucide, handleFileObjectToUrlConversion, styleColumnV2 } =
    useUtils()

  const { openMainLoader } = useMainLoader()

  const { users_label_email } = storeToRefs(useUserResourceStore('v1'))

  const {
    _downloadExcelPaymentAuthorizersTemplate,
    _validatePaymentAuthorizersFile,
    _downloadExcelFileValidationErrors,
    _createPaymentAuthorizersBulk,
  } = usePaymentAuthorizersStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()
  const files = ref<IFileTableRecordTransfer[]>([])
  const validatedRows = ref<IPaymentAuthorizersImportItemList[]>([])

  const batchId = ref<string | null>(null)
  const validatingFiles = ref(false)

  const fileValidationResponse =
    ref<IPaymentAuthorizersFileValidationResponse | null>(null)

  const isUploadButtonDisabled = computed(() => {
    if (files.value.length === 0 || validatingFiles.value) {
      return true
    }
    return false
  })

  const headerProps = {
    title: 'Importar autorizadores de pago',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Autorizadores de pago',
        route: 'PaymentAuthorizersList',
      },
      {
        label: 'Importar',
        route: 'PaymentAuthorizersImport',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%;',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: false,
    bordered: false,
    accept: '.xlsx',
    classNameTitle: 'text-weight-medium text-grey-6 q-mb-xs',
  }

  const tableProps = ref<IBaseTableProps<IFileTableRecordTransfer>>({
    title: 'Listado de cargue de autorizadores de pago',
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
        field: (row) => {
          const sizeValue = row.size
          if (!sizeValue) return '-'
          if (sizeValue > 0) return sizeValue
          return '-'
        },
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado de cargue',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const tablePropsValidatedRows = ref<
    IBaseTableProps<IPaymentAuthorizersImportItemList>
  >({
    title: 'Listado de cargue de autorizadores de pago',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'row_id',
        sortable: true,
      },
      {
        name: 'authorized_user_id',
        required: false,
        label: 'Usuario autorizado',
        field: 'authorized_user_id',
        sortable: true,
        align: 'left',
        style: styleColumnV2(300),
      },
      {
        name: 'amount_from',
        required: false,
        label: 'Monto desde',
        field: 'amount_from',
        sortable: true,
        align: 'left',
      },
      {
        name: 'amount_to',
        required: false,
        label: 'Monto hasta',
        field: 'amount_to',
        sortable: true,
        align: 'left',
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'row_id',
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
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
    _downloadExcelPaymentAuthorizersTemplate()
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
      fileValidationResponse.value = await _validatePaymentAuthorizersFile(
        file[0]
      )
      if (fileValidationResponse.value && files.value.length > 0) {
        batchId.value = fileValidationResponse.value.errors_file_id
        files.value[0].status_id = fileValidationResponse.value.has_errors
          ? 66
          : 67
        files.value[0].size = fileValidationResponse.value.total_rows
      }
      validatingFiles.value = false
    }
  }

  const handleCancelImport = () => {
    files.value = []
  }

  const handleDownloadErrors = () => {
    if (!fileValidationResponse.value || !batchId.value) return
    if (!fileValidationResponse.value.has_errors) return
    _downloadExcelFileValidationErrors(batchId.value)
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
      validatedRows.value = [...fileValidationResponse.value.valid_rows]
    }
    alertModalRef.value?.closeModal()
  }

  const handleAddValidatedRow = () => {
    tablePropsValidatedRows.value.rows.push({
      row_id: tablePropsValidatedRows.value.rows.length + 1,
      authorized_user_id: null,
      amount_from: '',
      amount_to: '',
    })
  }

  const handleDeleteValidatedRow = (row: IPaymentAuthorizersImportItemList) => {
    const index_delete = tablePropsValidatedRows.value.rows.findIndex(
      (validated_row) => validated_row.row_id === row.row_id
    )
    if (index_delete === -1) return
    tablePropsValidatedRows.value.rows.splice(index_delete, 1)
  }

  const handleLoad = () => {
    if (!fileValidationResponse.value) return
    if (!fileValidationResponse.value.valid_rows.length) {
      showAlert(`No se encontraron registros para agregar`, 'error')
      return
    }
    if (fileValidationResponse.value.has_errors) {
      openAlertModal('cargo_parcial')
      return
    }
    validatedRows.value = [...fileValidationResponse.value.valid_rows]
  }

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validate()
    if (tablePropsValidatedRows.value.rows.length === 0) return
    if (!isValid) return
    openMainLoader(true)
    const payload = {
      valid_rows: [...tablePropsValidatedRows.value.rows],
    }
    const createPaymentAuthorizersBulkResponse =
      await _createPaymentAuthorizersBulk(payload)
    if (createPaymentAuthorizersBulkResponse) {
      if (createPaymentAuthorizersBulkResponse.inserted > 0) {
        showAlert(
          `Se crearon ${createPaymentAuthorizersBulkResponse.inserted} registros exitosamente`,
          'success'
        )
      }
      goToURL('PaymentAuthorizersList')
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
      tablePropsValidatedRows.value.rows = val.map(
        (row: IPaymentAuthorizersImportItemList) => {
          return {
            ...row,
            amount_from: row.amount_from ? row.amount_from.toString() : '',
            amount_to: row.amount_to ? row.amount_to.toString() : '',
          }
        }
      )
    },
    {
      deep: true,
    }
  )

  const keys = {
    user: ['users'],
  }

  onMounted(() => _getResources(keys))

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
    users_label_email,
    basicDataFormRef,
    goToURL,
    handleDownloadTemplate,
    handleAddFile,
    handleCancelImport,
    openAlertModal,
    handleConfirm,
    handleLoad,
    handleDownloadErrors,
    handleAddValidatedRow,
    handleDeleteValidatedRow,
    handleCreate,
  }
}

export default usePaymentAuthorizersImport
