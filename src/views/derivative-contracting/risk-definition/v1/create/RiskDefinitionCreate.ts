// Vue - Pinia - Router - Quasar
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'

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

const useRiskDefinitionsCreate = () => {
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
  const { _createRiskDefinition } = store

  const informationFormRef = ref()
  const basicDataForm = ref<IRiskDefinitionForm | null>(null)

  const headerProps = {
    title: 'Crear tipo de riesgo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      { label: 'Riesgos', route: 'RiskDefinitionList' },
      { label: 'Crear', route: 'RiskDefinitionCreate' },
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
    const success = await _createRiskDefinition(payload)
    if (success) {
      goToURL('RiskDefinitionList')
    }
    openMainLoader(false)
  }

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

export default useRiskDefinitionsCreate
