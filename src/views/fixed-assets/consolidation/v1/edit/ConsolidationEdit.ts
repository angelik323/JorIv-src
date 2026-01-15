// vue -quasar -pinia
import {
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IConsolidationCreate,
  IConsolidationDocumentsForm,
  IConsolidationInformationForm,
} from '@/interfaces/customs/fixed-assets/v1/Consolidation'

// composables
import { useAlert } from '@/composables/useAlert'
import { useS3Documents } from '@/composables/useS3Documents'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'

// stores
import { useConsolidationStore } from '@/stores/fixed-assets/consolidation'

const useConsolidationEdit = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id

  // alert
  const { showAlert } = useAlert()

  // loader
  const { openMainLoader } = useMainLoader()

  const { headerPropsDefault } = storeToRefs(useConsolidationStore('v1'))

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()

  const {
    _getByIdConsolidation,
    _updateConsolidation,
    _addConsolidationFile,
    _updateConsolidationDocuments,
  } = useConsolidationStore('v1')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  // breadcrumb
  const headerPropsCreate = {
    title: 'Editar englobe',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Editar',
          route: 'ConsolidationEdit',
        },
        {
          label: `${searchId}`,
        },
      ],
    ],
  }

  // refs
  const isLoading = ref(true)
  const responseData = ref()

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
    let valid: boolean = false
    const forms = [formInformation, formDocuments]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
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

  // actions
  const makeDataRequest = (): IConsolidationCreate => {
    return cleanEmptyFields(
      getInformationFormData.value!,
      true
    ) as IConsolidationCreate
  }
  const goToList = () => {
    router.push({ name: 'ConsolidationList' })
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

    const success = await _updateConsolidation(searchId, payload)

    if (success && getDocumentsFormData.value) {
      handleDocumentsUpload(searchId, getDocumentsFormData.value)
    }

    openMainLoader(false)
    return goToList()
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
      if (!file || !fileField.is_new) continue

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

  // lifecycles
  onBeforeMount(async () => {
    openMainLoader(true)

    setTimeout(() => {
      openMainLoader(false)
    }, 5000)
  })

  onMounted(async () => {
    isLoading.value = true
    responseData.value = await _getByIdConsolidation(searchId)
    isLoading.value = false
  })

  onBeforeUnmount(async () => {
    getInformationFormData.value = null
  })

  onUnmounted(() => {
    getInformationFormData.value = null
    getDocumentsFormData.value = []
    responseData.value = null
    isLoading.value = false
  })

  // watches
  watch(
    () => responseData.value,
    async (val) => {
      if (!val) return
      setInformationFormData(val)
      setDocumentsFormData(val.documents)
    },
    { deep: true }
  )

  return {
    // refs
    responseData,
    isLoading,
    headerPropsCreate,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    formDocuments,
    getInformationFormData,
    getDocumentsFormData,
    defaultIconsLucide,

    // functions
    validateForms,
    nextTab,
    backTab,
    onSubmit,
    setInformationFormData,
    setDocumentsFormData,
    goToList,
  }
}

export default useConsolidationEdit
