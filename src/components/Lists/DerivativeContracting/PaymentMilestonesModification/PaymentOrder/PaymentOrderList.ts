// vue, pinia
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'

// stores
import { useTypesConfigurationPaymentStoreV1 } from '@/stores/derivative-contracting/types-configuration-payment/types-configuration-payment-v1'

// interfaces
import { INewMilestoneFormState } from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

type EmitFn = (event: 'submit', payload: INewMilestoneFormState) => void

const useNewMilestoneForm = (props: {
  contractSubscriptionDate: string
  isLocalCurrency: boolean
  contractValue: number
  foreignValue: number
  trm: number
  currentTotalLocal: number
  currentTotalForeign: number
  milestoneNumber: string
}, emit: EmitFn) => {

  const { types_configuration_payment_list } = storeToRefs(useTypesConfigurationPaymentStoreV1())
  const { _getPaymentTypes } = useTypesConfigurationPaymentStoreV1()
  const { formatCurrency } = useUtils()

  // Locally defined since useUtils cannot be modified
  const cleanCurrencyToNumber = (value: string | number): number => {
    if (typeof value === 'number') return value
    if (!value) return 0

    const cleaned = value
      .toString()
      .trim()
      .replace(/[^0-9,.-]/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.')

    const num = Number(cleaned)
    return isNaN(num) ? 0 : num
  }

  const formRef = ref()
  const form = ref({
    milestone_number: props.milestoneNumber,
    payment_type_id: null,
    payment_type_name: '',
    date: '',
    apply_budget: false,
    foreign_amount: '',
    local_amount: ''
  })

  // Fetch payment types on mount
  onMounted(async () => {
    await _getPaymentTypes('status=1') // Fetch only active records
  })

  const paymentTypes = computed(() => {
    return types_configuration_payment_list.value.map(item => ({
      label: item.name,
      value: item.id
    }))
  })

  // Watch for payment type selection to store name
  watch(() => form.value.payment_type_id, (newVal) => {
    const selected = types_configuration_payment_list.value.find(item => item.id === newVal)
    form.value.payment_type_name = selected?.name || ''
  })

  // Composables
  const { date_after_or_equal_to_specific_date } = useRules()

  const isValidDate = (date: string) => {
    return date_after_or_equal_to_specific_date(
      date,
      props.contractSubscriptionDate,
      'Fecha de suscripción'
    )
  }

  const checkMaxForeignAmount = (val: string) => {
    const amount = cleanCurrencyToNumber(val)
    const available = props.foreignValue - props.currentTotalForeign
    return amount <= available
  }

  const checkMaxLocalAmount = (val: string) => {
    const amount = cleanCurrencyToNumber(val)
    const available = props.contractValue - props.currentTotalLocal
    return amount <= available
  }

  const calculateLocalAmount = (val: string) => {
    if (!props.isLocalCurrency && props.trm) {
      const amount = cleanCurrencyToNumber(val)
      const local = amount * props.trm
      form.value.local_amount = formatCurrency(local) || ''
    }
  }

  // Watch for changes in foreign amount to recalculate local amount if not local currency
  watch(() => form.value.foreign_amount, (newVal) => {
    if (!props.isLocalCurrency) {
      calculateLocalAmount(newVal || '')
    }
  })

  // Watch prop change to update form
  watch(() => props.milestoneNumber, (newVal) => {
    form.value.milestone_number = newVal
  })

  const resetForm = () => {
    form.value = {
      milestone_number: props.milestoneNumber,
      payment_type_id: null,
      payment_type_name: '',
      date: '',
      apply_budget: false,
      foreign_amount: '',
      local_amount: ''
    }
  }

  const handleSubmit = async () => {
    const valid = await formRef.value.validate()
    if (valid) {
      emit('submit', form.value)
    }
  }

  return {
    formRef,
    form,
    paymentTypes,
    isValidDate,
    cleanCurrencyToNumber,
    checkMaxForeignAmount,
    checkMaxLocalAmount,
    calculateLocalAmount,
    resetForm,
    handleSubmit
  }
}

export default useNewMilestoneForm

