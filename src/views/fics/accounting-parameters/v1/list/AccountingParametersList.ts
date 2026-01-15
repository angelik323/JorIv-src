// Vue - Vue Router
import { ref, computed, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

const useAccountingBlocksList = (props: { activeTab?: string }) => {
  const { defaultIconsLucide } = useUtils()
  const router = useRouter()
  const route = useRoute()

  const headerProps = {
    title: 'Parámetros contabilidad',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Parámetros contabilidad',
        route: 'AccountingParametersList',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'accounting-blocks',
      label: 'Bloque contable',
      icon: defaultIconsLucide.rows2,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'process-codes',
      label: 'Código de proceso',
      icon: defaultIconsLucide.book,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'accounting-copy',
      label: 'Copia contable',
      icon: defaultIconsLucide.copy,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'accounting-parameters-auxiliaries',
      label: 'Auxiliares de parámetros contables',
      icon: defaultIconsLucide.sliders,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  onBeforeMount(() => {
    if (props.activeTab === 'codigos-procesos') {
      tabActive.value = filteredTabs.value[1].name
    }
  })

  watch(tabActive, (newTab) => {
    if (newTab === filteredTabs.value[1].name) {
      if (route.params.activeTab !== 'codigos-procesos') {
        tabActive.value = filteredTabs.value[1].name
        router.replace({
          name: 'AccountingParametersList',
          params: { activeTab: 'codigos-procesos' },
        })
      }
    } else if (route.params.activeTab) {
      router.replace({
        name: 'AccountingParametersList',
        params: {},
      })
    }
  })

  return {
    tabActive,
    headerProps,
    filteredTabs,
    tabActiveIdx,
  }
}

export default useAccountingBlocksList
