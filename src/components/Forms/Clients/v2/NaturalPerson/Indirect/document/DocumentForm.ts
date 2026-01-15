//Vue - Pinia - Router -Quasar
import { computed, reactive, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

//Stores
import { useClientsStore } from '@/stores/clients'

//Utils
import { defaultIcons, downloadFile } from '@/utils'

//Interfaces
import { ActionType } from '@/interfaces/global/Action'
import { ClientPersonType } from '@/interfaces/global/Clients'
import { ITributaryForm, IClientIndirectNaturalPepForm } from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'
import {
  IGeneratePresignedUrlClient,
  IClientsDocumentsWrapper,
  IClientsDocuments,
} from '@/interfaces/customs/clients/Clients'

//Composables
import {
  useAlert,
  useMainLoader,
  useS3Documents,
  useUtils,
} from '@/composables'

const useDocumentForm = (
  props: {
    action: ActionType
    data: IClientsDocumentsWrapper | null
    dataTributaryForm: ITributaryForm | null
    dataPepForm: IClientIndirectNaturalPepForm | null
  }, emit: Function) => {
  const { _generatePresignedUrl } = useClientsStore('v2')
  const { client_person_type } = storeToRefs(useClientsStore('v2'))

  const { isEmptyOrZero } = useUtils()
  const { _saveDocumentsS3 } = useS3Documents()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const formDocument = ref()
  const fileInput = reactive<Record<string, HTMLInputElement | null>>({})

  const models = ref<IClientsDocumentsWrapper>({
    files: [],
  })

  const indirectDocuments = [
    {
      position: 0,
      class: 'mt-1',
      title: 'RUT',
      subtitle: '',
      required: true,
      file: null,
      id: null,
    },
    {
      position: 1,
      class: 'mt-1',
      title: 'Cámara de comercio',
      subtitle: '',
      required: true,
      file: null,
      id: null,
    },
    {
      position: 2,
      class: 'mt-1',
      title: 'Cédula representante legal',
      subtitle: '',
      required: true,
      file: null,
      id: null,
    },
    {
      position: 3,
      class: 'mt-1',
      title: 'Certificado de antecedentes penales',
      subtitle: '',
      required: true,
      file: null,
      id: null,
    },
  ]

  const directDocuments = reactive([
    {
      position: 0,
      class: 'mt-1',
      title: 'Copia de documento de identidad',
      subtitle: '',
      required: true,
      file: null,
      id: null,
    },
    {
      position: 1,
      class: 'mt-1',
      title: 'Declaración de renta',
      subtitle: 'Último período',
      required: true,
      file: null,
      id: null,
    },
    {
      position: 2,
      class: 'mt-1',
      title:
        'Constancia ingresos/estados financieros certificados o dictaminados',
      subtitle: 'Con notas al último corte',
      required: true,
      file: null,
      id: null,
    },
    {
      position: 3,
      class: 'mt-1',
      title: 'Declaración de persona expuesta políticamente',
      subtitle: 'PEP',
      required:
        !!props.dataPepForm?.pep_info.is_pep ||
        !!props.dataPepForm?.pep_info_relative?.familiar_politician,
      file: null,
      id: null,
    },
    {
      position: 4,
      class: 'mt-1',
      title: 'RUT',
      subtitle: '',
      required: true,
      file: null,
      id: null,
    },
    {
      position: 5,
      class: 'mt-1',
      title: 'Soporte de responsabilidad tributaria en el extranjero',
      subtitle: '',
      required:
        !!props.dataTributaryForm?.tax_info.has_different_nationality,
      file: null,
      id: null,
    },
    {
      position: 6,
      class: 'mt-1',
      title:
        'Copia de documento de identidad mandatarios y autorización concepto mandatarios',
      subtitle: '',
      required: false,
      file: null,
      id: null,
    },
  ])

  const tableProperties = ref({
    title: 'Listado de documentos agregados',
    loading: false,
    columns: [
      {
        name: 'document_type',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: 'document_type',
        sortable: true,
        style: {
          'max-width': '400px',
          'min-width': '400px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'right',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: computed(() => models.value?.files || []),
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const clientNaturalTypeDirect = computed(() => client_person_type.value === ClientPersonType.NATURAL_DIRECT);
  const dataUpload = computed(() => {
    const files = models.value?.files ?? []
    const documentMap = new Map(
      files.map((doc) => [doc.document_type, doc.file_url])
    )

    const list = !clientNaturalTypeDirect.value
      ? indirectDocuments
      : directDocuments

    return list.map((element) => ({
      ...element,
      file: documentMap.get(element.title) ?? null,
    }))
  })

  const handleFileChange = async (
    file: File,
    name: string,
    required: boolean
  ) => {
    const payload: IGeneratePresignedUrlClient = {
      document_type: name,
      third_party_category: 'natural',
      name: file.name,
    }

    const response = await _generatePresignedUrl(payload)
    if (!response) return
    await _saveDocumentsS3([response.upload_url], [file])

    const fileToAdd = {
      document_type: name,
      is_required: required,
      file_url: file,
      is_validated: true,
      id: response?.document_id ?? null,
    }
    models.value.files.push(fileToAdd)

    showAlert(`Documento: ${file.name} agregado correctamente`, 'success')
  }

  const redirectToViewDocument = async (file: IClientsDocuments) => {
    const { file_url, name } = file

    if (file_url instanceof File) {
      const fileURL = URL.createObjectURL(file_url)
      window.open(fileURL, '_blank')
    } else {
      openMainLoader(true)
      await downloadFile(String(file_url), name)
      openMainLoader(false)
    }
  }

  const deleteDocument = (document_type: string) => {
    models.value.files.splice(
      models.value.files.findIndex(
        (item) => item.document_type === document_type
      ),
      1
    )

    updateDocuments()
  }

  const triggerFileInput = (documentType: string) => {
    if (fileInput[documentType]) {
      fileInput[documentType]?.click()
    }
  }

  const updateDocumentTable = (event: Event, document_type: string) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    models.value.files.forEach((element) => {
      if (element.document_type === document_type) {
        element.file_url = file
      }
    })

    updateDocuments()
  }

  const updateDocuments = () => {
    const files = models.value?.files ?? []

    const documentMap = new Map(
      files.map((doc) => [doc.document_type, doc.file_url])
    )

    dataUpload.value.forEach((element) => {
      element.file = documentMap.get(element.title) ?? null
    })
  }

  const _setValueModel = () => {
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      updateDocuments()
      emit('update:document-indirect-data-form', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    dataUpload,
    formDocument,
    tableProperties,
    defaultIcons,
    fileInput,
    handleFileChange,
    redirectToViewDocument,
    deleteDocument,
    updateDocumentTable,
    triggerFileInput,
  }
}

export default useDocumentForm
