// Vue - Vue Router
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ICollectiveInvestmentFundRequest } from '@/interfaces/customs/fics/CollectiveInvestmentFunds'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCollectiveInvestmentFundsEdit = () => {
  const { defaultIconsLucide, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _showAction, _updateAction, _setParticipationTypesTermDaysActive } =
    useCollectiveInvestmentFundsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const participationTypesFormRef = ref()
  const operatingChannelsFormRef = ref()
  const printGroupsFormRef = ref()
  const informationFormRef = ref()
  const parametersFormRef = ref()
  const profilesFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const keys = {
    trust_business: ['business_trust_types'],
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
      'consolidation_options',
      'fiduciary_commissions',
      'business_lines_active',
      'system_operation_channels',
      'fiduciary_commissions_fixed',
      'pt_not_consolidated_without_fund',
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
    title: 'Editar fondo de inversión colectiva',
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
        label: 'Editar',
        route: 'CollectiveInvestmentFundsEdit',
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
        last_closing_date: data.last_closing_date,
        is_fund_validated: data.is_fund_validated,
        business_trust_id: data.business_trust.id,
        consolidation_option_id: data.consolidation_option.id,
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
      _setParticipationTypesTermDaysActive(
        !!(
          data.parameters[0].fund_permanency_agreement ||
          data.parameters[0].fund_contribution_control
        )
      )

      isLoaded.value = true
    }

    setTimeout(() => openMainLoader(false), 1000)
  }

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return

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

  const validateForms = async () => {
    if (tabActive.value === 'information') {
      return await informationFormRef.value?.validateForm()
    } else if (tabActive.value === 'parameters') {
      return await parametersFormRef.value?.validateForm()
    } else if (tabActive.value === 'profiles') {
      return await profilesFormRef.value?.validateForm()
    } else if (tabActive.value === 'participationTypes') {
      return await participationTypesFormRef.value.validateForm()
    } else if (tabActive.value === 'operatingChannels') {
      return await operatingChannelsFormRef.value?.validateForm()
    } else if (tabActive.value === 'printGroups') {
      return await printGroupsFormRef.value?.validateForm()
    }

    return true
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const info = informationFormRef.value?.getValues()
    const parameters = parametersFormRef.value?.getValues()
    const profiles = profilesFormRef.value?.getValues()
    const participationTypes =
      participationTypesFormRef.value?.getValues() || []
    const operation_channels = operatingChannelsFormRef.value?.getValues()
    const print_groups = printGroupsFormRef.value?.getValues()

    if (parameters?.commission_assumed)
      parameters.comission_assumed = parameters.commission_assumed

    const payload: ICollectiveInvestmentFundRequest = {
      ...info,
      parameters,
      profiles,
      operation_channels,
      print_groups,
    }

    if (info.has_participation_types === true)
      payload.business_participation_types = participationTypes

    openMainLoader(true)

    const success = await _updateAction(id, payload)

    if (success) handleGoToList()

    setTimeout(() => openMainLoader(false), 1000)
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
    handleSubmitForm,
    parametersFormRef,
    printGroupsFormRef,
    informationFormRef,
    defaultIconsLucide,
    operatingChannelsFormRef,
    participationTypesFormRef,
  }
}

export default useCollectiveInvestmentFundsEdit
