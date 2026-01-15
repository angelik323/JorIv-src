import { useAlert, useMainLoader, useUtils } from '@/composables'
import { useConsolidationTreeStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useConsolidationTreeCreate = () => {
  const router = useRouter()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  const { defaultIconsLucide } = useUtils()

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
      },
    ],
  }

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
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
    if (!consolidation_tree_request_create.value) return

    openMainLoader(true)
    if (await _createAction(consolidation_tree_request_create.value)) {
      router.push({ name: 'ConsolidationTreeList' })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    handlerGoTo,
    onSubmit,
  }
}

export default useConsolidationTreeCreate
