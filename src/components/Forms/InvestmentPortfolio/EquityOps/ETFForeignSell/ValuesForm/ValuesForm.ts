import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { useUtils } from '@/composables'

import { useInvestmentPortfolioResourceStore } from '@/stores'

const useValuesForm = () => {
  const { calculateComplianceDates } = useUtils()

  const { coins_exchange_traded_fund: coins } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const valuesFormRef = ref()

  const formData = ref({
    compliance_origin_currency: false,
    compliance_currency_id: null as string | number | null,
    origin_currency_id: null as string | number | null,
    compliance_currency_description: '',
    compliance_date: '',
    colocation_resources_date: '',
    value_negotiation_currency: 0,
    value_origin_currency: 0,
    value_operation_origin_currency: 0,
    value_spot_rate: 0,
    value_compliance_rate: null as number | null,
    factor_conversion: 1,
    value_compliance_spot_rate: null as number | null,
    gyre_compliance_local_currency: null as number | null,
    operation: '',
    operation_number_days: null as number | null,
    quantity_sell_units: 0,
    value_unit_origin_currency: 0,
    value_commission_origin_currency: 0,
  })

  const isSpot = computed(() => formData.value.operation === 'Spot')

  const getCoinById = (id: string | number | null) =>
    coins.value.find((c) => String(c.value) === String(id))

  const getCoinByCode = (code: string) =>
    coins.value.find((c) => c.code === code)

  const toNumber = (val: unknown, precision?: number) => {
    const num = Number(val ?? 0)
    return precision !== undefined ? parseFloat(num.toFixed(precision)) : num
  }

  const setComplianceDate = (operationDate: string, days: number | null) => {
    const result = calculateComplianceDates(operationDate, days ?? 0)
    if (result) {
      formData.value.compliance_date = result.compliance_date
      formData.value.colocation_resources_date =
        result.colocation_resources_date
    }
  }

  const calculateComplianceSpotRate = (
    spot: number,
    quantity: number,
    valueUnit: number,
    commission: number
  ) => {
    const roundedSpot = toNumber(spot, 6)
    return toNumber(roundedSpot * quantity * valueUnit + commission, 2)
  }

  const calculateOperationValue = (
    quantity: number,
    valueUnit: number,
    commission: number
  ) => toNumber(quantity * valueUnit + commission, 2)

  watch(
    [
      () => formData.value.operation,
      () => formData.value.operation_number_days,
    ],
    ([operation, days]) => {
      const today = moment().format('YYYY-MM-DD')
      if (operation === 'Spot') {
        setComplianceDate(today, 0)
      } else if (operation === 'De Contado' && days) {
        setComplianceDate(today, days)
      }
    },
    { immediate: true }
  )

  watch(
    [
      () => formData.value.compliance_origin_currency,
      () => formData.value.origin_currency_id,
    ],
    ([useOrigin, originId]) => {
      if (useOrigin) {
        const coin = getCoinById(originId)
        if (coin) {
          formData.value.compliance_currency_id = coin.value
          formData.value.compliance_currency_description = coin.label
        }
      } else {
        const copCoin = getCoinByCode('COP')
        if (copCoin) {
          formData.value.compliance_currency_id = copCoin.value
          formData.value.compliance_currency_description = copCoin.label
        }
      }
    },
    { immediate: true }
  )

  watch(
    [
      () => formData.value.value_spot_rate,
      () => formData.value.quantity_sell_units,
      () => formData.value.value_unit_origin_currency,
      () => formData.value.value_commission_origin_currency,
    ],
    ([spot, quantity, valueUnit, commission]) => {
      formData.value.value_compliance_spot_rate = calculateComplianceSpotRate(
        toNumber(spot),
        toNumber(quantity),
        toNumber(valueUnit),
        toNumber(commission)
      )
    },
    { immediate: true }
  )

  watch(
    [
      () => formData.value.quantity_sell_units,
      () => formData.value.value_unit_origin_currency,
      () => formData.value.value_commission_origin_currency,
    ],
    ([quantity, valueUnit, commission]) => {
      formData.value.value_operation_origin_currency = calculateOperationValue(
        toNumber(quantity),
        toNumber(valueUnit),
        toNumber(commission)
      )
    },
    { immediate: true }
  )

  watch(
    [
      () => formData.value.value_negotiation_currency,
      () => formData.value.origin_currency_id,
    ],
    ([negotiation, originId]) => {
      const selectedCoin = getCoinById(originId)
      const usdCoin = getCoinByCode('USD')

      if (selectedCoin && usdCoin) {
        formData.value.value_origin_currency = Number(selectedCoin.rate)

        const currencyValue = Number(selectedCoin.rate)
        const usdRate = Number(usdCoin.rate)

        if (selectedCoin.code !== 'USD') {
          if (currencyValue && usdRate) {
            formData.value.factor_conversion = parseFloat(
              (currencyValue / usdRate).toFixed(6)
            )
          } else {
            formData.value.factor_conversion = 1
          }
        }
      } else {
        formData.value.factor_conversion = 1
      }

      formData.value.gyre_compliance_local_currency = toNumber(
        toNumber(negotiation) *
          toNumber(formData.value.factor_conversion) *
          toNumber(formData.value.value_operation_origin_currency),
        2
      )
    },
    { immediate: true }
  )

  return {
    isSpot,
    formData,
    valuesFormRef,
    setComplianceDate,
  }
}

export default useValuesForm
