import { ref, onBeforeMount, onUnmounted } from 'vue'
import { defaultIconsLucide } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useTypesCollectionStore } from '@/stores'
import { storeToRefs } from 'pinia'

const useTypesCollectionEdit = () => {
  const { openMainLoader } = useMainLoader()

  const route = useRoute()
  const router = useRouter()

  const typeCollectionId = +route.params.id

  const { data_information_form, type_received_request } = storeToRefs(
    useTypesCollectionStore('v1')
  )

  const {
    _getByIdTypeCollection,
    _setDataBasicCollection,
    _updateTypeCollection,
  } = useTypesCollectionStore('v1')

  const headerProperties = {
    title: 'Editar tipo de recaudo',
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
        label: 'Editar',
        route: 'TypesCollectionEdit',
      },
      {
        label: typeCollectionId.toString(),
      },
    ],
  }

  const tabs = ref([
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
    return {
      description: data_information_form.value?.description || null,
      type_receive: data_information_form.value?.type_receive || null,
      redemption_days: data_information_form.value?.redemption_days || null,
      status_id: data_information_form.value?.status_id || null,
      id: type_received_request.value?.id || null,
      code: data_information_form.value?.code ?? null,
      created_at: data_information_form.value?.created_at || null,
      updated_at: data_information_form.value?.updated_at || null,
      deleted_at: data_information_form.value?.deleted_at || null,
    }
  }

  const activeTab = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )
  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  onUnmounted(async () => {
    _setDataBasicCollection(null)
  })

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _updateTypeCollection(payload, typeCollectionId)) {
        router.push({ name: 'TypesCollectionList' })
      }
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdTypeCollection(typeCollectionId)
    openMainLoader(false)
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    data_information_form,
    formInformation,
    type_received_request,

    handlerGoTo,
    onSubmit,
  }
}

export default useTypesCollectionEdit
