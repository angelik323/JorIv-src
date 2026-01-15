// Composables
import { useMainLoader } from '@/composables'

// Stores
import { useDocumentCharacteristicsStore } from '@/stores/trust-business/document-characteristics'

import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const useDocumentCharacteristicsEdit = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const formDocumentCharacteristics = ref()

  const idDocumentCharacteristics = router.currentRoute.value.params.id

  const { headerPropsDefault, data_document_characteristics_form } =
    storeToRefs(useDocumentCharacteristicsStore('v1'))
  const { _getDocumentCharacteristicsById } =
    useDocumentCharacteristicsStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Editar características de documento',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
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

  const validateForm = async () => {
    return (await formDocumentCharacteristics.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      if (!data_document_characteristics_form.value) {
        return
      }

      openMainLoader(true)
      if (await formDocumentCharacteristics.value?.submitForm()) {
        router.push({
          name: 'DocumentCharacteristicsList',
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
    if (idDocumentCharacteristics) {
      await _getDocumentCharacteristicsById(
        idDocumentCharacteristics.toString()
      )
    }
    openMainLoader(false)
  })

  const isValidForm = computed(() => {
    const formData = formDocumentCharacteristics.value?.models
    const hasRequiredFields =
      formData?.document_type_id && formData?.business_trust_id
    const hasCharacteristics = formData?.characteristics_document?.length > 0

    return hasRequiredFields && hasCharacteristics
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    formDocumentCharacteristics,
    isValidForm,
    handlerGoTo,
    onSubmit,
  }
}

export default useDocumentCharacteristicsEdit
