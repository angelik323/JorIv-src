import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { defaultIcons } from '@/utils'
import { useMainLoader } from '@/composables'

import { ITabs } from '@/interfaces/global'
import { usePeriodClosureParametersStore } from '@/stores/accounting/period-closure-parameters'

const usePeriodClosureParameterView = () => {
  const route = useRoute()
  const router = useRouter()
  const periodClosureParameterId = +route.params.id
  const periodClosureParameterForm = ref()

  const { openMainLoader } = useMainLoader()
  const { _getPeriodClosureParameter, _cleanPeriodClosureParametersData } =
    usePeriodClosureParametersStore('v1')

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
      icon: defaultIcons.bulletList,
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

  const goToList = () => {
    router.push({ name: 'PeriodClosureParameterList' })
  }

  onMounted(async () => {
    openMainLoader(true)
    _getPeriodClosureParameter(periodClosureParameterId).finally(() => {
      openMainLoader(false)
    })
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
    goToList,
  }
}

export default usePeriodClosureParameterView
