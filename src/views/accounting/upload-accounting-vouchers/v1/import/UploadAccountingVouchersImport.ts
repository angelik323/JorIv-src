import { useAlert, useGoToUrl, useUtils } from '@/composables'
import {
  IUploadAccountingVouchersProcessTableRows,
  IUploadAccountingVouchersTempData,
  IValidVouchersData,
  QueueJobStatus,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { IUploadedFile } from '@/interfaces/global/File'
import { useUploadAccountingVouchersStore } from '@/stores'
import { handleFileObjectToUrlConversion, urlToFile } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const useUploadAccountingVouchersImport = () => {
  const MAX_FILE_SIZE_MB = 5
  const router = useRouter()
  const { showAlert } = useAlert()
  const {
    _importUploadVouchers,
    _setDataDocuments,
    _getFormatExcel,
    _processUploadVouchers,
    _showUploadAccountingVoucher,
    _exportErrors,
    _getQueueJobStatus,
  } = useUploadAccountingVouchersStore('v1')

  const { total_records, failed_count, temp_data_import, data_process } =
    storeToRefs(useUploadAccountingVouchersStore('v1'))

  // refs
  const attachDocumentRef = ref()
  const fileName = ref('')
  const models = ref<{ documents: string }>({ documents: '' })
  const progressValue = ref(0)
  const statusImport = ref(false)

  // props
  const headerProps = {
    title: 'Crear carga de comprobantes contables',
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
        label: 'Cargue de comprobantes contables',
        route: 'UploadAccountingVouchersList',
      },
      {
        label: 'Importar',
        route: 'UploadAccountingVouchersImport',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'cargar',
      label: 'Cargar archivo',
      icon: useUtils().defaultIconsLucide.download,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'validar',
      label: 'Validar registro',
      icon: useUtils().defaultIconsLucide.checkCircle,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'errors',
      label: 'Errores',
      icon: useUtils().defaultIconsLucide.closeCircle,
      outlined: true,
      disable: true,
      show: false,
      required: false,
    },
  ])

  const { goToURL } = useGoToUrl()
  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )
  const queueStatus = ref<string | null>(null)
  const isQueueProcessing = ref(false)

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
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'date',
        required: false,
        label: 'Fecha de carga',
        align: 'left',
        field: 'date',
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
    rows: [] as {
      id: number
      date: string
      name: string
      total: number
      status_id: number
      actions?: string
    }[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const tableValidateErrorsProps = ref({
    loading: false,
    Columns: [
      {
        name: 'index',
        required: false,
        label: '#',
        align: 'left',
        field: 'index',
        sortable: true,
      },
      {
        name: 'consecutivo_de_registros',
        required: false,
        label: 'Consecutivo',
        align: 'left',
        field: 'consecutivo_de_registros',
        sortable: true,
      },
      {
        name: 'codigo_de_comprobante',
        required: false,
        label: 'Código de comprobante',
        align: 'left',
        field: 'codigo_de_comprobante',
        sortable: true,
      },
      {
        name: 'errors',
        required: false,
        label: 'Errores',
        align: 'left',
        field: 'errors',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IUploadAccountingVouchersTempData[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const getForeingCurrencyAmount = (row: IValidVouchersData) => {
    return row?.voucher_data?.length
      ? row.voucher_data.reduce((acc, item) => {
          const amount = Number(item.foreign_currency) || 0
          return item.nature === 'Débito' ? acc + amount : acc - amount
        }, 0)
      : 0
  }

  const tableValidateProcessProps = ref({
    title: 'Registro a procesar',
    loading: false,
    columns: [
      {
        name: 'index',
        required: false,
        label: '#',
        align: 'left',
        field: 'index',
        sortable: true,
      },
      {
        name: 'business_trust_id',
        required: false,
        label: 'Código negocio',
        align: 'left',
        field: 'business_trust_code',
        sortable: true,
      },
      {
        name: 'business_trust_name',
        required: false,
        label: 'Nombre negocio',
        align: 'left',
        field: 'business_trust_name',
        sortable: true,
      },
      {
        name: 'registration_date',
        required: false,
        label: 'Fecha registro',
        align: 'left',
        field: 'registration_date',
        sortable: true,
      },
      {
        name: 'receipt_type_id',
        required: false,
        label: 'Código comprobante',
        align: 'left',
        field: 'receipt_type_id',
        sortable: true,
      },
      {
        name: 'sub_receipt_type_id',
        required: false,
        label: 'Código sub comprobante',
        align: 'left',
        field: 'sub_receipt_type_id',
        sortable: true,
      },
      {
        name: 'total_amount_debits',
        required: false,
        label: 'Suma débito',
        align: 'left',
        field: (row: IValidVouchersData) =>
          `${useUtils().formatCurrency(row.total_amount_debits)}`,
        sortable: true,
      },
      {
        name: 'total_amount_credits',
        required: false,
        label: 'Suma crédito',
        align: 'left',
        field: (row: IValidVouchersData) =>
          `${useUtils().formatCurrency(row.total_amount_credits)}`,
        sortable: true,
      },
      {
        name: 'difference_amount',
        required: false,
        label: 'Suma moneda extranjera',
        align: 'left',
        field: (row: IValidVouchersData) =>
          `${useUtils().formatCurrencyString(getForeingCurrencyAmount(row), {
            showCurrencySymbol: false,
          })}`,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IUploadAccountingVouchersTempData[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const tableDataCreatedProps = ref({
    loading: false,
    Columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_code',
        required: false,
        label: 'Código de negocio',
        align: 'left',
        field: 'business_code',
        sortable: true,
      },
      {
        name: 'business_name',
        required: false,
        label: 'Nombre de negocio',
        align: 'left',
        field: 'business_name',
        sortable: true,
      },
      {
        name: 'registration_date',
        required: false,
        label: 'Fecha de registro',
        align: 'left',
        field: 'registration_date',
        sortable: true,
      },
      {
        name: 'receipt_type_id',
        required: false,
        label: 'Código de comprobante',
        align: 'left',
        field: 'receipt_type_id',
        sortable: true,
      },
      {
        name: 'sub_receipt_type_id',
        required: false,
        label: 'Código sub comprobante',
        align: 'left',
        field: 'sub_receipt_type_id',
        sortable: true,
      },
      {
        name: 'consecutive',
        label: 'Consecutivo',
        align: 'left',
        field: 'consecutive',
        sortable: true,
        required: false,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IUploadAccountingVouchersProcessTableRows[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const pollQueueStatus = async (jobId: number | string) => {
    isQueueProcessing.value = true
    queueStatus.value = 'En Proceso'

    const delayMs = 5000
    const maxAttempts = (10 * 60 * 1000) / delayMs
    let finalQueueData: unknown = null

    for (let i = 0; i < maxAttempts; i++) {
      const raw = (await _getQueueJobStatus(jobId)) as unknown

      if (!raw || typeof raw !== 'object') break

      const queueData = raw as QueueJobStatus

      queueStatus.value = queueData.status ?? ''

      if (queueData.status !== 'En Proceso') {
        finalQueueData = queueData

        if (queueData.status === 'Errores') {
          showAlert(
            'El formato del documento no coincide con el requerido para este proceso.',
            'error'
          )
          deleteFiles()
        } else if (queueData.status === 'Procesado' && queueData.data) {
          const payload = queueData.data

          const currentJobId =
            temp_data_import.value?.job_id ?? jobId ?? queueData.queue_id

          total_records.value = payload.total_count ?? 0
          failed_count.value =
            (payload.failed_vouchers && payload.failed_vouchers.length) || 0

          temp_data_import.value = {
            ...temp_data_import.value,
            ...payload,
            job_id: currentJobId,
            validated_vouchers: payload.valid_vouchers ?? [],
            failures: payload.failed_vouchers ?? [],
          } as IUploadAccountingVouchersTempData

          tableProps.value.rows[0].status_id = payload.status_id ?? 24
          tableProps.value.rows[0].total = payload.total_count ?? 0
          progressValue.value = 1
        }

        break
      }

      await wait(delayMs)
    }

    isQueueProcessing.value = false
    return finalQueueData
  }

  // actions
  const addedFiles = async (file: IUploadedFile[]) => {
    const newFileSizeMB = file[0].size / (1024 * 1024)

    if (isFileTooLarge(newFileSizeMB)) {
      handleLargeFile()
      return
    }

    fileName.value = file[0].name
    const auxFile = handleFileObjectToUrlConversion(file[0] as never)
    models.value.documents = auxFile

    tableProps.value.rows = [
      {
        id: 1,
        date: new Date().toISOString().slice(0, 10),
        name: file[0].name,
        total: total_records.value || 0,
        status_id: 20,
      },
    ]

    await changeBarNumber(80)

    statusImport.value = await _importUploadVouchers()

    const jobId = temp_data_import.value?.job_id

    if (jobId) {
      showAlert(
        'Tu archivo se está procesando, esto puede tardar unos minutos.',
        'info'
      )

      await pollQueueStatus(jobId)
    } else {
      const statusId = temp_data_import.value.status_id || 30
      tableProps.value.rows[0].status_id = statusId

      if (temp_data_import.value.status_id) {
        progressValue.value = 1
        tableProps.value.rows[0].total = total_records.value || 0
        if (failed_count.value === 0 && statusId !== 30) {
          tableProps.value.rows[0].status_id = 29
        }
      }
    }
  }

  const changeBarNumber = (targetPercentage: number): Promise<void> => {
    return new Promise((resolve) => {
      let current = progressValue.value * 100

      const interval = setInterval(() => {
        if (current >= targetPercentage) {
          clearInterval(interval)
          resolve()
          return
        }
        current++
        progressValue.value = current / 100
      }, 100)
    })
  }

  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const handleLargeFile = () => {
    showAlert('¡El archivo supera el tamaño máximo permitido (5mb)!', 'error')
    deleteFiles()
  }

  const rejectedFiles = (fileRejected: { failedPropValidation?: string }[]) => {
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
    await _getFormatExcel()
  }

  const downloadErrors = async () => {
    if (!temp_data_import.value.failures?.length) return
    _exportErrors(temp_data_import.value.failures)
  }

  const onSubmit = async () => {
    if (failed_count.value > 0) {
      const errorsTabIdx = tabs.value.findIndex((tab) => tab.name === 'errors')
      if (errorsTabIdx !== -1) {
        tabs.value[errorsTabIdx].show = true
        tabActive.value = 'errors'
        tabActiveIdx.value = filteredTabs.value.findIndex(
          (tab) => tab.name === 'errors'
        )
      }
    } else {
      tabActive.value = 'validar'
      tabActiveIdx.value = filteredTabs.value.findIndex(
        (tab) => tab.name === 'validar'
      )
    }
  }

  const onSubmitProcess = async () => {
    const data = temp_data_import.value

    if (!data) {
      showAlert('No hay información para procesar el registro.', 'error')
      return
    }

    const payload = {
      file_name: data.file_name,
      uploaded_at: data.uploaded_at,
      total_count: data.total_count,
      status_id: data.status_id,
      job_id: data.job_id,
    }

    await _processUploadVouchers(payload)
  }

  const finalizarRegistro = () => {
    goToURL('UploadAccountingVouchersList')
  }

  const showVoucherView = async (id: number) => {
    await _showUploadAccountingVoucher(id)
    router.push({
      name: 'UploadAccountingVouchersView',
      params: { id },
    })
  }

  // watch
  watch(
    () => models.value,
    async () => {
      if (useUtils().isEmptyOrZero(models.value)) {
        _setDataDocuments(null)
      } else {
        const file = await urlToFile(
          models.value.documents,
          fileName.value,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        _setDataDocuments(file!)
      }
    },
    { deep: true }
  )

  watch(
    () => temp_data_import.value,
    (newData) => {
      const failures = newData?.failures ?? []
      if (!Array.isArray(failures) || failures.length === 0) {
        tableValidateErrorsProps.value.rows = []
        return
      }

      let running = 1
      const rows: IUploadAccountingVouchersTempData[] = []

      failures.forEach((f) => {
        ;(f.errors ?? []).forEach((msg: string) => {
          rows.push({
            index: running++,
            consecutivo_de_registros: f.index,
            codigo_de_comprobante: f.receipt_type ?? '',
            errors: msg,
          })
        })
      })

      tableValidateErrorsProps.value.rows = rows
    },
    { deep: true }
  )

  watch(
    () => temp_data_import.value,
    (newData) => {
      if (
        Array.isArray(newData?.validated_vouchers) &&
        newData.validated_vouchers.length > 0
      ) {
        const rows = newData.validated_vouchers.map((item, idx) => ({
          index: idx + 1,
          business_trust_id: item.business_trust_id,
          business_trust_name: item.business_trust_name,
          registration_date: item.registration_date,
          receipt_type_id: item.receipt_type_code,
          sub_receipt_type_id: item.sub_receipt_type_code,
          total_amount_debits: item.total_amount_debits,
          total_amount_credits: item.total_amount_credits,
          difference_amount: item.difference_amount,
          voucher_data: item.voucher_data,
        }))
        tableValidateProcessProps.value.rows = rows
      } else {
        tableValidateProcessProps.value.rows = []
      }
    },
    { deep: true }
  )

  watch(
    () => data_process.value,
    (newData) => {
      if (
        Array.isArray(newData?.created_vouchers) &&
        newData.created_vouchers.length > 0
      ) {
        const rows = newData.created_vouchers.map((item) => ({
          id: item.id,
          business_code: item.business_trust?.business_code ?? '',
          business_name: item.business_trust?.name ?? '',
          registration_date: item.registration_date?.slice(0, 10) ?? '',
          receipt_type_id: String(item.receipt_type?.code ?? ''),
          sub_receipt_type_id: String(item.sub_receipt_type?.code ?? ''),
          registration_day: item.registration_day,
          consecutive: item.code,
        }))
        tableDataCreatedProps.value.rows = rows
      } else {
        tableDataCreatedProps.value.rows = []
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    uploadProps,
    attachDocumentRef,
    models,
    tableProps,
    tableValidateErrorsProps,
    tableValidateProcessProps,
    tableDataCreatedProps,
    progressValue,
    statusImport,
    temp_data_import,
    tabActiveIdx,
    filteredTabs,
    tabActive,
    addedFiles,
    rejectedFiles,
    deleteFiles,
    onSubmit,
    onSubmitProcess,
    finalizarRegistro,
    downloadErrors,
    downloadTemplateExcel,
    showVoucherView,
    goToURL,
  }
}

export default useUploadAccountingVouchersImport
