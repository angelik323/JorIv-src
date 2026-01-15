import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRules } from '@/composables'
import { isEmptyOrZero } from '@/utils'

import { IBasicDataFormDescriptions, IDataOperationForeignCurrencyForm } from '@/interfaces/customs'
import { useInvestmentPortfolioResourceStore, useFicParticipationsAdditionStore, useResourceManagerStore } from '@/stores'

const OperationDataForm = (
  props: {
    data: IDataOperationForeignCurrencyForm | null
  },
  emit: Function
) => {
  const { is_required } = useRules()
  const { _getResources } = useResourceManagerStore('v1')

  const {
    fic_participation_value_foreign,
    class_portfolio,
    currency_foreign,
    operation_type,
    paper_type_participation,
    isin_code_mnemonics
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { _setDataParticipationCurrencyValue, _setDataCurrency, _setDataNumberDays } = useFicParticipationsAdditionStore('v1')

  const selectOptions = computed(() => ({
    fic_participation_value_foreign: fic_participation_value_foreign.value,
    class_portfolio: class_portfolio.value,
    currency_foreign: currency_foreign.value,
    operation_type: operation_type.value
  }))

  const operationDataFormRef = ref()
  
  const initialModelsValues: IDataOperationForeignCurrencyForm = {
    unit_id: 0,
    portfolio_class: '',
    paper_type_id: 0,
    currency_id: 0,
    isin_id: 0,
    operation_type_id: 0,
    number_days: 0,
    participation_number: 0,
    title_id: 0,
    origin_currency_balance: '',
    value_unit_currency_origin: '',
    current_balance_units: ''
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const initialDescriptionModelsValues: IBasicDataFormDescriptions = {
    operation_description: '',
    currency_label: '',
    isin_label: '',
    paper_type_label: ''
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
    async (newVal) => {
      const unit_selected = selectOptions.value.fic_participation_value_foreign.find((item) => item.value === newVal.unit_id)
      const currency_selected = currency_foreign.value.find((item) => item.value == paper_type_participation.value[0]?.currency_id)

      infoModels.value.operation_description = selectOptions.value.operation_type.find((item) => item.value === newVal.operation_type_id)?.label ?? ''
      infoModels.value.isin_label = isin_code_mnemonics.value.find((item) => item.value === unit_selected?.isin_id)?.isin_code || ''
      infoModels.value.paper_type_label = unit_selected?.paper_type_id ? paper_type_participation.value[0]?.label : ''
      infoModels.value.currency_label = unit_selected?.paper_type_id ? currency_selected?.code : ''
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.unit_id,
    async (newVal) => {
      const unit_selected = selectOptions.value.fic_participation_value_foreign.find((item) => item.value === newVal)

      if(unit_selected?.paper_type_id){
        await _getResources({
          investment_portfolio: [`paper_type_participation&filter[id]=${unit_selected?.paper_type_id}`],
        })
      }
      
      const currency_selected = currency_foreign.value.find((item) => item.value == paper_type_participation.value[0]?.currency_id)

      models.value.paper_type_id = unit_selected?.paper_type_id || 0
      models.value.currency_id = unit_selected?.paper_type_id ? (paper_type_participation.value[0]?.currency_id ?? 0) : 0
      infoModels.value.paper_type_label = unit_selected?.paper_type_id ? paper_type_participation.value[0]?.label : ''
      infoModels.value.currency_label = unit_selected?.paper_type_id ? currency_selected?.code : ''
      infoModels.value.isin_label = isin_code_mnemonics.value.find((item) => item.value === unit_selected?.isin_id)?.isin_code || ''
      models.value.isin_id = unit_selected?.isin_id || 0
      models.value.participation_number = unit_selected?.participation_number || 0
      models.value.title_id = unit_selected?.title_id || 0
      models.value.origin_currency_balance = unit_selected?.constitution_unit_number || ''

      _setDataParticipationCurrencyValue(Number(unit_selected?.currency_value) || 0)
      _setDataCurrency(
        currency_selected?.code || '',
        paper_type_participation.value[0]?.currency_id || 0,
        currency_selected?.coin_value || '',
        unit_selected?.constitution_value_origin_currency || 0,
        currency_selected?.currency_conversion || '0'
      )
    }
  )

  watch(
    () => models.value.number_days,
    (newVal) => {
      _setDataNumberDays(newVal)
    }
  )

  const resetForm = () => {
    models.value = {
      unit_id: 0,
      portfolio_class: '',
      paper_type_id: 0,
      currency_id: 0,
      isin_id: 0,
      operation_type_id: 0,
      number_days: 0,
      participation_number: 0,
      title_id: 0,
      origin_currency_balance: '',
      value_unit_currency_origin: '',
      current_balance_units: ''
    }

    infoModels.value = {
      operation_description: '',
      currency_label: '',
      isin_label: ''
    }

    operationDataFormRef.value?.reset()
  }

  return {
    operationDataFormRef,
    models,
    infoModels,
    selectOptions,

    is_required,
    resetForm
  }
}

export default OperationDataForm