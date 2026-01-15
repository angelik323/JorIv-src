// Composables
import { useAlert, useMainLoader } from '@/composables'

// Store
import { useDocumentCharacteristicsStore } from '@/stores/trust-business/document-characteristics'

import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useDocumentCharacteristicsCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const formDocumentCharacteristics = ref()

  const documentCharacteristicsStore = useDocumentCharacteristicsStore('v1')
  const { headerPropsDefault, data_document_characteristics_list } =
    storeToRefs(documentCharacteristicsStore)

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Crear características de documento',
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

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  const validateForm = async () => {
    return (await formDocumentCharacteristics.value?.validateForm()) ?? false
  }

  const validateConfigurationForm = (
    trustBusinessId: number | string,
    documentTypeId: number | string
  ) => {
    const existing = data_document_characteristics_list.value.find(
      (item) =>
        item.business_trust_id === Number(trustBusinessId) &&
        item.document_type_id === Number(documentTypeId)
    )

    return {
      exists: !!existing,
      characteristicId: existing?.id,
    }
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      const formData = formDocumentCharacteristics.value?.models
      const documentTypeId = formData?.document_type_id
      const trustBusinessId = formData?.business_trust_id
      if (documentTypeId && trustBusinessId) {
        const { exists } = validateConfigurationForm(
          trustBusinessId,
          documentTypeId
        )

        if (exists) {
          showAlert(
            'Este documento ya tiene características configuradas. Por favor, busque el registro existente y, si lo requiere, edítelo en lugar de crear un nuevo registro.',
            'warning',
            undefined,
            4000
          )
          return
        }
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

export default useDocumentCharacteristicsCreate
