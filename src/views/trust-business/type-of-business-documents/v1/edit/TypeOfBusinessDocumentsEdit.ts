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

const useTypeOfBusinessDocumentsEdit = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const idTypeOfBusinessDocuments = router.currentRoute.value.params.id

  const {
    headerPropsDefault,
    data_type_of_business_documents_form,
    data_business_trust_on_create,
  } = storeToRefs(useTypeOfBusinessDocumentsStore('v1'))
  const { _updateAction, _getTypeOfBusinessDocumentsById } =
    useTypeOfBusinessDocumentsStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Editar tipos de documentos',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
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

  const formTypeOfBusinessDocuments = ref()

  const validateForm = async () => {
    return (await formTypeOfBusinessDocuments.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      if (
        !data_type_of_business_documents_form.value ||
        !data_business_trust_on_create.value ||
        !idTypeOfBusinessDocuments
      )
        return

      openMainLoader(true)
      if (await _updateAction(idTypeOfBusinessDocuments.toString())) {
        router.push({
          name: 'TypeOfBusinessDocumentsList',
          query: { reload: 1 },
        })
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
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
    formTypeOfBusinessDocuments,
    handlerGoTo,
    onSubmit,
  }
}

export default useTypeOfBusinessDocumentsEdit
