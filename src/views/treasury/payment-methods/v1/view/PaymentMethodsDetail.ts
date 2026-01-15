import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { usePaymentMethodsStore } from '@/stores'
import { defaultIcons } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeMount, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const usePaymentMethodsDetail = () => {
  const route = useRoute()

  const paymentMethodId = +route.params.id

  const { openMainLoader } = useMainLoader()

  const { payment_methods_request } = storeToRefs(usePaymentMethodsStore('v1'))

  const { _setDataInformationForm, _getByIdPaymentMethod } =
    usePaymentMethodsStore('v1')

  const headerProps = {
    title: 'Ver forma de pago',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Forma de pago',
        route: 'PaymentMethodsList',
      },
      {
        label: 'Ver',
        route: '',
      },
      {
        label: `${paymentMethodId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
      icon: defaultIcons.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdPaymentMethod(paymentMethodId)
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    payment_methods_request,
  }
}

export default usePaymentMethodsDetail
