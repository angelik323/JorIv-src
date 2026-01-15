import { onBeforeMount, ref, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useDefinitionAccountingParametersStore } from '@/stores'

const useDefinitionAccountingParametersView = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { definition_accounting_parameters_view } = storeToRefs(
    useDefinitionAccountingParametersStore('v1')
  )
  const { _getByIdDefinitionAccountingParameters, _clearData } =
    useDefinitionAccountingParametersStore('v1')

  const definitionAccountingParametersId = +route.params.id
  const basicDataFormRef = ref()
  const detailFormRef = ref()
  const positionFormRef = ref()
  const derivateFormRef = ref()

  const headerProps = {
    title: 'Ver parámetro contable',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Parámetros contables',
        route: 'DefinitionAccountingParametersList',
      },
      {
        label: 'Ver',
        route: 'DefinitionAccountingParametersView',
      },
      {
        label: `${definitionAccountingParametersId}`,
      },
    ],
  }

  const tabsBasic = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const tabs = ref<ITabs[]>([
    {
      name: 'details',
      label: 'Detalle parámetro',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'positions',
      label: 'Detalle parámetros contables posiciones',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'derivates',
      label: 'Detalle parámetros contables derivados',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tabActiveBasic = ref(tabsBasic.value[0].name)
  const tabActiveIdxBasic = ref(
    tabsBasic.value.findIndex((tab) => tab.name === tabActiveBasic.value)
  )

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const nextTab = () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    try {
      await _getByIdDefinitionAccountingParameters(
        definitionAccountingParametersId
      )
    } finally {
      openMainLoader(false)
    }
  })

  onBeforeUnmount(() => {
    _clearData()
  })

  return {
    headerProps,
    tabsBasic,
    tabActiveBasic,
    tabActiveIdxBasic,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    detailFormRef,
    positionFormRef,
    derivateFormRef,
    backTab,
    nextTab,
    definition_accounting_parameters_view,
  }
}

export default useDefinitionAccountingParametersView
