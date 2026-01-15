import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import InformationForm from '@/components/Forms/InvestmentPortfolio/TradePermitQuota/information/InformationForm.vue'
import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useResourceManagerStore, useTradePermitQuotaStore } from '@/stores'

export const useTradePermitQuotaCreate = () => {
  //Constantes - referencias - desestructuraciones

  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _createTradePermitQuota, _getTradePermitQuotaList } =
    useTradePermitQuotaStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keysInvestment = [
    'third_party_issuers_selector',
    'selectable_portfolios_with_code_and_name',
    'inversion_types',
    'investment_portfolio',
  ]

  const completeKeysInvestment = [...keysInvestment, 'paper_type']
  const keysUser = ['users']
  const headerProps = {
    title: 'Crear cupo y permiso trader',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Definición cupos y permisos Trader',
        route: 'TradePermitQuotaList',
      },
      { label: 'Crear', route: 'TradePermitQuotaCreate' },
    ],
  }

  const informationFormRef = ref<InstanceType<typeof InformationForm> | null>(
    null
  )
  const tabs = reactive<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: 'list_bulleted',
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])
  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )
  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }
  //Funciones y payload
  const makeDataRequest = () => {
    const form = informationFormRef.value?.getFormValues()
    return {
      trader_id: form?.trader_id ?? 1,
      general_quota: form?.general_quota || 1,
      individual_quota: form?.individual_quota || 1,
      investment_portfolio_id: Number(form?.investment_portfolio_id) || 1,
      counterpart_id: form?.counterpart_id ?? 1,
      emitter_id: form?.emitter_id ?? 1,
      paper_type_id: form?.paper_type_id ?? 1,
    }
  }

  const onSubmit = async () => {
    if (!(await informationFormRef.value?.validateForm())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    if (await _createTradePermitQuota(payload)) {
      openMainLoader(false)
      router.push({ name: 'TradePermitQuotaList' })
    }
    openMainLoader(false)
  }
  //Gestores de estados o inicializadores
  onMounted(async () => {
    openMainLoader(true)

    await Promise.all([
      _getResources({
        investment_portfolio: keysInvestment,
      }),

      _getResources(
        {
          user: keysUser,
        },
        `filter[role_trader]=${true}`
      ),
    ])

    openMainLoader(false)
  })

  onUnmounted(async () => {
    await _getTradePermitQuotaList()
    _resetKeys({
      investment_portfolio: completeKeysInvestment,
      user: keysUser,
    })
  })

  return {
    headerProps,
    tabActiveIdx,
    tabs,
    activeTab,
    informationFormRef,
    handlerGoTo,
    onSubmit,
  }
}
