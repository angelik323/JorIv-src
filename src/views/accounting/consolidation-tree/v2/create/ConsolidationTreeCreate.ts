// Vue - pinia
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useConsolidationTreeStore } from '@/stores/accounting/consolidation-tree'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useConsolidationTreeCreate = () => {
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    consolidation_tree_request_create,
    consolidation_tree_childrens,
    headerPropsDefault,
  } = storeToRefs(useConsolidationTreeStore('v1'))
  const { _createAction } = useConsolidationTreeStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Crear árbol de consolidación',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'ConsolidationTreeCreate',
      },
    ],
  }

  const consolidationTreeFormRef = ref()

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])
  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const validateForms = async () => {
    return consolidationTreeFormRef?.value?.validateForm()
  }

  const onSubmit = async () => {
    if (!(await validateForms()) || !consolidation_tree_request_create.value) {
      return
    }

    if (consolidation_tree_childrens.value.length > 0) {
      if (
        consolidation_tree_childrens.value.filter(
          (children) => children.id == 0 || children.id == null
        ).length > 0
      ) {
        showAlert('Debes seleccionar todos los codigos de negocio', 'error')
        return
      }
    }

    openMainLoader(true)
    if (await _createAction(consolidation_tree_request_create.value)) {
      goToURL('ConsolidationTreeList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const keys = {
    accounting: ['bussines_parent'],
    trust_business: ['business_trust_statuses'],
  }
  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    consolidationTreeFormRef,
    goToURL,
    onSubmit,
  }
}

export default useConsolidationTreeCreate
