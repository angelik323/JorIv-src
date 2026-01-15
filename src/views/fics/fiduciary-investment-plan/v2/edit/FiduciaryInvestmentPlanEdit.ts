// Vue - Vue Router - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryInvestmentPlanEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _clearData,
    _editFiduciaryInvestmentPlan,
    _getByIdFiduciaryInvestmentPlan,
  } = useFiduciaryInvestmentPlanStore('v1')

  const { data_form, fiduciary_investment_plan_response } = storeToRefs(
    useFiduciaryInvestmentPlanStore('v1')
  )

  const searchId = +route.params.id

  const keys = {
    assets: ['cities', 'legal_people_fund_sources'],
    trust_business: ['business_trusts'],
    fics: [
      'offices',
      'print_groups',
      'fic_profiles',
      'fic_business_lines',
      'funts_to_investment_plans',
    ],
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
    title: 'Editar plan de inversión fiduciario',
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
        label: 'Editar',
        route: 'FiduciaryInvestmentPlanEdit',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
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
    await _getResources(keysThirdParty.key, keysThirdParty.params)

    await _getByIdFiduciaryInvestmentPlan(searchId)

    openMainLoader(false)
  }

  const makePayload = () => {
    return {
      collective_investment_fund_id:
        data_form.value?.collective_investment_fund_id,
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
        fic_manager_user_id: data_form.value?.parameters?.fic_manager_user_id,
        fic_advisor_user_id: data_form.value?.parameters?.fic_advisor_user_id,
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
    const payload = makePayload()

    openMainLoader(true)

    const edit = await _editFiduciaryInvestmentPlan(searchId, payload)

    openMainLoader(false)

    if (edit) handleGoToList()
  }

  const handleGoToList = () =>
    goToURL('FiduciaryInvestmentPlanList', undefined, { reload: true })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysV2)
    _resetKeys(keysThirdParty.key)
  })

  onMounted(async () => {
    _clearData()
    await loadResources()
  })

  return {
    tabs,
    nextTab,
    backTab,
    onSubmit,
    tabActive,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    fiduciary_investment_plan_response,
  }
}

export default useFiduciaryInvestmentPlanEdit
