// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { IFiscalChargeManagementForm } from '@/interfaces/customs/accounts-payable/FiscalChargeManagement'
import { default_statuses } from '@/constants/resources'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'

const useBasicDataForm = (
  props: {
    data?: IFiscalChargeManagementForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const { tax_types, tax_natures, revenue_beneficiary_entities } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const basicDataFormRef = ref()

  const models = ref<IFiscalChargeManagementForm>({
    code: '',
    name: '',
    tax_type_id: null,
    tax_nature_id: null,
    revenue_beneficiary_entity_id: null,
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
    tax_types,
    tax_natures,
    revenue_beneficiary_entities,
    default_statuses,
  }
}

export default useBasicDataForm
