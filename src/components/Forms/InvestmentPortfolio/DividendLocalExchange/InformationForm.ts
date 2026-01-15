import { computed, onMounted, ref, toRaw, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { ActionType } from '@/interfaces/global'
import type {
  IDividendLocalEdit,
  IDividendLocalItem,
  IHistoryDividendLocal,
  MaybeBool,
  MaybeNumber,
  MaybeString,
} from '@/interfaces/customs'
import { useDividendLocalStore } from '@/stores'
import { useInvestmentPortfolioResourceStore } from '@/stores'

export const useInformationForm = (props: {
  action: ActionType
  id?: number
  hasLoadedData: boolean
}) => {
  const { dividend_local_raw } = storeToRefs(useDividendLocalStore('v1'))
  const resources = useInvestmentPortfolioResourceStore('v1')
  const { emitter_anna_codes_by_id, exchange_traded_fund_local } =
    storeToRefs(resources)
  const informationForm = ref()
  const isEdit = computed(() => props.action === 'edit')
  const isView = computed(() => props.action === 'view')

  const dividend_local = ref<IDividendLocalItem>({
    parameters: {
      emitter_id: 0,
      exchange_traded_fund_id: 0,
      quantity_exchange_traded_fund: 0,
    },
    register_dividend: {
      register_date: '',
      dividend_type: '',
      dividend_value: 0,
      enforceability_date: '',
      ex_dividend_date: '',
      graved: false,
      currency_id: 0,
      currency_code: '',
      currency_value: 0,
      tax_value: 0,
      value_tax_currency: 0,
      dividend_value_after_tax: 0,
    },
    values_compliance: {
      date_pay_dividend: '',
      enforceability_value_dividend: 0,
    },
    history: {
      created_at: '',
      created_by_user: '',
      updated_at: '',

      updated_by_user: '',
    },
  })

  // const currencyOptions = computed(() => coins.value ?? [])

  const validateForm = () => informationForm.value?.validate?.()

  const getFormData = () => {
    const src: IDividendLocalItem = toRaw(dividend_local.value)
    return {
      parameters: { ...src.parameters },
      register_dividend: { ...src.register_dividend },
      values_compliance: { ...src.values_compliance },
      history: { ...src.history },
    }
  }

  onMounted(() => {
    if (!(isEdit.value || isView.value)) return

    const stop = watch(
      () => ({
        ready: props.hasLoadedData,
        resourcesReady:
          (emitter_anna_codes_by_id.value?.length ?? 0) > 0 &&
          (exchange_traded_fund_local.value?.length ?? 0) > 0,
        raw: dividend_local_raw.value,
      }),

      ({ ready, resourcesReady, raw }) => {
        if (!ready || !resourcesReady || !raw) return
        setEditPayload(raw as IDividendLocalEdit)
        recalcDerived()
        stop()
      },
      { immediate: true, deep: true }
    )
  })

  const setEditPayload = (api: IDividendLocalEdit) => {
    const p = api?.parameters
    if (p) {
      dividend_local.value.parameters.emitter_id =
        num(p.emitter?.id, dividend_local.value.parameters.emitter?.id) ?? 0
      dividend_local.value.parameters.exchange_traded_fund_id =
        num(
          p.exchange_traded_fund?.id,
          dividend_local.value.parameters.exchange_traded_fund?.id
        ) ?? 0
      dividend_local.value.parameters.quantity_exchange_traded_fund =
        num(
          p.quantity_exchange_traded_fund,
          dividend_local.value.parameters.quantity_exchange_traded_fund
        ) ?? 0
    }

    const rd = api?.register_dividend
    if (rd) {
      dividend_local.value.register_dividend.register_date = str(
        rd.register_date,
        ''
      )
      dividend_local.value.register_dividend.dividend_type = str(
        rd.dividend_type,
        ''
      )
      dividend_local.value.register_dividend.enforceability_date = str(
        rd.enforceability_date,
        ''
      )
      dividend_local.value.register_dividend.ex_dividend_date = str(
        rd.ex_dividend_date,
        ''
      )
      dividend_local.value.register_dividend.dividend_value =
        num(
          rd.dividend_value,
          dividend_local.value.register_dividend.dividend_value
        ) ?? 0
      dividend_local.value.register_dividend.currency_value =
        num(
          rd.currency?.value,
          dividend_local.value.register_dividend.currency?.value
        ) ?? 0
      dividend_local.value.register_dividend.graved = bool(
        rd.graved,
        dividend_local.value.register_dividend.graved
      )
      dividend_local.value.register_dividend.tax_value =
        num(rd.tax_value, dividend_local.value.register_dividend.tax_value) ?? 0
      dividend_local.value.register_dividend.value_tax_currency =
        num(
          rd.value_tax_currency,
          dividend_local.value.register_dividend.value_tax_currency
        ) ?? 0
      dividend_local.value.register_dividend.dividend_value_after_tax =
        num(
          rd.dividend_value_after_tax,
          dividend_local.value.register_dividend.dividend_value_after_tax
        ) ?? 0
      dividend_local.value.register_dividend.currency_id =
        num(
          rd.currency_id,
          dividend_local.value.register_dividend.currency_id
        ) ?? 0
    }

    const vc = api?.values_compliance
    if (vc) {
      dividend_local.value.values_compliance.date_pay_dividend = str(
        vc.date_pay_dividend,
        ''
      )
      dividend_local.value.values_compliance.enforceability_value_dividend =
        num(
          vc.enforceability_value_dividend,
          dividend_local.value.values_compliance.enforceability_value_dividend
        ) ?? 0
    }
    const h = api?.history
    if (h) {
      dividend_local.value.history = {
        created_at: str(h.created_at, ''),
        created_by_user: str(h.created_by_user, ''),
        updated_at: str(h.updated_at, ''),
        updated_by_user: str(h.updated_by_user, ''),
      }
    }
  }

  const num = (
    v: MaybeNumber,
    fallback: number | null | undefined
  ): number | null => {
    if (
      v === undefined ||
      v === null ||
      (typeof v === 'string' && v.trim() === '')
    )
      return fallback ?? null
    const n = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(n) ? n : fallback ?? null
  }

  const str = (v: MaybeString, fallback: string): string =>
    typeof v === 'string' ? v : fallback

  const bool = (v: MaybeBool, fallback: boolean): boolean => {
    if (typeof v === 'boolean') return v
    if (typeof v === 'number') return v === 1
    if (typeof v === 'string') return v.toLowerCase() === 'true' || v === '1'
    return fallback
  }

  const recalcDerived = () => {
    const qty = dividend_local.value.parameters.quantity_exchange_traded_fund
    const div = dividend_local.value.register_dividend.dividend_value
    const taxPct = dividend_local.value.register_dividend.tax_value

    const taxLocal = (div * taxPct) / 100
    const afterTax = div + taxLocal
    const enforceability = qty * afterTax

    dividend_local.value.register_dividend.value_tax_currency = taxLocal
    dividend_local.value.register_dividend.dividend_value_after_tax = afterTax
    dividend_local.value.values_compliance.enforceability_value_dividend =
      enforceability
  }

  watch(
    () => [
      dividend_local.value.register_dividend.dividend_value,
      dividend_local.value.register_dividend.tax_value,
      dividend_local.value.parameters.quantity_exchange_traded_fund,
    ],
    () => recalcDerived(),
    { deep: false }
  )

  watch(
    () => [dividend_local.value.parameters.exchange_traded_fund_id],
    () => {
      const etf = exchange_traded_fund_local.value?.find(
        (etf) =>
          Number(etf.value) ===
          Number(dividend_local.value.parameters.exchange_traded_fund_id)
      )
      if (etf) {
        dividend_local.value.register_dividend.currency_id =
          etf.currency?.id ?? 0
        dividend_local.value.register_dividend.currency_value = 1
        dividend_local.value.register_dividend.currency_code =
          etf.currency?.code ?? ''
        const totalQty =
          typeof etf.total_quantity_in_title === 'number'
            ? etf.total_quantity_in_title
            : Number(etf.total_quantity_in_title ?? 0)
        dividend_local.value.parameters.quantity_exchange_traded_fund =
          Number.isFinite(totalQty) ? totalQty : 0
      }
    },
    { deep: true }
  )

  const history = computed<IHistoryDividendLocal | null>(() => {
    let data = dividend_local.value?.history ?? null

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch {
        return null
      }
    }
    if (!data || typeof data !== 'object') return null

    const obj = data as Record<string, unknown>

    return {
      created_at: String(obj['created_at'] ?? ''),
      created_by_user: String(obj['created_by_user'] ?? ''),
      updated_at: String(obj['updated_at'] ?? ''),
      updated_by_user: String(obj['updated_by_user'] ?? ''),
    }
  })

  return {
    informationForm,
    dividend_local,
    isEdit,
    isView,
    emitter_anna_codes_by_id,
    exchange_traded_fund_local,
    history,
    // coins,
    // currencyOptions,
    validateForm,
    getFormData,
    setEditPayload,
  }
}
