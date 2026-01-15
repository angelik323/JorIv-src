// quasar - vue - pinia
import { QTable } from 'quasar'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useAlert } from '@/composables'

// interfaces
import { IUploadedFile } from '@/interfaces/global'

// stores
import { useRecordTransfersStore } from '@/stores'

// utils
import { handleFileObjectToUrlConversion, urlToFile } from '@/utils'

export const useDataUpload = () => {
  const MAX_FILE_SIZE_MB = 5

  // imports
  const { showAlert } = useAlert()

  const { _getFormatExcel, _importRecordTransfers, _setDataDocuments } =
    useRecordTransfersStore('v1')

  const { total_records } = storeToRefs(useRecordTransfersStore('v1'))

  // refs
  const attachDocumentRef = ref()
  const fileName = ref('')
  const models = ref<{ documents: string }>({ documents: '' })
  const progressValue = ref(0)
  const statusImport = ref(false)

  // props
  const uploadProps = {
    title: 'Documento adjunto',
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
    pages: { currentPage: ref(1), lastPage: ref(1) },
    rows: [] as any[],
  })

  const addedFiles = async (file: IUploadedFile[]) => {
    statusImport.value = false
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
        name: file[0].name,
        total: 0,
        status_id: 20,
      },
    ]
    await changeBarNumber(50)
    statusImport.value = await _importRecordTransfers()
    await changeBarNumber(100)

    if (!statusImport.value) {
      tableProps.value.rows[0].status_id = 30
      return
    }

    tableProps.value.rows[0].status_id = 29
    tableProps.value.rows[0].total = total_records.value
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
      }, 80)
    })
  }

  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const handleLargeFile = () => {
    showAlert('¡El archivo supera el tamaño máximo permitido (5mb)!', 'error')
    deleteFiles()
  }

  const rejectedFiles = (fileRejected: any) => {
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

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  // watch
  watch(
    () => models.value,
    async () => {
      if (isEmpty(models.value)) {
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

  return {
    uploadProps,
    attachDocumentRef,
    models,
    tableProps,
    progressValue,
    statusImport,

    addedFiles,
    rejectedFiles,
    deleteFiles,
    downloadTemplateExcel,
  }
}
