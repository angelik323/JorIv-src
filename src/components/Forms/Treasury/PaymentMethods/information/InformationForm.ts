import { IPaymentMethod } from '@/interfaces/customs'
import { usePaymentMethodsStore, useTreasuryResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const useInformationForm = (props: {
  action: 'create' | 'edit' | 'view'
  data?: IPaymentMethod | null
}) => {
  const { data_information_form } = storeToRefs(usePaymentMethodsStore('v1'))
  const { _setDataInformationForm } = usePaymentMethodsStore('v1')

  const {
    dispersion_types,
    transaction_types,
    type_funds_transfers,
    type_means_of_payments,
    type_registrations,
    reason_return_status,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const formInformation = ref()
  const isTypeFundsTransfersDisabled = ref()
  const isDisabledCrossedCheck = ref(false)
  const models = ref<{
    code?: string
    description: string
    type_mean_of_payments: string
    dispersion_type: string
    transaction_type: string
    type_funds_transfer: string
    request_registration_beneficiary: boolean
    type_registrations: string
    payment_instructions: boolean
    authorized_payment: boolean
    crossed_check: boolean
    message_check: string
    request_bank_withdrawal: boolean
    status_id?: number
  }>({
    code: '',
    description: '',
    type_mean_of_payments: '',
    dispersion_type: '',
    transaction_type: '',
    type_funds_transfer: '',
    request_registration_beneficiary: false,
    type_registrations: '',
    payment_instructions: false,
    authorized_payment: false,
    crossed_check: false,
    message_check: '',
    request_bank_withdrawal: false,
    status_id: 1,
  })

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const setFormEdit = async () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.code = data?.code
      models.value.description = data?.description
      models.value.type_mean_of_payments = data?.type_mean_of_payments
      models.value.dispersion_type = data?.dispersion_type
      models.value.transaction_type = data?.transaction_type
      models.value.type_funds_transfer = data?.type_funds_transfer
      models.value.request_registration_beneficiary =
        data?.request_registration_beneficiary
      models.value.type_registrations = data?.type_registrations
      models.value.payment_instructions = data?.payment_instructions
      models.value.authorized_payment = data?.authorized_payment
      models.value.crossed_check = data?.crossed_check
      models.value.message_check = data?.message_check
      models.value.request_bank_withdrawal =
        data?.request_bank_withdrawal ?? false
      models.value.status_id = data?.status_id ?? 2
    }
  }

  const _setFormView = async () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.code = data?.code
      models.value.description = data?.description
      models.value.type_mean_of_payments = data?.type_mean_of_payments
      models.value.dispersion_type = data?.dispersion_type
      models.value.transaction_type = data?.transaction_type
      models.value.type_funds_transfer = data?.type_funds_transfer
      models.value.request_registration_beneficiary =
        data?.request_registration_beneficiary
      models.value.type_registrations = data?.type_registrations
      models.value.payment_instructions = data?.payment_instructions
      models.value.authorized_payment = data?.authorized_payment
      models.value.crossed_check = data?.crossed_check
      models.value.message_check = data?.message_check
      models.value.request_bank_withdrawal =
        data?.request_bank_withdrawal ?? false
      models.value.status_id = data?.status_id ?? 2
    }
  }

  const clearForm = () => {
    models.value.code = ''
    models.value.description = ''
    models.value.type_mean_of_payments = ''
    models.value.dispersion_type = ''
    models.value.transaction_type = ''
    models.value.type_funds_transfer = ''
    models.value.request_registration_beneficiary = false
    models.value.type_registrations = ''
    models.value.payment_instructions = false
    models.value.authorized_payment = false
    models.value.crossed_check = false
    models.value.message_check = ''
    models.value.request_bank_withdrawal = false
  }

  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.transaction_type,
    (val) => {
      isTypeFundsTransfersDisabled.value = false
      if (val) {
        if (val !== 'Traslado fondos') {
          models.value.type_funds_transfer = ''
          models.value.request_registration_beneficiary = false
          models.value.type_registrations = ''
          isTypeFundsTransfersDisabled.value = true
        }
      }
    }
  )

  watch(
    () => [
      models.value.request_registration_beneficiary,
      models.value.crossed_check,
    ],
    () => {
      if (!models.value.request_registration_beneficiary) {
        models.value.type_registrations = ''
      }
      if (!models.value.crossed_check) {
        models.value.message_check = ''
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmpty(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({
          code: models.value.code ?? undefined,
          description: models.value.description ?? null,
          type_mean_of_payments: models.value.type_mean_of_payments ?? null,
          dispersion_type: models.value.dispersion_type ?? null,
          transaction_type: models.value.transaction_type ?? null,
          type_funds_transfer: models.value.type_funds_transfer ?? null,
          request_registration_beneficiary:
            models.value.request_registration_beneficiary ?? null,
          type_registrations: models.value.type_registrations ?? null,
          payment_instructions: models.value.payment_instructions ?? null,
          authorized_payment: models.value.authorized_payment ?? null,
          crossed_check: models.value.crossed_check ?? null,
          message_check: models.value.message_check ?? '',
          request_bank_withdrawal:
            models.value.request_bank_withdrawal ?? false,
          status_id: models.value.status_id ?? 1,
        })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.type_mean_of_payments,
    (val) => {
      const isChequeOficina = val === 'Cheque de oficina'
      isDisabledCrossedCheck.value = !isChequeOficina
      if (!isChequeOficina) {
        models.value.crossed_check = false
        models.value.message_check = ''
      }
    }
  )

  return {
    models,
    formInformation,
    dispersion_types,
    transaction_types,
    type_funds_transfers,
    type_means_of_payments,
    type_registrations,
    reason_return_status,
    isTypeFundsTransfersDisabled,
    isDisabledCrossedCheck,
  }
}

export default useInformationForm
