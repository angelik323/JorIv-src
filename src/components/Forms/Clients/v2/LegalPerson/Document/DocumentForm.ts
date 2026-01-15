import { computed, reactive, ref, watch } from 'vue'
import { useClientsStore } from '@/stores/clients'
import {
  IGeneratePresignedUrlClient,
  IClientsDocuments,
} from '@/interfaces/customs/clients/Clients'
import { IDocumentIndirectForm, IClientLegalPersonIndirectTributaryForm } from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import { ActionType } from '@/interfaces/global'

import { QTable } from 'quasar'
import { defaultIcons, downloadFile } from '@/utils'
import {
  useAlert,
  useMainLoader,
  useS3Documents,
  useUtils,
} from '@/composables'

const useDocumentForm = (
  props: {
    action: ActionType
    data?: IDocumentIndirectForm | null
    tributaryDataForm: IClientLegalPersonIndirectTributaryForm | null
  },
  emit: Function
) => {
  const { _generatePresignedUrl } = useClientsStore('v2')
  const { _saveDocumentsS3 } = useS3Documents()

  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { isEmptyOrZero } = useUtils()

  const formDocument = ref<HTMLFormElement | null>(null)

  const initialModelsValues: IDocumentIndirectForm = {
    documents: [],
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  // DOCUMENTOS ESPERADOS
  const dataUpload: Array<{
    position: number
    class: string
    title: string
    subtitle: string
    required: boolean
    file: File | string | null
    id: number | null
  }> = [
    {
      position: 0,
      class: 'mt-1',
      title: 'Copia de documento de identidad representante legal',
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
      required: props.tributaryDataForm?.files_tax_return ?? false,
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
      title:
        'Copia del documento de identificación de las personas autorizadas con firma registrada y documento suscrito por el representante legal que autorice a dichas personas',
      subtitle: '',
      required: true,
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
      title: 'Formato w8, w9',
      subtitle:
        '(O certificaciones que haya lugar por la regulación tributaria internacional)',
      required: true,
      file: null,
      id: null,
    },
    {
      position: 6,
      class: 'mt-1',
      title: 'Certificado de existencia y representación legal',
      subtitle: '(Con expedición no inferior a un mes)',
      required: true,
      file: null,
      id: null,
    },
    {
      position: 7,
      class: 'mt-1',
      title: 'Listado de miembros de junta directiva',
      subtitle:
        'Si supera el número de terceros por relacionar en los campos disponibles',
      required: true,
      file: null,
      id: null,
    },
    {
      position: 8,
      class: 'mt-1',
      title: 'Listado opcional de accionistas asociados con >5% del capital',
      subtitle:
        'Con totalidad de los campos relacionados en la sección 7 de este formulario o adjunte el registro único de beneficiarios finales si excede el límite de campos disponibles.',
      required: false,
      file: null,
      id: null,
    },
  ]

  // TABLA
  const tableProperties = reactive({
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
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: computed(() => models.value.documents),
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // SUBIR DOCUMENTO
  const handleFileChange = async (
    file: File,
    document_type: string,
    required: boolean
  ) => {
    const payload: IGeneratePresignedUrlClient = {
      document_type,
      third_party_category: 'juridica',
      name: file.name,
    }

    const response = await _generatePresignedUrl(payload)
    if (!response) return

    tableProperties.loading = true

    await _saveDocumentsS3([response.upload_url], [file])

    const fileToAdd: IClientsDocuments = {
      id: response.document_id,
      document_type,
      file_url: file,
      is_required: required,
      is_validated: true,
      name: file.name,
    }

    models.value.documents.push(fileToAdd)

    updateDocumentsPreview()

    showAlert(`Documento: ${file.name} agregado correctamente`, 'success')
    tableProperties.loading = false
  }

  const redirectToViewDocument = async (file: IClientsDocuments) => {
    if (file.file_url instanceof File) {
      window.open(URL.createObjectURL(file.file_url), '_blank')
      return
    }

    openMainLoader(true)
    await downloadFile(String(file.file_url), file.name ?? 'documento')
    openMainLoader(false)
  }

  const deleteDocument = (document_type: string) => {
    models.value.documents = models.value.documents.filter(
      (d) => d.document_type !== document_type
    )
    updateDocumentsPreview()
  }

  const updateDocumentsPreview = () => {
    const docMap = new Map(
      models.value.documents.map((doc) => [doc.document_type, doc.file_url])
    )

    dataUpload.forEach((item) => {
      item.file = docMap.get(item.title) ?? null
    })
  }

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
      updateDocumentsPreview()
    },
    { deep: true, immediate: true }
  )

  return {
    dataUpload,
    formDocument,
    tableProperties,
    defaultIcons,
    handleFileChange,
    redirectToViewDocument,
    deleteDocument,
  }
}

export default useDocumentForm
