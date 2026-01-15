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

const useQuotasIssuingPermitsEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _showAction, _updateAction } = useQuotasIssuingPermitsStore('v1')

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const initialData = ref({})

  const keys = [
    'emitter',
    'bank_account_third_party',
    'bank_account_third_party_quotas',
    'type_investment',
    'paper_type',
    'investment_portfolio',
  ]

  const headerProperties = {
    title: 'Editar cupos y permisos emisor',
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
        label: 'Editar',
        route: 'QuotasIssuingPermitsEdit',
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

  const handleSubmitForm = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    const information = informationFormRef.value?.getValues()

    openMainLoader(true)

    const success = await _updateAction(id, information)

    if (success) handleGoToList()

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
    handleSubmitForm,
    headerProperties,
    informationFormRef,
  }
}

export default useQuotasIssuingPermitsEdit
