// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Interfaces
import { IPaymentAuthorizersForm } from '@/interfaces/customs/accounts-payable/PaymentAuthorizers'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { usePaymentAuthorizersStore } from '@/stores/accounts-payable/payment-authorizers'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const usePaymentAuthorizersCreate = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { defaultIconsLucide } = useUtils()

  const { _createPaymentAuthorizers } = usePaymentAuthorizersStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basic_data_form = ref<IPaymentAuthorizersForm | null>(null)

  const basicDataFormRef = ref()

  const headerProps = {
    title: 'Crear autorizador de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Autorizadores de pago',
        route: 'PaymentAuthorizersList',
      },
      {
        label: 'Crear',
        route: 'PaymentAuthorizersCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!basic_data_form.value) return
    openMainLoader(true)
    const payload = { ...basic_data_form.value }
    if (await _createPaymentAuthorizers(payload)) {
      goToURL('PaymentAuthorizersList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const keys = {
    user: ['users'],
  }

  onMounted(() => _getResources(keys))

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basic_data_form,
    handleCreate,
    goToURL,
  }
}

export default usePaymentAuthorizersCreate
