import { onBeforeMount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { IEmitterDividend } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import {
  useResourceManagerStore,
  useRegisterDividendsPerIssuerStore,
} from '@/stores'

const useRegisterDividendsPerIssuerEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()

  const { _showAction, _updateAction } =
    useRegisterDividendsPerIssuerStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const keys = [
    'operation_type',
    'local_currency_type',
    'third_party_issuers_selector',
    'issuer_dividend_class_action',
    'issuer_dividend_dividend_type',
  ]

  const initialData = ref<IEmitterDividend>({
    emitter_id: 0,
    operation_date: '',
    operation_code: 0,
    class_action: '',
    unit_id_action: '',
    number_of_shares: 0,
    dividend_type: '',
    dividend_record_date: '',
    ex_dividend_date: '',
    due_date: '',
    payment_date: '',
    has_recorded: 0,
    currency_id: 0,
    dividend_value: 0,
    tax_percentage: 0,
    dividend_value_after_tax: 0,
    enforceability_value: 0,
    tax_value: 0,
  })

  const headerProperties = {
    title: 'Editar registro de dividendos por emisor acciones',
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
        label: 'Editar',
        route: 'RegisterDividendsPerIssuerEdit',
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
    router.push({
      name: 'RegisterDividendsPerIssuerList',
      query: { reload: 'true' },
    })

  onMounted(async () => {
    await _getResources({ investment_portfolio: keys })
    loadData()
  })

  onBeforeMount(async () => await _resetKeys({ investment_portfolio: keys }))

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

export default useRegisterDividendsPerIssuerEdit
