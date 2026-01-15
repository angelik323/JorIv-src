import { computed, onMounted, onBeforeMount, ref } from 'vue'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import {
  IRegisterFixedIncomeForeignCurrencyPayload,
  IIrrFlowForeignRequest,
} from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useRegisterFixedIncomeForeignCurrencyStore,
} from '@/stores'

const useRegisterFixedIncomeForeignCurrencyCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _createAction } = useRegisterFixedIncomeForeignCurrencyStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()
  const conditionsFormRef = ref()
  const isLoaded = ref(false)

  const keys = [
    'investment_portfolio',
    'operation_type',
    'currency_foreign',
    'list_counterparty_associated_trader',
    'issuer_deposit',
    'operation_type_code_local_currency',
    'issuer_counterparty_local_currency',
    'paper_type_local_currency',
    'currency_for_paper_type',
    'compensation_system_local_currency',
    'market_types_buy_fixed_income',
    'coins',
  ]

  const headerProperties = {
    title: 'Registro compra renta fija moneda extranjera',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: 'Registro compra renta fija moneda extranjera',
        route: 'RegisterFixedIncomeForeignCurrencyCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic-data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'compliance-conditions',
      label: 'Condiciones cumplimiento*',
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
    setTimeout(() => {
      openMainLoader(false)
      isLoaded.value = true
    }, 1000)
  }

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return
    const nextIdx = tabActiveIdx.value + 1
    const nextName = filteredTabs.value[nextIdx]?.name
    tabActiveIdx.value = nextIdx
    tabActive.value = nextName
    if (nextName === 'compliance-conditions') {
      const basicData =
        basicDataFormRef.value?.getValues() as IRegisterFixedIncomeForeignCurrencyPayload
      if (basicData) {
        const payload: IIrrFlowForeignRequest = {
          operation_date: basicData.operation_date,
          issue_date: basicData.issue_date,
          maturity_date: basicData.maturity_date,
          perioricity: basicData.perioricity,
          rate_class: 'Efectivo',
          rate_type: basicData.rate_type,
          fixed_rate_value: basicData.fixed_rate_value ?? undefined,
          rate_code: basicData.rate_code ?? undefined,
          modality: basicData.modality,
          spread: basicData.spread ?? undefined,
          paper_type_id: basicData.paper_type_id,
          face_value: basicData.face_value,
          purchase_value: basicData.purchase_value,
        }
        await conditionsFormRef.value?.loadFromService(payload)
        conditionsFormRef.value?.setInstrumentCurrency(
          basicData.currency_description ?? ''
        )
        conditionsFormRef.value?.setPurchaseValueOrigin(
          basicData.purchase_value
        )
        conditionsFormRef.value?.setSpotRateValue(basicData.currency_value)
        conditionsFormRef.value.formData.operation_type =
          basicData.operation_type_description ?? 'Operacion Spot'
        conditionsFormRef.value.formData.operation_date =
          basicData.operation_date
        conditionsFormRef.value.formData.number_days = basicData.number_days
      }
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const validateForms = async (): Promise<boolean> => {
    if (tabActive.value === 'basic-data') {
      return await basicDataFormRef.value?.validateForm()
    } else if (tabActive.value === 'compliance-conditions') {
      return await conditionsFormRef.value?.validateForm()
    }
    return true
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const basicData =
      basicDataFormRef.value?.getValues() as IRegisterFixedIncomeForeignCurrencyPayload
    if (!basicData) return

    const conditionsData = conditionsFormRef.value?.getValues?.() as {
      flows?: { date: string; interest: number; capital: number }[]
      tir_purchase?: number
      fulfill_in_origin?: boolean
      settlement_currency?: string
      negotiation_currency_value?: number
      settlement_date?: string
      funding_placement_date?: string
      settlement_origin_value?: number
      spot_rate_value?: number
      settlement_spot_value?: number
      conversion_factor?: number
      giro_local_currency?: number
      purchase_value_origin?: number
      operation_type: 'Operacion Spot' | 'Operacion Contado'
    }

    const COP_ID = 1

    const payload: IRegisterFixedIncomeForeignCurrencyPayload = {
      ...basicData,
      negotiation: conditionsData.operation_type,
      rate_class: 'Efectivo',
      value_purchase_currency_origin: Number(
        conditionsData.purchase_value_origin ?? 0
      ),
      complies_origin_currency: Boolean(conditionsData.fulfill_in_origin),
      complies_currency_id: conditionsData.fulfill_in_origin
        ? Number(basicData.currency_id)
        : COP_ID,
      compliance_date:
        conditionsData.settlement_date ?? basicData.operation_date,
      placement_resource_date: conditionsData.funding_placement_date ?? '',
      currency_value_negotiation: Number(
        conditionsData.negotiation_currency_value ?? 0
      ),
      compliace_value_currency_origin: Number(
        conditionsData.settlement_origin_value ?? 0
      ),
      spot_rate_value: Number(conditionsData.spot_rate_value ?? 0),
      spot_rate_compliance_value: Number(
        conditionsData.settlement_spot_value ?? 0
      ),
      conversion_factor:
        conditionsData.conversion_factor !== undefined
          ? Number(conditionsData.conversion_factor)
          : undefined,
      local_currency_compliance_transfer: Number(
        conditionsData.giro_local_currency ?? 0
      ),
      flows: conditionsData.flows ?? [],
      tir_purchase: conditionsData.tir_purchase,
      deposit_issuer_id: Number(basicData.issuer_id),
      compensation_system: 'LP (libre de pago)',
      folio: 123,
    }

    openMainLoader(true)
    const success = await _createAction(payload)
    openMainLoader(false)

    if (!success) return

    basicDataFormRef.value?.resetForm?.()
    conditionsFormRef.value?.resetForm?.()
    tabActiveIdx.value = 0
    tabActive.value = filteredTabs.value[0].name

    isLoaded.value = false
    await loadResources()
  }

  onMounted(() => loadResources())
  onBeforeMount(async () => _resetKeys({ investment_portfolio: keys }))

  return {
    isLoaded,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    headerProperties,
    basicDataFormRef,
    conditionsFormRef,
    defaultIconsLucide,
    nextTab,
    backTab,
    handleSubmitForm,
  }
}

export default useRegisterFixedIncomeForeignCurrencyCreate
