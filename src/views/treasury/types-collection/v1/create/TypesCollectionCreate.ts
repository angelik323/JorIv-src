import { onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { defaultIconsLucide } from '@/utils'
import { useTypesCollectionStore } from '@/stores'
import { storeToRefs } from 'pinia'

const useTypesCollectionCreate = () => {
  const router = useRouter()

  const { openMainLoader } = useMainLoader()

  const { data_information_form } = storeToRefs(useTypesCollectionStore('v1'))

  const { _setDataBasicCollection, _createTypeCollection, _getTypeCollection } =
    useTypesCollectionStore('v1')

  const headerProperties = {
    title: 'Crear nuevo tipo de recaudo',
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
        label: 'Tipos de recaudo',
        route: 'TypesCollectionList',
      },
      {
        label: 'Crear',
        route: 'TypesCollectionCreate',
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

  const makeDataRequest = () => {
    const { description, type_receive, redemption_days } =
      data_information_form.value ?? {}

    return {
      description: description ?? null,
      type_receive: type_receive ?? null,
      redemption_days: redemption_days ?? '',
    }
  }

  const activeTab = ref(tabs[0].name)

  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const informationFormRef = ref()

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  onUnmounted(() => {
    _setDataBasicCollection(null)
  })

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _createTypeCollection(payload)) {
        router.push({ name: 'TypesCollectionList' })
      }
      const defaultParams = ''
      await _getTypeCollection(defaultParams)
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,

    handlerGoTo,
    onSubmit,
  }
}

export default useTypesCollectionCreate
