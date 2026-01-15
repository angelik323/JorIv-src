import { ITabs } from '@/interfaces/global'
import { useResourceManagerStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { onMounted, onUnmounted, reactive, ref } from 'vue'

export const useGenerateBallotMenu = () => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const headerProps = {
    title: 'Generar papeletas de inversión',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Porfatolio de inversiones', route: '' },
      {
        label: 'Generar papeletas de inversión',
        route: 'GenerateBallotMenu',
      },
    ],
  }
  const tabs = reactive<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])

  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )
  onMounted(async () => {
    await _getResources({
      investment_portfolio: [
        'investment_portfolio',
        'instruction_slip_types',
        'type_accounts',
      ],
    })
  })

  onUnmounted(() => {
    _resetKeys({
      accounting: [
        'investment_portfolio',
        'instruction_slip_types',
        'type_accounts',
      ],
    })
  })
  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
  }
}
