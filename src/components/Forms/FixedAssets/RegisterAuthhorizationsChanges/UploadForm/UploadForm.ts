// Vue
import { ref, computed, watch, toRefs } from 'vue'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import {
  IFixedAssetNoveltyDocument,
  IFileSignedPayload,
} from '@/interfaces/customs/fixed-assets/v1/Register-Authorization-Changes'

// Composables
import { useUtils } from '@/composables/useUtils'

// components
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useS3Documents } from '@/composables/useS3Documents'

// Stores
import { useFixedAssetsNoveltiesStore } from '@/stores/fixed-assets/register-authorization-changes'

const useFixedAssetsNoveltyDocumentsForm = (props: {
  noveltyStatus: 'REGISTERED' | 'AUTHORIZED' | 'CANCELED'
  documents?: IFixedAssetNoveltyDocument[]
}) => {
  const { noveltyStatus } = toRefs(props)
  const documents = ref<IFixedAssetNoveltyDocument[]>([])
  const groupToken = ref<string>(crypto.randomUUID())

  const MAX_FILE_SIZE_MB = 30
  const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'docx']
  const pagination = ref({
    page: 1,
    rowsPerPage: 20,
  })

  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  const { _fileSignedAction, _fileSignedValidateAction } =
    useFixedAssetsNoveltiesStore('v1')

  const isReadonly = computed(() => noveltyStatus.value !== 'REGISTERED')
  const hasDocuments = computed(() => documents.value.length > 0)

  const { _saveDocumentsS3 } = useS3Documents()

  const visibleDocuments = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
    const end = start + pagination.value.rowsPerPage
    return documents.value.slice(start, end)
  })

  const documentsTable = ref<IBaseTableProps<IFixedAssetNoveltyDocument>>({
    title: 'Documentos asociados',
    loading: false,
    columns: [
      {
        name: 'file_name',
        label: 'Nombre del documento',
        field: 'file_name',
        align: 'left',
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: () => '',
        align: 'center',
      },
    ],
    rows: [],
    pages: {
      currentPage: pagination.value.page,
      lastPage: 1,
    },
  })

  const syncTable = () => {
    documentsTable.value.rows = visibleDocuments.value
    documentsTable.value.pages = {
      currentPage: pagination.value.page,
      lastPage: Math.max(
        1,
        Math.ceil(documents.value.length / pagination.value.rowsPerPage)
      ),
    }
  }

  const documentsSource = computed<IFixedAssetNoveltyDocument[]>(() => {
    return props.documents ?? []
  })

  watch(
    documentsSource,
    (newVal) => {
      if (!newVal.length) return

      documents.value = [...newVal]
      syncTable()
    },
    { immediate: true }
  )

  const validateFile = (file: File): string | null => {
    const extension = file.name.split('.').pop()?.toLowerCase()

    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return 'Formato de archivo no permitido'
    }

    const sizeMb = file.size / (1024 * 1024)
    if (sizeMb > MAX_FILE_SIZE_MB) {
      return `El archivo supera el tamaño máximo permitido (${MAX_FILE_SIZE_MB} MB)`
    }

    const duplicated = documents.value.some(
      (doc) => doc.file_name === file.name
    )
    if (duplicated) {
      return 'No se permite repetir el nombre del archivo'
    }

    return null
  }

  const addFiles = async (files: File[]) => {
    if (isReadonly.value || !files.length) return

    const file = files[0]
    const error = validateFile(file)
    if (error) return

    openMainLoader(true)

    const payload: IFileSignedPayload = {
      group_token: groupToken.value,
      files: [
        {
          name: file.name,
          file_type: file.name.split('.').pop() ?? '',
          file_size: file.size,
        },
      ],
    }

    const signedResponse = await _fileSignedAction(payload)
    if (!signedResponse?.length) {
      openMainLoader(false)
      return
    }

    const signedFile = signedResponse[0]
    const documentId = signedFile.document_id
    const uploadUrl = signedFile.upload_url

    if (!uploadUrl || !documentId) {
      openMainLoader(false)
      return
    }

    await _saveDocumentsS3([uploadUrl], [file], false)

    documents.value.push({
      id: documentId,
      file,
      file_name: file.name,
      document_type: 'SOPORTE',
      size_mb: Number((file.size / (1024 * 1024)).toFixed(2)),
      document_id: documentId,
    })

    syncTable()

    await _fileSignedValidateAction({
      document_ids: [documentId],
    })

    openMainLoader(false)
  }

  const removeDocument = (id: number) => {
    if (isReadonly.value) return

    documents.value = documents.value.filter((doc) => doc.id !== id)

    if (pagination.value.page > 1 && visibleDocuments.value.length === 0) {
      pagination.value.page--
    }

    syncTable()
  }

  const viewDocument = (file: File) => {
    const url = URL.createObjectURL(file)
    window.open(url, '_blank')
    URL.revokeObjectURL(url)
  }

  const updatePage = (page: number) => {
    pagination.value.page = page
    syncTable()
  }

  const updateRowsPerPage = (rows: number) => {
    pagination.value.rowsPerPage = rows
    pagination.value.page = 1
    syncTable()
  }

  const getDocumentsPayload = () => {
    if (!documents.value.length) return null

    return {
      document_ids: documents.value.map((d) => d.document_id ?? d.id),
      group_token: groupToken.value,
    }
  }

  return {
    documentsTable,
    isReadonly,
    hasDocuments,
    defaultIconsLucide,
    addFiles,
    removeDocument,
    viewDocument,
    updatePage,
    updateRowsPerPage,
    getDocumentsPayload,
  }
}

export default useFixedAssetsNoveltyDocumentsForm
