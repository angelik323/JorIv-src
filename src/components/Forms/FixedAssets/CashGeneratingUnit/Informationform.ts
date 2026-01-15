// vue - quasar
import { computed, ref, watch } from 'vue'

// interface
import { ActionType } from '@/interfaces/global'
import { ICashUnitForm } from '@/interfaces/customs/fixed-assets/CashGeneratingUnit'

// stores
import { storeToRefs } from 'pinia'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'

// composable
import { useUtils } from '@/composables'
import { useTrustBusinessResourceStore } from '@/stores'

const useCashUnitForm = (
  props: {
    action: ActionType
    data?: ICashUnitForm | null
  },

  emit: Function
) => {
  const { isEmptyOrZero, formatDate } = useUtils()

  // stores
  const { business_trusts_uge, configuration_type } = storeToRefs(
    useFixedAssetsResourceStore('v1')
  )
  const { business_currency, business_trusts } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const models = ref<ICashUnitForm>({
    id: null,
    business_trust: null,
    code: null,
    description: null,
    created_at: null,
    initial_value: '' as string,
    currency: null,
    status: null,
    configuration_type: null,
    business_trust_id: null,
    configuration_type_id: null,
    description_type: null,
    cash_flow_generation_date: null,
    statuses_uge: 1,
    created_by: null,
    updated_by: null,
    updated_at: null,
  })

  const cashGeneretingUnitRef = ref()

  const defaultDateValue = computed(() => {
    if (props.action === 'edit' && models.value.created_at) {
      return models.value.created_at
    }
    return formatDate(new Date().toLocaleString('sv-SE'), 'YYYY-MM-DD HH:mm')
  })

  const isDisabled = computed(() => props.action === 'edit')

  // lifecycle hooks
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
      if (val && props.data) {
        models.value = {
          ...props.data,
          initial_value: String(props.data.initial_value ?? ''),
        }
      }
    },

    { immediate: true }
  )

  return {
    models,
    cashGeneretingUnitRef,
    business_trusts_uge,
    business_trusts,

    configuration_type,
    business_currency,
    defaultDateValue,
    isDisabled,
  }
}

export default useCashUnitForm
