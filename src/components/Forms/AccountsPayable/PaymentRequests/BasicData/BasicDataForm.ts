// core
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useUtils, useRules } from '@/composables'

// interfaces
import { ActionType } from '@/interfaces/global'
import { IPaymentRequestBasicDataForm } from '@/interfaces/customs/accounts-payable/PaymentRequests'

// constants
import { process_source } from '@/constants/resources'

// stores
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { usePaymentRequestsStore } from '@/stores/accounts-payable/payment-requests'

const useBasicDataForm = (
  props: {
    action?: ActionType
    data?: IPaymentRequestBasicDataForm | null
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero } = useUtils()
  const {
    is_required,
    min_length,
    max_length,
    only_alphanumeric,
    only_number,
    valid_format_date,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
    only_number_with_max_integers_and_decimals_ignore_symbols,
  } = useRules()

  // stores
  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { total_value, iva_value, supplier_id } = storeToRefs(
    usePaymentRequestsStore('v1')
  )

  // refs

  // configs
  const basicDataFormRef = ref()

  const models = ref<IPaymentRequestBasicDataForm>({
    office_id: null,
    process_source: '',
    radicated_code: '',
    reception_date: '',
    prefix: '',
    supplier_id: null,
    invoice_number: '',
    invoice_issue_date: '',
    invoice_due_date: '',
    total_value: '',
    iva_value: '',
  })

  // lifecycle hooks
  watch(
    () => models.value.total_value,
    (val) => {
      total_value.value = val || 0
    }
  )

  watch(
    () => models.value.iva_value,
    (val) => {
      iva_value.value = val || 0
    }
  )

  watch(
    () => models.value.supplier_id,
    (val) => {
      supplier_id.value = val || 0
    }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val && props.data) models.value = props.data
    },
    { immediate: true }
  )

  return {
    basicDataFormRef,
    models,

    // selects
    offices,
    process_source,
    third_parties,

    // rules
    is_required,
    min_length,
    max_length,
    only_alphanumeric,
    only_number,
    valid_format_date,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
    only_number_with_max_integers_and_decimals_ignore_symbols,
  }
}

export default useBasicDataForm
