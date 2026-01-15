import {
  IFileTableRecordTransfer,
  IGuaranteesForm,
  ITableDocumentsCreateGuarantee,
} from '@/interfaces/customs'
import { onMounted, ref, watch, nextTick, computed } from 'vue'
import { useAlert, useRules, useUtils } from '@/composables'
import {
  handleFileObjectToUrlConversion,
  isEmptyOrZero,
  urlToFile,
  downloadFile,
} from '@/utils'
import {
  ActionType,
  TrustBusinessStatusID,
  IUploadedFile,
} from '@/interfaces/global'
import { MAX_FILE_SIZE_MB } from '@/constants/files'
import { QTable } from 'quasar'
import {
  useGuaranteesStore,
  useInvestmentPortfolioResourceStore,
  useTrustBusinessResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'

const useBasicDataForm = (
  props: {
    action: ActionType | 'authorize'
    data: IGuaranteesForm | null
  },
  emit: Function
) => {
  const { showAlert } = useAlert()
  const { _setDataDocumentsTab } = useGuaranteesStore('v1')
  const {
    business_trusts,
    business_trust_third_parties,
    guarantees_types,
    guarantees_linkage_types,
    guarantees_record_status,
    guarantees_status,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { coins } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const {
    is_required,
    max_length,
    only_positive_number,
    no_leading_zeros,
    only_alphanumeric,
    min_length,
  } = useRules()

  const attachDocumentRef = ref()
  const formElementRef = ref()

  const isSettingModel = ref(false)

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione los archivos para subir',
    multiple: true,
    bordered: false,
    accept: '.pdf, .tiff',
  }

  const initialModelsValues: IGuaranteesForm = {
    id: undefined,
    business_trust_id: null,
    guarantee_type: null,
    guarantee_number: null,
    registration_date: null,
    specification: null,
    description: null,
    guaranteed_value: '',
    linkage_type: null,
    expiration_date: null,
    observations: null,
    currency_id: null,
    secured_creditor_id: null,

    registration_status: 'Registrado',
    guarantee_status_id: 'En proceso',

    documents: [],
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
        align: 'center',
        field: 'name',
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
        name: 'created_at',
        required: false,
        label: 'Fecha de cargue',
        align: 'center',
        field: (row: ITableDocumentsCreateGuarantee) =>
          useUtils().formatDate(row.created_at ?? '', 'YYYY-MM-DD'),
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
    pages: { currentPage: ref(1), lastPage: ref(1) },
    rows: [] as ITableDocumentsCreateGuarantee[],
  })

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const addedFiles = async (files: IUploadedFile[]) => {
    files.forEach((element) => {
      const newFileSizeMB = element.size / (1024 * 1024)
      if (isFileTooLarge(newFileSizeMB)) {
        handleLargeFile()
        return
      }
      const auxFile = handleFileObjectToUrlConversion(element as never)
      models.value.documents?.push({
        is_new: false,
        url: auxFile,
        name: element.name,
        size: element.size,
      })
    })
  }

  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const handleLargeFile = () => {
    showAlert('¡El archivo supera el tamaño máximo permitido (5mb)!', 'error')
    deleteFiles()
  }

  const deleteFiles = () => {
    models.value.documents = []
    attachDocumentRef.value?.removeFilesRemote()
  }

  const rejectedFiles = (fileRejected: { failedPropValidation?: string }[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    deleteFiles()
  }

  const deleteFileManual = (row: ITableDocumentsCreateGuarantee) => {
    attachDocumentRef.value?.removeSingleFile(row.name, row.size)

    const index = models.value.documents?.findIndex(
      (f) => f.name === row.name && f.url === row.url
    )

    if (index !== -1) {
      models.value.documents?.splice(index!, 1)
    }

    if (models.value.documents?.length === 0) {
      attachDocumentRef.value?.removeFilesRemote()
    }
  }

  const setInitialValues = () => {
    models.value.registration_date = new Date().toISOString().slice(0, 10)
  }

  const handlerActionForm = (action: ActionType | 'authorize') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: _setModelValue,
      view: _setModelValue,
      authorize: _setModelValue,
    }
    actionHandlers[action]?.()
  }

  const _setModelValue = () => {
    isSettingModel.value = true
    const data: IGuaranteesForm | null = props.data ?? null
    if (data) {
      models.value = { ...data }
    }
    nextTick(() => {
      isSettingModel.value = false
    })
  }

  const downloadFileS3 = (row: IFileTableRecordTransfer) => {
    downloadFile(row.url, row.name)
  }

  const isEditableRegistrationStatus = computed(() => {
    return (
      (['edit'].includes(props.action) &&
        models.value.registration_status ===
          TrustBusinessStatusID.AUTHORIZED) ||
      models.value.registration_status === TrustBusinessStatusID.REJECTED ||
      models.value.registration_status === TrustBusinessStatusID.REGISTERED
    )
  })

  const isRegistrationStatusEditable = computed(() => {
    return (
      ['edit'].includes(props.action) &&
      models.value.registration_status !== TrustBusinessStatusID.REJECTED &&
      models.value.registration_status !== TrustBusinessStatusID.REGISTERED
    )
  })

  watch(
    () => models.value.documents,
    () => {
      tableProps.value.rows =
        models.value.documents?.map((item) => ({
          id: item.id,
          is_new: item.is_new ?? false,
          name: item.name,
          status_id: 29,
          url: item.url ?? '',
          size: item.size,
          created_at: item.created_at,
        })) ?? []
    },
    { deep: true, immediate: true }
  )

  watch(
    () => tableProps.value.rows,
    async () => {
      if (models.value.documents?.length === 0) {
        _setDataDocumentsTab([])
      } else {
        const filesData = await Promise.all(
          models.value.documents?.map(async (item) => {
            if (!item.url || !item.name) return undefined
            if (item.is_new) return undefined
            return await urlToFile(
              item.url,
              item.name,
              item.type || 'application/pdf'
            )
          }) ?? []
        )
        const cleanedFiles: File[] = filesData.filter(
          (file): file is File => file !== undefined
        )
        _setDataDocumentsTab(cleanedFiles)
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (isSettingModel.value) return
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  const validateDocuments = (): boolean => {
    if (!models.value.documents || models.value.documents.length === 0) {
      showAlert('Debe cargar al menos un documento de soporte', 'warning')
      return false
    }

    if (props.action === 'edit') {
      const isAuthorizedRecord =
        models.value.registration_status === TrustBusinessStatusID.AUTHORIZED
      const hasOldDocuments = models.value.documents.some(
        (doc) => doc.is_new === true
      )
      if (!isAuthorizedRecord && hasOldDocuments) {
        showAlert(
          'Para actualizar debe eliminar el soporte documental existente y cargar uno nuevo',
          'warning'
        )
        return false
      }
    }

    return true
  }

  const validateForm = async () => {
    const formIsValid = await formElementRef.value?.validate()
    if (!formIsValid) return false

    if (['create', 'edit'].includes(props.action)) {
      return validateDocuments()
    }

    return true
  }

  onMounted(async () => {
    setInitialValues()
  })

  return {
    formElementRef,
    models,
    uploadProps,
    attachDocumentRef,
    tableProps,
    business_trusts,
    guarantees_types,
    guarantees_linkage_types,
    coins,
    guarantees_record_status,
    guarantees_status,
    business_trust_third_parties,
    isEditableRegistrationStatus,
    isRegistrationStatusEditable,
    TrustBusinessStatusID,
    deleteFileManual,
    rejectedFiles,
    deleteFiles,
    addedFiles,
    is_required,
    max_length,
    no_leading_zeros,
    only_alphanumeric,
    only_positive_number,
    downloadFileS3,
    min_length,
    validateForm,
  }
}

export default useBasicDataForm
