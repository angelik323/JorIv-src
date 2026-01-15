// Vue, pinia
import { ref, onBeforeMount, onBeforeUnmount, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  Attachment,
  IBasicDataFormAdditions,
  IBudgetFormAdditions,
  IClausesFormAdditions,
  IDataTableDocuments,
  IDocumentsFormAdditions,
  IFile,
  IPoliciesFormAdditions,
  IRegisterAdditionsForm,
  ISchedulePaymentsFormAdditions,
  IValidityFormAdditions,
  Policies,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ITabs } from '@/interfaces/global'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useS3Documents,
  useUtils,
} from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useRegisterAdditionsStore } from '@/stores/derivative-contracting'

const useContractClausesCreate = () => {
  const {
    _getContractDataById,
    _createRegisterAdditions,
    _clearData,
    _generatePresignedUrl,
  } = useRegisterAdditionsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const route = useRoute()
  const searchId = +route.params.id

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
    title: 'Crear adición de contrato',
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
        label: 'Crear',
        route: 'RegisterAdditionsCreate',
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
      const file = fileField.file as IFile
      if (!file) continue

      const { success, documentId, uploadUrl } = await _generatePresignedUrl({
        name: file.name,
        file_type: getExtensionFromMimeType(file?.type),
        file_size: file.size / (1024 * 1024),
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

  // TODO: Se comenta esta función porque no se está usando, pero puede ser útil en el futuro
  // const mapFutureValidities = (
  //   futureValidities: FutureValidities[],
  //   budgetaryAssociation: BudgetAssociation[]
  // ) => {
  //   return futureValidities.map((fv) => {
  //     const temporalId = fv.id

  //     // Sumar todos los value_assigned que coincidan
  //     let total = 0

  //     budgetaryAssociation.forEach((assoc) => {
  //       assoc.operation_log_details?.forEach((detail) => {
  //         detail.milestone_assigned?.forEach((ms) => {
  //           if (String(ms.temporal_id) === String(temporalId)) {
  //             total += Number(ms.value_assigned ?? 0)
  //           }
  //         })
  //       })
  //     })

  //     return {
  //       ...fv,
  //       milestone_assigned: [
  //         {
  //           temporal_id: temporalId,
  //           value_assigned: total,
  //         },
  //       ],
  //     }
  //   })
  // }

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
          milestone_assigned: e.operation_log_details.flatMap(
            (i) => i.milestone_assigned
          ),
        })
      ),

      contract_id: searchId,
      attached_documents: documents,
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
    const success = await _createRegisterAdditions(payload)
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
    if (await validateForms()) {
      const start = tabActiveIdx.value + 1
      const nextIdx = tabs.value.findIndex((t, i) => i >= start && t.show)
      if (nextIdx !== -1) {
        tabActiveIdx.value = nextIdx
        tabActive.value = tabs.value[nextIdx].name
      }
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(
      keysThirdParty,
      `fields[]=id,document&include=legalPerson&filter[third_party_category]=juridica`
    )
    await _getContractDataById(searchId)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  onBeforeMount(async () => {
    _clearData()
  })

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

export default useContractClausesCreate
