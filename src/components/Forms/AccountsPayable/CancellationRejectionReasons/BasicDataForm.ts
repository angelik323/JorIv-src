import { useUtils } from '@/composables'
import {
  ICancellationRejectionReasonsForm,
  ICancellationRejectionReasonsItem,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import {
  useAccountsPayableResourceStore,
  useCancellationRejectionReasonsStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const useBasicDataForm = (props: {
  data?: ICancellationRejectionReasonsItem | null
  action: ActionType
}) => {
  const basicDataFormRef = ref()
  const { _setFormData } = useCancellationRejectionReasonsStore('v1')

  const { cancellation_reason_types } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const { isEmptyOrZero } = useUtils()

  const models = ref<ICancellationRejectionReasonsForm>({
    reason_code: '',
    reason_type: '',
    description: '',
    has_reports_dian: false,
    is_applies_tax_refund: false,
  })

  const setFormEdit = () => {
    if (props.data) {
      const data = props.data
      models.value.reason_type = data.reason_type
        ? data.reason_type === 'Rechazo'
          ? 'rechazo'
          : 'anulacion'
        : ''
      models.value.reason_code = data.reason_code ?? ''
      models.value.description = data.description ?? ''
      models.value.has_reports_dian = data.has_reports_dian ?? false
      models.value.is_applies_tax_refund = data.is_applies_tax_refund ?? false
    }
  }

  watch(
    () => models.value,
    (val) => {
      if (isEmptyOrZero(models.value)) {
        _setFormData(null)
      } else {
        _setFormData(val)
      }
    },
    {
      deep: true,
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        setFormEdit()
      }
    }
  )

  watch(
    () => models.value.reason_type,
    (val) => {
      if (val && val === 'rechazo') {
        models.value.has_reports_dian = false
        models.value.is_applies_tax_refund = false
      }
    }
  )

  return {
    basicDataFormRef,
    models,
    cancellation_reason_types,
  }
}

export default useBasicDataForm
