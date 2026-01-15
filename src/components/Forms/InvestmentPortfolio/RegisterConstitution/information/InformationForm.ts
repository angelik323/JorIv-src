import { IRegisterConstitutionGeneric } from '@/interfaces/customs'
import {
  useInvestmentPortfolioResourceStore,
  useRegisterConstitutionFicStore,
} from '@/stores'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

export const useInformationForm = () => {
  const {
    investment_portfolio,
    administrators_codes,
    emitters,
    emitter_buyer_portfolio,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { _setDataInformationGeneric } = useRegisterConstitutionFicStore('v1')
  const { data_information_generic } = storeToRefs(
    useRegisterConstitutionFicStore('v1')
  )
  const investmentDescriptionRef = ref()
  const emmiterDescriptionRef = ref()
  const counterPartDescriptionRef = ref()
  const administratorDescriptionRef = ref()
  const models = ref<IRegisterConstitutionGeneric>({
    investment_portfolio_id: null,
    operation_date: new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    issuer_id: null,
    counterparty_id: null,
    administrator_id: null,
  })

  onMounted(() => {
    if (!data_information_generic.value) return

    models.value = {
      ...data_information_generic.value,
      operation_date: models.value.operation_date,
    }
  })
  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationGeneric(null)
      } else {
        _setDataInformationGeneric({
          investment_portfolio_id: models.value.investment_portfolio_id ?? null,
          operation_date:
            models.value.operation_date instanceof Date
              ? models.value.operation_date.toISOString().split('T')[0]
              : typeof models.value.operation_date === 'string'
              ? new Date(
                  models.value.operation_date.split('/').reverse().join('-')
                )
                  .toISOString()
                  .split('T')[0]
              : models.value.operation_date,
          issuer_id: models.value.issuer_id ?? null,
          counterparty_id: models.value.counterparty_id ?? null,
          administrator_id: models.value.administrator_id ?? null,
        })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.investment_portfolio_id,
    (newVal) => {
      if (!newVal) return
      const investment = investment_portfolio.value?.find(
        (item) => item.value === newVal
      )
      investmentDescriptionRef.value = investment?.description || ''
    }
  )

  watch(
    () => models.value.issuer_id,
    (newVal) => {
      if (!newVal) return
      const emitter = emitters.value?.find((item) => item.value === newVal)
      emmiterDescriptionRef.value = emitter?.description || ''
    }
  )

  watch(
    () => models.value.counterparty_id,
    (newVal) => {
      if (!newVal) return
      const emitterBuyer = emitter_buyer_portfolio.value?.find(
        (item) => item.value === newVal
      )
      counterPartDescriptionRef.value = emitterBuyer?.description || ''
    }
  )

  watch(
    () => models.value.administrator_id,
    (newVal) => {
      if (!newVal) return
      const adminCode = administrators_codes.value?.find(
        (item) => item.value === newVal
      )
      administratorDescriptionRef.value = adminCode?.description || ''
    }
  )

  return {
    models,
    investment_portfolio,
    administrators_codes,
    emitters,
    emitter_buyer_portfolio,
    investmentDescriptionRef,
    emmiterDescriptionRef,
    counterPartDescriptionRef,
    administratorDescriptionRef,
  }
}
