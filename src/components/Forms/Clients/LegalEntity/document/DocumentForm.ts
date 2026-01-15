/* eslint-disable @typescript-eslint/no-explicit-any */

import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores'
import {
  IClientsDocuments,
  IGeneratePresignedUrlClient,
} from '@/interfaces/customs/Clients'
import { QTable } from 'quasar'
import { defaultIcons, downloadFile } from '@/utils'
import { useAlert, useMainLoader, useS3Documents } from '@/composables'

const useDocumentForm = (props: any) => {
  const { data_document_legal_form, data_tributary_legal_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataLegalCLientsDocument, _generatePresignedUrl } =
    useClientsStore('v1')
  const { _saveDocumentsS3 } = useS3Documents()

  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  const formDocument = ref()

  const fileInput = reactive<Record<string, HTMLInputElement | null>>({})

  const models = ref<{ files: IClientsDocuments[] }>({
    files: [],
  })

  const dataUpload: {
    position: number
    class: string
    title: string
    subtitle: string
    required: boolean
    file: File | null | string
    id: number | null | string
  }[] = [
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
      required: data_tributary_legal_form.value?.declare_income_tributary ?? false,
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
        'Certificación o que haya lugar por la regulación tributaria internacional',
      required: false,
      file: null,
      id: null,
    },
    {
      position: 6,
      class: 'mt-1',
      title: 'Certificado de existencia y representación legal',
      subtitle: 'Con expedición no inferior a un mes',
      required: false,
      file: null,
      id: null,
    },
    {
      position: 7,
      class: 'mt-1',
      title: 'Listado de miembros de junta directiva',
      subtitle: 'Si supera el número de terceros por relacionar en los campos',
      required: false,
      file: null,
      id: null,
    },
    {
      position: 8,
      class: 'mt-1',
      title:
        'Listado opcional de accionistas o asociados con el >5% del capital',
      subtitle:
        'Con la totalidad de los campos relacionados en la sección 7 de este formulario o adjunte el registro único de beneficiarios finales si excede el límite de campos disponibles',
      required: false,
      file: null,
      id: null,
    },
  ]

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
    rows: computed(() => models.value?.files || []),
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const handleFileChange = async (
    file: File,
    name: string,
    required: boolean
  ) => {
    const payload: IGeneratePresignedUrlClient = {
      document_type: name,
      third_party_category: 'juridica',
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

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_document_legal_form.value ? _setValueModel : setFormView,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: any = props.data
    if (data) {
      models.value.files = data?.documents.map((element: any) => ({
        document_type: element.document_type,
        name: element.original_name,
        file_url: element.file_url,
        is_required: element.is_required,
        is_validated: element.is_validated,
        id: element.id,
      })) as IClientsDocuments[]
      updateDocuments()
    }
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

  const updateDocumentTable = (event: any, document_type: string) => {
    models.value.files.forEach((element) => {
      if (element.document_type === document_type) {
        element.file_url = event.target.files[0]
      }
    })
    updateDocuments()
  }

  const updateDocuments = () => {
    const files = models.value?.files ?? []

    const documentMap = new Map(
      files.map((doc) => [doc.document_type, doc.file_url])
    )

    dataUpload.forEach((element) => {
      element.file = documentMap.get(element.title) ?? null
    })
  }

  const _setValueModel = () => {
    if (data_document_legal_form.value) {
      models.value = { ...data_document_legal_form.value }
    }
  }

  const clearForm = () => {
    models.value.files = []
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => models.value.files,
    () => {
      if (isEmpty(models.value)) {
        _setDataLegalCLientsDocument(null)
      } else {
        _setDataLegalCLientsDocument({
          files: models.value.files,
        })
        updateDocuments()
      }
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  return {
    dataUpload,
    formDocument,
    data_document_legal_form,
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
