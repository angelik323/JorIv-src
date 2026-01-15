// Composables
import { useMainLoader } from '@/composables'

// Interfaces
import { IBusinessTrustOnCreateDocumentStructure } from '@/interfaces/customs/trust-business'

// Stores
import { useTrustBusinessDocumentStructureStore } from '@/stores/trust-business/trust-business-document-structure'

import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useTrustBusinessDocumentStructureView = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const idTrustBusinessDocumentStructure = router.currentRoute.value.params.id

  const { headerPropsDefault, data_business_trust_on_create } = storeToRefs(
    useTrustBusinessDocumentStructureStore('v1')
  )
  const { _getTrustBusinessDocumentStructureById } =
    useTrustBusinessDocumentStructureStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Ver estructura documento negocios fiduciarios',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
      },
      {
        label: idTrustBusinessDocumentStructure.toString(),
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
    if (idTrustBusinessDocumentStructure) {
      await _getTrustBusinessDocumentStructureById(
        idTrustBusinessDocumentStructure.toString()
      )
    }
    openMainLoader(false)
  })

  const handleResetStore = () => {
    data_business_trust_on_create.value =
      {} as IBusinessTrustOnCreateDocumentStructure
  }

  onBeforeUnmount(() => {
    handleResetStore()
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    handlerGoTo,
  }
}

export default useTrustBusinessDocumentStructureView
