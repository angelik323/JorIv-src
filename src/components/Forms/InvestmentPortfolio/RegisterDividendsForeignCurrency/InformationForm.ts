import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { IEmitterDividend, IHistoryIssuerDividend } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import {
  useInvestmentPortfolioResourceStore,
  useRegisterDividendsForeignCurrencyStore,
} from '@/stores'

const useInformationForm = (props: {
  action: ActionType
  data?: IEmitterDividend
}) => {
  const {
    operation_type,
    foreign_currency_type,
    issuer_dividend_class_action,
    issuer_dividend_dividend_type,
    active_issuers_with_balance_selector,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { _shareAction } = useRegisterDividendsForeignCurrencyStore('v1')

  const informationFormRef = ref()
  const isExDividend = ref(false)

  const selectOptions = computed(() => ({
    operationCode: operation_type.value,
    currency: foreign_currency_type.value,
    classActions: issuer_dividend_class_action.value,
    dividendTypes: issuer_dividend_dividend_type.value,
    issuers: active_issuers_with_balance_selector.value,
  }))

  const formData = ref<IEmitterDividend>({
    emitter_id: 0,
    operation_date: moment().format('YYYY-MM-DD'),
    operation_code: '',
    operation_type_id: undefined,
    class_action: '',
    unit_id_action: '',
    number_of_shares: 0,
    dividend_type: '',
    dividend_record_date: '',
    ex_dividend_date: '',
    due_date: '',
    payment_date: '',
    has_recorded: 0,
    currency_id: 0,
    dividend_value: 0,
    tax_percentage: 0,
    dividend_value_after_tax: 0,
    enforceability_value: 0,
    tax_value: 0,
    operation_type_description: '',
    operation_type_code: '',
  })

  const isCreate = computed(() => ['create'].includes(props.action))
  const isView = computed(() => ['view'].includes(props.action))
  const isEdit = computed(() => ['edit'].includes(props.action))

  const hasRecorded = computed({
    get: () => formData.value.has_recorded === 1,
    set: (val: boolean) => (formData.value.has_recorded = val ? 1 : 0),
  })

  const parse = (val: unknown): number => parseFloat(String(val || '0'))

  const updateDividendAfterTax = () => {
    const dividend = parse(formData.value.dividend_value)
    const taxValue = parse(formData.value.tax_value)
    const afterTax = dividend - taxValue
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
    const { emitter_id, class_action } = formData.value
    if (!emitter_id || !class_action) return

    const response = await _shareAction({ emitter_id, class_action })
    formData.value.number_of_shares = Number(response.available_shares) || 0
  }

  watch(
    () => formData.value.dividend_type,
    (type) => {
      isExDividend.value = type === 'EXDIVIDENDO (EXD)'
      if (!isExDividend.value) formData.value.ex_dividend_date = ''
    }
  )

  watch(
    [
      () => formData.value.dividend_value,
      () => formData.value.tax_percentage,
      () => hasRecorded.value,
    ],
    () => {
      updateTaxValue()
      updateDividendAfterTax()
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
    [() => formData.value.emitter_id, () => selectOptions.value.issuers],
    ([id, issuers]) => {
      if (!id || !issuers?.length) return

      const found = issuers.find((i) => i.value === id)

      formData.value.emitter_name =
        found?.description_emitter_name || found?.description || '-'
    },
    { immediate: true }
  )

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) {
        formData.value = {
          ...formData.value,
          ...newVal,
          operation_type_id: newVal.operation_type_id,
          operation_code: String(newVal.operation_type_id ?? ''),

          emitter_name:
            newVal.description_emitter_name ??
            newVal.emitter_name ??
            formData.value.emitter_name ??
            '-',
        }
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => [formData.value.emitter_id, formData.value.class_action],
    () => {
      if (
        formData.value.emitter_id &&
        formData.value.class_action &&
        isCreate.value
      ) {
        fetchShareAction()
      }
    }
  )

  const history = computed<IHistoryIssuerDividend | null>(() => {
    let h: unknown =
      formData.value?.history_issuer_dividend ??
      formData.value?.history_foreign_currency_shar ??
      null

    if (typeof h === 'string') {
      try {
        h = JSON.parse(h)
      } catch {
        return null
      }
    }
    if (!h || typeof h !== 'object') return null

    const obj = h as Record<string, unknown>
    const updated_data =
      (obj['updated_data'] as string | undefined) ??
      (obj['update_data'] as string | undefined) ??
      ''

    return {
      created_at: String(obj['created_at'] ?? ''),
      creator_data: String(obj['creator_data'] ?? ''),
      updated_at: String(obj['updated_at'] ?? ''),
      updated_data: updated_data,
    }
  })

  return {
    isView,
    isEdit,
    formData,
    hasRecorded,
    isExDividend,
    selectOptions,
    informationFormRef,
    history,
  }
}

export default useInformationForm
