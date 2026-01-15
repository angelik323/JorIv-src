import { ref, watch, computed, nextTick } from 'vue'
import { QForm } from 'quasar'
import { ITitleDelivered, ITtvOption, IOptions } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import {
  useInvestmentPortfolioResourceStore,
  useMonetaryMarketOperationsStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { COMPENSATION_SYSTEMS } from '@/constants'

const useTitlesDeliveredForm = (props: {
  action: ActionType
  position: string
  negotiationValue: number | null
  data?: ITitleDelivered
}) => {
  const resources = useInvestmentPortfolioResourceStore('v1')
  const marketStore = useMonetaryMarketOperationsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    issuer_counterparty_local_currency,
    isin_codes_mnemonics_portfolio,
    issuer_deposit,
    currency_local,
    paper_type_encompass_and_division,
  } = storeToRefs(resources)

  const informationFormRef = ref<QForm | null>(null)
  const currency_value = ref<number>(0)

  const COP_CURRENCY_ID = computed(() => {
    return currency_local.value?.find((c) => c.label === 'COP')?.value ?? null
  })

  const formData = ref<ITitleDelivered>({
    title_id: props.data?.title_id ?? null,
    issuer_id: props.data?.issuer_id ?? '',
    isin_code_id: props.data?.isin_code_id ?? null,
    mnemonic: props.data?.mnemonic ?? '',
    paper_type_id: props.data?.paper_type_id ?? null,
    issue_date: props.data?.issue_date ?? '',
    maturity_date: props.data?.maturity_date ?? '',
    rate_type: props.data?.rate_type ?? '',
    rate_code: props.data?.rate_code ?? '',
    rate_value: props.data?.rate_value ?? null,
    spread: props.data?.spread ?? null,
    modality: props.data?.modality ?? '',
    currency_id:
      props.data?.currency_id ??
      (COP_CURRENCY_ID.value !== null ? Number(COP_CURRENCY_ID.value) : null),
    periodicity: props.data?.periodicity ?? '',
    tir_purchase: props.data?.tir_purchase ?? null,
    deposit_id: props.data?.deposit_id ?? null,
    face_value: props.data?.face_value ?? null,
    units_value: props.data?.units_value ?? null,
    market_value: props.data?.market_value ?? null,
  })

  const selectOptions = computed(() => ({
    titles: [] as ITtvOption[],
    issuers: (issuer_counterparty_local_currency.value ?? []) as ITtvOption[],
    isins: isin_codes_mnemonics_portfolio.value ?? [],
    paper_types: paper_type_encompass_and_division.value ?? [],
    deposits: issuer_deposit.value ?? [],
    periodicities: [] as IOptions[],
    modalities: [] as IOptions[],
    rate_types: [] as IOptions[],
    compensation_systems: COMPENSATION_SYSTEMS,
  }))

  watch(
    () => formData.value.paper_type_id,
    (newVal) => {
      const paper = paper_type_encompass_and_division.value.find(
        ({ value }) => value === newVal
      )

      formData.value.currency_id = paper?.currency?.id ?? null
      formData.value.currency_code = paper?.currency?.code ?? null
    }
  )

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) {
        formData.value = { ...formData.value, ...newVal }
      }
    },
    { immediate: true }
  )

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

      if (!newVal) {
        formData.value.title_id = null
        formData.value.tir_purchase = null
        formData.value.units_value = null
        formData.value.face_value = null
        formData.value.deposit_id = null
        return
      }

      await _getResources(
        { investment_portfolio: ['isin_code_mnemonics'] },
        `filter[issuer_id]=${newVal}`
      )

      const titles = await marketStore._getTitlesByIssuer(Number(newVal))

      if (titles && titles.length > 0) {
        const t = titles[0]
        formData.value.title_id = t.id
        formData.value.tir_purchase = t.tir
        formData.value.units_value = t.unit_value
        formData.value.face_value = t.purchase_value ?? null
        formData.value.deposit_id = t.deposit_issuer_id ?? null
      } else {
        formData.value.title_id = null
        formData.value.tir_purchase = null
        formData.value.units_value = null
        formData.value.face_value = null
        formData.value.deposit_id = null
      }
    }
  )

  watch(
    () => formData.value.isin_code_id,
    (newVal) => {
      const isin = selectOptions.value.isins.find(
        ({ value }) => value === newVal
      )

      formData.value.mnemonic = (isin?.mnemonic ?? '').toString().slice(0, 12)
      formData.value.issue_date = isin?.issue_date ?? ''
      formData.value.maturity_date = isin?.maturity_date ?? ''
      formData.value.periodicity = isin?.perioricity ?? ''
      formData.value.rate_type = isin?.rate_type ?? ''
      formData.value.rate_code = isin?.rate_code ?? ''
      formData.value.rate_value =
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

  watch(
    () => formData.value.units_value,
    (newVal) => {
      formData.value.market_value = newVal ?? 0
    }
  )

  const resetForm = async () => {
    formData.value = {
      title_id: null,
      issuer_id: '',
      isin_code_id: null,
      mnemonic: '',
      paper_type_id: null,
      issue_date: '',
      maturity_date: '',
      rate_type: '',
      rate_code: '',
      rate_value: null,
      spread: null,
      modality: '',
      currency_id:
        COP_CURRENCY_ID.value !== null ? Number(COP_CURRENCY_ID.value) : null,
      periodicity: '',
      tir_purchase: null,
      deposit_id: null,
      face_value: null,
      units_value: null,
      market_value: null,
    }
    await nextTick()
    informationFormRef.value?.resetValidation()
  }

  return {
    informationFormRef,
    formData,
    selectOptions,
    currency_value,
    resetForm,
  }
}

export default useTitlesDeliveredForm
