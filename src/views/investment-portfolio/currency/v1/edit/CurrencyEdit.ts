// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICurrencyInformationForm,
  ICurrencyResponse,
  ICurrencyToEdit,
} from '@/interfaces/customs/investment-portfolio/Currency'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useCurrencyStore } from '@/stores/investment-portfolio/currency'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCurrencyEdit = () => {
  const { _getByCurrencyId, _updateCurrency, _clearData } =
    useCurrencyStore('v1')
  const { headerPropsDefault, currency_response } = storeToRefs(
    useCurrencyStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const router = useRouter()

  const currencyId = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const information_form = ref<ICurrencyInformationForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Editar moneda',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'CurrencyEdit',
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

  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx >= 0 && tabActiveIdx < forms.length) {
      try {
        valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  // Information form request
  const makeInformationRequest = (
    data: ICurrencyInformationForm | null
  ): Partial<ICurrencyToEdit> => {
    if (!data) return {}

    const request: ICurrencyToEdit = {
      code: data.code?.trim() ?? '',
      description: data.description?.trim() ?? '',
      type_of_currency: data.currency_type ?? '',
      value: Number(data.value) || 0,
    }

    return cleanEmptyFields(request, true)
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeInformationRequest(information_form.value)
    const success = await _updateCurrency(payload, currencyId)
    if (success) goToURL('CurrencyList')

    openMainLoader(false)
  }

  // Seteo del formulario
  const setFormEdit = (data: ICurrencyResponse) => {
    information_form.value = {
      id: data.id,
      code: data.code || null,
      description: data.description || null,
      currency_type: data.type_of_currency || null,
      value: data.value || null,
    }
  }

  const keys = {
    investment_portfolio: ['type_of_coins'],
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await Promise.all([_getResources(keys), _getByCurrencyId(currencyId)])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => currency_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
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
    onSubmit,
  }
}

export default useCurrencyEdit
