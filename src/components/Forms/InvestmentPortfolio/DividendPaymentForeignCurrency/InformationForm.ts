import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { IEmitterDividend } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import {
  useInvestmentPortfolioResourceStore,
  useDividendPaymentForeignCurrencyStore,
} from '@/stores'

const useInformationForm = (props: {
  action: ActionType
  data?: IEmitterDividend
}) => {
  const {
    operation_type,
    currency_type_of_currency,
    issuer_dividend_class_action,
    issuer_dividend_dividend_type,
    foreign_currency_shar_issuers_selector,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { _shareAction } = useDividendPaymentForeignCurrencyStore('v1')

  const informationFormRef = ref()
  const isExDividend = ref(false)
  const isGravedividend = ref(false)

  const selectOptions = computed(() => ({
    operationCode: operation_type.value,
    currency: currency_type_of_currency.value,
    classActions: issuer_dividend_class_action.value,
    dividendTypes: issuer_dividend_dividend_type.value,
    issuers: foreign_currency_shar_issuers_selector.value,
  }))

  const formData = ref<IEmitterDividend>({
    emitter_id: 0,
    operation_date: moment().format('YYYY-MM-DD'),
    operation_code: '',
    class_action: '',
    unit_id_action: '',
    number_of_shares: 0,
    dividend_type: '',
    dividend_record_date: '',
    ex_dividend_date: moment().format('YYYY-MM-DD'),
    due_date: moment().format('YYYY-MM-DD'),
    payment_date: '',
    has_recorded: 0,
    currency_id: 0,
    dividend_value: 0,
    dividend_value_local_currency: 0,
    tax_percentage: 0,
    dividend_value_after_tax: 0,
    dividend_value_local_currency_after_tax: 0,
    enforceability_value: 0,
    demand_value_local_currency: 0,
    tax_value: 0,
    tax_value_local_currency: 0,
    spot_rate: 0,
    operation_type_description: '',
    operation_type_code: '',
    history_issuer_dividend: {
      created_at: '',
      creator_data: '',
      updated_at: '',
      updated_data: '',
    },
  })

  const isCreate = computed(() => ['create'].includes(props.action))
  const isView = computed(() => ['view'].includes(props.action))

  const hasRecorded = computed({
    get: () => {
      const v = formData.value.has_recorded as unknown
      return v === 1 || v === true || v === '1' || v === 'true'
    },
    set: (val: boolean) => {
      formData.value.has_recorded = val ? 1 : 0
    },
  })

  const parse = (val: unknown): number => parseFloat(String(val || '0'))
  const to10 = (v: unknown) =>
    v === 1 || v === true || v === '1' || v === 'true' ? 1 : 0

  const safeGet = (obj: unknown): Record<string, unknown> | null => {
    if (!obj) return null
    if (typeof obj === 'string') {
      try {
        return JSON.parse(obj) as Record<string, unknown>
      } catch {
        return null
      }
    }
    return typeof obj === 'object' ? (obj as Record<string, unknown>) : null
  }

  const creatorData = computed(() => {
    const pay = safeGet(
      (formData.value as Record<string, unknown>)[
        'history_payment_dividends_foreign_currency'
      ]
    )
    const iss = safeGet(
      (formData.value as Record<string, unknown>)['history_issuer_dividend']
    )

    const pick = (o: Record<string, unknown> | null, k: string) =>
      typeof o?.[k] === 'string' && String(o[k]).trim() !== ''
        ? String(o![k])
        : null

    return pick(pay, 'creator_data') ?? pick(iss, 'creator_data') ?? '-'
  })

  const createDate = computed(() => {
    const pay = safeGet(
      (formData.value as Record<string, unknown>)[
        'history_payment_dividends_foreign_currency'
      ]
    )
    const iss = safeGet(
      (formData.value as Record<string, unknown>)['history_issuer_dividend']
    )

    const pick = (o: Record<string, unknown> | null, k: string) =>
      typeof o?.[k] === 'string' && String(o[k]).trim() !== ''
        ? String(o![k])
        : null
    return pick(pay, 'created_at') ?? pick(iss, 'created_at') ?? '-'
  })

  const updateDividendAfterTax = () => {
    const dividend = parse(formData.value.dividend_value)
    const tax = parse(formData.value.tax_percentage)
    const afterTax = hasRecorded.value
      ? dividend - (dividend * tax) / 100
      : dividend
    formData.value.dividend_value_after_tax = Number(afterTax.toFixed(2))
  }

  const updateTaxValue = () => {
    if (!hasRecorded.value && !isCreate) {
      formData.value.tax_value = 0
      return
    }
    const dividend = parse(formData.value.dividend_value)
    const tax = parse(formData.value.tax_percentage)
    formData.value.tax_value = Number(((dividend * tax) / 100).toFixed(2))
  }

  const updateEnforceabilityValue = () => {
    const quantity = parse(formData.value.number_of_shares)
    const dividend = hasRecorded.value
      ? parse(formData.value.dividend_value_after_tax)
      : parse(formData.value.dividend_value)
    formData.value.enforceability_value = Number(
      (quantity * dividend).toFixed(2)
    )
  }

  const fetchShareAction = async () => {
    const { emitter_id } = formData.value
    if (!emitter_id) return

    const response = await _shareAction({ emitter_id })
    formData.value.number_of_shares = response?.number_of_shares || ''
    formData.value.class_action = response?.class_action ?? ''
    formData.value.unit_id_action = String(response?.unit_id_action ?? '')
    formData.value.dividend_type = response?.dividend_type ?? ''
  }

  watch(
    () => formData.value.dividend_type,
    (type) => {
      isExDividend.value = type === 'EXDIVIDENDO (EXD)'
      if (!isExDividend.value) formData.value.ex_dividend_date = ''
    }
  )

  watch(
    () => formData.value.class_action,
    () => {
      if (!isCreate) fetchShareAction()
    }
  )

  watch(
    [
      () => formData.value.dividend_value,
      () => formData.value.tax_percentage,
      () => hasRecorded.value,
    ],
    () => {
      updateDividendAfterTax()
      updateTaxValue()
    }
  )

  watch(
    [
      () => formData.value.number_of_shares,
      () => formData.value.dividend_value,
      () => formData.value.dividend_value_after_tax,
      () => hasRecorded.value,
    ],
    updateEnforceabilityValue
  )

  watch(
    [
      () => formData.value.spot_rate,
      () => formData.value.dividend_value,
      () => formData.value.tax_value,
      () => formData.value.dividend_value_after_tax,
      () => formData.value.enforceability_value,
    ],
    () => {
      const spot = parse(formData.value.spot_rate)
      formData.value.dividend_value_local_currency = Number(
        (spot * parse(formData.value.dividend_value)).toFixed(2)
      )
      formData.value.tax_value_local_currency = Number(
        (spot * parse(formData.value.tax_value)).toFixed(2)
      )
      formData.value.dividend_value_local_currency_after_tax = Number(
        (spot * parse(formData.value.dividend_value_after_tax)).toFixed(2)
      )
      formData.value.demand_value_local_currency = Number(
        (spot * parse(formData.value.enforceability_value)).toFixed(2)
      )
    }
  )

  watch(
    () => formData.value.emitter_id,
    async (id) => {
      const found = selectOptions.value.issuers.find(
        (item) => item.value === id
      )
      formData.value.emitter_name = found?.description || '-'

      if (id) await fetchShareAction()
    }
  )

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) {
        formData.value = {
          ...formData.value,
          ...newVal,
          has_recorded: to10(newVal.has_recorded),
        }
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => formData.value.has_recorded,
    (v) => {
      const n = to10(v)
      if (v !== n) {
        formData.value.has_recorded = n
      }
    }
  )

  watch(
    () => hasRecorded.value,
    (newValue) => {
      if (newValue) {
        isGravedividend.value = true
      } else {
        isGravedividend.value = false
      }
    },
    { immediate: true }
  )

  const DATE_FIELDS = [
    'operation_date',
    'dividend_record_date',
    'ex_dividend_date',
    'due_date',
    'payment_date',
  ] as const

  const normalizeDate = (d: unknown): string => {
    if (!d) return ''
    const s = String(d).trim()
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s

    const m = moment.utc(s, moment.ISO_8601, true)
    if (m.isValid()) return m.format('YYYY-MM-DD')

    const m2 = moment.utc(s)
    return m2.isValid() ? m2.format('YYYY-MM-DD') : ''
  }

  watch(
    () => props.data,
    (newVal) => {
      if (!newVal) return

      const normalized = { ...newVal } as Record<string, unknown>
      DATE_FIELDS.forEach((k) => {
        normalized[k] = normalizeDate(
          (newVal as unknown as Record<string, unknown>)[k]
        )
      })

      formData.value = {
        ...formData.value,
        ...normalized,
        has_recorded: to10(
          (newVal as unknown as Record<string, unknown>).has_recorded
        ),
      }
    },
    { deep: true, immediate: true }
  )

  return {
    history,
    isView,
    formData,
    hasRecorded,
    isGravedividend,
    creatorData,
    createDate,
    isExDividend,
    selectOptions,
    informationFormRef,
  }
}

export default useInformationForm
