// Vue -pinia
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  ISelectorResources,
  IBankAccountRestatement,
} from '@/interfaces/customs'

// Utils & Composables
import { isEmptyOrZero } from '@/utils'

// Stores
import {
  useBankingAccountsStore,
  useResourceManagerStore,
  useResourceStore,
  useTreasuryResourceStore,
} from '@/stores'

const useRestatementForm = (props: {
  action: ActionType
  data?: IBankAccountRestatement
}) => {
  const {
    data_information_form,
    data_restatement_form,
    businessTrustHasCostCenter,
  } = storeToRefs(useBankingAccountsStore('v2'))
  const {
    bank_account_business,
    treasury_banks,
    bank_account_accounting_accounts,
    type_thirParty,
    bank_account_cost_center,
    treasury_movement_codes,
  } = storeToRefs(useResourceStore('v1'))

  const { movement_egreso } = storeToRefs(useTreasuryResourceStore('v1'))

  const { _setDataRestatementBankingAccount, _dataBasicError } =
    useBankingAccountsStore('v2')
  const { _getResourcesTreasuries } = useResourceStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = [
    'banks',
    'validate_balance',
    'type_thirParty',
    'bank_account_cost_center',
    'bank_account_business',
    'treasury_banks',
    'treasury_movement_codes',
  ]

  const keys_accounting_accounts = ['bank_account_accounting_accounts']

  const key_movement = { treasury: ['movement_egreso'] }

  const business = ref('')
  const bank = ref('')
  const account_bank = ref('')
  const bank_account_movements_positive = ref<ISelectorResources[]>()
  const bank_account_movements_negative = ref<ISelectorResources[]>()
  const isPositiveMovementFundDisabled = ref(true)
  const isNegativeMovementFundDisabled = ref(true)

  const positiveAccountingAccountHasCostCenter = ref(false)
  const positiveAccountingAccountSelected = ref(false)

  const negativeAccountingAccountHasCostCenter = ref(false)
  const negativeAccountingAccountSelected = ref(false)

  const isPositiveCostCenterDisable = computed(() => {
    if (
      businessTrustHasCostCenter.value &&
      !positiveAccountingAccountSelected.value
    ) {
      return false
    }
    return (
      !businessTrustHasCostCenter.value ||
      !positiveAccountingAccountHasCostCenter.value
    )
  })

  const isNegativeCostCenterDisable = computed(() => {
    if (
      businessTrustHasCostCenter.value &&
      !negativeAccountingAccountSelected.value
    ) {
      return false
    }
    return (
      !businessTrustHasCostCenter.value ||
      !negativeAccountingAccountHasCostCenter.value
    )
  })

  const formRestatement = ref()
  const models = ref<{
    treasury_movement_positive_id: number | null
    treasury_movement_negative_id: number | null
    movement_codes_positive_id: number | null
    movement_codes_negative_id: number | null
    accounting_account_positive_id: number | null
    accounting_account_negative_id: number | null
    cost_center_positive_id: number | null
    cost_center_negative_id: number | null
    type_thirdparty_positive: number | null
    type_thirdparty_negative: number | null
    treasury_movement_positive_code: string
    treasury_movement_positive_description: string
    treasury_movement_negative_code: string
    treasury_movement_negative_description: string
    movement_codes_positive_code: string
    movement_codes_positive_description: string
    movement_codes_negative_code: string
    movement_codes_negative_description: string
    accounting_account_positive_code: string
    accounting_account_positive_name: string
    accounting_account_negative_code: string
    accounting_account_negative_name: string
    cost_center_positive_code: string
    cost_center_positive_description: string
    cost_center_negative_code: string
    cost_center_negative_description: string
  }>({
    treasury_movement_positive_id: null,
    treasury_movement_negative_id: null,
    movement_codes_positive_id: null,
    movement_codes_negative_id: null,
    accounting_account_positive_id: null,
    accounting_account_negative_id: null,
    cost_center_positive_id: null,
    cost_center_negative_id: null,
    type_thirdparty_positive: null,
    type_thirdparty_negative: null,
    treasury_movement_positive_code: '',
    treasury_movement_positive_description: '',
    treasury_movement_negative_code: '',
    treasury_movement_negative_description: '',
    movement_codes_positive_code: '',
    movement_codes_positive_description: '',
    movement_codes_negative_code: '',
    movement_codes_negative_description: '',
    accounting_account_positive_code: '',
    accounting_account_positive_name: '',
    accounting_account_negative_code: '',
    accounting_account_negative_name: '',
    cost_center_positive_code: '',
    cost_center_positive_description: '',
    cost_center_negative_code: '',
    cost_center_negative_description: '',
  })

  const updateUpperCase = <K extends keyof typeof models.value>(
    key: K,
    value: unknown
  ) => {
    if (typeof value === 'string') {
      models.value[key] = value.toUpperCase() as (typeof models.value)[K]
    }
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setValueModel,
      edit: setFormView,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setValueModel = () => {
    if (data_restatement_form.value) {
      models.value = { ...data_restatement_form.value }
    }
  }

  const setFormView = () => {
    data_restatement_form.value = props.data ?? null
    setValueModel()
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => models.value.treasury_movement_positive_id,
    (newval) => {
      if (newval) {
        if (bank_account_movements_positive.value === undefined) {
          return
        }
        const selected_movement = bank_account_movements_positive.value.find(
          (movement) => movement.id === newval
        )
        if (selected_movement) {
          if (selected_movement.accounting_blocks) {
            isPositiveMovementFundDisabled.value =
              (selected_movement.accounting_blocks[0]
                ?.movement_funds_processes ?? false) === false
            return
          }
        }
        isPositiveMovementFundDisabled.value = true
      }
    }
  )

  watch(
    () => models.value.treasury_movement_negative_id,
    (newval) => {
      if (newval) {
        if (bank_account_movements_negative.value === undefined) {
          return
        }
        const selected_movement = bank_account_movements_negative.value.find(
          (movement) => movement.id === newval
        )
        if (selected_movement) {
          if (selected_movement.accounting_blocks) {
            isNegativeMovementFundDisabled.value =
              (selected_movement.accounting_blocks[0]
                ?.movement_funds_processes ?? false) === false
            return
          }
        }
        isNegativeMovementFundDisabled.value = true
      }
    }
  )

  watch(
    () => models.value.accounting_account_positive_id,
    (val) => {
      positiveAccountingAccountHasCostCenter.value = false
      positiveAccountingAccountSelected.value = false
      if (val) {
        positiveAccountingAccountSelected.value = true
        const accounting_account = bank_account_accounting_accounts.value.find(
          (account) => account.value == val
        )
        positiveAccountingAccountHasCostCenter.value = accounting_account
          ? accounting_account.has_cost_center ?? false
          : false
      }
    }
  )

  watch(
    () => models.value.accounting_account_negative_id,
    (val) => {
      negativeAccountingAccountHasCostCenter.value = false
      negativeAccountingAccountSelected.value = false
      if (val) {
        negativeAccountingAccountSelected.value = true
        const accounting_account = bank_account_accounting_accounts.value.find(
          (account) => account.value == val
        )
        negativeAccountingAccountHasCostCenter.value = accounting_account
          ? accounting_account.has_cost_center ?? false
          : false
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataRestatementBankingAccount(null)
      } else {
        _setDataRestatementBankingAccount({
          treasury_movement_positive_id:
            models.value.treasury_movement_positive_id ?? null,
          treasury_movement_negative_id:
            models.value.treasury_movement_negative_id ?? null,
          movement_codes_positive_id:
            models.value.movement_codes_positive_id ?? null,
          movement_codes_negative_id:
            models.value.movement_codes_negative_id ?? null,
          accounting_account_positive_id:
            models.value.accounting_account_positive_id ?? null,
          accounting_account_negative_id:
            models.value.accounting_account_negative_id ?? null,
          cost_center_positive_id: models.value.cost_center_positive_id ?? null,
          cost_center_negative_id: models.value.cost_center_negative_id ?? null,
          type_thirdparty_positive:
            models.value.type_thirdparty_positive ?? null,
          type_thirdparty_negative:
            models.value.type_thirdparty_negative ?? null,
          treasury_movement_positive_code:
            models.value.treasury_movement_positive_code ?? '',
          treasury_movement_positive_description:
            models.value.treasury_movement_positive_description ?? '',
          treasury_movement_negative_code:
            models.value.treasury_movement_negative_code ?? '',
          treasury_movement_negative_description:
            models.value.treasury_movement_negative_description ?? '',
          movement_codes_positive_code:
            models.value.movement_codes_positive_code ?? '',
          movement_codes_positive_description:
            models.value.movement_codes_positive_description ?? '',
          movement_codes_negative_code:
            models.value.movement_codes_negative_code ?? '',
          movement_codes_negative_description:
            models.value.movement_codes_negative_description ?? '',
          accounting_account_positive_code:
            models.value.accounting_account_positive_code ?? '',
          accounting_account_positive_name:
            models.value.accounting_account_positive_name ?? '',
          accounting_account_negative_code:
            models.value.accounting_account_negative_code ?? '',
          accounting_account_negative_name:
            models.value.accounting_account_negative_name ?? '',
          cost_center_positive_code:
            models.value.cost_center_positive_code ?? '',
          cost_center_positive_description:
            models.value.cost_center_positive_description ?? '',
          cost_center_negative_code:
            models.value.cost_center_negative_code ?? '',
          cost_center_negative_description:
            models.value.cost_center_negative_description ?? '',
        })
        _dataBasicError(null)
      }
    },
    { deep: true }
  )

  onMounted(async () => {
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)

    await _getResourcesTreasuries(
      `business_id=${
        data_information_form.value?.business_id
      }&keys[]=${keys_accounting_accounts.join('&keys[]=')}`
    )

    await _getResources(
      key_movement,
      `business_id=${data_information_form.value?.business_id}&nature=Ingreso`
    )
    bank_account_movements_positive.value = movement_egreso.value

    await _getResources(
      key_movement,
      `business_id=${data_information_form.value?.business_id}`
    )
    bank_account_movements_negative.value = movement_egreso.value

    business.value =
      bank_account_business.value.filter(
        (item) => item.value == data_information_form.value?.business_id
      )[0]?.label ?? ''

    bank.value =
      treasury_banks.value.filter(
        (item) => item.value == data_information_form.value?.bank_id
      )[0]?.label ?? ''

    account_bank.value = data_information_form.value?.account_bank ?? ''

    handlerActionForm(props.action)
  })

  onBeforeUnmount(() => _resetKeys(key_movement))

  return {
    models,
    formRestatement,
    bank_account_accounting_accounts,
    type_thirParty,
    bank_account_cost_center,
    business,
    bank,
    account_bank,
    bank_account_movements_positive,
    bank_account_movements_negative,
    treasury_movement_codes,
    isPositiveMovementFundDisabled,
    isNegativeMovementFundDisabled,
    isPositiveCostCenterDisable,
    isNegativeCostCenterDisable,

    updateUpperCase,
  }
}
export default useRestatementForm
