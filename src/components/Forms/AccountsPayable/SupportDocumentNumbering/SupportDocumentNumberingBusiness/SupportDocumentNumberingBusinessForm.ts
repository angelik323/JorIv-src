// Vue
import { ref, watch } from 'vue'

// Interfaces - Constants
import { ISupportDocumentNumberingBusinessForm } from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { default_statuses } from '@/constants'

// Composables
import { useUtils } from '@/composables'

const useSupportDocumenNumberingBusinessForm = (
  props: {
    data?: ISupportDocumentNumberingBusinessForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const basicDataFormRef = ref()

  const models = ref<ISupportDocumentNumberingBusinessForm>({
    nit: '',
    business_code: '',
    resolution: '',
    resolution_date: null,
    prefix: '',
    range_start: null,
    range_end: null,
    validity_start_date: null,
    validity_end_date: null,
    next_available_number: null,
    status_id: 1,
    handles_issuer_data: false,
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
    basicDataFormRef,
    models,
    default_statuses,
  }
}

export default useSupportDocumenNumberingBusinessForm
