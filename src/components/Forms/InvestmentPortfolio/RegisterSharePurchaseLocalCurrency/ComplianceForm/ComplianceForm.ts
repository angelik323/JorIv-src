import { ref, watch } from 'vue'

import { IComplianceFormData } from '@/interfaces/customs'
import { useRegisterSharePurchaseLocalCurrencyStore } from '@/stores'
import { storeToRefs } from 'pinia'

const useComplianceForm = () => {
  const { percentageOrFixedValue } = storeToRefs(
    useRegisterSharePurchaseLocalCurrencyStore('v1')
  )
  const complianceFormRef = ref()

  const formData = ref<IComplianceFormData>({
    quantity_units: 0,
    unit_value: null,
    purchase_value: null,
    commission_value: null,
    total_operation_value: null,
    commission_type: '%',
    commission_percentage: null,
    commission_fixed_value: null,
    has_commision: false,
  })

  const resetForm = () => {
    formData.value = {
      quantity_units: null,
      unit_value: null,
      purchase_value: null,
      commission_value: null,
      total_operation_value: null,
      commission_type: '%',
      commission_percentage: null,
      commission_fixed_value: null,
      has_commision: false,
    }
  }

  watch(
    () => [
      formData.value.quantity_units,
      formData.value.unit_value,
      formData.value.commission_value,
      formData.value.has_commision,
      formData.value.commission_type,
      percentageOrFixedValue.value,
    ],
    () => {
      const qty = Number(formData.value.quantity_units) || 0
      const unit = Number(formData.value.unit_value) || 0

      const purchase = qty * unit
      formData.value.purchase_value = Math.round(purchase * 100) / 100

      if (formData.value.has_commision) {
        if (formData.value.commission_type === '%') {
          formData.value.commission_value =
            Math.round(
              ((formData.value.purchase_value *
                (Number(percentageOrFixedValue.value) || 0)) /
                100) *
                100
            ) / 100
        } else {
          formData.value.commission_value =
            Number(percentageOrFixedValue.value) || 0
        }
      } else {
        formData.value.commission_value = 0
      }
      formData.value.total_operation_value =
        formData.value.purchase_value + formData.value.commission_value
    },
    { immediate: true }
  )

  return {
    formData,
    resetForm,
    complianceFormRef,
  }
}
export default useComplianceForm
