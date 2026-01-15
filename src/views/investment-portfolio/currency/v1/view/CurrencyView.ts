// Vue - pinia
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICurrencyInformationForm,
  ICurrencyResponse,
} from '@/interfaces/customs/investment-portfolio/Currency'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useCurrencyStore } from '@/stores/investment-portfolio/currency'

const useCurrencyView = () => {
  const { _getByCurrencyId, _clearData } = useCurrencyStore('v1')
  const { headerPropsDefault, currency_response } = storeToRefs(
    useCurrencyStore('v1')
  )

  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const router = useRouter()

  const currencyId = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const information_form = ref<ICurrencyInformationForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Ver moneda',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'CurrencyView',
        params: { id: currencyId },
      },
      {
        label: currencyId.toString(),
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information_form',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // Seteo del formulario
  const setFormView = (data: ICurrencyResponse) => {
    information_form.value = {
      id: data.id,
      code: data.code || null,
      description: data.description || null,
      currency_type: data.type_of_currency || null,
      value: data.value || null,
      created_at: data.history_currency?.created_at || null,
      created_by: data.history_currency?.creator_data || null,
      updated_at: data.history_currency?.updated_at || null,
      updated_by: data.history_currency?.updated_data || null,
    }
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByCurrencyId(currencyId)
    openMainLoader(false)
  })

  watch(
    () => currency_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
    }
  )

  return {
    currency_response,
    information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    goToURL,
  }
}

export default useCurrencyView
