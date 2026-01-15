// vue - quasar
import {
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// stores
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'
import { useResourceStore } from '@/stores/resources-selects'
import { useResourceManagerStore } from '@/stores/resources-manager'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IDocumentsTrustBusiness,
  INotificationAuthorizeTrustBusiness,
  ITrustBusinessCreate,
  ITrustBusinessFinanceForm,
  ITrustBusinessInformationForm,
  ITrustbusinessNotificationForm,
  ITrustBusinessRegisterThird,
} from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import {
  useAlert,
  useMainLoader,
  useUtils,
  useS3Documents,
} from '@/composables'

const { defaultIconsLucide, getFileFromS3, cleanEmptyFields } = useUtils()

const useTrustBusinessManagementEdit = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id

  // alert
  const { showAlert } = useAlert()

  // loader
  const { openMainLoader } = useMainLoader()

  // imports
  const { getResources } = useResourceStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { headerPropsDefault } = storeToRefs(useTrustBusinessStore('v2'))
  const {
    _getByIdTrustBusiness,
    _updateTrustBusiness,
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
    //derivative contracting
    derivative_contracting: ['work_plan'],

    // investment portfolio
    investment_portfolio: ['coins'],
  }

  const third_parties_keys = { trust_business: ['third_parties'] }

  const keys = ['countries', 'departments', 'cities']

  const accounting_kyes = { accounting: ['budget_structures_generate'] }

  // breadcrumb
  const headerPropsCreate = {
    title: headerPropsDefault.value.title,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Editar',
          route: 'TrustBusinessesEdit',
        },
        {
          label: `${searchId}`,
        },
      ],
    ],
  }

  // form refs
  const formInformation = ref()
  const formDocuments = ref()
  const formFinance = ref()
  const formNotification = ref()

  const responseData = ref()

  // init data children
  const isLoading = ref(true)
  const getInformationFormData = ref<ITrustBusinessInformationForm | null>(null)
  const getDocumentsFormData = ref<IDocumentsTrustBusiness[]>([])
  const getFinanceFormData = ref<ITrustBusinessFinanceForm | null>(null)
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
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'documents',
      label: 'Documentos*',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'finance',
      label: 'Gestión financiera*',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'notification',
      label: 'Notificaciones y autorizaciones*',
      icon: defaultIconsLucide.emailOutline,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)

  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [
      formInformation,
      formDocuments,
      formFinance,
      formNotification,
    ]

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

  const handleTabChange = async (newIdx: number) => {
    if (newIdx > tabActiveIdx.value) {
      if (await validateForms()) {
        tabActiveIdx.value = newIdx
        tabActive.value = tabs.value[newIdx].name
      }
    } else {
      tabActiveIdx.value = newIdx
      tabActive.value = tabs.value[newIdx].name
    }
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

    const success = await _updateTrustBusiness(payload, searchId)

    if (getDocumentsFormData.value && success) {
      handleDocumentsUpload(searchId, getDocumentsFormData.value)
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
      if (!file || !fileField.is_new) continue

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

  onMounted(async () => {
    responseData.value = await _getByIdTrustBusiness(searchId)
    isLoading.value = false
  })

  // lifecycles
  onBeforeMount(async () => {
    isLoading.value = true
    openMainLoader(true)
    Promise.all([
      getResources(`keys[]=${keys.join('&keys[]=')}`),
      _getResources(trust_business_keys),
      _getResources(third_parties_keys),
      _getResources(accounting_kyes, '', 'v2'),
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
    getFinanceFormData.value = null
    getNotificationFormData.value = null
    responseData.value = null
  })

  // watchs
  watch(
    () => responseData.value,
    async (val) => {
      getInformationFormData.value = {
        id: val.id,
        register_type: val.register_type,
        business_code: val.business_code,
        name: val.name,
        business_type_id: val.business_type?.id,
        business_subtype_id: val.business_subtype?.id,
        business_mod: val.business_mod,
        classification: val.classification,
        office_id: val.office?.id,
        object: val.object,
        filing_date_sfc: val.filing_date_sfc,
        start_date: val.start_date,
        end_date: val.end_date,
        start_date_commission: val.start_date_commission,
        has_extend: val.has_extend,
        extend_date: val.extend_date,
        accountability_period: val.accountability_period,
        business_manager_id: val.business_manager?.id,
        business_accountant_id: val.business_accountant?.id,
        consortium: val.consortium,
        manage_budget: val.manage_budget,
        derivate_contracting: val.derivate_contracting,
        has_accounts_payable: val.has_accounts_payable,
        has_billing: val.has_billing,
        has_assets: val.has_assets,
        has_policy: val.has_policy,
        has_guarantee: val.has_guarantee,
        has_real_estate_project: val.has_real_estate_project,
        has_secured_creditor: val.has_secured_creditor,
        has_normative: val.has_normative,
        has_budget: val.has_budget,
        status_id: val.status?.id,
        status_fiduciary_fees_id: val.status_fiduciary_fees?.id,
        business_resources: val.resources?.map(
          (item: ITrustBusinessRegisterThird) => ({
            ...item,
            type_resource: Number(item.type_resource),
          })
        ),
        business_accounting: val.accounting
          ? {
              ...val.accounting,
              country_id: val.accounting?.contry?.id,
              department_id: val.accounting?.departament?.id,
              city_id: val.accounting?.city?.id,
              auxiliary_nit: val.accounting?.nit_auxiliary?.id,
              identification_tax: val.accounting?.tax_identification?.id,
              retaining_agent_id: val.accounting?.retaining_agent?.id,
              status_id: val.accounting?.status?.id,
              functional_currency_id: val.accounting?.functional_currency?.id,
              principal_account: {
                ...val.accounting?.principal_account,
                account_structure_id:
                  val.accounting?.principal_account?.account_structure?.id,
              },
              cost_center_structure_id:
                val.accounting?.cost_center_structure?.id,
              equivalent_account: {
                ...val.accounting?.equivalent_account,
                account_structure_id:
                  val.accounting?.equivalent_account?.account_structure?.id,
              },
              fiscal_account: {
                ...val.accounting?.fiscal_account,
                account_structure_id:
                  val.accounting?.fiscal_account?.account_structure?.id,
              },
            }
          : null,
        business_treasurie: val.treasurie
          ? {
              closing: val.treasurie?.closing,
              last_close_date: val.treasurie?.last_close_date,
              has_cash_flow: val.treasurie?.has_cash_flow,
              can_bank_reconciliation: val.treasurie?.can_bank_reconciliation,
              cash_flow_structure_id: val.treasurie?.cash_flow_structure?.id,
              last_conciliation_date: val.treasurie?.last_conciliation_date,
              has_collection_structure: val.treasurie?.has_collection_structure,
              collection_structure_id: val.treasurie?.collection_structure?.id,
              has_box_structure: val.treasurie?.has_box_structure,
              box_structure_id: val.treasurie?.box_structure?.id,
            }
          : null,
        business_account_payable: val.accounts_payable
          ? {
              ...val.accounts_payable,
              account_structure_id: val.accounts_payable?.account_structure?.id,
            }
          : null,
        business_normative: val.normative ? [...val.normative] : [],

        business_derivate_contrating:
          val.derivate_contracting === true && val.derivate_contrating
            ? {
                id: val.derivate_contrating.id,
                has_budget: val.derivate_contrating.has_budget,
                has_project: val.derivate_contrating.has_project,
                has_structure_work: val.derivate_contrating.has_structure_work,
                works_plan: val.derivate_contrating.works_plan || [],
                derivate_works_plan: (
                  val.derivate_contrating.works_plan || []
                ).map((item: { id: number }) => ({
                  work_plan_id: item.id,
                  id: item.id,
                })),
              }
            : null,
        business_budget:
          val.manage_budget === true && val.budget
            ? {
                ...val.budget,
                current_month:
                  typeof val.budget.current_month === 'string'
                    ? Number(val.budget.current_month.split(' - ')[0])
                    : val.budget.current_month,
                budget_structure_id: val.budget.budget_structure
                  ? {
                      ...val.budget.budget_structure,
                      value:
                        val.budget.budget_structure.area_id ??
                        val.budget.budget_structure.id,
                      label: val.budget.budget_structure.code_name,
                    }
                  : val.budget.budget_structure_id,
              }
            : null,
        business_billing: val.billing_collect,
      }

      if (val.files) {
        getDocumentsFormData.value = val.files.map(
          (item: IDocumentsTrustBusiness) => ({
            ...item,
            file: undefined,
            is_new: false,
            to_delete: false,
          })
        )
        ;(async () => {
          const filesWithBlobs = await Promise.all(
            val.files.map(async (item: IDocumentsTrustBusiness) => ({
              ...item,
              file: await getFileFromS3(
                item.s3_file_path ?? '',
                item.original_name ?? ''
              ),
              is_new: false,
              to_delete: false,
            }))
          )
          getDocumentsFormData.value = filesWithBlobs
        })()
      }

      getFinanceFormData.value = {
        business_trust_general_orders: val.business_trust_general_orders,
        bank_accounts: val.bank_accounts,
      }

      getNotificationFormData.value = {
        business_notifications: val.business_notifications?.map(
          (item: INotificationAuthorizeTrustBusiness) => ({
            ...item,
            third_party_id: item.third_party?.id,
            type: item.type,
            name: item.third_party?.name,
            phone: item.third_party?.phone,
            email: item.third_party?.email,
            address: item.third_party?.address,
            status_id: item.third_party?.status_id,
          })
        ),
      }
    },
    { deep: true }
  )

  return {
    headerPropsCreate,
    tabs,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    formInformation,
    formDocuments,
    formFinance,
    formNotification,
    getInformationFormData,
    getDocumentsFormData,
    getFinanceFormData,
    getNotificationFormData,
    isLoading,
    searchId,

    nextTab,
    backTab,
    handleTabChange,
    onSubmit,
    goToList,
    setInformationFormData,
    setDocumentsFormData,
    setNotificationFormData,
  }
}

export default useTrustBusinessManagementEdit
