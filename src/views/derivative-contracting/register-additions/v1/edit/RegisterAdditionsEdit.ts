// Vue, pinia
import {
  ref,
  onBeforeUnmount,
  onMounted,
  watch,
  computed,
  onBeforeMount,
} from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useS3Documents,
  useUtils,
} from '@/composables'

// Interfaces
import {
  Attachment,
  IBasicDataFormAdditions,
  IBudgetFormAdditions,
  IClausesFormAdditions,
  IDataTableDocuments,
  IDocumentsFormAdditions,
  IPoliciesFormAdditions,
  IRegisterAdditionsForm,
  IRegisterAdditionsResponse,
  ISchedulePaymentsFormAdditions,
  IValidityFormAdditions,
  IFile,
  Policies,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ITabs } from '@/interfaces/global'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useRegisterAdditionsStore } from '@/stores/derivative-contracting'

const useContractClausesEdit = () => {
  const {
    _getByIdRegisterAdditions,
    _updateRegisterAdditions,
    _clearData,
    _generatePresignedUrl,
    _getContractDataById,
  } = useRegisterAdditionsStore('v1')
  const { register_additions_response } = storeToRefs(
    useRegisterAdditionsStore('v1')
  )
  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

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
  const { defaultIconsLucide, formatDate } = useUtils()

  const { goToURL } = useGoToUrl()

  const keys = {
    derivative_contracting: [
      'contract_addition_business_trust',
      'contract_type_id_name',
      'contract_modification_type',
      'contract_periodicity',
      'contract_type_for_addition',
      'basic_info_contract',
      'payment_type',

      'policy_status',
      'policies',

      'risk_list',

      'clause_types',
      'contract_clauses_codes',
    ],

    budget: [
      'budget_document_types',
      'operation_logs_authorized',
      'budget_resources_types',
      'areas_resposabilities_codes',
      'budget_item_codes',
    ],
  }

  const keysThirdParty = {
    third_party: ['third_parties'],
  }

  const headerProps = {
    title: 'Editar adición de contrato',
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
        label: 'Editar',
        route: 'RegisterAdditionsEdit',
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

  const handleDocumentsUpload = async (files: IDataTableDocuments[]) => {
    const documents: IDataTableDocuments[] = []
    const uploadUrls: string[] = []
    const filesToUpload: File[] = []

    for (const fileField of files) {
      if (fileField.contract_attachment_id) {
        documents.push({
          contract_attachment_id: fileField.contract_attachment_id,
          file_id: fileField.attachment_id,
        })
        continue
      }

      const file = fileField.file as IFile
      if (!file) continue

      const { success, documentId, uploadUrl } = await _generatePresignedUrl({
        name: file.name,
        file_type: file?.file_type
          ? file?.file_type
          : getExtensionFromMimeType(file?.type),
        file_size: file.size ? file.size / (1024 * 1024) : 100,
      })

      if (!success || !documentId || !uploadUrl) continue

      const document = {
        contract_attachment_id: fileField.id,
        file_id: documentId,
      }

      documents.push(document)
      uploadUrls.push(uploadUrl)
      filesToUpload.push(file)
    }

    if (!uploadUrls.length || !filesToUpload.length) return

    await _saveDocumentsS3(uploadUrls, filesToUpload)

    return documents
  }

  const processPolicies = async (policies: Policies[]) => {
    const processed = await Promise.all(
      policies.map(async (policy) => {
        const formatAttachment = policy.attachments.map((e) => ({
          id: null,
          file: e,
        })) as IDataTableDocuments[]

        const newAttachments = (await handleDocumentsUpload(
          formatAttachment
        )) as Attachment[]

        return {
          ...policy,
          attachments: newAttachments ?? [],
        }
      })
    )

    return processed
  }

  const makeDataRequest = async () => {
    let documents
    let policies

    if (documents_form.value?.attached_documents)
      documents = await handleDocumentsUpload(
        documents_form.value.attached_documents
      )

    if (policies_form.value?.policies)
      policies = await processPolicies(policies_form.value?.policies)

    const payload: IRegisterAdditionsForm = {
      ...basic_data_form.value,
      ...schedule_payments_form.value,
      ...clauses_form.value,
      ...validity_form.value,

      budgetary_association: budget_form.value?.budgetary_association?.map(
        (e) => ({
          ...e,
          milestone_assigned: (() => {
            const fromAssoc = e.milestone_assigned ?? []
            const fromOpLogs =
              e.operation_log_details?.flatMap(
                (i) => i.milestone_assigned ?? []
              ) ?? []

            const map = new Map<string, (typeof fromAssoc)[number]>()
            fromAssoc.forEach((m) => {
              if (m.associated_budget_records_id != null) {
                map.set(String(m.temporal_id), m)
              }
            })
            fromOpLogs.forEach((m) => map.set(String(m.temporal_id), m))
            return Array.from(map.values())
          })(),
        })
      ),

      contract_id: searchId,
      attached_documents: documents ?? [],
      policies,
    }
    return payload
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [
      basicDataFormRef,
      paymentFormRef,
      budgetFormRef,
      validityFormRef,
      documentFormRef,
      policesFormRef,
      clausesFormRef,
    ]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = await makeDataRequest()
    const success = await _updateRegisterAdditions(payload, searchId)
    if (success) {
      goToURL('RegisterAdditionsList')
    }
    openMainLoader(false)
  }

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
    // if (await validateForms()) {
    const start = tabActiveIdx.value + 1
    const nextIdx = tabs.value.findIndex((t, i) => i >= start && t.show)
    if (nextIdx !== -1) {
      tabActiveIdx.value = nextIdx
      tabActive.value = tabs.value[nextIdx].name
    }
    // }
  }

  const setFormEdit = (data: IRegisterAdditionsResponse) => {
    if (data) {
      basic_data_form.value = {
        contract_id: data.contract_id,
        contract_type_id: data.contract_type_id,
        business_trust_id: data.business_trust_id,
        document_type_id: data.document_type_id,
        modification_type: data.modification_type.id,
        subscription_date: formatDate(
          data.subscription_date ?? '',
          'YYYY-MM-DD'
        ),
        additional_number: data.additional_number,
        duration: data.duration,
        periodicity: data.periodicity,
        application_start_date: formatDate(
          data.application_start_date ?? '',
          'YYYY-MM-DD'
        ),
        contract_end_date: formatDate(
          data.contract_end_date ?? '',
          'YYYY-MM-DD'
        ),
        additional_amount: data.additional_amount,
        additional_value: data.additional_value,
        justification: data.justification,
        contract_object: data.contract_object,
        status: data.status.name,
        internal_number: data.internal_contract_number,
        contractor: data.contractor,
      }

      schedule_payments_form.value = {
        milestone_payments: data.payment_milestones?.map((e) => ({
          temporal_id: e.id ?? null,
          payment_type_id: e.payment_type_id,
          date_milestone: e.milestone_date ?? null,
          foreign_amount: e.foreign_amount,
          budget_apply: e.budget_apply,
          select: false,
          value_assigned: null,
          value_milestone: e.milestone_value ?? null,
        })),
      }

      budget_form.value = {
        budgetary_association: data.budgetary_associations?.map((e) => ({
          id: e.id,
          validity: e.validity,
          type_document_budget_id: e.type_document_budget_id,
          value: null,
          document_number_id: e.document_number_id,
          document_date: null,
          available_payment: null,
          operation_log_details: e.operation_log_details ?? [],
          milestone_assigned:
            e.milestone_payments_assigned?.map((m) => ({
              temporal_id: m.milestone_payment?.id ?? null,
              value_assigned: m.value_assigned ?? null,
              value_milestone: m.milestone_payment?.milestone_value ?? null,
              payment_type_id: m.milestone_payment?.payment_type_id ?? null,
              date_milestone: m.milestone_payment?.milestone_date ?? null,
              associated_budget_records_id: m.associated_budget_records_id,
            })) ?? [],
        })),
      }

      validity_form.value = {
        future_validities: data.future_validities?.map((e) => ({
          ...e,
          milestone_assigned:
            e.milestone_payments_assigned?.map((m) => ({
              temporal_id: m.milestone_payment?.id ?? null,
              value_assigned: m.value_assigned ?? null,
              value_milestone: m.milestone_payment?.milestone_value ?? null,
              payment_type_id: m.milestone_payment?.payment_type_id ?? null,
              date_milestone: m.milestone_payment?.milestone_date ?? null,
              associated_budget_records_id: m.associated_budget_records_id,
            })) ?? [],
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
          coverage:
            e.coverages?.map((e) => ({
              ...e,
              coverage_min_value: e.risk?.minimum_percentage ?? null,
              coverage_max_value: e.coverage_max_value,
              coverage_percent: e.risk?.maximum_percentage ?? null,
            })) ?? [],
        })),
      }

      clauses_form.value = {
        clauses: data.clauses?.map((e) => ({
          ...e,
          select: false,
        })),
      }

      documents_form.value = {
        attached_documents: data.document_attachments?.map((e) => ({
          contract_attachment_id: e.contract_attachment_id,
          attachment_id: e.attachment_id,
        })),
      }
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getByIdRegisterAdditions(searchId)
    await _getResources(keys)
    await _getResources(
      keysThirdParty,
      `fields[]=id,document&include=legalPerson&filter[third_party_category]=juridica`
    )
    await _getContractDataById(contractId)

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  onBeforeMount(async () => {
    _clearData()
  })

  watch(
    () => register_additions_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
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
    onSubmit,
  }
}

export default useContractClausesEdit
