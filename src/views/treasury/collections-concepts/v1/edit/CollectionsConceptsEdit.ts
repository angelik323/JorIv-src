import { defaultIconsLucide } from '@/utils'
import { onBeforeMount, onUnmounted, reactive, ref } from 'vue'
import { useMainLoader } from '@/composables'
import { storeToRefs } from 'pinia'
import { useCollectionsConceptsStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const useCollectionsConceptsEdit = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const route = useRoute()

  const collectionConceptsId = +route.params.id

  const { data_information_form, collections_concepts_request } = storeToRefs(
    useCollectionsConceptsStore('v1')
  )

  const {
    _getByIdCollectionConcepts,
    _setDataCollectionsConcepts,
    _updateCollectionConcepts,
  } = useCollectionsConceptsStore('v1')

  const headerProperties = {
    title: 'Editar conceptos de recaudo',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Conceptos de recaudo',
        route: 'CollectionConceptsList',
      },
      {
        label: 'Editar',
        route: 'CollectionConceptsEdit',
      },
      {
        label: collectionConceptsId.toString(),
        route: 'CollectionConceptsEdit',
      },
    ],
  }
  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )
  const informationFormRef = ref<{
    validateForm: () => Promise<boolean>
  } | null>(null)

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = () => {
    return {
      structure_id: data_information_form.value?.structure_id ?? null,
      structure_name: data_information_form.value?.structure_name ?? null,
      structure_use: data_information_form.value?.structure_use ?? null,
      structure_code: data_information_form.value?.structure_code ?? null,
      type: data_information_form.value?.type ?? null,
      description: data_information_form.value?.description ?? null,
      status_id: data_information_form.value?.status_id,
    }
  }

  const onSubmit = async (): Promise<void> => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()

      if (await _updateCollectionConcepts(collectionConceptsId, payload)) {
        router.push({ name: 'CollectionConceptsList' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdCollectionConcepts(collectionConceptsId)
    openMainLoader(false)
  })

  onUnmounted(() => {
    _setDataCollectionsConcepts(null)
  })
  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    collections_concepts_request,
    onSubmit,
  }
}
export default useCollectionsConceptsEdit
