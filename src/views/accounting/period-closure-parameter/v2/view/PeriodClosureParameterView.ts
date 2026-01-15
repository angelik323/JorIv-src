// Core
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Stores
import { usePeriodClosureParametersStore } from '@/stores/accounting/period-closure-parameters'

const usePeriodClosureParameterView = () => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const periodClosureParameterId = +route.params.id
  const periodClosureParameterForm = ref()

  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()
  const { _getPeriodClosureParameter, _cleanPeriodClosureParametersData } =
    usePeriodClosureParametersStore('v2')

  const headerProps = {
    title: 'Ver parámetros cierre de período',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Parámetro cierre de periodo',
        route: 'PeriodClosureParameterList',
      },
      { label: 'Ver' },
      { label: `${periodClosureParameterId}` },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const paramsData = ref()

  onMounted(async () => {
    openMainLoader(true)
    paramsData.value = await _getPeriodClosureParameter(
      periodClosureParameterId
    )
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _cleanPeriodClosureParametersData()
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    periodClosureParameterForm,
    periodClosureParameterId,
    paramsData,
    goToURL,
  }
}

export default usePeriodClosureParameterView
