// Vue - Router - Pinia
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useAlert, useGoToUrl, useUtils } from '@/composables'

// Interfaces
import {
  IUploadAccountingVouchersProcessTableRows,
  IUploadAccountingVouchersTempData,
  QueueJobStatus,
  QueueJobStatusV2,
  UploadVoucherErrorRow,
} from '@/interfaces/customs/accounting/UploadAccountingVouchers'
import { ITabs } from '@/interfaces/global'

// Stores
import { useUploadAccountingVouchersStore } from '@/stores/accounting/upload-accounting-vouchers'

// Utils
import { handleFileObjectToUrlConversion, urlToFile } from '@/utils'

import { QTable } from 'quasar'
import { MAX_FILE_CARGUE_SIZE_MB } from '@/constants/files'

const useUploadAccountingVouchersImport = () => {
  const { showAlert } = useAlert()

  const {
    _importUploadVouchers,
    _setDataDocuments,
    _getFormatExcel,
    _processUploadVouchers,
    _getQueueJobStatus,
    _getUploadVoucherErrors,
  } = useUploadAccountingVouchersStore('v2')

  const { total_records, failed_count, temp_data_import, data_process } =
    storeToRefs(useUploadAccountingVouchersStore('v2'))

  // refs
  const attachDocumentRef = ref()
  const fileName = ref('')
  const models = ref<{ documents: string }>({ documents: '' })
  const progressValue = ref(0)
  const statusImport = ref(false)
  const lastQueueData = ref<QueueJobStatusV2 | null>(null)

  const errorsPerPage = ref(20)
  const errorsPages = ref({
    currentPage: 1,
    lastPage: 1,
  })
  const errorsFiltersFormat = ref<Record<string, string | number>>({})
  const isValidatedReadyToProcess = ref(false)

  // props
  const headerProps = {
    title: 'Crear carga de comprobantes contables',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Cargue de comprobantes contables',
        route: 'UploadAccountingVouchersList',
      },
      { label: 'Importar', route: 'UploadAccountingVouchersImport' },
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

  const { defaultIconsLucide, formatParamsCustom: formatCustom } = useUtils()
  const { goToURL } = useGoToUrl()

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const queueStatus = ref<string | null>(null)
  const isQueueProcessing = ref(false)
  const canProcessPartially = ref(false)

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
    rows: [] as UploadVoucherErrorRow[],
    pages: errorsPages.value,
  })

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
        name: 'uploaded_at',
        required: false,
        label: 'Fecha de pago',
        align: 'left',
        field: 'uploaded_at',
        sortable: true,
      },
      {
        name: 'file_name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: 'file_name',
        sortable: true,
      },
      {
        name: 'total_count',
        required: false,
        label: 'Total de registros',
        align: 'left',
        field: 'total_count',
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
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
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

  const getQueueIdForErrors = (): number => {
    const fromTemp = Number(temp_data_import.value?.queue_id ?? 0)
    const fromLast = Number(lastQueueData.value?.queue_id ?? 0)
    return fromTemp || fromLast
  }

  const getErrorsListAction = async (queueId: number, filters: string = '') => {
    tableValidateErrorsProps.value.loading = true
    tableValidateErrorsProps.value.rows = []

    const result = await _getUploadVoucherErrors(queueId, filters)

    if (result) {
      tableValidateErrorsProps.value.rows =
        result.rows as UploadVoucherErrorRow[]
      errorsPages.value.currentPage = result.currentPage
      errorsPages.value.lastPage = result.lastPage
    }

    tableValidateErrorsProps.value.loading = false
  }

  const updateErrorsPage = (page: number) => {
    const queueId = getQueueIdForErrors()
    if (!queueId) return

    errorsFiltersFormat.value = {
      ...errorsFiltersFormat.value,
      paginate: 1,
      page,
      rows: errorsPerPage.value,
    }

    const queryString = formatCustom(errorsFiltersFormat.value)
    getErrorsListAction(queueId, queryString ? '&' + queryString : '')
  }

  const updateErrorsRowsPerPage = (rowsPerPage: number) => {
    const queueId = getQueueIdForErrors()
    if (!queueId) return

    errorsPerPage.value = rowsPerPage

    errorsFiltersFormat.value = {
      ...errorsFiltersFormat.value,
      paginate: 1,
      page: 1,
      rows: errorsPerPage.value,
    }

    const queryString = formatCustom(errorsFiltersFormat.value)
    getErrorsListAction(queueId, queryString ? '&' + queryString : '')
  }

  const pollQueueStatus = async (queueId: number | string) => {
    isQueueProcessing.value = true
    queueStatus.value = 'En Proceso'
    canProcessPartially.value = false

    const delayMs = 5000
    const maxAttempts = (10 * 60 * 1000) / delayMs
    let finalQueueData: QueueJobStatus | null = null

    for (let i = 0; i < maxAttempts; i++) {
      const queueData = (await _getQueueJobStatus(
        queueId
      )) as QueueJobStatusV2 | null
      if (!queueData) break

      lastQueueData.value = queueData
      queueStatus.value = queueData.status_name ?? ''
      const statusId = Number(queueData.status_id)
      const totalRows = Number(queueData.total_records_count ?? 0)

      const validCount = Number(queueData.valid_records_count ?? 0)
      canProcessPartially.value = validCount > 0

      if (!queueData.is_finished) {
        await wait(delayMs)
        continue
      }

      finalQueueData = queueData

      if (tableProps.value.rows.length > 0) {
        tableProps.value.rows[0].status_id = statusId
      }

      if (totalRows > 0) {
        tableProps.value.rows[0].total = totalRows
      }

      let shouldBreakLoop = true

      switch (statusId) {
        case 73: {
          // Cargado con errores
          progressValue.value = 1

          errorsPages.value.currentPage = 1
          errorsFiltersFormat.value = {
            paginate: 1,
            page: 1,
            rows: errorsPerPage.value,
          }
          const queryString = formatCustom(errorsFiltersFormat.value)
          await getErrorsListAction(
            Number(queueData.queue_id),
            queryString ? '&' + queryString : ''
          )

          if (validCount > 0) {
            showAlert(
              'El proceso finalizó con errores. Puedes revisar el listado de errores y procesar los registros válidos.',
              'error'
            )
          } else {
            showAlert(
              'El proceso finalizó con errores y no se encontraron registros válidos para procesar.',
              'error'
            )
          }

          const validarTabIdx = tabs.value.findIndex(
            (tab) => tab.name === 'validar'
          )
          if (validarTabIdx !== -1) {
            tabs.value[validarTabIdx].show = false
            tabs.value[validarTabIdx].disable = true
          }

          const errorsTabIdx = tabs.value.findIndex(
            (tab) => tab.name === 'errors'
          )
          if (errorsTabIdx !== -1) {
            tabs.value[errorsTabIdx].show = true
            tabs.value[errorsTabIdx].disable = false
            tabActive.value = 'errors'
            tabActiveIdx.value = filteredTabs.value.findIndex(
              (tab) => tab.name === 'errors'
            )
          }

          shouldBreakLoop = true
          break
        }

        case 64: {
          progressValue.value = 1

          if (validCount <= 0) {
            showAlert(
              'El archivo fue validado, pero no se encontraron registros válidos para procesar.',
              'error'
            )
            shouldBreakLoop = true
            break
          }

          isValidatedReadyToProcess.value = true

          showAlert(
            'El archivo fue validado correctamente. Presiona "Procesar" para iniciar la carga.',
            'success'
          )

          const processData = data_process.value as {
            uploaded_at?: string
            total_count?: number
          }

          tableValidateProcessProps.value.rows = [
            {
              index: 1,
              uploaded_at:
                processData?.uploaded_at?.slice(0, 10) ??
                temp_data_import.value?.uploaded_at?.slice(0, 10) ??
                new Date().toISOString().slice(0, 10),
              file_name:
                temp_data_import.value?.file_name ||
                fileName.value ||
                queueData.file_name ||
                '',
              total_count: processData?.total_count || totalRows,
              status: queueData.status_name ?? 'Validado',
              status_id: queueData.status_id ?? 64,
            },
          ]

          const validarTabIdx = tabs.value.findIndex(
            (tab) => tab.name === 'validar'
          )
          if (validarTabIdx !== -1) {
            tabs.value[validarTabIdx].show = true
            tabs.value[validarTabIdx].disable = false
            tabActive.value = 'validar'
            tabActiveIdx.value = filteredTabs.value.findIndex(
              (tab) => tab.name === 'validar'
            )
          }

          shouldBreakLoop = true
          break
        }

        case 85: {
          // Proceso exitoso
          progressValue.value = 1
          showAlert(
            'La carga de comprobantes se completó exitosamente.',
            'success'
          )

          if (tableValidateProcessProps.value.rows.length > 0) {
            tableValidateProcessProps.value.rows[0].status =
              queueData.status_name ?? 'Proceso exitoso'
            tableValidateProcessProps.value.rows[0].status_id =
              queueData.status_id ?? 85
          }

          shouldBreakLoop = true
          break
        }

        case 86: {
          progressValue.value = 0
          showAlert(
            'Ocurrió un error técnico al procesar el archivo. Intenta nuevamente más tarde.',
            'error'
          )
          deleteFiles()
          shouldBreakLoop = true
          break
        }

        default: {
          progressValue.value = 1
          shouldBreakLoop = true
          break
        }
      }

      if (shouldBreakLoop) break
      await wait(delayMs)
    }

    isQueueProcessing.value = false
    return finalQueueData
  }

  // actions
  const addedFiles = async (file: File[]) => {
    const newFileSizeMB = file[0].size / (1024 * 1024)

    if (isFileTooLarge(newFileSizeMB)) {
      handleLargeFile()
      return
    }

    fileName.value = file[0].name

    _setDataDocuments(file[0])

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

    const queueId = await _importUploadVouchers()

    if (queueId) {
      showAlert(
        'Tu archivo se está procesando, esto puede tardar unos minutos.',
        'info'
      )
      await pollQueueStatus(queueId)
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

  const isFileTooLarge = (sizeMB: number): boolean =>
    sizeMB > MAX_FILE_CARGUE_SIZE_MB

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

  const resetTabsToInitial = () => {
    tabs.value = [
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
    ]

    tabActive.value = 'cargar'
    tabActiveIdx.value = 0
  }

  const deleteFiles = () => {
    models.value.documents = ''
    fileName.value = ''
    progressValue.value = 0
    attachDocumentRef.value?.removeFilesRemote()
    tableProps.value.rows = []
    tableValidateErrorsProps.value.rows = []

    tableValidateProcessProps.value.rows = []

    tableDataCreatedProps.value.rows = []

    lastQueueData.value = null
    queueStatus.value = null
    isQueueProcessing.value = false
    canProcessPartially.value = false
    statusImport.value = false
    isValidatedReadyToProcess.value = false

    _setDataDocuments(null)
    resetTabsToInitial()
  }

  const cancelUpload = () => {
    progressValue.value = 0
    models.value.documents = ''
    fileName.value = ''
    attachDocumentRef.value?.cancelUpload()
    tableProps.value.rows = []
    tableValidateErrorsProps.value.rows = []
    tableValidateProcessProps.value.rows = []
    tableDataCreatedProps.value.rows = []

    lastQueueData.value = null
    queueStatus.value = null
    isQueueProcessing.value = false
    canProcessPartially.value = false
    statusImport.value = false

    resetTabsToInitial()
  }

  const downloadTemplateExcel = async () => {
    await _getFormatExcel()
  }

  const downloadErrors = () => {
    const reportUrlFromQueue = lastQueueData.value?.report_url as
      | string
      | undefined
    const reportUrlFromTemp = temp_data_import.value?.report_url as
      | string
      | undefined
    const reportUrl = reportUrlFromQueue || reportUrlFromTemp

    if (reportUrl) {
      window.open(reportUrl)
      return
    }

    showAlert(
      'No se encontró el archivo de errores para esta carga. Vuelve a validar el archivo para regenerar el reporte.',
      'info'
    )
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

  const onSubmitProcess = async (mode: 'partial' | 'full' = 'partial') => {
    const queueId =
      temp_data_import.value?.queue_id ??
      (lastQueueData.value ? String(lastQueueData.value.queue_id) : null)

    if (!queueId) {
      showAlert(
        'No se encontró la información de la carga para procesar el archivo.',
        'error'
      )
      return
    }

    const payload: IUploadAccountingVouchersTempData = {
      queue_id: String(queueId),
      file_name:
        temp_data_import.value?.file_name ||
        fileName.value ||
        lastQueueData.value?.file_name ||
        '',
    }

    tableValidateErrorsProps.value.loading = true
    const processed = await _processUploadVouchers(payload)
    tableValidateErrorsProps.value.loading = false

    if (!processed) {
      showAlert(
        mode === 'partial'
          ? 'El archivo presentó errores y ocurrió un problema al procesarlo.'
          : 'El archivo fue validado, pero ocurrió un error al iniciar el procesamiento.',
        'error'
      )
      return
    }

    if (mode === 'partial') {
      showAlert('El archivo fue procesado parcialmente.', 'success')

      deleteFiles()
      tableValidateProcessProps.value.rows = []
      tableDataCreatedProps.value.rows = []

      tabs.value.forEach((t) => {
        if (t.name !== 'cargar') {
          t.show = false
          t.disable = true
        }
      })

      tabActive.value = 'cargar'
      tabActiveIdx.value = filteredTabs.value.findIndex(
        (tab) => tab.name === 'cargar'
      )
      goToURL('UploadAccountingVouchersList')
    }

    showAlert('Se inició el procesamiento de la carga.', 'success')
    isValidatedReadyToProcess.value = false
    if (tableValidateProcessProps.value.rows.length > 0) {
      tableValidateProcessProps.value.rows[0].status = 'En proceso'
    }
    await pollQueueStatus(String(queueId))

    goToURL('UploadAccountingVouchersList')
  }

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
    cancelUpload,
    onSubmit,
    downloadErrors,
    downloadTemplateExcel,
    onSubmitProcess,
    goToURL,
    defaultIconsLucide,
    canProcessPartially,
    isValidatedReadyToProcess,
    updateErrorsPage,
    updateErrorsRowsPerPage,
  }
}

export default useUploadAccountingVouchersImport
