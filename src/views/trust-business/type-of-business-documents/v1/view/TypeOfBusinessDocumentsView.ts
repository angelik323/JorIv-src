// composables
import { useMainLoader } from '@/composables'

// Interfaces
import { IBusinessTrustOnCreate } from '@/interfaces/customs/trust-business'

// Stores
import { useTypeOfBusinessDocumentsStore } from '@/stores/trust-business/type-of-business-documents'

import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useTypeOfBusinessDocumentsView = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const idTypeOfBusinessDocuments = router.currentRoute.value.params.id

  const { headerPropsDefault, data_business_trust_on_create } = storeToRefs(
    useTypeOfBusinessDocumentsStore('v1')
  )
  const { _getTypeOfBusinessDocumentsById } =
    useTypeOfBusinessDocumentsStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Ver tipo de documento negocio',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
      },
      {
        label: idTypeOfBusinessDocuments.toString(),
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
    if (idTypeOfBusinessDocuments) {
      await _getTypeOfBusinessDocumentsById(
        idTypeOfBusinessDocuments.toString()
      )
    }
    openMainLoader(false)
  })

  const handleResetStore = () => {
    data_business_trust_on_create.value = {} as IBusinessTrustOnCreate
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

export default useTypeOfBusinessDocumentsView
