// Vue - Vue Router
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCollectiveInvestmentFundsView = () => {
  const { defaultIconsLucide, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _showAction } = useCollectiveInvestmentFundsStore('v1')

  const id = route.params.id as string

  const participationTypesFormRef = ref()
  const operatingChannelsFormRef = ref()
  const printGroupsFormRef = ref()
  const informationFormRef = ref()
  const parametersFormRef = ref()
  const profilesFormRef = ref()
  const isLoaded = ref(false)

  const keys = {
    trust_business: ['business_trust_types', 'business_trust_subtypes'],
    accounting: ['business_trusts_basic'],
    treasury: ['banks', 'bank_account'],
    assets: ['users'],
    fics: [
      'structure',
      'term_basis',
      'send_types',
      'calculation_unit',
      'commission_assumed',
      'fiduciary_commissions',
      'business_lines_active',
      'fiduciary_commissions',
      'system_operation_channels',
      'participation_types_active',
      'status_investment_plan_status_modification',
    ],
  }

  const initialData = ref({
    information: {},
    parameters: {},
    profiles: [],
    participationTypes: [],
    operatingChannels: [],
    printGroups: [],
  })

  const headerProps = {
    title: 'Ver fondo de inversión colectiva',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Fondos de inversión colectiva',
        route: 'CollectiveInvestmentFundsList',
      },
      {
        label: 'Ver',
        route: 'CollectiveInvestmentFundsView',
      },
      {
        label: id,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'parameters',
      label: 'Parámetros',
      icon: defaultIconsLucide.sliders,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'profiles',
      label: 'Perfiles FIC',
      icon: defaultIconsLucide.user,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'participationTypes',
      label: 'Tipos de participación',
      icon: defaultIconsLucide.user,
      outlined: true,
      disable: false,
      show: false,
      required: true,
    },
    {
      name: 'operatingChannels',
      label: 'Canales de operación',
      icon: defaultIconsLucide.admin,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'printGroups',
      label: 'Grupos de impresión',
      icon: defaultIconsLucide.send,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const loadData = async () => {
    openMainLoader(true)

    await _getResources(keys)

    const success = await _showAction(id)

    if (success) {
      const data = success
      initialData.value.information = {
        fund_code: data.fund_code,
        fund_name: data.fund_name,
        status_id: data.status_id,
        fic_rating: data.fic_rating,
        fund_type_id: data.fund_type_id,
        last_closing_date: formatDate(data.last_closing_date, 'YYYY-MM-DD'),
        is_fund_validated: data.is_fund_validated,
        business_trust_id: data.business_trust.id,
        consolidation_option_id: data.consolidation_option.id,
        consolidation_option_code: data.consolidation_option.code,
        has_participation_types: data.has_participation_types,
      }

      initialData.value.parameters = {
        ...data.parameters[0],
        operation_start_date: data.parameters[0].operation_start_date
          ? formatDate(data.parameters[0].operation_start_date, 'YYYY-MM-DD')
          : null,
        operation_end_date: data.parameters[0].operation_end_date
          ? formatDate(data.parameters[0].operation_end_date, 'YYYY-MM-DD')
          : null,
        operation_control_date: data.parameters[0].operation_control_date
          ? formatDate(data.parameters[0].operation_control_date, 'YYYY-MM-DD')
          : null,
        commission_id: data.parameters[0].commission.id,
        commission_assumed: data.parameters[0].commission_assumed,
        fixed_rate_percentage:
          data.parameters[0].commission.fixed_rate_percentage,
        variable_rates: data.parameters[0].commission.variable_rates,
      }

      initialData.value.profiles = data.profiles || []
      initialData.value.participationTypes =
        data.business_participation_types || []
      initialData.value.operatingChannels = data.operation_channels || []
      initialData.value.printGroups = data.print_groups || []

      const participationTab = tabs.value.find(
        (tab) => tab.name === 'participationTypes'
      )
      if (participationTab) {
        participationTab.show = data.has_participation_types === true
      }

      isLoaded.value = true
    }

    setTimeout(() => openMainLoader(false), 1000)
  }

  const nextTab = () => {
    const nextIdx = tabActiveIdx.value + 1

    if (nextIdx < filteredTabs.value.length) {
      tabActiveIdx.value = nextIdx
      tabActive.value = filteredTabs.value[nextIdx].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const handleGoToList = () =>
    goToURL('CollectiveInvestmentFundsList', undefined, { reload: true })

  onMounted(async () => await loadData())

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    nextTab,
    backTab,
    isLoaded,
    tabActive,
    initialData,
    headerProps,
    filteredTabs,
    tabActiveIdx,
    handleGoToList,
    profilesFormRef,
    parametersFormRef,
    printGroupsFormRef,
    informationFormRef,
    defaultIconsLucide,
    operatingChannelsFormRef,
    participationTypesFormRef,
  }
}

export default useCollectiveInvestmentFundsView
