// vue - router - pinia
import { ref, watch, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useUtils, useS3Documents } from '@/composables'

// Stores
import { useGuaranteesStore } from '@/stores/trust-business/guarantees'
import { useResourceManagerStore } from '@/stores/resources-manager'

// Interfaces
import {
  IGuaranteesForm,
  IGuaranteesResponse,
} from '@/interfaces/customs/trust-business/Guarantees'
import { ITabs, IFile } from '@/interfaces/global'

const useGuaranteesEdit = () => {
  const {
    _updateGuarantees,
    _getByIdGuarantees,
    _clearData,
    _addFile,
    _deleteFilesAction,
  } = useGuaranteesStore('v1')
  const { guarantees_response, data_documents_form } = storeToRefs(
    useGuaranteesStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _saveDocumentsS3 } = useS3Documents()

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
    trust_business: ['business_trusts&filter[status_id]=57'],
  }
  // Referencias a formularios
  const basicDataFormRef = ref()

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const headerProps = {
    title: 'Editar garantía',
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
        label: 'Editar',
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
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const setFormEdit = (data: IGuaranteesResponse) => {
    data_information_form.value = {
      id: data.id,
      business_trust_id: data.business_trust?.id ?? null,
      currency_id: data.currency?.id ?? null,
      description: data.description ?? null,
      expiration_date: data.expiration_date ?? null,
      guarantee_number: data.guarantee_number ?? null,
      guarantee_type: data.guarantee_type ?? null,
      guaranteed_value: data.guaranteed_value ?? null,
      linkage_type: data.linkage_type ?? null,
      observations: data.observations ?? null,
      registration_date: data.registration_date ?? null,
      specification: data.specification ?? null,
      secured_creditor_id: data.secured_creditor?.id ?? null,
      guarantee_status_id: data?.guarantee_status?.id ?? null,
      registration_status: data.registration_status?.id ?? null,
      documents: data.attachments?.map((item) => ({
        id: item.id,
        is_new: true,
        url: item.s3_file_path,
        name: item.original_name,
        created_at: item.created_at,
      })),
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (data: IGuaranteesForm | null) => {
    if (!data) return {}

    const request: Partial<IGuaranteesForm> = {
      business_trust_id: data.business_trust_id ?? null,
      currency_id: data.currency_id ?? null,
      description: data.description ?? null,
      expiration_date: data.expiration_date ?? null,
      guarantee_number: data.guarantee_number ?? null,
      guarantee_type: data.guarantee_type ?? null,
      guarantee_status_id: data.guarantee_status_id ?? null,
      guaranteed_value: data.guaranteed_value ?? null,
      linkage_type: data.linkage_type ?? null,
      observations: data.observations ?? null,
      registration_date: data.registration_date ?? null,
      specification: data.specification ?? null,
      secured_creditor_id: data.secured_creditor_id ?? null,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = (ids: string[]) => {
    const apiRequestBody: Partial<IGuaranteesForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
      attachments: data_documents_form.value?.length
        ? ids.map((item) => ({
            id: item,
            is_validated: true,
          }))
        : guarantees_response.value?.attachments?.map((item) => ({
            id: item.id?.toString() ?? '',
            is_validated: true,
          })),
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

      const hasNewDocuments = (data_documents_form.value?.length ?? 0) > 0

      if (hasNewDocuments) {
        await _deleteFilesAction()
        const ids = await handleDocumentsUpload(
          data_documents_form.value ?? []
        )
        if (ids.length === 0) {
          openMainLoader(false)
          return
        }
        const payload = makeDataRequest(ids)
        const success = await _updateGuarantees(payload, searchId)
        if (success) {
          router.push({
            name: 'GuaranteesList',
            query: {
              reload: 1,
            },
          })
        }
        openMainLoader(false)
        return
      }

      const payload = makeDataRequest([])
      const success = await _updateGuarantees(payload, searchId)
      if (success) {
        router.push({
          name: 'GuaranteesList',
          query: {
            reload: 1,
          },
        })
      }

      openMainLoader(false)
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(key_filter)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdGuarantees(searchId)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({
      trust_business: [...keys.trust_business, 'business_trusts'],
      investment_portfolio: [...keys.investment_portfolio],
    })
  })

  watch(
    () => guarantees_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

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

export default useGuaranteesEdit
