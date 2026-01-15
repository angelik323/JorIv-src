// Vue
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  ISecondAuthorizationBasicDataForm,
  ISecondAuthorizationDataAuthorization,
  ISecondAuthorizationPaymentOrderForm,
  ISecondAuthorizationShowResponse,
} from '@/interfaces/customs/accounts-payable/SecondAuthorization'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useSecondAuthorizationStore } from '@/stores/accounts-payable/second-authorization'

export const useSecondAuthorizationView = () => {
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const secondAuthorizationId = +route.params.id

  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()

  const { _getSecondAuthorizationById } = useSecondAuthorizationStore('v1')

  const authorization_data_form =
    ref<ISecondAuthorizationDataAuthorization | null>(null)

  const basic_data_form = ref<ISecondAuthorizationBasicDataForm | null>(null)

  const payment_order_form = ref<ISecondAuthorizationPaymentOrderForm | null>(
    null
  )

  const headerProps = {
    title: 'Ver autorización 2 - Generación ORPA',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Autorización 2 - Generacion ORPA - Pago giros',
        route: 'SecondAuthorizationList',
      },
      {
        label: 'Ver',
        route: 'SecondAuthorizationView',
      },
      {
        label: `${secondAuthorizationId}`,
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
      name: 'payment_order',
      label: 'Orden de pago',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: false,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(0)

  const setViewData = async () => {
    const data: ISecondAuthorizationShowResponse | null =
      await _getSecondAuthorizationById(secondAuthorizationId)
    if (data) {
      if (data.payments && data.payments.length > 0) {
        tabs.value[1].show = true
        payment_order_form.value = {
          foreign_currency: data.foreign_currency,
          payments: data.payments,
        }
      }

      authorization_data_form.value = {
        ...data,
      }
      basic_data_form.value = {
        instructions: data.instructions,
        beneficiaries: data.beneficiaries,
        authorizer: data.authorizers,
      }
    }
  }

  const nextTab = () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  onMounted(async () => {
    openMainLoader(true)
    await setViewData()
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    authorization_data_form,
    basic_data_form,
    payment_order_form,
    goToURL,
    nextTab,
    backTab,
  }
}

export default useSecondAuthorizationView
