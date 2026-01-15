// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICurrencyInformationForm,
  ICurrencyToCreate,
} from '@/interfaces/customs/investment-portfolio/Currency'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useCurrencyStore } from '@/stores/investment-portfolio/currency'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCurrencyCreate = () => {
  const { _createCurrency, _clearData } = useCurrencyStore('v1')
  const { headerPropsDefault } = storeToRefs(useCurrencyStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  // Data de formularios
  const information_form = ref<ICurrencyInformationForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear moneda',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'CurrencyCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information_form',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  // Information form request
  const makeInformationRequest = (
    data: ICurrencyInformationForm | null
  ): Partial<ICurrencyToCreate> => {
    if (!data) return {}

    const request: ICurrencyToCreate = {
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
    const success = await _createCurrency(payload)
    if (success) goToURL('CurrencyList')

    openMainLoader(false)
  }

  const keys = {
    investment_portfolio: ['type_of_coins'],
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
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

export default useCurrencyCreate
