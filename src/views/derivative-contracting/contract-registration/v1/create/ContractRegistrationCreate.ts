// Vue - Pinia - Router - Quasar
import { ref, onBeforeMount, onBeforeUnmount, watch } from 'vue'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IContractRegistrationFormToSend,
  IContractRegistrationGeneralDataForm,
} from '@/interfaces/customs/derivative-contracting/ContractRegistration'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useContractRegistrationStore } from '@/stores/derivative-contracting/contract-registration'
import { useResourceStore } from '@/stores/resources-selects'

const useContractRegistrationCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { getResources } = useResourceStore('v1')

  const store = useContractRegistrationStore('v1')
  const { _createAction, _clearData } = store

  const generalDataFormRef = ref()
  const scheduledPaymentMilestonesFormRef = ref()
  const associatedBudgetFormRef = ref()
  const futureValiditiesFormRef = ref()
  const documentaryStructureFormRef = ref()
  const policiesFormRef = ref()
  const clausesFormRef = ref()

  const generalDataForm = ref<IContractRegistrationGeneralDataForm | null>(null)

  const headerProps = {
    title: 'Crear registros del contrato',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
      },
      {
        label: 'Registro de contratos',
        route: 'ContractRegistrationList',
      },
      {
        label: 'Crear',
        route: 'ContractRegistrationCreate',
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
      required: true,
    },
    {
      name: 'scheduled_payment_milestones',
      label: 'Hitos de pagos programados',
      icon: defaultIconsLucide.listCheck,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'associated_budget',
      label: 'Presupuesto asociado',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: true,
      show: false,
      required: true,
    },
    {
      name: 'future_validities',
      label: 'Vigencias futuras',
      icon: defaultIconsLucide.calendar,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'documentary_structure',
      label: 'Estructura documental',
      icon: defaultIconsLucide.book,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'policies',
      label: 'Pólizas',
      icon: defaultIconsLucide.listCheck,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'clauses',
      label: 'Clausulas',
      icon: defaultIconsLucide.stickyNote,
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

  const validateForm = async () => {
    const forms = [
      generalDataFormRef,
      scheduledPaymentMilestonesFormRef,
      associatedBudgetFormRef,
      futureValiditiesFormRef,
      documentaryStructureFormRef,
      policiesFormRef,
      clausesFormRef,
    ]
    if (forms.length && forms[tabActiveIdx.value]) {
      switch (tabActiveIdx.value) {
        case 1:
          if (!generalDataForm.value?.milestones?.length) {
            return false
          }
          break

        case 2:
          if (!generalDataForm.value?.budget_documents?.length) {
            return false
          }
          break
        case 3:
          if (!generalDataForm.value?.future_validities?.length) {
            return false
          }
          break
      }

      return forms[tabActiveIdx.value].value.validateForm()
    }
    return false
  }

  const makeBaseInfoRequest = (
    data: IContractRegistrationGeneralDataForm | null
  ) => {
    const request: Partial<IContractRegistrationFormToSend> = {
      contract: {
        business_trusts_id: Number(data?.business_trusts_id),
        contract_document_structure_id: Number(
          data?.contract_document_structure_id
        ),

        registration_date: data?.registration_date ?? '',
        internal_number: data?.internal_number ?? '',
        contract_number: data?.contract_number ?? '',
        name: data?.name ?? '',
        object: data?.object ?? '',

        subscription_date: data?.subscription_date ?? '',
        duration: data?.duration ?? null,
        periodicity: data?.periodicity ?? null,
        execution_start_date: data?.execution_start_date ?? '',
        execution_end_date: data?.execution_end_date ?? '',

        currency_id: data?.currency_id ?? null,
        contract_value: data?.contract_value ?? null,

        has_stamp_tax: data?.has_stamp_tax ?? false,
        requires_publication: data?.requires_publication ?? false,

        project_id: data?.project_id ?? null,
        work_plan_id: Number(data?.work_plan_id),
        work_plan_structure_id: data?.work_plan_structure_id ?? null,
        work_plan_code: String(data?.work_plan_code),

        contractor_id: Number(data?.contractor_id),
        supervision_role: data?.supervision_role ?? null,
        supervisor_id: Number(data?.supervisor_id),
        other_supervision_role: data?.other_supervision_role ?? null,
        supervisor2_id: Number(data?.supervisor2_id),
        execution_city_id: Number(data?.execution_city_id),

        internal_notes: data?.internal_notes ?? '',
        amount: Number(data?.amount),
      },

      milestones:
        data?.milestones?.map((item) => ({
          payment_type_id: item.payment_type_id,
          scheduled_date: item.scheduled_date,
          foreign_amount: item.foreign_amount,
          local_amount: item.local_amount,
          applies_budget: item.applies_budget,
        })) || [],

      budget_documents:
        data?.budget_documents?.map((doc) => ({
          id: doc.id,
          budget_document_id: doc.budget_document_id,
          budget_document_type_id: doc.budget_document_type_id,
          available_balance: doc.available_balance,
          committed_balance: doc.committed_balance,

          budget_records:
            doc.operation_log_details?.flatMap((rec) =>
              rec.budget_records?.length
                ? rec.budget_records.map((milestone) => ({
                    contract_budget_record_id: rec.id,
                    budget_document_id: doc.budget_document_id,
                    contract_payment_milestone: Number(milestone.id) - 1,
                    assigned_value: Number(milestone.assigned_value || 0),
                  }))
                : []
            ) || [],
        })) || [],

      future_validities:
        data?.future_validities?.map((item) => ({
          fiscal_year: Number(item.fiscal_year),
          budget_resource_id: item.budget_resource_id,
          budget_area_id: item.budget_area_id,
          budget_item_id: item.budget_item_id,
          committed_future_value: item.committed_future_value,

          milestones: item.milestones?.map((mil, index) => ({
            payment_milestone: index,
            future_coverage_amount: mil.future_coverage_amount,
          })),
        })) || [],

      annex_documents:
        data?.annex_documents?.map((doc) => ({
          annex_document_id: doc.annex_document_id,
          document_id: Number(doc.id) || null,
          is_validated: doc.is_validated,
        })) || [],

      contract_policies:
        data?.contract_policies?.map((item) => ({
          policie_id: item.policie_id,
          insurer_id: item.insurer_id,
          beneficiary_id: item.beneficiary_id,
          policy_number: item.policy_number,
          insured_value: item.insured_value,
          start_date: item.start_date,
          end_date: item.end_date,
          status_id: 1,

          coverages:
            item.coverages?.map((cov) => ({
              risk_id: cov.risk_id,
              maximum_coverage_value: cov.maximum_coverage_value,
            })) || [],

          attachments:
            item.attachments?.map((att) => ({
              document_id: att.document_id ?? undefined,
              is_validated: att.is_validated,
            })) || [],
        })) || [],

      clauses:
        data?.clauses?.map((item) => ({
          contract_clause_id: item.contract_clause_id,
          clause_type_id: item.clause_type_id,
          order: Number(item.order),
          name: item.name,
          description: item.description,
          clausule: item.clausule,
        })) || [],
    }

    return request
  }

  const makeDataRequest = () => {
    const apiRequestBody = {
      ...makeBaseInfoRequest(generalDataForm.value),
    } as IContractRegistrationFormToSend

    return apiRequestBody
  }

  const getNextVisibleTabIdx = (fromIdx: number, direction: 1 | -1) => {
    let idx = fromIdx + direction

    while (idx >= 0 && idx < tabs.value.length && !tabs.value[idx].show) {
      idx += direction
    }

    return idx
  }

  const nextTab = async () => {
    if (!(await validateForm())) return

    const nextIdx = getNextVisibleTabIdx(tabActiveIdx.value, 1)
    if (nextIdx >= tabs.value.length) return

    tabActiveIdx.value = nextIdx
    tabActive.value = tabs.value[nextIdx].name
  }

  const backTab = () => {
    const prevIdx = getNextVisibleTabIdx(tabActiveIdx.value, -1)
    if (prevIdx < 0) return

    tabActiveIdx.value = prevIdx
    tabActive.value = tabs.value[prevIdx].name
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createAction(payload)
    if (success) {
      goToURL('ContractRegistrationList')
    }
    openMainLoader(false)
  }

  const keys = {
    investment_portfolio: ['coins'],
    derivative_contracting: [
      'contract_document_structure ',
      'contract_type_status_statuses_substatuses',
      'project',
      'work_plan',
      'policies',
      'risk_list',
      'clause_types',
      'contract_clauses_codes',
      'payment_type',
      'policy_status',
    ],
    budget: [
      'operation_logs_authorized',
      'areas_resposabilities_codes',
      'budget_item_codes',
      'budget_resources_types',
    ],
  }

  const keysToClear = {
    trust_business: ['business_trusts'],
    third_party: ['third_parties'],
    investment_portfolio: ['coins'],
    derivative_contracting: [
      'contract_document_structure ',
      'substatuses_contract_type_status_statuses_substatuses',
      'project',
      'work_plan',
      'policies',
      'risk_list',
      'clause_types',
      'contract_clauses_codes',
      'payment_type',
      'contract_attachments',
      'policy_status',
    ],
    budget: [
      'operation_logs_authorized',
      'areas_resposabilities_codes',
      'budget_item_codes',
      'budget_resources_types',
    ],
  }

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await Promise.all([
      _getResources(
        { trust_business: ['business_trusts'] },
        'filter[status_id]=57&filter[business_type_id]=1&filter[derivate_contracting]=1'
      ),
      _getResources(
        { third_party: ['third_parties'] },
        'include=status,addresses,legalPerson,naturalPerson&filter[is_customer]=1&fields[]=id,document,third_party_category,commercial_registration'
      ),
      getResources(`keys[]=cities`),
      _getResources(keys),
    ])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keysToClear)
  })

  watch(
    () =>
      generalDataForm.value?.milestones?.some((m) => m.applies_budget) ?? false,
    (show) => {
      const tab = tabs.value.find((t) => t.name === 'associated_budget')
      if (tab) tab.show = show
    },
    { immediate: true }
  )

  watch(
    () => generalDataForm.value?.show_future_validities ?? true,
    (show) => {
      const tab = tabs.value.find((t) => t.name === 'future_validities')
      if (tab) tab.show = show
    },
    { immediate: true }
  )

  return {
    generalDataForm,
    generalDataFormRef,
    scheduledPaymentMilestonesFormRef,
    associatedBudgetFormRef,
    futureValiditiesFormRef,
    documentaryStructureFormRef,
    policiesFormRef,
    clausesFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,

    nextTab,
    backTab,
    goToURL,
    onSubmit,
  }
}

export default useContractRegistrationCreate
