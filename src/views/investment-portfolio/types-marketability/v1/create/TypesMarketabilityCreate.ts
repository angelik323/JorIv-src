import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useMarketabilityTypesStore } from '@/stores/investment-portfolio/types-marketability'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useTypesMarketabilityCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(
    useMarketabilityTypesStore('v1')
  )
  const {
    _setDataInformationForm,
    _createMarketabilityType,
    _getMarketabilityTypesList,
  } = useMarketabilityTypesStore('v1')

  const headerProps = {
    title: 'Crear tipo de bursatilidad',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversión', route: '' },
      {
        label: 'Tipos de bursatilidad',
        route: 'TypesMarketabilityList',
      },
      {
        label: 'Crear',
        route: 'TypesMarketabilityCreate',
      },
    ],
  }
  const tabs = reactive<ITabs[]>([
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

  const makeDataRequest = () => {
    return {
      code: data_information_form.value?.code ?? '',
      description: data_information_form.value?.description ?? '',
      type: data_information_form.value?.type ?? '',
    }
  }

  const onSubmit = async () => {
    openMainLoader(true)
    const payload = makeDataRequest()
    if (!payload.code || !payload.description || !payload.type) {
      openMainLoader(false)
      return
    }
    if (await _createMarketabilityType(payload)) {
      openMainLoader(false)
      router.push({ name: 'TypesMarketabilityList' })
    }
    openMainLoader(false)
    router.push({ name: 'TypesMarketabilityList' })
  }
  onUnmounted(() => {
    _setDataInformationForm(null)
    _getMarketabilityTypesList()
  })

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    onSubmit,
  }
}
