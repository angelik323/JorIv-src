import { useUtils } from '@/composables'
import { IOperationDataRegisterCancellationParticipationFics } from '@/interfaces/customs'
import { useInvestmentPortfolioResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const CURRENCY_CODE_DEFAULT = 'COP'

const createDefaultModels =
  (): IOperationDataRegisterCancellationParticipationFics => ({
    unit: null,
    portfolio_class: null,
    currency_id: null,
    currency_value: 0,
    operation_type_id: null,
    operation_type_description: '',
    paper_type_id: null,
    participation_number: null,
    title_id: null,
    participation_balance_pesos: 0,
    current_balance_pesos: 0,
    current_balance_units: null,
    cancellation_value: 0,
  })

const useOperationDataForm = () => {
  const { watchAndUpdateDescription } = useUtils()
  const models = ref<IOperationDataRegisterCancellationParticipationFics>(
    createDefaultModels()
  )
  const operationDataFormRef = ref()

  const {
    fic_participation_details,
    class_portfolio,
    operation_type,
    paper_type_participation,
    currency_local,
    manual_unit_value,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const selectOptions = computed(() => ({
    fic_participation_details: fic_participation_details.value,
    class_portfolio: class_portfolio.value,
    operation_type: operation_type.value,
    paper_type_participation: paper_type_participation.value,
    currency_local: currency_local.value,
  }))

  const defaultCurrency = computed(() => {
    const found = currency_local.value.find(
      (currency) => currency.code === CURRENCY_CODE_DEFAULT
    )
    handleChangeCurrency(found ? String(found.id) : null)
    return found ? String(found.id) : null
  })

  const descriptionBindings = [
    {
      sourceKey: 'operation_type_id',
      optionsKey: 'operation_type',
      descriptionKey: 'operation_type_description',
    },
  ] as const

  descriptionBindings.forEach(({ sourceKey, optionsKey, descriptionKey }) => {
    watchAndUpdateDescription(
      models,
      selectOptions,
      sourceKey,
      optionsKey,
      descriptionKey
    )
  })

  const handleChangeCurrency = (currencyId: number | string | null): void => {
    const selectedCurrency = selectOptions.value.currency_local.find(
      (currency) => String(currency.id) === String(currencyId)
    )

    if (selectedCurrency) {
      models.value.currency_id = selectedCurrency.id ?? null
      models.value.currency_value = Number(selectedCurrency.description) ?? 0
    } else {
      models.value.currency_id = null
      models.value.currency_value = 0
    }
  }

  const handleChangeUnit = (unitId: number): void => {
    if (unitId) {
      models.value.unit = unitId
      const selectedUnit = selectOptions.value.fic_participation_details.find(
        (unit) => unit.value === unitId
      )
      models.value.participation_number =
        selectedUnit?.participation_number ?? null
      models.value.participation_balance_pesos =
        parseInt(selectedUnit?.constitution_value ?? '') || 0
      models.value.cancellation_value =
        parseInt(selectedUnit?.constitution_value ?? '') || 0
      models.value.title_id = selectedUnit?.title_id ?? null
      models.value.current_balance_units =
        Math.round(
          (Number(selectedUnit?.constitution_value ?? '') /
            Number(manual_unit_value.value[0].label) +
            Number.EPSILON) *
            1000000
        ) / 1000000

      models.value.paper_type_id = selectedUnit?.paper_type_id ?? null
    } else {
      models.value.unit = null
      models.value.participation_number = null
    }
  }

  const handleChangeCancellationValue = (
    cancellationValue: number | string | null
  ): void => {
    models.value.cancellation_value = Number(cancellationValue) || 0
    if (models.value.cancellation_value > 0) {
      models.value.current_balance_pesos =
        Number(models.value.participation_balance_pesos) -
        Number(models.value.cancellation_value)
    }
  }

  const resetForm = (): void => {
    models.value = createDefaultModels()
    operationDataFormRef.value?.reset()
  }

  return {
    models,
    selectOptions,
    operationDataFormRef,
    defaultCurrency,
    resetForm,
    handleChangeUnit,
    handleChangeCurrency,
    handleChangeCancellationValue,
  }
}

export default useOperationDataForm
