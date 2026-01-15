import { onBeforeMount, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { IForeignCurrencyWithdrawalParticipationForm } from '@/interfaces/customs'
import type { ActionType, ActionHandlers } from '@/interfaces/global'
import {
  useForeignCurrencyWithdrawalStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'

const DEFAULT_MODEL: IForeignCurrencyWithdrawalParticipationForm = {
  investment_portfolio_id: null,
  investment_portfolio_description: null,
  operation_date: null,
  issuer_id: null,
  issuer_description: null,
  counterparty_id: null,
  counterparty_description: null,
  administrator_description: null,
  administrator_id: null,
  details: {
    unit_value: null,
    portfolio_class: null,
    operation_type_id: null,
    cash_operation_days: null,
  },
  compliance: {
    withdrawal_value_origin_currency: null,
    compliance_date: null,
    placement_resource_date: null,
  },
  portfolio_class: null,
  security_type: null,
  origin_currency: null,
  isin: null,
  participation_count: null,
  title_count: null,
  origin_currency_balance: null,
  origin_currency_unit_value: null,
  current_balance_units: null,
  operation_code: null,
  operation_description: null,
  cash_operation_days: null,
  unit: null,
  currency_value: null,
  conversion_factor: null,
  compliance_value_currency_origin: null,
  local_currency_compliance: null,
}

const useComplianceConditionsForm = (props: {
  action: ActionType
  data?: IForeignCurrencyWithdrawalParticipationForm | null
}) => {
  const fcwStore = useForeignCurrencyWithdrawalStore('v1')
  const {
    definition_accounting_parameters_view,
    definition_accounting_parameters_form,
  } = storeToRefs(fcwStore)
  const { _setForeignCurrencyWithdrawalPositions } = fcwStore

  const { class_portfolio, operation_type } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const formElementRef = ref()

  const models = ref<IForeignCurrencyWithdrawalParticipationForm>({
    ...DEFAULT_MODEL,
  })

  const resetForm = () => {
    models.value = { ...DEFAULT_MODEL }
    formElementRef.value?.reset?.()
    formElementRef.value?.resetValidation?.()
  }

  const isView = computed(() => props.action === 'view')

  const setForm = (
    data: IForeignCurrencyWithdrawalParticipationForm | null
  ) => {
    if (!data) return
    models.value = {
      ...models.value,
      ...data,
      details: { ...models.value.details, ...(data.details || {}) },
      compliance: { ...models.value.compliance, ...(data.compliance || {}) },
    }
  }

  const handlerActionForm = (action: ActionType) => {
    const data =
      definition_accounting_parameters_view.value ?? props.data ?? null
    const actionHandlers: ActionHandlers = {
      create: () => setForm(null),
      edit: () => setForm(data),
      view: () => setForm(data),
    }
    actionHandlers[action]?.()
  }

  onBeforeMount(() => {
    handlerActionForm(props.action)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) handlerActionForm(props.action)
    }
  )

  const complianceForStore = computed(() => ({
    withdrawal_value_origin_currency:
      models.value.compliance?.withdrawal_value_origin_currency ?? null,
    compliance_date: models.value.compliance?.compliance_date ?? null,
    placement_resource_date:
      models.value.compliance?.placement_resource_date ?? null,
  }))

  watch(
    () => complianceForStore.value,
    (c) => {
      _setForeignCurrencyWithdrawalPositions({
        compliance: { ...c },
      } as IForeignCurrencyWithdrawalParticipationForm)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => definition_accounting_parameters_form.value,
    (shared) => {
      if (!shared) return
      models.value.currency_value =
        shared.currency_value ?? models.value.currency_value
      models.value.conversion_factor =
        shared.conversion_factor ?? models.value.conversion_factor
      models.value.origin_currency_unit_value =
        shared.origin_currency_unit_value ??
        models.value.origin_currency_unit_value
      models.value.compliance_value_currency_origin =
        shared.compliance_value_currency_origin ??
        models.value.compliance_value_currency_origin
      models.value.local_currency_compliance =
        shared.local_currency_compliance ??
        models.value.local_currency_compliance
      models.value.withdrawal_units_count =
        shared.current_balance_units != null
          ? typeof shared.current_balance_units === 'string'
            ? Number(shared.current_balance_units)
            : shared.current_balance_units
          : shared.current_balance_units
    },
    { immediate: true }
  )

  const toNum = (v: any): number | null => {
    if (v === null || v === undefined || v === '') return null
    const n = typeof v === 'string' ? Number(v.replace?.(/,/g, '')) : Number(v)
    return Number.isFinite(n) ? n : null
  }

  const calcWithdrawalUnits = () => {
    const withdrawal = toNum(
      models.value.compliance?.withdrawal_value_origin_currency
    )
    const unitValue = toNum(models.value.origin_currency_unit_value)

    if (withdrawal == null || unitValue == null || unitValue === 0) {
      models.value.withdrawal_units_count = null
      return
    }

    models.value.withdrawal_units_count = +(withdrawal / unitValue).toFixed(6)
  }

  watch(
    [
      () => models.value.compliance?.withdrawal_value_origin_currency,
      () => models.value.origin_currency_unit_value,
    ],
    () => calcWithdrawalUnits(),
    { immediate: true }
  )

  return {
    models,
    formElementRef,
    isView,
    class_portfolio,
    operation_type,
    resetForm,
  }
}

export default useComplianceConditionsForm
