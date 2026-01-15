// composables
import { useMainLoader } from '@/composables'

// Interfaces
import { IBusinessTrustOnCreate } from '@/interfaces/customs/trust-business'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useTypeOfBusinessDocumentsStore } from '@/stores/trust-business/type-of-business-documents'

import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useTypeOfBusinessDocumentsCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const {
    headerPropsDefault,
    data_type_of_business_documents_form,
    data_business_trust_on_create,
  } = storeToRefs(useTypeOfBusinessDocumentsStore('v1'))
  const { _createAction, _searchBusinessTrust } =
    useTypeOfBusinessDocumentsStore('v1')

  const idTrustBusiness = ref<number | null>(null)

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: ['business_trusts'],
  }

  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Crear tipos de documentos',
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

  const formTypeOfBusinessDocuments = ref()

  const validateForm = async () => {
    return (await formTypeOfBusinessDocuments.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      if (
        !data_type_of_business_documents_form.value ||
        !data_business_trust_on_create.value
      )
        return

      openMainLoader(true)
      if (
        await _createAction(
          data_business_trust_on_create.value.id,
          data_type_of_business_documents_form.value
        )
      ) {
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

  const handleFilterSearch = async ($filters: { 'filter[id]': string }) => {
    if (!$filters['filter[id]']) {
      handleClearFilters()
      return
    }

    await _searchBusinessTrust($filters['filter[id]'])
  }

  const handleClearFilters = () => {
    idTrustBusiness.value = null
    data_business_trust_on_create.value = {} as IBusinessTrustOnCreate
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
    formTypeOfBusinessDocuments,
    handlerGoTo,
    onSubmit,
    handleFilterSearch,
    handleClearFilters,
  }
}

export default useTypeOfBusinessDocumentsCreate
