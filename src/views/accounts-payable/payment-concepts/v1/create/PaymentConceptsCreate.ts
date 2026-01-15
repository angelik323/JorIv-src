// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Interfaces
import { IPaymentConceptsForm } from '@/interfaces/customs/accounts-payable/PaymentConcepts'
import { ITabs } from '@/interfaces/global'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { usePaymentConceptsStore } from '@/stores/accounts-payable/payment-concepts'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const usePaymentConceptsCreate = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { showAlert } = useAlert()

  const { defaultIconsLucide } = useUtils()

  const { _createPaymentConcepts } = usePaymentConceptsStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basic_data_form = ref<IPaymentConceptsForm | null>(null)

  const basicDataFormRef = ref()

  const headerProps = {
    title: 'Crear concepto de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Conceptos de pago',
        route: 'PaymentConceptsList',
      },
      {
        label: 'Crear',
        route: 'PaymentConceptsCreate',
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
    if (!basic_data_form.value.concept_type) {
      showAlert(`Debes seleccionar el tipo de concepto de pago`, 'error')
      return
    }
    openMainLoader(true)
    const payload = { ...basic_data_form.value }
    if (await _createPaymentConcepts(payload)) {
      goToURL('PaymentConceptsList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const keys = {
    accounting: ['account_structures'],
    accounts_payable: [
      'payment_concept_types',
      'payment_concept_nature_types',
      'payment_concept_activity_types',
      'payment_concept_obligation_types',
      'payment_concept_pension_types',
    ],
  }

  onMounted(async () => {
    await _getResources(
      keys,
      'filter[type]=Catálogo%20de%20conceptos%20pago&filter[status_id]=1'
    )
  })

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

export default usePaymentConceptsCreate
