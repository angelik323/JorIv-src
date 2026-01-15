import { useMainLoader } from '@/composables'

import { IBusinessTrustOnCreateDocumentStructure } from '@/interfaces/customs'

import { useTrustBusinessDocumentStructureStore } from '@/stores'

import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useTrustBusinessDocumentStructureEdit = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const idTrustBusinessDocumentStructure = router.currentRoute.value.params.id

  const {
    headerPropsDefault,
    data_trust_business_document_structure_form,
    data_business_trust_on_create,
  } = storeToRefs(useTrustBusinessDocumentStructureStore('v1'))
  const { _updateAction, _getTrustBusinessDocumentStructureById } =
    useTrustBusinessDocumentStructureStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Editar estructura documento negocios fiduciarios',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
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

  const formTrustBusinessDocumentStructure = ref()

  const validateForm = async () => {
    return (
      (await formTrustBusinessDocumentStructure.value?.validateForm()) ?? false
    )
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      if (
        !data_trust_business_document_structure_form.value ||
        !data_business_trust_on_create.value ||
        !idTrustBusinessDocumentStructure
      )
        return

      openMainLoader(true)
      if (await _updateAction(idTrustBusinessDocumentStructure.toString())) {
        router.push({
          name: 'TrustBusinessDocumentStructureList',
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
    formTrustBusinessDocumentStructure,
    handlerGoTo,
    onSubmit,
  }
}

export default useTrustBusinessDocumentStructureEdit
