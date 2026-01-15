// Vue - Pinia - Router - Quasar
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'

// Composables
import { useMainLoader, useGoToUrl, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITypesContractingDocumentsRequest,
  ITypesContractingDocumentsBasicDataForm,
  ITypesContractingDocumentsFlowStatesForm,
} from '@/interfaces/customs'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTypesContractingDocumentsStore } from '@/stores/derivative-contracting/types-contracting-documents'

const useTypesContractingDocumentsCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _createAction, _clearData } = useTypesContractingDocumentsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()
  const flowStatesFormRef = ref()
  const basicDataForm = ref<ITypesContractingDocumentsBasicDataForm | null>(
    null
  )
  const flowStatesForm = ref<ITypesContractingDocumentsFlowStatesForm | null>({
    type: null,
    flow: [],
  })

  const keys = {
    derivative_contracting: [
      'type_contract_status',
      'contract_type',
      'contract_type_category',
      'contract_type_modality',
      'contract_type_valuein',
      'contract_type_max_amount_allowed',
      'contract_type_numbering_type',
      'contract_type_business_numbering_type',
      'contract_type_status_flow_type',
      'contract_type_id_name',
      'contract_type_status_budget_validy',
      'contract_type_status_statuses_substatuses',
    ],
    budget: ['budget_document_types', 'code_movements'],
  }

  const keysCodeMovements = {
    budget: ['code_movements_types_contracting'],
  }

  const headerProps = {
    title: 'Crear tipo de documentos contractuales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
      },
      {
        label: 'Tipos de documentos contractuales',
        route: 'TypesContractingDocumentsList',
      },
      {
        label: 'Crear',
        route: 'TypesContractingDocumentsCreate',
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
      required: true,
    },
    {
      name: 'flow_states',
      label: 'Flujo de estados',
      icon: defaultIconsLucide.listCheck,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateFormBasicData = async () => {
    return (await basicDataFormRef.value?.validateForm()) ?? false
  }

  const validateFormFlowStates = async () => {
    return (await flowStatesFormRef.value?.validateForm()) ?? false
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const nextTab = async () => {
    if (tabActive.value === 'basic_data') {
      if (!(await validateFormBasicData())) return
    }

    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const makeDataRequest = (): ITypesContractingDocumentsRequest => {
    if (!basicDataForm.value || !flowStatesForm.value) {
      return {
        document_type: null,
        status_flow: null,
      }
    }

    const basicDataFormData = { ...basicDataForm.value }
    const flowStatesFormData = { ...flowStatesForm.value }

    if (Number(flowStatesFormData.type) === 69) {
      delete flowStatesFormData.flow
    }

    return {
      document_type: basicDataFormData,
      status_flow: flowStatesFormData,
    }
  }

  const onSubmit = async () => {
    if (!(await validateFormFlowStates())) return
    openMainLoader(true)

    try {
      const payload = makeDataRequest()
      const success = await _createAction(payload)

      if (success) {
        goToURL('TypesContractingDocumentsList')
      }
    } finally {
      openMainLoader(false)
    }
  }

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysCodeMovements)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    flowStatesFormRef,
    basicDataForm,
    flowStatesForm,

    nextTab,
    backTab,
    onSubmit,
    goToURL,
  }
}

export default useTypesContractingDocumentsCreate
