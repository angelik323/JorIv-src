import { onBeforeMount, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  IFicForeignCurrencyWithdrawalParticipation,
  IForeignCurrencyWithdrawalParticipationForm,
  IGenericResource,
} from '@/interfaces/customs'
import { ActionType, ActionHandlers } from '@/interfaces/global'
import {
  useForeignCurrencyWithdrawalStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
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

const useBasicOperationForm = (props: {
  action: ActionType
  data?: IForeignCurrencyWithdrawalParticipationForm | null
}) => {
  const fcwStore = useForeignCurrencyWithdrawalStore('v1')
  const { definition_accounting_parameters_view } = storeToRefs(fcwStore)
  const { _setForeignCurrencyWithdrawalDetails } = fcwStore

  const {
    class_portfolio,
    operation_type,
    withdrawal_participation_unit_foreign_currency,
    withdrawal_participation_fic_foreign_currency,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

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

  const setForm = (
    data: IForeignCurrencyWithdrawalParticipationForm | null
  ) => {
    if (data) {
      models.value = {
        ...DEFAULT_MODEL,
        ...data,
        details: { ...DEFAULT_MODEL.details, ...(data.details || {}) },
        compliance: { ...DEFAULT_MODEL.compliance, ...(data.compliance || {}) },
      }
    } else {
      models.value = { ...DEFAULT_MODEL }
    }
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

  watch(
    [
      () => models.value.details?.unit_value,
      () => withdrawal_participation_unit_foreign_currency.value,
    ],
    async ([unitValue]) => {
      if (unitValue === null || unitValue === undefined || unitValue === '')
        return
      const params = new URLSearchParams()
      params.set('filter[id]', String(unitValue))
      await _getResources(
        {
          investment_portfolio: [
            'withdrawal_participation_fic_foreign_currency',
          ],
        },
        params.toString(),
        'v1'
      )
    },
    { immediate: false }
  )

  const mapFICToModel = (row: IFicForeignCurrencyWithdrawalParticipation) => {
    models.value.security_type = row.paper_type ?? null
    models.value.origin_currency = row.currency_origin ?? null
    models.value.isin = row.isin ?? null
    models.value.participation_count = row.participation_number ?? null
    models.value.title_count = row.title_id ?? null
    models.value.origin_currency_balance = row.origin_currency_balance ?? null
    models.value.origin_currency_unit_value =
      row.unit_value_currency_origin ?? row.currency_value ?? null
    models.value.current_balance_units = row.current_balance_units ?? null
    models.value.portfolio_class =
      row.portfolio_class ?? models.value.portfolio_class
    models.value.currency_value = row.currency_value ?? null
    models.value.conversion_factor = row.conversion_factor ?? null
    models.value.compliance = {
      ...models.value.compliance,
      withdrawal_value_origin_currency:
        row.compliance_value_currency_origin ?? null,
    }
    models.value.compliance_value_currency_origin =
      row.compliance_value_currency_origin ?? null
    models.value.local_currency_compliance =
      row.local_currency_compliance ?? null
  }

  const clearFICFields = () => {
    models.value.security_type = null
    models.value.origin_currency = null
    models.value.isin = null
    models.value.participation_count = null
    models.value.title_count = null
    models.value.origin_currency_balance = null
    models.value.origin_currency_unit_value = null
    models.value.current_balance_units = null
  }

  watch(
    () => withdrawal_participation_fic_foreign_currency.value,
    (list) => {
      const row =
        Array.isArray(list) && list.length
          ? (list[0] as IFicForeignCurrencyWithdrawalParticipation)
          : null
      if (row) mapFICToModel(row)
      else clearFICFields()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.details?.unit_value,
    () => clearFICFields()
  )

  watch(
    () => [
      models.value.currency_value,
      models.value.conversion_factor,
      models.value.origin_currency_unit_value,
      models.value.compliance_value_currency_origin,
      models.value.local_currency_compliance,
    ],
    ([cv, cf, ucv, cvo, lcc]) => {
      useForeignCurrencyWithdrawalStore(
        'v1'
      )._patchForeignCurrencyWithdrawalForm({
        currency_value: cv ?? null,
        conversion_factor: cf != null ? Number(cf) : null,
        origin_currency_unit_value: ucv ?? null,
        compliance_value_currency_origin: cvo != null ? Number(cvo) : null,
        local_currency_compliance: lcc != null ? Number(lcc) : null,
      })
    },
    { immediate: true }
  )

  watch(
    () => [
      models.value.compliance?.withdrawal_value_origin_currency,
      models.value.origin_currency_unit_value ??
        models.value.details?.unit_value,
    ],
    ([withdraw, unitVal]) => {
      const w = Number(withdraw)
      const u = Number(unitVal)
      models.value.withdrawal_units_count = u ? w / u : null
    },
    { immediate: true }
  )

  watch(
    [
      () => models.value.operation_code,
      () => operation_type.value as IGenericResource[],
    ],
    ([code, list]) => {
      if (code === null || code === undefined || code === '') return
      const opt = list.find((o) => String(o.value) === String(code))
      models.value.operation_description =
        opt?.description ?? opt?.label ?? null
      models.value.details = {
        ...(models.value.details ?? {}),
        operation_type_id: opt?.value ?? null,
      }
    },
    { immediate: true }
  )

  const detailsForStore = computed(() => ({
    unit_value: models.value.details?.unit_value ?? null,
    portfolio_class:
      models.value.portfolio_class ??
      models.value.details?.portfolio_class ??
      null,
    operation_type_id:
      models.value.details?.operation_type_id ??
      models.value.operation_code ??
      null,
    cash_operation_days:
      models.value.cash_operation_days ??
      models.value.details?.cash_operation_days ??
      null,
  }))

  watch(
    () => detailsForStore.value,
    (d) => {
      _setForeignCurrencyWithdrawalDetails({
        details: { ...d },
      } as IForeignCurrencyWithdrawalParticipationForm)
    },
    { deep: true, immediate: true }
  )

  return {
    models,
    formElementRef,
    isView,
    resetForm,
    class_portfolio,
    operation_type,
    withdrawal_participation_unit_foreign_currency,
    withdrawal_participation_fic_foreign_currency,
  }
}

export default useBasicOperationForm
