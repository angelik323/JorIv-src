// pinia - vue - quasar
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// stores
import {
  useInvestmentPortfolioResourceStore,
  usePolicyStore,
  useTrustBusinessResourceStore,
} from '@/stores'

// interfaces
import {
  IFileTableRecordTransfer,
  IPolicyCreate,
  IPolicyResponse,
} from '@/interfaces/customs'
import { QTable } from 'quasar'
import { useAlert, useUtils } from '@/composables'
import { IUploadedFile, TrustBusinessStatusID } from '@/interfaces/global'
import {
  downloadFile,
  handleFileObjectToUrlConversion,
  isEmptyOrZero,
  urlToFile,
} from '@/utils'
import moment from 'moment'

const useInformationForm = (props: {
  action: 'create' | 'edit' | 'view' | 'authorize'
  data?: IPolicyResponse | null
}) => {
  const { _setDataInformationForm, _setIdToDelete, _setDataDocuments } =
    usePolicyStore('v1')

  const {
    business_trusts_with_code,
    policy_types,
    business_trust_third_parties,
    policies_record_status,
    policies_status,
    policy_payment_methods,
    policy_insurers_with_id,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { coins } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { data_information_form } = storeToRefs(usePolicyStore('v1'))

  const formInformation = ref()
  const dateNow = moment().format('YYYY-MM-DD')

  const models = ref<IPolicyCreate>({
    id: undefined,
    business_trust_id: null,
    policy_type: null,
    policy_number: null,
    insurer_id: null,
    policy_holder_id: null,
    beneficiary_id: null,
    currency_id: null,
    insured_value: null,
    issue_date: null,
    effective_start_date: null,
    effective_end_date: null,
    premium: null,
    payment_method: null,
    associated_contract: null,
    associated_asset: null,
    observations: null,
    created_date: dateNow,
    documents: [],
    record_status_id: 'Registrado',
    policy_status_id: 'En proceso',
  })

  // actions
  const handlerActionForm = (
    action: 'create' | 'edit' | 'view' | 'authorize'
  ) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: isEmptyOrZero(data_information_form)
        ? _setModelValue
        : _setEditValue,
      view: _setViewValue,
      authorize: _setViewValue,
    }
    actionHandlers[action]?.()
  }

  const isEmpty = (obj: Record<string, unknown>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const _setModelValue = () => {
    clearForm()
    const data_value = data_information_form.value
    if (data_value) {
      models.value.id = data_value.id
      models.value.business_trust_id = data_value.business_trust_id
      models.value.policy_type = data_value.policy_type
      models.value.policy_number = data_value.policy_number
      models.value.insurer_id = data_value.insurer_id
      models.value.policy_holder_id = data_value.policy_holder_id
      models.value.beneficiary_id = data_value.beneficiary_id
      models.value.currency_id = data_value.currency_id
      models.value.insured_value = data_value.insured_value
      models.value.issue_date = data_value.issue_date
      models.value.effective_start_date = data_value.effective_start_date
      models.value.effective_end_date = data_value.effective_end_date
      models.value.premium = data_value.premium
      models.value.payment_method = data_value.payment_method
      models.value.associated_contract = data_value.associated_contract
      models.value.observations = data_value.observations
    }
  }

  const _setEditValue = () => {
    clearForm()
    const data_value = props.data
    if (data_value) {
      models.value.id = data_value.id
      models.value.business_trust_id = data_value.business_trust?.id ?? null
      models.value.insurer_id = data_value.insurer?.id ?? null
      models.value.policy_type = data_value.policy_type
      models.value.policy_number = data_value.policy_number
      models.value.policy_holder_id = data_value.policy_holder?.id ?? null
      models.value.beneficiary_id = data_value.beneficiary?.id ?? null
      models.value.currency_id = data_value.currency?.id ?? null
      models.value.insured_value = data_value.insured_value
      models.value.issue_date = data_value.issue_date
      models.value.effective_start_date = data_value.effective_start_date
      models.value.effective_end_date = data_value.effective_end_date
      models.value.premium = data_value.premium
      models.value.payment_method = data_value.payment_method
      models.value.associated_contract = data_value.associated_contract
      models.value.record_status_id = data_value.record_status?.id
      models.value.policy_status_id = data_value.policy_status?.id
      models.value.observations = data_value.observations
      models.value.created_date = data_value.created_at?.split(' ')[0] ?? ''
      models.value.currency_name = `${data_value?.currency?.code ?? ''} - ${
        data_value?.currency?.description ?? ''
      }`
      models.value.documents = data_value.attachments?.map((item) => ({
        id: item.id,
        is_new: false,
        url: item.s3_file_path,
        name: item.original_name,
        created_at: item.created_at,
      }))
    }
  }

  const _setViewValue = () => {
    clearForm()
    const data_value = props.data

    if (data_value) {
      models.value.id = data_value.id
      models.value.business_trust_name = `${data_value.business_trust?.code} - ${data_value.business_trust?.name}`
      models.value.policy_type = data_value.policy_type
      models.value.policy_number = data_value.policy_number
      models.value.insurer_name = data_value?.insurer?.name
      models.value.policy_holder_name = data_value?.policy_holder?.name
      models.value.beneficiary_name = data_value?.beneficiary?.name
      models.value.currency_name = `${data_value?.currency?.code ?? ''} - ${
        data_value?.currency?.description ?? ''
      }`
      models.value.insured_value = data_value.insured_value
      models.value.issue_date = data_value.issue_date
      models.value.effective_start_date = data_value.effective_start_date
      models.value.effective_end_date = data_value.effective_end_date
      models.value.premium = data_value.premium
      models.value.payment_method = data_value.payment_method
      models.value.associated_contract = data_value.associated_contract
      models.value.record_status_id = data_value.record_status?.id
      models.value.policy_status_id = data_value.policy_status?.id
      models.value.observations = data_value.observations
      models.value.created_date = data_value.created_at?.split(' ')[0] ?? ''

      models.value.documents = data_value.attachments?.map((item) => ({
        id: item.id,
        is_new: true,
        url: item.s3_file_path,
        name: item.original_name,
        created_at: item.created_at,
      }))
    }
  }

  const clearForm = async () => {
    models.value.id = undefined
    models.value.business_trust_id = null
    models.value.policy_type = null
    models.value.policy_number = null
    models.value.insurer_id = null
    models.value.policy_holder_id = null
    models.value.beneficiary_id = null
    models.value.currency_id = null
    models.value.insured_value = null
    models.value.issue_date = null
    models.value.effective_start_date = null
    models.value.effective_end_date = null
    models.value.premium = null
    models.value.payment_method = null
    models.value.associated_contract = null
    models.value.observations = null
    models.value.documents = []
  }

  // Documents

  // refs
  const attachDocumentRef = ref()
  const alertModalRef = ref()
  const alertModalConfig = ref<{
    title: string
    description: string
    entityToDelete: IFileTableRecordTransfer | null
  }>({
    title: 'Advertencia',
    description: '',
    entityToDelete: null,
  })
  // props
  const MAX_FILE_SIZE_MB = 5

  const { showAlert } = useAlert()

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione los archivos para subir',
    multiple: true,
    bordered: false,
    accept: '.pdf, .tiff',
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
        label: 'Fecha de carga',
        align: 'center',
        field: (row: IFileTableRecordTransfer) =>
          useUtils().formatDate(row.created_at ?? dateNow, 'YYYY-MM-DD'),
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
    rows: [] as IFileTableRecordTransfer[],
  })

  const addedFiles = async (files: IUploadedFile[]) => {
    files.forEach((element) => {
      const newFileSizeMB = element.size / (1024 * 1024)
      if (isFileTooLarge(newFileSizeMB)) {
        handleLargeFile()
        return
      }
      const auxFile = handleFileObjectToUrlConversion(element as never)
      models.value.documents?.push({
        is_new: true,
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

  const rejectedFiles = (
    fileRejected: Array<{ failedPropValidation?: string }>
  ) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    deleteFiles()
  }

  const deleteFiles = () => {
    models.value.documents = []
    attachDocumentRef.value?.removeFilesRemote()

    const ids_to_delete: number[] = tableProps.value.rows
      .filter((item) => !item.is_new && typeof item.id === 'number')
      .map((item) => item.id as number)

    tableProps.value.rows = []
    if (ids_to_delete.length) _setIdToDelete(ids_to_delete)
  }

  const deleteFileManual = (row: IFileTableRecordTransfer) => {
    attachDocumentRef.value?.removeSingleFile(row.name, row.size)

    const index = models.value.documents?.findIndex(
      (f) => f.name === row.name && f.url === row.url
    )

    if (index !== -1) {
      models.value.documents?.splice(index!, 1)
    }

    if (row.id && !row.is_new) _setIdToDelete([row.id])
  }

  const openAlertModal = async (entityToDelete: IFileTableRecordTransfer) => {
    alertModalConfig.value.entityToDelete = entityToDelete
    await alertModalRef.value.openModal()
  }

  const changeStatusAction = async () => {
    const fileToDelete = alertModalConfig.value.entityToDelete

    if (fileToDelete !== null) {
      deleteFileManual(fileToDelete)
      alertModalConfig.value.entityToDelete = null

      showAlert('Registro eliminado exitosamente', 'success', undefined, 5000)
    }

    alertModalRef.value.closeModal()
  }

  const downloadFileS3 = (row: IFileTableRecordTransfer) => {
    downloadFile(row.url, row.name)
  }

  const emisionDateAllowed = (date: string): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selectedDate = new Date(date)
    selectedDate.setHours(0, 0, 0, 0)

    return selectedDate <= today
  }

  onMounted(() => {
    handlerActionForm(props.action)
  })

  const isEditableRegistrationStatus = computed(() => {
    return (
      (['edit'].includes(props.action) &&
        models.value.record_status_id === TrustBusinessStatusID.AUTHORIZED) ||
      models.value.record_status_id === TrustBusinessStatusID.REJECTED ||
      models.value.record_status_id === TrustBusinessStatusID.REGISTERED
    )
  })

  const isRegistrationStatusEditable = computed(() => {
    return (
      ['edit'].includes(props.action) &&
      models.value.record_status_id !== TrustBusinessStatusID.REJECTED &&
      models.value.record_status_id !== TrustBusinessStatusID.REGISTERED
    )
  })

  // watch
  watch(
    () => props.data,
    () => {
      handlerActionForm(props.action)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    async () => {
      if (isEmpty(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({
          ...models.value,
        })
      }
    },
    { deep: true, immediate: true }
  )
  watch(
    () => tableProps.value.rows,
    async () => {
      const filesData = await Promise.all(
        models.value.documents!.map(async (item) => {
          if (!item.url || !item.name) return undefined
          if (!item.is_new) return undefined
          return await urlToFile(
            item.url,
            item.name,
            ['pdf', 'PDF'].includes(item.name)
              ? 'application/pdf'
              : 'image/tiff'
          )
        })
      )
      const cleanedFiles: File[] = filesData.filter(
        (file): file is File => file !== undefined
      )

      _setDataDocuments(cleanedFiles)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.documents,
    () => {
      tableProps.value.rows = models.value.documents!.map((item) => ({
        id: item.id,
        is_new: item.is_new ?? false,
        name: item.name,
        status_id: 29,
        url: item.url,
        size: item.size,
        created_at: item.created_at,
      }))
    },
    { deep: true, immediate: true }
  )

  return {
    uploadProps,
    attachDocumentRef,
    tableProps,
    formInformation,
    models,
    business_trusts_with_code,
    policy_types,
    business_trust_third_parties,
    policies_record_status,
    policies_status,
    policy_payment_methods,
    coins,
    policy_insurers_with_id,
    TrustBusinessStatusID,
    isEditableRegistrationStatus,
    isRegistrationStatusEditable,
    alertModalRef,

    addedFiles,
    rejectedFiles,
    deleteFiles,
    deleteFileManual,
    downloadFileS3,
    emisionDateAllowed,
    openAlertModal,
    changeStatusAction,
  }
}
export default useInformationForm
