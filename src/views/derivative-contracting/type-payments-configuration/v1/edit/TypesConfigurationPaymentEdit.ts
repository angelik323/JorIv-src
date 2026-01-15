// Vue, Pinia 
import { ref, reactive, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'

// Router
import { useRoute } from 'vue-router'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Store
import { useTypesConfigurationPaymentStore } from '@/stores'

// Interfaces
import type { ITypePaymentConfigurationForm, ITypesPaymentConfigurationResponse } from '@/interfaces/customs/derivative-contracting/TypePaymentsConfiguration'

const useTypesConfigurationPaymentEdit = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const store = useTypesConfigurationPaymentStore('v1')
  const {
    _updateTypeConfigurationPayment,
    _setDataBasicTypeConfigurationPayment,
    _getPaymentTypes,
    _getByIdTypeConfigurationPayment,
  } = store

  const { data_information_form, type_received_request } = storeToRefs(store)
  const idParam = ref(Number(route.params.id))

  const headerProperties = {
    title: 'Editar configuración de tipos de pagos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      { label: 'Configuraciones' },
      { label: 'Configuración de tipos de pago', route: 'TypesConfigurationPaymentList' },
      { label: 'Editar', route: 'TypesConfigurationPaymentEdit' },
      { label: idParam.value.toString() },
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

  // 1) Carga inicial por ID y seteo en el store para que el form se pinte con esos datos
  onBeforeMount(async () => {
    _setDataBasicTypeConfigurationPayment(null)

    const idParam = Number(route.params.id)
    if (!idParam) return

    openMainLoader(true)
      await _getByIdTypeConfigurationPayment(idParam)
      const fetched = type_received_request.value as ITypesPaymentConfigurationResponse
      if (fetched) {
        // Normalizamos lo que el form necesita
        _setDataBasicTypeConfigurationPayment({
          id: fetched.id,
          name: fetched.name ?? '',
          payment_type: fetched.payment_type ?? '',
          // require_authorization en el formulario lo manejamos como 0/1
          require_authorization: fetched.require_authorization ? 1 : 0,
        } as ITypePaymentConfigurationForm)
      }
      openMainLoader(false)
  })

  onUnmounted(() => _setDataBasicTypeConfigurationPayment(null))

  const makeDataRequest = (): ITypePaymentConfigurationForm => {
    const { name, payment_type, require_authorization } =
      (data_information_form.value ?? {}) as Partial<ITypePaymentConfigurationForm & { require_authorization: number | boolean }>

    // enviamos 0/1; si viniera boolean, lo normalizamos
    let normalizedRequireAuthorization: number;
    if (typeof require_authorization === 'boolean') {
      normalizedRequireAuthorization = require_authorization ? 1 : 0;
    } else {
      normalizedRequireAuthorization = Number(require_authorization) === 1 ? 1 : 0;
    }

    return {
      name: name ?? '',
      payment_type: payment_type ?? '',
      require_authorization: normalizedRequireAuthorization,
    }
  }

  const onSubmit = async () => {
    const id = Number((data_information_form.value as ITypePaymentConfigurationForm)?.id ?? route.params.id)
    if (!id) return

    openMainLoader(true)
      const payload = makeDataRequest()
      const updated = await _updateTypeConfigurationPayment(payload, id)
      if (updated) {
        await _getPaymentTypes('')
        goToURL('TypesConfigurationPaymentList')
      }
      openMainLoader(false)
  }

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    goToURL,
    onSubmit,
    data_information_form,
  }
}

export default useTypesConfigurationPaymentEdit
