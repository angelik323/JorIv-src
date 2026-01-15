import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { QRejectedEntry, QTable } from 'quasar'
import moment from 'moment'
import { handleFileObjectToUrlConversion, isEmptyOrZero } from '@/utils'
import { useAlert } from '@/composables'
import {
  IFileTableRecordTransfer,
  IUploadFilesInvestmentValuationForm,
  IUploadFilesInvestmentValuationListFilesResponse,
  IUploadFilesInvestmentValuationListFilesRequest,
  IUploadFilesInvestmentValuationCheckFileUploadStatus,
} from '@/interfaces/customs'
import {
  useUploadFilesInvestmentValuationStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'

const useInformationForm = () => {
  const { showAlert } = useAlert()
  const {
    _getFilesTypesCheckbox,
    _setUploadFilesInvestmentValuationListFiles,
    _setUploadFilesInvestmentValuationForm,
  } = useUploadFilesInvestmentValuationStore('v1')
  const {
    upload_files_investment_valuation_list_files,
    check_file_upload_status_list,
  } = storeToRefs(useUploadFilesInvestmentValuationStore('v1'))

  const { price_provider_issuers } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const formElementRef = ref()
  const attachDocumentRef = ref()
  const checkboxStates = ref<Record<string, boolean>>({})

  const models = ref<IUploadFilesInvestmentValuationForm>({
    id: null,
    issuers_counterparty_id: null,
    upload_date: moment().format('YYYY-MM-DD'),
    description: null,

    selected_files: [],
    files: [],
    documents: [],
  })

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione los archivos para subir',
    multiple: true,
    bordered: false,
    accept: '.txt,.csv',
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
    rows: [] as IFileTableRecordTransfer[],
  })

  const checkboxConfigs = computed(() => {
    return upload_files_investment_valuation_list_files.value
      .filter(
        (
          item
        ): item is IUploadFilesInvestmentValuationListFilesResponse & {
          file_structure_name: string
        } => item.file_structure_name !== null
      )
      .map((item) => ({
        key: item.file_structure_name,
        title: item.label_name || '',
        fullData: item,
      }))
  })

  const allChecked = computed({
    get() {
      return (
        checkboxConfigs.value.length > 0 &&
        checkboxConfigs.value.every(
          (config) => checkboxStates.value[config.key]
        )
      )
    },
    set(val: boolean) {
      checkboxConfigs.value.forEach((config) => {
        checkboxStates.value[config.key] = val
      })
      updateSelectedFiles()
    },
  })

  const updateSelectedFiles = () => {
    models.value.selected_files =
      upload_files_investment_valuation_list_files.value.filter(
        (item: IUploadFilesInvestmentValuationListFilesResponse) =>
          item.file_structure_name !== null &&
          checkboxStates.value[item.file_structure_name] === true
      )
  }

  const handleCheckboxChange = (key: string, value: boolean) => {
    checkboxStates.value[key] = value
    updateSelectedFiles()
  }

  const handlerIssuersCounterpartyId = async (value: number) => {
    checkboxStates.value = {}
    models.value.selected_files = []
    models.value.issuers_counterparty_id = value
    models.value.files = []
    models.value.documents = []

    if (!value) {
      models.value.description = null
      models.value.upload_date = null
      _setUploadFilesInvestmentValuationListFiles([])
      return
    }

    const issuer = price_provider_issuers.value.find(
      (issuer) => issuer.value === value
    )

    models.value.description = issuer?.description || null
    await _getFilesTypesCheckbox(String(value))
  }

  const addedFiles = async (documents: File[]) => {
    if (!models.value.issuers_counterparty_id) {
      deleteFiles()
      showAlert('¡Seleccione un proveedor de precios!', 'error')
      return
    }

    if (
      !models.value.selected_files ||
      models.value.selected_files.length === 0
    ) {
      models.value.files = []
      deleteFiles()
      showAlert(
        '¡Seleccione al menos una opción de archivos a cargar!',
        'error'
      )
      return
    }
    documents.forEach((element) => {
      const auxFile = handleFileObjectToUrlConversion(element as never)
      models.value.documents?.push({
        is_new: false,
        url: auxFile,
        name: element.name,
        size: element.size,
        file: element,
      })
    })
  }

  const rejectedFiles = (fileRejected: QRejectedEntry[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    deleteFiles()
  }

  const deleteFiles = (id?: number) => {
    if (id === undefined) {
      models.value.documents = []
      tableProps.value.rows = []
      attachDocumentRef.value?.removeFilesRemote()
      return
    }

    if (models.value.documents) {
      models.value.documents = models.value.documents.filter(
        (_, index) => index + 1 !== id
      )
    }

    if (tableProps.value.rows) {
      tableProps.value.rows = tableProps.value.rows.filter(
        (row) => row.id !== id
      )

      tableProps.value.rows = tableProps.value.rows.map((row, index) => ({
        ...row,
        id: index + 1,
      }))
    }

    if (models.value.documents.length === 0) {
      attachDocumentRef.value?.removeFilesRemote()
    }
  }

  const documentsToFilesUsingConfigsMap = () => {
    if (!models.value.documents || models.value.documents.length === 0) {
      models.value.files = []
      return
    }

    const mappedFiles: IUploadFilesInvestmentValuationListFilesRequest[] = []
    models.value.documents.forEach((document: IFileTableRecordTransfer) => {
      const matchingConfig = models.value.selected_files.find((config) => {
        return (
          config.file_structure_name &&
          config.file_structure_name.toLowerCase() ===
            document.name?.toLowerCase()
        )
      })
      if (matchingConfig) {
        if (document.file) {
          mappedFiles.push({
            label_name: matchingConfig.label_name,
            file_structure_name: document.file,
            method_name: matchingConfig.method_name,
          })
        }
      } else {
        showAlert(
          '¡El nombre del archivo ' +
            document.name +
            ' no coincide con las opciones seleccionadas!',
          'error'
        )
        deleteFiles()
      }
    })

    models.value.files = mappedFiles
  }

  const tablePropsRowsMap = () => {
    tableProps.value.rows = models.value.documents!.map((item, index) => ({
      id: index + 1,
      name: item.name,
      status_id: 65,
      url: item.url,
    }))
  }

  const updateTableRowsWithBackendStatus = (
    documents: IFileTableRecordTransfer[],
    newStatusList: IUploadFilesInvestmentValuationCheckFileUploadStatus[]
  ): IFileTableRecordTransfer[] => {
    return documents.map((doc, index) => {
      const backendMatch = newStatusList.find(
        (statusItem) =>
          statusItem.expected_file_name &&
          statusItem.expected_file_name.toLowerCase() ===
            doc.name?.toLowerCase()
      )

      const status_id = backendMatch ? Number(backendMatch.status_id) || 68 : 68

      return {
        ...doc,
        id: index + 1,
        status_id,
      }
    })
  }

  watch(
    () => models.value,
    async () => {
      if (isEmptyOrZero(models.value)) {
        _setUploadFilesInvestmentValuationForm(null)
      } else {
        _setUploadFilesInvestmentValuationForm(models.value)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.documents,
    () => {
      documentsToFilesUsingConfigsMap()
      tablePropsRowsMap()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => check_file_upload_status_list.value,
    (newStatusList) => {
      if (!newStatusList || !newStatusList.length) return
      tableProps.value.rows = updateTableRowsWithBackendStatus(
        models.value.documents!,
        newStatusList
      )
    },
    { deep: true }
  )

  return {
    formElementRef,
    attachDocumentRef,
    models,
    checkboxConfigs,
    allChecked,
    uploadProps,
    tableProps,
    checkboxStates,
    price_provider_issuers,

    addedFiles,
    rejectedFiles,
    deleteFiles,
    handleCheckboxChange,
    handlerIssuersCounterpartyId,
  }
}

export default useInformationForm
