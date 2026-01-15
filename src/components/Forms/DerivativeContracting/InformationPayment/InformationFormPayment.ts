// Vue, Pinia
import { onUnmounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils, useGoToUrl } from '@/composables'

// Store
import { useTypesConfigurationPaymentStore } from '@/stores'

// Interfaces
import { ITypePaymentConfigurationForm } from '@/interfaces/customs/derivative-contracting/TypePaymentsConfiguration'

// Constantes
import { typePaymentOptions } from '@/constants/resources/derivative-contracting'

// Tipos
import { ActionType } from '@/interfaces/global'


const useInformationFormPayment = (props: { action: ActionType; id?: number }) => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const store = useTypesConfigurationPaymentStore('v1')
  const { data_information_form } = storeToRefs(store)
  const {
    _setDataBasicTypeConfigurationPayment,
    _createTypeConfigurationPayment,
    _getPaymentTypes,
  } = store

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
  const tabActiveIdx = ref(tabs.findIndex((tab) => tab.name === activeTab.value))

  const form = ref({
    name: '',
    payment_type: null as string | number | null,
    require_authorization: false,
  })

  const nameRef = ref()
  const typeRef = ref()

  // Hidratar cuando el store tenga los datos (modo EDIT)
  // Esto permite que, aunque el GET/ID llegue un poco después, el form se rellene.
  const syncFromStoreToForm = () => {
    const d = data_information_form.value as ITypePaymentConfigurationForm
    if (!d) return
    form.value.name = d.name ?? ''
    form.value.payment_type = d.payment_type ?? null
    form.value.require_authorization =
      typeof d.require_authorization === 'boolean'
        ? (d.require_authorization ? true : false)
        : Boolean(d.require_authorization ?? false)
  }

  const hydrateFromStoreIfNeeded = () => {
    if (props.action === 'edit') {
      syncFromStoreToForm()
      // y escucha cuando el store se actualice tras el GET/ID
      watch(
        () => data_information_form.value,
        () => {
          syncFromStoreToForm()
        },
        { immediate: false }
      )
    } else {
      // CREATE: inicializa el store con lo que tenga el form vacío
      _setDataBasicTypeConfigurationPayment({
        name: form.value.name,
        payment_type: form.value.payment_type ?? '',
        require_authorization: form.value.require_authorization,
      } as ITypePaymentConfigurationForm)
    }
  }

  // Sincroniza el form con el store en tiempo real (para ambos modos)
  watch(
    form,
    (f) => {
      _setDataBasicTypeConfigurationPayment({
        name: f.name,
        payment_type: f.payment_type ?? '',
        require_authorization: f.require_authorization,
      } as ITypePaymentConfigurationForm)
    },
    { deep: true }
  )

  const validateForm = async (): Promise<boolean> => {
    const okName = await nameRef.value?.validate()
    const okType = await typeRef.value?.validate()
    return !!okName && !!okType
  }

  onUnmounted(() => {
    _setDataBasicTypeConfigurationPayment(null)
  })
  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)

    const payload = {
      name: form.value.name,
      payment_type: form.value.payment_type ?? '',
      require_authorization: form.value.require_authorization ? 1 : 0,
    }

    const created = await _createTypeConfigurationPayment(payload)
    if (created) {
      await _getPaymentTypes('')
      goToURL('TypesConfigurationPaymentList')
    }

    openMainLoader(false)
  }

  return {
    form,
    typePaymentOptions,
    nameRef,
    typeRef,
    validateForm,
    tabs,
    activeTab,
    tabActiveIdx,
    onSubmit,
    hydrateFromStoreIfNeeded,
  }
}

export default useInformationFormPayment
