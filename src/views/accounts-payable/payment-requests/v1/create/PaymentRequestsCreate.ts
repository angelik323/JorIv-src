// core
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'
import {
  IPaymentRequestAssociatedDataForm,
  IPaymentRequestBasicDataForm,
  IPaymentRequestConceptsForm,
  IPaymentRequestInstructionsForm,
  IPaymentRequestMainInformationForm,
  IPaymentRequestValidate,
} from '@/interfaces/customs/accounts-payable/PaymentRequests'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { usePaymentRequestsStore } from '@/stores/accounts-payable/payment-requests'

const usePaymentRequestsCreate = () => {
  // hooks
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { isEmptyOrZero, defaultIconsLucide } = useUtils()

  // stores
  const {
    _createPaymentRequestBasicData,
    _createPaymentRequestMainInformation,
    _createPaymentRequestConcepts,
    _createPaymentRequestInstructions,
    _createPaymentRequestAssociatedData,
  } = usePaymentRequestsStore('v1')
  const thirdPartyStore = useThirdPartyResourceStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { budget_document_number } = storeToRefs(useBudgetResourceStore('v1'))

  // refs
  const keys = {
    fics: ['offices', 'get_info_collective_investment_funds'],
    budget: ['budget_document_types_selector'],
    accounts_payable: ['document_types'],
    treasury: ['payments'],
    fixed_assets: ['type', 'configuration_type'],
    assets: ['cities'],
  }
  const keysThirdParty = { third_party: ['third_parties'] }
  const keysDocType = { third_party: ['document_types'] }
  const keysBusinessTrust = { trust_business: ['business_trusts'] }
  const keysDerivativeContracting = {
    derivative_contracting: ['basic_info_contract'],
  }
  const keysBudget = { budget: ['budget_document_number'] }
  const keysBudgetTransfer = { budget: ['budget_transfer_details'] }
  const keysBudgetOperation = { budget: ['operation_log_details'] }
  const keysConcepts = { accounts_payable: ['payment_concept_codes'] }
  const keysMovementManagement = {
    accounts_payable: ['movement_management_code_name'],
  }
  const keysBank = { treasury: ['banks'] }
  const keysDoc = { accounts_payable: ['document_type_code_name'] }

  const basicDataFormRef = ref()
  const mainInformationFormRef = ref()
  const conceptsFormRef = ref()
  const instructionsFormRef = ref()
  const associatedDataFormRef = ref()
  const validate = ref<IPaymentRequestValidate>({
    hasHandleBudgetBusiness: false,
    hasDerivateContracting: false,
    movementHasContractExecution: false,
    hasInternalConsecutive: false,
    hasClientConsecutive: false,
    hasOrder: false,
    hasOtherReferences: false,
    hasLegalizationDate: false,
    hasExpirationDate: false,
  })

  const basic_data_form = ref<IPaymentRequestBasicDataForm | null>()
  const main_information_form = ref<IPaymentRequestMainInformationForm>({
    document_type_id: null,
    business_id: null,
    business_code: '',
    payment_structure_id: null,
    internal_code: '',
    client_code: '',
    order_number: '',
    other_reference: '',
    legalization_date: '',
    due_date: '',
    movement_code_id: null,
    movement_date: '',
    city_id: null,
    contract_id: null,
    milestone_id: null,
    validity_year: null,
    budget_document_type_id: null,
    budget_document_number_id: null,
    budget_validity_year: null,
    observation: '',
    payment_structure_label: '',
    city_label: '',
  })
  const concepts_form = ref<IPaymentRequestConceptsForm | null>({
    concepts: [],
  })
  const instructions_form = ref<IPaymentRequestInstructionsForm | null>({
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
  })
  const associated_data_form = ref<IPaymentRequestAssociatedDataForm | null>({
    assets: [
      {
        asset_source: '',
        asset_type_id: null,
        asset_number_id: null,
        plate_or_register: '',
      },
    ],
    financial_obligations: [
      {
        financial_obligation_id: null,
        installment_number: '',
        capital_value: '',
        interest_value: '',
        total_installment_value: '',
      },
    ],
    advances: [
      {
        advance_request_id: null,
        advance_number: '',
        advance_value: '',
        amortization_type: '',
        amortization_percentage: '',
        accumulated_amortization: '',
        balance_to_amortize: '',
        amortize_value: '',
      },
    ],
    table: [],
  })

  // configs
  const headerProps = {
    title: 'Crear solicitud de pago',
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
        label: 'Solicitudes de pago',
        route: 'PaymentRequestsList',
      },
      {
        label: 'Crear',
        route: 'PaymentRequestsCreate',
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
      name: 'main_information',
      label: 'Información principal',
      icon: defaultIconsLucide.filePenLine,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'concepts',
      label: 'Conceptos / Presupuesto',
      icon: defaultIconsLucide.rows2,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'instructions',
      label: 'Instrucciones de pago',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'associated_data',
      label: 'Datos asociados',
      icon: defaultIconsLucide.arrowRightLeft,
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

  const nextTab = async () => {
    const current = tabs.value[tabActiveIdx.value].name

    if (current === 'basic_data') {
      if (!basic_data_form.value || !basic_data_form.value?.process_source) {
        return
      }

      const ok = await _createPaymentRequestBasicData(basic_data_form.value)
      if (!ok) return
    }

    if (current === 'main_information') {
      if (
        !main_information_form.value ||
        !(await mainInformationFormRef.value?.validateForm?.())
      )
        return

      const ok = await _createPaymentRequestMainInformation(
        main_information_form.value
      )
      if (!ok) return
    }

    if (current === 'concepts') {
      if (
        !concepts_form.value ||
        (concepts_form.value?.concepts.length ?? 0) === 0 ||
        !(await conceptsFormRef.value?.validateForm?.())
      ) {
        return
      }

      const ok = await _createPaymentRequestConcepts(concepts_form.value)
      if (!ok) return
    }

    if (current === 'instructions') {
      if (
        !instructions_form.value ||
        !instructions_form.value?.payment_type ||
        !instructions_form.value?.payment_source ||
        !(await instructionsFormRef.value?.validateForm?.())
      ) {
        return
      }

      const ok = await _createPaymentRequestInstructions(
        instructions_form.value
      )
      if (!ok) return
    }

    tabActiveIdx.value++
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  // actions
  const handleCreate = async () => {
    if (!(await associatedDataFormRef.value?.validateForm?.())) {
      return
    }

    openMainLoader(true)

    let associatedData = false

    if (associated_data_form.value) {
      associated_data_form.value.advances =
        associated_data_form.value.advances.filter(
          (item) => !isEmptyOrZero(item)
        )

      associated_data_form.value.advances =
        associated_data_form.value.advances.map((item) => ({
          ...item,
          amortization_percentage:
            item.amortization_percentage == ''
              ? null
              : item.amortization_percentage,
          amortize_value:
            item.amortize_value == '' ? null : item.amortize_value,
        }))

      associatedData = await _createPaymentRequestAssociatedData(
        associated_data_form.value
      )
    }

    if (associatedData) {
      goToURL('PaymentRequestsList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  watch(
    () => basic_data_form.value?.supplier_id,
    async (val) => {
      main_information_form.value.city_id = null
      main_information_form.value.city_label = ''

      if (associated_data_form.value) {
        associated_data_form.value.advances = []
      }

      await _resetKeys(keysDerivativeContracting)

      if (val) {
        openMainLoader(true)
        await _getResources(
          keysDerivativeContracting,
          `filter[contractor_id]=${val}&filter[status_id]=1`
        )
        openMainLoader(false)

        const supplier = third_parties.value.find((item) => item.id == val)
        const economicActivity = supplier?.economic_activities ?? []

        if (economicActivity.length > 0) {
          const city = economicActivity[0]?.city

          main_information_form.value.city_id = city?.id ?? null
          main_information_form.value.city_label = `${city?.code} - ${city?.name}`
        }
      }
    },
    { deep: true }
  )

  watch(
    () => main_information_form.value.budget_document_type_id,
    async (val) => {
      main_information_form.value.budget_document_number_id = null
      await _resetKeys(keysBudget)

      if (!val) return

      _getResources(keysBudget, `filter[budget_document_type_id]=${val}`)
    }
  )

  watch(
    () => main_information_form.value.business_id,
    async (val) => {
      await _resetKeys(keysBank)

      if (associated_data_form.value) {
        associated_data_form.value.advances = []
      }

      if (!val) return

      _getResources(keysBank, `filter[business_trust_id]=${val}`)
    }
  )

  watch(
    () => main_information_form.value.budget_document_number_id,
    async (val) => {
      _resetKeys(keysBudgetTransfer)
      _resetKeys(keysBudgetOperation)

      if (!val) return

      const budget = budget_document_number.value.find(
        (item) => item.value == val
      )

      if (budget)
        _getResources(
          budget.operation_type == 'transfer'
            ? keysBudgetTransfer
            : keysBudgetOperation,
          'filter[only_active]=true'
        )
    }
  )

  watch(
    () => [
      basic_data_form.value?.invoice_issue_date,
      validate.value.hasLegalizationDate,
    ],
    () => {
      if (basic_data_form.value?.invoice_issue_date) {
        basic_data_form.value.invoice_due_date = moment(
          basic_data_form.value.invoice_issue_date
        )
          .add(1, 'month')
          .subtract(1, 'day')
          .format('YYYY-MM-DD')
      }

      if (
        validate.value.hasLegalizationDate &&
        basic_data_form.value?.invoice_issue_date != ''
      ) {
        main_information_form.value.legalization_date =
          basic_data_form.value?.invoice_issue_date ?? ''
      } else {
        main_information_form.value.legalization_date = ''
      }
    }
  )

  watch(
    () => main_information_form.value.legalization_date,
    () => {
      if (main_information_form.value.legalization_date != '') {
        main_information_form.value.movement_date =
          main_information_form.value.legalization_date
      }
    }
  )

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(
      keysThirdParty,
      'fields[]=id,document&&include=economicActivities,economicActivities.city,legalPerson,naturalPerson,bankAccounts'
    )
    thirdPartyStore.third_parties_beneficiary = [
      ...thirdPartyStore.third_parties,
    ]
    await _getResources(
      keysBusinessTrust,
      'filter[has_accounts_payable]=true&sort=business_code&can_manage=true'
    )
    await _getResources(
      keysDocType,
      'filter[model]=third-party-natural,third-party-legal'
    )
    await _getResources(keysConcepts, 'filter[concept_type]=operativo')
    await _getResources(keysMovementManagement, 'filter[status_id]=1')
    await _getResources(keysDoc, 'filter[status_id]=1')
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysThirdParty)
    _resetKeys(keysBusinessTrust)
    _resetKeys(keysBudget)
    _resetKeys(keysBudgetTransfer)
    _resetKeys(keysBudgetOperation)
    _resetKeys(keysBank)
  })

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    mainInformationFormRef,
    conceptsFormRef,
    instructionsFormRef,
    associatedDataFormRef,
    basic_data_form,
    main_information_form,
    concepts_form,
    instructions_form,
    associated_data_form,
    validate,

    // utils
    defaultIconsLucide,

    // methods
    nextTab,
    backTab,
    handleCreate,
    goToURL,
  }
}

export default usePaymentRequestsCreate
