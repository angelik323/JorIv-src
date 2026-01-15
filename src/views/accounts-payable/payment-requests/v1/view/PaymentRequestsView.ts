// core
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'
import { IPaymentRequestView } from '@/interfaces/customs/accounts-payable/PaymentRequests'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useFinantialObligationResourceStore } from '@/stores/resources-manager/finantial-obligations'
import { useAssetResourceStore } from '@/stores/resources-manager/assets'
import { usePaymentRequestsStore } from '@/stores/accounts-payable/payment-requests'

const usePaymentRequestsView = () => {
  // hooks
  const route = useRoute()
  const id = +route.params.id

  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getPaymentRequestById } = usePaymentRequestsStore('v1')
  const {
    offices,
    info_collective_investment_funds,
    fiduciary_investment_plans_treasury,
  } = storeToRefs(useFicResourceStore('v1'))
  const { third_parties, document_types } = storeToRefs(
    useThirdPartyResourceStore('v1')
  )
  const { basic_info_contract, contract_payment_milestones } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )
  const { business_trusts, accounts_payables } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { cities } = storeToRefs(useAssetResourceStore('v1'))
  const {
    budget_document_transfer_type,
    budget_document_number,
    budget_transfer_details_responsibility_area,
    budget_transfer_details_budget_item,
    budget_transfer_details_resource,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const {
    payments_with_code,
    banks,
    bank_accounts_with_name,
    bank_account_third_party_quotas,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { configuration_type, asset_number } = storeToRefs(
    useFixedAssetsResourceStore('v1')
  )
  const { financial_obligations } = storeToRefs(
    useFinantialObligationResourceStore('v1')
  )

  // refs
  const basicDataFormRef = ref()
  const mainInformationFormRef = ref()
  const ConceptsFormRef = ref()
  const InstructionsFormRef = ref()
  const AssociatedDataFormRef = ref()

  const data = ref<IPaymentRequestView | null>()

  // configs
  const headerProps = {
    title: 'Ver solicitud de pago',
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
        label: 'Ver',
        route: 'PaymentRequestsView',
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
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const fetchLabel = async (
    moduleMap: Record<string, string[]>,
    store: { value: Array<{ label?: string }> },
    filter: string
  ) => {
    await _getResources(moduleMap, filter)
    return store.value[0]?.label ?? '-'
  }

  // lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)
    data.value = (await _getPaymentRequestById(
      id
    )) as IPaymentRequestView | null

    if (data.value) {
      const businessId = data.value.detail?.business_id

      if (businessId) {
        data.value.advances = data.value.advances.map((a) => ({
          ...a,
          business_id: businessId,
        }))
      }
    }

    // A partir de aquí, se realiza el código de esta manera, porque si se obtienen los labels desde el backend, tarda demasiado y genera un error por timeout.
    // Se envía un filtro por ID para que el selector solo consulte el registro específico y no demore.
    // Se usa Promise.all para lanzar las peticiones en paralelo y optimizar el tiempo de ejecución.
    if (data.value) {
      const [officeLabel, supplierLabel] = await Promise.all([
        fetchLabel(
          { fics: ['offices'] },
          offices,
          `filter[id]=${data.value.office_id ?? 0}`
        ),

        fetchLabel(
          { third_party: ['third_parties'] },
          third_parties,
          `filter[id]=${
            data.value.supplier_id ?? 0
          }&fields[]=id,document&include=economicActivities,economicActivities.city,legalPerson,naturalPerson`
        ),
      ])

      data.value.office_label = officeLabel
      data.value.supplier_label = supplierLabel

      let budgetDocId = null

      if (data.value.detail) {
        const d = data.value.detail

        const [
          business_label,
          payment_structure_label,
          contract_label,
          milestone_label,
          budget_document_type_label,
          budget_document_number_label,
          city_label,
        ] = await Promise.all([
          fetchLabel(
            { trust_business: ['business_trusts'] },
            business_trusts,
            `filter[id]=${d.business_id ?? 0}`
          ),

          fetchLabel(
            { trust_business: ['accounts_payables'] },
            accounts_payables,
            `filter[business_trust_id]=${d.business_id ?? 0}`
          ),

          fetchLabel(
            { derivative_contracting: ['basic_info_contract'] },
            basic_info_contract,
            `filter[id]=${d.contract_id ?? 0}`
          ),

          fetchLabel(
            { derivative_contracting: ['contract_payment_milestones'] },
            contract_payment_milestones,
            `filter[id]=${d.milestone_id ?? 0}`
          ),

          fetchLabel(
            { budget: ['budget_document_types_selector'] },
            budget_document_transfer_type,
            `filter[id]=${d.budget_document_type_id ?? 0}`
          ),

          fetchLabel(
            { budget: ['budget_document_number'] },
            budget_document_number,
            `filter[id]=${d.budget_document_number_id ?? 0}`
          ),

          fetchLabel(
            { assets: ['cities'] },
            cities,
            `filter[id]=${d.city_id ?? 0}`
          ),
        ])

        d.business_label = business_label
        d.payment_structure_label = payment_structure_label
        d.contract_label = contract_label
        d.milestone_label = milestone_label
        d.budget_document_type_label = budget_document_type_label
        d.budget_document_number_label = budget_document_number_label
        d.city_label = city_label

        budgetDocId = budget_document_number.value.find(
          (item) => item.value == d.budget_document_number_id
        )
      }

      if (data.value.concepts) {
        if (budgetDocId) {
          await _getResources(
            budgetDocId.operation_type == 'transfer'
              ? {
                  budget: ['budget_transfer_details'],
                }
              : {
                  budget: ['operation_log_details'],
                },
            'filter[only_active]=true'
          )
        }

        for (const concept of data.value.concepts ?? []) {
          for (const budget of concept.budgets ?? []) {
            budget.area_label =
              budget_transfer_details_responsibility_area.value.find(
                (a) => a.value === budget.area_id
              )?.label ?? '-'

            budget.budget_item_label =
              budget_transfer_details_budget_item.value.find(
                (item) => item.value === budget.budget_item_id
              )?.label ?? '-'

            budget.resource_label =
              budget_transfer_details_resource.value.find(
                (r) => r.value === budget.resource_id
              )?.label ?? '-'
          }
        }
      }

      if (data.value.instructions) {
        const i = data.value.instructions[0]

        if (i) {
          const [payment_method_label, authorized_doc_type_label] =
            await Promise.all([
              fetchLabel(
                { treasury: ['payments'] },
                payments_with_code,
                `filter[id]=${i.payment_method_id ?? 0}`
              ),

              fetchLabel(
                { third_party: ['document_types'] },
                document_types,
                `filter[id]=${i.authorized_doc_type_id ?? 0}`
              ),
            ])

          i.payment_method_label = payment_method_label
          i.authorized_doc_type_label = authorized_doc_type_label

          const [fund_or_bank_label, plan_or_account_label] = await Promise.all(
            i.payment_source == 'cuenta_bancaria'
              ? [
                  fetchLabel(
                    { treasury: ['banks'] },
                    banks,
                    `filter[id]=${i.fund_or_bank_id ?? 0}`
                  ),
                  fetchLabel(
                    { treasury: ['bank_account'] },
                    bank_accounts_with_name,
                    `filter[id]=${i.plan_or_account_id ?? 0}`
                  ),
                ]
              : [
                  fetchLabel(
                    { fics: ['get_info_collective_investment_funds'] },
                    info_collective_investment_funds,
                    `filter[id]=${i.fund_or_bank_id ?? 0}`
                  ),
                  fetchLabel(
                    { fics: ['fiduciary_investment_plans'] },
                    fiduciary_investment_plans_treasury,
                    `filter[id]=${i.plan_or_account_id ?? 0}`
                  ),
                ]
          )

          i.fund_or_bank_label = fund_or_bank_label
          i.plan_or_account_label = plan_or_account_label

          for (const details of i.details ?? []) {
            details.payment_method_label = await fetchLabel(
              { treasury: ['payments'] },
              payments_with_code,
              `filter[id]=${details.payment_method_id ?? 0}`
            )

            await _getResources(
              { third_party: ['third_parties'] },
              `filter[id]=${
                details.beneficiary_id ?? 0
              }&fields[]=id,document&include=economicActivities,economicActivities.city,legalPerson,naturalPerson`
            )

            details.beneficiary_doc = String(third_parties.value[0].document)

            await _getResources(
              { treasury: ['bank_account_third_party'] },
              `third_party_id=${details.beneficiary_id}`
            )

            details.beneficiary_bank_account_label =
              bank_account_third_party_quotas.value.find(
                (a) => a.id === details.beneficiary_bank_account_id
              )?.label ?? '-'
          }
        }
      }

      if (data.value.assets) {
        const a = data.value.assets[0]

        if (a) {
          const [asset_type_label, asset_number_label] = await Promise.all([
            fetchLabel(
              { fixed_assets: ['configuration_type'] },
              configuration_type,
              `filter[id]=${a.asset_type_id ?? 0}`
            ),

            fetchLabel(
              { fixed_assets: ['asset_number'] },
              asset_number,
              `filter[id]=${a.asset_number_id ?? 0}`
            ),
          ])

          a.asset_type_label = asset_type_label
          a.asset_number_label = asset_number_label
        }
      }

      if (data.value.financial_obligations) {
        const f = data.value.financial_obligations[0]

        if (f) {
          f.financial_obligation_label = await fetchLabel(
            { finantial_obligations: ['financial_obligations'] },
            financial_obligations,
            `filter[id]=${f.financial_obligation_id ?? 0}`
          )
        }
      }

      if (data.value.advances) {
        for (const advances of data.value.advances ?? []) {
          advances.business_label = data.value.detail?.business_label
        }
      }
    }

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({ fics: ['offices'] })
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
    ConceptsFormRef,
    InstructionsFormRef,
    AssociatedDataFormRef,
    data,

    // utils
    defaultIconsLucide,

    // methods
    nextTab,
    backTab,
    goToURL,
  }
}

export default usePaymentRequestsView
