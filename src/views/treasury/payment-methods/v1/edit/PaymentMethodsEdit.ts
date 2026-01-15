import { useMainLoader, useUtils } from '@/composables'
import { IPaymentMethodV2 } from '@/interfaces/customs/treasury/PaymentMethodsV2'
import { ITabs } from '@/interfaces/global'
import { usePaymentMethodsStore, useResourceManagerStore } from '@/stores'
import { storeToRefs } from 'pinia'
import {
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'

const usePaymentMethodsEdit = () => {
  const router = useRouter()
  const route = useRoute()

  const paymentMethodId = +route.params.id
  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()

  const { data_information_form, payment_methods_request } = storeToRefs(
    usePaymentMethodsStore('v2')
  )

  const {
    _setDataInformationForm,
    _updatePaymentMethod,
    _getByIdPaymentMethod,
  } = usePaymentMethodsStore('v2')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = ['treasury_means_of_payment', 'reason_return_status']

  const headerProps = {
    title: 'Editar forma de pago',
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
        label: 'Editar',
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
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const makeDataRequest = () => {
    return {
      description: data_information_form.value?.description ?? '',
      type_mean_of_payments:
        data_information_form.value?.type_mean_of_payments ?? '',
      dispersion_type: data_information_form.value?.dispersion_type ?? '',
      transaction_type: data_information_form.value?.transaction_type ?? '',
      type_funds_transfer:
        data_information_form.value?.type_funds_transfer ?? '',
      request_registration_beneficiary:
        data_information_form.value?.request_registration_beneficiary ?? false,
      type_registrations: data_information_form.value?.type_registrations ?? '',
      payment_instructions:
        data_information_form.value?.payment_instructions ?? false,
      authorized_payment:
        data_information_form.value?.authorized_payment ?? false,
      crossed_check: data_information_form.value?.crossed_check ?? false,
      message_check: data_information_form.value?.message_check ?? '',
      request_bank_withdrawal:
        data_information_form.value?.request_bank_withdrawal ?? false,
      status_id: data_information_form.value?.status_id ?? 2,
      exchange_days: data_information_form.value?.exchange_days ?? null,
    }
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    data_information_form.value = null
    _getResources({ treasury: keys })
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  onBeforeUnmount(() => _resetKeys({ treasury: keys }))

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload: IPaymentMethodV2 = makeDataRequest()
      if (await _updatePaymentMethod(payload, paymentMethodId)) {
        router.push({ name: 'PaymentMethodsList' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    data_information_form.value = null
    await _getByIdPaymentMethod(paymentMethodId)
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    payment_methods_request,
    formInformation,
    onSubmit,
  }
}

export default usePaymentMethodsEdit
