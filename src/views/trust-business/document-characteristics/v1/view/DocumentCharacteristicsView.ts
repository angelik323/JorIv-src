// Composables
import { useMainLoader } from '@/composables'

// Stores
import { useDocumentCharacteristicsStore } from '@/stores/trust-business/document-characteristics'

import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useDocumentCharacteristicsView = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const formDocumentCharacteristics = ref()

  const idDocumentCharacteristics = router.currentRoute.value.params.id

  const { headerPropsDefault } = storeToRefs(
    useDocumentCharacteristicsStore('v1')
  )
  const { _getDocumentCharacteristicsById } =
    useDocumentCharacteristicsStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Ver características de documento',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
      },
      {
        label: idDocumentCharacteristics.toString(),
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

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  onMounted(async () => {
    openMainLoader(true)
    if (idDocumentCharacteristics) {
      await _getDocumentCharacteristicsById(
        idDocumentCharacteristics.toString()
      )
    }
    openMainLoader(false)
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    formDocumentCharacteristics,
    handlerGoTo,
  }
}

export default useDocumentCharacteristicsView
