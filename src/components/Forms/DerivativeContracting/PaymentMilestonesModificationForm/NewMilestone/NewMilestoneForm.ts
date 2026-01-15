// Vue - Pinia - Router - Quasar
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useTypesConfigurationPaymentStoreV1 } from '@/stores/derivative-contracting/types-configuration-payment/types-configuration-payment-v1'

const useNewMilestoneForm = (props: {
  contractSubscriptionDate: string
  isLocalCurrency: boolean
  contractValue: number
  foreignValue: number
  trm: number
  currentTotalLocal: number
  currentTotalForeign: number
  milestoneNumber: string
  emit: (event: 'submit' | 'cancel', ...args: unknown[]) => void
}) => {
  const { types_configuration_payment_list } = storeToRefs(
    useTypesConfigurationPaymentStoreV1()
  )
  const { _getPaymentTypes } = useTypesConfigurationPaymentStoreV1()
  const { formatCurrencyString } = useUtils()

  const formRef = ref()
  const form = ref({
    milestone_number: props.milestoneNumber,
    payment_type_id: null,
    payment_type_name: '',
    date: '',
    apply_budget: false,
    foreign_amount: '',
    local_amount: '',
  })

  // Fetch payment types on mount
  onMounted(async () => {
    await _getPaymentTypes('status=1')
  })

  const paymentTypes = computed(() => {
    return types_configuration_payment_list.value.map((item) => ({
      label: item.name,
      value: item.id,
    }))
  })

  // Watch for payment type selection to store name
  watch(
    () => form.value.payment_type_id,
    (newVal) => {
      const selected = types_configuration_payment_list.value.find(
        (item) => item.id === newVal
      )
      form.value.payment_type_name = selected?.name || ''
    }
  )

  const isValidDate = (date: string) => {
    if (!date || !props.contractSubscriptionDate) return true
    return new Date(date) >= new Date(props.contractSubscriptionDate)
  }

  const parseCurrency = (val: string | number) => {
    if (!val) return 0
    if (typeof val === 'number') return val
    let cleaned = val.toString().replace(/\./g, '').replace(',', '.')
    cleaned = cleaned.replace(/[^0-9.-]+/g, '')
    return Number(cleaned)
  }

  const checkMaxForeignAmount = (val: string) => {
    const amount = parseCurrency(val)
    const available = props.foreignValue - props.currentTotalForeign
    return amount <= available
  }

  const checkMaxLocalAmount = (val: string) => {
    const amount = parseCurrency(val)
    const available = props.contractValue - props.currentTotalLocal
    return amount <= available
  }

  const calculateLocalAmount = (val: string) => {
    if (!props.isLocalCurrency && props.trm) {
      const amount = parseCurrency(val)
      const local = amount * props.trm
      form.value.local_amount = formatCurrencyString(local) || ''
    }
  }

  // Watch for changes in foreign amount to recalculate local amount if not local currency
  watch(
    () => form.value.foreign_amount,
    (newVal) => {
      if (!props.isLocalCurrency) {
        calculateLocalAmount(newVal || '')
      }
    }
  )

  // Watch prop change to update form
  watch(
    () => props.milestoneNumber,
    (newVal) => {
      form.value.milestone_number = newVal
    }
  )

  const resetForm = () => {
    form.value = {
      milestone_number: props.milestoneNumber,
      payment_type_id: null,
      payment_type_name: '',
      date: '',
      apply_budget: false,
      foreign_amount: '',
      local_amount: '',
    }
  }

  const handleSubmit = async () => {
    const valid = await formRef.value.validate()
    if (valid) {
      props.emit('submit', form.value)
    }
  }

  return {
    formRef,
    form,
    paymentTypes,
    isValidDate,
    parseCurrency,
    checkMaxForeignAmount,
    checkMaxLocalAmount,
    calculateLocalAmount,
    resetForm,
    handleSubmit,
  }
}

export default useNewMilestoneForm
