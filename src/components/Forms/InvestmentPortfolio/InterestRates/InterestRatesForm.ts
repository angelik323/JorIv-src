import { ref, computed, watch, onMounted } from 'vue'
import { IInterestRateModel } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import { useRules } from '@/composables'
import { useUtils } from '@/composables'
import {
  interest_rate_payment_code_options,
  interest_rate_mode_code_options,
} from '@/constants/resources'

const useInterestRateSForm = (props: {
  action: ActionType
  data?: IInterestRateModel
}) => {
  const { formatDate } = useUtils()

  const isViewMode = computed(() => props.action === 'view')

  const {
    is_required,
    max_length,
    only_alphanumeric,
    valid_format_date,
    only_number_greater_than_zero_with_decimal,
    max_integer_decimal,
  } = useRules()

  const codeRules = [
    (v: string) => is_required(v, 'El campo Código es requerido'),
    (v: string) => max_length(v, 15),
    (v: string) => only_alphanumeric(v),
  ]

  const descriptionRules = [
    (v: string) => is_required(v, 'El campo Descripción es requerido'),
    (v: string) => max_length(v, 50),
  ]
  const dateRules = [
    (v: string) => is_required(v, 'El campo Fecha es requerido'),
    (v: string) => valid_format_date(v, 'YYYY-MM-DD'),
  ]
  const rateValueRules = [
    (v: string) => is_required(v, 'El campo Valor tasa es requerido'),
    (v: string) => only_number_greater_than_zero_with_decimal(v),
    (v: string) => max_integer_decimal(v, 3, 6),
  ]

  const formRef = ref()

  const models = ref<IInterestRateModel>({
    code: '',
    interest_rate_description: '',
    interest_rate_code: '',
    mode_code: '',
    payment_frequency_code: '',
    mode: '',
    payment_frequency: '',
    number_months: 0,
    date: '',
    rate_value: '',
    history_interest_rate: undefined,
  })

  const isEdit = computed(() => props.action === 'edit')

  const setFormData = () => {
    const data = props.data
    if (!data) return

    models.value.code = data.code
    models.value.interest_rate_description =
      data.interest_rate_description ?? ''
    models.value.mode = data.mode ?? ''

    const selectedMode = interest_rate_mode_code_options.find(
      (mode) => mode.description === data.mode
    )
    models.value.mode_code = `${selectedMode?.value}`

    models.value.number_months = data.number_months ?? 0
    models.value.payment_frequency = data.payment_frequency ?? ''

    const selectedPaymentFrequency = interest_rate_payment_code_options.find(
      (payment_frequency) =>
        payment_frequency.description === data.payment_frequency
    )
    models.value.payment_frequency_code = `${selectedPaymentFrequency?.value}`

    models.value.date = data.date ?? ''
    models.value.rate_value = data.rate_value ?? 0
    models.value.history_interest_rate = data.history_interest_rate
  }

  onMounted(() => {
    if (props.action === 'create') {
      models.value.date = formatDate('', 'YYYY-MM-DD')
    }
  })

  watch(
    () => models.value.payment_frequency_code,
    (newVal) => {
      const option = interest_rate_payment_code_options.find(
        (opt) => opt.value === newVal
      )

      models.value.payment_frequency = option?.description ?? ''

      if (newVal === 'PE' || newVal === 'N/A') {
        models.value.number_months = 0
      } else {
        models.value.number_months = option?.months ?? 0
      }
    }
  )

  watch(
    () => models.value.mode_code,
    (newVal) => {
      const option = interest_rate_mode_code_options.find(
        (opt) => opt.value === newVal
      )
      models.value.mode = option?.description ?? ''
    }
  )

  watch(
    [() => props.data, () => props.action],
    () => {
      if (props.action === 'edit' || props.action === 'view') {
        setFormData()
      }
    },
    { immediate: true }
  )

  const isValid = ref(false)
  const validateForm = async () => {
    const result = await formRef.value?.validate?.()
    isValid.value = !!result
    return isValid.value
  }

  const resetForm = () => {
    models.value = {
      code: '',
      interest_rate_description: '',
      interest_rate_code: '',
      mode_code: '',
      payment_frequency_code: '',
      mode: '',
      payment_frequency: '',
      number_months: 0,
      date: '',
      rate_value: '',
    }
  }

  const onChangeDate = (val: string) => {
    models.value.date = val
  }

  return {
    formRef,
    models,
    isEdit,
    isValid,
    isViewMode,
    interest_rate_payment_code_options,
    interest_rate_mode_code_options,
    codeRules,
    descriptionRules,
    dateRules,
    rateValueRules,
    validateForm,
    onChangeDate,
    resetForm,
  }
}

export default useInterestRateSForm
