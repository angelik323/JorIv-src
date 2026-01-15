// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global/Tabs'

// Stores
import { useBalancePointStore } from '@/stores/trust-business/balance-point'

// Vue
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const useBalancePointView = () => {
  const router = useRouter()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  const idBalancePoint = router.currentRoute.value.params.id

  const { headerPropsDefault } = storeToRefs(useBalancePointStore('v1'))
  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Ver punto de equilibrio',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
      },
      {
        label: idBalancePoint.toString(),
      },
    ],
  }
  const { _getBalancePointById } = useBalancePointStore('v1')

  const { goToURL } = useGoToUrl()

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'mandate_data',
      label: 'Encargo',
      icon: defaultIconsLucide.ArrowLeftRight,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'summary_data',
      label: 'Resumen',
      icon: defaultIconsLucide.listCheck,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'authorize_data',
      label: 'Autorización',
      icon: defaultIconsLucide.checkCircle,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onFinish = async () => {
    router.push({ name: 'BalancePointList' })
  }

  onMounted(async () => {
    openMainLoader(true)
    if (idBalancePoint) {
      await _getBalancePointById(idBalancePoint.toString())
    }
    openMainLoader(false)
  })

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    goToURL,
    nextTab,
    backTab,
    onFinish,
  }
}

export default useBalancePointView
