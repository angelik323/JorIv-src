// vue | quasar | router
import {
  onBeforeUnmount,
  onBeforeMount,
  onMounted,
  computed,
  watch,
  ref,
} from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

// stores
import { storeToRefs } from 'pinia'
import {
  useRecordIndividualIncomeStore,
  useTreasuryResourceStore,
} from '@/stores'

// composables
import { useMainLoader } from '@/composables'

// utils
import { hollyDays, isEmptyOrZero } from '@/utils'
import { ActionType, ActionHandlers } from '@/interfaces/global'
import {
  IRecordIndividualIncomeDetailForm,
  IRecordIndividualIncomeDetailView,
} from '@/interfaces/customs'

const useRecordIndividualIncomeForm = (props: {
  action: ActionType
  data?:
    | IRecordIndividualIncomeDetailForm
    | IRecordIndividualIncomeDetailView
    | null
}) => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const {
    data_filter_form,
    data_detail_form,
    business_selected,
    data_detail_view,
    selectedMovementHasCostCenter,
  } = storeToRefs(useRecordIndividualIncomeStore('v1'))
  const { _setDataDetailForm, _setDataDetailView } =
    useRecordIndividualIncomeStore('v1')

  const {
    third_parties,
    type_receive_with_name,
    bank_account_cost_centers,
    cash_flow_structure_egreso,
    banks,
    bank_accounts_income,
    treasury_bank_accounts_with_name,
    business_bank_accounts_check,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const detailFormElementRef = ref()

  const isCoinForeign = computed(() => {
    const isCoinForeign = modelsForm.value.coin === 'Extranjera'

    return isCoinForeign
  })

  const isCheck = computed(() => {
    const selectedTypeReceive = type_receive_with_name.value.find(
      (item) => item.value === modelsForm.value.type_receive_id
    )
    return selectedTypeReceive?.type_receive === 'Cheque'
  })

  const initialModelsValues: IRecordIndividualIncomeDetailForm = {
    nit_third_party_id: null,
    type_receive_id: '',
    cost_center_id: null,
    cash_flow_id: null,
    concept: '',
    bank_id: null,
    bank_account_id: null,
    foreign_currency_value: null,
    coin: '',
    trm: null,
    value: null,
    checkbook: null,
    bank_checkbook_id: null,
    effective_date: '',
    investment_plans_id: null,
  }

  const initialModelsValuesView: IRecordIndividualIncomeDetailView = {
    id: null,
    third_party: {
      id: null,
      document: '',
      name: '',
    },
    type_receive: {
      id: null,
      code: '',
      description: '',
      type_receive: '',
    },
    cost_center: {
      id: null,
      code: '',
      name: '',
    },
    cash_flow: {
      id: null,
      code: '',
      name: '',
    },
    concept: '',
    bank: {
      id: null,
      description: '',
      bank_code: '',
    },
    bank_account: {
      id: null,
      account_name: '',
      account_number: '',
    },
    foreign_currency_value: null,
    coin: '',
    trm: null,
    value: null,
    checkbook: null,
    bank_checkbook: {
      id: null,
      bank_code: '',
      description: '',
    },
    effective_date: '',
    investment_plans: {
      id: null,
      description: '',
    },
  }

  const modelsForm = ref<IRecordIndividualIncomeDetailForm>({
    ...initialModelsValues,
  })

  const modelsView = ref<IRecordIndividualIncomeDetailView>({
    ...initialModelsValuesView,
  })
  const optionsMaxCalendar = (date: string | null) => {
    if (!date) return false

    const today = new Date()
    const current = new Date(date)

    const isPastOrToday = current <= today

    const day = current.getDay()
    const isWeekday = day !== 0 && day !== 6

    const colombiaHolidays2025 = hollyDays

    const dateISO = current.toISOString().split('T')[0]
    const isHoliday = colombiaHolidays2025.includes(dateISO)

    return isPastOrToday && isWeekday && !isHoliday
  }
  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: ActionHandlers = {
      create: () => setFormCreate(),
      edit: () => {
        const data = data_detail_view.value || props.data
        if (data) {
          setFormEdit(data as IRecordIndividualIncomeDetailView)
        }
      },
      view: () => {
        const data = data_detail_view.value || props.data
        if (data) {
          setFormView(data as IRecordIndividualIncomeDetailView)
        }
      },
    }

    actionHandlers[action]?.()
  }

  const setFormCreate = () => {
    if (data_detail_form.value) {
      Object.assign(modelsForm.value, data_detail_form.value)
    }

    if (data_filter_form.value?.date && props.action === 'create') {
      modelsForm.value.effective_date = moment(
        data_filter_form.value.date
      ).format('YYYY-MM-DD')
    }
  }

  const setFormEdit = (data: IRecordIndividualIncomeDetailView) => {
    clearForm()
    if (data) {
      modelsForm.value.nit_third_party_id = data.third_party?.id || null
      modelsForm.value.type_receive_id = data.type_receive?.id || null
      modelsForm.value.cost_center_id = data.cost_center?.id || null
      modelsForm.value.cash_flow_id = data.cash_flow?.id || null
      modelsForm.value.concept = data.concept || ''
      modelsForm.value.bank_id = data.bank?.id || null
      modelsForm.value.bank_account_id = data.bank_account?.id || null
      modelsForm.value.foreign_currency_value =
        data.foreign_currency_value || null
      modelsForm.value.coin = data.coin || ''
      modelsForm.value.trm = data.trm || null
      modelsForm.value.value = data.value || null
      modelsForm.value.checkbook = data.checkbook || null
      modelsForm.value.bank_checkbook_id = data.bank_checkbook?.id || null
      modelsForm.value.effective_date = data.effective_date || ''
      modelsForm.value.investment_plans_id = data.investment_plans?.id || null
    }
  }

  const setFormView = (data: IRecordIndividualIncomeDetailView) => {
    clearFormView()
    if (data) {
      Object.assign(modelsView.value, data)
    }
  }

  const clearForm = () => {
    Object.assign(modelsForm.value, initialModelsValues)
  }

  const clearFormView = () => {
    Object.assign(modelsView.value, initialModelsValuesView)
  }

  const selectBankAccount = (value: number) => {
    modelsForm.value.bank_account_id = value
    modelsForm.value.coin =
      bank_accounts_income.value.find((account) => account.value === value)
        ?.coin_type ?? 'Local'

    if (!isCoinForeign.value) {
      modelsForm.value.trm = null
      modelsForm.value.foreign_currency_value = null
      modelsForm.value.value = null
    }
  }

  const calculateValue = () => {
    if (!isCoinForeign.value) {
      modelsForm.value.foreign_currency_value = null
      modelsForm.value.trm = null
      modelsForm.value.value = null
    } else {
      if (modelsForm.value.foreign_currency_value && modelsForm.value.trm) {
        modelsForm.value.value =
          modelsForm.value.foreign_currency_value * modelsForm.value.trm
      } else {
        modelsForm.value.value = null
      }
    }
  }

  const calculateValueForeignCurrency = (value: number) => {
    modelsForm.value.foreign_currency_value = value
    calculateValue()
  }

  const calculateValueTRM = (value: number) => {
    modelsForm.value.trm = value
    calculateValue()
  }

  onBeforeMount(() => {
    if (!data_filter_form.value) {
      router.push({
        name: 'RecordIndividualIncomeList',
      })
    }
  })

  onMounted(async () => {
    openMainLoader(true)
    await handlerActionForm(props.action)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _setDataDetailForm(null)
    _setDataDetailView(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => data_filter_form.value,
    async (val) => {
      if (val) {
        setFormCreate()
      }
    },
    { deep: true }
  )

  const filteredBankAccounts = computed(() =>
    treasury_bank_accounts_with_name.value
      .filter((item) => item.payload.bank_id === modelsForm.value.bank_id)
      .sort((a, b) => a.label.localeCompare(b.label))
  )

  watch(
    () => modelsForm.value,
    () => {
      if (isEmptyOrZero(modelsForm.value)) {
        _setDataDetailForm(null)
      } else {
        _setDataDetailForm({ ...modelsForm.value })
      }
    },
    { deep: true }
  )

  return {
    modelsForm,
    modelsView,
    detailFormElementRef,
    third_parties,
    type_receive_with_name,
    bank_account_cost_centers,
    selectedMovementHasCostCenter,
    business_bank_accounts_check,
    cash_flow_structure_egreso,
    filteredBankAccounts,
    business_selected,
    isCoinForeign,
    isCheck,
    banks,
    calculateValueForeignCurrency,
    optionsMaxCalendar,
    selectBankAccount,
    calculateValueTRM,
  }
}

export default useRecordIndividualIncomeForm
