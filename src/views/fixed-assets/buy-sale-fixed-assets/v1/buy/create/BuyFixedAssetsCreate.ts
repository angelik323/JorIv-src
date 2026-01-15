// vue - quasar
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IBuySaleFixedAssetsCreateRequest,
  IFixedAssetDocumentRequest,
  IDocumentsBuySale
} from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'
import { IBuyOrderFixedAssetsList } from '@/interfaces/customs/fixed-assets/BuyOrderFixedAssets'

// composables
import { useAlert, useMainLoader, useUtils, useGoToUrl, useS3Documents } from '@/composables'

// stores
import { useBuySaleFixedAssetsStore } from '@/stores/fixed-assets/buy-sale-fixed-assets'

type StepType = 'select-order' | 'form'

const useBuyFixedAssetsCreate = () => {
  // composables
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, getFileExtension } = useUtils()
  const { _saveDocumentsS3 } = useS3Documents()

  // imports stores
  const { headerPropsDefault } = storeToRefs(useBuySaleFixedAssetsStore('v1'))
  const { _createBuySaleFixedAssets, _getPresignedUrls } = useBuySaleFixedAssetsStore('v1')

  // steps
  const currentStep = ref<StepType>('select-order')
  const selectedPurchaseOrder = ref<IBuyOrderFixedAssetsList | null>(null)

  // computed
  const isSelectOrderStep = computed(() => currentStep.value === 'select-order')
  const isFormStep = computed(() => currentStep.value === 'form')

  // breadcrumb
  const headerPropsCreate = computed(() => {
    const baseBreadcrumbs = [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear Compra',
        route: 'BuyFixedAssetsCreate'
      }
    ]
    if (isSelectOrderStep.value) {
      return {
        title: 'Orden de compra de activos fijos y bienes',
        breadcrumbs: [...baseBreadcrumbs, { label: 'Seleccionar Orden' }]
      }
    }
    if (isFormStep.value && selectedPurchaseOrder.value) {
      return {
        title: 'Crear compra de activos fijos y bienes',
        breadcrumbs: [...baseBreadcrumbs, { label: `Orden #${selectedPurchaseOrder.value.id}` }]
      }
    }
    return {
      title: 'Crear compra de activos fijos y bienes',
      breadcrumbs: baseBreadcrumbs
    }
  })

  // form refs
  const formInformation = ref()
  const formDocuments = ref()

  // data children
  const documentsFormData = ref<IDocumentsBuySale[]>([])

  const setDocumentsFormData = (data: IDocumentsBuySale[]) => {
    documentsFormData.value = data
  }

  // tabs
  const tabs = computed<ITabs[]>(() => {
    return [
      {
        name: 'information',
        label: 'Datos básicos',
        icon: defaultIconsLucide.bulletList,
        outlined: true,
        disable: true,
        show: true,
        required: false
      },
      {
        name: 'documents',
        label: 'Documentos*',
        icon: defaultIconsLucide.file,
        outlined: true,
        disable: true,
        show: true,
        required: false
      }
    ]
  })

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)
  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [formInformation, formDocuments]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid = (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (await validateForms()) {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const makeDataRequest = (
    documentIds: number[]
  ): (IBuySaleFixedAssetsCreateRequest & { document_ids?: number[] }) | null => {
    const formData = formInformation.value?.getRequestData()
    if (!formData) return null

    if (
      !formData.business_trust_id ||
      !formData.third_party_id ||
      !formData.cost_center_id ||
      !formData.currency_id ||
      !formData.configuration_type_id ||
      !formData.configuration_subtype_id ||
      !formData.transaction_date ||
      !formData.transaction_value ||
      !formData.asset_category
    ) {
      return null
    }

    if (selectedPurchaseOrder.value) {
      formData.purchase_order_id = selectedPurchaseOrder.value.id.toString()
    }

    return {
      ...formData,
      document_ids: documentIds.length > 0 ? documentIds : undefined
    } as IBuySaleFixedAssetsCreateRequest & { document_ids?: number[] }
  }

  const handleDocumentsUpload = async (files: IDocumentsBuySale[]): Promise<number[]> => {
    if (!files || files.length === 0) return []

    const newFiles = files.filter((f) => f.file)
    if (newFiles.length === 0) return []

    const documentsMetadata: IFixedAssetDocumentRequest[] = newFiles.map((fileField) => ({
      name: fileField.file?.name ?? fileField.name ?? '',
      model_name: 'FIXED_ASSET' as const,
      document_type: getFileExtension(fileField.file?.name ?? ''),
      file_size: fileField.file?.size ?? fileField.size ?? 0
    }))

    const presignedResponse = await _getPresignedUrls(documentsMetadata)

    if (!presignedResponse || !presignedResponse.success || presignedResponse.data.length === 0) {
      showAlert('Error al obtener URLs de carga', 'error')
      return []
    }

    const presignedData = presignedResponse.data

    const uploadUrls: string[] = []
    const filesToUpload: File[] = []
    const documentIds: number[] = []

    presignedData.forEach((presigned, index) => {
      const file = newFiles[index].file

      if (!file || !presigned.upload_url || !presigned.document_id) return

      uploadUrls.push(presigned.upload_url)
      filesToUpload.push(file)
      documentIds.push(presigned.document_id)
    })

    if (uploadUrls.length > 0 && filesToUpload.length > 0) {
      await _saveDocumentsS3(uploadUrls, filesToUpload, false)
    }

    return documentIds
  }

  // actions
  const handleOrderSelected = (order: IBuyOrderFixedAssetsList) => {
    selectedPurchaseOrder.value = order
    currentStep.value = 'form'
  }

  const goBackToSelectOrder = () => {
    currentStep.value = 'select-order'
    selectedPurchaseOrder.value = null
  }

  const goToList = () => {
    goToURL('BuySaleFixedAssetsList')
  }

  const validateDocumentsRequired = (): boolean => {
    if (!documentsFormData.value || documentsFormData.value.length === 0) {
      showAlert('Debe adjuntar al menos 1 documento', 'warning', undefined, 3000)
      return false
    }
    return true
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return
    if (!validateDocumentsRequired()) return

    openMainLoader(true)

    let documentIds: number[] = []

    if (documentsFormData.value && documentsFormData.value.length > 0) {
      documentIds = await handleDocumentsUpload(documentsFormData.value)

      if (documentIds.length === 0) {
        showAlert('Error al procesar los documentos', 'error')
        openMainLoader(false)
        return
      }
    }

    const payload = makeDataRequest(documentIds)
    if (!payload) {
      openMainLoader(false)
      return showAlert(
        'No hay datos para crear o faltan campos requeridos',
        'error',
        undefined,
        3000
      )
    }

    // 3. Crear el registro
    const success = await _createBuySaleFixedAssets(payload)
    if (success) {
      setTimeout(() => {
        openMainLoader(false)
        goToList()
      }, 5000)
    } else {
      openMainLoader(false)
    }
  }

  const handleBack = () => {
    if (isFormStep.value) {
      goBackToSelectOrder()
    } else {
      goToList()
    }
  }

  const handleGoToImport = () => {
    if (selectedPurchaseOrder.value) {
      goToURL('BuyFixedAssetsImport', undefined, {
        purchase_order_id: selectedPurchaseOrder.value.id
      })
    }
  }

  // lifecycle
  onMounted(() => {
    currentStep.value = 'select-order'
    documentsFormData.value = []
  })

  return {
    defaultIconsLucide,

    // Steps
    currentStep,
    isSelectOrderStep,
    isFormStep,

    // Order
    selectedPurchaseOrder,
    handleOrderSelected,
    goBackToSelectOrder,

    // Header & Form
    headerPropsCreate,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    formDocuments,

    // Documents
    documentsFormData,
    setDocumentsFormData,

    // Actions
    goToList,
    onSubmit,
    handleBack,
    backTab,
    nextTab,
    handleGoToImport
  }
}

export default useBuyFixedAssetsCreate
