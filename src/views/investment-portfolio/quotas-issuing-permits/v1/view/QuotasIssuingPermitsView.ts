//Vue-Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
//Router
import router from '@/router'
//Composables
import { useMainLoader, useUtils } from '@/composables'
//Interfaces
import { ITabs } from '@/interfaces/global'
//Stores
import { useQuotasIssuingPermitsStore, useResourceManagerStore } from '@/stores'

const useQuotasIssuingPermitsView = () => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _showAction } = useQuotasIssuingPermitsStore('v1')
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const initialData = ref({})

  const keys = [
    'investment_portfolio',
    'emitter',
    'bank_account_third_party',
    'type_investment',
    'paper_type',
  ]

  const headerProperties = {
    title: 'Ver cupos y permisos emisor',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Definición de cupos y permisos emisor',
        route: 'QuotasIssuingPermitsList',
      },
      {
        label: 'Ver',
        route: 'QuotasIssuingPermitsView',
      },
      {
        label: id,
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
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const loadData = async () => {
    openMainLoader(true)

    const success = await _showAction(id)

    if (success) {
      const data = success
      initialData.value = data
      isLoaded.value = true
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    router.push({ name: 'QuotasIssuingPermitsList', query: { reload: 'true' } })

  onMounted(async () => {
    await _getResources({
      investment_portfolio: [
        'investment_portfolio',
        'emitter',
        'type_investment',
      ],
    })

    loadData()
  })

  onBeforeUnmount(() => _resetKeys({ investment_portfolio: keys }))

  return {
    tabs,
    isLoaded,
    tabActive,
    initialData,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    informationFormRef,
  }
}

export default useQuotasIssuingPermitsView
