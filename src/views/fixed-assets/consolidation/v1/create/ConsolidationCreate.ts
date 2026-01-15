// vue -pinia
import {
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted,
  ref,
  onMounted,
} from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IConsolidationCreate,
  IConsolidationDocumentsForm,
  IConsolidationInformationForm,
} from '@/interfaces/customs/fixed-assets/v1/Consolidation'

// composables
import { useS3Documents } from '@/composables/useS3Documents'
import { useAlert } from '@/composables/useAlert'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'

// stores
import { useConsolidationStore } from '@/stores/fixed-assets/consolidation/index'
import { useResourceManagerStore } from '@/stores'

const useConsolidationCreate = () => {
  // router
  const { goToURL } = useGoToUrl()

  // alert
  const { showAlert } = useAlert()

  // loader
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  // refs
  const keys = ref({
    fixed_assets: [
      'consolidation_sources',
      'fixed_assets_types',
      'fixed_assets_subtypes',
      'fixed_assets_types_new',
      'fixed_assets_subtypes_new',
      'responsibles_by_fixed_assets',
      'responsibles_by_fixed_assets_options',
    ],
    trust_business: [
      'business_currency',
      'business_trust_account_structures',
      'business_trusts_currency',
    ],
  })
  const keys2 = ref({
    trust_business: ['business_trusts'],
  })

  const { headerPropsDefault } = storeToRefs(useConsolidationStore('v1'))

  const {
    _createConsolidation,
    _addConsolidationFile,
    _updateConsolidationDocuments,
  } = useConsolidationStore('v1')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()
  const { _getResources } = useResourceManagerStore('v1')

  // breadcrumb
  const headerPropsCreate = {
    title: 'Crear englobe',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Crear',
          route: 'ConsolidationCreate',
        },
      ],
    ],
  }

  // form refs
  const formInformation = ref()
  const formDocuments = ref()

  // init data children
  const getInformationFormData = ref<IConsolidationInformationForm | null>(null)
  const getDocumentsFormData = ref<IConsolidationDocumentsForm[]>([])

  // set data children
  const setInformationFormData = (
    data: IConsolidationInformationForm | null
  ) => {
    getInformationFormData.value = data
  }

  const setDocumentsFormData = (data: IConsolidationDocumentsForm[]) => {
    getDocumentsFormData.value = data
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'documents',
      label: 'Documentos',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)

  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  const validateForms = async () => {
    const forms = [formInformation, formDocuments]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      return (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
    }

    return false
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

  // actions
  const makeDataRequest = (): IConsolidationCreate => {
    return cleanEmptyFields(
      getInformationFormData.value!,
      true
    ) as IConsolidationCreate
  }

  const onSubmit = async () => {
    if (!(await validateForms()))
      return showAlert(
        'Agregue por lo menos un documento.',
        'error',
        undefined,
        3000
      )

    openMainLoader(true)

    const payload: IConsolidationCreate = makeDataRequest()

    const businessId = await _createConsolidation(payload)

    if (businessId && getDocumentsFormData.value) {
      handleDocumentsUpload(businessId, getDocumentsFormData.value)
    }
    openMainLoader(false)
    return goToURL('ConsolidationList')
  }

  const handleDocumentsUpload = async (
    businessId: number,
    files: IConsolidationDocumentsForm[]
  ): Promise<void> => {
    const documentIds: string[] = []
    const uploadUrls: string[] = []
    const filesToUpload: File[] = []

    for (const fileField of files) {
      const file = fileField.file
      if (!file) continue

      const { success, documentId, uploadUrl } = await _addConsolidationFile(
        businessId,
        {
          name: file.name,
          document_type: getExtensionFromMimeType(file.type),
          business_document_type: fileField.business_document_type ?? '',
          business_document_section: fileField.business_document_section ?? '',
        }
      )

      if (!success || !documentId || !uploadUrl) continue

      documentIds.push(documentId.toString())
      uploadUrls.push(uploadUrl)
      filesToUpload.push(file)
    }

    if (!uploadUrls.length || !filesToUpload.length) return

    _saveDocumentsS3(uploadUrls, filesToUpload, false)
    _updateConsolidationDocuments(businessId, {
      documents: documentIds,
      is_validated: true,
    })
  }
  // lifecycle hooks
  onMounted(async () => {
    await _getResources(keys.value, '', 'v1')
    await _getResources(keys2.value, 'business_trusts&filter[effect]=true')
  })

  // lifecycle
  onBeforeMount(() => {
    openMainLoader(true)

    setTimeout(() => {
      openMainLoader(false)
    }, 5000)
  })

  onBeforeUnmount(() => {
    getInformationFormData.value = null
    getDocumentsFormData.value = []
  })

  onUnmounted(() => {
    getInformationFormData.value = null
    getDocumentsFormData.value = []
  })

  return {
    // refs
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    formDocuments,
    headerPropsCreate,
    defaultIconsLucide,
    getInformationFormData,
    getDocumentsFormData,

    // functions
    nextTab,
    backTab,
    validateForms,
    onSubmit,
    goToURL,
    setInformationFormData,
    setDocumentsFormData,
  }
}

export default useConsolidationCreate
