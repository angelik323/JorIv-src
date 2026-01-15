import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useMarketabilityTypesStore } from '@/stores/investment-portfolio/types-marketability'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useTypesMarketabilityEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(
    useMarketabilityTypesStore('v1')
  )
  const id = Number(route.params.id)
  const {
    _setDataInformationForm,
    _updateMarketabilityType,
    _getMarketabilityTypesList,
    _getMarketabilityTypeById,
  } = useMarketabilityTypesStore('v1')

  const headerProps = {
    title: 'Editar tipo de bursatilidad',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversión', route: '' },
      {
        label: 'Tipos de bursatilidad',
        route: 'TypesMarketabilityList',
      },
      {
        label: 'Editar',
        route: 'TypesMarketabilityCreate',
      },
      {
        label: String(route.params.id),
        route: '',
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
    if (await _updateMarketabilityType(payload, id)) {
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

  onMounted(async () => {
    openMainLoader(true)
    if (await _getMarketabilityTypeById(id)) {
      openMainLoader(false)
    }
  })
  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    onSubmit,
    data_information_form,
  }
}
