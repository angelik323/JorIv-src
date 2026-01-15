// Vue
import { computed, ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'

const useDetailedBalanceSheetCreate = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const informationFormRef = ref()

  const headerProps = {
    title: 'Balance general detallado',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
      },
      {
        label: 'Reportes contables',
        route: 'AccoutingReportList',
      },
      {
        label: 'Balance general detallado',
        route: 'DetailedBalanceSheetCreate',
      },
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
    {
      name: 'report',
      label: 'Informe generado',
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

  return {
    goToURL,
    tabActive,
    headerProps,
    filteredTabs,
    tabActiveIdx,
    informationFormRef,
  }
}

export default useDetailedBalanceSheetCreate
