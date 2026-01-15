import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { isEmptyOrZero } from '@/utils'
import { computed, ref, watch } from 'vue'
import { useAlert } from '@/composables'
import {
  IAmortizationTitleInformationForm,
  IAmortizationTitleTable,
  IAmortizationTitleUploadReject,
  IPeriodicity,
} from '@/interfaces/customs/'
import { IUploadedFile } from '@/interfaces/global'
import {
  useInvestmentPortfolioResourceStore,
  useAmortizationTableStore,
} from '@/stores/'

export const useInformationForm = (props: {
  action: 'create' | 'edit'
  data?: IAmortizationTitleTable[]
}) => {
  const { data_information_form, document_data_table } = storeToRefs(
    useAmortizationTableStore('v1')
  )
  const UploadShow = ref(true)
  const {
    _setDataInformationForm,
    _getTemplate,
    _setDataDocuments,
    _importFileAmortization,
  } = useAmortizationTableStore('v1')
  const { interest_rate_payment_frequency, isin_code_mnemonics } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const MAX_FILE_SIZE_MB = 5
  const totalPercentage = ref(0)
  const isPercentageInvalid = ref(true)
  const modalRef = ref()
  const { showAlert } = useAlert()
  const fileName = ref('')
  const progressValue = ref(0)
  const statusImport = ref(false)
  const failed_count = ref(0)
  const total_records = ref(0)
  const attachDocumentRef = ref()
  const isOriginUpload = ref(false)

  const issueDate = ref('')
  const maturityDate = ref('')
  const showModal = ref(false)

  const isDateDisabled = ref(false)
  const dateInputKey = ref(0)

  const models = ref<{
    mnemonic: string
    payment_frequency: string
    modality: boolean
    flow_type: 'Regular' | 'Irregular'
    date: string
    percentage: number | null
    origin: string
    originUpload: string
    documents?: string
    issue_date: string
    maturity_date: string
  }>({
    mnemonic: '',
    payment_frequency: '',
    modality: false,
    flow_type: 'Regular',
    date: '',
    percentage: null,
    origin: '',
    originUpload: '',
    issue_date: '',
    maturity_date: '',
  })

  const openModal = () => {
    showModal.value = true
  }
  const downloadTemplateExcel = async () => {
    await _getTemplate()
  }

  const toISO = (d: Date) => d.toISOString().slice(0, 10)

  const HOLIDAYS = new Set<string>([])

  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6
  const isHoliday = (d: Date) => HOLIDAYS.has(toISO(d))

  const rollToBusinessDay = (d: Date): Date => {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    while (isWeekend(x) || isHoliday(x)) {
      x.setDate(x.getDate() + 1)
    }
    return x
  }

  const addMonthsKeepingDay = (base: Date, n: number) => {
    const y = base.getFullYear()
    const m = base.getMonth()
    const d = base.getDate()
    const targetY = y + Math.floor((m + n) / 12)
    const targetM = (m + n) % 12
    const last = new Date(targetY, targetM + 1, 0).getDate()
    const raw = new Date(targetY, targetM, Math.min(d, last))
    return rollToBusinessDay(raw)
  }

  const getMonthsToAdd = (periodicity: IPeriodicity): number => {
    switch (periodicity) {
      case 'Mensual':
        return 1
      case 'Bimestral':
        return 2
      case 'Trimestral':
        return 3
      case 'Cuatrimestral':
        return 4
      case 'Semestral':
        return 6
      case 'Periodo':
        return 0
      default:
        return 1
    }
  }

  const getFirstScheduledDateFromIssue = (
    issueDateStr: string,
    periodicity: IPeriodicity,
    maturityStr: string
  ): string => {
    const issue = new Date(issueDateStr + 'T00:00:00')
    const maturity = rollToBusinessDay(new Date(maturityStr + 'T00:00:00'))
    const monthsToAdd = getMonthsToAdd(periodicity)
    if (monthsToAdd <= 0) return toISO(maturity)
    let candidate = addMonthsKeepingDay(issue, monthsToAdd)
    if (candidate > maturity) candidate = maturity
    return toISO(rollToBusinessDay(candidate))
  }

  const getNextScheduledDate = (
    periodicity: IPeriodicity,
    issueDateStr: string,
    maturityDateStr: string
  ): string | null => {
    if (!periodicity || !issueDateStr || !maturityDateStr) return null
    const monthsToAdd = getMonthsToAdd(periodicity)
    const maturity = rollToBusinessDay(new Date(maturityDateStr + 'T00:00:00'))
    if (monthsToAdd <= 0) return toISO(maturity)
    if (tableProps.value.rows.length === 0) {
      return getFirstScheduledDateFromIssue(
        issueDateStr,
        periodicity,
        maturityDateStr
      )
    }
    const lastStr = tableProps.value.rows[tableProps.value.rows.length - 1].date
    if (!lastStr) return null
    const expected = addMonthsKeepingDay(
      new Date(lastStr + 'T00:00:00'),
      monthsToAdd
    )
    const capped = expected > maturity ? maturity : expected
    return toISO(rollToBusinessDay(capped))
  }

  const disableOutsideRange = (dateStr: string) => {
    const y = +dateStr.slice(0, 4)
    const m = +dateStr.slice(5, 7) - 1
    const d = +dateStr.slice(8, 10)
    const dt = new Date(y, m, d)
    if (isNaN(dt.getTime())) return false
    if (models.value.issue_date) {
      const em = new Date(models.value.issue_date + 'T00:00:00')
      if (dt < em) return false
    }
    if (models.value.maturity_date) {
      const mu = new Date(models.value.maturity_date + 'T00:00:00')
      if (dt > mu) return false
    }
    return true
  }

  const dateInRangeRule = (v?: string | null) => {
    if (!v) return 'Seleccione una fecha'
    const d = new Date(v + 'T00:00:00')
    if (isNaN(d.getTime())) return 'Fecha inválida'

    if (isWeekend(d) || isHoliday(d)) {
      const rolled = toISO(rollToBusinessDay(d))
      return `Fecha no hábil. Use ${rolled}`
    }

    if (
      models.value.issue_date &&
      d < new Date(models.value.issue_date + 'T00:00:00')
    )
      return `No puede ser antes de ${models.value.issue_date}`

    if (
      models.value.maturity_date &&
      d > new Date(models.value.maturity_date + 'T00:00:00')
    )
      return `No puede ser después de ${models.value.maturity_date}`

    return true
  }

  const expectedNextDate = () => {
    const per = models.value.payment_frequency as IPeriodicity
    const months = getMonthsToAdd(per)
    const issue = new Date(models.value.issue_date + 'T00:00:00')
    const maturity = rollToBusinessDay(
      new Date(models.value.maturity_date + 'T00:00:00')
    )

    if (months === 0) return toISO(maturity)

    const lastStr = tableProps.value.rows.at(-1)?.date
    const base = lastStr
      ? new Date(lastStr + 'T00:00:00')
      : addMonthsKeepingDay(issue, months)

    const nextRaw = lastStr ? addMonthsKeepingDay(base, months) : base
    const capped = nextRaw > maturity ? maturity : nextRaw
    return toISO(rollToBusinessDay(capped))
  }

  const periodicityRule = (v?: string | null) => {
    if (!v) return 'Seleccione una fecha'
    if (
      !models.value.payment_frequency ||
      !models.value.issue_date ||
      !models.value.maturity_date
    )
      return true

    if (models.value.payment_frequency === 'Periodo') {
      const must = toISO(
        rollToBusinessDay(new Date(models.value.maturity_date + 'T00:00:00'))
      )
      return v === must ? true : `Debe ser ${must}`
    }

    const expected = expectedNextDate()
    return v === expected
      ? true
      : `La fecha válida según periodicidad es ${expected}`
  }

  const coerceDateOnInput = (val: string) => {
    if (!val) {
      models.value.date = ''
      return
    }
    const r1 = dateInRangeRule(val)
    if (r1 !== true) {
      models.value.date = ''
      return
    }
    const r2 = periodicityRule(val)
    if (r2 !== true) {
      models.value.date = expectedNextDate()
      return
    }
    models.value.date = val
  }

  watch(
    () => models.value.payment_frequency,
    (newVal, oldVal) => {
      if (
        oldVal &&
        newVal &&
        newVal !== oldVal &&
        tableProps.value.rows.length
      ) {
        tableProps.value.rows = []
        totalPercentage.value = 0
      }
      dateInputKey.value++
      // precarga siguiente fecha cuando cambie periodicidad
      if (models.value.issue_date && models.value.maturity_date) {
        const next = expectedNextDate()
        if (next) models.value.date = next
      }
    }
  )

  const syncDateByContext = () => {
    const periodicity = models.value.payment_frequency as IPeriodicity
    const issue = models.value.issue_date
    const maturity = models.value.maturity_date
    isDateDisabled.value = periodicity === 'Periodo'
    const next = getNextScheduledDate(periodicity, issue, maturity)
    if (next) models.value.date = next
  }

  watch(
    [
      () => models.value.payment_frequency,
      () => models.value.issue_date,
      () => models.value.maturity_date,
      () => models.value.flow_type,
    ],
    () => {
      if (props.action !== 'create') return
      if (
        !models.value.payment_frequency ||
        !models.value.issue_date ||
        !models.value.maturity_date
      )
        return
      syncDateByContext()
    },
    { immediate: true }
  )

  const uploadProps = {
    title: 'Documento adjunto',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: false,
    bordered: false,
    accept: '.xlsx',
  }

  const flowTypeBoolean = computed({
    get: () => models.value.flow_type === 'Regular',
    set: (val: boolean) => {
      models.value.flow_type = val ? 'Regular' : 'Irregular'
    },
  })

  const removeDataTableRow = (id: number) => {
    tableProps.value.rows = tableProps.value.rows.filter((row) => row.id !== id)
    // recalcula siguiente fecha tras eliminar
    const next = expectedNextDate()
    if (next) models.value.date = next
  }

  const handlerActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: _setValueModel,
    }
    actionHandlers[action]?.()
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IAmortizationTitleInformationForm[]
    pages: number[]
    rowsPerPage: number
  }>({
    title: '',
    loading: false,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
      {
        name: 'date',
        label: 'Fecha',
        align: 'left',
        field: (row: IAmortizationTitleInformationForm) => `${row.date}`,
        sortable: true,
      },
      {
        name: 'Porcentaje',
        label: 'Porcentaje',
        align: 'left',
        field: 'percentage',
        sortable: true,
      },
      {
        name: 'origin',
        label: 'Origen',
        align: 'left',
        field: 'origin',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'left',
        field: 'actions',
        sortable: true,
      },
    ],
    rows: [],
    pages: [],
    rowsPerPage: 0,
  })

  const createDataTables = () => {
    // 1) Validaciones de entrada
    if (!models.value.payment_frequency) {
      showAlert(
        'Debes seleccionar una periodicidad de pago antes de agregar fechas',
        'warning'
      )
      return
    }
    if (!models.value.date || models.value.percentage === null) {
      showAlert('Debes ingresar fecha y porcentaje', 'warning')
      return
    }
    if (models.value.percentage <= 0 || models.value.percentage > 100) {
      showAlert('El porcentaje debe ser mayor a 0 y máximo 100%', 'warning')
      return
    }
    const maturityDate = models.value.maturity_date
    if (!maturityDate) {
      showAlert('Debe existir una fecha de vencimiento', 'warning')
      return
    }

    const rangeCheck = dateInRangeRule(models.value.date)
    if (rangeCheck !== true) {
      showAlert(String(rangeCheck), 'warning')
      models.value.date = expectedNextDate()
      return
    }
    const perCheck = periodicityRule(models.value.date)
    if (perCheck !== true) {
      showAlert(String(perCheck), 'warning')
      models.value.date = expectedNextDate()
      return
    }

    const exists = tableProps.value.rows.some(
      (row) => row.date === models.value.date
    )
    if (exists) {
      showAlert('La fecha ya existe en la tabla', 'warning')
      models.value.date = expectedNextDate()
      return
    }

    const maturityBDStr = toISO(
      rollToBusinessDay(new Date(maturityDate + 'T00:00:00'))
    )
    const currentDateStr = models.value.date
    if (currentDateStr > maturityBDStr) {
      showAlert(
        `No puedes agregar fechas posteriores al vencimiento hábil (${maturityBDStr})`,
        'warning'
      )
      return
    }

    tableProps.value.rows.push({
      id: tableProps.value.rows.length + 1,
      date: models.value.date,
      percentage: models.value.percentage,
      origin: 'Manual',
    })

    models.value.percentage = null
    const next = expectedNextDate()
    models.value.date = next ?? ''
  }

  const _setValueModel = () => {
    if (data_information_form.value) {
      clearForm()
    }
    models.value.mnemonic = data_information_form.value?.mnemonic ?? ''
    models.value.payment_frequency =
      data_information_form.value?.payment_frequency ?? ''
    models.value.modality =
      data_information_form.value?.modality === 'Anticipada' ||
      data_information_form.value?.modality === 'Anticipado'
        ? true
        : false
    models.value.flow_type = data_information_form.value?.flow_type ?? 'Regular'
    models.value.issue_date = data_information_form.value?.issue_date ?? ''
    models.value.maturity_date =
      data_information_form.value?.maturity_date ?? ''

    if (
      Array.isArray(data_information_form.value?.details) &&
      data_information_form.value.details.length > 0
    ) {
      tableProps.value.rows = data_information_form.value.details.map(
        (detail, idx) => ({
          id: idx + 1,
          date: detail.date ?? '',
          percentage: detail.percentage ?? null,
          origin: detail.origin ?? '',
        })
      )
      models.value.date = expectedNextDate() ?? ''
      models.value.percentage = null
      models.value.origin = ''
    } else {
      tableProps.value.rows = []
      models.value.date = expectedNextDate() ?? ''
      models.value.percentage = null
      models.value.origin = ''
    }
  }

  const clearForm = () => {
    models.value.mnemonic = ''
    models.value.payment_frequency = ''
    models.value.modality = false
    models.value.flow_type = 'Regular'
    models.value.date = ''
    models.value.percentage = null
    models.value.origin = ''
    models.value.issue_date = ''
    models.value.maturity_date = ''
  }

  const periodicityOptions = computed(() =>
    (interest_rate_payment_frequency.value ?? []).filter(
      (opt) => String(opt.value) !== 'No aplica'
    )
  )

  const validateImportFile = async (file?: IUploadedFile[]) => {
    if (!file) return
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
      } as unknown as IAmortizationTitleInformationForm,
    ]
    _setDataDocuments(file[0])
    await changeBarNumber(50)
    await _importFileAmortization(models.value.originUpload)
    modalRef.value = false
    if (!statusImport.value) {
      ;(tableProps.value.rows[0] as any).status_id = 30
      progressValue.value = 0
      await changeBarNumber(100)
      ;(tableProps.value.rows[0] as any).total = total_records.value || 0
      if (failed_count.value === 0) {
        ;(tableProps.value.rows[0] as any).status_id = 29
      }
    }
  }

  const cancelFunction = () => {
    showModal.value = false
    UploadShow.value = true
  }
  const isFileTooLarge = (sizeMB: number): boolean => sizeMB > MAX_FILE_SIZE_MB

  const handleLargeFile = () => {
    models.value.documents = ''
    tableProps.value.rows = []
    progressValue.value = 0
    fileName.value = ''
  }

  const handleFileObjectToUrlConversion = (file: File) =>
    file instanceof File ? URL.createObjectURL(file) : ''

  const rejectedFiles = (fileRejected: IAmortizationTitleUploadReject[]) => {
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

  watch(
    () => tableProps.value.rows.map((row) => row.percentage),
    (percentages) => {
      const sum = percentages
        .map((p) => Number(p) || 0)
        .reduce((acc, curr) => acc + curr, 0)
      totalPercentage.value = Math.round(sum * 100) / 100
      isPercentageInvalid.value = totalPercentage.value !== 100
    },
    { immediate: true }
  )

  watch(isOriginUpload, (value) => {
    if (value === null || value === undefined) {
      models.value.originUpload = 'Titularizadora'
    } else {
      models.value.originUpload = value ? 'Proveedor precios' : 'Titularizadora'
    }
  })

  const initializedForm = ref(false)
  const stopWatchPropsData = watch(
    () => props.data,
    (val) => {
      if (!val || initializedForm.value) return
      handlerActionForm(props.action)
      initializedForm.value = true
      stopWatchPropsData()
    },
    { deep: false, immediate: true }
  )

  watch(
    () => document_data_table.value,
    (newRows) => {
      UploadShow.value = false
      tableProps.value.rows = newRows ?? []
      if (!isEmptyOrZero(models.value)) {
        _setDataInformationForm({
          mnemonic: models.value.mnemonic ?? '',
          payment_frequency: models.value.payment_frequency ?? '',
          modality: models.value.modality ? 'Anticipada' : 'Vencida',
          flow_type: models.value.flow_type ? 'Regular' : 'Irregular',
          details: tableProps.value.rows.map((row) => ({
            date: row.date,
            percentage: row.percentage,
            origin: row.origin,
          })),
        } as IAmortizationTitleTable)
      }
    },
    { deep: true }
  )

  let lastSyncedModels = JSON.stringify(models.value)

  watch(
    () => models.value,
    (newModels) => {
      const currentModels = JSON.stringify(newModels)
      if (currentModels !== lastSyncedModels) {
        lastSyncedModels = currentModels
        if (!isEmptyOrZero(newModels)) {
          _setDataInformationForm({
            mnemonic: models.value.mnemonic ?? '',
            payment_frequency: newModels.payment_frequency ?? '',
            modality: newModels.modality ? 'Anticipada' : 'Vencida',
            flow_type: newModels.flow_type ?? 'Regular',
            maturity_date: newModels.maturity_date ?? '',
            issue_date: newModels.issue_date ?? '',
            details: tableProps.value.rows.map((row) => ({
              date: row.date,
              percentage: row.percentage,
              origin: row.origin,
            })),
          } as IAmortizationTitleTable)
        } else {
          _setDataInformationForm(null)
        }
      }
    },
    { deep: true }
  )

  return {
    tableProps,
    models,
    showModal,
    uploadProps,
    interest_rate_payment_frequency,
    isin_code_mnemonics,
    issueDate,
    maturityDate,
    UploadShow,
    modalRef,
    totalPercentage,
    isOriginUpload,
    periodicityOptions,
    flowTypeBoolean,
    deleteFiles,
    createDataTables,
    removeDataTableRow,
    openModal,
    downloadTemplateExcel,
    validateImportFile,
    rejectedFiles,
    cancelFunction,
    dateInputKey,
    isDateDisabled,
    disableOutsideRange,
    dateInRangeRule,
    periodicityRule,
    coerceDateOnInput,
  }
}
