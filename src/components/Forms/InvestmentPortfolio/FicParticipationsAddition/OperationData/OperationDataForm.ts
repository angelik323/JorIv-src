import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRules } from '@/composables'
import { WriteActionType } from '@/interfaces/global'
import { isEmptyOrZero } from '@/utils'

import { IBasicDataFormDescriptions, IOperationDataForm } from '@/interfaces/customs'
import { useInvestmentPortfolioResourceStore, useFicParticipationsAdditionStore, useResourceManagerStore } from '@/stores'

const OperationDataForm = (
  props: {
    action: WriteActionType
    data: IOperationDataForm | null
  },
  emit: Function
) => {
  const { is_required } = useRules()

  const {
    fic_participation_details,
    class_portfolio,
    currency_local,
    operation_type,
    paper_type_participation,
    manual_unit_value,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  
  const { emitter_id } = useFicParticipationsAdditionStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  const keys = [`manual_unit_value&filter[emitter_id]=${emitter_id}`]

  const selectOptions = computed(() => ({
    fic_participation_details: fic_participation_details.value,
    class_portfolio: class_portfolio.value,
    currency_local: currency_local.value,
    operation_type: operation_type.value,
    paper_type_participation: paper_type_participation.value,
  }))

  const operationDataFormRef = ref()
  
  const initialModelsValues: IOperationDataForm = {
    unit: 0,
    portfolio_class: '',
    currency_id: 0,
    operation_type_id: 0,
    paper_type_id: 0,
    participation_number: 0,
    title_id: 0,
    participation_balance_pesos: 0,
    unit_value_previous_day: 0,
    current_balance_units: 0,
    addition_value: 0,
    current_balance_pesos: 0,
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const initialDescriptionModelsValues: IBasicDataFormDescriptions = {
    operation_description: '',
    currency_value: '',
    paper_type_label: '',
  }
  const infoModels = ref<typeof initialDescriptionModelsValues>({ ...initialDescriptionModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  onMounted(async () => {
    await _getResources({
      investment_portfolio: keys,
    })
  })

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
      infoModels.value.operation_description = selectOptions.value.operation_type.find((item) => item.value === newVal.operation_type_id)?.label ?? ''
      infoModels.value.currency_value = selectOptions.value.currency_local.find((item) => item.value === newVal.currency_id)?.description ?? ''
      infoModels.value.paper_type_label = selectOptions.value.paper_type_participation.find((item) => item.value === newVal.paper_type_id)?.label ?? ''
    }
  )

  watch(
    () => models.value.unit,
    async (newVal) => {
      const unit_selected = selectOptions.value.fic_participation_details.find((item) => item.value === newVal)
      models.value.participation_number = unit_selected?.participation_number || 0
      models.value.title_id = unit_selected?.title_id || 0
      models.value.participation_balance_pesos = parseInt(unit_selected?.constitution_value ?? '') || 0
      models.value.unit_value_previous_day = parseFloat(manual_unit_value.value[0].label) || 0
      models.value.current_balance_units = Math.round((Number(unit_selected?.constitution_value ?? '') / Number(manual_unit_value.value[0].label) + Number.EPSILON) * 1000000) / 1000000
      models.value.paper_type_id = unit_selected?.paper_type_id || 0
    }
  )

  watch(
    () => models.value.addition_value,
    async (newVal) => {
      models.value.current_balance_pesos = (Number(models.value.participation_balance_pesos) + Number(newVal)) || 0
    }
  )

  const resetForm = () => {
    models.value = {
      unit: 0,
      portfolio_class: '',
      currency_id: 0,
      operation_type_id: 0,
      paper_type_id: 0,
      participation_number: 0,
      title_id: 0,
      participation_balance_pesos: 0,
      unit_value_previous_day: 0,
      current_balance_units: 0,
      addition_value: 0,
      current_balance_pesos: 0,
    }

    infoModels.value = {
      operation_description: '',
      currency_value: '',
    }

    operationDataFormRef.value?.reset()
  }

  return {
    operationDataFormRef,
    models,
    infoModels,
    selectOptions,
    is_required,
    resetForm,
  }
}

export default OperationDataForm