// vue - pinia
import { computed, onMounted, ref, watch } from 'vue'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { ITrustBusinessGeneralDates } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import { useRules, useUtils, useCalendarRules } from '@/composables'
const { isEmptyOrZero } = useUtils()
const { only_after, only_until } = useCalendarRules()

const useGeneralDates = (
  props: {
    action: ActionType
    data?: ITrustBusinessGeneralDates | null
  },
  emit: Function
) => {
  // rules
  const {
    is_required,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
    date_before_or_equal_to_the_specific_date,
  } = useRules()

  // computed
  const is_edit = computed(() => props.action === 'edit')
  const currentDate = computed(() => new Date().toISOString().slice(0, 10))

  const models = ref<ITrustBusinessGeneralDates>({
    filing_date_sfc: null,
    start_date: null,
    end_date: null,
    start_date_commission: null,
    has_extend: false,
    extend_date: null,
  })

  // ref & init
  const general_dates_ref = ref()

  const _setValueModel = () => {
    if (props.data) {
      models.value = { ...props.data }
    }
  }

  // lifecycles
  onMounted(async () => {
    await _setValueModel()
  })

  // watchs
  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        emit('update:models', null)
      } else {
        emit('update:models', models.value)
      }
    },
    {
      deep: true,
    }
  )

  watch(
    () => models.value.end_date,
    () => {
      general_dates_ref.value?.resetValidation()
    },
    {
      deep: true,
    }
  )

  watch(
    () => props.data,
    async () => {
      await _setValueModel()
    },
    { deep: true }
  )

  return {
    models,
    general_dates_ref,
    is_edit,
    currentDate,

    // rules
    is_required,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
    date_before_or_equal_to_the_specific_date,
    only_after,
    only_until,
  }
}

export default useGeneralDates
