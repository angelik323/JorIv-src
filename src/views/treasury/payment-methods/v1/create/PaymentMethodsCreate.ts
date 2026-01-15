import { useMainLoader } from '@/composables'
import { IPaymentMethodV2 } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { usePaymentMethodsStore, useResourceManagerStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const usePaymentMethodsCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(usePaymentMethodsStore('v2'))
  const { _setDataInformationForm, _createPaymentMethod } =
    usePaymentMethodsStore('v2')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    treasury: ['treasury_means_of_payment'],
  }
  const headerProps = {
    title: 'Crear forma de pago',
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
        label: 'Crear',
        route: '',
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
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload: IPaymentMethodV2 = makeDataRequest()
      if (await _createPaymentMethod(payload)) {
        router.push({ name: 'PaymentMethodsList' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    onSubmit,
  }
}

export default usePaymentMethodsCreate
