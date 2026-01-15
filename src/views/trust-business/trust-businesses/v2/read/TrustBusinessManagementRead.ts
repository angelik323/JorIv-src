// vue - quasar
import { onBeforeMount, onUnmounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// stores
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IDocumentsTrustBusiness,
  INotificationAuthorizeTrustBusiness,
  ITrustBusinessFinanceForm,
  ITrustBusinessInformationForm,
  ITrustbusinessNotificationForm,
  ITrustBusinessRegisterThird,
} from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import { useMainLoader, useUtils } from '@/composables'

const { defaultIconsLucide, getFileFromS3 } = useUtils()

const useTrustBusinessManagementRead = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id

  // loader
  const { openMainLoader } = useMainLoader()

  // imports
  const { headerPropsDefault } = storeToRefs(useTrustBusinessStore('v2'))
  const { _getByIdTrustBusiness } = useTrustBusinessStore('v2')

  // breadcrumb
  const headerPropsCreate = {
    title: headerPropsDefault.value.title,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Ver',
          route: 'TrustBusinessesRead',
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

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  // actions
  const goToList = () => {
    router.push({ name: 'TrustBusinessesList' })
  }

  const onSubmit = async () => {
    openMainLoader(true)
    goToList()
    openMainLoader(false)
  }

  // lifecycles
  onBeforeMount(async () => {
    isLoading.value = true
    openMainLoader(true)

    responseData.value = await _getByIdTrustBusiness(searchId)
    isLoading.value = false

    setTimeout(() => {
      openMainLoader(false)
    }, 5000)
  })

  onUnmounted(() => {
    responseData.value = null
    getInformationFormData.value = null
    getDocumentsFormData.value = []
    getFinanceFormData.value = null
    getNotificationFormData.value = null
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
        business_type_id: `${val.business_type?.code ?? ''} - ${
          val.business_type?.name ?? ''
        }`,
        business_subtype_id: `${val.business_subtype?.code ?? ''} - ${
          val.business_subtype?.name ?? ''
        }`,
        business_mod: val.business_mod,
        classification: val.classification,
        office_id: `${val.office?.office_code ?? ''} - ${
          val.office?.office_description ?? ''
        }`,
        object: val.object,
        filing_date_sfc: val.filing_date_sfc,
        start_date: val.start_date,
        end_date: val.end_date,
        start_date_commission: val.start_date_commission,
        has_extend: val.has_extend,
        extend_date: val.extend_date,
        accountability_period: val.accountability_period,
        business_manager_id: `${val.business_manager?.abbreviation ?? ''} - ${
          val.business_manager?.document_number ?? ''
        } - ${val.business_manager?.full_name ?? ''}`,
        business_accountant_id: `${
          val.business_accountant?.abbreviation ?? ''
        } - ${val.business_accountant?.document_number ?? ''} - ${
          val.business_accountant?.full_name ?? ''
        }`,
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
        business_accounting: {
          ...val.accounting,
          country_id: val.accounting?.contry?.name,
          auxiliary_nit: val.accounting?.nit_auxiliary
            ? `${val.accounting?.nit_auxiliary?.document_type?.abbreviation} - ${val.accounting?.nit_auxiliary?.document} - ${val.accounting?.nit_auxiliary?.name}`
            : val.accounting?.nit_auxiliary,
          identification_tax: val.accounting?.tax_identification
            ? `${val.accounting?.tax_identification?.document_type?.abbreviation} - ${val.accounting?.tax_identification?.document} - ${val.accounting?.tax_identification?.name}`
            : val.accounting?.tax_identification,
          retaining_agent_id: val.accounting?.retaining_agent
            ? `${val.accounting?.retaining_agent?.document_type?.abbreviation} - ${val.accounting?.retaining_agent?.document} - ${val.accounting?.retaining_agent?.name}`
            : val.accounting?.retaining_agent,
          status_id: val.accounting?.status?.name,
          functional_currency_id: `${
            val.accounting?.functional_currency?.code ?? ''
          } - ${val.accounting?.functional_currency?.description ?? ''}`,

          principal_account: {
            ...val.accounting?.principal_account,
            account_structure_id:
              val.accounting?.principal_account?.account_structure?.purpose,
          },
          cost_center_structure_id: `${
            val.accounting?.cost_center_structure?.code ??
            val.accounting?.cost_center_structure?.id ??
            ''
          } - ${val.accounting?.cost_center_structure?.purpose ?? ''}`,
          equivalent_account: {
            ...val.accounting?.equivalent_account,
            account_structure_id:
              val.accounting?.equivalent_account?.account_structure?.purpose,
          },
          fiscal_account: {
            ...val.accounting?.fiscal_account,
            account_structure_id:
              val.accounting?.fiscal_account?.account_structure?.purpose,
          },
        },

        business_treasurie: {
          closing: val.treasurie?.closing,
          last_close_date: val.treasurie?.last_close_date,
          has_cash_flow: val.treasurie?.has_cash_flow,
          can_bank_reconciliation: val.treasurie?.can_bank_reconciliation,
          cash_flow_structure_id: val.treasurie?.cash_flow_structure?.purpose,
          last_conciliation_date: val.treasurie?.last_conciliation_date,
          has_collection_structure: val.treasurie?.has_collection_structure,
          collection_structure_id: `${val.treasurie?.collection_structure?.code} -
            ${val.treasurie?.collection_structure?.purpose}`,
          has_box_structure: val.treasurie?.has_box_structure,
          box_structure_id: `${val.treasurie?.box_structure?.code} -
            ${val.treasurie?.box_structure?.purpose}`,
        },

        business_account_payable: {
          ...val.accounts_payable,
          account_structure_id: val.accounts_payable?.account_structure?.id,
          account_structure_purpose:
            val.accounts_payable?.account_structure?.purpose,
        },
        business_normative: [...val.normative],

        business_derivate_contrating: val.derivate_contracting
          ? val.derivate_contrating || val.business_derived_contracting
            ? {
                id: val.derivate_contrating.id,
                has_budget: val.derivate_contrating?.has_budget ?? null,
                has_project: val.derivate_contrating?.has_project ?? null,
                has_structure_work:
                  val.derivate_contrating?.has_structure_work ?? null,
                works_plan: val.derivate_contracting?.works_plan || [],
                derivate_works_plan: val.derivate_contrating?.works_plan || [],
              }
            : {
                id: null,
                has_budget: null,
                has_project: null,
                has_structure_work: null,
                works_plan: [],
                derivate_works_plan: [],
              }
          : null,

        business_budget: {
          validity: val.budget?.validity ?? null,
          current_month: val.budget?.current_month ?? null,
          current_month_id: val.budget?.current_month_id ?? null,
          last_closing_date: val.budget?.last_closing_date ?? null,
          closing_type: val.budget?.closing_type ?? null,
          mhcp_section_code: Number(val.budget?.mhcp_section_code ?? null),
          mhcp_section_description:
            val.budget?.mhcp_section_description ?? null,
          budget_structure_id: val.budget?.budget_structure_id ?? null,
          budget_structure: val.budget?.budget_structure ?? null,
          generic_area_id: val.budget?.generic_area_id ?? null,
          generic_area: val.budget?.generic_area ?? null,
          generic_area_code: val.budget?.generic_area_code ?? null,
          expense_authorizer_id: val.budget?.expense_authorizer_id ?? null,
          expense_authorizer: val.budget?.expense_authorizer ?? null,
        },
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

    nextTab,
    backTab,
    onSubmit,
    goToList,
  }
}

export default useTrustBusinessManagementRead
