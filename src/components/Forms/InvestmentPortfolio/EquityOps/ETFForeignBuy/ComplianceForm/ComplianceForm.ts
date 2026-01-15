import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import moment from 'moment'

import { useUtils } from '@/composables'

import { useInvestmentPortfolioResourceStore } from '@/stores'

const useComplianceForm = () => {
  const { calculateComplianceDates } = useUtils()

  const { coins_exchange_traded_fund: coins } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const complianceFormRef = ref()

  const formData = ref({
    quantity_units: null,
    origin_currency_id: null,
    value_origin_currency: '',
    factor_conversion: null as number | null,
    compliance_currency_id: null,
    value_negotiation_currency: null,
    compliance_date: moment().format('YYYY-MM-DD'),
    colocation_resources_date: '',
  })

  const setComplianceDate = (operationDate: string, days: number | null) => {
    const result = calculateComplianceDates(operationDate, days ?? 0)
    if (result) {
      formData.value.compliance_date = result.compliance_date
      formData.value.colocation_resources_date =
        result.colocation_resources_date
    }
  }

  watch(
    () => formData.value.origin_currency_id,
    (newId) => {
      const selected = coins.value.find((coin) => coin.value === String(newId))
      const usdCoin = coins.value.find((coin) => coin.code === 'USD')

      if (selected && usdCoin) {
        formData.value.value_origin_currency = selected.rate.toString()
        const currencyValue = Number(selected.rate)
        const usdRate = Number(usdCoin.rate)

        if (selected.code !== 'USD') {
          if (currencyValue && usdRate) {
            formData.value.factor_conversion = parseFloat(
              (currencyValue / usdRate).toFixed(2)
            )
          }
        } else {
          formData.value.factor_conversion = 1
        }
      } else {
        formData.value.value_origin_currency = ''
        formData.value.factor_conversion = 1
      }
    }
  )

  return {
    coins,
    formData,
    complianceFormRef,
    setComplianceDate,
  }
}
export default useComplianceForm
