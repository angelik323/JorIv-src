import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { IEmitterDividend } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import {
  useRegisterDividendsPerIssuerStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'

const useInformationForm = (props: {
  action: ActionType
  data?: IEmitterDividend
}) => {
  const {
    operation_type: operationCode,
    local_currency_type: currency,
    issuer_dividend_class_action: classActions,
    issuer_dividend_dividend_type: dividendTypes,
    third_party_issuers_selector_dividend: issuers,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { _shareAction } = useRegisterDividendsPerIssuerStore('v1')

  const informationFormRef = ref()
  const isExDividend = ref(false)

  const formData = ref<IEmitterDividend>({
    emitter_id: 0,
    operation_date: moment().format('YYYY-MM-DD'),
    operation_code: 0,
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
    () => formData.value.emitter_id,
    (id) => {
      const found = issuers.value.find((item) => item.value === id)
      formData.value.emitter_name = found?.description || '-'
    }
  )

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) {
        formData.value = { ...formData.value, ...newVal }
        formData.value.operation_code = Number(
          formData.value.operation_code ?? 0
        )
        formData.value.currency_id = Number(formData.value.currency_id ?? 0)
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

  return {
    isView,
    isEdit,
    issuers,
    formData,
    currency,
    hasRecorded,
    isExDividend,
    classActions,
    dividendTypes,
    operationCode,
    informationFormRef,
  }
}

export default useInformationForm
