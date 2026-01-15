// Vue - Router
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Stores
import { useForeignExchangeSalesStore } from '@/stores/investment-portfolio/foreign-exchange-sales-operations'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useForeignExchangeSaleCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _createForeignExchangeSalesBuy, _cleanForeignExchangeSalesBuysData } =
    useForeignExchangeSalesStore('v1')

  const foreignExchangeForm = ref()

  const { defaultIconsLucide } = useUtils()

  const headerProps = {
    title: 'Venta divisas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      {
        label: 'Portafolio de inversiones',
      },
      { label: 'Divisas', route: 'ForeignExchangeSalesList' },
      { label: 'Crear', route: 'ForeignExchangeSalesCreate' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    return foreignExchangeForm?.value?.validateForm()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = foreignExchangeForm.value.getFormData()
      const success = await _createForeignExchangeSalesBuy(payload)
      if (success) {
        goToURL('ForeignExchangeSalesList')
      }
      openMainLoader(false)
    }
  }

  const keys = {
    investment_portfolio: [
      'coins',
      'operation_type',
      'paper_types_form_parameters',
      'investment_portfolio',
      'investment_portfolio_banks',
      'issuer_counterparty_all',
    ],
    treasury: ['bank_account'],
  }

  onMounted(async () => {
    openMainLoader(true)
    _resetKeys(keys)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _cleanForeignExchangeSalesBuysData()
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    foreignExchangeForm,
    onSubmit,
    goToURL,
  }
}

export default useForeignExchangeSaleCreate
