// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { IOrpaFulfillDataForm } from '@/interfaces/customs/accounts-payable/OrpaFulfillmentCancelationNonTreasury'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

const useFulfillDataForm = (
  props: {
    data?: IOrpaFulfillDataForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const {
    account_structures_accounting_accounts,
    receipt_types,
    sub_receipt_types,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const fulfillDataFormRef = ref()

  const models = ref<IOrpaFulfillDataForm>({
    legalization_account: null,
    voucher_type_id: null,
    subtype_voucher_id: null,
    date: null,
    observation: '',
  })

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    {
      deep: true,
    }
  )

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  return {
    fulfillDataFormRef,
    models,
    account_structures_accounting_accounts,
    receipt_types,
    sub_receipt_types,
  }
}

export default useFulfillDataForm
