import { ref, computed, watch } from 'vue'
import { QForm, QTable } from 'quasar'
import { useUtils } from '@/composables'
import {
  useInvestmentPortfolioResourceStore,
  useRegisterFixedIncomeForeignCurrencyStore,
} from '@/stores'
import { ICashflow, IIrrFlowForeignRequest } from '@/interfaces/customs'
import { storeToRefs } from 'pinia'
import moment from 'moment'

const useComplianceForm = () => {
  const complianceFormRef = ref<QForm | null>(null)
  const utils = useUtils()

  const disableWeekends = (date: string) => {
    const day = new Date(date).getDay()
    return day !== 0 && day !== 6
  }

  const resources = useInvestmentPortfolioResourceStore('v1')

  const { currency_for_paper_type, coins } = storeToRefs(resources)

  const { currencyDescription, numberDays, operationType, currencyValue } =
    storeToRefs(useRegisterFixedIncomeForeignCurrencyStore('v1'))

  const formData = ref({
    operation_type: 'Operacion Spot' as 'Operacion Spot' | 'Operacion Contado',
    instrument_currency: currencyDescription.value as string,
    settlement_currency: '' as string,
    fulfill_in_origin: true as boolean | null,
    negotiation_currency_value: 0 as number,
    settlement_date: '' as string,
    funding_placement_date: '' as string,
    settlement_origin_value: 0 as number,
    spot_rate_value: 0 as number,
    spot_rate_compliance_value: 0 as number,
    settlement_spot_value: undefined as number | undefined,
    conversion_factor: undefined as number | undefined,
    giro_local_currency: 0 as number,
    flows: [] as { date: string; interest: number; capital: number }[],
    tir_purchase: undefined as number | undefined,
    purchase_value_origin: 0 as number,
    operation_date: '' as string,
    number_days: undefined as number | undefined,
  })

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: {
      __key: string
      __index: number
      date: string
      interest: number
      capital: number
    }[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Flujos de cumplimiento',
    loading: false,
    columns: [
      {
        name: 'index',
        label: '#',
        align: 'left',
        field: '__index',
        sortable: false,
      },
      {
        name: 'date',
        label: 'Fecha',
        align: 'left',
        field: 'date',
        sortable: false,
      },
      {
        name: 'interest',
        label: 'Interés',
        align: 'right',
        field: 'interest',
        sortable: false,
      },
      {
        name: 'capital',
        label: 'Capital',
        align: 'right',
        field: 'capital',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const rows = computed(() =>
    (formData.value.flows ?? []).map((f, idx) => ({
      __key: `${f.date}-${idx}`,
      __index: idx + 1,
      ...f,
    }))
  )

  const displayTir = computed(() => {
    const v = formData.value.tir_purchase
    return typeof v === 'number' && Number.isFinite(v) ? v : null
  })

  watch(
    () => formData.value.fulfill_in_origin,
    (val) => {
      formData.value.settlement_currency = val
        ? currencyDescription.value ?? '-'
        : 'COP'
    }
  )

  watch(
    [
      () => formData.value.purchase_value_origin,
      () => formData.value.negotiation_currency_value,
    ],
    ([purchase, negotiation]) => {
      const result = Number(purchase) * Number(negotiation)
      formData.value.settlement_origin_value = Number(result.toFixed(2))
      formData.value.giro_local_currency = Number(result.toFixed(2))
    }
  )

  watch(
    [
      () => formData.value.purchase_value_origin,
      () => formData.value.spot_rate_value,
      () => formData.value.operation_type,
      () => formData.value.instrument_currency,
      () => formData.value.settlement_currency,
    ],
    ([purchase, spot, opType]) => {
      if (opType === 'Operacion Spot') {
        const result = Number(purchase) * Number(spot)
        formData.value.spot_rate_compliance_value = Number(result.toFixed(2))
      } else {
        formData.value.spot_rate_compliance_value = 0
      }
    }
  )

  watch(
    [
      () => formData.value.operation_type,
      () => formData.value.operation_date,
      () => formData.value.number_days,
    ],
    () => {
      const opType = formData.value.operation_type
      const opDate = formData.value.operation_date
      const days = Number(formData.value.number_days ?? 0)
      if (!opDate) return
      const date = new Date(opDate)
      if (opType === 'Operacion Spot') {
        formData.value.settlement_date = date.toISOString().split('T')[0]
      } else if (opType === 'Operacion Contado' && days > 0) {
        date.setDate(date.getDate() + days)
        while (date.getDay() === 0 || date.getDay() === 6) {
          date.setDate(date.getDate() + 1)
        }
        formData.value.settlement_date = date.toISOString().split('T')[0]
      }
    },
    { immediate: true }
  )

  watch(
    [
      () => currencyValue.value,
      () => formData.value.spot_rate_compliance_value,
    ],
    () => {
      const dolarValue = currency_for_paper_type.value.find(
        (item) => item.currency_code?.toLowerCase() === 'usd'
      )

      const factorConversionOfCurrency = coins.value.find(
        (item) =>
          item.label.toLowerCase() === currencyDescription.value?.toLowerCase()
      )
      if (
        factorConversionOfCurrency &&
        factorConversionOfCurrency.currency_conversion !== null
      ) {
        formData.value.conversion_factor =
          factorConversionOfCurrency.currency_conversion
        return
      }
      formData.value.conversion_factor = Number(
        (Number(currencyValue.value) / Number(dolarValue!.value)).toFixed(6)
      )
    }
  )

  //Fechas dependientes de number_days y operation_type
  watch(
    () => [numberDays.value],
    ([val]) => {
      if (operationType.value === 'Operacion Spot') {
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
        const settlementDate = moment().add(val, 'days')
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

  watch(
    () => currencyDescription.value,
    (newValue) => {
      formData.value.settlement_currency = newValue ?? ''
    }
  )

  const setFlows = (
    flows: { date: string; interest: number; capital: number }[] = []
  ) => {
    formData.value.flows = Array.isArray(flows) ? flows : []
    tableProps.value.rows = rows.value
  }

  const setTirPurchase = (tir?: number | null) => {
    formData.value.tir_purchase =
      typeof tir === 'number' && Number.isFinite(tir) ? tir : undefined
  }

  const setNegotiationCurrencyValue = (v: number) => {
    formData.value.negotiation_currency_value = Number(v) || 0
  }

  const setSpotRateValue = (v: number) => {
    formData.value.spot_rate_value = Number(v) || 0
  }

  const resetForm = () => {
    formData.value.flows = []
    formData.value.tir_purchase = undefined
    tableProps.value.rows = []
    formData.value = {
      ...formData.value,
    }
  }

  const getValues = () => ({
    operation_type: formData.value.operation_type,
    instrument_currency: formData.value.instrument_currency,
    settlement_currency: formData.value.settlement_currency,
    fulfill_in_origin: formData.value.fulfill_in_origin,
    negotiation_currency_value: formData.value.negotiation_currency_value,
    settlement_date: formData.value.settlement_date,
    funding_placement_date: formData.value.funding_placement_date,
    settlement_origin_value: formData.value.settlement_origin_value,
    spot_rate_value: formData.value.spot_rate_value,
    spot_rate_compliance_value: formData.value.spot_rate_compliance_value,
    settlement_spot_value: formData.value.settlement_spot_value,
    conversion_factor: formData.value.conversion_factor,
    giro_local_currency: formData.value.giro_local_currency,
    flows: formData.value.flows,
    tir_purchase: formData.value.tir_purchase,
    purchase_value_origin: formData.value.purchase_value_origin,
  })

  const setInstrumentCurrency = (currency: string) => {
    formData.value.instrument_currency = currency
  }

  const setPurchaseValueOrigin = (value: number) => {
    formData.value.purchase_value_origin = Number(value) || 0
  }

  const store = useRegisterFixedIncomeForeignCurrencyStore('v1')

  const loadFromService = async (payload: IIrrFlowForeignRequest) => {
    tableProps.value.loading = true
    resetForm()

    await store._getIrrFlow(payload)

    if (store.irr_flow_response) {
      const flows = store.irr_flow_response.cashflows.map((cf: ICashflow) => ({
        date: cf.date,
        interest: cf.amount - (cf.capital ?? 0),
        capital: cf.capital ?? 0,
      }))
      setFlows(flows)
      setTirPurchase(store.irr_flow_response.tir)
    }

    tableProps.value.loading = false
  }

  return {
    complianceFormRef,
    formData,
    utils,
    tableProps,
    rows,
    displayTir,
    disableWeekends,
    setInstrumentCurrency,
    setPurchaseValueOrigin,
    resetForm,
    setFlows,
    setTirPurchase,
    setNegotiationCurrencyValue,
    setSpotRateValue,
    getValues,
    loadFromService,
  }
}

export default useComplianceForm
