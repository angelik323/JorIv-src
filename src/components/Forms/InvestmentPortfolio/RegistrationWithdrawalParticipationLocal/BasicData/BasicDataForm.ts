import { onBeforeMount, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { isEmptyOrZero } from '@/utils'
import { ILocalCurrencyWithdrawalParticipationForm } from '@/interfaces/customs'
import { ActionType, ActionHandlers } from '@/interfaces/global'
import {
  useLocalCurrencyWithdrawalStore,
  useTrustBusinessResourceStore,
  useAccountingResourceStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'
import moment from 'moment'

const DEFAULT_MODEL: ILocalCurrencyWithdrawalParticipationForm = {
  investment_portfolio_id: null,
  investment_portfolio_description: null,
  operation_date: moment().format('YYYY-MM-DD'),
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

const useBasicDataForm = (props: {
  action: ActionType
  data?: ILocalCurrencyWithdrawalParticipationForm | null
}) => {
  const { definition_accounting_parameters_view } = storeToRefs(
    useLocalCurrencyWithdrawalStore('v1')
  )
  const { _setLocalCurrencyWithdrawalForm } =
    useLocalCurrencyWithdrawalStore('v1')

  const { business_trust_types, business_trusts_value_is_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { account_structures_available, cost_center } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const {
    third_party_issuers_selector,
    permission_user_portfolio,
    issuer_counterparty_all,
    administrators_codes,
    fic_participation_emitter,
    fic_participation_administrator,
    fic_participation_counterparty,
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
      edit: async () => {
        await setForm(data)
      },
      view: () => setForm(data),
    }
    actionHandlers[action]?.()
  }

  const setForm = (data: ILocalCurrencyWithdrawalParticipationForm | null) => {
    if (data) {
      models.value = {
        ...data,
      }
    }
  }

  onBeforeMount(async () => {
    await handlerActionForm(props.action)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setLocalCurrencyWithdrawalForm(null)
      } else {
        _setLocalCurrencyWithdrawalForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    [() => models.value.counterparty_id, () => issuer_counterparty_all.value],
    ([id, list]) => {
      const sel = list.find((i) => String(i.value) === String(id))
      models.value.counterparty_description =
        sel?.label ?? sel?.description ?? ''
    },
    { immediate: true }
  )

  watch(
    [() => models.value.issuer_id, () => third_party_issuers_selector.value],
    ([id, list]) => {
      const sel = list.find((i) => String(i.value) === String(id))
      models.value.issuer_description = sel?.label ?? sel?.description ?? ''
    },
    { immediate: true }
  )

  watch(
    [
      () => models.value.investment_portfolio_id,
      () => permission_user_portfolio.value,
    ],
    ([id, list]) => {
      const sel = list.find((i) => String(i.value) === String(id))
      models.value.investment_portfolio_description =
        sel?.label ?? sel?.description ?? ''
    },
    { immediate: true }
  )

  watch(
    [() => models.value.administrator_id, () => administrators_codes.value],
    ([id, list]) => {
      const sel = list.find((i) => String(i.value) === String(id))
      models.value.administrator_description =
        sel?.label ?? sel?.description ?? ''
    },
    { immediate: true }
  )

  watch(
    () => models.value.investment_portfolio_id,
    async (portfolioId) => {
      models.value.issuer_id = null
      models.value.counterparty_id = null
      models.value.administrator_id = null
      if (!portfolioId) return

      const filters = `filter[investment_portfolio_id]=${portfolioId}`
      await _getResources(
        { investment_portfolio: ['fic_participation_emitter'] },
        filters
      )
    }
  )

  watch(
    () => models.value.issuer_id,
    async (issuerId) => {
      models.value.counterparty_id = null
      models.value.administrator_id = null

      const p = models.value.investment_portfolio_id
      if (!p || !issuerId) return

      const filters = `filter[investment_portfolio_id]=${p}&filter[issuer_id]=${issuerId}`
      await _getResources(
        { investment_portfolio: ['fic_participation_counterparty'] },
        filters
      )
    }
  )

  watch(
    () => models.value.counterparty_id,
    async (counterpartyId) => {
      models.value.administrator_id = null

      const p = models.value.investment_portfolio_id
      const i = models.value.issuer_id
      if (!p || !i || !counterpartyId) return

      const filters =
        `filter[investment_portfolio_id]=${p}` +
        `&filter[issuer_id]=${i}` +
        `&filter[counterparty_id]=${counterpartyId}`

      await _getResources(
        { investment_portfolio: ['fic_participation_administrator'] },
        filters
      )
    }
  )

  return {
    models,
    formElementRef,
    isView,
    business_trust_types,
    business_trusts_value_is_code,
    account_structures_available,
    cost_center,
    third_party_issuers_selector,
    permission_user_portfolio,
    issuer_counterparty_all,
    administrators_codes,
    fic_participation_emitter,
    fic_participation_administrator,
    fic_participation_counterparty,
    resetForm,
  }
}

export default useBasicDataForm
