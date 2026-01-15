import { computed, onMounted, onBeforeMount, ref } from 'vue'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import {
  IRegisterFixedIncomeForeignCurrencySalePayload,
  ITitleRow,
} from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useRegisterFixedIncomeForeignCurrencySaleStore,
} from '@/stores'

const toNum = (v: unknown): number => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  if (typeof v === 'string') {
    const n = parseFloat(v)
    return Number.isFinite(n) ? n : 0
  }
  const n = Number(v ?? 0)
  return Number.isFinite(n) ? n : 0
}
const to2 = (v: unknown): number => Number(toNum(v).toFixed(2))
const to6 = (v: unknown): number => Number(toNum(v).toFixed(6))

const isWeekend = (d: Date) => [0, 6].includes(d.getDay())
const prevBusinessDay = (base = new Date()) => {
  const d = new Date(base)
  d.setDate(d.getDate() - 1)
  while (isWeekend(d)) d.setDate(d.getDate() - 1)
  return d
}
const fmt = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`

const useRegisterFixedIncomeForeignCurrencySaleCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { _createAction } = useRegisterFixedIncomeForeignCurrencySaleStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const complianceFormRef = ref()
  const isLoaded = ref(false)

  const keys = [
    'investment_portfolio',
    'operation_type',
    'list_counterparty_associated_trader',
    'valoration_trm',
    'currency_local',
    'currency_for_paper_type',
    'coins',
  ]

  const headerProperties = {
    title: 'Registro Venta Renta Fija Moneda Extranjera',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: 'Registro Venta Renta Fija Moneda Extranjera',
        route: 'RegisterFixedIncomeForeignCurrencySaleCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'compliance',
      label: 'Condiciones de cumplimiento*',
      icon: defaultIconsLucide.fileOutline,
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
    informationFormRef.value?.setOperationDate?.(fmt(prevBusinessDay()))
    setTimeout(() => {
      openMainLoader(false)
      isLoaded.value = true
    }, 600)
  }

  const validateForms = async (): Promise<boolean> => {
    if (tabActive.value === 'information') {
      return await informationFormRef.value?.validateForm()
    } else if (tabActive.value === 'compliance') {
      return await complianceFormRef.value?.validateForm()
    }
    return true
  }

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return
    const nextIdx = tabActiveIdx.value + 1
    const nextName = filteredTabs.value[nextIdx]?.name
    if (nextName) {
      if (tabActive.value === 'information' && nextName === 'compliance') {
        const info = informationFormRef.value?.getValues()
        if (info) {
          const selected: ITitleRow | undefined = info.titles.find(
            (t: ITitleRow) => Number(t.sale_value_currency_origin) > 0
          )
          if (selected) {
            complianceFormRef.value?.setPurchaseValueOrigin(
              Number(selected.sale_value_currency_origin)
            )
          }
          if (info.currency_value_negotiation) {
            complianceFormRef.value?.setNegotiationCurrencyValue(
              Number(info.currency_value_negotiation)
            )
          }
          complianceFormRef.value?.setOperationContext({
            operation_type: info.negotiation,
            operation_date: info.operation_date,
            number_days: info.number_days,
          })
          if (info.instrument_currency && info.complies_currency_id) {
            complianceFormRef.value?.setInstrumentCurrency(
              info.instrument_currency,
              Number(info.complies_currency_id)
            )
          }
        }
      }
      tabActiveIdx.value = nextIdx
      tabActive.value = nextName
    }
  }

  const backTab = () => {
    if (tabActiveIdx.value > 0) {
      tabActiveIdx.value = tabActiveIdx.value - 1
      tabActive.value = filteredTabs.value[tabActiveIdx.value].name
    }
  }

  const handleSubmitForm = async () => {
    const okInfo = await informationFormRef.value?.validateForm()
    if (!okInfo) {
      tabActive.value = 'information'
      tabActiveIdx.value = filteredTabs.value.findIndex(
        (t) => t.name === 'information'
      )
      return
    }
    const okComp = await complianceFormRef.value?.validateForm()
    if (!okComp) {
      tabActive.value = 'compliance'
      tabActiveIdx.value = filteredTabs.value.findIndex(
        (t) => t.name === 'compliance'
      )
      return
    }

    const info = informationFormRef.value?.getValues()
    const comp = complianceFormRef.value?.getValues()
    if (!info || !comp) return

    const payload: IRegisterFixedIncomeForeignCurrencySalePayload = {
      investment_portfolio_id: Number(info.investment_portfolio_id),
      operation_type_id: Number(info.operation_type_id),
      operation_date: info.operation_date,
      negotiation: comp.negotiation,
      number_days: comp.days_count,
      issuer_id: Number(info.issuer_id),
      purchaser_id: Number(info.purchaser_id),
      titles: info.titles.map((t: ITitleRow) => ({
        title_id: Number(t.title_id),
        market_value_currency_origin: to2(t.market_value_currency_origin),
        market_value_local_currency: to2(t.market_value_local_currency),
        sale_value_currency_origin: to2(t.sale_value_currency_origin),
        irr_sale: to6(t.irr_sale),
      })),
      complies_origin_currency: comp.complies_origin_currency ?? true,
      complies_currency_id: comp.complies_currency_id ?? null,
      currency_value_negotiation: to2(comp.currency_value_negotiation),
      placement_resource_date: comp.placement_resource_date,
      conversion_factor: to6(comp.conversion_factor),
      spot_rate_compliance_value: to2(comp.spot_rate_compliance_value ?? 0),
    }

    openMainLoader(true)
    const success = await _createAction(payload)
    openMainLoader(false)
    if (!success) return

    informationFormRef.value?.resetForm?.()
    complianceFormRef.value?.resetForm?.()
    tabActiveIdx.value = 0
    tabActive.value = filteredTabs.value[0].name

    isLoaded.value = false
    await loadResources()
  }

  onMounted(() => loadResources())
  onBeforeMount(async () => await _resetKeys({ investment_portfolio: keys }))

  return {
    isLoaded,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    headerProperties,
    informationFormRef,
    complianceFormRef,
    defaultIconsLucide,
    nextTab,
    backTab,
    handleSubmitForm,
  }
}

export default useRegisterFixedIncomeForeignCurrencySaleCreate
