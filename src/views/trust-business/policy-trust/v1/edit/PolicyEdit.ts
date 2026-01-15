// vue - quasar - router - pinia
import { useRoute, useRouter } from 'vue-router'
import {
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  computed,
} from 'vue'
import { storeToRefs } from 'pinia'

// store
import { useResourceManagerStore } from '@/stores/resources-manager'
import { usePolicyStore } from '@/stores/trust-business/policy'

// composables
import { useMainLoader, useS3Documents, useAlertV2 } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { IFile, ITabs } from '@/interfaces/global'
import { IPolicyCreate } from '@/interfaces/customs/trust-business/Policy'

const usePolicyEdit = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const policyId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlertV2()
  const { data_information_form, policy_request, data_documents_form } =
    storeToRefs(usePolicyStore('v1'))

  const { _saveDocumentsS3 } = useS3Documents()

  const {
    _setDataInformationForm,
    _updatePolicy,
    _getByIdPolicy,
    _addFile,
    _deleteFilesAction,
    _setIdToDelete,
  } = usePolicyStore('v1')

  const keys = {
    trust_business: [
      'business_trusts',
      'policies_record_status',
      'policies_status',
      'policy_types',
      'third_parties',
      'policy_payment_methods',
    ],
    investment_portfolio: ['coins'],
  }
  const key_filter = {
    trust_business: ['policy_insurers&filter[status_id]=57'],
  }
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Editar póliza',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Pólizas',
        route: 'PolicyList',
      },
      {
        label: 'Editar',
      },
      {
        label: `${policyId}`,
      },
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const makeDataRequest = (ids: string[]): IPolicyCreate => {
    const existingDocs = data_information_form.value?.documents
      ?.filter((item) => item.is_new === false)
      .map((item) => ({
        id: item.id?.toString() ?? '',
        is_validated: true,
      })) ?? []
    
    const newDocs = ids.map((item) => ({
      id: item.toString(),
      is_validated: true,
    }))
    
    const allAttachments = [...existingDocs, ...newDocs]
    
    return {
      business_trust_id: data_information_form.value?.business_trust_id ?? null,
      policy_type: data_information_form.value?.policy_type ?? null,
      policy_number: data_information_form.value?.policy_number ?? null,
      insurer_id: data_information_form.value?.insurer_id ?? null,
      policy_holder_id: data_information_form.value?.policy_holder_id ?? null,
      beneficiary_id: data_information_form.value?.beneficiary_id ?? null,
      currency_id: data_information_form.value?.currency_id ?? null,
      insured_value: data_information_form.value?.insured_value ?? null,
      issue_date: data_information_form.value?.issue_date ?? null,
      effective_start_date:
        data_information_form.value?.effective_start_date ?? null,
      effective_end_date:
        data_information_form.value?.effective_end_date ?? null,
      premium: data_information_form.value?.premium ?? null,
      payment_method: data_information_form.value?.payment_method ?? null,
      associated_contract:
        data_information_form.value?.associated_contract ?? null,
      record_status_id: data_information_form.value?.record_status_id ?? null,
      policy_status_id: data_information_form.value?.policy_status_id ?? null,
      observations: data_information_form.value?.observations ?? null,
      attachments: allAttachments.length > 0 ? allAttachments : undefined,
    }
  }
  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()

  const isUpdateButtonDisabled = computed(() => {
    const isRejected = policy_request.value?.record_status?.id === 10 // TrustBusinessStatusID.REJECTED
    const hasNewDocs = data_documents_form.value && data_documents_form.value.length > 0
    return isRejected && !hasNewDocs
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    data_information_form.value = null
    await _getByIdPolicy(policyId)
    openMainLoader(false)
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(key_filter)
    openMainLoader(false)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
    _setIdToDelete([])
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [formInformation]

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

  const handleDocumentsUpload = async (files: IFile[]): Promise<string[]> => {
    const documentIds: string[] = []
    const uploadUrls: string[] = []
    const filesToUpload: IFile[] = []

    for (const fileField of files) {
      const file = fileField
      if (!file) continue

      const { success, documentId, uploadUrl } = await _addFile(
        file.name,
        file.type,
        data_information_form.value?.business_trust_id ?? 0
      )

      if (!success || !documentId || !uploadUrl) continue

      documentIds.push(documentId.toString())
      uploadUrls.push(uploadUrl)
      filesToUpload.push(file)
    }

    if (!uploadUrls.length || !filesToUpload.length) return []

    await _saveDocumentsS3(uploadUrls, filesToUpload, false)

    return documentIds
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      const isRejected = policy_request.value?.record_status?.id === 10
      const hasNewDocs = data_documents_form.value && data_documents_form.value.length > 0
      
      if (isRejected && !hasNewDocs) {
        showAlert({type: 'warning', message: 'Debe reemplazar el documento antes de actualizar una póliza rechazada',})
        return
      }

      openMainLoader(true)
      
      let newDocumentIds: string[] = []
      if (data_documents_form.value && data_documents_form.value.length > 0) {
        newDocumentIds = await handleDocumentsUpload(data_documents_form.value)
      }
      
      const payload: IPolicyCreate = makeDataRequest(newDocumentIds)
      if (!(await _updatePolicy(policyId, payload)))
        return openMainLoader(false)

      await _deleteFilesAction()

      router.push({
        name: 'PolicyList',
        query: {
          reload: 1,
        },
      })
      
      openMainLoader(false)
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    policy_request,
    isUpdateButtonDisabled,
    onSubmit,
    handlerGoTo,
  }
}

export default usePolicyEdit
