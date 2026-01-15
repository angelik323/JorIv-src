// Vue - Vue Router
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Interfaces
import { ICollectiveInvestmentFundRequest } from '@/interfaces/customs/fics/CollectiveInvestmentFunds'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCollectiveInvestmentFundsCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction, _setParticipationTypesTermDaysActive } =
    useCollectiveInvestmentFundsStore('v1')

  const participationTypesFormRef = ref()
  const operatingChannelsFormRef = ref()
  const printGroupsFormRef = ref()
  const informationFormRef = ref()
  const parametersFormRef = ref()
  const profilesFormRef = ref()

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

  const sharedData = ref({
    business_trust_id: '',
    fund_code: '',
    fund_type: '',
    participation_type: '',
  })

  const headerProps = {
    title: 'Crear fondo de inversión colectiva',
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
        label: 'Crear',
        route: 'CollectiveInvestmentFundsCreate',
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

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    if (tabActive.value === 'information') {
      const infoData = informationFormRef.value?.getValues()

      sharedData.value = {
        business_trust_id: infoData.business_trust_id || '',
        fund_code: infoData.fund_code || '',
        fund_type: infoData.fund_type_id || '',
        participation_type: infoData.has_participation_types || '',
      }
    }

    const nextIdx = tabActiveIdx.value + 1
    if (nextIdx >= filteredTabs.value.length) return

    const nextTabName = filteredTabs.value[nextIdx].name

    tabActiveIdx.value = nextIdx
    tabActive.value = nextTabName

    if (nextTabName === 'parameters') {
      const { fund_code, fund_type, participation_type, business_trust_id } =
        sharedData.value

      if (business_trust_id)
        await _getResources(
          {
            treasury: ['banks_record_expenses'],
          },
          `business_trust_id=${business_trust_id}`
        )

      parametersFormRef.value?.setCode(fund_code)
      parametersFormRef.value?.setFundType(fund_type)
      parametersFormRef.value?.setParticipationType(participation_type)
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

    const success = await _createAction(payload)

    if (success) handleGoToList()

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleGoToList = () =>
    goToURL('CollectiveInvestmentFundsList', undefined, { reload: true })

  onMounted(async () => {
    openMainLoader(true)

    _setParticipationTypesTermDaysActive(false)
    await _getResources(keys)

    setTimeout(() => openMainLoader(false), 1000)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    () => informationFormRef.value?.getValues()?.has_participation_types,
    (newVal) => {
      const participationTypesTab = tabs.value.find(
        (t) => t.name === 'participationTypes'
      )
      if (participationTypesTab) {
        participationTypesTab.show = newVal !== false
      }
    }
  )

  return {
    nextTab,
    backTab,
    tabActive,
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

export default useCollectiveInvestmentFundsCreate
