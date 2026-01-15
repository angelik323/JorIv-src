// Core
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IPaymentInstructionsForeignCurrencyForm,
  IPaymentInstructionsForm,
  IPaymentInstructionsHeaderForm,
} from '@/interfaces/customs/accounts-payable/PaymentInstructions'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { usePaymentInstructionsStore } from '@/stores/accounts-payable/payment-instructions'

const usePaymentInstructionsView = () => {
  // Composables
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  // Stores
  const { _getPaymentInstructionsById } = usePaymentInstructionsStore()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Refs
  const headerFormRef = ref()
  const headerForm = ref<IPaymentInstructionsHeaderForm | null>({})

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
    third_party: ['document_types'],
    accounts_payable: ['payment_request_numbers'],
  }

  const keysThirdParty = {
    third_party: ['third_parties'],
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
    title: 'Ver instrucciones de pago',
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
        label: 'Ver',
        route: 'PaymentInstructionsView',
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

  watch(
    () => headerForm.value?.business_id,
    async (val) => {
      await _resetKeys(keysBank)

      if (!val) return

      _getResources(keysBank, `filter[business_trust_id]=${val}`)
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
      'fields[]=id,document&include=economicActivities,economicActivities.city,legalPerson,naturalPerson'
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

    // Composables
    defaultIconsLucide,
    goToURL,

    // Methods
    nextTab,
    backTab,
  }
}

export default usePaymentInstructionsView
