import { useGoToUrl, useMainLoader } from '@/composables'
import { ICancelledMovementShow } from '@/interfaces/customs'
import { useMovementsCancelledStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const useMovementCancelledView = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { _showCancelledMovementById } = useMovementsCancelledStore('v1')

  const route = useRoute()

  const treasuryMovementId = +route.params.id

  const headerProps = {
    title: 'Ver movimientos de tesorería anulados',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      { label: 'Consultas', route: '' },
      {
        label: 'Consulta de movimientos de tesorería anulados',
        route: 'TreasuryMovementsCancelledList',
      },
      {
        label: 'Ver',
        route: 'TreasuryMovementsCancelledView',
      },
      {
        label: `${treasuryMovementId}`,
      },
    ],
  }

  const tabs = reactive([
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
  const tabActive = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

  const movementData = ref<ICancelledMovementShow | null>(null)

  onMounted(async () => {
    if (treasuryMovementId) {
      openMainLoader(true)
      movementData.value = await _showCancelledMovementById(treasuryMovementId)
      openMainLoader(false)
    }
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    movementData,
    goToURL,
  }
}

export default useMovementCancelledView
