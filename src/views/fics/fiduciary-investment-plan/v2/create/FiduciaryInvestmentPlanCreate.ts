// Vue - Pinia
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useAlert } from '@/composables/useAlert'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryInvestmentPlanCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    clearForm,
    _clearData,
    clearHolderTables,
    _createFiduciaryInvestmentPlan,
  } = useFiduciaryInvestmentPlanStore('v1')

  const { data_form, has_types_participation } = storeToRefs(
    useFiduciaryInvestmentPlanStore('v1')
  )

  const formInformation = ref()
  const formParameter = ref()
  const formHolder = ref()

  const keys = {
    fics: ['offices', 'print_groups', 'fic_profiles'],
    trust_business: ['business_trusts'],
    assets: ['cities', 'legal_people_fund_sources'],
  }
  const keyFicsBusinessLines = {
    fics: ['fic_business_lines'],
  }
  const keysFunts = {
    fics: ['funts_to_investment_plans'],
  }
  const keysV2 = {
    treasury: ['financial_info', 'financial_estate'],
  }

  const keysThirdParty = {
    key: {
      third_party: ['third_parties'],
    },
    params:
      'sort=id&include=legalPerson,financialInfo,naturalPerson,estate,documentType,contacts,addresses,status&filter[is_customer]=1&fields[]=id,document,is_customer,third_party_category,document_type_id,status_id',
  }

  const headerProperties = {
    title: 'Crear plan de inversión fiduciario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Planes de inversión fiduciarios',
        route: 'FiduciaryInvestmentPlanList',
      },
      {
        label: 'Crear',
        route: 'FiduciaryInvestmentPlanCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'holder',
      label: 'Identifiación titular plan de inversión',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'parameter',
      label: 'Parámetros planes de inversión',
      icon: defaultIconsLucide.chartLine,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const nextTab = async () => {
    tabActiveIdx.value++
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value--
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources(keys)
    await _getResources(keysV2, '', 'v2')
    await _getResources(keysFunts, 'filter[user_can_access]=true')
    await _getResources(keyFicsBusinessLines, 'type=1')
    await _getResources(keysThirdParty.key, keysThirdParty.params)

    openMainLoader(false)
  }

  const makePayload = () => {
    return {
      collective_investment_fund_id:
        data_form.value?.collective_investment_fund_id,
      operation_office_id: data_form.value?.operation_office_id,
      status_id: 1,
      holder_identification: {
        holders: data_form.value?.holder_identifications_list,
        emails: data_form.value?.emails?.map(({ id, ...rest }) => rest),
        check_digit: data_form.value?.randomCheck,
        fic_print_group_id:
          data_form.value?.holder_identification.fic_print_group_id,
        residential_address:
          data_form.value?.holder_identification.residential_address,
        email_address: data_form.value?.holder_identification.email_address,
        city_id: data_form.value?.holder_identification.city_id,
        phone: `${data_form.value?.holder_identification.phone}`,
        funding_source: String(
          data_form.value?.holder_identification.funding_source_id || ''
        ),
      },
      parameters: {
        fic_manager_user_id: Number(
          data_form.value?.parameters?.fic_manager_user_id
        ),
        fic_advisor_user_id: Number(
          data_form.value?.parameters?.fic_advisor_user_id
        ),
        has_web_operations: data_form.value?.parameters?.has_web_operations,
        contribution_operations_per_day:
          data_form.value?.parameters?.contribution_operations_per_day,
        contribution_operations_per_month:
          data_form.value?.parameters?.contribution_operations_per_month,
        withdrawal_operations_per_day:
          data_form.value?.parameters?.withdrawal_operations_per_day,
        withdrawal_operations_per_month:
          data_form.value?.parameters?.withdrawal_operations_per_month,
        fic_business_line_id: data_form.value?.parameters?.fic_business_line_id,
        penalty: data_form.value?.parameters?.penalty,
        percentage: data_form.value?.parameters?.percentage,
        has_trust_management: data_form.value?.parameters?.has_trust_management,
        business_trust_id: data_form.value?.parameters?.business_trust_id,
      },
    }
  }

  const onSubmit = async () => {
    if (
      has_types_participation.value &&
      !formParameter.value.models.parameters?.fic_business_line_id
    ) {
      showAlert('La Linea de negocio requerida', 'error', undefined, 2000)
      return
    }

    openMainLoader(true)

    const payload = makePayload()

    const create = await _createFiduciaryInvestmentPlan(payload)

    openMainLoader(false)

    if (create) {
      has_types_participation.value = false
      handleGoToList()
    }
  }

  const buttonValidate = computed(() => {
    if (tabActive.value == 'information') {
      return (
        data_form.value?.collective_investment_fund_id &&
        data_form.value?.operation_office_id
      )
    }

    if (tabActive.value == 'holder') {
      return (
        data_form.value?.holder_identification.funding_source_id &&
        data_form.value?.holder_identification.fic_print_group_id &&
        data_form.value?.holder_identification.city_id
      )
    }

    if (tabActive.value == 'parameter') {
      return false
    }
  })

  const handleGoToList = () =>
    goToURL('FiduciaryInvestmentPlanList', undefined, { reload: true })

  onUnmounted(() => {
    clearHolderTables()
  })
  onMounted(async () => {
    clearForm()

    _clearData()
    await loadResources()
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysFunts)
    _resetKeys(keysThirdParty.key)
  })

  return {
    tabs,
    nextTab,
    backTab,
    onSubmit,
    tabActive,
    formHolder,
    tabActiveIdx,
    formParameter,
    handleGoToList,
    buttonValidate,
    formInformation,
    headerProperties,
  }
}

export default useFiduciaryInvestmentPlanCreate
