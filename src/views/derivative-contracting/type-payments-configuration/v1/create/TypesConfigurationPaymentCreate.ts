// Vue, Pinia
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'

// Store
import { useTypesConfigurationPaymentStore } from '@/stores'
import { storeToRefs } from 'pinia'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables';

// Interfaces
import { ITypePaymentConfigurationForm } from '@/interfaces/customs/derivative-contracting/TypePaymentsConfiguration';

const useInformationFormPaymentCreate = () => {

  const store = useTypesConfigurationPaymentStore('v1')
  const { data_information_form } = storeToRefs(store)
  const { _setDataBasicTypeConfigurationPayment, _createTypeConfigurationPayment, _getPaymentTypes } = store

  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const headerProperties = {
    title: 'Crear configuración de tipos de pagos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      { label: 'Configuraciones' },
      { label: 'Configuración de tipos de pago', route: 'TypesConfigurationPaymentList' },
      { label: 'Crear', route: 'TypesConfigurationPaymentCreate' },
    ],
  }

    const tabs = reactive([
      {
        name: 'InformationForm',
        label: 'Datos básicos',
        icon: defaultIconsLucide.bulletList,
        outlined: true,
        disable: true,
        show: true,
        required: true,
      },
    ])

    const activeTab = ref(tabs[0].name)
    const tabActiveIdx = ref(tabs.findIndex(t => t.name === activeTab.value))

    const informationFormRef = ref()

    const onSubmit = async () => {
      openMainLoader(true)
      const payload = makeDataRequest()
      const created = await _createTypeConfigurationPayment(payload)
      if (created) {
        await _getPaymentTypes('')
        goToURL('TypesConfigurationPaymentList')
      }
      openMainLoader(false)
    }

    const makeDataRequest = (): ITypePaymentConfigurationForm => {
      const { name, payment_type, require_authorization } =
        (data_information_form.value ?? {}) as ITypePaymentConfigurationForm
      return {
        name: name ?? '',
        payment_type: payment_type ?? '',
        require_authorization: require_authorization ? 1 : 0,
      }
    }
  

  const form = ref({
    name: '',
    payment_type: null as string | number | null,
    require_authorization: 0,
  })

  // Inicializa el formulario desde el store (por si se viene de un edit)
  onMounted(() => {
    if (data_information_form.value) {
      const d = data_information_form.value as ITypePaymentConfigurationForm
      form.value.name = d.name ?? ''
      form.value.payment_type = d.payment_type ?? null
      form.value.require_authorization = Number(d.require_authorization)
    }

    // inicializa el store vacío
    _setDataBasicTypeConfigurationPayment({
      name: form.value.name,
      payment_type: form.value.payment_type?.toString() ?? '',
      require_authorization: form.value.require_authorization
    })
  })

  // actualiza el store en tiempo real
  watch(
    form,
    (f) => {
      _setDataBasicTypeConfigurationPayment({
        name: f.name,
        payment_type: f.payment_type?.toString() ?? '',
        require_authorization: f.require_authorization,
      })
    },
    { deep: true }
  )

  onUnmounted(() => {
    _setDataBasicTypeConfigurationPayment(null)
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    goToURL,
    onSubmit
  }
}

export default useInformationFormPaymentCreate
