// Vue, pinia
import { ref, onBeforeUnmount, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Interfaces
import {
  IBasicDataFormAdditions,
  IBudgetFormAdditions,
  IClausesFormAdditions,
  IDocumentsFormAdditions,
  IPoliciesFormAdditions,
  IRegisterAdditionsResponse,
  ISchedulePaymentsFormAdditions,
  IValidityFormAdditions,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useRegisterAdditionsStore } from '@/stores/derivative-contracting'

const useContractClausesRead = () => {
  const { _getByIdRegisterAdditions, _clearData, _getContractDataById } =
    useRegisterAdditionsStore('v1')
  const { register_additions_response } = storeToRefs(
    useRegisterAdditionsStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const route = useRoute()
  const searchId = +route.params.id
  const contractId = +route.params?.contract_id

  // Data de formularios
  const basic_data_form = ref<IBasicDataFormAdditions | null>(null)
  const schedule_payments_form = ref<ISchedulePaymentsFormAdditions | null>(
    null
  )
  const budget_form = ref<IBudgetFormAdditions | null>(null)
  const validity_form = ref<IValidityFormAdditions | null>(null)
  const documents_form = ref<IDocumentsFormAdditions | null>(null)
  const policies_form = ref<IPoliciesFormAdditions | null>(null)
  const clauses_form = ref<IClausesFormAdditions | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()
  const paymentFormRef = ref()
  const budgetFormRef = ref()
  const validityFormRef = ref()
  const documentFormRef = ref()
  const policesFormRef = ref()
  const clausesFormRef = ref()

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { goToURL } = useGoToUrl()

  const keys = {
    derivative_contracting: [
      'contract_periodicity',
      'contract_modification_type',
      'policies',
      'policy_status',
      'clause_types',
    ],
    budget: ['operation_logs_authorized'],
  }

  const headerProps = {
    title: 'Ver adición de contrato',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
        route: '',
      },
      {
        label: 'Registro de adiciones',
        route: 'RegisterAdditionsList',
      },
      {
        label: 'Ver',
        route: 'RegisterAdditionsRead',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabRules = {
    schedule_payments: [1, 3],
    budget: [1, 3],
    validity: [1, 3],
  }

  const isEnabled = (ruleList: number[]): boolean => {
    return ruleList.includes(basic_data_form.value?.modification_type as number)
  }

  const tabs = computed<ITabs[]>(() => [
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
      name: 'schedule_payments',
      label: 'Hitos de pagos programados',
      icon: defaultIconsLucide.folder,
      outlined: true,
      disable: true,
      show: isEnabled(tabRules.schedule_payments),
      required: false,
    },
    {
      name: 'budget',
      label: 'Presupuesto asociado',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: isEnabled(tabRules.budget),
      required: true,
    },
    {
      name: 'validity',
      label: 'Vigencias futuras',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: isEnabled(tabRules.validity),
      required: true,
    },
    {
      name: 'documents',
      label: 'Documentos anexos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'polices',
      label: 'Pólizas',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'clauses',
      label: 'Cláusulas',
      icon: defaultIconsLucide.bulletList,
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

  const backTab = () => {
    for (let i = tabActiveIdx.value - 1; i >= 0; i--) {
      if (tabs.value[i].show) {
        tabActiveIdx.value = i
        tabActive.value = tabs.value[i].name
        return
      }
    }
  }

  const nextTab = async () => {
    const start = tabActiveIdx.value + 1
    const nextIdx = tabs.value.findIndex((t, i) => i >= start && t.show)
    if (nextIdx !== -1) {
      tabActiveIdx.value = nextIdx
      tabActive.value = tabs.value[nextIdx].name
    }
  }

  const setFormView = (data: IRegisterAdditionsResponse) => {
    if (data) {
      basic_data_form.value = {
        contract_id: data.contract_id,
        contract_type_id: `${data.contract_type.code} - ${data.contract_type.name}`,
        business_trust_id: `${data.business.code} - ${data.business.name}`,
        document_type_id: `${data.contract_type.code} - ${data.contract_type.name}`,
        modification_type: data.modification_type.id,
        subscription_date: data.subscription_date,
        additional_number: data.additional_number,
        duration: data.duration,
        periodicity: data.periodicity,
        application_start_date: data.application_start_date,
        contract_end_date: data.contract_end_date,
        additional_amount: data.additional_amount,
        additional_value: data.additional_value,
        justification: data.justification,
        contract_object: data.contract_object,
        status: data.status.name,
        internal_number: data.internal_contract_number,
        contractor: data.contractor,
      }

      budget_form.value = {
        budgetary_association: data.budgetary_associations?.map((e) => ({
          id: e.id,
          validity: e.validity,
          type_document_budget_id: `${e.document_budget?.[0]?.code} - ${e.document_budget?.[0]?.description}`,
          value: null,
          document_number_id: e.document_number_id,
          document_date: null,
          available_payment: null,
          operation_log_details: [],
          milestone_assigned: e.milestone_payments_assigned ?? [],
        })),
      }

      schedule_payments_form.value = {
        milestone_payments: data.payment_milestones?.map((e) => ({
          temporal_id: e.id ?? null,
          payment_type_id: e.payment_type?.name ?? null,
          date_milestone: e.milestone_date ?? null,
          foreign_amount: e.foreign_amount,
          budget_apply: e.budget_apply,
          select: false,
          value_assigned: null,
          value_milestone: e.milestone_value ?? null,
        })),
      }

      validity_form.value = {
        future_validities: data.future_validities?.map((e) => ({
          ...e,
          milestone_assigned: e.milestone_payments_assigned ?? [],
        })),
      }

      documents_form.value = {
        attached_documents: data.document_attachments?.map((e) => ({
          id: e.id,
          name: e.attachment?.original_name,
          date: e.attachment?.created_at,
          url: e.attachment?.full_path,
        })),
      }

      policies_form.value = {
        policies: data.policies?.map((e) => ({
          ...e,
          validity_start: e.start_validity_date ?? null,
          validity_end: e.end_validity_date ?? null,
          attachments: e.attachments.map((a) => ({
            ...a,
            name: a.original_name ?? '',
            date: a.uploload_at ?? null,
            status: 'Exitoso',
          })),
        })),
      }

      clauses_form.value = {
        clauses: data.clauses?.map((e) => ({
          ...e,
          clause_id: `${e.clause?.code} - ${e.clause?.name}`,
          select: false,
        })),
      }
    }
  }

  onMounted(async () => {
    _clearData()

    openMainLoader(true)
    await _getByIdRegisterAdditions(searchId)
    await _getResources(keys)
    await _getContractDataById(contractId)

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => register_additions_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
    }
  )

  return {
    basic_data_form,
    schedule_payments_form,
    budget_form,
    validity_form,
    documents_form,
    policies_form,
    clauses_form,

    basicDataFormRef,
    paymentFormRef,
    budgetFormRef,
    validityFormRef,
    documentFormRef,
    policesFormRef,
    clausesFormRef,

    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,

    nextTab,
    backTab,
    goToURL,
  }
}

export default useContractClausesRead
