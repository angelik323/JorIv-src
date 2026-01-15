// vue - router - quasar
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Utils
import { isEmptyOrZero } from '@/utils'

// Interfeaces
import { IBillingPeriodInformationForm } from '@/interfaces/customs/settlement-commissions/BillingPeriodV2'
import { WriteActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'

const useBasicDataForm = (
  props: {
    action: WriteActionType
    data: IBillingPeriodInformationForm | null
  },
  emit: Function
) => {
  const { is_required } = useRules()

  const { business_trusts_value_is_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { periodicities } = storeToRefs(
    useSettlementCommissionsResourceStore('v1')
  )

  const formElementRef = ref()

  const initialModelsValues: IBillingPeriodInformationForm = {
    business_code: null,
    start_date: null,
    end_date: null,
    periodicity: null,
    other: null,

    period_code: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  // Sincroniza el modelo con la prop 'data'
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      // Evita bucle infinito
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    is_required,
    business_trusts_value_is_code,
    periodicities,
  }
}

export default useBasicDataForm
