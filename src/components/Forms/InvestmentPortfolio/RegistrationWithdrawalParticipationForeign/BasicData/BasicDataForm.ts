import { onBeforeMount, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { IForeignCurrencyWithdrawalParticipationForm } from '@/interfaces/customs'
import { ActionType, ActionHandlers } from '@/interfaces/global'
import {
  useForeignCurrencyWithdrawalStore,
  useTrustBusinessResourceStore,
  useAccountingResourceStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'
import moment from 'moment'

const DEFAULT_MODEL: IForeignCurrencyWithdrawalParticipationForm = {
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

const useBasicDataForm = (props: {
  action: ActionType
  data?: IForeignCurrencyWithdrawalParticipationForm | null
}) => {
  const { definition_accounting_parameters_view } = storeToRefs(
    useForeignCurrencyWithdrawalStore('v1')
  )

  const { business_trust_types, business_trusts_value_is_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { account_structures_available, cost_center } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { _getResources } = useResourceManagerStore('v1')

  const {
    third_party_issuers_selector,
    permission_user_portfolio,
    issuer_counterparty_all,
    administrators_codes,
    fic_participation_emitter_foreign_currency,
    fic_participation_counterparty_foreign_currency,
    fic_participation_administrator_foreign_currency,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

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
      edit: async () => {
        await setForm(data)
      },
      view: () => setForm(data),
    }
    actionHandlers[action]?.()
  }

  const setForm = (
    data: IForeignCurrencyWithdrawalParticipationForm | null
  ) => {
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
    (v) => {
      useForeignCurrencyWithdrawalStore(
        'v1'
      )._patchForeignCurrencyWithdrawalForm({ ...v })
    },
    { deep: true, immediate: true }
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

  // 1) Cambia Portafolio => cargar Emisores y resetear niveles inferiores
  watch(
    () => models.value.investment_portfolio_id,
    async (portfolioId) => {
      models.value.issuer_id = null
      models.value.counterparty_id = null
      models.value.administrator_id = null
      if (!portfolioId) return

      const filters = `filter[investment_portfolio_id]=${portfolioId}`
      await _getResources(
        {
          investment_portfolio: ['fic_participation_emitter_foreign_currency'],
        },
        filters
      )
    }
  )

  // 2) Cambia Emisor => cargar Contrapartes y resetear Administrador
  watch(
    () => models.value.issuer_id,
    async (issuerId) => {
      models.value.counterparty_id = null
      models.value.administrator_id = null

      const p = models.value.investment_portfolio_id
      if (!p || !issuerId) return

      const filters =
        `filter[investment_portfolio_id]=${p}&filter[issuer_id]=` + issuerId
      await _getResources(
        {
          investment_portfolio: [
            'fic_participation_counterparty_foreign_currency',
          ],
        },
        filters
      )
    }
  )

  // 3) Cambia Contraparte => cargar Administradores
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
        {
          investment_portfolio: [
            'fic_participation_administrator_foreign_currency',
          ],
        },
        filters
      )
    }
  )

  return {
    models,
    formElementRef,
    isView,
    resetForm,
    business_trust_types,
    business_trusts_value_is_code,
    account_structures_available,
    cost_center,
    third_party_issuers_selector,
    permission_user_portfolio,
    issuer_counterparty_all,
    administrators_codes,
    fic_participation_emitter_foreign_currency,
    fic_participation_counterparty_foreign_currency,
    fic_participation_administrator_foreign_currency,
  }
}

export default useBasicDataForm
