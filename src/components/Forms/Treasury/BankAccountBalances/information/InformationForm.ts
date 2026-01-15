// pinia | vue
import { storeToRefs } from 'pinia'
import {
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'

import { ActionType } from '@/interfaces/global'
import { IBankAccountBalance } from '@/interfaces/customs/treasury/BankAccountBalances'
import { IBusinessBankAccounts } from '@/interfaces/customs/resources/Treasury'

import { useRules, useUtils } from '@/composables'
import {
  useBankAccountBalancesStore,
  useResourceManagerStore,
  useResourceStore,
  useTreasuryResourceStore,
} from '@/stores'

const useInformationForm = (props: {
  action: Omit<ActionType, 'view'>
  data?: IBankAccountBalance
}) => {
  const { data_information_form } = storeToRefs(
    useBankAccountBalancesStore('v1')
  )

  const { formatCurrencyString } = useUtils()

  const { date_before_or_equal_to_the_current_date } = useRules()

  const { _setDataInformationForm } = useBankAccountBalancesStore('v1')
  const { bank_accounts_balances } = storeToRefs(useResourceStore('v1'))

  const {
    business_trusts,
    business_bank_accounts_with_name,
    banks_record_expenses,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const isLocalCurrency = ref(false)

  const handleBankAccount = (event: IBusinessBankAccounts) => {
    models.value.bank_account_id = event?.value as number
    isLocalCurrency.value = event?.payload.coin_type === 'Local'
  }
  
  // refs
  const holidays = ref<string[]>([])
  const formInformation = ref()
  const models = ref<{
    id?: number
    business_id: number | null
    bank_id: number | null
    bank_account_id: number | null
    currency?: string | null
    initial_balance_local_currency: string | null
    initial_balance_foreign_currency: string | null
    opening_date?: string | null
    initial_balance_date: string | null
  }>({
    id: undefined,
    business_id: null,
    bank_id: null,
    bank_account_id: null,
    currency: undefined,
    initial_balance_local_currency: '',
    initial_balance_foreign_currency: '',
    opening_date: undefined,
    initial_balance_date: null,
  })

  // actions

  const handlerHolidays = async ({ year }: { year: number }) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const handlerActionForm = (action: typeof props.action) => {
    const actionHandlers: Record<string, () => void> = {
      create: _setValueModel,
      edit: _setFormEdit,
    }
    actionHandlers[action as string]?.()
  }

  const _setFormEdit = () => {
    const data = props.data
    if (data) {
      models.value = {
        id: data.id ?? undefined,
        business_id: data.business_trust?.id ?? null,
        bank_id: data.bank?.id ?? null,
        bank_account_id: data.bank_account?.id ?? null,
        currency: data.currency ?? undefined,
        initial_balance_local_currency:
          data.initial_balance_local_currency ?? '',
        initial_balance_foreign_currency:
          data.initial_balance_foreign_currency ?? '',
        opening_date: data.opening_date ?? undefined,
        initial_balance_date: data.initial_balance_date,
      }
      
      isLocalCurrency.value = models.value.currency === 'Local'

      setTimeout(() => {
        models.value.bank_id = data.bank?.id ?? null
      }, 1000)
      setTimeout(() => {
        models.value.bank_account_id = data.bank_account?.id ?? null
      }, 1000)
    }
  }

  const _setValueModel = async () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  const key = {
    treasury: ['business_trusts'],
  }

  onMounted(async () => {
    await _getResources(key, '', 'v2')
    business_bank_accounts_with_name.value = []

    handlerActionForm(props.action)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (useUtils().isEmpty(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({
          id: models.value.id ?? undefined,
          business_id: models.value.business_id ?? null,
          bank_id: models.value.bank_id ?? null,
          bank_account_id: models.value.bank_account_id ?? null,
          currency: models.value.currency ?? undefined,
          initial_balance_local_currency:
            models.value.initial_balance_local_currency ?? null,
          initial_balance_foreign_currency:
            models.value.initial_balance_foreign_currency ?? null,
          opening_date: models.value.opening_date ?? null,
          initial_balance_date: models.value.initial_balance_date ?? null,
        })
      }
    },
    { immediate: true, deep: true }
  )

  onBeforeMount(() => {
    _resetKeys({
      treasury: ['banks', 'business_bank_accounts', 'banks_record_expenses'],
    })
    handlerHolidays({ year: new Date().getFullYear() })
  })

  watch(
    () => models.value.business_id,
    (val, oldVal) => {
      const bank_keys = {
        treasury: ['banks_record_expenses'],
      }
      if (val) {
        const banks_filter = `business_trust_id=${val}`
        _getResources(bank_keys, banks_filter)
      }

      if (!val || (oldVal !== undefined && val !== oldVal)) {
        business_bank_accounts_with_name.value = []
        banks_record_expenses.value = []
        models.value.bank_id = null
        models.value.bank_account_id = null
      }
    }
  )

  watch(
    () => models.value.bank_id,
    (val, oldVal) => {
      const bank_account_key = {
        treasury: ['business_bank_accounts'],
      }
      if (val) {
        const bank_account_filter = `business_id=${models.value.business_id}&filter[bank_id]=${val}`

        _getResources(bank_account_key, bank_account_filter, 'v2')
      }
      if (!val || (oldVal !== undefined && val !== oldVal)) {
        business_bank_accounts_with_name.value = []
        models.value.bank_account_id = null
      }
    }
  )

  return {
    formInformation,
    models,
    bank_accounts_balances,
    isLocalCurrency,
    holidays,
    banks_record_expenses,
    business_trusts,
    business_bank_accounts_with_name,

    useUtils,
    handleBankAccount,
    formatCurrencyString,
    date_before_or_equal_to_the_current_date,
    handlerHolidays,
  }
}

export default useInformationForm
