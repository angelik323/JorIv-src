import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRules } from '@/composables'
import { isEmptyOrZero } from '@/utils'

import { IBasicDataForm, IBasicDataFormDescriptions } from '@/interfaces/customs'
import { useInvestmentPortfolioResourceStore, useFicParticipationsAdditionStore } from '@/stores'
import moment from 'moment'

const useInformationForm = (
  props: {
    data: IBasicDataForm | null
  },
  emit: Function
) => {
  const { is_required, valid_format_date } = useRules()

  const {
    investment_portfolio_code_local_currency,
    emitter,
    emitter_buyer,
    administrators_codes,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { _setDataEmitterId } = useFicParticipationsAdditionStore('v1')

  const selectOptions = computed(() => ({
    investment_portfolio: investment_portfolio_code_local_currency.value,
    emitter: emitter.value,
    emitter_buyer: emitter_buyer.value,
    administrators_codes: administrators_codes.value,
  }))

  const informationFormRef = ref()

  const initialModelsValues: IBasicDataForm = {
    investment_portfolio_id: 0,
    operation_date: moment().format('YYYY-MM-DD'),
    issuer_id: 0,
    counterparty_id: 0,
    administrator_id: 0
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const initialDescriptionModelsValues: IBasicDataFormDescriptions = {
    description: '',
    emitter_description: '',
    counterparty_description: '',
    administrator_description: '',
  }
  const infoModels = ref<typeof initialDescriptionModelsValues>({ ...initialDescriptionModelsValues })

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
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataEmitterId(0)
      } else {
        _setDataEmitterId(models.value.issuer_id)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    async (newVal) => {
      infoModels.value.description = selectOptions.value.investment_portfolio.find((item) => item.value === newVal.investment_portfolio_id)?.description ?? ''
      infoModels.value.emitter_description = selectOptions.value.emitter.find((item) => item.value === newVal.issuer_id)?.description ?? ''
      infoModels.value.counterparty_description = selectOptions.value.emitter_buyer.find((item) => item.value === newVal.counterparty_id)?.label ?? ''
      infoModels.value.administrator_description = selectOptions.value.administrators_codes.find((item) => item.value === newVal.administrator_id)?.description ?? ''
    },
    { immediate: true }
  )

  const resetForm = () => {
    models.value = {
      investment_portfolio_id: 0,
      operation_date: '',
      issuer_id: 0,
      counterparty_id: 0,
      administrator_id: 0
    }

    infoModels.value = {
      description: '',
      emitter_description: '',
      counterparty_description: '',
      administrator_description: '',
    }

    informationFormRef.value?.reset()
  }

  return {
    informationFormRef,
    models,
    infoModels,
    is_required,
    valid_format_date,

    selectOptions,
    resetForm,
  }
}

export default useInformationForm