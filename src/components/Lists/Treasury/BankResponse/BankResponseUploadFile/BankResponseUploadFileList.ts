import { ref, watch } from 'vue'
import { QTableProps, QRejectedEntry, QForm } from 'quasar'
import { storeToRefs } from 'pinia'

import {
  IBankResponseDocument,
  IBankResponseValidateForm,
} from '@/interfaces/customs'

import { useAlert, useUtils } from '@/composables'

import { useBankResponseStore } from '@/stores'

const useBankResponseUploadFileList = (
  props: { formRef?: QForm },
  emits: IBankResponseValidateForm
) => {
  const { defaultIconsLucide, handleFileObjectToUrlConversion, isEmptyOrZero } =
    useUtils()
  const { showAlert } = useAlert()

  const { _setBankResponseDocument } = useBankResponseStore('v1')
  const { bank_response_filter_form_response } = storeToRefs(
    useBankResponseStore('v1')
  )

  const attachDocumentRef = ref()
  const progressValue = ref(0)
  const models = ref<{ document: IBankResponseDocument | null }>({
    document: {
      is_new: false,
      url: '',
      name: '',
      size: 0,
      file: null,
    },
  })

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: false,
    bordered: false,
    accept: 'txt,xls,xlsx,csv,xml,excel',
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
    ] as QTableProps['columns'],
    pages: { currentPage: ref(1), lastPage: ref(1) },
    rows: [] as Array<{
      id: number
      name: string
      total: number
      status_id: number
    }>,
  })

  const addedFiles = async (documents: File[]) => {
    if (!documents || documents.length === 0) {
      showAlert('Archivo inválido proporcionado', 'error', undefined, 2000)
      return
    }

    const isValid = await props.formRef?.validate()
    if (!isValid) {
      deleteFiles()
      return
    }

    const auxFile = handleFileObjectToUrlConversion(documents[0])
    models.value.document = {
      is_new: false,
      url: auxFile,
      name: documents[0].name,
      size: documents[0].size,
      file: documents[0],
    }

    tableProps.value.rows = [
      {
        id: 1,
        name: documents[0].name,
        total: 0,
        status_id: 72,
      },
    ]

    await validateBankResponseUploadFile()
  }

  const startProgressBar = (duration: number = 20000): void => {
    progressValue.value = 0
    const steps = 20
    const stepTime = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      if (currentStep >= steps || progressValue.value >= 1) {
        clearInterval(timer)
        return
      }
      currentStep++
      progressValue.value = Math.min(0.9, currentStep / steps)
    }, stepTime)
  }

  const validateBankResponseUploadFile = async () => {
    await startProgressBar()
    emits('validate-upload-file')
  }

  const updatedBankResponseUploadFileProcess = async (success: boolean) => {
    progressValue.value = 1

    setTimeout(() => {
      const info = bank_response_filter_form_response.value

      const hasErrors = info?.errors?.length ? info.errors.length > 0 : false

      tableProps.value.rows = [
        {
          id: 1,
          name: info?.file_name ?? '-',
          total: info?.total_registers ?? 0,
          status_id: success && !hasErrors ? 1 : 73,
        },
      ]
    }, 800)
  }
  const rejectedFiles = (fileRejected: QRejectedEntry[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    deleteFiles()
  }

  const deleteFiles = () => {
    models.value.document = {
      is_new: false,
      url: '',
      name: '',
      size: 0,
      file: null,
    }
    attachDocumentRef.value?.removeFilesRemote()
    tableProps.value.rows = []
  }

  watch(
    () => models.value,
    async () => {
      if (!models.value.document || isEmptyOrZero(models.value.document)) {
        _setBankResponseDocument(null)
      } else {
        _setBankResponseDocument(models.value.document)
      }
    },
    { deep: true }
  )

  return {
    defaultIconsLucide,
    uploadProps,
    attachDocumentRef,
    models,
    progressValue,
    tableProps,

    addedFiles,
    rejectedFiles,
    deleteFiles,
    updatedBankResponseUploadFileProcess,
  }
}

export default useBankResponseUploadFileList
