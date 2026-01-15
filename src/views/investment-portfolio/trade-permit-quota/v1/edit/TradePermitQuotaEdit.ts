import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useResourceManagerStore, useTradePermitQuotaStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeMount, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InformationForm from '@/components/Forms/InvestmentPortfolio/TradePermitQuota/information/InformationForm.vue'

export const useTradePermitQuotaEdit = () => {
  //constantes - referencias - desestructuraciones
  const { openMainLoader } = useMainLoader()
  const {
    _updateTradePermitQuota,
    _getTradePermitQuotaList,
    _getTradePermitQuotaById,
    _setDataInformationForm,
  } = useTradePermitQuotaStore('v1')
  const { data_information_form } = storeToRefs(useTradePermitQuotaStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const keysInvestment = [
    'third_party_issuers_selector',
    'type_investment',
    'paper_type',
    'investment_portfolio',
  ]
  const keysUser = ['users']
  const formInformation = ref<InstanceType<typeof InformationForm> | null>(null)

  const route = useRoute()
  const router = useRouter()
  const idReference = +route.params.id
  const headerProps = {
    title: 'Editar cupos y permisos trader',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Definición cupos y permisos Trader',
        route: 'TradePermitQuotaList',
      },
      { label: 'Editar', route: 'TradePermitQuotaEdit' },
      {
        label: String(route.params.id),
        route: '',
      },
    ],
  }

  const tabs = reactive<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
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

  //Funciones y payload

  const makeDataRequest = () => {
    const form = formInformation.value?.getFormValues()
    return {
      trader_id: form?.trader_id ?? 1,
      general_quota: form?.general_quota || 1,
      individual_quota: form?.individual_quota || 1,
      investment_portfolio_id: Number(form?.investment_portfolio_id) || 1,
      id: idReference,
      counterpart_id: form?.counterpart_id ?? 1,
      emitter_id: form?.emitter_id ?? 1,
      paper_type_id: form?.paper_type_id ?? 1,
    }
  }

  const onSubmit = async () => {
    if (!(await formInformation.value?.validateForm())) return

    openMainLoader(true)

    const payload = makeDataRequest()

    const gen = Number(payload.general_quota ?? NaN)
    const ind = Number(payload.individual_quota ?? NaN)
    if (Number.isFinite(gen) && Number.isFinite(ind) && ind > gen) {
      openMainLoader(false)
      return
    }

    if (await _updateTradePermitQuota(idReference, payload)) {
      openMainLoader(false)
      router.push({ name: 'TradePermitQuotaList' })
      _getTradePermitQuotaList()
    } else {
      openMainLoader(false)
    }
  }

  //Gestor de estados (inicializadores y desmontables)
  onBeforeMount(async () => {
    openMainLoader(true)

    await Promise.all([
      _getResources({
        investment_portfolio: keysInvestment,
        user: keysUser,
      }),

      _getResources({ user: keysUser }, `filter[role_trader]=${true}`),

      _getTradePermitQuotaById(idReference),
    ])

    openMainLoader(false)
  })

  onUnmounted(async () => {
    await _getTradePermitQuotaList()
    _resetKeys({
      investment_portfolio: keysInvestment,
      user: keysUser,
    })
    _setDataInformationForm(null)
  })

  return {
    formInformation,
    data_information_form,
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    onSubmit,
  }
}
