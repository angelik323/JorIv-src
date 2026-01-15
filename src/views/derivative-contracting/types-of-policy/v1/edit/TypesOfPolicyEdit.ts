// Vue, Pinia, Router
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Stores
import { useTypeOfPoliciesStoreV1 } from '@/stores/derivative-contracting/types-of-policy/types-of-policy-v1'
import { useRiskDefinitionsStoreV1 } from '@/stores/derivative-contracting/risk-definition/risk-definition-v1'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITypeOfPolicyForm } from '@/interfaces/customs/derivative-contracting/TypesOfPolicy'
import InformationForm from '@/components/Forms/DerivativeContracting/TypesOfPolicies/InformationForm.vue'
import { ITabs } from '@/interfaces/global'
import { IRiskDefinitionResponse } from '@/interfaces/customs/derivative-contracting/RiskDefinition'
import { useResourceManagerStore } from '@/stores'

const useTypeOfPolicyEdit = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const store = useTypeOfPoliciesStoreV1()
  const riskStore = useRiskDefinitionsStoreV1()
  const { _getByIdTypeOfPolicy, _updateTypeOfPolicy } = store
  const { _getRiskDefinitions } = riskStore

  const { policy_stage, risk_list } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
      
  const keys = {
    derivative_contracting: [
      'policy_stage',
      'risk_list',
    ],
  }

  const typeOfPolicyId = Number(route.params.id)
  
  const { risk_definitions_list } = storeToRefs(riskStore)

  const basicDataForm = ref<ITypeOfPolicyForm | null>(null)
  const informationFormRef = ref<typeof InformationForm | null>(null)

  const headerProperties = {
    title: 'Editar tipo de póliza',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      { label: 'Tipos de póliza', route: 'TypesOfPolicyList' },
      { label: 'Editar', route: 'TypesOfPolicyEdit' },
      { label: String(typeOfPolicyId || '') },
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

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getRiskDefinitions("paginate=1")
    openMainLoader(false)
  })

  onBeforeMount(async () => {
    if (!typeOfPolicyId) return
    openMainLoader(true)

    const resp = await _getByIdTypeOfPolicy(typeOfPolicyId)

    if (resp) {
      basicDataForm.value = {
      name: resp.name ?? '',
      stage: resp.stage ?? '',
      status_id: resp.status_id ?? 1,
      risk_ids: Array.isArray(resp.risks) ? resp.risks.map(r => Number(r.id)).filter(Boolean) : [],
      risks: Array.isArray(resp.risks)
        ? resp.risks.map((r: IRiskDefinitionResponse) => ({
            id: Number(r.id),
            code: String(r.code ?? ''),
            name: String(r.name ?? ''),
            nature: String(r.nature ?? ''),
            minimum_percentage: String(r.minimum_percentage ?? ''),
            maximum_percentage: String(r.maximum_percentage ?? ''),
            status_id: Number(r.status?.id ?? r.status_id ?? 1),
          }))
        : [],
      }
    }

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    basicDataForm.value = null
  })

  const makeDataRequest = (): ITypeOfPolicyForm => ({
    name: basicDataForm.value?.name ?? '',
    stage: basicDataForm.value?.stage ?? '',
    status_id: Number(basicDataForm.value?.status_id ?? 1),
    risk_ids: Array.isArray(basicDataForm.value?.risk_ids)
      ? basicDataForm.value?.risk_ids
      : []
  })

  const onSubmit = async () => {
    if (!typeOfPolicyId) return

    const valid = await informationFormRef.value?.validateForm?.()
    if (!valid) return

    openMainLoader(true)
    const success = await _updateTypeOfPolicy(typeOfPolicyId, makeDataRequest())
    if (success) {
      goToURL('TypesOfPolicyList')
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
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    basicDataForm,
    risk_definitions_list,
    defaultIconsLucide,
    policy_stage,
    risk_list,

    goToURL,
    onSubmit,
  }
}

export default useTypeOfPolicyEdit
