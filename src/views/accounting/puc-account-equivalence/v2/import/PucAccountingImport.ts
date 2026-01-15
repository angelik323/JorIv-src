import { useAlert, useMainLoader } from '@/composables'
import {
  IAccountingEquivalenceFailures,
  IAccountEquivalenceRowV2,
} from '@/interfaces/customs'
import { IUploadedFile } from '@/interfaces/global'
import {
  usePucAccountEquivalenceStore,
  useAccountingResourceStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const MAX_FILE_SIZE_MB = 5

export const usePucAccountingImport = () => {
  const { total_count, failures_list, validate_list } = storeToRefs(
    usePucAccountEquivalenceStore('v2')
  )
  const {
    _validateImportFile,
    _setDataDocuments,
    _downloadTemplate,
    _downloadFailuresExcel,
    _createAccountEquivalence,
  } = usePucAccountEquivalenceStore('v2')
  const { showAlert } = useAlert()
  const { source_account_structures } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const modalRef = ref()
  const alertModalRef = ref()
  const attachDocumentRef = ref()
  const statusImport = ref(false)
  const isFileTooLarge = (sizeMB: number): boolean => sizeMB > MAX_FILE_SIZE_MB
  const fileName = ref('')
  const progressValue = ref(0)
  const isUploading = ref(false)
  const models = ref<{ documents: string }>({ documents: '' })
  const dinamicButton = ref(false)

  const alertModalConfig = ref({
    title: 'El archivo presentó errores',
    description: '¿Desea procesar parcialmente?',
    id: null as number | null,
  })

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: false,
    bordered: false,
    accept: '.xlsx',
  }
  const headerProps = {
    title: 'Importar PUC',
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
        label: 'Configuración PUC equivalente - fiscal',
        route: 'PucAccountEquivalenceList',
      },
      {
        label: 'Importar',
        route: 'PucAccountEquivalenceImport',
      },
    ],
  }

  const modelPuc = ref<{
    source_structure_id: string | number | undefined
    source_name: string | null
  }>({
    source_structure_id: undefined,
    source_name: null,
  })

  const tableValidate = ref({
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
  const validateImportFile = async (file?: IUploadedFile[]) => {
    if (!file) return
    isUploading.value = true

    const newFileSizeMB = file[0].size / (1024 * 1024)
    if (isFileTooLarge(newFileSizeMB)) {
      handleLargeFile()
      return
    }

    fileName.value = file[0].name
    const auxFile = handleFileObjectToUrlConversion(file[0] as never)
    models.value.documents = auxFile

    tableValidate.value.rows = [
      {
        id: 1,
        name: file[0].name,
        total: 0,
        status_id: 20,
      },
    ]

    _setDataDocuments(file[0])
    await changeBarNumber(50)
    statusImport.value = await _validateImportFile()
    await changeBarNumber(100)
    if (!statusImport.value) {
      tableValidate.value.rows[0].status_id = 30
      dinamicButton.value = true
      showAlert(
        '¡Error al validar el archivo! Por favor, revise el formato y los datos.',
        'error'
      )
      return
    }

    tableValidate.value.rows[0].status_id = 29
    tableValidate.value.rows[0].total = total_count.value || 0
  }

  const handleLargeFile = () => {
    models.value.documents = ''
    tableValidate.value.rows = []
    progressValue.value = 0
    fileName.value = ''
    isUploading.value = false
  }
  const openAlertModal = () => {
    alertModalRef.value.openModal()
  }
  const handleFileObjectToUrlConversion = (file: File) =>
    file instanceof File ? URL.createObjectURL(file) : ''

  const rejectedFiles = (fileRejected: any) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    deleteFiles()
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

  const deleteFiles = () => {
    attachDocumentRef.value?.removeFilesRemote()
    tableValidate.value.rows = []
    progressValue.value = 0
    fileName.value = ''
    isUploading.value = false
    total_count.value = 0
  }

  const downloadFailures = async () => {
    const payload: IAccountingEquivalenceFailures[] = failures_list.value.map(
      (item) => ({
        index: item.index,
        source_structure_code: item.source_structure_code,
        source_account_code: item.source_account_code,
        equivalent_structure_code: item.equivalent_structure_code,
        equivalent_account_code: item.equivalent_account_code,
        errors: item.errors,
      })
    )
    await _downloadFailuresExcel(payload)
    total_count.value = 1
  }

  const donwloadExcel = async () => {
    await _downloadTemplate(modelPuc.value.source_structure_id)
  }

  const deleteFile = (fileId: number) => {
    attachDocumentRef.value?.removeFile(fileId)
    tableValidate.value.rows = []
    progressValue.value = 0
    fileName.value = ''
    isUploading.value = false
  }

  const optionsButtonValidate = async () => {
    const validatedList = validate_list.value as IAccountEquivalenceRowV2[]

    if (dinamicButton.value) {
      openAlertModal()
      modalRef.value = !modalRef.value
      return
    }
    openMainLoader(true)
    const toNumber = (v: string | number | null | undefined): number | null => {
      if (v === null || v === undefined || v === '') return null
      const n = Number(v)
      return Number.isNaN(n) ? null : n
    }

    const payload = {
      equivalences: validatedList.map((item) => ({
        source_structure_id: toNumber(item.source_structure_id),
        source_account_id: toNumber(item.source_account_id),
        equivalent_structure_id: toNumber(item.equivalent_structure_id),
        equivalent_account_id: toNumber(item.equivalent_account_id),
      })),
    }
    await _createAccountEquivalence(payload)
    openMainLoader(false)
    router.push({ name: 'PucAccountEquivalenceList' })
  }

  const onSubmitModal = async () => {
    const validatedList = validate_list.value as IAccountEquivalenceRowV2[]

    modalRef.value = false
    openMainLoader(true)
    const toNumber = (v: string | number | null | undefined): number | null => {
      if (v === null || v === undefined || v === '') return null
      const n = Number(v)
      return Number.isNaN(n) ? null : n
    }

    const payload = {
      equivalences: validatedList.map((item) => ({
        source_structure_id: toNumber(item.source_structure_id),
        source_account_id: toNumber(item.source_account_id),
        equivalent_structure_id: toNumber(item.equivalent_structure_id),
        equivalent_account_id: toNumber(item.equivalent_account_id),
      })),
    }
    await _createAccountEquivalence(payload)
    openMainLoader(false)

    showAlert('Archivo procesado parcialmente con éxito', 'success')
    router.push({ name: 'PucAccountEquivalenceList' })
  }

  onMounted(async () => {
    await _getResources({
      accounting: ['source_account_structures'],
    })
  })

  onUnmounted(() => {
    _resetKeys({
      accounting: ['source_account_structures'],
    })
  })

  watch(
    () => modelPuc.value.source_structure_id,
    (newId) => {
      const structure = source_account_structures.value.find(
        (item) => item.id === newId
      )
      modelPuc.value.source_name = structure
        ? structure.structure ?? null
        : null
    }
  )

  return {
    validateImportFile,
    isFileTooLarge,
    handleLargeFile,
    handleFileObjectToUrlConversion,
    rejectedFiles,
    changeBarNumber,
    deleteFiles,
    deleteFile,
    donwloadExcel,
    downloadFailures,
    optionsButtonValidate,
    onSubmitModal,
    tableValidate,
    uploadProps,
    isUploading,
    progressValue,
    headerProps,
    source_account_structures,
    modelPuc,
    total_count,
    dinamicButton,
    modalRef,
    alertModalConfig,
    alertModalRef,
  }
}
