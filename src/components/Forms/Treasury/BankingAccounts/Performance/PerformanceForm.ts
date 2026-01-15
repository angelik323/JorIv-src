import { storeToRefs } from 'pinia'
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import {
  useBankingAccountsStore,
  useResourceManagerStore,
  useResourceStore,
  useTreasuryResourceStore,
} from '@/stores'
import { QTable } from 'quasar'
import { IBankingAccountsRates } from '@/interfaces/customs'
import { isEmptyOrZero } from '@/utils'
import { useUtils } from '@/composables'

const usePerformanceForm = (props: any) => {
  const {
    data_information_form,
    data_performance_form,
    businessTrustHasCostCenter,
  } = storeToRefs(useBankingAccountsStore('v1'))
  const {
    validate_balance,
    bank_account_accounting_accounts,
    type_thirParty,
    bank_account_cost_center,
    bank_account_movements,
    bank_account_business,
    treasury_banks,
  } = storeToRefs(useResourceStore('v1'))

  const { _setDataPerformanceBankingAccount, _dataBasicError } =
    useBankingAccountsStore('v1')
  const { _getResourcesTreasuries, _getResourcesFics } = useResourceStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()

  const keys = [
    'banks',
    'validate_balance',
    'type_thirParty',
    'bank_account_cost_center',
    'bank_account_business',
    'treasury_banks',
  ]

  const keysFics = ['bank_account_movements']

  const keys_accounting_accounts = ['bank_account_accounting_accounts']

  const key_movement = { treasury: ['movement_egreso'] }

  const { movement_egreso_label } = storeToRefs(useTreasuryResourceStore('v1'))

  const radioRate = ref(true)
  const business = ref('')
  const bank = ref('')
  const account_bank = ref('')
  const accountingAccountHasCostCenter = ref(false)
  const accountingAccountSelected = ref(false)
  const isMovementsFundsDisabled = ref(true)

  const formPerformance = ref()

  const isCostCenterDisable = computed(() => {
    if (businessTrustHasCostCenter.value && !accountingAccountSelected.value) {
      return false
    }
    return (
      !businessTrustHasCostCenter.value || !accountingAccountHasCostCenter.value
    )
  })
  const models = ref<{
    treasury_movement_id: number | null
    validate_balance: number | null
    movement_codes_id: string | null
    accounting_account_id: number | null
    type_thirdparty: number | null
    cost_center_id: number | null
    rate_type: string | null
    rates?: IBankingAccountsRates[]
    treasury_movement_code: string | null
    treasury_movement_description: string | null
    movement_codes_code: string | null
    movement_codes_description: string | null
    accounting_account_code: string | null
    accounting_account_name: string | null
    cost_center_code: string | null
    cost_center_description: string | null
  }>({
    treasury_movement_id: null,
    validate_balance: null,
    movement_codes_id: null,
    accounting_account_id: null,
    type_thirdparty: null,
    cost_center_id: null,
    rate_type: null,
    rates: [] as IBankingAccountsRates[],
    treasury_movement_code: null,
    treasury_movement_description: null,
    movement_codes_code: null,
    movement_codes_description: null,
    accounting_account_code: null,
    accounting_account_name: null,
    cost_center_code: null,
    cost_center_description: null,
  })

  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'range_from',
        required: true,
        label: 'Desde',
        align: 'center',
        field: 'range_from',
      },
      {
        name: 'range_up',
        required: true,
        label: 'Hasta',
        align: 'center',
        field: 'range_up',
      },
      {
        name: 'rate',
        required: true,
        label: 'Tasa',
        align: 'center',
        field: 'rate',
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
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
      edit: data_performance_form.value ? setValueModel : setFormView,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setValueModel = () => {
    if (data_performance_form.value) {
      models.value = { ...data_performance_form.value }
    }
  }

  const setFormView = () => {
    if (props.data) {
      models.value = {
        ...props.data,
      }
    }
  }

  const newRate = () => {
    models.value.rates = models?.value?.rates || []
    const rows = models.value.rates

    if (
      rows.length === 0 ||
      (rows[0].range_from > 0 && rows[0].range_up > 0 && rows[0].rate > 0)
    ) {
      models.value.rates.unshift({ range_from: 0, range_up: 0, rate: 0 })
    }
  }

  const deleteRate = (index: number) => {
    models?.value?.rates?.splice(index, 1)
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
    () => models.value.accounting_account_id,
    (val) => {
      accountingAccountHasCostCenter.value = false
      accountingAccountSelected.value = false
      if (val) {
        accountingAccountSelected.value = true
        const accounting_account = bank_account_accounting_accounts.value.find(
          (account) => account.value == val
        )
        accountingAccountHasCostCenter.value = accounting_account
          ? accounting_account.has_cost_center ?? false
          : false
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (!models?.value?.rates?.length) {
        models.value.rate_type = null
        delete models.value.rates
      }
      if (isEmptyOrZero(models.value)) {
        _setDataPerformanceBankingAccount(null)
      } else {
        _setDataPerformanceBankingAccount({
          treasury_movement_id: models.value.treasury_movement_id ?? null,
          validate_balance: models.value.validate_balance ?? 0,
          accounting_account_id: models.value.accounting_account_id ?? null,
          type_thirdparty: models.value.type_thirdparty ?? null,
          cost_center_id: models.value.cost_center_id ?? null,
          movement_codes_id: models.value.movement_codes_id ?? null,

          rate_type: models.value.rate_type ?? 'E.A - Efectivo anual',
          rates: models.value.rates ?? [],

          treasury_movement_code: models.value.treasury_movement_code ?? '',
          treasury_movement_description:
            models.value.treasury_movement_description ?? '',
          movement_codes_code: models.value.movement_codes_code ?? '',
          movement_codes_description:
            models.value.movement_codes_description ?? '',
          accounting_account_code: models.value.accounting_account_code ?? '',
          accounting_account_name: models.value.accounting_account_name ?? '',
          cost_center_code: models.value.cost_center_code ?? '',
          cost_center_description: models.value.cost_center_description ?? '',
        })
        _dataBasicError(null)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.treasury_movement_id,
    (newval) => {
      if (newval) {
        const selected_movement = movement_egreso_label.value.find(
          (movement) => movement.id === newval
        )
        if (selected_movement) {
          if (selected_movement.accounting_blocks) {
            isMovementsFundsDisabled.value =
              (selected_movement.accounting_blocks[0]
                ?.movement_funds_processes ?? false) === false
            return
          }
        }
        isMovementsFundsDisabled.value = true
      }
    }
  )

  onMounted(async () => {
    await _getResourcesTreasuries(
      `param=Ingresos&keys[]=${keys.join('&keys[]=')}`
    )
    await _getResourcesFics(
      `nature=Ingreso&keys[]=${keysFics.join('&keys[]=')}`
    )
    await _getResources(
      key_movement,
      `business_id=${data_information_form.value?.business_id}&nature=Ingresos`
    )
    await _getResourcesTreasuries(
      `business_id=${
        data_information_form.value?.business_id
      }&keys[]=${keys_accounting_accounts.join('&keys[]=')}`
    )

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
    formPerformance,
    tableProps,
    movement_egreso_label,
    validate_balance,
    bank_account_accounting_accounts,
    type_thirParty,
    bank_account_cost_center,
    bank_account_movements,
    defaultIconsLucide,
    radioRate,
    business,
    bank,
    account_bank,
    isCostCenterDisable,
    isMovementsFundsDisabled,

    newRate,
    deleteRate,
    updateUpperCase,
  }
}
export default usePerformanceForm
