// Vue - pinia
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useConsolidationTreeStore } from '@/stores/accounting/consolidation-tree'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useConsolidationTreeEdit = () => {
  const router = useRouter()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const {
    consolidation_tree_request_update,
    consolidation_tree_childrens,
    headerPropsDefault,
    data_basic_consolidation_tree,
  } = storeToRefs(useConsolidationTreeStore('v1'))
  const { _getBusinessByID, _updateAction } = useConsolidationTreeStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const consolidationTreeId = router.currentRoute.value.params.id

  const consolidationTreeFormRef = ref()

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Editar árbol de consolidación',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'ConsolidationTreeEdit',
      },
      {
        label: consolidationTreeId.toString(),
      },
    ],
  }

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
    if (!(await validateForms()) || !consolidation_tree_request_update.value) {
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
    if (await _updateAction(consolidation_tree_request_update.value)) {
      goToURL('ConsolidationTreeList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onMounted(async () => {
    if (consolidationTreeId) {
      openMainLoader(true)
      const consolidationTreeIdTransformed = Number(
        consolidationTreeId.toString()
      )
      await _getBusinessByID(consolidationTreeIdTransformed)
      const accountingStructureId =
        data_basic_consolidation_tree.value?.accounting_structure.id || 0

      if (accountingStructureId) {
        await _getResources(
          {
            accounting: ['bussines_child'],
          },
          `filter[account_structure_id]=${accountingStructureId}`
        )
      } else {
        showAlert(
          'El negocio no tiene una estructura contable asignada.',
          'warning',
          undefined,
          3000
        )
      }
      openMainLoader(false)
    }
  })

  const keys = {
    accounting: ['bussines_parent'],
    trust_business: ['business_trust_statuses'],
  }

  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    keys.accounting.push('bussines_child')
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

export default useConsolidationTreeEdit
