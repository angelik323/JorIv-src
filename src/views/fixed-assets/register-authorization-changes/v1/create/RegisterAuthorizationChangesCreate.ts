// Vue
import { computed, ref, onMounted } from 'vue'
import moment from 'moment'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICreateNoveltyPayload,
  IFixedAssetNoveltyFormData,
} from '@/interfaces/customs/fixed-assets/v1/Register-Authorization-Changes'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'

// components
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// Stores
import { useFixedAssetsNoveltiesStore } from '@/stores/fixed-assets/register-authorization-changes'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useRegisterAuthorizationChangesCreate = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { _createAction } = useFixedAssetsNoveltiesStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  const keys = {
    fixed_assets: [
      'novelty',
      'statuses_fixed_assets',
      'fixed_assets_configuration_subtypes',
    ],
  }

  const informationFormState = ref<IFixedAssetNoveltyFormData>({
    creation_date: moment().format('YYYY-MM-DD HH:mm'),
    fixed_asset_id: null,
    novelty_type_id: null,
    novelty_type_description: '',
    generates_accounting: null,
    asset_affectation: undefined,
    estimated_solution_date: null,
    cost: null,
    description: '',
    additional_observation: '',
  })

  const informationFormRef = ref<{
    validateForm: () => Promise<boolean>
    getValues: () => IFixedAssetNoveltyFormData
  } | null>(null)

  const uploadFormRef = ref<{
    hasDocuments: boolean
    getDocumentsPayload: () => {
      document_ids: number[]
      group_token: string
    }
  } | null>(null)

  const headerProperties = {
    title: 'Crear novedad de activo fijo/bien',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Activos fijos' },
      {
        label: 'Registro y novedades de activos fijos/bienes',
        route: 'RegisterAuthorizationChangesList',
      },
      { label: 'Crear', route: 'RegisterAuthorizationChangesCreate' },
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
  const tabActive = ref(filteredTabs.value[0].name)

  const validateCurrentTab = async () => {
    if (tabActive.value === 'information') {
      return (await informationFormRef.value?.validateForm?.()) ?? false
    }

    if (tabActive.value === 'documents') {
      return uploadFormRef.value?.hasDocuments ?? false
    }

    return true
  }

  const nextTab = async () => {
    const isValid = await validateCurrentTab()
    if (!isValid) return

    tabActiveIdx.value++
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value--
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const handleSubmitForm = async () => {
    const isInformationValid = await informationFormRef.value?.validateForm()

    if (!isInformationValid) {
      tabActive.value = 'information'
      tabActiveIdx.value = 0
      return
    }

    const uploadForm = uploadFormRef.value
    if (!uploadForm || !uploadForm.hasDocuments) {
      tabActive.value = 'documents'
      tabActiveIdx.value = 1
      return
    }

    const informationData = informationFormRef.value?.getValues()
    if (!informationData) return

    const documentsData = uploadForm.getDocumentsPayload()
    if (!documentsData) return

    const payload: ICreateNoveltyPayload = {
      asset_id: informationData.fixed_asset_id!,
      novelty_type_id: informationData.novelty_type_id!,
      generates_accounting: informationData.generates_accounting!,
      estimated_solution_date: informationData.estimated_solution_date!,
      cost: informationData.cost!,
      currency: 'COP',
      description: informationData.description,
      additional_observation: informationData.additional_observation,
      document_ids: documentsData.document_ids,
      group_token: documentsData.group_token,
    }

    openMainLoader(true)
    const success = await _createAction(payload)
    openMainLoader(false)

    if (!success) return

    goToURL('RegisterAuthorizationChangesList')
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources({
      fixed_assets: keys.fixed_assets,
    })

    openMainLoader(false)
  })

  return {
    headerProperties,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    informationFormState,
    informationFormRef,
    uploadFormRef,
    goToURL,
    nextTab,
    backTab,
    handleSubmitForm,
  }
}

export default useRegisterAuthorizationChangesCreate
