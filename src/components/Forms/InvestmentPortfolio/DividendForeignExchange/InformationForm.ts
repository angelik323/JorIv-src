import { computed, onMounted, ref, toRaw, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { ActionType } from '@/interfaces/global'
import type {
  IDividendForeignItem,
  IDividendForeignEdit,
  IHistoryDividendForeign,
  MaybeNumber,
  MaybeString,
  MaybeBool,
} from '@/interfaces/customs'
import { useDividendForeignStore } from '@/stores'
import { useInvestmentPortfolioResourceStore } from '@/stores'

export const useInformationForm = (props: {
  action: ActionType
  id?: number
  hasLoadedData: boolean
}) => {
  const { dividend_foreign_raw } = storeToRefs(useDividendForeignStore('v1'))
  const resources = useInvestmentPortfolioResourceStore('v1')
  const { emitter_anna_codes_by_id, exchange_traded_fund_foreign } =
    storeToRefs(resources)

  const informationForm = ref()
  const isEdit = computed(() => props.action === 'edit')
  const isView = computed(() => props.action === 'view')

  const dividend_local = ref<IDividendForeignItem>({
    parameters: {
      emitter_id: 0,
      exchange_traded_fund_id: 0,
      quantity_exchange_traded_fund: 0,
    },
    register_dividend: {
      register_date: '',
      dividend_type: '',
      enforceability_date: '',
      ex_dividend_date: '',
      graved: false,

      tax_value: 0,

      origin_currency_id: 0,
      origin_currency_code: '',
      origin_currency_value: 0,

      origin_currency_value_tax: 0,
      origin_currency_dividend_value_after_tax: 0,
      origin_currency_unit_value: 0,

      local_currency_value_tax: 0,
      local_currency_dividend_value_after_tax: 0,
      local_currency_unit_value: 0,
    },
    values_compliance: {
      date_pay_dividend: '',
      origin_currency_enforceability_value_dividend: 0,
      local_currency_enforceability_value_dividend: 0,
    },
  })

  const validateForm = () => informationForm.value?.validate?.()

  const getFormData = () => {
    const src: IDividendForeignItem = toRaw(dividend_local.value)
    return {
      parameters: { ...src.parameters },
      register_dividend: { ...src.register_dividend },
      values_compliance: { ...src.values_compliance },
    }
  }

  onMounted(() => {
    if (!(isEdit.value || isView.value)) return
    const stop = watch(
      () => ({
        ready: props.hasLoadedData,
        resourcesReady:
          (emitter_anna_codes_by_id.value?.length ?? 0) > 0 &&
          (exchange_traded_fund_foreign.value?.length ?? 0) > 0,
        raw: dividend_foreign_raw.value,
      }),
      ({ ready, resourcesReady, raw }) => {
        if (!ready || !resourcesReady || !raw) return
        setEditPayload(raw as unknown as IDividendForeignEdit)
        recalcDerived()
        stop()
      },
      { immediate: true, deep: true }
    )
  })

  const setEditPayload = (api: IDividendForeignEdit) => {
    const p = api?.parameters
    if (p) {
      dividend_local.value.parameters.emitter_id = num(p.emitter?.id, 0) ?? 0
      dividend_local.value.parameters.exchange_traded_fund_id =
        num(p.exchange_traded_fund?.id, 0) ?? 0
      dividend_local.value.parameters.quantity_exchange_traded_fund =
        num(p.quantity_exchange_traded_fund, 0) ?? 0
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
      dividend_local.value.register_dividend.graved = bool(
        rd.graved,
        dividend_local.value.register_dividend.graved
      )
      dividend_local.value.register_dividend.tax_value =
        num(rd.tax_value, 0) ?? 0

      dividend_local.value.register_dividend.origin_currency_id =
        num(rd.origin_currency_id, 0) ?? 0
      dividend_local.value.register_dividend.origin_currency_value =
        num(rd.origin_currency?.value, 0) ?? 0
      dividend_local.value.register_dividend.origin_currency_unit_value =
        num(rd.origin_currency?.unit_value, 0) ?? 0

      dividend_local.value.register_dividend.origin_currency_value_tax =
        num(rd.origin_currency_value_tax, 0) ?? 0
      dividend_local.value.register_dividend.origin_currency_dividend_value_after_tax =
        num(rd.origin_currency_dividend_value_after_tax, 0) ?? 0

      dividend_local.value.register_dividend.local_currency_unit_value =
        num(rd.local_currency_unit_value, 0) ?? 0
      dividend_local.value.register_dividend.local_currency_value_tax =
        num(rd.local_currency_value_tax, 0) ?? 0
      dividend_local.value.register_dividend.local_currency_dividend_value_after_tax =
        num(rd.local_currency_dividend_value_after_tax, 0) ?? 0
    }

    const vc = api?.values_compliance
    if (vc) {
      dividend_local.value.values_compliance.date_pay_dividend = str(
        vc.date_pay_dividend,
        ''
      )
      dividend_local.value.values_compliance.origin_currency_enforceability_value_dividend =
        num(vc.origin_currency_enforceability_value_dividend, 0) ?? 0
      dividend_local.value.values_compliance.local_currency_enforceability_value_dividend =
        num(vc.local_currency_enforceability_value_dividend, 0) ?? 0
    }

    if (api.history) {
      dividend_local.value.history = api.history
    }
  }

  const num = (v: MaybeNumber, fallback: number | null): number | null => {
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
    const qty =
      Number(
        dividend_local.value.parameters.quantity_exchange_traded_fund ?? 0
      ) || 0
    const unitOrigin =
      Number(
        dividend_local.value.register_dividend.origin_currency_unit_value ?? 0
      ) || 0
    const fx =
      Number(
        dividend_local.value.register_dividend.origin_currency_value ?? 0
      ) || 0
    const taxPct =
      Number(dividend_local.value.register_dividend.tax_value ?? 0) || 0

    const originTax = (unitOrigin * taxPct) / 100

    const originAfterTax = unitOrigin - originTax

    const originEnforceability = originAfterTax * qty

    const localTax = originTax * fx

    const localAfterTax = originAfterTax * fx

    const localUnit = unitOrigin * fx

    const localEnforceability = originEnforceability * fx

    dividend_local.value.register_dividend.origin_currency_value_tax = originTax
    dividend_local.value.register_dividend.origin_currency_dividend_value_after_tax =
      originAfterTax

    dividend_local.value.values_compliance.origin_currency_enforceability_value_dividend =
      originEnforceability

    dividend_local.value.register_dividend.local_currency_value_tax = localTax
    dividend_local.value.register_dividend.local_currency_dividend_value_after_tax =
      localAfterTax
    dividend_local.value.register_dividend.local_currency_unit_value = localUnit

    dividend_local.value.values_compliance.local_currency_enforceability_value_dividend =
      localEnforceability
  }

  watch(
    () => [
      dividend_local.value.parameters.quantity_exchange_traded_fund,
      dividend_local.value.register_dividend.tax_value,
      dividend_local.value.register_dividend.origin_currency_value,
      dividend_local.value.register_dividend.origin_currency_unit_value,
    ],
    () => recalcDerived(),
    { deep: false }
  )

  watch(
    () => [dividend_local.value.parameters.exchange_traded_fund_id],
    () => {
      const etf = exchange_traded_fund_foreign.value?.find(
        (etf) =>
          Number(etf.value) ===
          Number(dividend_local.value.parameters.exchange_traded_fund_id)
      )
      if (etf) {
        dividend_local.value.register_dividend.origin_currency_id =
          etf.currency?.id ?? 0
        dividend_local.value.register_dividend.origin_currency_value = 1
        dividend_local.value.register_dividend.origin_currency_code =
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

  const history = computed<IHistoryDividendForeign | null>(() => {
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
    exchange_traded_fund_foreign,
    history,
    // coins,
    // currencyOptions,
    validateForm,
    getFormData,
    setEditPayload,
  }
}
