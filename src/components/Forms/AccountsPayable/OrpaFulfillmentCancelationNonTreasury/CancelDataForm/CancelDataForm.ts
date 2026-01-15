// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { IOrpaCancelDataForm } from '@/interfaces/customs/accounts-payable/OrpaFulfillmentCancelationNonTreasury'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'

const useCancelDataForm = (
  props: {
    data?: IOrpaCancelDataForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const { cancellation_rejection_reasons } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const cancelDataFormRef = ref()

  const models = ref<IOrpaCancelDataForm>({
    reason: null,
    date: null,
    observations: '',
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
    cancelDataFormRef,
    models,
    cancellation_rejection_reasons,
  }
}

export default useCancelDataForm
