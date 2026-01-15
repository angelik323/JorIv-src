import { computed, onMounted, onBeforeMount, ref, watch } from 'vue'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import {
  IEmitterForm,
  IEmitterItem,
  IComplianceForm,
  IInformationFormData,
  IRegisterShareSaleLocalCurrencyPayload,
  CommissionBase,
} from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useRegisterShareSaleLocalCurrencyStore,
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
const toInt = (v: unknown): number => Math.round(toNum(v))

const useRegisterShareSaleLocalCurrencyCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _createAction } = useRegisterShareSaleLocalCurrencyStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const complianceFormRef = ref()
  const emitterFormRef = ref()
  const isLoaded = ref(false)

  const keys = [
    'investment_portfolio_code_local_currency',
    'operation_type_code_local_currency',
    'issuer_counterparty_local_currency',
    'local_currency_share_class',
    'paper_type_local_currency',
    'administrators_codes',
    'isin_code_mnemonics',
    'currency_local',
    'issuer_seller',
    'oldest_unit_value_by_emitter',
    'available_titles_by_emitter',
  ]

  const headerProperties = {
    title: 'Registro ventas de renta variable acciones moneda local',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: 'Registro ventas de renta variable acciones moneda local',
        route: 'RegisterSalesVariableIncomeShareLocalCurrencyCreate',
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
      required: false,
    },
    {
      name: 'emitter',
      label: 'Emisor',
      icon: defaultIconsLucide.user,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'compliance',
      label: 'Cumplimiento',
      icon: defaultIconsLucide.send,
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

  const syncCommissionToCompliance = () => {
    const info = informationFormRef.value?.getValues?.() as
      | IInformationFormData
      | undefined
    const em = emitterFormRef.value?.getValues?.() as IEmitterForm | undefined
    if (!info || !em || !complianceFormRef.value?.setCommissionFromEmitter)
      return

    if (!info.has_commission) {
      complianceFormRef.value.setCommissionFromEmitter(null, null)
    } else {
      complianceFormRef.value.setCommissionFromEmitter(
        em.commission_base,
        em.percentage_or_fixed_value ?? null
      )
    }

    const issuers_counterparty_id = em.issuers_counterparty_id ?? null
    const classAction = em.action_class ?? null

    complianceFormRef.value.setPurchaseUnitValue?.(
      issuers_counterparty_id,
      classAction
    )
    complianceFormRef.value.setAvailableUnitsByIssuerFromEmitter?.(
      issuers_counterparty_id,
      classAction
    )
    complianceFormRef.value.recalc?.()
  }

  const loadEmitterResourcesForCompliance = async () => {
    const em = emitterFormRef.value?.getValues?.() as IEmitterForm | undefined
    if (!em?.issuers_counterparty_id || !em?.action_class) return

    await _getResources(
      { investment_portfolio: ['oldest_unit_value_by_emitter'] },
      `filter[emitter_id]=${em.issuers_counterparty_id}&filter[action_class]=${em.action_class}`
    )

    await _getResources(
      { investment_portfolio: ['available_titles_by_emitter'] },
      `filter[emitter_id]=${em.issuers_counterparty_id}&filter[action_class]=${em.action_class}`
    )

    complianceFormRef.value?.setPurchaseUnitValue?.(
      em.issuers_counterparty_id,
      em.action_class ?? null
    )
    complianceFormRef.value?.setAvailableUnitsByIssuerFromEmitter?.(
      em.issuers_counterparty_id,
      em.action_class ?? null
    )
    complianceFormRef.value?.recalc?.()
  }

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return
    const nextIdx = tabActiveIdx.value + 1
    const nextName = filteredTabs.value[nextIdx]?.name
    if (nextName === 'compliance') {
      await loadEmitterResourcesForCompliance()
      syncCommissionToCompliance()
    }
    tabActiveIdx.value = nextIdx
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  watch(tabActive, async (name) => {
    if (name === 'compliance') {
      await loadEmitterResourcesForCompliance()
      syncCommissionToCompliance()
    }
  })

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const validateForms = async (): Promise<boolean> => {
    if (tabActive.value === 'information') {
      return await informationFormRef.value?.validateForm()
    } else if (tabActive.value === 'emitter') {
      return await emitterFormRef.value?.validateForm()
    } else if (tabActive.value === 'compliance') {
      return await complianceFormRef.value?.validateForm()
    }
    return true
  }

  const normalizeCommissionBase = (
    value: unknown
  ): 'Porcentaje' | 'Valor de unidad' => {
    if (typeof value === 'string') {
      const lower = value.trim().toLowerCase()
      if (lower === 'porcentaje') return 'Porcentaje'
      if (lower === 'valor de unidad') return 'Valor de unidad'
    }
    if (typeof value === 'boolean') {
      return value ? 'Porcentaje' : 'Valor de unidad'
    }
    return 'Valor de unidad'
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const information =
      informationFormRef.value?.getValues() as IInformationFormData
    const emitter =
      emitterFormRef.value?.getValues?.() as unknown as IEmitterItem & {
        issuers_counterparty_id?: number | null
        action_class?: string | null
        issuers_counterparty_seller_id?: number | null
        issuers_counterparty_commissioner_id?: number | null
        commission_base?: CommissionBase
        percentage_or_fixed_value?: number | null
        unit_or_share?: string | null
      }
    const compliance = complianceFormRef.value?.getValues?.() as IComplianceForm

    if (!information || !emitter || !compliance) return
    if (!emitter.issuers_counterparty_id) return

    const emitterItem: IEmitterItem = {
      emitter_id: emitter.issuer_id ?? Number(emitter.issuers_counterparty_id),
      class_action: emitter.action_class as string,
      buyer_id:
        emitter.buyer_id ?? Number(emitter.issuers_counterparty_seller_id),
      commissioner_id:
        emitter.commissioner_id ??
        Number(emitter.issuers_counterparty_commissioner_id),
      unit_actions: emitter.unit_or_share ?? '',
      ...(information.has_commission && {
        commission_base: normalizeCommissionBase(
          emitter.commission_base as string | boolean | null
        ),
        commission_value_base: toNum(emitter.percentage_or_fixed_value),
      }),
    }

    const payload: IRegisterShareSaleLocalCurrencyPayload = {
      investment_portfolio_id: Number(information.investment_portfolio_id),
      portfolio_operation_date: information.operation_date,
      operation_id: Number(information.operation_type_id),
      commission: information.has_commission,
      issuer: [emitterItem],
      compliance_units: [
        {
          purchase_unit_value: to2(compliance.purchase_unit_value),
          available_shares_quantity: toInt(
            compliance.available_units_by_issuer
          ),
          sale_shares_quantity: toInt(compliance.sale_quantity),
          sale_unit_value: to2(compliance.sale_unit_value),
          unit_value: to2(compliance.sale_value),
          commission_value: to2(compliance.commission_value),
          total_operation_value: to2(compliance.total_operation_value),
          profit_or_loss_value: to6(compliance.profit_or_loss_value),
        },
      ],
    }

    openMainLoader(true)
    const success = await _createAction(payload)
    openMainLoader(false)

    if (!success) return

    informationFormRef.value?.resetForm?.()
    emitterFormRef.value?.resetForm?.()
    complianceFormRef.value?.resetForm?.()
    tabActiveIdx.value = 0
    tabActive.value = filteredTabs.value[0].name
  }

  onMounted(() => loadResources())
  onBeforeMount(async () => await _resetKeys({ investment_portfolio: keys }))

  let hasSetUnitValue = false

  watch(
    () => emitterFormRef.value?.getValues?.().issuer?.[0]?.emitter_id,
    (newId) => {
      if (!newId || hasSetUnitValue) return
      complianceFormRef.value?.setPurchaseUnitValue?.(Number(newId), null)
      complianceFormRef.value?.recalc?.()
      hasSetUnitValue = true
    }
  )

  return {
    isLoaded,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    emitterFormRef,
    headerProperties,
    complianceFormRef,
    informationFormRef,
    defaultIconsLucide,
    nextTab,
    backTab,
    handleSubmitForm,
  }
}

export default useRegisterShareSaleLocalCurrencyCreate
