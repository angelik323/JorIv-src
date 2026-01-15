// vue - pinia
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

// stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

// interfaces
import { IBusinessCxPTrustBusiness } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { ActionType } from '@/interfaces/global'

// composables
import { useCalendarRules } from '@/composables'
import { useUtils } from '@/composables/useUtils'
const isEmptyOrZero = useUtils().isEmptyOrZero

const useCxPTrustBusiness = (
  props: {
    action: ActionType
    data?: IBusinessCxPTrustBusiness | null
  },
  emit: Function
) => {
  // imports
  const { accounts_payable_closing, payment_concept_structure } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { only_last_day_month } = useCalendarRules()

  // computed
  const isLoadingData = ref<boolean>(true)

  const models = ref<IBusinessCxPTrustBusiness>({
    closing: null,
    last_closing_date: null,
    validity: null,
    account_structure_id: null,
    account_structure_purpose: null,
  })

  const cxp_trust_business_form_ref = ref()

  // init
  const _setValueModel = () => {
    if (props.data) {
      models.value = { ...props.data }
    }
  }

  // lifecycle
  onMounted(async () => {
    isLoadingData.value = true
    await _setValueModel()
    isLoadingData.value = false
  })

  // watchs
  watch(
    () => models.value,
    (newVal) => {
      if (isEmptyOrZero(newVal)) {
        emit('update:models', null)
      } else {
        emit('update:models', newVal)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.closing,
    () => {
      if (isLoadingData.value) return
      models.value.last_closing_date = null
      cxp_trust_business_form_ref.value?.resetValidation()
    },
    { deep: true }
  )

  watch(
    () => models.value.last_closing_date,
    (newDate) => {
      if (isLoadingData.value) return

      if (!newDate) {
        models.value.validity = null
        return
      }

      const [yearStr, monthStr, dayStr] = String(newDate).split('-')
      const year = Number(yearStr)
      const month = Number(monthStr)
      const day = Number(dayStr)

      if ([year, month, day].some(isNaN)) {
        models.value.validity = null
        return
      }

      const isLastDayOfYear = month === 12 && day === 31
      models.value.validity = String(isLastDayOfYear ? year + 1 : year)
    },
    { deep: true }
  )

  return {
    models,
    cxp_trust_business_form_ref,
    accounts_payable_closing,
    payment_concept_structure,

    only_last_day_month,
  }
}

export default useCxPTrustBusiness
