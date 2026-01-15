// vue - quasar - pinia
import { ref, onBeforeMount, watch, computed, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { QTable } from 'quasar'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader } from '@/composables'

// Stores
import { useResourceStore } from '@/stores/resources-selects'
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'

// Interfaces
import {
  IBusinessAccounting,
  IBusinessBudget,
  IBusinessTreasury,
  ITrustBusinessRequest,
  IBusinessDerivedContracting,
  IBusinessCxPTrustBusiness,
  IRegulationTrustBusiness,
  IBillingCollect,
} from '@/interfaces/customs/trust-business/TrustBusinesses'

import { ITabs } from '@/interfaces/global'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useTrustBusinessesRead = () => {
  const { _getByIdTrustBusiness, _clearData } = useTrustBusinessStore('v1')
  const { trust_business_response, data_business_resources } = storeToRefs(
    useTrustBusinessStore('v1')
  )

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { getResources } = useResourceStore('v1')
  const { openMainLoader } = useMainLoader()

  const trust_business_keys = {
    trust_business: [
      'business_trust_register_types',
      'business_trust_fideico_types',
      'business_trust_society_types',
      'business_trust_subtypes',
      'business_trust_mode',
      'business_trust_classification',
      'business_trust_periodicity_accountability',
      'business_currency',
      'account_structures',
      'cost_centers_structures',
      'status_accounting',
      'close_treasurie',
      'cash_flow_structure',
      'collection_structure',

      // cxp
      'payment_concept_structure',
      'accounts_payable_closing',
    ],
  }

  const third_parties_keys = { trust_business: ['third_parties'] }

  const keys = ['countries', 'departments', 'cities', 'fiscal_responsability']

  const last_key = ['users']

  const headerProps = {
    title: 'Ver negocio fiduciario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
        route: 'TrustBusinessesList',
      },
      {
        label: 'Ver',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'documents',
      label: 'Documentos',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const register_expansion = ref([
    {
      name: 'trustor',
      label: 'Fideicomitente',
      type_resource: 2,
    },
    {
      name: 'participation_beneficiaries',
      label: 'Beneficiarios de participación',
      type_resource: 3,
    },
    {
      name: 'obligation_beneficiaries',
      label: 'Beneficiarios de obligación',
      type_resource: 1,
    },
    {
      name: 'consortium_members',
      label: 'Consorciados',
      type_resource: 4,
    },
    {
      name: 'accounting',
      label: 'Contabilidad',
    },
    {
      name: 'treasury',
      label: 'Tesoreria',
    },
    {
      name: 'regulation',
      label: 'Normativa',
    },
    {
      name: 'cxp',
      label: 'Cuentas por pagar',
    },
    {
      name: 'derived_contracting',
      label: 'Contratación derivada',
    },
    {
      name: 'budget',
      label: 'Presupuesto',
    },
    {
      name: 'fiduciary_fee',
      label: 'Comisión fiduciaria',
    },
    {
      name: 'billing',
      label: 'Facturación',
    },
    {
      name: 'policies',
      label: 'Pólizas',
    },
    {
      name: 'guarantees',
      label: 'Garantías',
    },
  ])

  // table
  const tablePropsEntity = ref({
    loading: false,
    columns: [
      {
        name: 'name',
        required: true,
        field: (row) => row.third_party?.name,
        label: 'Cliente',
        align: 'center',
        sortable: true,
      },
      {
        name: 'percentage_participation',
        field: 'percentage_participation',
        required: true,
        label: '% de participación',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as ITrustBusinessRequest[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // Referencias a formularios
  const informationFormRef = ref()

  const getAccountingModels = ref<IBusinessAccounting | null>(null)
  const getTreasuryModels = ref<IBusinessTreasury | null>(null)
  const getDerivedContractingModels = ref<IBusinessDerivedContracting | null>(
    null
  )
  const getCxPModels = ref<IBusinessCxPTrustBusiness | null>(null)
  const getBillingModels = ref<IBillingCollect[]>([])
  const getRegulationModels = ref<IRegulationTrustBusiness[]>([])
  const getBudgetModels = ref<IBusinessBudget | null>(null)

  const derived_contracting_trut_business_form_ref = ref()
  const cxp_treasury_trust_business_form_ref = ref()
  const billing_trust_business_form_ref = ref()
  const regulation_treasury_trust_business_form_ref = ref()

  const accounting_trust_business_form_ref = ref()
  const treasury_trust_business_form_ref = ref()
  const budget_trust_business_form_ref = ref()

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    router.push({ name: 'TrustBusinessesList' })
  }

  const computedParticipation = computed(() => {
    return (register_expansion: { type_resource: number }): number => {
      if (!tablePropsEntity.value.rows) return 0

      return tablePropsEntity.value.rows
        .filter(
          (item: ITrustBusinessRequest) =>
            item.type_resource === register_expansion.type_resource
        )
        .reduce((sum: number, item: ITrustBusinessRequest) => {
          const participation = parseFloat(item.percentage_participation || '0')
          return sum + (isNaN(participation) ? 0 : participation)
        }, 0)
    }
  })

  const isDerivateEnabled = computed(() => {
    return trust_business_response.value?.derivate_contracting ?? false
  })

  const isBudgetEnabled = computed(() => {
    return trust_business_response.value?.manage_budget ?? false
  })

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    getResources(`keys[]=${last_key.join('&keys[]=')}`)
    Promise.all([
      getResources(`keys[]=${keys.join('&keys[]=')}`),
      _getByIdTrustBusiness(searchId),
      _getResources(trust_business_keys),
      _getResources(third_parties_keys),
    ])

    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    await _resetKeys(trust_business_keys)
    await _resetKeys(third_parties_keys)
  })

  watch(
    () => data_business_resources.value,
    () => {
      tablePropsEntity.value.rows = data_business_resources.value ?? []
    }
  )

  watch(
    () => trust_business_response.value,
    () => {
      const data = trust_business_response.value?.accounting ?? null

      if (data) {
        getAccountingModels.value = {
          address: data.address ?? null,
          country_id: data.contry?.id ?? null,
          department_id: data.departament?.id ?? null,
          city_id: data.city?.id ?? null,
          retaining_agent_id: data.retaining_agent?.id ?? null,
          status_id: data.status?.id ?? null,
          status_name: data.status?.name ?? null,
          accounting_structure_id: data.accounting_structure?.id ?? null,
          has_fiscal_responsibility: data.has_fiscal_responsibility ?? null,
          has_responsibility_iva: data.has_responsibility_iva ?? null,
          cost_center_structure_id: data.cost_center_structure?.id ?? null,
          auxiliary_nit: data.nit_auxiliary?.document_number ?? null,
          identification_tax: data.tax_identification?.document_number ?? null,
          has_cost_center:
            typeof data.has_cost_center === 'boolean'
              ? data.has_cost_center
              : null,
          functional_business_currency:
            data.functional_business_currency ?? null,
          has_consolidator: data.has_consolidator ?? null,
          can_foreign_currency: data.can_foreign_currency ?? null,
          can_retains_ica: data.can_retains_ica ?? null,
          retains_differential_ica: data.retains_differential_ica ?? null,
          startup_period: data.startup_period ?? null,
          current_period: data.current_period ?? null,
          last_closing: data.last_closing ?? null,
          last_closing_daily: data.last_closing_daily ?? null,
          last_closing_day: data.last_closing_day ?? null,
          daily_closing: data.daily_closing ?? null,
          last_restatement_foreign_currency:
            data.last_restatement_foreign_currency ?? null,
          business_account_structures:
            data.business_account_structures?.map((item) => ({
              ...item,
              account_structure_id: item.account_structure?.id,
            })) ?? [],
          has_tax_structure: data.has_tax_structure,
          has_equivalent_structure: data.has_equivalent_structure,
        }
      }

      const dataTreasury = { ...trust_business_response.value?.treasurie }
      if (dataTreasury) {
        getTreasuryModels.value = {
          closing: dataTreasury.closing ?? null,
          last_close_date: dataTreasury.last_close_date ?? null,
          has_cash_flow: dataTreasury.has_cash_flow ?? null,
          can_bank_reconciliation: dataTreasury.can_bank_reconciliation ?? null,
          last_conciliation_date: dataTreasury.last_conciliation_date ?? null,
          cash_flow_structure:
            dataTreasury.cash_flow_structure?.purpose ?? null,
          cash_flow_structure_id: dataTreasury.cash_flow_structure?.id ?? null,
          has_collection_structure:
            dataTreasury.has_collection_structure ?? null,
          has_box_structure: dataTreasury.has_box_structure ?? null,
          collection_structure_id:
            dataTreasury.collection_structure?.id ?? null,
          box_structure_id: dataTreasury.box_structure?.id ?? null,
        }
      }
      const dataDerivateContranting = {
        ...trust_business_response.value?.derivate_contrating,
      }
      if (dataDerivateContranting) {
        getDerivedContractingModels.value = {
          has_budget: dataDerivateContranting.has_budget ?? false,
          has_project: dataDerivateContranting.has_project ?? false,
          has_structure_work:
            dataDerivateContranting.has_structure_work ?? false,
          derivate_works_plan: dataDerivateContranting.works_plan ?? [],
        }
      }

      const dataCxP = {
        ...trust_business_response.value?.accounts_payable,
      }

      getCxPModels.value = dataCxP
        ? {
            closing: dataCxP.closing ?? null,
            last_closing_date: dataCxP.last_closing_date ?? null,
            validity: dataCxP.validity ?? null,
            account_structure_id: dataCxP.account_structure?.purpose ?? null,
          }
        : null

      if (trust_business_response.value?.normative) {
        getRegulationModels.value =
          trust_business_response.value?.normative ?? []
      }

      if (trust_business_response.value?.billing_collect) {
        getBillingModels.value =
          trust_business_response.value?.billing_collect ?? []
      }

      const dataBudget = {
        ...trust_business_response.value?.budget,
      }
      if (dataBudget) {
        getBudgetModels.value = {
          validity: dataBudget.validity ?? null,
          current_month: dataBudget.current_month ?? null,
          current_month_id: dataBudget.current_month_id ?? null,
          last_closing_date: dataBudget.last_closing_date ?? null,
          closing_type: dataBudget.closing_type ?? null,
          mhcp_section_code: Number(dataBudget.mhcp_section_code ?? null),
          mhcp_section_description: dataBudget.mhcp_section_description ?? null,
          budget_structure_id: dataBudget.budget_structure_id ?? null,
          budget_structure: dataBudget.budget_structure ?? undefined,
          generic_area_id: dataBudget.generic_area_id ?? null,
          generic_area: dataBudget.generic_area ?? null,
          expense_authorizer_id: dataBudget.expense_authorizer_id ?? null,
          expense_authorizer: dataBudget.expense_authorizer ?? null,
          id: dataBudget.id ?? null,
          budget_structure_code: dataBudget.budget_structure_code ?? null,
        }
      }
    },
    { immediate: true, deep: true }
  )

  return {
    trust_business_response,
    searchId,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    register_expansion,
    informationFormRef,
    getAccountingModels,
    getTreasuryModels,
    getDerivedContractingModels,
    data_business_resources,
    accounting_trust_business_form_ref,
    treasury_trust_business_form_ref,
    derived_contracting_trut_business_form_ref,
    tablePropsEntity,
    getCxPModels,
    cxp_treasury_trust_business_form_ref,
    getBillingModels,
    billing_trust_business_form_ref,
    getRegulationModels,
    regulation_treasury_trust_business_form_ref,
    isDerivateEnabled,
    getBudgetModels,
    budget_trust_business_form_ref,
    isBudgetEnabled,

    // Methods
    nextTab,
    backTab,
    onSubmit,
    computedParticipation,
  }
}

export default useTrustBusinessesRead
