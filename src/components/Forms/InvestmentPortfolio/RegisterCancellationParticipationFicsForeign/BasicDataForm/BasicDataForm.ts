import { useUtils } from '@/composables'
import { IBasicDataRegisterCancellationParticipationFicsForeign } from '@/interfaces/customs'
import { useInvestmentPortfolioResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const createDefaultModels =
  (): IBasicDataRegisterCancellationParticipationFicsForeign => ({
    investment_portfolio_id: null,
    investment_portfolio_description: '',
    operation_date: new Date().toISOString().substring(0, 10),
    issuer_id: null,
    issuer_description: '',
    counterparty_id: null,
    counterparty_description: '',
    administrator_id: null,
    administrator_description: '',
  })

const useBasicDataForm = () => {
  const { watchAndUpdateDescription } = useUtils()

  const models = ref<IBasicDataRegisterCancellationParticipationFicsForeign>(
    createDefaultModels()
  )
  const basicDataFormRef = ref()

  const {
    investment_portfolio,
    emitters,
    emitter_buyer,
    administrators_codes,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const selectOptions = computed(() => ({
    investment_portfolio: investment_portfolio.value,
    emitters: emitters.value,
    emitter_buyer: emitter_buyer.value,
    administrators_codes: administrators_codes.value,
  }))

  const descriptionBindings = [
    {
      sourceKey: 'investment_portfolio_id',
      optionsKey: 'investment_portfolio',
      descriptionKey: 'investment_portfolio_description',
    },
    {
      sourceKey: 'issuer_id',
      optionsKey: 'emitters',
      descriptionKey: 'issuer_description',
    },
    {
      sourceKey: 'counterparty_id',
      optionsKey: 'emitter_buyer',
      descriptionKey: 'counterparty_description',
    },
    {
      sourceKey: 'administrator_id',
      optionsKey: 'administrators_codes',
      descriptionKey: 'administrator_description',
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

  const handleChangeEmitter = async (
    issuerId: number | null
  ): Promise<void> => {
    models.value.issuer_id = issuerId ?? null
  }

  const resetForm = (): void => {
    models.value = createDefaultModels()
    basicDataFormRef.value?.reset()
  }

  return {
    models,
    selectOptions,
    basicDataFormRef,
    resetForm,
    handleChangeEmitter,
  }
}

export default useBasicDataForm
