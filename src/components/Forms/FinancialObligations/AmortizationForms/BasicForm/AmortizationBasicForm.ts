// vue | pinia | router
import { computed, onMounted, ref, toRaw, watch } from 'vue'
import { storeToRefs } from 'pinia'

//store
import { useAmortizationTablesStore } from '@/stores'

// composable
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ISelectorAddTypes } from '@/interfaces/customs'

import { QTable } from 'quasar'
import {
  IAmortizationList,
  IAmortizationTablesDocumentsForm,
  IFinancialPlanType,
  IObligationsOptions,
} from '@/interfaces/customs/financial-obligations/AmortizationTables'

const MAX_FILE_SIZE_MB = 5

const initialModelsValues: IAmortizationTablesDocumentsForm = {
  documents: null,
  fileRowList: [],
}

const useAmortizationBasicForm = () => {
  const { openMainLoader } = useMainLoader()

  const {
    amortizationData,
    obligationsOptions,
    showAmortizationData,
    currentAmortizationFilter,
  } = storeToRefs(useAmortizationTablesStore('v1'))

  const { _createAmortization, _loadDocumentPDF, _loadDocumentURLPDF } =
    useAmortizationTablesStore('v1')

  const { handleFileObjectToUrlConversion, defaultIconsLucide, downloadFile } =
    useUtils()
  const { goToURL } = useGoToUrl()

  const { showAlert } = useAlert()

  const { getUrlPath } = useGoToUrl()

  const amortizationDataFileRef = ref<null>(null)
  const currentSelectFile = ref<File>()

  const amortizationBusinessInfo = ref<IAmortizationList>({
    businessName: null,
    businessId: null,
    businessCode: null,
    options: [],
  })

  const viewerFileComponentRef = ref()
  const models = ref<IAmortizationTablesDocumentsForm>({
    ...initialModelsValues,
  })

  const progressValue = ref()

  const obligationSelected = ref<number>()

  const rowsFile = ref<{ id: number; currentName: string; status: number }[]>(
    []
  )

  const currentPlanId = ref<number>()
  const currentPlanType = ref<IFinancialPlanType>('financial-plan/default')

  const getActions = computed(() => ({
    id: currentPlanId.value,
    type: currentPlanType.value,
  }))

  const getRowsFile = computed(() => rowsFile.value)

  const tableProps = ref({
    title: 'Tabla de Amortización',
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
        name: 'currentName',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: 'currentName',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status',
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
    rows: getRowsFile,
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const uploadProps = {
    title: 'Seleccione archivo PDF',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione el archivo PDF para subir',
    multiple: false,
    bordered: false,
    accept: '.pdf',
  }

  const handlerCreateAmortization = async (
    currentObligationId: number | null | undefined,
    currentSelectedFile: File | undefined,
    currentAction: ISelectorAddTypes
  ) => {
    if (!currentObligationId || !currentSelectedFile) {
      showAlert('Debe seleccionar una obligación y un archivo.', 'error')
    }

    if (
      currentAction === 'create' &&
      currentObligationId &&
      currentSelectedFile
    ) {
      openMainLoader(true)
      if (await _createAmortization(currentObligationId, currentSelectedFile)) {
        goToURL('AmortizationTablesList')
      }

      openMainLoader(false)
    }
  }

  const attachDocumentRef = ref()
  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const deleteFiles = async () => {
    if (attachDocumentRef.value) {
      attachDocumentRef.value.removeFilesRemote()
    }

    models.value.documents = ''
    attachDocumentRef.value?.removeFilesRemote()
    currentSelectFile.value = undefined
    rowsFile.value = []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rejectedFiles = (fileRejected: any) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    deleteFiles()
  }

  const addedFiles = async (files: File[]) => {
    if (!files || files.length === 0) {
      showAlert('No se ha seleccionado ningún archivo.', 'error')
      return
    }

    await deleteFiles()

    const file = files[0]
    const newFileSizeMB = file.size / (1024 * 1024)

    if (isFileTooLarge(newFileSizeMB)) {
      showAlert(
        `¡El archivo supera el tamaño máximo permitido (${MAX_FILE_SIZE_MB}mb)!`,
        'error'
      )
      await deleteFiles()
      return
    }

    currentSelectFile.value = file

    rowsFile.value = [
      {
        id: 1,
        currentName: file.name ?? 'Sin definir',
        status: 20,
      },
    ]

    models.value.documents = handleFileObjectToUrlConversion(file as never)
  }

  const viewFileasync = async (fileProxy: File | null) => {
    if (!fileProxy) {
      openMainLoader(false)
      showAlert(`No hay archivo para mostrar`, 'error', undefined, 1000)
    } else {
      openMainLoader(false)
      await viewerFileComponentRef.value.showFile(toRaw(fileProxy))
    }
  }

  const loadDocumentPDF = async (obligationId: number | null | undefined) => {
    openMainLoader(true)
    if (!obligationId) return

    const result = await _loadDocumentURLPDF(obligationId)

    if (result) {
      downloadFile(result, `Tabla_de_amortizacion.pdf`)
    }

    openMainLoader(false)
  }

  const handlerShowViewerFile = async (
    obligationId: number | null | undefined
  ) => {
    openMainLoader(true)
    if (!obligationId) {
      showAlert('No hay un id seleccionado', 'error')
      openMainLoader(false)
      return
    }

    const result = await _loadDocumentPDF(obligationId)

    if (result) {
      await viewFileasync(result)
    }
  }

  const showInfoUpdate = (
    findId: number | undefined,
    selectorOptions: IObligationsOptions[]
  ) => {
    const checkId = selectorOptions.find((item) => item.value === findId)
    if (checkId) {
      return {
        creditAmount: checkId.payload.creditAmount,
        paymentQuotas: checkId.payload.paymentQuotas,
        interestRate: checkId.payload.loanRate,
        file: checkId.payload.documentFile,
        financialPlanning: checkId.payload.financialPlanning,
      }
    } else {
      return {
        creditAmount: null,
        paymentQuotas: null,
        interestRate: null,
        file: false,
        financialPlanning: false,
      }
    }
  }

  const loadAutoUpdate = (optionsLength: number): boolean => optionsLength <= 1

  const addFileToComponent = async (checkIdURL: number) => {
    openMainLoader(true)

    const resultFile = await _loadDocumentPDF(checkIdURL)
    if (resultFile) {
      addedFiles([resultFile])
    }

    openMainLoader(false)
  }

  const openAmortizationCreateModal = (
    currentPlanSelect: number | undefined,
    planType: IFinancialPlanType
  ) => {
    if (currentPlanSelect && planType) {
      currentPlanId.value = currentPlanSelect
      currentPlanType.value = planType
    }
  }

  const availableCreatePlanning = (
    planningActiveStatus: boolean,
    obligationIdStatus: number | undefined
  ): boolean => {
    const obligationStatus = obligationIdStatus

    const isValid = !(!planningActiveStatus && obligationStatus)
    return isValid
  }

  const notifyNoPlan = (validateId: number | undefined) => {
    if (validateId) {
      showAlert('No hay Plan de pago definido para esta obligación.', 'error')
    }
  }

  const validateFileAndPlan = (
    findId: number | undefined,
    selectorOptions: IObligationsOptions[]
  ) => {
    const checkId = selectorOptions.find((item) => item.value === findId)

    if (!checkId) return true

    if (checkId.payload.documentFile && checkId.payload.financialPlanning)
      return true

    if (checkId.payload.documentFile && !checkId.payload.financialPlanning)
      return false
    return true
  }

  watch(
    () => amortizationBusinessInfo.value.options,
    (newVal) => {
      obligationSelected.value = undefined

      if (newVal.length === 1) {
        currentPlanId.value = newVal[0].value
        obligationSelected.value = newVal[0].value
      }
    }
  )

  watch(
    () => obligationSelected.value,

    async (newVal) => {
      currentPlanType.value = 'financial-plan/default'
      if (!newVal) {
        currentPlanId.value = undefined
        await deleteFiles()
        notifyNoPlan(newVal)
        return
      }

      currentPlanId.value = newVal
      const hasFile = showInfoUpdate(
        newVal,
        amortizationBusinessInfo.value.options
      ).file

      if (hasFile) {
        await addFileToComponent(newVal)
      } else {
        await deleteFiles()
        notifyNoPlan(newVal)
      }
    },
    { immediate: false, deep: true }
  )

  watch(
    () => amortizationData.value,
    async (newVal) => {
      if (newVal) {
        amortizationBusinessInfo.value = {
          ...newVal,
        }
      }
    }
  )

  onMounted(async () => {
    obligationSelected.value = undefined
  })

  return {
    amortizationBusinessInfo,
    obligationSelected,
    getUrlPath,
    obligationsOptions,
    tableProps,
    amortizationDataFileRef,
    currentSelectFile,
    showAmortizationData,
    attachDocumentRef,
    uploadProps,
    progressValue,
    defaultIconsLucide,
    viewerFileComponentRef,
    getActions,
    currentAmortizationFilter,
    loadDocumentPDF,
    showInfoUpdate,
    availableCreatePlanning,
    handlerCreateAmortization,
    addedFiles,
    rejectedFiles,
    deleteFiles,
    handlerShowViewerFile,
    openAmortizationCreateModal,

    loadAutoUpdate,
    validateFileAndPlan,
  }
}

export default useAmortizationBasicForm
