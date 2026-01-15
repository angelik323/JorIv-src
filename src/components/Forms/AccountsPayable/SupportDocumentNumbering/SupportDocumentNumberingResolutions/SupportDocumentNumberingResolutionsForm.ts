// Vue
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ISupportDocumentNumberingResolutionForm } from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'

const useSupportDocumenNumberingResolutionsForm = (
  props: {
    data?: ISupportDocumentNumberingResolutionForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const basicDataFormRef = ref()

  const { support_document_numbering_resolution_statuses } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const models = ref<ISupportDocumentNumberingResolutionForm>({
    resolution: '',
    resolution_date: '',
    prefix: '',
    range_start: null,
    range_end: null,
    validity_start_date: null,
    validity_end_date: null,
    has_business_prefix: false,
    next_available_number: null,
    status_id: null,
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
    support_document_numbering_resolution_statuses,
  }
}

export default useSupportDocumenNumberingResolutionsForm
