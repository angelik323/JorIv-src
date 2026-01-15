import { ref, computed, watch } from 'vue'
import { QForm } from 'quasar'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useUtils, useRules } from '@/composables'
import { useInvestmentPortfolioResourceStore, useLogin } from '@/stores'
import {
  ITtvInformationFormData,
  PositionTypes,
  TtvTypes,
  CommissionBaseMonetaryMarket,
} from '@/interfaces/customs/investment-portfolio/RegisterMonetaryMarket'
import { COMPENSATION_SYSTEMS, COP_CURRENCY_CODE } from '@/constants'
import { ActionType } from '@/interfaces/global'

const useTtvInformationForm = (props: {
  action: ActionType
  data?: ITtvInformationFormData
}) => {
  const { watchAndUpdateDescription } = useUtils()
  const resources = useInvestmentPortfolioResourceStore('v1')

  const {
    investment_portfolio,
    operation_type,
    paper_type,
    list_counterparty_associated_trader,
    currency_local,
  } = storeToRefs(resources)

  const informationFormRef = ref<QForm | null>(null)

  const isViewMode = computed(() => props.action === 'view')
  const isEdit = computed(() => props.action === 'edit')

  const loginStore = useLogin()

  const loggedUserName = computed(() => {
    const first = loginStore.loggedUser?.user?.name ?? ''
    const last = loginStore.loggedUser?.user?.last_name ?? ''
    return `${first} ${last}`.trim()
  })

  const copCurrencyId = computed(() => {
    return (
      currency_local.value?.find((c) => c.label === COP_CURRENCY_CODE)?.value ??
      null
    )
  })

  const formData = ref<ITtvInformationFormData>({
    user: props.data?.user ?? loggedUserName.value,
    operation_date: props.data?.operation_date ?? moment().format('YYYY-MM-DD'),
    investment_portfolio_id: props.data?.investment_portfolio_id ?? null,
    description_portfolio_name: props.data?.description_portfolio_name ?? '',
    ttv_type: props.data?.ttv_type ?? null,
    position: props.data?.position ?? null,
    paper_id: props.data?.paper_id ?? null,
    operation_type_id: props.data?.operation_type_id ?? null,
    operation_type_description: props.data?.operation_type_description ?? '',
    number_days: props.data?.number_days ?? null,
    end_date: props.data?.end_date ?? '',
    counterparty_id: props.data?.counterparty_id ?? null,
    currency_id: props.data?.currency_id ?? copCurrencyId.value,
    currency_value:
      props.action === 'create' ? 1 : props.data?.currency_value ?? null,
    folio: props.data?.folio ?? null,
    compensation_system: props.data?.compensation_system ?? null,
    negotiation_value: props.data?.negotiation_value ?? null,
    nominal_delivered: props.data?.nominal_delivered ?? null,
    market_delivered: props.data?.market_delivered ?? null,
    nominal_received: props.data?.nominal_received ?? null,
    market_received: props.data?.market_received ?? null,
    money_value: props.data?.money_value ?? null,
    money_yield: props.data?.money_yield ?? false,
    yield_percentage: props.data?.yield_percentage ?? null,
    yield_value: props.data?.yield_value ?? null,
    comission_base: props.data?.comission_base ?? null,
    commission_value: props.data?.commission_value ?? null,
    commission_result: props.data?.commission_result ?? null,
    commission_modality: props.data?.commission_modality ?? null,
    return_value: props.data?.return_value ?? null,
    paper_type_id: props.data?.paper_type_id ?? null,
  })

  const selectOptions = computed(() => ({
    investment_portfolio: investment_portfolio.value ?? [],
    operation_type: operation_type.value ?? [],
    paper: paper_type.value ?? [],
    currency: currency_local.value ?? [],
    counterparty: list_counterparty_associated_trader.value ?? [],
    compensation_systems: COMPENSATION_SYSTEMS,
  }))

  const resetForm = () => {
    formData.value = {
      ...formData.value,
      user: loggedUserName.value,
      operation_date: moment().format('YYYY-MM-DD'),
      investment_portfolio_id: null,
      description_portfolio_name: '',
      ttv_type: null,
      position: null,
      paper_id: null,
      operation_type_id: null,
      operation_type_description: '',
      number_days: null,
      end_date: '',
      counterparty_id: null,
      currency_id: copCurrencyId.value,
      currency_value: 1,
      folio: null,
      compensation_system: null,
      negotiation_value: null,
      nominal_delivered: null,
      market_delivered: null,
      nominal_received: null,
      market_received: null,
      money_value: null,
      money_yield: false,
      yield_percentage: null,
      yield_value: null,
      comission_base: null,
      commission_value: null,
      commission_result: null,
      commission_modality: null,
      return_value: null,
    }
  }

  ;(
    [
      {
        sourceKey: 'investment_portfolio_id',
        optionsKey: 'investment_portfolio',
        descriptionKey: 'description_portfolio_name',
      },
      {
        sourceKey: 'operation_type_id',
        optionsKey: 'operation_type',
        descriptionKey: 'operation_type_description',
      },
    ] as const
  ).forEach(({ sourceKey, optionsKey, descriptionKey }) => {
    if (props.action !== 'view') {
      watchAndUpdateDescription(
        formData,
        selectOptions,
        sourceKey,
        optionsKey,
        descriptionKey
      )
    }
  })

  watch(
    () => currency_local.value,
    (list) => {
      if (props.action !== 'create') return
      if (!list || !list.length) return
      const copCurrency = list.find(({ label }) => label === COP_CURRENCY_CODE)
      if (copCurrency) {
        formData.value.currency_id = copCurrency.value
        formData.value.currency_value = 1
      }
    },
    { immediate: true }
  )

  watch(
    () => [formData.value.number_days, formData.value.operation_date],
    ([daysRaw, start]) => {
      const days = Number(daysRaw)
      if (!days || days <= 0 || days > 365 || !start) {
        formData.value.end_date = ''
        return
      }

      let tentative = moment(start).add(days, 'days')

      while (
        useRules().date_is_not_weekend(tentative.format('YYYY-MM-DD')) !== true
      ) {
        tentative = tentative.add(1, 'days')
      }

      formData.value.end_date = tentative.format('YYYY-MM-DD')
    }
  )

  watch(
    () => [
      formData.value.money_value,
      formData.value.yield_percentage,
      formData.value.money_yield,
    ],
    () => {
      if (
        formData.value.money_yield &&
        formData.value.money_value &&
        formData.value.yield_percentage
      ) {
        formData.value.yield_value =
          (formData.value.money_value * formData.value.yield_percentage) / 100
      } else if (props.action !== 'view') {
        formData.value.yield_value = null
      }
    },
    { deep: true }
  )

  watch(
    () => [
      formData.value.comission_base,
      formData.value.commission_value,
      formData.value.negotiation_value,
    ],
    () => {
      if (!formData.value.comission_base || !formData.value.negotiation_value) {
        formData.value.commission_result = null
        return
      }
      if (
        formData.value.comission_base ===
          CommissionBaseMonetaryMarket.PERCENTAGE &&
        formData.value.commission_value
      ) {
        formData.value.commission_result =
          (formData.value.negotiation_value * formData.value.commission_value) /
          100
      } else if (
        formData.value.comission_base ===
        CommissionBaseMonetaryMarket.FIXED_VALUE
      ) {
        formData.value.commission_result = formData.value.commission_value
      } else {
        formData.value.commission_result = null
      }
    },
    { deep: true }
  )

  watch(
    () => [
      formData.value.ttv_type,
      formData.value.position,
      formData.value.negotiation_value,
      formData.value.commission_result,
      formData.value.yield_value,
    ],
    () => {
      const {
        ttv_type,
        position,
        negotiation_value,
        commission_result,
        yield_value,
      } = formData.value
      if (!negotiation_value) {
        formData.value.return_value = null
        return
      }
      const base = negotiation_value
      const com = commission_result ?? 0
      const rend = yield_value ?? 0
      if (
        position === PositionTypes.ORIGINATOR &&
        (ttv_type === TtvTypes.VALUES_VS_MONEY ||
          ttv_type === TtvTypes.VALUES_VS_VALUES)
      ) {
        formData.value.return_value = base + com + rend
      } else if (
        position === PositionTypes.RECEIVER &&
        (ttv_type === TtvTypes.VALUES_VS_MONEY ||
          ttv_type === TtvTypes.VALUES_VS_VALUES)
      ) {
        formData.value.return_value = base - com - rend
      } else {
        formData.value.return_value = null
      }
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) {
        formData.value = { ...formData.value, ...newVal }
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => formData.value.comission_base,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        formData.value.commission_value = null
        formData.value.commission_result = null
      }
    }
  )

  return {
    informationFormRef,
    formData,
    selectOptions,
    isViewMode,
    isEdit,
    resetForm,
  }
}

export default useTtvInformationForm
