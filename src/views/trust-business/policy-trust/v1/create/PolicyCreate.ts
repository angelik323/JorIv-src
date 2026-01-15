// vue - quasar - router - pinia
import { useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// store
import { useResourceManagerStore } from '@/stores/resources-manager'
import { usePolicyStore } from '@/stores/trust-business/policy'

// composables
import { useAlert, useMainLoader, useS3Documents } from '@/composables'

// utils
import { defaultIconsLucide, isEmptyOrZero } from '@/utils'

// interfaces
import { IFile, ITabs } from '@/interfaces/global'
import { IPolicyCreate } from '@/interfaces/customs/trust-business/Policy'

const usePolicyCreate = () => {
  // imports
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { data_information_form, data_documents_form } = storeToRefs(
    usePolicyStore('v1')
  )

  const { showAlert } = useAlert()

  const { _setDataInformationForm, _createPolicy, _addFile } =
    usePolicyStore('v1')

  const { _saveDocumentsS3 } = useS3Documents()

  const keys = {
    trust_business: [
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
  const key_filters = {
    trust_business: ['business_trusts&filter[has_policy]=true&filter[status_id]=57'],
  }
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Crear póliza',
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
        route: 'PolicyCreate',
      },
      {
        label: 'Crear',
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
      observations: data_information_form.value?.observations ?? null,
      attachments: ids.map((item) => ({
        id: item,
        is_validated: true,
      })),
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

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(key_filters)
    await _getResources(key_filter)
    openMainLoader(false)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
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

        if (isEmptyOrZero(data_documents_form.value)) {
          valid = false
          showAlert('Debe cargar por lo menos un documento', 'error')
        }
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
      openMainLoader(true)
      if (data_documents_form.value) {
        const ids = await handleDocumentsUpload(data_documents_form.value)
        const payload: IPolicyCreate = makeDataRequest(ids)
        if (!(await _createPolicy(payload))) return openMainLoader(false)

        router.push({
          name: 'PolicyList',
          query: {
            reload: 1,
          },
        })
      }
    }
    openMainLoader(false)
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    onSubmit,
    handlerGoTo,
  }
}

export default usePolicyCreate
