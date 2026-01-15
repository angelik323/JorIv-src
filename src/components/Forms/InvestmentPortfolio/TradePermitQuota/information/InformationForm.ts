import { QForm } from 'quasar'
import { useRules } from '@/composables'
import { ITradePermitQuota } from '@/interfaces/customs/'
import { WriteActionType } from '@/interfaces/global'
import {
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
  useTradePermitQuotaStore,
  useUserResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { truncateText } from '@/utils'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

export const useInformationForm = (props: {
  action: WriteActionType
  data?: ITradePermitQuota[]
}) => {
  const { data_information_form } = storeToRefs(useTradePermitQuotaStore('v1'))
  const {
    type_investment,
    investment_portfolio,
    third_party_issuers_selector,
    inversion_types,
    paper_type,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { users } = storeToRefs(useUserResourceStore('v1'))
  const { _setDataInformationForm } = useTradePermitQuotaStore('v1')
  const { _getResources } = useResourceManagerStore('v1')
  const {
    is_required,
    only_number_with_max_integers_and_decimals,
    not_greater_than,
  } = useRules()

  const formInformation = ref<InstanceType<typeof QForm> | null>(null)
  const individualQuotaInputRef = ref<InstanceType<
    typeof GenericInputComponent
  > | null>(null)

  const models = ref<{
    trader_id: number | null
    portfolio_code?: number | string
    general_quota: number | null
    individual_quota: number | null
    description_trader?: string
    description_portfolio_name?: string
    description_emitter_name?: string
    type_investment?: number | string | undefined
    description_counterpart_name?: string
    investment_portfolio_id: number | null | string | undefined
    counterpart_id: number | null
    emitter_id: number | null
    paper_type_id: number | null
  }>({
    trader_id: null,
    general_quota: null,
    individual_quota: null,
    investment_portfolio_id: null,
    counterpart_id: null,
    emitter_id: null,
    paper_type_id: null,
  })

  const setDescriptionsFromCurrent = (): void => {
    // Trader
    if (models.value.trader_id && users.value?.length) {
      const t = users.value.find((u) => {
        const r = u as unknown as Record<string, unknown>
        return String(r.value ?? r.id) === String(models.value.trader_id)
      }) as Record<string, unknown> | undefined

      const name = (t?.name as string | undefined) ?? ''
      const last = (t?.last_name as string | undefined) ?? ''
      models.value.description_trader = name
        ? truncateText(`${name} ${last}`, 18)
        : ''
    } else {
      models.value.description_trader = ''
    }

    // Portafolio

    if (
      models.value.investment_portfolio_id &&
      investment_portfolio.value?.length
    ) {
      const selectedId = String(models.value.investment_portfolio_id)

      const p = (investment_portfolio.value as unknown[]).find((x) => {
        const r = x as Record<string, unknown>
        const candidate = String(r.value ?? r.id ?? r.code ?? '')
        return candidate === selectedId
      }) as Record<string, unknown> | undefined

      models.value.description_portfolio_name =
        (p?.description as string | undefined) ??
        (p?.name as string | undefined) ??
        ''
    } else {
      models.value.description_portfolio_name = ''
    }

    // Emisor
    if (models.value.emitter_id && third_party_issuers_selector.value?.length) {
      const e = third_party_issuers_selector.value.find((x) => {
        const r = x as unknown as Record<string, unknown>
        return String(r.id ?? r.value) === String(models.value.emitter_id)
      }) as Record<string, unknown> | undefined

      models.value.description_emitter_name =
        (e?.description as string | undefined) ?? ''
    } else {
      models.value.description_emitter_name = ''
    }

    // Contraparte
    if (
      models.value.counterpart_id &&
      third_party_issuers_selector.value?.length
    ) {
      const c = third_party_issuers_selector.value.find((x) => {
        const r = x as unknown as Record<string, unknown>
        return String(r.id ?? r.value) === String(models.value.counterpart_id)
      }) as Record<string, unknown> | undefined

      models.value.description_counterpart_name =
        (c?.description as string | undefined) ?? ''
    } else {
      models.value.description_counterpart_name = ''
    }
  }

  watch(
    () => models.value.investment_portfolio_id,
    () => {
      setDescriptionsFromCurrent()
    }
  )

  watch(
    () => models.value.emitter_id,
    () => {
      setDescriptionsFromCurrent()
    }
  )

  const handlerActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<'create' | 'edit', () => void> = {
      create: _setValueModel,
      edit: _setEditForm,
    }
    actionHandlers[action]?.()
  }

  const _setValueModel = () => {
    if (!data_information_form.value) return
    models.value = {
      trader_id: data_information_form.value.trader_id,
      general_quota: data_information_form.value.general_quota,
      individual_quota: data_information_form.value.individual_quota,
      investment_portfolio_id:
        data_information_form.value.investment_portfolio_id,
      counterpart_id: data_information_form.value.counterpart_id,
      emitter_id: data_information_form.value.emitter_id,
      paper_type_id: data_information_form.value.paper_type_id,
    }
    nextTick(setDescriptionsFromCurrent)
  }

  const _setEditForm = () => {
    if (!data_information_form.value) return
    const d = data_information_form.value

    const preferKeys = ['value', 'id', 'code'] as const

    const portfolioArr = (investment_portfolio.value ?? []) as unknown[]
    const portfolioMatch = portfolioArr.find((o) => {
      const r = o as Record<string, unknown>
      return (
        String(r.id ?? '') === String(d.investment_portfolio_id ?? '') ||
        String(r.code ?? '') === String(d.portfolio_code ?? '')
      )
    }) as Record<string, unknown> | undefined

    const normalizedPortfolio =
      portfolioMatch &&
      (preferKeys
        .map((k) => portfolioMatch[k] as unknown)
        .find((v) => v !== undefined && v !== null && v !== '') as
        | string
        | number
        | undefined)

    const typeArr = (type_investment.value ?? []) as unknown[]
    const typeMatch = typeArr.find((o) => {
      const r = o as Record<string, unknown>
      const candidate = r.value ?? r.id ?? r.code
      return String(candidate ?? '') === String(d.type_of_investment ?? '')
    }) as Record<string, unknown> | undefined

    const normalizedTypeInvestment =
      typeMatch &&
      (preferKeys
        .map((k) => typeMatch[k] as unknown)
        .find((v) => v !== undefined && v !== null && v !== '') as
        | string
        | number
        | undefined)

    models.value = {
      trader_id: d.trader_id,
      general_quota: d.general_quota,
      individual_quota: d.individual_quota,
      investment_portfolio_id:
        normalizedPortfolio ?? d.investment_portfolio_id ?? d.portfolio_code,
      counterpart_id: d.counterpart_id,
      emitter_id: d.emitter_id,
      paper_type_id: d.paper_type_id,
      type_investment: normalizedTypeInvestment ?? d.type_of_investment,

      description_trader: d.description_trader,
      description_counterpart_name: d.description_counterpart_name,
      description_emitter_name: d.description_emitter_name,
      description_portfolio_name: d.description_portfolio_name,
    }

    if (
      !models.value.description_trader ||
      models.value.description_trader.trim() === ''
    ) {
      const usersArr = (users.value ?? []) as unknown[]
      const t = usersArr.find((u) => {
        const r = u as Record<string, unknown>
        return (
          String(r.value ?? r.id ?? '') === String(models.value.trader_id ?? '')
        )
      }) as Record<string, unknown> | undefined

      const name = (t?.name as string | undefined) ?? ''
      const last = (t?.last_name as string | undefined) ?? ''
      if (name) {
        models.value.description_trader = truncateText(`${name} ${last}`, 18)
      }
    }

    nextTick(setDescriptionsFromCurrent)
  }

  onMounted(() => {
    handlerActionForm(props.action)
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) handlerActionForm(props.action)
    },
    { deep: true }
  )

  watch(
    () => models.value.trader_id,
    (traderId) => {
      if (traderId && users.value) {
        const trader = users.value.find((u) => {
          const r = u as unknown as Record<string, unknown>
          return String(r.value) === String(traderId)
        }) as Record<string, unknown> | undefined

        const name = (trader?.name as string | undefined) ?? ''
        const last = (trader?.last_name as string | undefined) ?? ''
        models.value.description_trader = name
          ? truncateText(`${name} ${last}`, 18)
          : ''
      } else {
        models.value.description_trader = ''
      }
    }
  )

  watch(
    () => models.value.type_investment,
    async (newVal, oldVal) => {
      if (!newVal) {
        models.value.paper_type_id = null
        return
      }

      if (oldVal !== newVal) {
        models.value.paper_type_id = null
        await _getResources({
          investment_portfolio: [
            `paper_type&filter[inversion_type_id]=${newVal}`,
          ],
        })
      }
    }
  )

  watch(
    () => models.value.counterpart_id,
    (counterpartId) => {
      if (counterpartId && third_party_issuers_selector.value) {
        const counterpart = third_party_issuers_selector.value.find((c) => {
          const r = c as unknown as Record<string, unknown>
          return String(r.id) === String(counterpartId)
        }) as Record<string, unknown> | undefined

        models.value.description_counterpart_name =
          (counterpart?.description as string | undefined) ?? ''
      } else {
        models.value.description_counterpart_name = ''
      }
    }
  )

  return {
    models,
    formInformation,
    individualQuotaInputRef,
    type_investment,
    investment_portfolio,
    third_party_issuers_selector,
    users,
    inversion_types,
    paper_type,

    is_required,
    only_number_with_max_integers_and_decimals,
    not_greater_than,
  }
}
