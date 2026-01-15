import { ref, computed, watch } from 'vue'
import { QForm } from 'quasar'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useUtils, useRules } from '@/composables'
import { useInvestmentPortfolioResourceStore, useLogin } from '@/stores'
import { ISimultaneousInformationForm, RateClasses } from '@/interfaces/customs'
import { COMPENSATION_SYSTEMS, COP_CURRENCY_CODE } from '@/constants'
import { ActionType } from '@/interfaces/global'

const useSimultaneousInformationForm = (props: {
  action: ActionType
  data?: ISimultaneousInformationForm
}) => {
  const { watchAndUpdateDescription } = useUtils()
  const resources = useInvestmentPortfolioResourceStore('v1')
  const {
    investment_portfolio,
    operation_type,
    paper_type,
    list_counterparty_associated_trader,
    currency_local,
  } = storeToRefs(resources)

  const informationFormRef = ref<QForm | null>(null)

  const isViewMode = computed(() => props.action === 'view')
  const isEdit = computed(() => props.action === 'edit')

  const loginStore = useLogin()
  const loggedUserName = computed(() => {
    const first = loginStore.loggedUser?.user?.name ?? ''
    const last = loginStore.loggedUser?.user?.last_name ?? ''
    return `${first} ${last}`.trim()
  })

  const copCurrencyId = computed(() => {
    return (
      currency_local.value?.find((c) => c.label === COP_CURRENCY_CODE)?.value ??
      null
    )
  })

  const formData = ref<ISimultaneousInformationForm>({
    user: props.data?.user ?? loggedUserName.value,
    operation_date: props.data?.operation_date ?? moment().format('YYYY-MM-DD'),
    investment_portfolio_id: props.data?.investment_portfolio_id ?? null,
    description_portfolio_name: props.data?.description_portfolio_name ?? '',
    position: props.data?.position ?? 'Activa',
    paper_id: props.data?.paper_id ?? null,
    operation_type_id: props.data?.operation_type_id ?? null,
    operation_type_description: props.data?.operation_type_description ?? '',
    start_date: props.data?.start_date ?? moment().format('YYYY-MM-DD'),
    days_number: props.data?.days_number ?? null,
    end_date: props.data?.end_date ?? '',
    rate_value: props.data?.rate_value ?? null,
    rate_class: props.data?.rate_class ?? ('' as RateClasses),
    days_base: props.data?.days_base ?? 360,
    nominal_value: props.data?.nominal_value ?? null,
    counterparty_id: props.data?.counterparty_id ?? null,
    currency_id:
      props.data?.currency_id ??
      (copCurrencyId.value !== null ? Number(copCurrencyId.value) : null),
    folio: props.data?.folio ?? null,
    compensation_system: props.data?.compensation_system ?? null,
    warranty_value: props.data?.warranty_value ?? null,
    warranty_percentage: props.data?.warranty_percentage ?? null,
    return_value: props.data?.return_value ?? null,
  })

  const selectOptions = computed(() => ({
    investment_portfolio: investment_portfolio.value ?? [],
    operation_type: operation_type.value ?? [],
    paper: paper_type.value ?? [],
    currency: currency_local.value ?? [],
    counterparty: list_counterparty_associated_trader.value ?? [],
    compensation_systems: COMPENSATION_SYSTEMS,
  }))

  const resetForm = () => {
    formData.value = {
      ...formData.value,
      user: loggedUserName.value,
      operation_date: moment().format('YYYY-MM-DD'),
      investment_portfolio_id: null,
      description_portfolio_name: '',
      position: 'Activa',
      paper_id: null,
      operation_type_id: null,
      operation_type_description: '',
      start_date: moment().format('YYYY-MM-DD'),
      days_number: null,
      end_date: '',
      rate_value: null,
      rate_class: '' as RateClasses,
      days_base: 360,
      nominal_value: null,
      counterparty_id: null,
      currency_id:
        copCurrencyId.value !== null ? Number(copCurrencyId.value) : null,
      folio: null,
      compensation_system: null,
      warranty_value: null,
      warranty_percentage: null,
      return_value: null,
    }
  }

  ;(
    [
      {
        sourceKey: 'investment_portfolio_id',
        optionsKey: 'investment_portfolio',
        descriptionKey: 'description_portfolio_name',
      },
    ] as const
  ).forEach(({ sourceKey, optionsKey, descriptionKey }) => {
    if (!isViewMode.value) {
      watchAndUpdateDescription(
        formData,
        selectOptions,
        sourceKey,
        optionsKey,
        descriptionKey
      )
    }
  })

  watch(
    () => currency_local.value,
    (list) => {
      if (props.action !== 'create') return
      if (!list?.length) return
      const copCurrency = list.find(({ label }) => label === COP_CURRENCY_CODE)
      if (copCurrency) formData.value.currency_id = Number(copCurrency.value)
    },
    { immediate: true }
  )

  watch(
    () => [formData.value.days_number, formData.value.operation_date],
    ([daysRaw, start]) => {
      const rules = useRules()
      const days = Number(daysRaw)
      if (!days || days <= 0 || days > 365 || !start) {
        formData.value.end_date = ''
        return
      }
      let tentative = moment(start).add(days, 'days')
      while (
        rules.date_is_not_weekend(tentative.format('YYYY-MM-DD')) !== true
      ) {
        tentative = tentative.add(1, 'days')
      }
      formData.value.end_date = tentative.format('YYYY-MM-DD')
    }
  )

  watch(
    () => [formData.value.warranty_value, formData.value.nominal_value],
    ([warranty, nominal]) => {
      if (warranty !== null && nominal !== null && warranty < nominal) {
        formData.value.warranty_value = nominal
      }
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) formData.value = { ...formData.value, ...newVal }
    },
    { immediate: true, deep: true }
  )

  return {
    informationFormRef,
    formData,
    selectOptions,
    isViewMode,
    isEdit,
    resetForm,
  }
}

export default useSimultaneousInformationForm
