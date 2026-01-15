import { computed, ref, watch, nextTick } from 'vue'
import { QForm } from 'quasar'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useRules } from '@/composables/useRules'
import {
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'
import {
  IOptions,
  IRegisterFixedIncomeLocalCurrencyPayload,
  ICounterpartyResource,
  IIssuerDepositResource,
} from '@/interfaces/customs'
import {
  COMPENSATION_SYSTEMS,
  interest_rate_payment_code_description_options,
  interest_rate_mode_code_description_options,
} from '@/constants'

const useInformationForm = () => {
  const rules = useRules()
  const req = (v: string) => rules.is_required(v)
  const numDec10 = (v: unknown) =>
    rules.only_number_with_decimals(String(v ?? ''), 10)
  const dateFmt = (v: string) => rules.valid_format_date(v, 'YYYY-MM-DD')

  const resources = useInvestmentPortfolioResourceStore('v1')
  const {
    investment_portfolio,
    operation_type,
    list_emitter_associated_trader,
    isin_codes_mnemonics_portfolio,
    paper_type_encompass_and_division,
    list_counterparty_associated_trader,
    issuer_deposit,
    rate_type,
  } = storeToRefs(resources)

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref<QForm | null>(null)
  const currency_value = ref<number | null>(null)

  const formData = ref<IRegisterFixedIncomeLocalCurrencyPayload>({
    investment_portfolio_id: null,
    portfolio_description: '',
    operation_type_id: null,
    operation_date: moment().format('YYYY-MM-DD'),
    market: 'Primario',
    issuer_id: null,
    isin_code_id: null,
    mnemonic: '',
    issue_date: '',
    maturity_date: '',
    perioricity: '',
    rate_type: '',
    fixed_rate_value: null,
    rate_code: null,
    modality: '',
    spread: null,
    rate_class: '',
    paper_type_id: null,
    face_value: null,
    purchase_value: null,
    currency_id: null,
    currency_code: null,
    counterparty_id: null,
    deposit_issuer_id: null,
    compensation_system: '',
    folio: null,
    title_id: null,
  })

  const isPrimaryMarket = computed(() => formData.value.market === 'Primario')
  const isIsinDisabled = computed(() => formData.value.market !== 'Secundario')

  const isSpreadDisabled = computed(
    () => !isPrimaryMarket.value || formData.value.rate_type !== 'Variable'
  )

  const isRateCodeDisabled = computed(
    () =>
      formData.value.market === 'Secundario' ||
      formData.value.rate_type !== 'Variable'
  )

  const periodicityOptions = computed<IOptions[]>(() => {
    return formData.value.market === 'Primario'
      ? interest_rate_payment_code_description_options
      : selectOptions.value.periodicities
  })

  const modalityOptions = computed<IOptions[]>(() => {
    return formData.value.market === 'Primario'
      ? interest_rate_mode_code_description_options
      : selectOptions.value.modalities
  })

  const rateTypeOptions = computed<IOptions[]>(() => {
    return formData.value.market === 'Primario'
      ? ((rate_type.value ?? []) as IOptions[])
      : selectOptions.value.rate_types ?? []
  })

  const reqRateCode = (v: unknown) => {
    if (formData.value.rate_type === 'Variable') {
      return rules.is_required(String(v ?? ''))
    }
    return true
  }

  const counterpartiesOptions = computed<IOptions[]>(() => {
    const raw = (list_counterparty_associated_trader.value ??
      []) as ICounterpartyResource[]
    return raw.map((c) => ({
      label: `${c.counterparty_document} - ${c.counterparty_name}`,
      value: Number(c.counterparty_id),
    }))
  })

  const depositsOptions = computed<IOptions[]>(() => {
    const raw = (issuer_deposit.value ?? []) as IIssuerDepositResource[]
    return raw.map((d) => ({
      label: d.value,
      value: Number(d.id),
    }))
  })

  const selectOptions = computed(() => ({
    investment_portfolio: investment_portfolio.value ?? [],
    operation_type: operation_type.value ?? [],
    issuers: list_emitter_associated_trader.value ?? [],
    isins: isin_codes_mnemonics_portfolio.value ?? [],
    paper_types: paper_type_encompass_and_division.value ?? [],
    counterparties: counterpartiesOptions.value,
    deposits: depositsOptions.value,
    periodicities: [] as IOptions[],
    modalities: [] as IOptions[],
    rate_types: [] as IOptions[],
    compensation_systems: COMPENSATION_SYSTEMS,
  }))

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

  // Campos derivados del isin seleccionado
  watch(
    () => formData.value.isin_code_id,
    (newVal) => {
      const isin = selectOptions.value.isins.find(
        ({ value }) => value === newVal
      )

      formData.value.mnemonic = (isin?.mnemonic ?? '').toString().slice(0, 12)
      formData.value.issue_date = isin?.issue_date ?? ''
      formData.value.maturity_date = isin?.maturity_date ?? ''
      formData.value.perioricity = isin?.perioricity ?? ''
      formData.value.rate_type = isin?.rate_type ?? ''
      formData.value.rate_code = isin?.rate_code ?? null
      formData.value.fixed_rate_value =
        isin?.fixed_rate_value !== undefined && isin?.fixed_rate_value !== null
          ? Number(isin.fixed_rate_value)
          : null
      formData.value.modality = isin?.modality ?? ''
      formData.value.spread =
        isin?.spread !== undefined && isin?.spread !== null
          ? Number(isin.spread)
          : null
    }
  )

  // Limpia campos al cambiar de tipo de mercado
  watch(
    () => formData.value.market,
    () => {
      formData.value.isin_code_id = null
      formData.value.mnemonic = ''
      formData.value.issue_date = ''
      formData.value.maturity_date = ''
      formData.value.perioricity = ''
      formData.value.rate_type = ''
      formData.value.rate_code = null
      formData.value.fixed_rate_value = null
      formData.value.modality = ''
      formData.value.spread = null
    }
  )

  // Campos derivados del papel seleccionado
  watch(
    () => formData.value.paper_type_id,
    (newVal) => {
      const paper = paper_type_encompass_and_division.value.find(
        ({ value }) => value === newVal
      )

      formData.value.currency_id = paper?.currency?.id ?? null
      formData.value.currency_code = paper?.currency?.code ?? null
      currency_value.value = Number(paper?.currency?.value) || null
    }
  )

  // Isin por emisor
  watch(
    () => formData.value.issuer_id,
    async (newVal) => {
      _resetKeys({
        investment_portfolio: [
          'isin_code_mnemonics',
          'isin_codes_mnemonics_portfolio',
        ],
      })
      formData.value.isin_code_id = null

      if (newVal) {
        await _getResources(
          { investment_portfolio: ['isin_code_mnemonics'] },
          `filter[issuer_id]=${newVal}`
        )
      }
    }
  )

  const resetForm = async () => {
    formData.value = {
      investment_portfolio_id: null,
      operation_type_id: null,
      operation_date: moment().format('YYYY-MM-DD'),
      market: 'Primario',
      issuer_id: null,
      isin_code_id: null,
      mnemonic: '',
      issue_date: '',
      maturity_date: '',
      perioricity: '',
      rate_type: '',
      fixed_rate_value: null,
      rate_code: null,
      modality: '',
      spread: null,
      rate_class: '',
      paper_type_id: null,
      face_value: null,
      purchase_value: null,
      currency_id: null,
      currency_code: null,
      counterparty_id: null,
      deposit_issuer_id: null,
      compensation_system: '',
      folio: null,
      title_id: null,
    }

    await nextTick()
    informationFormRef.value?.resetValidation()
  }

  return {
    informationFormRef,
    formData,
    isPrimaryMarket,
    selectOptions,
    currency_value,
    rateTypeOptions,
    interest_rate_mode_code_description_options,
    interest_rate_payment_code_description_options,
    isIsinDisabled,
    isRateCodeDisabled,
    periodicityOptions,
    modalityOptions,
    isSpreadDisabled,
    reqRateCode,
    req,
    numDec10,
    dateFmt,
    resetForm,
  }
}

export default useInformationForm
