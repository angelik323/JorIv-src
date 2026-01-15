// Vue
import { ref } from 'vue'

// Interfaces
import { IAnnualPaymentAmountsForm } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useAnnualPaymentAmountsStore } from '@/stores'

export const useAnnualPaymentAmountsCreate = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { _createAnnualPaymentAmounts } = useAnnualPaymentAmountsStore('v1')

  const { defaultIconsLucide } = useUtils()

  const basic_data_form = ref<IAnnualPaymentAmountsForm | null>(null)

  const basicDataFormRef = ref()

  const headerProps = {
    title: 'Crear montos anuales de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Montos anuales de pago',
        route: 'AnnualPaymentAmountsList',
      },
      {
        label: 'Crear',
        route: 'AnnualPaymentAmountsCreate',
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

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!basic_data_form.value) return
    openMainLoader(true)
    const payload = { ...basic_data_form.value }
    if (await _createAnnualPaymentAmounts(payload)) {
      goToURL('AnnualPaymentAmountsList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

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

export default useAnnualPaymentAmountsCreate
