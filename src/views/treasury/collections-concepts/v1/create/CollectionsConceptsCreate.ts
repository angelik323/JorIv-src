import { defaultIconsLucide } from '@/utils'
import { onUnmounted, reactive, ref } from 'vue'
import { useMainLoader } from '@/composables'
import { storeToRefs } from 'pinia'
import { useCollectionsConceptsStore } from '@/stores'
import { useRouter } from 'vue-router'

const useCollectionsConceptsCreate = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()

  const { data_information_form } = storeToRefs(
    useCollectionsConceptsStore('v1')
  )

  const { _createCollectionConcepts, _setDataCollectionsConcepts } =
    useCollectionsConceptsStore('v1')

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
  const headerProperties = {
    title: 'Crear conceptos de recaudo',
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
        label: 'Crear',
        route: '',
      },
    ],
  }
  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )
  const informationFormRef = ref()

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = () => {
    const {
      structure_id,
      structure_name,
      structure_use,
      structure_code,
      type,
      description,
    } = data_information_form.value ?? {}
    return {
      description: description ?? null,
      structure_id: structure_id ?? null,
      structure_name: structure_name ?? null,
      structure_use: structure_use ?? null,
      structure_code: structure_code ?? null,
      type: type ?? null,
    }
  }

  const onSubmit = async (): Promise<void> => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()

      if (await _createCollectionConcepts(payload)) {
        router.push({ name: 'CollectionConceptsList' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onUnmounted(() => {
    _setDataCollectionsConcepts(null)
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    onSubmit,
  }
}
export default useCollectionsConceptsCreate
