import { ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'

import { useInvestmentPortfolioResourceStore } from '@/stores'

const useValuesForm = () => {
  const { coins_exchange_traded_fund: coins } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const valuesFormRef = ref()

  const formData = ref({
    origin_currency_id: null,
    origin_currency_description: '',
    value_unit_origin_currency: 0,
    value_commission_origin_currency: 0,
    value_total_origin_currency: 0,

    local_currency_id: 0,
    local_currency_description: 'COP',
    value_unit_local_currency: 0,
    value_commission_local_currency: 0,
    value_total_local_currency: 0,

    compliance_currency_id: null,
    compliance_currency_description: '',
    value_unit_compliance_currency: 0,
    value_commission_compliance_currency: 0,
    value_total_compliance_currency: 0,

    commission_base: '',
    commission_value: 0,
    quantity_units: 0,
    factor_conversion: 1,
    value_negociation_currency: 0,
  })

  const calculateOriginValues = () => {
    const valueUnit = Number(formData.value.value_unit_origin_currency) || 0
    const commissionValue = Number(formData.value.commission_value) || 0
    const quantityUnits = Number(formData.value.quantity_units) || 0

    const valueOperation = quantityUnits * valueUnit

    let commission = 0
    if (formData.value.commission_base === 'Valor Operación') {
      commission = valueOperation * (commissionValue / 100)
    } else if (formData.value.commission_base === 'Valor Manual') {
      commission = commissionValue
    } else if (formData.value.commission_base === 'Número Unidades') {
      commission = commissionValue * valueUnit
    }

    formData.value.value_commission_origin_currency = parseFloat(
      commission.toFixed(2)
    )
    formData.value.value_total_origin_currency = parseFloat(
      (valueOperation + commission).toFixed(2)
    )
  }

  const calculateLocalValues = () => {
    const quantityUnits = Number(formData.value.quantity_units) || 0
    const commissionValue = Number(formData.value.commission_value) || 0
    const valueUnitOrigin =
      Number(formData.value.value_unit_origin_currency) || 0
    const factorConversion = Number(formData.value.factor_conversion) || 1
    const negotiationRate =
      Number(formData.value.value_negociation_currency) || 1

    const originCoin = coins.value.find(
      (coin) => coin.value === String(formData.value.origin_currency_id)
    )

    let valueOperationUSD = 0
    let commissionUSD = 0

    if (originCoin?.code === 'USD') {
      valueOperationUSD = quantityUnits * valueUnitOrigin

      if (formData.value.commission_base === 'Valor Operación') {
        commissionUSD = valueOperationUSD * (commissionValue / 100)
      } else if (formData.value.commission_base === 'Valor Manual') {
        commissionUSD = commissionValue
      } else if (formData.value.commission_base === 'Número Unidades') {
        commissionUSD = commissionValue * valueUnitOrigin
      }
    } else {
      const unitUSD = valueUnitOrigin * factorConversion
      valueOperationUSD = quantityUnits * unitUSD

      if (formData.value.commission_base === 'Valor Operación') {
        commissionUSD = valueOperationUSD * (commissionValue / 100)
      } else if (formData.value.commission_base === 'Valor Manual') {
        commissionUSD = commissionValue * factorConversion
      } else if (formData.value.commission_base === 'Número Unidades') {
        commissionUSD = commissionValue * unitUSD
      }
    }

    const valueOperationCOP = valueOperationUSD * negotiationRate
    const commissionCOP = commissionUSD * negotiationRate
    const totalCOP = (valueOperationUSD + commissionUSD) * negotiationRate

    formData.value.value_unit_local_currency = parseFloat(
      (valueOperationCOP / (quantityUnits || 1)).toFixed(2)
    )
    formData.value.value_commission_local_currency = parseFloat(
      commissionCOP.toFixed(2)
    )
    formData.value.value_total_local_currency = parseFloat(totalCOP.toFixed(2))
  }

  watchEffect(() => {
    if (coins.value?.length) {
      const copCoin = coins.value.find((coin) => coin.code === 'COP')
      if (copCoin) {
        formData.value.local_currency_id = Number(copCoin.value)
        formData.value.local_currency_description = copCoin.label
      }
    }
  })

  watchEffect(() => {
    const localId = Number(formData.value.local_currency_id)
    const complianceId = Number(formData.value.compliance_currency_id)

    const originCoin = coins.value.find(
      (coin) => coin.value === String(formData.value.origin_currency_id)
    )

    if (complianceId === localId) {
      formData.value.value_unit_compliance_currency =
        formData.value.value_unit_local_currency
      formData.value.value_commission_compliance_currency =
        formData.value.value_commission_local_currency
      formData.value.value_total_compliance_currency =
        formData.value.value_total_local_currency
    } else {
      if (originCoin?.code !== 'USD') {
        const factorConversion = Number(formData.value.factor_conversion) || 1

        formData.value.value_unit_compliance_currency =
          formData.value.value_unit_origin_currency * factorConversion
        formData.value.value_commission_compliance_currency =
          formData.value.value_commission_origin_currency * factorConversion
        formData.value.value_total_compliance_currency =
          formData.value.value_total_origin_currency * factorConversion
      } else {
        formData.value.value_unit_compliance_currency =
          formData.value.value_unit_origin_currency
        formData.value.value_commission_compliance_currency =
          formData.value.value_commission_origin_currency
        formData.value.value_total_compliance_currency =
          formData.value.value_total_origin_currency
      }
    }
  })

  watch(
    [
      () => formData.value.origin_currency_id,
      () => formData.value.local_currency_id,
      () => formData.value.compliance_currency_id,
    ],
    ([newOriginId, newLocalId, newComplianceId]) => {
      formData.value.origin_currency_description =
        coins.value.find((coin) => coin.value === String(newOriginId))?.label ??
        ''
      formData.value.local_currency_description =
        coins.value.find((coin) => coin.value === String(newLocalId))?.label ??
        'COP'
      formData.value.compliance_currency_description =
        coins.value.find((coin) => coin.value === String(newComplianceId))
          ?.label ?? ''
    }
  )

  watch(
    [
      () => formData.value.value_unit_origin_currency,
      () => formData.value.commission_value,
      () => formData.value.quantity_units,
    ],
    calculateOriginValues,
    { immediate: true }
  )

  watch(
    [
      () => formData.value.value_unit_local_currency,
      () => formData.value.commission_base,
      () => formData.value.commission_value,
      () => formData.value.quantity_units,
    ],
    calculateLocalValues,
    { immediate: true }
  )

  watch(
    () => formData.value.value_unit_origin_currency,
    (valueUnitOrigin) => {
      formData.value.value_unit_local_currency =
        valueUnitOrigin * formData.value.value_negociation_currency
    }
  )

  return {
    formData,
    valuesFormRef,
  }
}

export default useValuesForm
