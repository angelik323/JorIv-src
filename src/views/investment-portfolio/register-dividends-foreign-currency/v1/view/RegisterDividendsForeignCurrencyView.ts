import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { IEmitterDividend } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import { useRegisterDividendsForeignCurrencyStore } from '@/stores'

const useRegisterDividendsForeignCurrencyView = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()

  const { _showAction } = useRegisterDividendsForeignCurrencyStore('v1')

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

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
    title: 'Ver registro dividendos acciones moneda extranjera',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Registro dividendos acciones moneda extranjera',
        route: 'RegisterDividendsForeignCurrencyList',
      },
      {
        label: 'Ver',
        route: 'RegisterDividendsForeignCurrencyView',
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
    router.push({
      name: 'RegisterDividendsForeignCurrencyList',
      query: { reload: 'true' },
    })

  onMounted(() => loadData())

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

export default useRegisterDividendsForeignCurrencyView
