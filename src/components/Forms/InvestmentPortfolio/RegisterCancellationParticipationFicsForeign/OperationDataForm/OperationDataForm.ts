import { useUtils } from '@/composables'
import { IOperationDataRegisterCancellationParticipationFicsForeign } from '@/interfaces/customs'
import {
  useInvestmentPortfolioResourceStore,
  useRegisterCancellationParticipationFicsForeignStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const createDefaultModels =
  (): IOperationDataRegisterCancellationParticipationFicsForeign => ({
    unit_id: null,
    portfolio_class: null,
    currency_id: null,
    currency_label: '',
    paper_type_id: null,
    paper_type_label: '',
    isin_id: null,
    isin_label: '',
    operation_type_id: null,
    operation_type_description: '',
    number_days: null,
    participation_number: null,
    balance_number_units: null,
    title_id: null,
    balance_participation_currency_origin: 0,
    cancellation_value_origin_currency: 0,
  })

const useOperationDataForm = () => {
  const { watchAndUpdateDescription } = useUtils()
  const { _getResources } = useResourceManagerStore('v1')

  const models =
    ref<IOperationDataRegisterCancellationParticipationFicsForeign>(
      createDefaultModels()
    )
  const operationDataFormRef = ref()

  const registerCancellationParticipationFicsForeignStore =
    useRegisterCancellationParticipationFicsForeignStore('v1')
  const { _setDataCurrency } = registerCancellationParticipationFicsForeignStore

  const {
    fic_participation_value_foreign,
    class_portfolio,
    currency_foreign,
    operation_type,
    paper_type_participation,
    isin_code_mnemonics,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const selectOptions = computed(() => ({
    fic_participation_details: fic_participation_value_foreign.value,
    class_portfolio: class_portfolio.value,
    operation_type: operation_type.value,
    paper_type_participation: paper_type_participation.value,
    currency_foreign: currency_foreign.value,
    isin_code_mnemonics: isin_code_mnemonics.value,
  }))

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

  const handleChangeUnit = async (unitId: number) => {
    if (unitId) {
      models.value.unit_id = unitId
      const selectedUnit = selectOptions.value.fic_participation_details.find(
        (unit) => unit.value === unitId
      )

      await _getResources({
        investment_portfolio: [
          `paper_type_participation&filter[id]=${selectedUnit?.paper_type_id}`,
        ],
      })

      const currency_selected = currency_foreign.value.find(
        (item) => item.value == paper_type_participation.value[0]?.currency_id
      )

      models.value.paper_type_id = selectedUnit?.paper_type_id ?? null
      models.value.currency_id =
        paper_type_participation.value[0]?.currency_id ?? null
      models.value.currency_label = currency_selected?.code || ''
      models.value.isin_label =
        isin_code_mnemonics.value.find(
          (item) => item.value === selectedUnit?.isin_id
        )?.isin_code || ''
      models.value.paper_type_label =
        paper_type_participation.value[0]?.label || ''
      models.value.isin_id = selectedUnit?.isin_id ?? null
      models.value.participation_number =
        selectedUnit?.participation_number ?? null
      models.value.title_id = selectedUnit?.title_id ?? null
      models.value.balance_participation_currency_origin =
        selectedUnit?.constitution_value_origin_currency || ''
      models.value.cancellation_value_origin_currency =
        selectedUnit?.constitution_value_origin_currency || 0
      models.value.balance_number_units =
        Number(selectedUnit?.constitution_unit_number) || 0

      _setDataCurrency(
        currency_selected?.code || '',
        paper_type_participation.value[0]?.currency_id || 0,
        currency_selected?.coin_value || '',
        currency_selected?.currency_conversion || '0',
        selectedUnit?.constitution_value_origin_currency || 0
      )
    } else {
      models.value.unit_id = null
      models.value.participation_number = null
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
    resetForm,
    handleChangeUnit,
  }
}

export default useOperationDataForm
