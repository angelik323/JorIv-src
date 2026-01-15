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
  ITypesContractingDocumentsResponse,
  ITypesContractingDocumentsFlowParent,
} from '@/interfaces/customs'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTypesContractingDocumentsStore } from '@/stores/derivative-contracting/types-contracting-documents'

const useTypesContractingDocumentsView = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const { _getByIdAction } = useTypesContractingDocumentsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const typesContractingDocumentsId = +route.params.id

  const basicDataFormRef = ref()
  const flowStatesFormRef = ref()
  const basicDataForm = ref<ITypesContractingDocumentsBasicDataForm | null>(
    null
  )
  const flowStatesForm = ref<ITypesContractingDocumentsFlowStatesForm>({
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
    title: 'Ver tipos de documentos de contratación',
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
        label: 'Ver',
        route: 'TypesContractingDocumentsView',
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
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'flow_states',
      label: 'Flujo de estados',
      icon: defaultIconsLucide.listCheck,
      outlined: true,
      disable: false,
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
      category: data.category?.label ?? null,
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

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
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

    goToURL,
    backTab,
    nextTab,
  }
}

export default useTypesContractingDocumentsView
