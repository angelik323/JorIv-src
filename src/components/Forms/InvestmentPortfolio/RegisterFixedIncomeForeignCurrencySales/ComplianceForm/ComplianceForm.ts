import { ref, computed, watch } from 'vue'
import { QForm } from 'quasar'
import { storeToRefs } from 'pinia'
import {
  useInvestmentPortfolioResourceStore,
  useRegisterFixedIncomeForeignCurrencySaleStore,
} from '@/stores'
import { USD_CURRENCY_CODE, COP_CURRENCY_CODE } from '@/constants'
import { ICurrencyForPaperTypeResource } from '@/interfaces/customs'
import moment from 'moment'

const useComplianceForm = () => {
  const complianceFormRef = ref<QForm | null>(null)

  const disableWeekends = (date: string) => {
    const day = new Date(date).getDay()
    return day !== 0 && day !== 6
  }

  const resources = useInvestmentPortfolioResourceStore('v1')

  const {
    currencyDescription,
    paperTypeId,
    numberDays,
    negotiation,
    valoration_trm,
    currencyValue,
  } = storeToRefs(useRegisterFixedIncomeForeignCurrencySaleStore('v1'))

  const { currency_local, currency_for_paper_type, coins } =
    storeToRefs(resources)

  const usingProviderFactor = ref(false)

  const dolar = coins.value.find((c) =>
    c.code?.toUpperCase().includes(USD_CURRENCY_CODE)
  )

  const dolarValue = dolar?.coin_value

  const formData = ref({
    operation_type: 'Operacion Spot' as 'Operacion Spot' | 'Operacion Contado',
    operation_date: '' as string,
    number_days: undefined as number | undefined,
    instrument_currency: '' as string,
    instrument_currency_id: null as number | null,
    fulfill_in_origin: true as boolean | null,
    settlement_currency: currencyDescription.value as string,
    negotiation_currency_value: 0 as number,
    settlement_date: '' as string,
    funding_placement_date: '' as string,
    settlement_origin_value: 0 as number,
    spot_rate_value: 0 as number,
    spot_rate_compliance_value: 0 as number,
    conversion_factor: undefined as number | undefined,
    giro_local_currency: 0 as number,
    purchase_value_origin: 0 as number,
  })

  watch(
    () => valoration_trm.value,
    (val) => {
      if (val !== null) {
        formData.value.spot_rate_value = Number(val) || 0
      } else {
        formData.value.spot_rate_value = 0
      }
    },
    { immediate: true }
  )

  watch(
    [() => formData.value.fulfill_in_origin, () => currencyDescription.value],
    ([fulfill]) => {
      if (fulfill) {
        formData.value.settlement_currency = currencyDescription.value || ''
        const match = currency_for_paper_type.value.find(
          (c) => Number(c.paper_type_id) === Number(paperTypeId.value)
        )
        if (match) {
          formData.value.instrument_currency_id = match.currency_id
        }
      } else {
        const cop = (currency_local.value ?? []).find(
          (c) =>
            c.label.includes(COP_CURRENCY_CODE) ||
            c.description?.includes(COP_CURRENCY_CODE)
        )
        formData.value.settlement_currency = cop
          ? String(cop.label)
          : COP_CURRENCY_CODE
        formData.value.instrument_currency_id = cop ? Number(cop.value) : null
      }
    },
    { immediate: true }
  )

  watch(
    [
      () => formData.value.purchase_value_origin,
      () => formData.value.negotiation_currency_value,
    ],
    ([purchase, negotiation]) => {
      const result = Number(purchase) * Number(negotiation)
      const v = Number.isFinite(result) ? Number(result.toFixed(2)) : 0
      formData.value.settlement_origin_value = v
      formData.value.giro_local_currency = v
    }
  )

  watch(
    [
      () => formData.value.purchase_value_origin,
      () => formData.value.spot_rate_value,
    ],
    ([purchase, spot]) => {
      const res = Number(purchase) * Number(spot)
      formData.value.spot_rate_compliance_value = Number(res.toFixed(2))
    }
  )

  watch(
    [
      () => formData.value.settlement_origin_value,
      () => formData.value.spot_rate_compliance_value,
      () => formData.value.instrument_currency_id,
    ],
    async () => {
      const factorConversionOfCurrency = coins.value.find(
        (item) =>
          item.code!.toLowerCase() === currencyDescription.value?.toLowerCase()
      )
      if (
        factorConversionOfCurrency &&
        factorConversionOfCurrency.currency_conversion !== null
      ) {
        formData.value.conversion_factor =
          factorConversionOfCurrency.currency_conversion
        return
      } else {
        usingProviderFactor.value = false
        const fallback = Number(currencyValue.value) / Number(dolarValue)
        formData.value.conversion_factor = fallback
          ? Number(fallback.toFixed(6))
          : undefined
      }
    }
  )

  watch(
    [
      () => currencyValue.value,
      () => usingProviderFactor.value,
      () => formData.value.settlement_origin_value,
    ],
    ([currencyValue, fromProvider]) => {
      if (fromProvider) return
      const factorConversionOfCurrency = coins.value.find(
        (item) =>
          item.code!.toLowerCase() === currencyDescription.value?.toLowerCase()
      )
      if (
        factorConversionOfCurrency &&
        factorConversionOfCurrency.currency_conversion !== null
      ) {
        formData.value.conversion_factor =
          factorConversionOfCurrency.currency_conversion
        return
      } else {
        const factor = Number(currencyValue) / Number(dolarValue)
        formData.value.conversion_factor = factor
          ? Number(factor.toFixed(6))
          : undefined
      }
    }
  )

  watch(
    () => numberDays.value,
    (newVal) => {
      if (negotiation.value === 'Operacion Spot') {
        formData.value.settlement_date = new Date().toISOString().split('T')[0]
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (yesterday.getDay() === 0) {
          yesterday.setDate(yesterday.getDate() - 2)
        } else if (yesterday.getDay() === 6) {
          yesterday.setDate(yesterday.getDate() - 1)
        }
        formData.value.funding_placement_date = yesterday
          .toISOString()
          .split('T')[0]
      } else {
        const settlementDate = moment().add(newVal, 'days')
        if (settlementDate.day() === 0) {
          settlementDate.add(1, 'days')
        } else if (settlementDate.day() === 6) {
          settlementDate.add(2, 'days')
        }

        formData.value.settlement_date = settlementDate.format('YYYY-MM-DD')

        const fundingDate = moment(settlementDate)
        if (fundingDate.day() === 1) {
          fundingDate.subtract(3, 'days')
        } else {
          fundingDate.subtract(1, 'days')
        }

        formData.value.funding_placement_date = fundingDate.format('YYYY-MM-DD')
      }
    },
    { immediate: true }
  )

  const setInstrumentCurrency = (code: string, id?: number | null) => {
    formData.value.instrument_currency = code || ''
    formData.value.instrument_currency_id =
      id !== undefined
        ? (id as number | null)
        : formData.value.instrument_currency_id
  }

  const setOperationContext = (args: {
    operation_type?: 'Operacion Spot' | 'Operacion Contado'
    operation_date?: string
    number_days?: number
  }) => {
    if (args.operation_type) formData.value.operation_type = args.operation_type
    if (args.operation_date) formData.value.operation_date = args.operation_date
    if (args.number_days !== undefined)
      formData.value.number_days = Number(args.number_days)
  }

  const setPurchaseValueOrigin = (value: number) => {
    formData.value.purchase_value_origin = Number(value) || 0
  }
  const setNegotiationCurrencyValue = (v: number) => {
    formData.value.negotiation_currency_value = Number(v) || 0
  }
  const setSpotRateValue = (v: number) => {
    formData.value.spot_rate_value = Number(v) || 0
  }

  const getValues = () => {
    let currencyId: number | null = formData.value.instrument_currency_id

    if (!formData.value.fulfill_in_origin) {
      const cop = currency_local.value.find((c) =>
        c.label.startsWith(COP_CURRENCY_CODE)
      )
      currencyId = cop ? Number(cop.value) : null
    }

    return {
      negotiation: formData.value.operation_type,
      complies_origin_currency: formData.value.fulfill_in_origin,
      complies_currency_id: currencyId,
      currency_value_negotiation: formData.value.negotiation_currency_value,
      placement_resource_date: formData.value.funding_placement_date,
      conversion_factor: formData.value.conversion_factor,
      purchase_value_origin: formData.value.purchase_value_origin,
      settlement_origin_value: formData.value.settlement_origin_value,
      spot_rate_value: formData.value.spot_rate_value,
      spot_rate_compliance_value: formData.value.spot_rate_compliance_value,
      giro_local_currency: formData.value.giro_local_currency,
      days_count: formData.value.number_days || undefined,
    }
  }

  const validateForm = async (): Promise<boolean> => {
    return true
  }

  const resetForm = () => {
    usingProviderFactor.value = false
    formData.value = {
      ...formData.value,
      fulfill_in_origin: true,
      settlement_currency: formData.value.instrument_currency || '',
      negotiation_currency_value: 0,
      settlement_date: '',
      funding_placement_date: '',
      settlement_origin_value: 0,
      spot_rate_value: 0,
      spot_rate_compliance_value: 0,
      conversion_factor: undefined,
      giro_local_currency: 0,
      purchase_value_origin: 0,
    }
  }

  const settlementCurrencyOptions = computed(() => {
    if (formData.value.fulfill_in_origin) {
      const match = (
        currency_for_paper_type.value ?? ([] as ICurrencyForPaperTypeResource[])
      ).find(
        (c) => Number(c.id) === Number(formData.value.instrument_currency_id)
      )
      return match ? [{ label: match.code, value: match.id }] : []
    }

    const cop = currency_local.value.find(
      (c) =>
        c.label.includes(COP_CURRENCY_CODE) ||
        c.description?.includes(COP_CURRENCY_CODE)
    )
    return cop ? [{ label: cop.label, value: cop.value }] : []
  })

  return {
    complianceFormRef,
    formData,
    usingProviderFactor,
    settlementCurrencyOptions,
    disableWeekends,
    setInstrumentCurrency,
    setOperationContext,
    setPurchaseValueOrigin,
    setNegotiationCurrencyValue,
    setSpotRateValue,
    getValues,
    validateForm,
    resetForm,
  }
}

export default useComplianceForm
