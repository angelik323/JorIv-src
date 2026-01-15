// Vue
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IFixedAssetNoveltyFormData,
  INoveltyDetail,
  ICreateNoveltyPayload,
  INoveltyAuditInfo,
  IFixedAssetNoveltyDocument,
  IInformationFormRef,
  IUploadFormRef,
} from '@/interfaces/customs/fixed-assets/v1/Register-Authorization-Changes'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'

// components
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// Store
import { useFixedAssetsNoveltiesStore } from '@/stores/fixed-assets/register-authorization-changes'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useRegisterAuthorizationChangesEdit = () => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, formatDate } = useUtils()

  const noveltyId = Number(route.params.id)

  const { _getAction, _updateAction } = useFixedAssetsNoveltiesStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  const isLoaded = ref(false)
  const noveltyStatus = ref<'REGISTERED' | 'AUTHORIZED' | 'CANCELED'>(
    'REGISTERED'
  )
  const noveltyData = ref<IFixedAssetNoveltyFormData | null>(null)
  const auditInfo = ref<INoveltyAuditInfo | null>(null)

  const documentsData = ref<IFixedAssetNoveltyDocument[]>([])

  const informationFormRef = ref<IInformationFormRef | null>(null)
  const uploadFormRef = ref<IUploadFormRef | null>(null)

  const keys = {
    fixed_assets: [
      'novelty',
      'statuses_fixed_assets',
      'fixed_assets_configuration_subtypes',
    ],
  }

  const headerProperties = {
    title: 'Editar novedad de activo fijo/bien',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Activos fijos' },
      {
        label: 'Registro y novedades de activos fijos/bienes',
        route: 'RegisterAuthorizationChangesList',
      },
      { label: 'Editar', route: 'RegisterAuthorizationChangesEdit' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Registro de novedad',
      icon: defaultIconsLucide.fileText,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'documents',
      label: 'Documentos',
      icon: defaultIconsLucide.clipboard,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((t) => t.show))
  const tabActiveIdx = ref(0)
  const tabActive = ref<'information' | 'documents'>('information')

  const mapDetailToForm = (
    response: INoveltyDetail
  ): IFixedAssetNoveltyFormData => ({
    creation_date: formatDate(response.created_at, 'YYYY-MM-DD'),
    fixed_asset_id: response.asset_id,
    novelty_type_id: response.novelty_type.id,
    novelty_type_code: response.novelty_type.code,
    novelty_type_description: `${response.novelty_type.code} - ${response.novelty_type.description}`,
    generates_accounting: response.generates_accounting,
    asset_affectation: undefined,
    estimated_solution_date: formatDate(response.solution_date, 'YYYY-MM-DD'),
    cost: Number(response.cost),
    description: response.description,
    additional_observation: '',
  })

  const mapFormToPayload = (
    form: IFixedAssetNoveltyFormData,
    documents?: unknown
  ): ICreateNoveltyPayload => ({
    asset_id: form.fixed_asset_id!,
    novelty_type_id: form.novelty_type_id!,
    generates_accounting: form.generates_accounting!,
    estimated_solution_date: form.estimated_solution_date!,
    cost: form.cost!,
    currency: 'COP',
    description: form.description,
    additional_observation: form.additional_observation,
    ...(documents ? { documents } : {}),
  })

  const loadNovelty = async (): Promise<void> => {
    openMainLoader(true)

    const response = await _getAction(noveltyId)

    openMainLoader(false)
    if (!response) return

    noveltyData.value = mapDetailToForm(response)
    noveltyStatus.value = (response.status?.status ?? 'REGISTERED') as
      | 'REGISTERED'
      | 'AUTHORIZED'
      | 'CANCELED'

    auditInfo.value = {
      novelty_code: response.novelty_code ?? '',
      status: response.status?.status ?? '',
      created_at: response.created_at,
      created_by: response.created_by ?? '',
      updated_at: response.updated_at,
      updated_by: response.updated_by ?? '',
    }

    documentsData.value =
      response.documents?.map((doc) => ({
        id: doc.id,
        document_id: doc.id,
        file_name: doc.original_name ?? doc.file_name,
        document_type: doc.document_type,
        size_mb: 0,
        file: null,
      })) ?? []

    isLoaded.value = true
  }

  const validateForms = async (): Promise<boolean> => true

  const nextTab = async () => {
    if (!(await validateForms())) return
    if (tabActiveIdx.value >= filteredTabs.value.length - 1) return

    tabActiveIdx.value++
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name as
      | 'information'
      | 'documents'
  }

  const backTab = () => {
    if (tabActiveIdx.value <= 0) return

    tabActiveIdx.value--
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name as
      | 'information'
      | 'documents'
  }

  const handleSubmitForm = async () => {
    if (!(await validateForms())) return

    const informationData = informationFormRef.value?.getValues()
    if (!informationData) return

    const documentsPayload =
      uploadFormRef.value?.getDocumentsPayload?.() ??
      (documentsData.value.length
        ? {
            document_ids: documentsData.value.map((d) => d.document_id ?? d.id),
            group_token: crypto.randomUUID(),
          }
        : null)

    openMainLoader(true)

    const payload = mapFormToPayload(informationData, documentsPayload)
    const success = await _updateAction(noveltyId, payload)

    openMainLoader(false)
    if (!success) return

    goToURL('RegisterAuthorizationChangesList')
  }
  const init = async (): Promise<void> => {
    openMainLoader(true)
    await _getResources({
      fixed_assets: keys.fixed_assets,
    })
    await loadNovelty()

    openMainLoader(false)
  }

  onMounted(init)

  return {
    isLoaded,
    noveltyStatus,
    noveltyData,
    auditInfo,
    documentsData,
    headerProperties,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    uploadFormRef,
    defaultIconsLucide,
    goToURL,
    nextTab,
    backTab,
    handleSubmitForm,
  }
}

export default useRegisterAuthorizationChangesEdit
