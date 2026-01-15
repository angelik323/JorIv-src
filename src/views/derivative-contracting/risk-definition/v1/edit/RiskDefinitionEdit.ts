// Vue - Pinia - Router - Quasar
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IRiskDefinitionForm } from '@/interfaces/customs/derivative-contracting/RiskDefinition'

// Stores
import { useRiskDefinitionsStoreV1 } from '@/stores/derivative-contracting/risk-definition/risk-definition-v1'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { storeToRefs } from 'pinia'
import { useResourceManagerStore } from '@/stores'

const useRiskDefinitionsEdit = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { risk_nature } = storeToRefs(useDerivativeContractingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  
  const keys = {
    derivative_contracting: [
      'risk_nature',
    ],
  }

  const store = useRiskDefinitionsStoreV1()
  const { _getByIdRiskDefinition, _updateRiskDefinition } = store

  const riskDefinitionId = +route.params.id

  const informationFormRef = ref()
  const basicDataForm = ref<IRiskDefinitionForm | null>(null)

  const headerProps = {
    title: 'Editar tipo de riesgo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      { label: 'Riesgos', route: 'RiskDefinitionList' },
      { label: 'Editar', route: 'RiskDefinitionEdit' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(0)

  const setDataToForm = (data: IRiskDefinitionForm) => {
    if (!data) return
    basicDataForm.value = {
      code: data.code ?? '',
      name: data.name ?? '',
      nature: data.nature ?? '',
      minimum_percentage:
        typeof data.minimum_percentage === 'number'
          ? data.minimum_percentage
          : String(data.minimum_percentage ?? ''),
      maximum_percentage:
        typeof data.maximum_percentage === 'number'
          ? data.maximum_percentage
          : String(data.maximum_percentage ?? ''),
      status_id: data.status_id ?? 1,
    }
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = (): IRiskDefinitionForm => {
    if (!basicDataForm.value) return {} as IRiskDefinitionForm
    const d = basicDataForm.value
    return {
      code: d.code ?? '',
      name: d.name ?? '',
      nature: d.nature ?? '',
      minimum_percentage:
        typeof d.minimum_percentage === 'number'
          ? d.minimum_percentage
          : String(d.minimum_percentage ?? ''),
      maximum_percentage:
        typeof d.maximum_percentage === 'number'
          ? d.maximum_percentage
          : String(d.maximum_percentage ?? ''),
      status_id: d.status_id ?? 1,
    }
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateRiskDefinition(riskDefinitionId, payload)
    if (success) {
      goToURL('RiskDefinitionList')
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    const resp = await _getByIdRiskDefinition(riskDefinitionId)
    if (resp) setDataToForm(resp as IRiskDefinitionForm)
    openMainLoader(false)
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })
    
  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    basicDataForm,
    risk_nature,

    goToURL,
    onSubmit,
  }
}

export default useRiskDefinitionsEdit
