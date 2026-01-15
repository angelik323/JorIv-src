import { useRules, useUtils } from '@/composables'
import {
  days_base_options,
  DELIVERY_NON_DELIVERY_OPTIONS,
  DERIVATIVE_OBJECTIVE_OPTIONS,
} from '@/constants'
import {
  ICoinsResource,
  IDerivativeInvestmentOperationToCreate,
} from '@/interfaces/customs'
import { WriteActionType } from '@/interfaces/global'
import { useLogin } from '@/stores'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

export const useInformationForm = (
  props: {
    action: WriteActionType
    data: IDerivativeInvestmentOperationToCreate | null
  },
  emit: Function
) => {
  const {
    is_required,
    only_number_with_decimals,
    max_length,
    only_number_with_max_integers_and_decimals,
    no_leading_zeros,
    only_alphanumeric,
  } = useRules()

  const resources = useInvestmentPortfolioResourceStore('v1')

  const { loggedUser } = useLogin()

  const {
    investment_portfolio,
    emitter,
    derivative_class,
    paper_type,
    derivative_coverage,
    operation_type,
    coins,
  } = storeToRefs(resources)

  const formElementRef = ref()

  const today = new Date().toISOString().slice(0, 10)
  const initialModelsValues: IDerivativeInvestmentOperationToCreate = {
    created_by: loggedUser!.user.id,
    operation_type_id: null,
    operation_date: today,
    investment_portfolio_id: null,
    investment_portfolio_description: '',
    compliance_type: '',
    issuers_counterparty_id: null,
    derivative_class_id: null,
    paper_type_id: null,
    derivative_objective: '',
    coverage_type_id: null,
    badge_x_id: null,
    badge_y_id: null,
    currency_id: null,
    value_currency: 0,
    base_days: null,
    days: '',
    constitution_date: today,
    expiration_date: '',
    compliance_date: '',
    rate_spot_badge_y: 0,
    strike_badge_y: 0,
    spot_badge_y: 0,
    forward_badge_y: 0,
    fixed_agreed_rate: 0,
    agreed_value_badge_y: 0,
    status_id: 82, //Por liquidar
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const getNextBusinessDay = (date: Date): Date => {
    const nextDate = new Date(date)
    while (!isBusinessDay(nextDate)) {
      nextDate.setDate(nextDate.getDate() + 1)
    }
    return nextDate
  }

  const isBusinessDay = (date: Date): boolean => {
    const day = date.getDay()
    return day !== 6 && day !== 5
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
      emit('update:data', useUtils().isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => coins.value,
    () => {
      const usdItem = coins.value.find(
        (item: ICoinsResource) =>
          typeof item.code === 'string' &&
          item.code.toLowerCase().includes('usd')
      )
      models.value.badge_x_id = Number(usdItem ? usdItem.value : null)
      const copItem = coins.value.find(
        (item: ICoinsResource) =>
          typeof item.code === 'string' &&
          item.code.toLowerCase().includes('cop')
      )
      models.value.badge_y_id = Number(copItem ? copItem.value : null)
      models.value.currency_id = Number(copItem ? copItem.value : null)
      const copItemValue = copItem ? Number(copItem.coin_value) : 0
      models.value.spot_badge_y = copItemValue
    },
    { immediate: true }
  )

  watch(
    () => models.value.days,
    (val) => {
      if (!val || isNaN(Number(val)) || !models.value.constitution_date) {
        models.value.expiration_date = ''
        return
      }
      const constitutionDate = new Date(models.value.constitution_date)
      constitutionDate.setDate(constitutionDate.getDate() + Number(val))
      let expirationDate = constitutionDate
      if (!isBusinessDay(expirationDate)) {
        expirationDate = getNextBusinessDay(expirationDate)
      }
      models.value.expiration_date = expirationDate.toISOString().slice(0, 10)
      models.value.compliance_date = expirationDate.toISOString().slice(0, 10)
    }
  )

  watch(
    () => [
      models.value.strike_badge_y,
      models.value.rate_spot_badge_y,
      models.value.value_currency,
      models.value.compliance_type,
    ],
    () => {
      models.value.forward_badge_y =
        (models.value.strike_badge_y / models.value.rate_spot_badge_y - 1) * 100
      models.value.agreed_value_badge_y =
        models.value.value_currency * models.value.strike_badge_y
    }
  )

  watch(
    () => models.value.investment_portfolio_id,
    (val) => {
      const selected = investment_portfolio.value.find(
        (item) => item.value === Number(val)
      )
      models.value.investment_portfolio_description =
        selected?.description || ''
    }
  )

  return {
    formElementRef,
    models,
    investment_portfolio,
    emitter,
    derivative_class,
    paper_type,
    derivative_coverage,
    operation_type,
    coins,
    days_base_options,
    loggedUser,
    DELIVERY_NON_DELIVERY_OPTIONS,
    DERIVATIVE_OBJECTIVE_OPTIONS,
    is_required,
    max_length,
    only_number_with_decimals,
    only_number_with_max_integers_and_decimals,
    no_leading_zeros,
    only_alphanumeric,
  }
}
