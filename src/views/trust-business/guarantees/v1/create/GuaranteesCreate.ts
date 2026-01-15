// vue - router - pinia
import { ref, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useS3Documents, useUtils } from '@/composables'

// Stores
import { useGuaranteesStore } from '@/stores/trust-business/guarantees'
import { usePolicyStore } from '@/stores/trust-business/policy'
import { useResourceManagerStore } from '@/stores/resources-manager'

// Interfaces
import { IGuaranteesForm } from '@/interfaces/customs/trust-business/Guarantees'
import { IFile, ITabs } from '@/interfaces/global'

const useGuaranteesCreate = () => {
  const { _createGuarantees, _clearData } = useGuaranteesStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _addFile } = usePolicyStore('v1')

  const { _saveDocumentsS3 } = useS3Documents()

  const { data_documents_form } = storeToRefs(useGuaranteesStore('v1'))

  // Data de formularios
  const data_information_form = ref<IGuaranteesForm | null>(null)

  const keys = {
    trust_business: [
      'guarantees_types',
      'guarantees_linkage_types',
      'guarantees_record_status',
      'guarantees_status',
      'third_parties',
    ],
    investment_portfolio: ['coins'],
  }
  const key_filter = {
    trust_business: [
      'business_trusts&filter[status_id]=57&filter[guaranteed]=1',
    ],
  }

  // Referencias a formularios
  const basicDataFormRef = ref()

  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const headerProps = {
    title: 'Crear garantía',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Garantías',
        route: 'GuaranteesList',
      },
      {
        label: 'Crear',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
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

  const makeBaseInfoRequest = (
    data: IGuaranteesForm | null,
    ids?: string[]
  ) => {
    if (!data) return {}

    const request: Partial<IGuaranteesForm> = {
      business_trust_id: data.business_trust_id ?? null,
      currency_id: data.currency_id ?? null,
      description: data.description ?? null,
      expiration_date: data.expiration_date ?? null,
      guarantee_number: data.guarantee_number ?? null,
      guarantee_type: data.guarantee_type ?? null,
      guaranteed_value: data.guaranteed_value ?? null,
      linkage_type: data.linkage_type ?? null,
      observations: data.observations ?? null,
      registration_date: data.registration_date ?? null,
      specification: data.specification ?? null,
      secured_creditor_id: data.secured_creditor_id ?? null,
      attachments: ids?.map((item) => ({
        id: item,
        is_validated: true,
      })),
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = (ids: string[]) => {
    const apiRequestBody: Partial<IGuaranteesForm> = {
      ...makeBaseInfoRequest(data_information_form.value, ids),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

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

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
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
        if (ids.length === 0) {
          openMainLoader(false)
          return
        }
        const payload = makeDataRequest(ids)
        if (!(await _createGuarantees(payload))) return openMainLoader(false)

        router.push({
          name: 'GuaranteesList',
          query: {
            reload: 1,
          },
        })
      }
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    _clearData()
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(key_filter)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({
      trust_business: [...keys.trust_business, 'business_trusts'],
      investment_portfolio: [...keys.investment_portfolio],
    })
  })

  return {
    data_information_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    nextTab,
    backTab,
    onSubmit,
  }
}

export default useGuaranteesCreate
