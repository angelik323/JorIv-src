// Vue
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

// Utils - composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Interfaces
import { IConsecutiveDetailResponse } from '@/interfaces/customs/treasury/ConsecutiveVoucher'

// Store
import { useConsecutiveMovementsStore } from '@/stores/treasury/consecutive-movements'

const useConsecutiveVouchersView = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { _showConsecutiveDetail } = useConsecutiveMovementsStore('v1')

  const route = useRoute()

  const consecutiveMovementId = +route.params.id

  const headerProps = {
    title: 'Ver consecutivo movimientos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Consecutivos de comprobantes',
        route: 'ConsecutiveVouchersList',
      },
      {
        label: 'Ver',
        route: 'ConsecutiveVouchersView',
      },
      {
        label: `${consecutiveMovementId}`,
      },
    ],
  }

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos básicos',
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

  const consecutiveMovementData = ref<IConsecutiveDetailResponse | null>(null)

  onMounted(async () => {
    if (consecutiveMovementId) {
      openMainLoader(true)
      consecutiveMovementData.value = await _showConsecutiveDetail(
        consecutiveMovementId
      )
      openMainLoader(false)
    }
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    consecutiveMovementData,
    goToURL,
  }
}

export default useConsecutiveVouchersView
