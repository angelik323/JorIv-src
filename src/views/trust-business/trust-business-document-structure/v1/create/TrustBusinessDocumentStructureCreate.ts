// Composables
import { useMainLoader } from '@/composables'

// Interfaces
import { IBusinessTrustOnCreateDocumentStructure } from '@/interfaces/customs/trust-business'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessDocumentStructureStore } from '@/stores/trust-business/trust-business-document-structure'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useTrustBusinessDocumentStructureCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const {
    headerPropsDefault,
    data_trust_business_document_structure_form,
    data_business_trust_on_create,
  } = storeToRefs(useTrustBusinessDocumentStructureStore('v1'))
  const { _createAction, _searchBusinessTrust } =
    useTrustBusinessDocumentStructureStore('v1')

  const idTrustBusiness = ref<number | null>(null)

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: ['business_trusts'],
  }

  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Crear estructura documento negocios fiduciarios',
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

  const filters = [
    {
      name: 'id',
      label: 'Buscador',
      type: 'q-select',
      value: null,
      class: 'col-12 q-py-md',
      options: business_trusts,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Buscar por código o nombre de negocio',
    },
  ]
  const filterConfig = ref(filters)

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
        !data_business_trust_on_create.value
      )
        return

      openMainLoader(true)
      if (
        await _createAction(
          data_business_trust_on_create.value.id,
          data_trust_business_document_structure_form.value
        )
      ) {
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

  const handleFilterSearch = async ($filters: { 'filter[id]': string }) => {
    if (!$filters['filter[id]']) {
      handleClearFilters()
      return
    }

    await _searchBusinessTrust($filters['filter[id]'])
  }

  const handleClearFilters = () => {
    idTrustBusiness.value = null
    data_business_trust_on_create.value =
      {} as IBusinessTrustOnCreateDocumentStructure
    // Limpiar los campos del formulario hijo
    formTrustBusinessDocumentStructure.value?.resetForm()
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(keys)

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    handleClearFilters()
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    filterConfig,
    formTrustBusinessDocumentStructure,
    handlerGoTo,
    onSubmit,
    handleFilterSearch,
    handleClearFilters,
  }
}

export default useTrustBusinessDocumentStructureCreate
