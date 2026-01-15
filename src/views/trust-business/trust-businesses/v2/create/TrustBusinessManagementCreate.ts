// vue - quasar
import { onBeforeMount, onBeforeUnmount, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// stores
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'
import { useResourceStore } from '@/stores/resources-selects'
import { useResourceManagerStore } from '@/stores/resources-manager'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IDocumentsTrustBusiness,
  ITrustBusinessCreate,
  ITrustBusinessInformationForm,
  ITrustbusinessNotificationForm,
} from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import {
  useAlert,
  useMainLoader,
  useUtils,
  useS3Documents,
} from '@/composables'

const { defaultIconsLucide, cleanEmptyFields } = useUtils()

const useTrustBusinessManagementCreate = () => {
  // router
  const router = useRouter()

  // alert
  const { showAlert } = useAlert()

  // loader
  const { openMainLoader } = useMainLoader()

  // imports
  const { getResources } = useResourceStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { headerPropsDefault } = storeToRefs(useTrustBusinessStore('v2'))
  const {
    _createTrustBusiness,
    _addTrustBusinessFile,
    _updateTrustBusinessDocuments,
  } = useTrustBusinessStore('v2')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  // keys
  const trust_business_keys = {
    // fics
    fics: ['offices'],

    trust_business: [
      'business_trust_register_types',
      'business_trust_fideico_types',
      'business_trust_society_types',
      'business_trust_subtypes',
      'business_trust_mode',
      'business_trust_classification',

      // accounting
      'status_accounting',
      'account_structures',
      'cost_centers_structures',
      'business_currency',
      'fiscal_responsibility',

      // treasurie
      'close_treasurie',
      'cash_flow_structure',
      'collection_structure',

      // additional information
      'business_trust_periodicity_accountability',
      'users',

      // cxp
      'payment_concept_structure',
      'accounts_payable_closing',

      //Budget
      'budget_mhcp_codes',
      'business_trust_third_parties',
    ],
    assets: ['users'],
    budget: [
      'accounting_budget_mapping_parameters',
      'areas_resposabilities_codes',
    ],

    // investment portfolio
    investment_portfolio: ['coins'],
  }

  const third_parties_keys = { trust_business: ['third_parties'] }

  const keys = ['countries', 'departments', 'cities']
  const derivative_contracting_keys = { derivative_contracting: ['work_plan'] }

  const accounting_kyes = { accounting: ['budget_structures_generate'] }

  // breadcrumb
  const headerPropsCreate = {
    title: headerPropsDefault.value.title,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Crear',
          route: 'TrustBusinessesCreate',
        },
      ],
    ],
  }

  // form refs
  const formInformation = ref()
  const formDocuments = ref()
  const formNotification = ref()

  // init data children
  const getInformationFormData = ref<ITrustBusinessInformationForm | null>(null)
  const getDocumentsFormData = ref<IDocumentsTrustBusiness[]>([])
  const getNotificationFormData = ref<ITrustbusinessNotificationForm | null>(
    null
  )

  // set data children
  const setInformationFormData = (
    data: ITrustBusinessInformationForm | null
  ) => {
    getInformationFormData.value = data
  }

  const setDocumentsFormData = (data: IDocumentsTrustBusiness[]) => {
    getDocumentsFormData.value = data
  }

  const setNotificationFormData = (
    data: ITrustbusinessNotificationForm | null
  ) => {
    getNotificationFormData.value = data
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'documents',
      label: 'Documentos*',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'notification',
      label: 'Notificaciones y autorizaciones*',
      icon: defaultIconsLucide.emailOutline,
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
    const forms = [formInformation, formDocuments, formNotification]

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
  const makeDataRequest = (): ITrustBusinessCreate => {
    return cleanEmptyFields(
      {
        ...getInformationFormData.value!,
        status_id: 56,
        ...getNotificationFormData.value,
      },
      true
    ) as ITrustBusinessCreate
  }

  const goToList = () => {
    router.push({
      name: 'TrustBusinessesList',
      query: {
        reload: 1,
      },
    })
  }

  const onSubmit = async () => {
    if (!(await validateForms()))
      return showAlert(
        'Agregue por lo menos una persona en notificaciones y autorizaciones.',
        'error',
        undefined,
        3000
      )

    openMainLoader(true)

    const payload: ITrustBusinessCreate = makeDataRequest()

    const businessId = await _createTrustBusiness(payload)

    if (businessId && getDocumentsFormData.value) {
      handleDocumentsUpload(businessId, getDocumentsFormData.value)
    }
    openMainLoader(false)
    return goToList()
  }

  const handleDocumentsUpload = async (
    businessId: number,
    files: IDocumentsTrustBusiness[]
  ): Promise<void> => {
    const documentIds: string[] = []
    const uploadUrls: string[] = []
    const filesToUpload: File[] = []

    for (const fileField of files) {
      const file = fileField.file
      if (!file) continue

      const { success, documentId, uploadUrl } = await _addTrustBusinessFile(
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
    _updateTrustBusinessDocuments(businessId, {
      documents: documentIds,
      is_validated: true,
    })
  }

  // lifecycles
  onBeforeMount(async () => {
    openMainLoader(true)
    Promise.all([
      getResources(`keys[]=${keys.join('&keys[]=')}`),
      _getResources(trust_business_keys),
      _getResources(third_parties_keys),
      _getResources(accounting_kyes, '', 'v2'),
      _getResources(
        derivative_contracting_keys,
        'work_plan&filter[status_id]=1'
      ),
    ])

    setTimeout(() => {
      openMainLoader(false)
    }, 5000)
  })

  onBeforeUnmount(async () => {
    await _resetKeys(trust_business_keys)
    await _resetKeys(third_parties_keys)
    await _resetKeys(accounting_kyes)
  })

  onUnmounted(() => {
    getInformationFormData.value = null
    getDocumentsFormData.value = []
    getNotificationFormData.value = null
  })

  return {
    headerPropsCreate,
    tabs,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    formInformation,
    formDocuments,
    formNotification,
    getInformationFormData,
    getDocumentsFormData,
    getNotificationFormData,

    nextTab,
    backTab,
    onSubmit,
    goToList,
    setInformationFormData,
    setDocumentsFormData,
    setNotificationFormData,
  }
}

export default useTrustBusinessManagementCreate
