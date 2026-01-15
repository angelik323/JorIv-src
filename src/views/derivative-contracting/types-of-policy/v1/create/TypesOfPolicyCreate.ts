// Vue - Pinia - Router - Quasar
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Interfaces
import type { ITabs } from '@/interfaces/global'
import type { ITypeOfPolicyForm } from '@/interfaces/customs/derivative-contracting/TypesOfPolicy'

// Stores
import { useTypeOfPoliciesStoreV1 } from '@/stores/derivative-contracting/types-of-policy/types-of-policy-v1'
import { useRiskDefinitionsStoreV1 } from '@/stores/derivative-contracting/risk-definition/risk-definition-v1'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { storeToRefs } from 'pinia'
import { useResourceManagerStore } from '@/stores'

const useTypeOfPolicyCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { policy_stage, risk_list } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
    
  const keys = {
    derivative_contracting: [
      'policy_stage',
      'risk_list',
    ],
  }
  
  const store = useTypeOfPoliciesStoreV1()
  const riskStore = useRiskDefinitionsStoreV1()

  const { _createTypeOfPolicy } = store
  const { _getRiskDefinitions } = riskStore

  const { risk_definitions_list } = storeToRefs(riskStore)

  const informationFormRef = ref()
  const basicDataForm = ref<ITypeOfPolicyForm | null>(null)

  const headerProps = {
    title: 'Crear tipo de póliza',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      { label: 'Tipos de póliza', route: 'TypesOfPolicyList' },
      { label: 'Crear', route: 'TypeOfPolicyCreate' },
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
  const makeDataRequest = (): ITypeOfPolicyForm => {
    if (!basicDataForm.value) return {} as ITypeOfPolicyForm
    const d = basicDataForm.value
    return {
      name: d.name ?? '',
      stage: d.stage ?? '',
      status_id: d.status_id ?? 1,
      risk_ids: Array.isArray(d.risk_ids) ? d.risk_ids : [],
    }
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createTypeOfPolicy(payload)
    if (success) {
      goToURL('TypesOfPolicyList')
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getRiskDefinitions("paginate=1")
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
    risk_definitions_list,
    policy_stage,
    risk_list,
    goToURL,
    onSubmit,
  }
}

export default useTypeOfPolicyCreate
