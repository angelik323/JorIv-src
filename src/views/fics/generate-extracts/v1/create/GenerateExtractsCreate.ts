// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Interfaces
import { IFicsExtractGenerationRequest } from '@/interfaces/customs/fics/GenerateExtractst'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useGenerateExtractsStore } from '@/stores/fics/generate-extracts'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useGenerateExtractsCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useGenerateExtractsStore('v1')

  const informationFormRef = ref()
  const alertModalRef = ref()

  const keys = {
    fics: ['funds', 'extract_types'],
    treasury: ['third_parties'],
  }

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea ejecutar el proceso para generar el extracto?',
    id: null as number | null,
  })

  const headerProperties = {
    title: 'Crear generación de extractos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Generación de extractos',
        route: 'GenerateExtractsList',
      },
      {
        label: 'Crear',
        route: 'GenerateExtractsCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources(keys)

    setTimeout(() => openMainLoader(false), 1000)
  }

  const openAlertModal = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    alertModalRef.value?.openModal()
  }

  const handleSubmitForm = async () => {
    openMainLoader(true)

    const data = informationFormRef.value?.getValues()

    const payload: IFicsExtractGenerationRequest = {
      extract_type: data.extract_type,
      generation_type: data.generation_type,
      period_from: String(data.period_from),
      period_to: String(data.period_to),
      identification: data.identification,
      initial_fund: data.initial_fund,
      final_fund: data.final_fund,
      fiduciary_investment_plan_id: data.fiduciary_investment_plan_id,
      business_trust_id: data.business_trust_id,
    }

    const success = await _createAction(payload)

    if (success) handleGoToList()

    setTimeout(() => {
      alertModalRef.value?.closeModal()
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    goToURL('GenerateExtractsList', undefined, { reload: true })

  onMounted(async () => await loadResources())

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys({
      fics: ['fiduciary_investment_plans_by_holder'],
    })
  })

  return {
    tabs,
    tabActive,
    tabActiveIdx,
    alertModalRef,
    handleGoToList,
    openAlertModal,
    headerProperties,
    handleSubmitForm,
    alertModalConfig,
    informationFormRef,
  }
}

export default useGenerateExtractsCreate
