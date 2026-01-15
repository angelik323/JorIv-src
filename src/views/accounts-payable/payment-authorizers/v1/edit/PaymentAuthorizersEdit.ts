// Vue - pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { IPaymentAuthorizersForm } from '@/interfaces/customs/accounts-payable/PaymentAuthorizers'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Store
import { usePaymentAuthorizersStore } from '@/stores/accounts-payable/payment-authorizers'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const usePaymentAuthorizersEdit = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { defaultIconsLucide } = useUtils()

  const { _updatePaymentAuthorizers, _getPaymentAuthorizersById } =
    usePaymentAuthorizersStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basic_data_form = ref<IPaymentAuthorizersForm | null>(null)

  const basicDataFormRef = ref()

  const paymentAuthorizersId = +route.params.id

  const headerProps = {
    title: 'Editar autorizador de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Autorizadores de pago',
        route: 'PaymentAuthorizersList',
      },
      {
        label: 'Editar',
        route: 'PaymentAuthorizersEdit',
      },
      {
        label: `${paymentAuthorizersId}`,
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

  const setEditData = async () => {
    const data = await _getPaymentAuthorizersById(paymentAuthorizersId)
    if (!data) return
    basic_data_form.value = {
      ...data,
      autorized_user_id: data.autorized_user.id,
    }
  }

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!basic_data_form.value) return
    openMainLoader(true)
    const payload = { ...basic_data_form.value }
    if (await _updatePaymentAuthorizers(payload, paymentAuthorizersId)) {
      goToURL('PaymentAuthorizersList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const keys = {
    user: ['users'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await setEditData()
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basic_data_form,
    handleEdit,
    goToURL,
  }
}

export default usePaymentAuthorizersEdit
