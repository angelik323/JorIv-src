// Vue - Pinia - Router - Quasar
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

// Composables
import { useUtils, useGoToUrl, useMainLoader } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IContractRegistrationGeneralDataForm,
  IContractRegistrationResponse,
} from '@/interfaces/customs/derivative-contracting/ContractRegistration'

// Stores
import { useContractRegistrationStore } from '@/stores/derivative-contracting/contract-registration'

const useContractRegistrationView = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, formatDate, formatCodeName } = useUtils()
  const { goToURL } = useGoToUrl()

  const store = useContractRegistrationStore('v1')
  const { _getByIdAction } = store

  const generalDataFormRef = ref()
  const scheduledPaymentMilestonesFormRef = ref()
  const associatedBudgetFormRef = ref()
  const futureValiditiesFormRef = ref()
  const documentaryStructureFormRef = ref()
  const clausesFormRef = ref()

  const generalDataForm = ref<IContractRegistrationGeneralDataForm | null>(null)

  const route = useRoute()
  const searchId = +route.params.id

  const headerProps = {
    title: 'Ver registros del contrato',
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
        label: 'Ver',
        route: 'ContractRegistrationView',
      },
      {
        label: `${searchId}`,
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
      show: true,
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
      required: true,
    },
    {
      name: 'clauses',
      label: 'Clausulas',
      icon: defaultIconsLucide.stickyNote,
      outlined: true,
      disable: true,
      show: true,
      required: true,
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

  const setDataView = (data: IContractRegistrationResponse) => {
    const contract = data.contract
    generalDataForm.value = {
      business_trusts_id: formatCodeName(
        contract?.business?.business_code,
        contract?.business?.name
      ),
      contract_document_structure_id: formatCodeName(
        contract?.type_contractual_document?.document_code,
        contract?.type_contractual_document?.document_name
      ),
      registration_date: contract?.registration_date,
      internal_number: contract?.internal_number,
      contract_number: contract?.contract_number,
      name: contract?.name,
      object: contract?.object,
      subscription_date: contract?.subscription_date,
      duration: contract?.duration,
      periodicity: contract?.periodicity,
      execution_start_date: contract?.execution_start_date,
      execution_end_date: contract?.execution_end_date,
      currency_id: contract?.currency_id,
      contract_value: contract?.contract_value,
      has_stamp_tax: contract?.has_stamp_tax,
      requires_publication: contract?.requires_publication,
      project_id: contract?.project_id,
      work_plan_id: contract?.work_plan?.name,
      work_plan_structure_id: contract?.work_plan?.structure_plan_code_id,
      work_plan_structure: contract?.work_plan?.structure_name,
      work_plan_code: contract?.work_plan?.code,
      contractor_id: contract?.contractor?.data?.full_name,
      supervision_role: contract?.supervision_role?.toString() ?? null,
      supervisor_id: contract?.supervisor?.data?.name,
      other_supervision_role: contract?.other_supervision_role,
      supervisor2_id: contract?.supervisor2?.data?.name,
      execution_city_id: formatCodeName(
        contract?.execution_city?.code,
        contract?.execution_city?.name
      ),
      internal_notes: contract?.internal_notes,
      amount: contract?.amount?.toString() ?? null,
      trm_value: contract?.trm?.toString() ?? null,
      status_id: contract?.status?.name ?? null,
      stage: contract?.stage?.name ?? null,
      project_name: formatCodeName(
        contract?.project?.code,
        contract?.project?.name
      ),

      total_available_balance: null,
      total_committed_balance: null,
      total_outstanding_balance: null,
      scheduled_milestone_id: null,

      milestones:
        data.milestones.map(
          ({
            id,
            milestone_number,
            payment_type_id,
            payment_type,
            scheduled_date,
            foreign_amount,
            local_amount,
            applies_budget,
          }) => ({
            id,
            milestone: milestone_number,
            payment_type_id,
            payment_type_name: formatCodeName(
              payment_type?.code,
              payment_type?.name
            ),
            scheduled_date,
            foreign_amount,
            local_amount,
            applies_budget,
          })
        ) ?? [],

      budget_documents:
        data.budgetDocuments?.map((bd) => ({
          id: bd.id,
          validity: bd.validity?.toString(),
          budget_document_type_name: formatCodeName(
            bd.budget_document_type?.[0]?.code,
            bd.budget_document_type?.[0]?.description
          ),
          available_balance: bd.available_balance,
          document_date: formatDate(bd.created_at, 'YYYY-MM-DD'),
          document_name: formatCodeName(
            bd.budget_document?.[0]?.id,
            bd.budget_document?.[0]?.operation_label || ''
          ),
          value_document: bd.budget_document_value,
          budget_document_type_id: bd.budget_document_type_id,
          budget_document_id: bd.budget_document_id,

          operation_log_details:
            bd.budget_document?.[0]?.operation_log_details?.map(
              (logDetail) => ({
                ...logDetail,
                budget_records:
                  bd.records
                    ?.filter(
                      (rec) => rec.contract_budget_record_id === logDetail.id
                    )
                    .map((rec) => ({
                      id: rec.payment_milestone?.id,
                      assigned_value: rec.assigned_value || '0',
                    })) || [],
              })
            ) || [],
        })) ?? [],

      future_validities:
        data.futureValidities?.map((fv) => ({
          id: fv.id,
          fiscal_year: fv.fiscal_year,
          budget_resource: fv.budget_resource?.label,
          budget_area: fv.budget_area?.label,
          budget_item: fv.budget_item?.label,
          projected_value: fv.projected_value,
          committed_future_value: fv.committed_future_value,
          budget_resource_id: fv.budget_resource_id,
          budget_area_id: fv.budget_area_id,
          budget_item_id: fv.budget_item_id,
          milestones: fv.milestones.map((m) => ({
            id: m.milestone?.id,
            future_coverage_amount: m.future_coverage_amount,
          })),
        })) ?? [],

      annex_documents:
        data.annexDocuments?.map((doc) => ({
          id: doc.id,
          annex_document_id: doc.annex_document_id,
          document: doc.annex_document?.name,
          file_name: doc.file_name,
          file_path: doc.file_path,
          size: doc.size,
          is_validated: true,
        })) ?? [],

      contract_policies:
        data.policies?.map((policy) => ({
          id: policy.id,
          policie_id: policy.id,
          policie: formatCodeName(policy.policie?.code, policy.policie?.name),
          policy_number: policy.policy_number,
          beneficiary: policy.beneficiary_id?.data?.name ?? null,
          beneficiary_id: policy.beneficiary_id?.data?.third_party_id ?? null,
          insurer_id: policy.insurer_id ?? null,
          insurance: policy.insurer?.data?.name ?? null,
          insured_value: policy.insured_value ?? null,
          start_date: policy.start_date,
          end_date: policy.end_date,
          status_id: policy.status?.id,
          attachments:
            policy.annex_documents?.map(
              ({
                id,
                annex_document_id,
                file_name,
                file_path,
                size,
                created_at,
              }) => ({
                id,
                annex_document_id,
                file_name,
                file_path,
                size,
                is_validated: true,
                creation_data: formatDate(created_at, 'YYYY-MM-DD'),
              })
            ) ?? [],
          coverages:
            policy.coverages?.map(({ id, risk, maximum_coverage_value }) => ({
              id,
              risk_id: risk?.id,
              risk_name: risk?.name,
              minimum_percentage: Number(risk?.minimum_percentage),
              coverage_percentage: Number(risk?.maximum_percentage),
              maximum_coverage_value: String(maximum_coverage_value),
            })) ?? [],
        })) ?? [],

      clauses:
        data.clauses?.map((clause) => ({
          id: clause.id,
          order: clause.order,
          clause_type: clause.clause_type?.name ?? null,
          clause_type_id: clause.clause_type_id?.toString() ?? null,
          name: clause.name,
          description: clause.description,
          clausule: clause.clausule?.clausule ?? null,
          contract_clause_id: clause.id ?? null,
        })) ?? [],
    }
  }

  const onSubmit = async () => {
    goToURL('ContractRegistrationList')
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    const response = await _getByIdAction(searchId)
    if (response) setDataView(response)
    openMainLoader(false)
  })

  return {
    generalDataForm,
    generalDataFormRef,
    scheduledPaymentMilestonesFormRef,
    associatedBudgetFormRef,
    futureValiditiesFormRef,
    documentaryStructureFormRef,
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

export default useContractRegistrationView
