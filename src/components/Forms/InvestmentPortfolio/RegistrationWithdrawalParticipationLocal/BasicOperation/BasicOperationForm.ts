import { onBeforeMount, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  IFicLocalCurrencyWithdrawalParticipation,
  ILocalCurrencyWithdrawalParticipationForm,
  IGenericResource,
  IPortfolioOption,
  IFicLocalCurrencyWithdrawalExtended,
} from '@/interfaces/customs'
import { ActionType, ActionHandlers } from '@/interfaces/global'
import {
  useLocalCurrencyWithdrawalStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'


const DEFAULT_MODEL: ILocalCurrencyWithdrawalParticipationForm = {
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
    paper_type_id: null,
    paper_type: null,
    withdrawal_value: null,
    currency_id: null,
    value_currency: 1,
  },
  portfolio_class: null,
  security_type: null,
  origin_currency: null,
  isin: null,
  participation_count: null,
  title_count: null,
  current_participation_balance_in_pesos: null,
  current_balance_in_units: null,
  participation_balance_in_pesos: null,
  operation_code: null,
  operation_description: null,
  cash_operation_days: null,
  unit: null,
  currency_value: null,
  conversion_factor: null,
  currency_id: null,
  value_currency: null,
  cash_value_currency: null,
  withdrawal_value: null,
}

const useBasicOperationForm = (props: {
  action: ActionType
  data?: ILocalCurrencyWithdrawalParticipationForm | null
}) => {
  const { definition_accounting_parameters_view } = storeToRefs(
    useLocalCurrencyWithdrawalStore('v1')
  )
  const { _setLocalCurrencyWithdrawalDetails } =
    useLocalCurrencyWithdrawalStore('v1')

  const {
    class_portfolio,
    operation_type,
    withdrawal_participation_unit_local_currency,
    withdrawal_participation_fic_local_currency,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const formElementRef = ref()
  const models = ref<ILocalCurrencyWithdrawalParticipationForm>({
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

  const setForm = (data: ILocalCurrencyWithdrawalParticipationForm | null) => {
    if (data) {
      models.value = {
        ...DEFAULT_MODEL,
        ...data,
        details: { ...DEFAULT_MODEL.details, ...(data.details || {}) },
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
      () => withdrawal_participation_unit_local_currency.value,
    ],
    async ([unitValue, list]) => {
      if (unitValue === null || unitValue === undefined || unitValue === '')
        return
      const params = new URLSearchParams()
      params.set('filter[unit_value]', String(unitValue))
      await _getResources(
        {
          investment_portfolio: ['withdrawal_participation_fic_local_currency'],
        },
        params.toString(),
        'v1'
      )
      const opt =
        Array.isArray(list) && list.length
          ? (list as IPortfolioOption[]).find((o) => String(o?.value) === String(unitValue))
          : null
      const cid = opt?.currency_id ?? opt?.extra?.currency_id ?? null
      const paperTypeId =
        opt?.paper_type_id ?? opt?.extra?.paper_type_id ?? null
      const paperType = opt?.paper_type ?? opt?.extra?.paper_type ?? null

      if (cid != null) {
        models.value.details = {
          ...(models.value.details ?? {}),
          currency_id: cid,
          paper_type_id: paperTypeId,
          paper_type: paperType,
        }
      }
    },
    { immediate: false }
  )

  const mapFICToModel = (row: IFicLocalCurrencyWithdrawalExtended) => {
    models.value.security_type = row.paper_type ?? null
    models.value.origin_currency = row.currency_origin ?? null
    models.value.isin = row.isin ?? null
    models.value.participation_count = row.participation_number ?? null
    models.value.title_count = row.title_id ?? null
    models.value.current_participation_balance_in_pesos =
      row.current_participation_balance_in_pesos ?? null
    models.value.current_balance_in_units =
      row.current_balance_in_units ??
      row.currency_value ??
      null
    models.value.participation_balance_in_pesos =
      row.participation_balance_in_pesos ?? null
    models.value.portfolio_class =
      row.portfolio_class ?? models.value.portfolio_class
    models.value.currency_value = row.currency_value ?? 1
    models.value.conversion_factor = row.conversion_factor ?? null
    const cid = row.currency_id ?? row.currency?.id ?? null
    models.value.details = {
      ...(models.value.details ?? {}),
      currency_id: cid ?? models.value.details?.currency_id ?? null,
      paper_type_id:
        row.paper_type_id ??
        models.value.details?.paper_type_id ??
        null,
      paper_type:
        row.paper_type ?? models.value.details?.paper_type ?? null,
    }
  }

  const clearFICFields = () => {
    models.value.security_type = null
    models.value.origin_currency = null
    models.value.isin = null
    models.value.participation_count = null
    models.value.title_count = null
    models.value.current_participation_balance_in_pesos = null
    models.value.current_balance_in_units = null
    models.value.participation_balance_in_pesos = null
  }

  watch(
    () => withdrawal_participation_fic_local_currency.value,
    async (list) => {
      const row =
        Array.isArray(list) && list.length
          ? (list[0] as IFicLocalCurrencyWithdrawalParticipation)
          : null
      if (row) {
        mapFICToModel(row)
      } else {
        clearFICFields()
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.details?.unit_value,
    () => clearFICFields()
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
    currency_id:
      models.value.currency_id ??
      models.value.details?.currency_id ??
      null,
    value_currency:
      models.value.value_currency ??
      models.value.currency_value ??
      models.value.details?.value_currency ??
      null,
    operation_type_id:
      models.value.details?.operation_type_id ??
      models.value.operation_type_id ??
      models.value.operation_code ??
      null,
    paper_type_id: models.value.details?.paper_type_id ?? null,

    withdrawal_value:
      models.value.withdrawal_value ??
      models.value.details?.withdrawal_value ??
      null,
  }))

  watch(
    () => detailsForStore.value,
    (d) => {
      _setLocalCurrencyWithdrawalDetails({
        details: { ...d },
      } as unknown as ILocalCurrencyWithdrawalParticipationForm)
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
    withdrawal_participation_unit_local_currency,
    withdrawal_participation_fic_local_currency,
  }
}

export default useBasicOperationForm
