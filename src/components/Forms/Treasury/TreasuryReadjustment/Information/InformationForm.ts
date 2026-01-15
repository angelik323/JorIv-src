import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRules, useUtils } from '@/composables'

import { ITreasureReadjustmentForm } from '@/interfaces/customs'
import { useTreasuryResourceStore, useResourceManagerStore } from '@/stores'

const useInformationForm = (
  props: {
    data: ITreasureReadjustmentForm | null
  },
  emit: Function
) => {
  const { _getResources } = useResourceManagerStore('v1')

  const { is_required, valid_format_date } = useRules()
  const { isEmptyOrZero } = useUtils()

  const {
    business_trusts_egreso,
    business_bank_accounts_authorization,
    banks_by_banks_accounts,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const informationFormRef = ref()

  const selectOptions = computed(() => ({
    from_business_id: business_trusts_egreso.value,
    to_business_id: business_trusts_egreso.value,
    from_bank_id: banks_by_banks_accounts.value,
    to_bank_id: banks_by_banks_accounts.value,
    from_account_id: business_bank_accounts_authorization.value,
    to_account_id: business_bank_accounts_authorization.value,
  }))

  const initialModelsValues: ITreasureReadjustmentForm = {
    from_business_id: 0,
    to_business_id: 0,
    from_bank_id: 0,
    to_bank_id: 0,
    from_account_id: 0,
    to_account_id: 0,
    start_date: '',
    end_date: '',
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const initialModelsLabels = {
    from_business: '',
    to_business: '',
    from_bank: '',
    to_bank: '',
    from_account: '',
    to_account: '',
  }
  const modelsLabel = ref<typeof initialModelsLabels>({
    ...initialModelsLabels,
  })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

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
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    models,
    (newVal) => {
      modelsLabel.value.from_business =
        selectOptions.value.from_business_id.find(
          (item) => item.value == newVal.from_business_id
        )?.name || ''
      modelsLabel.value.to_business =
        selectOptions.value.to_business_id.find(
          (item) => item.value == newVal.to_business_id
        )?.name || ''
      modelsLabel.value.from_bank =
        selectOptions.value.from_bank_id.find(
          (item) => item.value == newVal.from_bank_id
        )?.label || ''
      modelsLabel.value.to_bank =
        selectOptions.value.to_bank_id.find(
          (item) => item.value == newVal.to_bank_id
        )?.label || ''
      modelsLabel.value.from_account =
        selectOptions.value.from_account_id.find(
          (item) => item.value == newVal.from_account_id
        )?.label || ''
      modelsLabel.value.to_account =
        selectOptions.value.to_account_id.find(
          (item) => item.value == newVal.to_account_id
        )?.label || ''
    },
    { deep: true }
  )

  watch(
    () => models.value.to_business_id,
    async () => {
      const bank_keys = {
        treasury: ['business_bank_accounts_authorization'],
      }

      const banks_filter = `business_from_id=${models.value.from_business_id}&business_to_id=${models.value.to_business_id}`

      if (
        models.value.from_business_id != 0 &&
        models.value.to_business_id != 0
      ) {
        await _getResources(bank_keys, banks_filter, 'v2')
      }
    }
  )

  const resetForm = () => {
    informationFormRef.value?.reset()
  }

  const holidays = ref<string[]>([])

  const handlerHolidays = async (year: number) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  onMounted(async () => {
    handlerHolidays(new Date().getFullYear())
  })

  return {
    informationFormRef,
    models,
    modelsLabel,
    holidays,
    selectOptions,

    is_required,
    valid_format_date,
    handlerHolidays,
    useUtils,
    resetForm,
  }
}

export default useInformationForm
