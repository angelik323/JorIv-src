import router from '@/router'
import { onBeforeMount, onMounted, ref } from 'vue'

import { useMainLoader, useUtils } from '@/composables'

import { ITabs } from '@/interfaces/global'

import {
  useResourceManagerStore,
  useRegisterDividendsPerIssuerStore,
} from '@/stores'

const useRegisterDividendsPerIssuerCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useRegisterDividendsPerIssuerStore('v1')

  const informationFormRef = ref()

  const keys = [
    'operation_type',
    'local_currency_type',
    'third_party_issuers_selector',
    'issuer_dividend_class_action',
    'issuer_dividend_dividend_type',
  ]

  const headerProperties = {
    title: 'Crear registro de dividendos por emisor acciones',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Registro de dividendos por emisor acciones',
        route: 'RegisterDividendsPerIssuerList',
      },
      {
        label: 'Crear',
        route: 'RegisterDividendsPerIssuerCreate',
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
    router.push({
      name: 'RegisterDividendsPerIssuerList',
      query: { reload: 'true' },
    })

  onMounted(async () => await _getResources({ investment_portfolio: keys }))

  onBeforeMount(async () => await _resetKeys({ investment_portfolio: keys }))

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

export default useRegisterDividendsPerIssuerCreate
