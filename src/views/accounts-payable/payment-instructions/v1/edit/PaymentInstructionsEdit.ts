// Core
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IPaymentInstructionsForeignCurrencyForm,
  IPaymentInstructionsForm,
  IPaymentInstructionsHeaderForm,
  IPaymentInstructionsPayload,
} from '@/interfaces/customs/accounts-payable/PaymentInstructions'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { usePaymentInstructionsStore } from '@/stores/accounts-payable/payment-instructions'

const usePaymentInstructionsEdit = () => {
  // Composables
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  // Stores
  const { _getPaymentInstructionsById, _updatePaymentInstructions } =
    usePaymentInstructionsStore()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { bank_accounts_with_name } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  // Refs
  const headerFormRef = ref()
  const headerForm = ref<IPaymentInstructionsHeaderForm>({})
  const hasForeign = ref(false)

  const instructionsFormRef = ref()
  const instructionsForm = ref<IPaymentInstructionsForm | null>({
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

  const foreignCurrencyFormRef = ref()
  const foreignCurrencyForm = ref<IPaymentInstructionsForeignCurrencyForm>({
    provision_value: null,
    currency_id: null,
    trm_day: null,
    trm_final: null,
    final_value_pesos: null,
    final_value_foreign: null,
    net_value: null,
  })

  const id = +route.params.id

  const keys = {
    treasury: ['payments'],
    fics: ['get_info_collective_investment_funds'],
    accounts_payable: ['payment_request_numbers'],
    investment_portfolio: ['coins'],
  }

  const keysThirdParty = {
    third_party: ['third_parties'],
  }

  const keysDocType = {
    third_party: ['document_types'],
  }

  const keysBank = {
    treasury: ['banks'],
  }

  // Methods
  const nextTab = async () => {
    tabActiveIdx.value++
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  // Configs
  const headerProps = {
    title: 'Editar instrucciones de pago',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Instrucciones de pago',
        route: 'PaymentInstructionsList',
      },
      {
        label: 'Editar',
        route: 'PaymentInstructionsEdit',
      },
      {
        label: `${id}`,
        route: '',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'foreign_currency',
      label: 'Moneda extranjera',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // Methods
  const makePayload = () => {
    const i = instructionsForm.value
    const f = foreignCurrencyForm.value

    return {
      payment_type: i?.payment_type,
      payment_source: i?.payment_source,
      payment_method_id: i?.payment_method_id,
      fund_or_bank_id: i?.fund_or_bank_id,
      plan_or_account_id: i?.plan_or_account_id,
      instruction_date: i?.instruction_date,
      observation: i?.observation,
      authorized_doc_type_id: i?.authorized_doc_type_id,
      authorized_doc_number: i?.authorized_doc_number,
      authorized_full_name: i?.authorized_full_name,

      details:
        i?.details?.map((d) => ({
          id: d.new ? null : d.id,
          instruction_number: d.instruction_number,
          payment_method_id: d.payment_method_id,
          beneficiary_id: d.beneficiary_id,
          beneficiary_name: d.beneficiary_name,
          beneficiary_bank_account_id: d.beneficiary_bank_account_id,
          pay_value: d.pay_value,
        })) ?? [],

      currency_id: f?.currency_id ?? null,
      trm_day: f?.trm_day ? Number(f?.trm_day).toFixed(6) : null,
      trm_final: f?.trm_final ? Number(f?.trm_final).toFixed(6) : null,
      final_value_pesos: f?.final_value_pesos ?? null,
      final_value_foreign: f?.final_value_foreign ?? null,
      net_value: f?.net_value ?? instructionsForm.value?.net_value,
    }
  }

  const handleEdit = async () => {
    if (!headerForm.value.instruction_id) return

    const payload = makePayload() as IPaymentInstructionsPayload
    openMainLoader(true)
    if (
      await _updatePaymentInstructions(payload, headerForm.value.instruction_id)
    ) {
      goToURL('PaymentInstructionsList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  watch(
    () => headerForm.value.business_id,
    async (val) => {
      await _resetKeys(keysBank)

      if (!val) return

      _getResources(keysBank, `filter[business_trust_id]=${val}`)
    }
  )

  watch(
    () => instructionsForm.value?.plan_or_account_id,
    (val) => {
      hasForeign.value = false

      foreignCurrencyForm.value.currency_id = null
      foreignCurrencyForm.value.trm_day = null
      foreignCurrencyForm.value.trm_final = null

      if (!val) return

      if (instructionsForm.value?.payment_source == 'cuenta_bancaria') {
        const account = bank_accounts_with_name.value.find(
          (item) => item.value == instructionsForm.value?.plan_or_account_id
        )

        if (account) {
          hasForeign.value = account.coin_type == 'Extranjera'
        }
      }
    }
  )

  onMounted(async () => {
    openMainLoader(true)
    instructionsForm.value = (await _getPaymentInstructionsById(
      id
    )) as IPaymentInstructionsForm | null
    headerForm.value = instructionsForm.value?.payment_request ?? {}
    foreignCurrencyForm.value = {
      provision_value: instructionsForm.value?.provision_value ?? null,
      currency_id: instructionsForm.value?.currency_id ?? null,
      trm_day: instructionsForm.value?.trm_day ?? null,
      trm_final: instructionsForm.value?.trm_final ?? null,
      final_value_pesos: instructionsForm.value?.final_value_pesos ?? null,
      final_value_foreign: instructionsForm.value?.final_value_foreign ?? null,
      net_value: instructionsForm.value?.net_value ?? null,
    }
    await _getResources(keys)
    await _getResources(
      keysThirdParty,
      'fields[]=id,document&include=economicActivities,economicActivities.city,legalPerson,naturalPerson,bankAccounts&filter[status_id]=1'
    )
    await _getResources(
      keysDocType,
      'filter[model]=third-party-natural,third-party-legal'
    )
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    // Configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // Refs
    headerFormRef,
    instructionsFormRef,
    foreignCurrencyFormRef,
    headerForm,
    instructionsForm,
    foreignCurrencyForm,
    hasForeign,

    // Composables
    defaultIconsLucide,
    goToURL,

    // Methods
    nextTab,
    backTab,
    handleEdit,
  }
}

export default usePaymentInstructionsEdit
