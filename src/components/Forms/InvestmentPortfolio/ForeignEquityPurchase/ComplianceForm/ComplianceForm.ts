import { ref, watch } from 'vue'
import moment from 'moment'

import { IComplianceFormForeign } from '@/interfaces/customs'
import { storeToRefs } from 'pinia'
import {
  useForeignEquityPurchaseStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'
import { USD_CURRENCY_CODE } from '@/constants'

const LOCAL_CURRENCY_CODE = 'COP'

const useComplianceForm = () => {
  const complianceFormRef = ref()

  const { percentageOrFixedValue, currencyId, numberDays } = storeToRefs(
    useForeignEquityPurchaseStore('v1')
  )

  const { currency_foreign } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const formData = ref<IComplianceFormForeign>({
    quantity_units: null,
    unit_value_currency_origin: null,
    complies_origin_currency: false,
    purchase_value: null,
    commission_value: null,
    total_operation_value: null,
    has_commission: true,
    commission_type: undefined,
    commission_percentage: null,
    commission_fixed_value: null,
    currency_negotiation_value: null,
    placement_resources_date: moment().format('YYYY-MM-DD'),
    spot_rate_value: 0,
    conversion_factor: null,
    complies_origin_currency_value: null,
    local_compliance_value: null,
    compliance_spot_value: null,
    operation_type: 'contado',
    negotiation: false,
    compliance_date: null,
  })

  const resetForm = () => {
    formData.value = {
      quantity_units: null,
      unit_value_currency_origin: null,
      complies_origin_currency: false,
      purchase_value: null,
      commission_value: null,
      total_operation_value: null,
      has_commission: true,
      commission_type: undefined,
      commission_percentage: null,
      commission_fixed_value: null,
      currency_negotiation_value: null,
      placement_resources_date: moment().format('YYYY-MM-DD'),
      spot_rate_value: 0,
      conversion_factor: null,
      complies_origin_currency_value: null,
      local_compliance_value: null,
      compliance_spot_value: null,
      operation_type: 'contado',
      compliance_currency: null,
      negotiation: false,
      compliance_date: null,
    }
  }

  const setNegotiation = (type: 'contado' | 'spot') => {
    formData.value.operation_type = type
  }

  watch(
    () => [
      formData.value.quantity_units,
      formData.value.unit_value_currency_origin,
      formData.value.currency_negotiation_value,
      formData.value.spot_rate_value,
      formData.value.commission_value,
      formData.value.commission_type,
    ],
    () => {
      const qty = Number(formData.value.quantity_units) || 0
      const unit = Number(formData.value.unit_value_currency_origin) || 0

      // 1. Valor compra moneda origen
      const purchase = qty * unit
      formData.value.purchase_value = Math.round(purchase * 100) / 100
      // 2. Comisión
      if (formData.value.has_commission) {
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

      // 3. Valor total operación
      formData.value.total_operation_value =
        Math.round(
          (formData.value.purchase_value + formData.value.commission_value) *
            100
        ) / 100

      // 4. Valor cumplimiento moneda origen
      formData.value.complies_origin_currency_value =
        formData.value.total_operation_value
    },
    { immediate: true }
  )

  watch(
    () => [formData.value.complies_origin_currency],
    () => {
      if (formData.value.complies_origin_currency) {
        const selectedCurrency = currency_foreign.value.find(
          (c) => c.value === currencyId.value
        )
        formData.value.compliance_currency = selectedCurrency
          ? selectedCurrency.label
          : null
      } else {
        formData.value.compliance_currency = LOCAL_CURRENCY_CODE
      }
    }
  )

  watch(
    () => [
      formData.value.total_operation_value,
      formData.value.quantity_units,
      formData.value.unit_value_currency_origin,
      formData.value.currency_negotiation_value,
      currencyId.value,
      numberDays.value,
    ],
    () => {
      const selectedCurrency = currency_foreign.value.find(
        (c) => c.value === currencyId.value
      )
      if (!formData.value.negotiation) {
        if (selectedCurrency) {
          formData.value.compliance_spot_value =
            Number(selectedCurrency.coin_value) *
            (formData.value.total_operation_value ?? 0)
        }
        formData.value.currency_negotiation_value = Number(
          Number(selectedCurrency!.coin_value).toFixed(2)
        )
        formData.value.spot_rate_value = Number(selectedCurrency!.coin_value)
        const dateCompliance = moment()
        formData.value.compliance_date = dateCompliance.format('YYYY-MM-DD')
      } else {
        formData.value.local_compliance_value = Number(
          (
            Number(formData.value.conversion_factor) *
            Number(formData.value.complies_origin_currency_value) *
            Number(formData.value.currency_negotiation_value)
          ).toFixed(2)
        )

        // Calendario de cumplimiento
        let dateCompliance = moment()
        const days = numberDays.value
        if (days !== null && days !== undefined && Number(days) !== 0) {
          dateCompliance = moment().add(Number(days), 'days')
        }
        if (dateCompliance.day() === 0) {
          dateCompliance.add(1, 'days')
        } else if (dateCompliance.day() === 6) {
          dateCompliance.add(2, 'days')
        }
        formData.value.compliance_date = dateCompliance.format('YYYY-MM-DD')

        const dateResources = moment(dateCompliance)
        if (dateResources.day() === 1) {
          dateResources.subtract(3, 'days')
        } else {
          dateResources.subtract(1, 'days')
        }
        formData.value.placement_resources_date =
          dateResources.format('YYYY-MM-DD')
      }
    }
  )

  watch(
    () => currencyId.value,
    () => {
      const selectedCurrency = currency_foreign.value.find(
        (c) => c.value === currencyId.value
      )
      const isUsd = selectedCurrency?.code?.toUpperCase() === USD_CURRENCY_CODE
      if (isUsd) {
        formData.value.conversion_factor = 1
      } else {
        const currencyValue = Number(selectedCurrency!.coin_value)
        const dolar = currency_foreign.value.find(
          (c) => c.code && c.code.toUpperCase() === USD_CURRENCY_CODE
        )
        const dolarValue = Number(dolar!.coin_value)

        if (currencyValue > 3) {
          formData.value.conversion_factor = Number(
            (currencyValue / dolarValue).toFixed(6)
          )
        } else {
          formData.value.conversion_factor = Number(currencyValue.toFixed(6))
        }
      }
    }
  )

  watch(
    () => formData.value.compliance_date,
    (newDate) => {
      if (!newDate) return

      const dateCompliance = moment(newDate, 'YYYY-MM-DD')

      const dateResources = moment(dateCompliance).subtract(1, 'days')

      if (dateResources.day() === 6) {
        dateResources.subtract(1, 'days')
      } else if (dateResources.day() === 0) {
        dateResources.subtract(2, 'days')
      }

      formData.value.placement_resources_date =
        dateResources.format('YYYY-MM-DD')
    }
  )

  watch(
    () => numberDays.value,
    () => {
      let dateCompliance = moment()
      const days = numberDays.value
      if (days !== null && days !== undefined && Number(days) !== 0) {
        dateCompliance = moment().add(Number(days), 'days')
      }
      if (dateCompliance.day() === 0) {
        dateCompliance.add(1, 'days')
      } else if (dateCompliance.day() === 6) {
        dateCompliance.add(2, 'days')
      }
      formData.value.compliance_date = dateCompliance.format('YYYY-MM-DD')

      const dateResources = moment(dateCompliance)
      if (dateResources.day() === 1) {
        dateResources.subtract(3, 'days')
      } else {
        dateResources.subtract(1, 'days')
      }
      formData.value.placement_resources_date =
        dateResources.format('YYYY-MM-DD')
    }
  )

  return {
    formData,
    resetForm,
    setNegotiation,
    complianceFormRef,
    LOCAL_CURRENCY_CODE,
  }
}
export default useComplianceForm
