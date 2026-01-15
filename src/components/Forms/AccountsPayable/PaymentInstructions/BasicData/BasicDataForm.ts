// core
import { onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTableColumn } from 'quasar'

// interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IPaymentInstructionsForm,
  IPaymentInstructionsDetailsForm,
} from '@/interfaces/customs/accounts-payable/PaymentInstructions'

// composables
import { useUtils, useRules, useMainLoader, useBigNumbers } from '@/composables'

// constants
import { payment_type, payment_source } from '@/constants/resources'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { usePaymentInstructionsStore } from '@/stores/accounts-payable/payment-instructions'
// import { IThirdPartyBankAccounts } from '@/interfaces/customs/resources/ThirdParty'

const useInstructionsForm = (
  props: {
    action: ActionType
    data?: IPaymentInstructionsForm | null
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero, defaultIconsLucide } = useUtils()
  const { minus } = useBigNumbers()
  const {
    is_required,
    only_number_with_max_integers_and_decimals_ignore_symbols,
    valid_format_date,
    date_before_or_equal_to_the_current_date,
    only_business_day,
    min_length,
    max_length,
    only_alphanumeric,
  } = useRules()
  const { openMainLoader } = useMainLoader()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    payments_with_code,
    banks,
    bank_accounts_with_name,
    bank_account_third_party_quotas,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const {
    info_collective_investment_funds,
    fiduciary_investment_plans_treasury,
  } = storeToRefs(useFicResourceStore('v1'))
  const { third_parties_beneficiary } = storeToRefs(
    useThirdPartyResourceStore('v1')
  )
  const { document_types } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { authorized_payment } = storeToRefs(usePaymentInstructionsStore('v1'))

  // refs
  const beneficiariesInitialized = ref(false)
  const keysBank = {
    treasury: ['bank_account'],
  }
  const keysPlan = {
    fics: ['fiduciary_investment_plans'],
  }
  const keysAccount = {
    treasury: ['bank_account_third_party'],
  }

  // configs
  const instructionsFormRef = ref()

  const models = ref<IPaymentInstructionsForm>({
    payment_type: '',
    payment_source: '',
    payment_method_id: null,
    fund_or_bank_id: null,
    plan_or_account_id: null,
    instruction_date: '',
    base_value: null,
    tax_discount: null,
    net_value: null,
    observation: '',
    authorized_doc_type_id: null,
    authorized_doc_number: '',
    authorized_full_name: '',
    details: [],
    payment_request: {},
  })

  const tableProps = ref<IBaseTableProps<IPaymentInstructionsDetailsForm>>({
    title: '',
    loading: false,
    columns: [
      {
        name: 'instruction_number',
        required: false,
        label: 'Número de instrucción',
        align: 'left',
        field: 'instruction_number',
        sortable: true,
      },
      {
        name: 'payment_method_id',
        required: true,
        label: 'Forma de pago',
        align: 'left',
        field: 'payment_method_id',
        sortable: true,
      },
      {
        name: 'beneficiary_id',
        required: true,
        label: 'ID beneficiario',
        align: 'left',
        field: 'beneficiary_id',
        sortable: true,
      },
      {
        name: 'beneficiary_name',
        required: false,
        label: 'Nombre del beneficiario',
        align: 'left',
        field: 'beneficiary_name',
        sortable: true,
      },
      {
        name: 'beneficiary_bank_account_id',
        required: true,
        label: 'Cuenta bancaria llave',
        align: 'left',
        field: 'beneficiary_bank_account_id',
        sortable: true,
      },
      {
        name: 'pay_value',
        required: true,
        label: 'Valor a girar',
        align: 'left',
        field: 'pay_value',
        sortable: true,
      },
      ...(['create', 'edit'].includes(props.action)
        ? [
            {
              name: 'actions',
              required: false,
              label: 'Acciones',
              field: 'id',
              sortable: true,
            } as QTableColumn<IPaymentInstructionsDetailsForm>,
          ]
        : []),
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  // actions
  const changeFundOrBank = async ($event: number | null) => {
    models.value.fund_or_bank_id = $event
    models.value.plan_or_account_id = null
    models.value.plan_or_account_label = ''

    if (!$event) return

    _resetKeys(keysBank)
    _resetKeys(keysPlan)

    openMainLoader(true)
    if (models.value.payment_source === 'cuenta_bancaria') {
      await _getResources(
        keysBank,
        `filter[bank_id]=${models.value.fund_or_bank_id}`
      )
    }

    if (models.value.payment_source === 'plan_de_inversion') {
      await _getResources(
        keysPlan,
        `filter[collective_investment_fund_id]=${models.value.fund_or_bank_id}`
      )
    }
    openMainLoader(false)
  }

  const changePaymentSource = () => {
    models.value.fund_or_bank_id = null
    models.value.plan_or_account_id = null

    _resetKeys(keysBank)
    _resetKeys(keysPlan)
  }

  const addInstruction = () => {
    const first = models.value.details[0]
    if (
      first &&
      (!first.payment_method_id ||
        !first.beneficiary_id ||
        !first.beneficiary_bank_account_id ||
        !first.pay_value)
    ) {
      return
    }

    const nextId =
      models.value.details.length === 0
        ? 1
        : Math.max(
            ...models.value.details.map((d) => d.instruction_number || 0)
          ) + 1

    const totalPayValue = models.value.details.reduce((sum, item) => {
      const value = Number(item.pay_value)
      return sum + (isNaN(value) ? 0 : value)
    }, 0)

    const netValue = models.value.net_value ?? 0
    const pay_value = minus(netValue, totalPayValue)

    if (pay_value.lte(0)) return

    models.value.details.unshift({
      id: nextId,
      instruction_number: nextId,
      payment_method_id: null,
      beneficiary_id: null,
      beneficiary_name: '',
      beneficiary_bank_account_id: null,
      account_selector: [],
      pay_value: pay_value.toString(),
      new: true,
    })
  }

  const removeInstruction = (id: number) => {
    models.value.details = models.value.details.filter(
      (instruction) => instruction.id !== id
    )
  }

  const changeBeneficiary = async (
    row: IPaymentInstructionsDetailsForm,
    value: number | null
  ) => {
    row.beneficiary_id = value
    row.beneficiary_name = ''

    if (!value) return

    const beneficiary = third_parties_beneficiary.value.find(
      (item) => item.value === value
    )
    row.beneficiary_name =
      beneficiary?.natural_person?.full_name ??
      beneficiary?.legal_person?.business_name ??
      ''
    openMainLoader(true)
    await _getResources(keysAccount, `third_party_id=${value}`)
    row.account_selector = [...bank_account_third_party_quotas.value]
    openMainLoader(false)

    // row.account_selector =
    //   beneficiary?.bank_accounts?.map((account: IThirdPartyBankAccounts) => ({
    //     ...account,
    //     value: account.id,
    //     label: account.account_number,
    //   })) ?? []

    // const mainAccount = row.account_selector.find((item) => item.is_main)

    // row.beneficiary_bank_account_id = mainAccount ? mainAccount.value : null
  }

  // lifecycle hooks
  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val && props.data) models.value = props.data
    },
    { immediate: true }
  )

  watch(
    () => models.value.details,
    (val) => {
      tableProps.value.rows = val
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.fund_or_bank_id,
    async (val) => {
      if (!val) return

      _resetKeys(keysBank)
      _resetKeys(keysPlan)

      openMainLoader(true)
      if (models.value.payment_source === 'cuenta_bancaria') {
        await _getResources(
          keysBank,
          `filter[bank_id]=${models.value.fund_or_bank_id}`
        )
      }

      if (models.value.payment_source === 'plan_de_inversion') {
        await _getResources(
          keysPlan,
          `filter[collective_investment_fund_id]=${models.value.fund_or_bank_id}`
        )
      }
      openMainLoader(false)
    }
  )

  watch(
    () => props.data,
    async (val) => {
      if (!val || beneficiariesInitialized.value) return

      models.value = val

      if (!val.details?.length) return

      beneficiariesInitialized.value = true

      for (const row of models.value.details) {
        if (row.beneficiary_id) {
          await changeBeneficiary(row, row.beneficiary_id)
        }
      }
    },
    { immediate: true }
  )

  watch(
    () => models.value.payment_method_id,
    async (val) => {
      if (!val) return

      const paymentMethod = payments_with_code.value.find(
        (item) => item.value == val
      )

      if (paymentMethod) {
        authorized_payment.value = paymentMethod.authorized_payment

        if (!authorized_payment.value) {
          models.value.authorized_doc_type_id = null
          models.value.authorized_doc_number = ''
          models.value.authorized_full_name = ''
        }
      }
    }
  )

  onBeforeUnmount(() => {
    _resetKeys(keysBank)
    _resetKeys(keysPlan)
  })

  return {
    instructionsFormRef,
    models,
    tableProps,
    authorized_payment,

    // selects
    payment_type,
    payment_source,
    payments_with_code,
    banks,
    info_collective_investment_funds,
    bank_accounts_with_name,
    fiduciary_investment_plans_treasury,
    third_parties_beneficiary,
    document_types,

    // methods
    changeFundOrBank,
    changePaymentSource,
    addInstruction,
    removeInstruction,
    changeBeneficiary,

    // utils
    defaultIconsLucide,

    // rules
    is_required,
    only_number_with_max_integers_and_decimals_ignore_symbols,
    valid_format_date,
    date_before_or_equal_to_the_current_date,
    only_business_day,
    min_length,
    max_length,
    only_alphanumeric,
  }
}

export default useInstructionsForm
