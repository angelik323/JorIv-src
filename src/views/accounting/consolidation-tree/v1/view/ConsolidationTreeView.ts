import { useMainLoader } from '@/composables'
import { useConsolidationTreeStore } from '@/stores'
import { defaultIcons } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useConsolidationTreeView = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()

  const { headerPropsDefault } = storeToRefs(useConsolidationTreeStore('v1'))

  const { _getBusinessByID } = useConsolidationTreeStore('v1')

  const consolidationTreeId = router.currentRoute.value.params.id

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Ver árbol de consolidación',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
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

  onMounted(async () => {
    if (consolidationTreeId) {
      openMainLoader(true)
      await _getBusinessByID(Number(consolidationTreeId.toString()))
      openMainLoader(false)
    }
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    handlerGoTo,
  }
}

export default useConsolidationTreeView
