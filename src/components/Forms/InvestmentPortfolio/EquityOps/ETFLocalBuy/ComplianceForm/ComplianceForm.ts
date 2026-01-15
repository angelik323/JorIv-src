import { ref, watch } from 'vue'

import { useUtils } from '@/composables'

const useComplianceForm = () => {
  const { calculateComplianceDates } = useUtils()

  const complianceFormRef = ref()

  const formData = ref({
    quantity_units: null as number | null,
    unit_value: null as number | null,
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
      () => formData.value.quantity_units,
      () => formData.value.unit_value,
      () => formData.value.value_real_commission,
    ],
    ([units, unitValue, valueCommission]) => {
      if (units && unitValue) {
        const total =
          Number(units) * Number(unitValue) + Number(valueCommission)
        formData.value.compliance_value = total.toFixed(2)
      } else {
        formData.value.compliance_value = null
      }
    }
  )

  watch(
    () => formData.value.unit_value,
    () => {
      const valueUnit = Number(formData.value.unit_value) || 0
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

  return {
    formData,
    complianceFormRef,
    setComplianceDate,
  }
}
export default useComplianceForm
