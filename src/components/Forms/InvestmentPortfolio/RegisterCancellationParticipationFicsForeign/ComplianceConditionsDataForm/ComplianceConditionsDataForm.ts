import { useUtilsCalendarMethods } from '@/composables'
import { IComplianceConditionsDataRegisterCancellationParticipationFicsForeign } from '@/interfaces/customs'
import {
  useInvestmentPortfolioResourceStore,
  useRegisterCancellationParticipationFicsForeignStore,
} from '@/stores'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

const createDefaultModels =
  (): IComplianceConditionsDataRegisterCancellationParticipationFicsForeign => ({
    value_currency: 0,
    conversion_factor: 0,
    compliance_date: null,
    resource_placement_date: null,
    value_compliance_currency_origin: 0,
    local_currency_compliance_transfer: 0,
  })

const useComplianceConditionsDataForm = () => {
  const { isBusinessDay } = useUtilsCalendarMethods()

  const models =
    ref<IComplianceConditionsDataRegisterCancellationParticipationFicsForeign>(
      createDefaultModels()
    )
  const complianceConditionsDataFormRef = ref()

  const registerCancellationParticipationFicsForeignStore =
    useRegisterCancellationParticipationFicsForeignStore('v1')
  const {
    getOperationData,
    coin_value,
    currency_conversion,
    constitution_value_origin_currency,
    trm,
  } = storeToRefs(registerCancellationParticipationFicsForeignStore)

  const { currency_foreign } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const complianceCurrencyOrigin = computed(() => {
    return Number(
      (
        Number(constitution_value_origin_currency.value) *
        Number(currency_conversion.value)
      ).toFixed(2)
    )
  })

  const localCurrencyComplianceTransfer = computed(() => {
    const usdCoinValue = Number(
      currency_foreign.value.find((item) => item.code === 'USD')?.coin_value
    )

    const value = complianceCurrencyOrigin.value * usdCoinValue
    return Math.round((value + Number.EPSILON) * 100) / 100
  })

  const toSixDecimals = (value: number) => Number(value.toFixed(6))

  const addBusinessDays = (
    date: moment.Moment,
    days: number
  ): moment.Moment => {
    if (days <= 0) return date
    const next = date.clone().add(1, 'days')
    return isBusinessDay(next.format('YYYY-MM-DD'))
      ? addBusinessDays(next, days - 1)
      : addBusinessDays(next, days)
  }

  const conversionData = () => {
    if (trm.value === 'USD') {
      return 1
    }
    if (currency_conversion.value) {
      const result = Number(currency_conversion.value)
      return result
    } else {
      const usdCoinValue = Number(
        currency_foreign.value.find((item) => item.code === 'USD')?.coin_value
      )
      const result = Number(coin_value.value) / usdCoinValue

      return result
    }
  }

  watch(
    () => getOperationData.value,
    (operationData) => {
      if (operationData && operationData.number_days) {
        models.value = {
          value_currency:
            Math.round((Number(coin_value.value) + Number.EPSILON) * 100) / 100,
          conversion_factor: toSixDecimals(conversionData()),
          compliance_date: addBusinessDays(
            moment(),
            operationData.number_days
          ).format('YYYY-MM-DD'),
          resource_placement_date: addBusinessDays(
            moment(),
            operationData.number_days - 1
          ).format('YYYY-MM-DD'),
          value_compliance_currency_origin: complianceCurrencyOrigin.value,
          local_currency_compliance_transfer:
            localCurrencyComplianceTransfer.value,
        }
      }
    }
  )

  const resetForm = (): void => {
    models.value = createDefaultModels()
    complianceConditionsDataFormRef.value?.reset()
  }

  return { models, complianceConditionsDataFormRef, resetForm }
}

export default useComplianceConditionsDataForm
