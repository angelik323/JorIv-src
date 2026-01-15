// Vue
import { ref, computed } from 'vue'

// Composables
import { useMainLoader } from '@/composables'

// Stores
import { useSeizuresStore } from '@/stores/seizures'

// Interfaces / Types
import { IBaseTableProps } from '@/interfaces/global'
import {
  IMassiveUploadFile,
  IMassiveSeizureDetail,
  IMassiveValidationResponse,
  IMassiveValidatedRow,
  IMassiveValidationError,
} from '@/interfaces/customs/seizures/Seizures'

const useSeizuresFormMassive = () => {
  const uploadedRows = ref<IMassiveUploadFile[]>([])
  const detailRows = ref<IMassiveSeizureDetail[]>([])
  const validatedRows = ref<IMassiveValidatedRow[]>([])
  const massiveErrors = ref<IMassiveValidationError[]>([])

  const isValid = ref(false)
  const progressValue = ref(0)
  const { openMainLoader } = useMainLoader()

  const seizuresStore = useSeizuresStore('v1')
  const {
    _validateMassiveTemplate,
    _downloadMassiveTemplate,
    _exportDetailMassiveAction,
  } = seizuresStore

  const uploadTable = ref<IBaseTableProps<IMassiveUploadFile>>({
    title: 'Importar plantilla',
    loading: false,
    columns: [
      {
        name: 'file_name',
        label: 'Nombre del archivo',
        field: 'file_name',
        align: 'left',
      },
      {
        name: 'total_records',
        label: 'Total de registros',
        field: 'total_records',
        align: 'center',
      },
      {
        name: 'status',
        label: 'Estado del cargue',
        field: () => '',
        align: 'center',
        style: 'min-width: 300px; max-width: 300px; white-space: break-spaces;',
      },
      { name: 'actions', label: 'Acciones', field: () => '', align: 'center' },
    ],
    rows: uploadedRows.value,
    pages: { currentPage: 1, lastPage: 1 },
  })

  const detailTable = ref<IBaseTableProps<IMassiveSeizureDetail>>({
    title: 'Detalle de embargo masivo',
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'center' },
      {
        name: 'process_number',
        label: 'Número de proceso',
        field: 'process_number',
        align: 'left',
      },
      {
        name: 'claimant',
        label: 'Demandante',
        field: 'claimant',
        align: 'left',
      },
      {
        name: 'defendant',
        label: 'Demandado',
        field: 'defendant',
        align: 'left',
      },
      {
        name: 'value_seizure',
        label: 'Valor del embargo',
        field: (row) =>
          new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(row.value_seizure),
        align: 'right',
      },
      {
        name: 'validation_status',
        label: 'Validación',
        field: 'validation_status',
        align: 'center',
      },
    ],
    rows: detailRows.value,
    pages: { currentPage: 1, lastPage: 1 },
  })

  const hasFileLoaded = computed(() => uploadedRows.value.length > 0)
  const hasDetailRows = computed(() => detailRows.value.length > 0)

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
      }, 80)
    })
  }

  const downloadTemplate = async () => {
    openMainLoader(true)
    const blob = await _downloadMassiveTemplate()
    if (!blob) {
      openMainLoader(false)
      return
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'plantilla_embargos_masivo.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    openMainLoader(false)
  }

  const downloadDetailMassive = async () => {
    if (!massiveErrors.value.length) return

    openMainLoader(true)

    const payload = {
      data: {
        errors: massiveErrors.value,
      },
    }

    const blob = await _exportDetailMassiveAction(payload)
    if (!blob) {
      openMainLoader(false)
      return
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'detalle_embargos_masivo.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    openMainLoader(false)
  }

  const addedFiles = async (files: File[]) => {
    if (!files.length) return

    const file = files[0]
    progressValue.value = 0

    uploadedRows.value = [
      {
        id: Date.now(),
        file,
        file_name: file.name,
        total_records: 0,
        status: 'LOADING',
      },
    ]

    uploadTable.value.rows = uploadedRows.value
    await changeBarNumber(70)

    const formData = new FormData()
    formData.append('file', file)

    const response = (await _validateMassiveTemplate(
      formData
    )) as IMassiveValidationResponse | null

    await changeBarNumber(100)
    progressValue.value = 1

    if (!response) {
      uploadedRows.value[0].status = 'ERROR'
      isValid.value = false
      return
    }

    massiveErrors.value =
      response.errors?.map((error) => ({
        ...error,
        errorsData: {
          ...error.errorsData,
          valor_embargo: error.errorsData?.valor_embargo ?? 0,
        },
      })) ?? []

    detailRows.value =
      response.errors?.map((error, index) => ({
        id: index + 1,
        process_number: error.errorsData?.numero_proceso ?? `Fila ${error.row}`,
        claimant: error.errorsData?.demandante ?? '-',
        defendant: error.errorsData?.demandado ?? '-',
        value_seizure: Number(error.errorsData?.valor_embargo ?? 0),
        validation_status: 'ERROR',
      })) ?? []

    detailTable.value.rows = detailRows.value
    validatedRows.value = response.rows ?? []

    uploadedRows.value[0].total_records =
      (response.rows?.length ?? 0) + (response.errors?.length ?? 0)

    uploadedRows.value[0].status = validatedRows.value.length
      ? 'SUCCESS'
      : 'ERROR'
    isValid.value = uploadedRows.value[0].status === 'SUCCESS'
  }

  const removeUploadedFile = () => {
    uploadedRows.value = []
    detailRows.value = []
    validatedRows.value = []
    massiveErrors.value = []
    uploadTable.value.rows = []
    detailTable.value.rows = []
    progressValue.value = 0
    isValid.value = false
  }

  const getMassivePayload = () => {
    if (!validatedRows.value.length) return null
    return { rows: validatedRows.value }
  }

  return {
    uploadTable,
    detailTable,
    hasFileLoaded,
    hasDetailRows,
    isValid,
    downloadDetailMassive,
    getMassivePayload,
    downloadTemplate,
    addedFiles,
    removeUploadedFile,
    progressValue,
  }
}

export default useSeizuresFormMassive
