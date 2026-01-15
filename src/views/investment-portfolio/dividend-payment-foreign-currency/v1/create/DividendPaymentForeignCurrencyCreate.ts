import { onBeforeMount, onMounted, ref } from 'vue'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { ITabs } from '@/interfaces/global'

import {
  useResourceManagerStore,
  useDividendPaymentForeignCurrencyStore,
} from '@/stores'

const useDividendPaymentForeignCurrencyCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useDividendPaymentForeignCurrencyStore('v1')

  const informationFormRef = ref()

  const keys = [
    'operation_type',
    'currency_type_of_currency',
    'foreign_currency_shar_issuers_selector',
    'issuer_dividend_class_action',
    'issuer_dividend_dividend_type',
  ]

  const headerProperties = {
    title: 'Crear pago dividendos moneda extranjera',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Pago dividendos moneda extranjera',
        route: 'DividendPaymentForeignCurrencyList',
      },
      {
        label: 'Crear',
        route: 'DividendPaymentForeignCurrencyCreate',
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
      name: 'DividendPaymentForeignCurrencyList',
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

export default useDividendPaymentForeignCurrencyCreate
