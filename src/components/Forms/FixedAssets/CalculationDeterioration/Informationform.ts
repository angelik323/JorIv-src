// vue
import { computed, ref, watch } from 'vue'

// interface
import { ActionType } from '@/interfaces/global'
import { ICalculationForm } from '@/interfaces/customs/fixed-assets/CalculationDeterioration'

// composable
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// stores
import { storeToRefs } from 'pinia'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useCalculationDeteriorationStore } from '@/stores/fixed-assets/calculation-deterioration'
import { useResourceManagerStore } from '@/stores'

const useInformationform = (
  props: {
    action: ActionType
    data?: ICalculationForm | null
  },

  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  // stores
  const {
    type,
    uge,
    business_trusts_uge_impairment,
    business_trusts_uge,
    business_trusts_type,
    business_trusts_subtypes,
    fixed_asset_values,
  } = storeToRefs(useFixedAssetsResourceStore('v1'))
  const { _getCalculation } = useCalculationDeteriorationStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  const models = ref<ICalculationForm>({
    id: null,
    code_calculation: null,
    business_trust_id: null,
    configuration_types_id: null,
    configuration_subtypes_id: null,
    asset_id: null,
    statuses_id: null,
    reason_justification: null,
    book_value: null,
    fair_value: null,
    acquisition_cost: null,

    estimated_sale_value: null,
    estimated_sale_cost: null,
    total_residual_value: null,

    total_cash_flows: null,
    number_of_periods: null,
    discount_rate: null,
    value_in_use: null,

    recoverable_amount: null,
    impairment_loss: null,
    impairment_percentage: null,

    code: null,
    type: null,
    subtype: null,
    currency: null,
    currency_deterioration: null,
    date_deterioration: null,

    residual_value: null,
    voucher: {
      id: null,
      code: null,
      registration_date: null,
      status: null,
    },
  })

  const calculationRef = ref()
  const inforcard = ref()

  const defaultDateValue = computed(() => {
    if (props.action === 'edit' && models.value.date_deterioration) {
      return models.value.date_deterioration
    }

    return new Date().toLocaleString('sv-SE')
  })

  const calculateValueInUse = () => {
    const flows = Number(models.value.total_cash_flows)
    const periods = Number(models.value.number_of_periods)
    const rate = Number(models.value.discount_rate) / 100
    const residual = Number(models.value.total_residual_value)

    if (!flows || !periods || !rate) {
      models.value.value_in_use = 0
      return
    }

    let valueUse = 0

    for (let t = 1; t <= periods; t++) {
      valueUse += flows / Math.pow(1 + rate, t)
    }

    valueUse += residual / Math.pow(1 + rate, periods)

    models.value.value_in_use = Math.max(valueUse, 0)
  }

  const calculateImpairment = async () => {
    const payload = {
      book_value: Number(models.value.book_value),
      fair_value: Number(models.value.fair_value),
      acquisition_cost: Number(models.value.acquisition_cost),
      estimated_sale_value: Number(models.value.estimated_sale_value),
      estimated_sale_cost: Number(models.value.estimated_sale_cost),
      total_cash_flows: Number(models.value.total_cash_flows),
      number_of_periods: Number(models.value.number_of_periods),
      discount_rate: Number(models.value.discount_rate),
    }

    const result = await _getCalculation(payload)

    if (result && result.success && result.data) {
      const calc = result.data

      models.value.recoverable_amount = calc.recoverable_amount
      models.value.impairment_loss = calc.impairment_loss
      models.value.impairment_percentage = calc.impairment_percentage

      if (calc.total_residual_value !== undefined) {
        models.value.total_residual_value = calc.total_residual_value
      }
      if (calc.value_in_use !== undefined) {
        models.value.value_in_use = calc.value_in_use
      }

      const existsDeterioration = calc.impairment_loss > 0

      return {
        type: existsDeterioration ? 'warning' : 'positive',
        message:
          result.message ||
          (existsDeterioration
            ? 'Se detectó deterioro en el activo'
            : 'No se detecta deterioro para el activo seleccionado'),
        caption: existsDeterioration
          ? `Deterioro: ${Math.abs(calc.impairment_percentage)}%`
          : undefined,
        position: 'top',
        timeout: 3000,
      }
    }
  }

  const calculatedResidualValue = computed(() => {
    const estimatedSaleValue = Number(models.value.estimated_sale_value)
    const estimatedSaleCost = Number(models.value.estimated_sale_cost)

    const residualValue = estimatedSaleValue - estimatedSaleCost

    return residualValue
  })

  const handleViewComprobante = (
    voucher_id: number | string | null | undefined
  ) => {
    if (voucher_id == null) return

    openMainLoader(true)

    goToURL('AccountingReceiptView', voucher_id)

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }
  const handleViewResume = (id: number | string | null | undefined) => {
    if (id == null) return

    openMainLoader(true)

    goToURL('RegisterRead', id)

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  watch(
    () => models.value.business_trust_id,

    async (businessId) => {
      if (!businessId) return

      await _getResources(
        { fixed_assets: ['business_trusts_uge_impairment'] },
        `business_trusts_uge_impairment&filter[business_trust_id]=${businessId}`
      )

      models.value.configuration_types_id = null
      models.value.configuration_subtypes_id = null
      models.value.asset_id = null
    }
  )

  watch(
    () => models.value.configuration_types_id,
    async (typeId) => {
      if (props.action === 'view') return
      if (!typeId) return

      await _getResources(
        { fixed_assets: ['business_trusts_type'] },
        `business_trusts_type&filter[configuration_type_id]=${typeId}`
      )

      models.value.configuration_subtypes_id = null
      models.value.asset_id = null
    }
  )

  watch(
    () => models.value.configuration_subtypes_id,
    async (subtypeId) => {
      if (props.action === 'view') return
      if (!subtypeId) return

      const f = models.value
      if (!f.business_trust_id || !f.configuration_types_id) return

      const query = `
      fixed_asset_values
      &filter[business_trust_id]=${f.business_trust_id}
      &filter[configuration_type_id]=${f.configuration_types_id}
      &filter[configuration_subtype_id]=${subtypeId}
    `.replace(/\s/g, '')
      await _getResources({ fixed_assets: ['fixed_asset_values'] }, query)
    }
  )

  watch(
    () => models.value.asset_id,
    (assetId) => {
      if (props.action === 'view') return
      if (!assetId) return

      const asset = fixed_asset_values.value.find((a) => a.id === assetId)
      if (!asset) return

      models.value.book_value =
        asset.cash_generating_unit?.initial_value ?? null

      models.value.acquisition_cost =
        asset.asset_transaction?.transaction_value ?? null

      models.value.total_cash_flows =
        asset.asset_transaction?.transaction_value ?? null
    }
  )

  // lifecycle hooks
  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,

    (val) => {
      if (val) Object.assign(models.value, val)
    },

    { immediate: true }
  )

  watch(
    () => [models.value.estimated_sale_value, models.value.estimated_sale_cost],
    () => {
      models.value.total_residual_value = calculatedResidualValue.value
    },
    { immediate: true }
  )

  watch(
    () => [
      models.value.total_cash_flows,
      models.value.number_of_periods,
      models.value.discount_rate,
      models.value.total_residual_value,
    ],
    () => {
      calculateValueInUse()
    }
  )

  return {
    models,
    calculationRef,
    defaultDateValue,
    type,
    uge,
    inforcard,
    business_trusts_uge_impairment,
    business_trusts_uge,
    business_trusts_type,
    business_trusts_subtypes,

    calculateValueInUse,
    calculateImpairment,

    handleViewComprobante,
    handleViewResume,
    fixed_asset_values,
  }
}

export default useInformationform
