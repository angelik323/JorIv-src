import { onBeforeUnmount, onMounted, ref } from 'vue'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { ITabs } from '@/interfaces/global'

import { useQuotasIssuingPermitsStore, useResourceManagerStore } from '@/stores'

const useQuotasIssuingPermitsCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _createAction } = useQuotasIssuingPermitsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()

  const keys = [
    'emitter',
    'bank_account_third_party',
    'bank_account_third_party_quotas',
    'type_investment',
    'paper_type',
    'investment_portfolio',
  ]

  const headerProperties = {
    title: 'Crear cupos y permisos emisor',
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
        label: 'Crear',
        route: 'QuotasIssuingPermitsCreate',
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

  const handleSubmitForm = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    const information = informationFormRef.value?.getValues()

    openMainLoader(true)

    const success = await _createAction(information)

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
        'emitter',
        'type_investment',
        'investment_portfolio',
      ],
    })
  })

  onBeforeUnmount(() => _resetKeys({ investment_portfolio: keys }))

  return {
    tabs,
    tabActive,
    tabActiveIdx,
    handleGoToList,
    handleSubmitForm,
    headerProperties,
    informationFormRef,
  }
}

export default useQuotasIssuingPermitsCreate
