import { useAlert } from '@/composables'
import {
  IEquivalentVaucherCreatePayload,
  IExportFailureItem,
  IImportedFileRow,
  IValidVoucherItem,
  TValidateResponse,
} from '@/interfaces/customs'
import { useEquivalentVaucherStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const useEquivalentVaucherImport = () => {
  const router = useRouter()

  const { showAlert } = useAlert()
  const {
    _downloadTemplate,
    _validateTemplate,
    _exportFailuresXlsx,
    _createEquivalentVaucher,
  } = useEquivalentVaucherStore('v1')

  const { failures_list } = storeToRefs(useEquivalentVaucherStore('v1'))

  const attachDocumentRef = ref()
  const validatedVouchers = ref<IValidVoucherItem[]>([])
  const fileName = ref('')
  const models = ref<{ documents: string }>({ documents: '' })
  const progressValue = ref(0)
  const hasDownloadedFailures = ref(false)
  const statusImport = ref(false)
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'El archivo presentó errores.',
    description_message: '¿Desea procesar parcialmente?',
    id: null as number | null,
  })

  const headerProps = {
    title: 'Importar comprobantes equivalentes',
    subtitle:
      'Para importar los documentos, cada uno debe contener al menos 5 registros',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Comprobantes equivalentes',
        route: 'EquivalentVaucherList',
      },
      {
        label: 'Importar',
        route: 'EquivalentVaucherImport',
      },
    ],
  }

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: false,
    bordered: false,
    accept: '.xlsx',
  }

  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: 'Ítem',
        align: 'left',
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
        name: 'total',
        required: false,
        label: 'Total de registros',
        align: 'center',
        field: 'total',
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
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IImportedFileRow[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const getFormattedRow = (result: TValidateResponse): IImportedFileRow => {
    const { file_name, total_count } = result.data
    const hasErrors = 'validated_vouchers' in result.data

    return {
      id: 1,
      name: file_name,
      total: total_count,
      status_id: hasErrors ? 29 : 30,
      actions: hasErrors ? ['delete'] : ['delete', 'download'],
    }
  }

  const addedFiles = async (files: File[]) => {
    if (!files.length) return

    const payload = { file: files[0] }
    tableProps.value.loading = true

    const result = await _validateTemplate(payload)
    tableProps.value.loading = false

    if (!result || !result.data) {
      showAlert('Error al validar el archivo', 'error')
      return
    }

    const formattedRow = getFormattedRow(result)
    tableProps.value.rows = [formattedRow]

    const { file_name } = result.data
    fileName.value = file_name

    if (result.success === false) {
      validatedVouchers.value = result.data.valid_vouchers || []
      statusImport.value = false
      failures_list.value = result.data.failures || []
      hasDownloadedFailures.value = false

      showAlert(
        result.message ||
          `Se encontraron ${result.data.failed_count} comprobante(s) con errores.`,
        'warning'
      )
    } else {
      validatedVouchers.value = result.data.validated_vouchers || []
      statusImport.value = true
      failures_list.value = []
    }
  }

  type FileRejected = { failedPropValidation?: string }

  const rejectedFiles = (fileRejected: FileRejected[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    deleteFiles()
  }

  const deleteFiles = () => {
    models.value.documents = ''
    attachDocumentRef.value?.removeFilesRemote()
    tableProps.value.rows = []
    progressValue.value = 0
    fileName.value = ''
  }

  const downloadTemplateExcel = async () => {
    await _downloadTemplate()
  }

  const exportFailures = async () => {
    if (!failures_list.value?.length) return

    const payload: IExportFailureItem[] = failures_list.value.map((item) => ({
      index: item.index,
      source_voucher_sub_type: item.source_voucher_sub_type,
      equivalent_voucher_sub_type: item.equivalent_voucher_sub_type,
      fiscal_voucher_sub_type: item.fiscal_voucher_sub_type,
      errors: item.errors,
    }))

    await _exportFailuresXlsx(payload)

    hasDownloadedFailures.value = true
  }

  const onSubmit = async () => {
    const payload: IEquivalentVaucherCreatePayload = {
      valid_vouchers: validatedVouchers.value.map((item, index) => ({
        index: index + 1,
        source_voucher_sub_type_id: item.source_voucher_sub_type_id,
        equivalent_voucher_sub_type_id: item.equivalent_voucher_sub_type_id,
        fiscal_voucher_sub_type_id: item.fiscal_voucher_sub_type_id,
      })),
    }

    const success = await _createEquivalentVaucher(payload)

    if (success) {
      showAlert('Comprobantes cargados correctamente.', 'success')
      router.push({ name: 'EquivalentVaucherList' })
    }
  }

  const openModalCreate = async () => {
    await alertModalRef.value.openModal()
  }

  const resetImportState = () => {
    models.value.documents = ''
    attachDocumentRef.value?.removeFilesRemote()
    tableProps.value.rows = []
    progressValue.value = 0
    fileName.value = ''
    validatedVouchers.value = []
    failures_list.value = []
    statusImport.value = false
  }

  onMounted(() => {
    resetImportState()
  })

  return {
    headerProps,
    uploadProps,
    attachDocumentRef,
    models,
    tableProps,
    progressValue,
    statusImport,
    validatedVouchers,
    alertModalConfig,
    alertModalRef,
    failures_list,
    hasDownloadedFailures,
    addedFiles,
    rejectedFiles,
    deleteFiles,
    onSubmit,
    exportFailures,
    openModalCreate,
    downloadTemplateExcel,
  }
}

export default useEquivalentVaucherImport
