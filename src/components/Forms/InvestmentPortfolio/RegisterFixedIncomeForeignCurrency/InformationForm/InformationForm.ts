import { computed, ref, watch } from 'vue'
import { QForm } from 'quasar'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useRules } from '@/composables/useRules'
import {
  useInvestmentPortfolioResourceStore,
  useRegisterFixedIncomeForeignCurrencyStore,
  useResourceManagerStore,
} from '@/stores'
import {
  ISelectOptionWithMeta,
  IIsinApiResponse,
  IIsinMetadata,
  ICurrencyMetadata,
  ICurrencyForPaperTypeRaw,
  ISelectOpti,
  ICounterpartyResource,
  IOptionss,
} from '@/interfaces/customs'

const useInformationForm = () => {
  const rules = useRules()
  const req = (v: string) => rules.is_required(v)
  const numDec10 = (v: unknown) =>
    rules.only_number_with_decimals(String(v ?? ''), 10)
  const dateFmt = (v: string) => rules.valid_format_date(v, 'YYYY-MM-DD')
  const dateLTEtoday = (v: string) =>
    rules.date_before_or_equal_to_the_current_date(v)

  const resources = useInvestmentPortfolioResourceStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _setCurrencyDescription,
    _setNumberDays,
    _setOperationType,
    _setCurrencyValue,
  } = useRegisterFixedIncomeForeignCurrencyStore('v1')

  const {
    investment_portfolio,
    operation_type,
    isin_code_mnemonics,
    market_types_buy_fixed_income,
    currency_for_paper_type,
    list_emitter_associated_trader,
    list_counterparty_associated_trader,
    paper_type_local_currency,
  } = storeToRefs(resources)

  const informationFormRef = ref<QForm | null>(null)
  const currency_value = ref<number | null>(null)
  const showDays = ref<boolean>(false)

  const formData = ref({
    investment_portfolio_id: null as number | null,
    portfolio_description: '',
    operation_date: moment().format('YYYY-MM-DD'),
    operation_type_id: null as number | null,
    operation_type: 'Operacion Spot',
    number_days: null as number | null,
    market: '',
    issuer_id: null as number | null,
    isin_code_id: null as number | null,
    mnemonic: '',
    issue_date: '',
    maturity_date: '',
    perioricity: '',
    modality: '',
    paper_type_id: null as number | null,
    rate_type: '',
    rate_code: null as string | null,
    fixed_rate_value: null as number | null,
    currency_id: null as number | null,
    currency_value: null as number | null,
    face_value: null as number | null,
    purchase_value: null as number | null,
    counterparty_id: null as number | null,
    investment_class: 'IN',

    trader: 'UAS_HU0001',
    operation_type_description: null as string | null,
    issuer_nit: null as string | null,
    issuer_name: '',
    paper_type_description: null as string | null,
    paper_flow_type: null as 'I' | 'C' | null,
    spread: null as number | null,
    currency_description: null as string | null,
    counterparty_nit: null as string | null,
    counterparty_name: null as string | null,

    complies_origin_currency: true,
    complies_currency_id: null as number | null,
    currency_value_negotiation: null as number | null,
    compliance_date: '',
    placement_resource_date: null as string | null,
    compliace_value_currency_origin: null as number | null,
    spot_rate_value: null as number | null,
    spot_rate_compliance_value: null as number | null,
    conversion_factor: null as number | null,
    local_currency_compliance_transfer: null as number | null,

    flows: [] as { date: string; interest: number; capital: number }[],
    tir_purchase: null as number | null,
  })

  const isinsOptions = computed<ISelectOptionWithMeta<IIsinMetadata>[]>(() => {
    const raw = (isin_code_mnemonics.value ??
      []) as unknown as IIsinApiResponse[]
    return raw.map((r) => ({
      label: `${r.isin_code}- ${r.description}`,
      value: r.isin_code_id,
      meta: {
        mnemonic: r.mnemonic ?? '',
        issue_date: r.issue_date ?? '',
        maturity_date: r.maturity_date ?? '',
        due_date: r.maturity_date ?? '',
        perioricity: r.perioricity ?? '',
        periodicity: r.perioricity ?? '',
        rate_type: r.rate_type ?? '',
        rate_code: r.rate_code ?? '',
        fixed_rate_value: r.fixed_rate_value ?? '0',
        modality: r.modality ?? '',
        spread: r.spread ?? '',
      },
    }))
  })

  const currenciesOptions = computed<
    ISelectOptionWithMeta<ICurrencyMetadata>[]
  >(() => {
    const raw = (currency_for_paper_type.value ??
      []) as unknown as ICurrencyForPaperTypeRaw[]
    const pt = formData.value.paper_type_id

    const filtered = pt
      ? raw.filter((r) => Number(r.paper_type_id ?? 0) === Number(pt))
      : raw

    return filtered.map((r) => ({
      label: `${r.currency_code} - ${r.description_currency}`,
      value: Number(r.currency_id),
      meta: {
        rate: Number(r.value ?? 0),
        code: r.currency_code,
        type_of_currency: r.type_of_currency ?? '',
        paper_type_id: Number(r.paper_type_id ?? 0),
        paper_type_code: r.paper_type_code ?? null,
      },
    }))
  })

  const reqRateCode = (v: unknown) => {
    if (formData.value.rate_type === 'Variable') {
      return rules.is_required(String(v ?? ''))
    }
    return true
  }

  const counterpartiesOptions = computed<IOptionss[]>(() => {
    const raw = (list_counterparty_associated_trader.value ??
      []) as ICounterpartyResource[]
    return raw.map((c) => ({
      label: `${c.counterparty_document} - ${c.counterparty_name}`,
      value: Number(c.counterparty_id),
    }))
  })

  const selectOptions = computed(() => ({
    investment_portfolio: investment_portfolio.value ?? [],
    operation_type: operation_type.value ?? [],
    issuers: list_emitter_associated_trader.value ?? [],
    counterparties: counterpartiesOptions.value,
    isins: isinsOptions.value,
    paper_types: paper_type_local_currency.value,
    currencies: currenciesOptions.value,
    periodicities: [] as ISelectOpti[],
    modalities: [] as ISelectOpti[],
    rate_types: [] as ISelectOpti[],
    rate_codes: [] as ISelectOpti[],
    market_types_buy_fixed_income: market_types_buy_fixed_income.value ?? [],
  }))

  watch(
    () => formData.value.isin_code_id,
    (isinId) => {
      if (!isinId) return
      const opt = selectOptions.value.isins.find((o) => o.value === isinId)
      const m = opt?.meta
      formData.value.mnemonic = (m?.mnemonic ?? '').toString().slice(0, 12)
      formData.value.issue_date = m?.issue_date ?? ''
      formData.value.maturity_date = m?.maturity_date ?? ''
      formData.value.perioricity = m?.perioricity ?? ''
      formData.value.rate_type = m?.rate_type ?? ''
      formData.value.rate_code = (m?.rate_code ?? '') || null
      formData.value.fixed_rate_value =
        m?.fixed_rate_value !== undefined && m?.fixed_rate_value !== null
          ? Number(m.fixed_rate_value)
          : null
      formData.value.modality = m?.modality ?? ''
      formData.value.spread =
        m?.spread !== undefined && m?.spread !== null ? Number(m.spread) : null
    }
  )

  watch(
    () => formData.value.issuer_id,
    async (issuerId) => {
      await _resetKeys({
        investment_portfolio: ['isin_code_mnemonics'],
      })
      formData.value.isin_code_id = null
      formData.value.mnemonic = ''
      formData.value.issue_date = ''
      formData.value.maturity_date = ''
      formData.value.perioricity = ''
      formData.value.modality = ''
      formData.value.rate_type = ''
      formData.value.rate_code = null
      formData.value.fixed_rate_value = null
      formData.value.spread = null
      if (!issuerId) return
      await _getResources({
        investment_portfolio: [
          `isin_code_mnemonics&filter[issuer_id]=${issuerId}`,
        ],
      })
    }
  )

  watch(
    [() => formData.value.currency_id, () => selectOptions.value.currencies],
    () => {
      const selected = (
        selectOptions.value
          .currencies as ISelectOptionWithMeta<ICurrencyMetadata>[]
      ).find((o) => Number(o.value) === Number(formData.value.currency_id))

      currency_value.value = selected?.meta?.rate ?? null
      formData.value.currency_value = currency_value.value ?? null
      _setCurrencyValue(currency_value.value)
    },
    { immediate: true }
  )

  watch(
    [
      () => formData.value.investment_portfolio_id,
      () => selectOptions.value.investment_portfolio,
    ],
    ([id]) => {
      const opts = (selectOptions.value.investment_portfolio ??
        []) as unknown as ISelectOpti[]
      const opt = opts.find((o) => Number(o.value) === Number(id))

      if (opt?.label) {
        const labelStr = typeof opt.label === 'string' ? opt.label : ''
        const parts = labelStr.split('-')
        formData.value.portfolio_description =
          parts.length > 1 ? parts.slice(1).join('-').trim() : labelStr
      } else {
        formData.value.portfolio_description = ''
      }
    },
    { immediate: true }
  )

  watch(
    [() => formData.value.paper_type_id, () => currency_for_paper_type.value],
    () => {
      const opts = currenciesOptions.value
      const current = Number(formData.value.currency_id)
      const currencyDescription = opts[0].label ?? ''
      _setCurrencyDescription(currencyDescription)
      const exists = opts.some((o) => Number(o.value) === current)

      if (!exists) {
        formData.value.currency_id =
          opts.length === 1 ? Number(opts[0].value) : null
      }

      const selected = opts.find(
        (o) => Number(o.value) === Number(formData.value.currency_id)
      )
      currency_value.value = selected?.meta?.rate ?? null
      formData.value.currency_value = currency_value.value ?? null
      _setCurrencyValue(currency_value.value)
    },
    { immediate: true }
  )

  // Gestiona dependencias del portafolio
  watch(
    () => formData.value.investment_portfolio_id,
    async (newVal) => {
      _resetKeys({ investment_portfolio: ['list_emitter_associated_trader'] })
      formData.value.portfolio_description = ''
      formData.value.issuer_id = null

      if (!newVal) return

      const portfolio = selectOptions.value.investment_portfolio.find(
        ({ value }) => value === newVal
      )

      // Campos derivados del portafolio
      formData.value.portfolio_description = portfolio?.description ?? ''

      // Actualiza emisores asociados al portafolio
      await _getResources(
        { investment_portfolio: ['list_emitter_associated_trader'] },
        `filter[investment_portfolio_id]=${newVal}`
      )
    }
  )

  // Gestiona dependencias del tipo de operacion
  watch(
    () => formData.value.operation_type,
    (newVal) => {
      if (newVal === 'Operacion Spot') {
        showDays.value = false
      } else {
        showDays.value = true
      }
    }
  )

  watch(
    () => formData.value.number_days,
    (newVal) => {
      _setNumberDays(newVal ?? 0)
    }
  )

  watch(
    () => formData.value.operation_type,
    (newVal) => {
      _setOperationType(newVal)
      formData.value.number_days = null
    }
  )

  watch(
    () => formData.value.isin_code_id,
    (newVal) => {
      const isin = selectOptions.value.isins.find(
        ({ value }) => value === newVal
      )

      formData.value.mnemonic = (isin?.meta.mnemonic ?? '')
        .toString()
        .slice(0, 12)
      formData.value.issue_date = isin?.meta.issue_date ?? ''
      formData.value.maturity_date = isin?.meta.maturity_date ?? ''
      formData.value.perioricity = isin?.meta.perioricity ?? ''
      formData.value.rate_type = isin?.meta.rate_type ?? ''
      formData.value.rate_code = isin?.meta.rate_code ?? null
      formData.value.fixed_rate_value =
        isin?.meta.fixed_rate_value !== undefined &&
        isin?.meta.fixed_rate_value !== null
          ? Number(isin.meta.fixed_rate_value)
          : null
      formData.value.modality = isin?.meta.modality ?? ''
      formData.value.spread =
        isin?.meta.spread !== undefined && isin?.meta.spread !== null
          ? Number(isin.meta.spread)
          : null
    }
  )

  const resetForm = () => {
    formData.value = {
      ...formData.value,
      investment_portfolio_id: null,
      portfolio_description: '',
      operation_date: moment().format('YYYY-MM-DD'),
      operation_type_id: null,
      operation_type: '',
      number_days: null,
      market: '',
      issuer_id: null,
      isin_code_id: null,
      mnemonic: '',
      issue_date: '',
      maturity_date: '',
      perioricity: '',
      modality: '',
      paper_type_id: null,
      rate_type: '',
      rate_code: null,
      fixed_rate_value: null,
      currency_id: null,
      currency_value: null,
      face_value: null,
      purchase_value: null,
      counterparty_id: null,
      investment_class: 'IN',
    }
  }

  return {
    informationFormRef,
    formData,
    selectOptions,
    currency_value,
    showDays,
    reqRateCode,
    req,
    numDec10,
    dateFmt,
    dateLTEtoday,
    resetForm,
  }
}

export default useInformationForm
