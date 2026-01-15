import { useAlert, useMainLoader, useUtils } from '@/composables'
import { IUploadedFile } from '@/interfaces/global/File'
import { useChartAccountsStore } from '@/stores'
import { handleFileObjectToUrlConversion, urlToFile } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useChartAccountsImport = () => {
  const MAX_FILE_SIZE_MB = 5

  // utils
  const { downloadFile } = useUtils()

  // router
  const router = useRouter()
  const route = useRoute()
  const structureId = computed(() => Number(route.query.structureId ?? null))

  // imports
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const {
    _importChartAccount,
    _getInfoQueue,
    _setDataDocuments,
    _getFormatExcel,
    _clearDataQueue,
  } = useChartAccountsStore('v1')

  const { total_records, url_file } = storeToRefs(useChartAccountsStore('v1'))

  // refs
  const attachDocumentRef = ref()
  const fileName = ref('')
  const models = ref<{ documents: string }>({ documents: '' })
  const progressValue = ref(0)
  const statusImport = ref(false)

  // props
  const headerProps = {
    title: 'Importar plan de cuentas',
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
        label: 'Plan de cuentas',
        route: 'ChartAccountsList',
      },
      {
        label: 'Crear',
        route: 'ChartAccountsCreate',
      },
      {
        label: 'Importar',
        route: 'ChartAccountsImport',
      },
      {
        label: `${structureId.value}`,
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

  // actions

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

    await changeBarNumber(25)
    const init_queue = await _importChartAccount(structureId.value)
    await changeBarNumber(50)

    if (!init_queue) return

    const interval = setInterval(async () => {
      if (!statusImport.value) {
        const state = await _getInfoQueue()

        statusImport.value = state === 'Procesado' || state === 'Errores'

        if (state === 'Procesado') {
          clearInterval(interval)

          tableProps.value.rows[0].status_id = 29
          tableProps.value.rows[0].total = total_records
        }
        if (state === 'Errores') {
          clearInterval(interval)

          tableProps.value.rows[0].status_id = 30
          progressValue.value = 0
        }
      }
    }, 5000)
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

    _clearDataQueue()
  }

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const downloadTemplateExcel = async () => {
    await _getFormatExcel()
  }

  const downloadResponseExcel = async () => {
    await downloadFile(url_file.value?.url, url_file.value?.name)
  }

  const onSubmit = async () => {
    router.push({
      name: 'ChartAccountsCreate',
    })
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
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

  watch(
    () => structureId.value,
    (val) => {
      if (!val) {
        showAlert(
          'Asegúrese de elegir una estructura antes.',
          'error',
          undefined,
          5000
        )
      }
    },
    { immediate: true }
  )

  return {
    headerProps,
    uploadProps,
    attachDocumentRef,
    models,
    structureId,
    tableProps,
    progressValue,
    statusImport,

    addedFiles,
    rejectedFiles,
    deleteFiles,
    onSubmit,
    downloadTemplateExcel,
    downloadResponseExcel,
  }
}

export default useChartAccountsImport
