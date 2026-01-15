import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import {
  IRegisterFixedIncomeLocalCurrencyPayload,
  IIrrFlowRequest,
} from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useRegisterFixedIncomeLocalCurrencyStore,
} from '@/stores'

const useRegisterFixedIncomeLocalCurrencyCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _createAction } = useRegisterFixedIncomeLocalCurrencyStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()
  const tirPurchaseFormRef = ref()
  const isLoaded = ref(false)

  const keys = [
    'investment_portfolio',
    'operation_type',
    'paper_type_encompass_and_division',
    'compensation_system_local_currency',
    'list_counterparty_associated_trader',
    'issuer_deposit',
    'rate_type',
    'interest_rate_mode',
  ]

  const headerProperties = {
    title: 'Registro compra renta fija moneda local',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: 'Registro compra renta fija moneda local',
        route: 'RegisterFixedIncomeLocalCurrencyCreate',
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
      name: 'tir-purchase',
      label: 'Tir Compra*',
      icon: defaultIconsLucide.dollarSign,
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
    if (nextName === 'tir-purchase') {
      const basicData =
        basicDataFormRef.value?.getValues() as IRegisterFixedIncomeLocalCurrencyPayload
      if (basicData) {
        const payload: IIrrFlowRequest = {
          operation_date: basicData.operation_date,
          issue_date: basicData.issue_date,
          maturity_date: basicData.maturity_date,
          perioricity: basicData.perioricity,
          rate_type: basicData.rate_type,
          fixed_rate_value: basicData.fixed_rate_value ?? undefined,
          rate_code: basicData.rate_code ?? undefined,
          modality: basicData.modality,
          spread: basicData.spread ?? undefined,
          rate_class: basicData.rate_class,
          paper_type_id: basicData.paper_type_id,
          face_value: basicData.face_value,
          purchase_value: basicData.purchase_value,
        }
        await tirPurchaseFormRef.value?.loadFromService(payload)
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
    } else if (tabActive.value === 'tir-purchase') {
      return await tirPurchaseFormRef.value?.validateForm()
    }
    return true
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const basicData =
      basicDataFormRef.value?.getValues() as IRegisterFixedIncomeLocalCurrencyPayload
    const tirData = tirPurchaseFormRef.value?.getValues?.() as {
      flows?: { date: string; interest: number; capital: number }[]
      tir_purchase?: number
    }

    if (!basicData) return

    const payload: IRegisterFixedIncomeLocalCurrencyPayload = {
      ...basicData,
      tir_purchase: tirData?.tir_purchase ?? undefined,
    }

    openMainLoader(true)
    const success = await _createAction(payload)
    openMainLoader(false)

    if (!success) return

    basicDataFormRef.value?.resetForm?.()
    tirPurchaseFormRef.value?.resetForm?.()
    tabActiveIdx.value = 0
    tabActive.value = filteredTabs.value[0].name
  }

  onMounted(() => loadResources())
  onBeforeUnmount(() => _resetKeys({ investment_portfolio: keys }))

  return {
    isLoaded,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    headerProperties,
    basicDataFormRef,
    tirPurchaseFormRef,
    defaultIconsLucide,
    nextTab,
    backTab,
    handleSubmitForm,
  }
}

export default useRegisterFixedIncomeLocalCurrencyCreate
