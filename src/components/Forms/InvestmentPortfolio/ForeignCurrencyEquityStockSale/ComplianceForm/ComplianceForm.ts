import { computed, ref, watch } from 'vue'

import { IComplianceForeignFormData } from '@/interfaces/customs'
import { storeToRefs } from 'pinia'
import {
  useForeignCurrencyEquityStockSaleStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'
import { useAlert, useUtilsCalendarMethods } from '@/composables'

// Constants for better maintainability
const COMMISSION_TYPES = {
  PERCENTAGE: 'porcentaje',
  FIXED_VALUE: 'valor fijo',
} as const

const NEGOTIATION_TYPES = {
  SPOT_OPERATION: 'Operación Spot',
} as const

const USD_CURRENCY_CODE = 'USD'
const LOCAL_CURRENCY_CODE = 'COP'

/**
 * Factory function to create default form data
 */
const createDefaultFormData = (): IComplianceForeignFormData => ({
  origin_currency: null,
  origin_currency_value: 0,
  available_shares_quantity: 0,
  sale_shares_quantity: 0,
  sale_unit_value_currency: '',
  commission_value_currency_origin: 0,
  complies_in_origin_currency: false,
  compliance_currency: null,
  compliance_date: '',
  resource_placement_date: '',
  negotiation_currency_value: 0.0,
  operation_value_origin_currency: 0,
  spot_rate_value: 0,
  compliance_spot_rate_value: 0,
  conversion_factor: 0,
  local_currency_compliance_amount: 0,
})

const useComplianceForm = () => {
  const {
    currency_foreign,
    available_titles_by_emitter_currency_foreign,
    currency_local,
    currency_in_valoration_files,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')

  const { getBasicData, getEmitterData } = storeToRefs(
    useForeignCurrencyEquityStockSaleStore('v1')
  )
  const { showAlert } = useAlert()

  const { isBusinessDay } = useUtilsCalendarMethods()

  const complianceFormRef = ref()
  const complianceCurrencyLabel = ref('')

  const formData = ref<IComplianceForeignFormData>(createDefaultFormData())

  /**
   * Resets the form to its default state
   */
  const resetForm = (): void => {
    formData.value = createDefaultFormData()
    complianceFormRef.value?.reset()
  }

  const selectOptions = computed(() => ({
    coins: currency_foreign.value,
  }))

  /**
   * Checks if the commission base matches the given name (case-insensitive)
   */
  const isCommissionBaseByName = (name: string): boolean => {
    return (
      getEmitterData.value.commission_base.toLowerCase() === name.toLowerCase()
    )
  }

  /**
   * Calculates commission value based on type (percentage or fixed value)
   */
  const calculateCommissionValue = (unitValue: number): number => {
    if (!getBasicData.value.commission) {
      return 0
    }

    const commissionValue =
      Number(getEmitterData.value.commission_value.toFixed(6)) || 0

    if (isCommissionBaseByName(COMMISSION_TYPES.PERCENTAGE)) {
      return unitValue * (commissionValue / 100)
    } else if (isCommissionBaseByName(COMMISSION_TYPES.FIXED_VALUE)) {
      return unitValue + commissionValue
    }

    return 0
  }

  /**
   * Calculates the operation value in origin currency
   */
  const calculateOperationValue = (
    saleQuantity: number,
    unitValue: number,
    commission: number
  ): number => {
    return Number((saleQuantity * unitValue + commission).toFixed(2))
  }

  /**
   * Calculates conversion factor for non-USD currencies
   */
  const calculateConversionFactor = (
    operationValue: number,
    negotiationCurrencyValue: number,
    originCurrencyValue: number
  ): number => {
    if (originCurrencyValue === 0) return 0
    return Number(
      (
        operationValue *
        (negotiationCurrencyValue / originCurrencyValue)
      ).toFixed(6)
    )
  }

  /**
   * Calculates spot rate values for spot operations
   */
  const calculateSpotRateValues = (
    operationValue: number,
    spotRate: number
  ): { complianceSpotValue: number } => {
    const complianceSpotValue = Number((operationValue * spotRate).toFixed(2))
    return {
      complianceSpotValue,
    }
  }

  const commissionValueComputed = computed(() => {
    const unitValue = Number(formData.value.sale_unit_value_currency) || 0
    return calculateCommissionValue(unitValue)
  })

  /**
   * Watch for changes in sale quantity and unit value to update calculations
   */
  watch(
    () => [
      formData.value.sale_shares_quantity,
      formData.value.sale_unit_value_currency,
      formData.value.negotiation_currency_value,
    ],
    () => {
      const coinSelected = currency_foreign.value.find(
        (coin) => coin.value === formData.value.origin_currency
      )
      const saleQuantity = Number(formData.value.sale_shares_quantity) || 0
      const unitValue = Number(formData.value.sale_unit_value_currency) || 0
      const commission = commissionValueComputed.value

      // Update commission and operation value
      formData.value.commission_value_currency_origin = commission
      formData.value.operation_value_origin_currency = calculateOperationValue(
        saleQuantity,
        unitValue,
        commission
      )
      formData.value.local_currency_compliance_amount = Number(
        (
          formData.value.operation_value_origin_currency *
          formData.value.negotiation_currency_value
        ).toFixed(2)
      )

      // Calculate conversion factor for non-USD currencies
      if (coinSelected?.code !== USD_CURRENCY_CODE) {
        if (currency_in_valoration_files.value.length > 0) {
          const rateValoration = currency_in_valoration_files.value.find(
            (item) => item.to_currency_id === formData.value.origin_currency
          )?.rate
          formData.value.conversion_factor = rateValoration
            ? Number(
                (
                  formData.value.operation_value_origin_currency *
                  Number(rateValoration)
                ).toFixed(6)
              )
            : 0
        } else {
          formData.value.conversion_factor = calculateConversionFactor(
            formData.value.operation_value_origin_currency,
            formData.value.negotiation_currency_value,
            formData.value.origin_currency_value
          )
        }
      }

      // Calculate spot rate values for spot operations
      if (isOperationSpot.value) {
        const { complianceSpotValue } = calculateSpotRateValues(
          formData.value.operation_value_origin_currency,
          formData.value.spot_rate_value
        )

        formData.value.compliance_spot_rate_value = complianceSpotValue
      }
    }
  )

  /**
   * Watch for changes in compliance currency preferences
   */
  watch(
    () => [
      formData.value.complies_in_origin_currency,
      formData.value.origin_currency,
    ],
    () => {
      if (formData.value.complies_in_origin_currency) {
        const originCurrencyValue = currency_foreign.value.find(
          (coin) => coin.value === formData.value.origin_currency
        )
        formData.value.compliance_currency =
          Number(originCurrencyValue?.value) || null
        complianceCurrencyLabel.value = originCurrencyValue?.label || ''
      } else {
        formData.value.compliance_currency =
          Number(currency_local.value[0]?.value) || null
        complianceCurrencyLabel.value = LOCAL_CURRENCY_CODE
      }
    }
  )

  watch(
    () => currency_local.value,
    (currencyCOP) => {
      formData.value.compliance_currency = Number(currencyCOP[0]?.value) || null
      complianceCurrencyLabel.value = LOCAL_CURRENCY_CODE
    }
  )

  watch(
    () => [getBasicData.value, getEmitterData.value],
    () => {
      resetForm()
    }
  )

  /**
   * Determines if the current operation is a spot operation
   */
  const isOperationSpot = computed((): boolean => {
    return getBasicData.value.negotiation === NEGOTIATION_TYPES.SPOT_OPERATION
  })

  /**
   * Handles the update of the origin currency selector
   * @param value - The selected currency value
   */
  const handleUpdateSelectorOriginCurrency = async (
    value: number
  ): Promise<void> => {
    // Reset form and set new currency
    resetForm()
    formData.value.origin_currency = value

    // Find and set coin value
    const selectedCoin = selectOptions.value.coins.find(
      (coin) => coin.value === value
    )
    const coinValue = Number(selectedCoin?.coin_value) || 0
    formData.value.origin_currency_value = coinValue

    // Set spot operation values if applicable
    if (isOperationSpot.value) {
      formData.value.negotiation_currency_value = coinValue
      formData.value.spot_rate_value = coinValue
    }

    const emitterId = Number(getEmitterData.value.emitter_id)

    // Fetch available titles and currency valoration data
    const resourceKeys = ['available_titles_by_emitter_currency_foreign']
    await Promise.all([
      _getResources(
        { investment_portfolio: resourceKeys },
        `filter[emitter_id]=${emitterId}&filter[action_class]=${getEmitterData.value.class_action}`
      ),
      _getResources(
        { investment_portfolio: ['currency_in_valoration_files'] },
        `filter[to_currency_id]=${value}`
      ),
    ])

    // Set available shares quantity
    const availableTitle =
      available_titles_by_emitter_currency_foreign.value.find(
        (item) =>
          item.issuers_counterparty_id === emitterId &&
          item.currency_id === Number(value)
      )

    formData.value.available_shares_quantity =
      Number(availableTitle?.available_balance) || 0

    if (formData.value.available_shares_quantity === 0) {
      showAlert(
        'No hay acciones disponibles para la venta con la moneda seleccionada',
        'warning'
      )
    }
  }

  return {
    // Reactive data
    formData,
    complianceFormRef,
    complianceCurrencyLabel,

    // Computed properties
    selectOptions,
    isOperationSpot,

    // Methods
    resetForm,
    handleUpdateSelectorOriginCurrency,

    // Utilities from composables
    isBusinessDay,
  }
}
export default useComplianceForm
