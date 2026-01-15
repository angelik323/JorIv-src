import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useUtils } from '@/composables'

import { useInvestmentPortfolioResourceStore } from '@/stores'

const useComplianceForm = () => {
  const { calculateComplianceDates } = useUtils()

  const { available_title_for_sell_exchange_traded_fund: available_title } =
    storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const complianceFormRef = ref()

  const formData = ref({
    title_id: null as number | null,
    quantity_units: null as number | null,
    unit_value: null as number | null,
    value_unit_sell: null as number | null,
    quantity_sell_units: null as number | null,
    compliance_value: null as string | null,
    value_real_commission: null as number | null,
    compliance_date: '',
    commission_base: '',
    commission_value: null as number | null,
  })

  const setComplianceDate = (operationDate: string, days: number | null) => {
    const result = calculateComplianceDates(operationDate, days ?? 0)
    if (result) {
      formData.value.compliance_date = result.compliance_date
    }
  }

  watch(
    [
      () => formData.value.quantity_sell_units,
      () => formData.value.value_unit_sell,
      () => formData.value.value_real_commission,
    ],
    ([sellUnits, valueUnitSell, valueRealCommission]) => {
      if (sellUnits && valueUnitSell) {
        const total =
          Number(sellUnits) * Number(valueUnitSell) +
          Number(valueRealCommission)
        formData.value.compliance_value = total.toFixed(2)
      } else {
        formData.value.compliance_value = null
      }
    }
  )

  watch(
    () => formData.value.value_unit_sell,
    () => {
      const valueUnit = Number(formData.value.value_unit_sell) || 0
      const commissionPercent = Number(formData.value.commission_value) || 0
      const quantityUnits = Number(formData.value.quantity_units) || 0

      let valueOperation = 0
      let commissionCompliance = 0

      if (formData.value.commission_base === 'Valor Operación') {
        valueOperation = quantityUnits * valueUnit
        commissionCompliance = valueOperation * (commissionPercent / 100)
      } else if (formData.value.commission_base === 'Número Unidades')
        commissionCompliance = commissionPercent * valueUnit
      else if (formData.value.commission_base === 'Valor Manual')
        commissionCompliance = commissionPercent

      formData.value.value_real_commission = parseFloat(
        (commissionCompliance || 0).toFixed(2)
      )
    }
  )

  watch(
    () => formData.value.title_id,
    (newId) => {
      const selectedOption = available_title.value.find(
        (item) => item.value === newId
      )

      const units = selectedOption ? Number(selectedOption.description) : 0

      formData.value.quantity_units = units
      formData.value.quantity_sell_units = units
    }
  )

  return {
    formData,
    available_title,
    complianceFormRef,
    setComplianceDate,
  }
}
export default useComplianceForm
