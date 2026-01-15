import { computed, onMounted, ref, toRaw, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Interfaces
import { IAdditionalInformationForm } from '@/interfaces/global/user'
// Stores
import { useAdditionalInformationFormStore } from '@/stores/user/additional-information-form'
import { QTable } from 'quasar'
import { useResourcesStore } from '@/stores'
import { IFileField, IUploadedFile } from '@/interfaces/global/File'
import { useAlert } from '@/composables'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

const MAX_FILES = 5
const MAX_FILE_SIZE_MB = 5

export const useAdditionalInformationForm = (props: any, emit: Function) => {
  const { _setUserAdditionalInformationForm } =
    useAdditionalInformationFormStore()
  const { userAdditionalInformationForm, fileRowList, isInactiveBank } =
    storeToRefs(useAdditionalInformationFormStore())
  const { banks, bank_type, relationship_type } = storeToRefs(
    useResourcesStore()
  )
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  const attachCvvRef = ref()
  const viewerFileComponentRef = ref()

  const styleCustomAttachFile = ref(
    'width: 100% !important; border-radius: 20px !important; min-height: 50px !important; max-height: 300px !important; display: inherit !important; border: 3px dashed #dcdcdc !important'
  )
  const isBankInactive = computed(() => {
    const selectedBank = banks.value.find(
      (bank) => bank.value === formValues.value?.bank_id
    )
    return selectedBank?.value ? selectedBank.status_id === 2 : false
  })

  const tableProps = ref({
    title: 'Listado de documentos anexos',
    loading: false,
    rows: fileRowList.value,
    columns: [
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'center',
        field: 'description',
        sortable: true,
        style: {
          'white-space': 'pre-wrap',
          'max-width': '200px',
        },
      },
      {
        name: 'attach',
        required: true,
        label: 'Adjunto',
        align: 'center',
        field: 'attach',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
  })

  const formValues = ref<IAdditionalInformationForm>({
    // Emergency contact
    emergency_contact_name: null as string | null,
    emergency_contact_phone: null as string | number | null,
    emergency_contact_relationship: null as string | null,
    // Banks data:
    bank_id: null as number | null,
    account_number: null as string | null,
    account_type: null as string | null,
    // Files:
    resume: null as IUploadedFile[] | null,
    resume_name: null as string[] | null,
  })

  const setUserValues = () => {
    formValues.value.emergency_contact_name =
      userAdditionalInformationForm.value?.emergency_contact_name
    formValues.value.emergency_contact_phone =
      userAdditionalInformationForm.value?.emergency_contact_phone
    formValues.value.emergency_contact_relationship =
      userAdditionalInformationForm.value?.emergency_contact_relationship
    formValues.value.bank_id = userAdditionalInformationForm.value?.bank_id
    formValues.value.account_number =
      userAdditionalInformationForm.value?.account_number
    formValues.value.account_type =
      userAdditionalInformationForm.value?.account_type
    formValues.value.resume = userAdditionalInformationForm.value?.resume
    formValues.value.resume_name =
      userAdditionalInformationForm.value?.resume_name
  }

  const addedFiles = (file: IUploadedFile[]) => {
    const newFileId = file[0].__key
    const newFileSizeMB = file[0].size / (1024 * 1024)

    if (isDuplicateFile(newFileId)) {
      handleDuplicateFile()
      return
    }
    if (isFileTooLarge(newFileSizeMB)) {
      handleLargeFile()
      return
    }
    if (canAddMoreFiles()) {
      addNewFile(file[0])
    } else {
      showAlert('¡Solo se pueden adjuntar 5 archivos!', 'error')
      attachCvvRef.value?.removeFilesRemote()
    }
  }

  const isDuplicateFile = (id: string): boolean => {
    return fileRowList.value.some((existingFile) => existingFile.id === id)
  }

  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const handleDuplicateFile = () => {
    showAlert('¡Este archivo ya ha sido añadido!', 'error')
    attachCvvRef.value?.removeFilesRemote()
  }

  const handleLargeFile = () => {
    showAlert('¡El archivo supera el tamaño máximo permitido (5mb)!', 'error')
    attachCvvRef.value?.removeFilesRemote()
  }

  const canAddMoreFiles = (): boolean => {
    return fileRowList.value.length < MAX_FILES
  }

  const addNewFile = (file: IUploadedFile) => {
    const newFile: IFileField = {
      id: file.__key,
      description: file.name,
      file: file,
    }

    fileRowList.value.push(newFile)

    if (!formValues.value.resume) {
      formValues.value.resume = []
    }
    if (!formValues.value.resume_name) {
      formValues.value.resume_name = []
    }

    formValues.value.resume.push(file)
    formValues.value.resume_name.push(file.name)
  }

  const rejectedFiles = (fileRejected: any) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    attachCvvRef.value?.removeFilesRemote()
  }

  const removeFile = (fileId: string) => {
    attachCvvRef.value?.removeFilesRemote()
    const fileIndex = fileRowList.value.findIndex((file) => file.id === fileId)
    if (fileIndex !== -1) {
      fileRowList.value.splice(fileIndex, 1)
      if (formValues.value.resume && formValues.value.resume_name) {
        formValues.value.resume.splice(fileIndex, 1)
        formValues.value.resume_name.splice(fileIndex, 1)
      }
    } else {
      showAlert('¡El archivo no se encontró en la lista!', 'error')
    }
  }

  const viewFile = async (fileProxy: File | null) => {
    if (!fileProxy) {
      return showAlert(`No hay archivo para mostrar`, 'error', undefined, 1000)
    }
    await viewerFileComponentRef.value.showFile(toRaw(fileProxy))
  }

  const submit = () => {
    if (isBankInactive.value) {
      showAlert('Banco inactivo', 'error')
    } else {
      emit('onAction', 'additional-information')
    }
  }

  watch(formValues.value, (val) => {
    _setUserAdditionalInformationForm(val)
  })

  watch(isBankInactive, (newVal) => {
    if (newVal) {
      isInactiveBank.value = isBankInactive.value
    }
    if (!newVal) {
      isInactiveBank.value = isBankInactive.value
    }
  })

  onMounted(async () => {
    if (props.formType === 'create') {
      setUserValues()
    }
    if (props.formType === 'update') {
      openMainLoader(true)
      setUserValues()
      openMainLoader(false)
    }
  })

  return {
    formValues,
    styleCustomAttachFile,
    attachCvvRef,
    viewerFileComponentRef,
    tableProps,

    // Select resources:
    banks,
    bank_type,
    relationship_type,
    submit,
    addedFiles,
    rejectedFiles,
    removeFile,
    viewFile,
  }
}
