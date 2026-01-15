import { computed, onMounted, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import {
  ITtvInformationFormData,
  IRegisterTtvPayload,
  ITitleDelivered,
  ITitlesReceived,
} from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useMonetaryMarketOperationsStore,
} from '@/stores'

const mapPosition = (pos: 'Originador' | 'Receptor' | null): string => {
  if (pos === 'Originador') return 'Originador'
  if (pos === 'Receptor') return 'Receptor'
  return ''
}

const buildTtvPayload = (
  info: ITtvInformationFormData,
  delivered: ITitleDelivered | null,
  received: ITitlesReceived | null
): IRegisterTtvPayload => {
  return {
    operation_date: info.operation_date,
    investment_portfolio_id: Number(info.investment_portfolio_id),
    ttvs: info.ttv_type ?? '',
    position: mapPosition(info.position),
    paper_type_id: info.paper_type_id ? Number(info.paper_type_id) : 0,
    operation_type_id: info.operation_type_id
      ? Number(info.operation_type_id)
      : 0,
    start_date: info.operation_date,
    number_days: info.number_days ?? 0,
    end_date: info.end_date,
    counterparty_id: info.counterparty_id ? Number(info.counterparty_id) : 0,
    currency_id: info.currency_id ? Number(info.currency_id) : 1,
    folio: info.folio ?? 0,
    compensation_system: info.compensation_system ?? '',
    ttv_negotiation_value: info.negotiation_value ?? 0,
    face_value_title_delivered: info.nominal_delivered ?? 0,
    market_value_title_delivered: info.market_delivered ?? 0,
    face_value_title_received: info.nominal_received ?? 0,
    market_value_title_received: info.market_received ?? 0,
    value_money: info.money_value ?? 0,
    money_perfomance: info.money_yield ?? false,
    comission_base: info.comission_base,
    commission_modality: info.commission_modality,
    value: info.commission_value ?? 0,
    commission_value: info.commission_result ?? 0,
    return_value: info.return_value ?? 0,
    percentage_yield: info.yield_percentage ?? 0,
    perfomance_value: info.yield_value ?? 0,

    titles_delivered: delivered
      ? [
          {
            title_id: Number(delivered.title_id),
            issuer_id: Number(delivered.issuer_id),
            deposit_id: Number(delivered.deposit_id),
            isin_code_id: Number(delivered.isin_code_id),
            paper_type_id: Number(delivered.paper_type_id),
            currency_id: delivered.currency_id
              ? Number(delivered.currency_id)
              : 1,
            market_value: delivered.market_value ?? 0,
          },
        ]
      : [],
    titles_received: received
      ? [
          {
            title_id: Number(received.title_id),
            issuer_id: Number(received.issuer_id),
            deposit_id: Number(received.deposit_id),
            isin_code_id: Number(received.isin_code_id),
            paper_type_id: Number(received.paper_type_id),
            currency_id: received.currency_id
              ? Number(received.currency_id)
              : 1,
            market_value: received.market_value ?? 0,
          },
        ]
      : [],
  }
}

const useRegisterMonetaryMarketCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const router = useRouter()

  const { _createTtvOperation } = useMonetaryMarketOperationsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()
  const deliveredFormRef = ref()
  const receivedFormRef = ref()
  const isLoaded = ref(false)

  const keys = [
    'investment_portfolio',
    'operation_type_monetary_market',
    'list_counterparty_associated_trader',
    'currency_local',
    'compensation_systems',
    'paper_type',
    'operation_type',
    'issuer_counterparty_local_currency',
    'isin_codes_mnemonics_portfolio',
    'issuer_deposit',
    'paper_type_encompass_and_division',
  ]

  const headerProperties = {
    title: 'Crear operación TTV’s',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: 'Operaciones de mercado monetario',
        route: 'RegisterMonetaryMarketList',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic-data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'delivered-titles',
      label: 'Título entregado',
      icon: defaultIconsLucide.fileWithList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'received-titles',
      label: 'Título recibido',
      icon: defaultIconsLucide.listCheck,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((t) => t.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((t) => t.name === tabActive.value)
  )

  const loadResources = async () => {
    openMainLoader(true)
    await _getResources({ investment_portfolio: keys })
    setTimeout(() => {
      openMainLoader(false)
      isLoaded.value = true
    }, 1000)
  }

  const validateForms = async (): Promise<boolean> => {
    if (tabActive.value === 'basic-data') {
      return await basicDataFormRef.value?.validateForm()
    } else if (tabActive.value === 'delivered-titles') {
      return await deliveredFormRef.value?.validateForm()
    } else if (tabActive.value === 'received-titles') {
      return await receivedFormRef.value?.validateForm()
    }
    return true
  }

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return
    const nextIdx = tabActiveIdx.value + 1
    const nextName = filteredTabs.value[nextIdx]?.name
    tabActiveIdx.value = nextIdx
    tabActive.value = nextName
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const basicData =
      basicDataFormRef.value?.getValues() as ITtvInformationFormData
    const deliveredData =
      deliveredFormRef.value?.getValues?.() as ITitleDelivered
    const receivedData = receivedFormRef.value?.getValues?.() as ITitlesReceived

    const payload = buildTtvPayload(basicData, deliveredData, receivedData)

    openMainLoader(true)
    const success = await _createTtvOperation(payload)
    openMainLoader(false)

    if (!success) return

    basicDataFormRef.value?.resetForm?.()
    deliveredFormRef.value?.resetForm?.()
    receivedFormRef.value?.resetForm?.()
    tabActiveIdx.value = 0
    tabActive.value = filteredTabs.value[0].name

    router.push({ name: 'RegisterMonetaryMarketList' })
  }

  onMounted(() => loadResources())
  onBeforeMount(async () => await _resetKeys({ investment_portfolio: keys }))

  return {
    isLoaded,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    headerProperties,
    basicDataFormRef,
    deliveredFormRef,
    receivedFormRef,
    defaultIconsLucide,
    nextTab,
    backTab,
    handleSubmitForm,
  }
}

export default useRegisterMonetaryMarketCreate
