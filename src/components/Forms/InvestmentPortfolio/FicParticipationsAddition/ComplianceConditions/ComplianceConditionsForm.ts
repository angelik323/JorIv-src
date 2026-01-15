import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { isEmptyOrZero } from '@/utils'
import { useRules, useUtilsCalendarMethods } from '@/composables'

import { IComplianceConditionsForm } from '@/interfaces/customs'

import { useFicParticipationsAdditionStore } from '@/stores/investment-portfolio/fic-participations-addition'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

const ComplianceConditionsForm = (
  props: {
    data: IComplianceConditionsForm | null
  },
  emit: Function
) => {
  const { is_required, valid_format_date, max_integer_decimal } = useRules()
  const { isBusinessDay } = useUtilsCalendarMethods()

  const {
    currency_foreign,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const {
    currency_conversion,
    coin_value,
    constitution_value_origin_currency,
    number_days
  } = useFicParticipationsAdditionStore('v1')

  const complianceFormRef = ref()

  const dolarInfo = computed(() => {
    return currency_foreign.value.find((item) => item.code === 'USD')
  })
  
  const complianceCurrencyOrigin = computed(() => {
    const value = Math.round((Number(constitution_value_origin_currency) * Number(currency_conversion) + Number.EPSILON) * 100) / 100
    return value
  })

  const localCurrencyComplianceTransfer = computed(() => {
    const value = ( Number(constitution_value_origin_currency) * Number(currency_conversion) ) * Number(dolarInfo.value?.coin_value)
    return Math.round((value + Number.EPSILON) * 100) / 100
  })

  const toSixDecimals = (value: number) => Number(value.toFixed(6))

  const addBusinessDays = (date: moment.Moment, days: number): moment.Moment => {
    if (days <= 0) return date
    const next = date.clone().add(1, "days")
    return isBusinessDay(next.format("YYYY-MM-DD"))
      ? addBusinessDays(next, days - 1)
      : addBusinessDays(next, days)
  }

  const initialModelsValues: IComplianceConditionsForm = {
    currency_value: Math.round((Number(coin_value) + Number.EPSILON) * 100) / 100,
    conversion_factor: toSixDecimals(Number(currency_conversion)),
    value_addition_currency_origin: 0,
    compliance_date: addBusinessDays(moment(), (number_days - 1)).format('YYYY-MM-DD'),
    resource_placement_date: addBusinessDays(moment(), (number_days - 2)).format('YYYY-MM-DD'),
    value_compliance_currency_origin: complianceCurrencyOrigin.value,
    local_currency_compliance_transfer: localCurrencyComplianceTransfer.value,
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true, immediate: true }
  )

  return {
    complianceFormRef,
    models,
    is_required,
    max_integer_decimal,
    valid_format_date,
    isBusinessDay
  }
}

export default ComplianceConditionsForm