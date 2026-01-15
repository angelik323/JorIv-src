// vue - quasar
import { onBeforeMount, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// interfaces
import type { ITabs } from '@/interfaces/customs/Tab'
import type {
  IBuySaleTransactionData,
  IBuySaleFixedAssetsUpdateRequest,
  IFixedAssetDocumentRequest,
  IDocumentsBuySale
} from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'

// composables
import { useAlert, useMainLoader, useUtils, useGoToUrl, useS3Documents } from '@/composables'

// stores
import { useBuySaleFixedAssetsStore } from '@/stores/fixed-assets/buy-sale-fixed-assets'

const useBuyFixedAssetsEdit = () => {
  // route
  const route = useRoute()
  const searchId = +route.params.id

  // composables
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, getFileExtension } = useUtils()
  const { _saveDocumentsS3 } = useS3Documents()

  // imports stores
  const { headerPropsDefault } = storeToRefs(useBuySaleFixedAssetsStore('v1'))
  const { _getByIdBuySaleFixedAssets, _updateBuySaleFixedAssets, _getPresignedUrls } =
    useBuySaleFixedAssetsStore('v1')

  const transactionData = ref<IBuySaleTransactionData | null>(null)

  // breadcrumb
  const headerPropsEdit = ref({
    title: 'Editar compra de activos fijos y bienes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar Compra',
        route: 'BuyFixedAssetsEdit'
      },
      { label: `${searchId}` }
    ]
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
  ): (IBuySaleFixedAssetsUpdateRequest & { document_ids?: number[] }) | null => {
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

    return {
      ...formData,
      document_ids: documentIds.length > 0 ? documentIds : undefined
    } as IBuySaleFixedAssetsUpdateRequest & { document_ids?: number[] }
  }

  const handleDocumentsUpload = async (files: IDocumentsBuySale[]): Promise<number[]> => {
    if (!files || files.length === 0) return []

    const newFiles = files.filter((f) => f.file)

    const existingDocumentIds = files
      .filter((f) => !f.file && f.id)
      .map((f) => f.id as number)

    if (newFiles.length === 0) return existingDocumentIds

    const documentsMetadata: IFixedAssetDocumentRequest[] = newFiles.map((fileField) => ({
      name: fileField.file?.name ?? fileField.name ?? '',
      model_name: 'FIXED_ASSET' as const,
      document_type: getFileExtension(fileField.file?.name ?? ''),
      file_size: fileField.file?.size ?? fileField.size ?? 0
    }))
    const presignedResponse = await _getPresignedUrls(documentsMetadata)

    if (!presignedResponse || !presignedResponse.success || presignedResponse.data.length === 0) {
      showAlert('Error al obtener URLs de carga', 'error')
      return existingDocumentIds
    }

    const presignedData = presignedResponse.data

    const uploadUrls: string[] = []
    const filesToUpload: File[] = []
    const newDocumentIds: number[] = []

    presignedData.forEach((presigned, index) => {
      const file = newFiles[index].file

      if (!file || !presigned.upload_url || !presigned.document_id) return

      uploadUrls.push(presigned.upload_url)
      filesToUpload.push(file)
      newDocumentIds.push(presigned.document_id)
    })

    if (uploadUrls.length > 0 && filesToUpload.length > 0) {
      await _saveDocumentsS3(uploadUrls, filesToUpload, false)
    }

    return [...existingDocumentIds, ...newDocumentIds]
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

      if (documentIds.length === 0 && documentsFormData.value.some((f) => f.file)) {
        showAlert('Error al procesar los documentos nuevos', 'error')
        openMainLoader(false)
        return
      }
    }

    const payload = makeDataRequest(documentIds)
    if (!payload) {
      openMainLoader(false)
      return showAlert(
        'No hay datos para actualizar o faltan campos requeridos',
        'error',
        undefined,
        3000
      )
    }

    const response = await _updateBuySaleFixedAssets(searchId, payload)

    if (response) {
      goToList()
    }

    openMainLoader(false)
  }

  onBeforeMount(async () => {
    openMainLoader(true)

    const data = await _getByIdBuySaleFixedAssets(searchId)
    if (data) {
      transactionData.value = data
    }

    openMainLoader(false)
  })

  return {
    defaultIconsLucide,
    headerPropsEdit,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    formDocuments,
    transactionData,

    // Documents
    documentsFormData,
    setDocumentsFormData,

    goToList,
    onSubmit,
    backTab,
    nextTab
  }
}

export default useBuyFixedAssetsEdit
