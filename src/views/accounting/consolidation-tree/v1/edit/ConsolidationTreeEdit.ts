import { useAlert, useMainLoader } from '@/composables'
import { useConsolidationTreeStore, useResourceStore } from '@/stores'
import { defaultIcons } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useConsolidationTreeEdit = () => {
  const router = useRouter()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  const {
    consolidation_tree_request_update,
    consolidation_tree_childrens,
    headerPropsDefault,
  } = storeToRefs(useConsolidationTreeStore('v1'))
  const { _getBusinessByID, _updateAction } = useConsolidationTreeStore('v1')

  const { _getAccountingResources } = useResourceStore('v1')

  const consolidationTreeId = router.currentRoute.value.params.id

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Editar árbol de consolidación',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
      },
      {
        label: consolidationTreeId.toString(),
      },
    ],
  }

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIcons.listBulleted,
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

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const onSubmit = async () => {
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
    if (!consolidation_tree_request_update.value) return
    openMainLoader(true)
    if (await _updateAction(consolidation_tree_request_update.value)) {
      router.push({ name: 'ConsolidationTreeList' })
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
      await Promise.all([
        _getBusinessByID(consolidationTreeIdTransformed),
        _getAccountingResources(
          `keys[]=bussines_child&filter[business_id]=${consolidationTreeIdTransformed}`
        ),
      ])
      openMainLoader(false)
    }
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    handlerGoTo,
    onSubmit,
  }
}

export default useConsolidationTreeEdit
