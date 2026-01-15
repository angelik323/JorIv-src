// Vue - Vue Router - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Composables
import { useGoToUrl, useUtils, useMainLoader } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryInvestmentPlanView = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _getByIdFiduciaryInvestmentPlan, _clearData } =
    useFiduciaryInvestmentPlanStore('v1')
  const { fiduciary_investment_plan_response } = storeToRefs(
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
      'sort=id&include=legalPerson,financialInfo,naturalPerson,estate,documentType,contacts,addresses,status&filter[is_customer]=true&fields[]=id,document,is_customer,third_party_category,document_type_id,status_id',
  }

  const headerProperties = {
    title: 'Ver plan de inversión fiduciario',
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
        label: 'Ver',
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

  const handleGoToList = () =>
    goToURL('FiduciaryInvestmentPlanList', undefined, { reload: true })

  onMounted(async () => {
    _clearData()

    openMainLoader(true)

    await _getResources(keys)
    await _getResources(keysV2, '', 'v2')
    await _getResources(keysThirdParty.key, keysThirdParty.params)

    await _getByIdFiduciaryInvestmentPlan(searchId)

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysV2)
    _resetKeys(keysThirdParty.key)
  })

  return {
    tabs,
    nextTab,
    backTab,
    tabActive,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    fiduciary_investment_plan_response,
  }
}

export default useFiduciaryInvestmentPlanView
