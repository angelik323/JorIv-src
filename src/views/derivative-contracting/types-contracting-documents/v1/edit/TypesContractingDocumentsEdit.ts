// Vue - Pinia - Router - Quasar
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

// Composables
import { useMainLoader, useGoToUrl, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITypesContractingDocumentsBasicDataForm,
  ITypesContractingDocumentsFlowStatesForm,
  ITypesContractingDocumentsRequest,
  ITypesContractingDocumentsResponse,
  ITypesContractingDocumentsFlowParent,
} from '@/interfaces/customs'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTypesContractingDocumentsStore } from '@/stores/derivative-contracting/types-contracting-documents'

const useTypesContractingDocumentsEdit = () => {
  const route = useRoute()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const store = useTypesContractingDocumentsStore('v1')
  const { _getByIdAction, _updateAction } = store
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const typesContractingDocumentsId = +route.params.id

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
      'type_contract_status_enum',
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
    title: 'Editar tipos de documentos de contratación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
      },
      {
        label: 'Tipos de documentos de contratación',
        route: 'TypesContractingDocumentsList',
      },
      {
        label: 'Editar',
        route: 'TypesContractingDocumentsEdit',
      },
      {
        label: `${typesContractingDocumentsId}`,
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

  const setDataToForm = (data: ITypesContractingDocumentsResponse) => {
    if (!data) return

    basicDataForm.value = {
      ...data,
      budget_validity: data?.budget_validity?.id ?? null,
      category: data?.category?.id ?? null,
    }

    const relationships = data.flow_relationships || []
    if (!relationships.length || !flowStatesForm.value) return

    flowStatesForm.value.type = parseInt(relationships[0]?.type || '0')

    const parentsMap = relationships.reduce((map, rel) => {
      const {
        id,
        order_parent,
        order_child,
        status_flow_relationship: {
          parent_status_id,
          parent_status,
          child_status,
        },
      } = rel

      if (!parent_status_id) return map

      if (!map.has(parent_status_id)) {
        map.set(parent_status_id, {
          id: id || null,
          order_parent: order_parent || null,
          status_parent_id: parent_status_id || null,
          label: parent_status?.name || '',
          children: [],
        })
      }

      const parent = map.get(parent_status_id)
      if (parent && child_status) {
        parent.children = parent.children || []
        parent.children.push({
          id: id || null,
          order_child: order_child || null,
          status_child_id: child_status.id || null,
          label: child_status.name || '',
        })
      }

      return map
    }, new Map<number, ITypesContractingDocumentsFlowParent>())

    flowStatesForm.value.flow = Array.from(parentsMap.values())
      .sort((a, b) => (a.order_parent ?? 0) - (b.order_parent ?? 0))
      .map((parent) => ({
        ...parent,
        children:
          parent.children?.sort(
            (a, b) => (a.order_child ?? 0) - (b.order_child ?? 0)
          ) ?? [],
      }))
  }

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

    const nonEditableProps: (keyof ITypesContractingDocumentsBasicDataForm)[] =
      ['document_code', 'category', 'numbering_type']

    nonEditableProps.forEach((prop) => {
      if (prop in basicDataFormData) {
        delete basicDataFormData[prop]
      }
    })

    const cleanedBasicData = cleanEmptyFields(
      basicDataFormData,
      true
    ) as ITypesContractingDocumentsBasicDataForm

    if (Number(flowStatesFormData.type) === 69) {
      delete flowStatesFormData.flow
    }

    return {
      document_type: cleanedBasicData,
      status_flow: flowStatesFormData,
    }
  }

  const onSubmit = async () => {
    if (!((await validateFormBasicData()) || (await validateFormFlowStates())))
      return
    openMainLoader(true)

    try {
      const payload = makeDataRequest()
      const success = await _updateAction(payload, typesContractingDocumentsId)

      if (success) {
        goToURL('TypesContractingDocumentsList')
      }
    } finally {
      openMainLoader(false)
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    try {
      const response = await _getByIdAction(typesContractingDocumentsId)
      await _getResources(keys)
      if (response) {
        await setDataToForm(response)
      }
    } finally {
      openMainLoader(false)
    }
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

export default useTypesContractingDocumentsEdit
