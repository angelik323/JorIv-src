import { onBeforeMount, onMounted, ref } from 'vue'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { ITabs } from '@/interfaces/global'

import {
  useResourceManagerStore,
  useRegisterDividendsForeignCurrencyStore,
} from '@/stores'

const useRegisterDividendsForeignCurrencyCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useRegisterDividendsForeignCurrencyStore('v1')

  const informationFormRef = ref()

  const keys = [
    'operation_type',
    'foreign_currency_type',
    'active_issuers_with_balance_selector',
    'issuer_dividend_class_action',
    'issuer_dividend_dividend_type',
  ]

  const headerProperties = {
    title: 'Crear registro dividendos acciones moneda extranjera',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Registro dividendos acciones moneda extranjera',
        route: 'RegisterDividendsForeignCurrencyList',
      },
      {
        label: 'Crear',
        route: 'RegisterDividendsForeignCurrencyCreate',
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
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const handleSubmitForm = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    const information = informationFormRef.value?.getValues()

    openMainLoader(true)

    const success = await _createAction(information)

    if (success) handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    router.push({
      name: 'RegisterDividendsForeignCurrencyList',
      query: { reload: 'true' },
    })

  onMounted(async () => await _getResources({ investment_portfolio: keys }))

  onBeforeMount(async () => await _resetKeys({ investment_portfolio: keys }))

  return {
    tabs,
    tabActive,
    tabActiveIdx,
    handleGoToList,
    handleSubmitForm,
    headerProperties,
    informationFormRef,
  }
}

export default useRegisterDividendsForeignCurrencyCreate
