import { computed, onMounted, onBeforeMount, ref } from 'vue'
import { useMainLoader, useUtils, useAlert } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { IRegisterFixedIncomeLocalCurrencySalePayload } from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useRegisterFixedIncomeLocalCurrencySaleStore,
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
const to6 = (v: unknown): number => Number(toNum(v).toFixed(6))

const useRegisterFixedIncomeLocalCurrencySaleCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()
  const { _createAction, _getIrrSaleValue } =
    useRegisterFixedIncomeLocalCurrencySaleStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const keys = [
    'investment_portfolio',
    'operation_type',
    'list_counterparty_associated_trader',
    'compensation_system_list',
  ]

  const headerProperties = {
    title: 'Registro venta renta fija moneda local',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: 'Registro venta renta fija moneda local',
        route: 'RegisterFixedIncomeLocalCurrencySaleCreate',
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
    if (tabActive.value === 'information') {
      return await informationFormRef.value?.validateForm()
    }
    return true
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const information =
      informationFormRef.value?.getValues() as IRegisterFixedIncomeLocalCurrencySalePayload

    if (!information) return

    // Parche, se valida que se cree el tir.
    const { titles } = information
    const item = titles[0]
    if (!item?.title_id || !item?.sale_value) {
      showAlert(
        'Seleccione el título y digite correctamente sus campos',
        'error',
        undefined,
        3000
      )
      return
    }

    const payloadTir = {
      title_id: item.title_id,
      sale_value: Number(item.sale_value),
      operation_date: information.operation_date,
      type_currency: 'local' as const,
    }

    if (!(await _getIrrSaleValue(payloadTir))) {
      showAlert(
        'Campo TIR venta no pudo ser generado para este título',
        'error',
        undefined,
        3000
      )
      return
    }

    const payload: IRegisterFixedIncomeLocalCurrencySalePayload = {
      investment_portfolio_id: Number(information.investment_portfolio_id),
      operation_type_id: Number(information.operation_type_id),
      operation_date: information.operation_date,
      issuer_id: Number(information.issuer_id),
      purchaser_id: Number(information.purchaser_id),
      titles: information.titles.map((t) => ({
        title_id: Number(t.title_id),
        market_value: t.market_value,
        sale_value: t.sale_value,
        compensation_system: t.compensation_system,
        irr_sale: t.irr_sale ? to6(t.irr_sale) : undefined,
      })),
      portfolio_description: information.portfolio_description,
      operation_type_description: information.operation_type_description,
      issuer_description: information.issuer_description,
      purchaser_description: information.purchaser_description,
    }

    openMainLoader(true)
    const success = await _createAction(payload)
    openMainLoader(false)

    if (!success) return

    informationFormRef.value?.resetForm?.()
    tabActiveIdx.value = 0
    tabActive.value = filteredTabs.value[0].name
  }

  onMounted(() => loadResources())
  onBeforeMount(async () => _resetKeys({ investment_portfolio: keys }))

  return {
    isLoaded,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    headerProperties,
    informationFormRef,
    defaultIconsLucide,
    handleSubmitForm,
  }
}

export default useRegisterFixedIncomeLocalCurrencySaleCreate
