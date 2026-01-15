// Vue - router - quasar
import { ref, computed, onBeforeUnmount } from 'vue'
import { QTable } from 'quasar'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Interfaces - contants
import {
  IAuthorizationItems,
  IFileUploadItem,
} from '@/interfaces/customs/sarlaft/CautelarListsMassQuery'
import { IBaseTableProps } from '@/interfaces/global'
import {
  FileChargingStatus,
  FileShowStatusId,
} from '@/interfaces/global/Status'
import { POLLING_CONFIG } from '@/constants/resources/sarlaft'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useMassConsultationPrecautionaryListsStore } from '@/stores/sarlaft/mass-consultation-precautionary-lists'
import type { IFileUploadStatus } from '@/interfaces/customs/sarlaft/CautelarListsMassQuery'

const useCautelarListsMassQueryView = () => {
  const { defaultIconsLucide } = useUtils()

  const {
    _downloadMatches,
    _downloadErrors,
    _downloadTemplate,
    _checkFileUploadStatus,
    _uploadMassFile,
  } = useMassConsultationPrecautionaryListsStore('v1')

  const headerProps = {
    title: 'Consulta masiva en listas cautelares',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Sarlaft',
      },
      {
        label: 'Consulta masiva en listas cautelares',
        route: 'SarlaftMassConsultationPrecautionaryLists',
      },
    ],
  }

  let fileIdCounter = 0
  const abortController = ref<AbortController | null>(null)

  const uploadedFiles = ref<IFileUploadItem[]>([])
  const tableProps = ref<IBaseTableProps<IAuthorizationItems>>({
    loading: false,
    columns: [
      {
        name: 'authorization_number',
        label: 'No. autorización',
        field: (row) => row.authorization_number ?? '—',
        align: 'left',
        sortable: true,
      },
      {
        name: 'identification_number',
        label: 'Número de identificación',
        field: (row) => row.identification_number ?? '—',
        align: 'left',
        sortable: true,
      },
      {
        name: 'name',
        label: 'Nombre',
        field: 'name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'level_match_id',
        label: 'Nivel de coincidencia',
        field: 'level_match_id',
        align: 'center',
        sortable: true,
      },
      {
        name: 'matching_system',
        label: 'Sistema de coincidencia',
        field: 'matching_system',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })
  const showResults = ref(false)

  const currentAuthorizationNumber = ref<string>('0')
  const totalRecords = ref<number>(0)
  const totalMatches = ref<number>(0)
  const resetUploadKey = ref<number>(0)

  const fileTableProps = computed(() => ({
    loading: false,
    columns: [
      {
        name: 'index',
        label: '#',
        field: 'index',
        align: 'left',
        sortable: false,
      },
      {
        name: 'name',
        label: 'Nombre del archivo',
        field: 'name',
        align: 'left',
        sortable: false,
      },
      {
        name: 'totalRegisters',
        label: 'Total de registros',
        field: 'totalRegisters',
        align: 'left',
        sortable: false,
      },
      {
        name: 'state',
        label: 'Estado',
        field: 'state',
        align: 'center',
        sortable: false,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
      },
    ] as QTable['columns'],
    rows: uploadedFiles.value,
  }))

  // Actualizar estado del archivo
  const updateFileState = (
    fileId: number,
    updates: Partial<IFileUploadItem>
  ): boolean => {
    const index = uploadedFiles.value.findIndex((f) => f.id === fileId)
    if (index === -1) return false

    uploadedFiles.value[index] = {
      ...uploadedFiles.value[index],
      ...updates,
    }
    return true
  }

  // Helper: Sleep
  const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms))

  // Handlers de estado
  const handleLoadingState = (
    fileId: number,
    currentProgress: number
  ): void => {
    if (currentProgress >= POLLING_CONFIG.PROGRESS_MAX_LOADING) {
      return
    }

    updateFileState(fileId, {
      progress: Math.min(
        currentProgress + POLLING_CONFIG.PROGRESS_INCREMENT,
        POLLING_CONFIG.PROGRESS_MAX_LOADING
      ),
    })
  }

  const handleSuccessState = (
    fileId: number,
    fileStatus: IFileUploadStatus
  ): boolean => {
    updateFileState(fileId, {
      statusId: FileShowStatusId.SUCCESS,
      progress: 1,
      totalRegisters: fileStatus.info_file.rows_count,
      matchesCount: fileStatus.records_information.matches_count ?? 0,
      fileUploadStatus: fileStatus,
    })
    return true
  }

  const handleErrorState = (
    fileId: number,
    errorDetails: string | null
  ): boolean => {
    updateFileState(fileId, {
      statusId: FileShowStatusId.ERROR,
      progress: 0,
      errorDetails,
    })
    return true
  }

  const handleTimeout = (fileId: number): void => {
    updateFileState(fileId, {
      statusId: FileShowStatusId.ERROR,
      progress: 0,
    })
  }

  // Determinar acción según el estado del archivo
  const handleFileStatus = (
    fileId: number,
    fileStatus: IFileUploadStatus,
    currentProgress: number
  ): boolean => {
    const chargingStatus = fileStatus.info_file.charging_status_id
    if (chargingStatus === FileChargingStatus.LOADING) {
      handleLoadingState(fileId, currentProgress)
      return false
    }
    if (chargingStatus === FileChargingStatus.SUCCESS) {
      return handleSuccessState(fileId, fileStatus)
    }

    if (chargingStatus === FileChargingStatus.ERROR) {
      return handleErrorState(fileId, fileStatus.error_details)
    }

    return false
  }

  const onFileAdded = async (files: File[]) => {
    const file = files[0]

    const response = await _uploadMassFile({ file })

    if (!response?.cache_key) {
      resetUploadKey.value += 1
      return
    }

    fileIdCounter++
    const newFile: IFileUploadItem = {
      id: fileIdCounter,
      name: file.name,
      file: file,
      statusId: FileShowStatusId.PENDING,
      progress: 0,
      cacheKey: response.cache_key,
    }
    uploadedFiles.value.push(newFile)
    abortController.value = new AbortController()
    await pollFileStatus(
      newFile.id,
      response.cache_key,
      abortController.value.signal
    )
  }

  const pollFileStatus = async (
    fileId: number,
    cacheKey: string,
    signal: AbortSignal
  ): Promise<void> => {
    let attempts = 0

    const checkStatus = async (): Promise<boolean> => {
      if (signal.aborted) {
        return true
      }
      attempts++

      const fileStatus = await _checkFileUploadStatus(cacheKey.toString())

      if (!fileStatus) return false

      const file = uploadedFiles.value.find((f) => f.id === fileId)
      if (!file) return true

      return handleFileStatus(fileId, fileStatus, file.progress)
    }

    while (attempts < POLLING_CONFIG.MAX_ATTEMPTS) {
      if (signal.aborted) {
        return
      }
      const shouldStop = await checkStatus()
      if (shouldStop) return

      await sleep(POLLING_CONFIG.INTERVAL_MS)
    }

    handleTimeout(fileId)
  }

  const onDownloadFile = async (fileId: number, statusId: number) => {
    const file = uploadedFiles.value.find((f) => f.id === fileId)

    if (!file?.cacheKey) return
    if (statusId === FileShowStatusId.ERROR) {
      await _downloadErrors(file.cacheKey)
    } else {
      await _downloadMatches(file.cacheKey.toString())
    }
  }

  const onDownloadTemplate = async () => {
    await _downloadTemplate()
  }

  const showSearchButton = computed(() => {
    return (
      uploadedFiles.value?.length > 0 &&
      uploadedFiles.value.some((f) => f.statusId === FileShowStatusId.SUCCESS)
    )
  })

  const disableUploadFile = computed(() =>
    uploadedFiles.value.some((f) => f.statusId === FileShowStatusId.PENDING)
  )

  const getLatestSuccessfulFile = () => {
    return uploadedFiles.value
      .filter((f) => f.statusId === FileShowStatusId.SUCCESS)
      .sort((a, b) => b.id - a.id)[0]
  }

  const onSearch = () => {
    const successfulFile = getLatestSuccessfulFile()

    if (!successfulFile?.fileUploadStatus) return

    tableProps.value.loading = true
    showResults.value = true

    try {
      const status = successfulFile.fileUploadStatus

      tableProps.value.rows = status.register_match

      currentAuthorizationNumber.value = successfulFile.cacheKey || '0'
      totalRecords.value = status.info_file.rows_count
      totalMatches.value = status.records_information.matches_count || 0
    } finally {
      tableProps.value.loading = false
    }
  }

  const onDownloadMatchesFromResults = async () => {
    const successfulFile = getLatestSuccessfulFile()

    if (!successfulFile?.cacheKey || totalMatches.value === 0) return

    await _downloadMatches(successfulFile.cacheKey.toString())
  }

  onBeforeUnmount(() => {
    if (abortController.value) {
      abortController.value.abort()
    }
  })

  return {
    headerProps,
    defaultIconsLucide,
    tableProps,
    fileTableProps,
    uploadedFiles,
    excelIcon,
    showSearchButton,
    disableUploadFile,
    showResults,
    currentAuthorizationNumber,
    totalRecords,
    totalMatches,
    resetUploadKey,
    FileShowStatusId,
    onSearch,
    onFileAdded,
    onDownloadFile,
    onDownloadTemplate,
    onDownloadMatchesFromResults,
  }
}

export default useCautelarListsMassQueryView
