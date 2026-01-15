import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { IDerivativeInvestmentOperationToCreate } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { useResourceManagerStore } from '@/stores'
import { useDerivativeInvestmentOperationStore } from '@/stores/investment-portfolio/derivative-investment-operation'
import { onBeforeMount, onMounted, ref } from 'vue'

export const useCurrencySaleCreate = () => {
  const { goToURL } = useGoToUrl()
  const { _createDerivativeInvestmentOperation, _clearData } =
    useDerivativeInvestmentOperationStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const data_information_form =
    ref<IDerivativeInvestmentOperationToCreate | null>(null)

  const isLoaded = ref(false)
  const keys = [
    'investment_portfolio',
    'emitter',
    'derivative_class',
    'paper_type',
    'derivative_coverage',
    'operation_type',
    'coins',
  ]
  const informationFormRef = ref()
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const headerProps = {
    title: 'Crear constitución forward de venta divisa USD / COP',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
        route: '',
      },
      {
        label: 'Operación de inversión derivado',
        route: 'DerivativeInvestmentOperationsList',
      },
      {
        label: 'Crear',
        route: 'DerivativeInvestmentOperationsBuysForwardCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: useUtils().defaultIconsLucide.bulletList,
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

  const loadResources = async () => {
    openMainLoader(true)
    await _getResources({ investment_portfolio: keys })
    setTimeout(() => {
      openMainLoader(false)
      isLoaded.value = true
    }, 1000)
  }

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: IDerivativeInvestmentOperationToCreate | null
  ) => {
    if (!data) return {}

    const request: Partial<IDerivativeInvestmentOperationToCreate> = {
      created_by: data.created_by ?? null,
      operation_type_id: Number(data.operation_type_id) ?? null,
      operation_date: data.operation_date ?? null,
      investment_portfolio_id: data.investment_portfolio_id ?? null,
      compliance_type: data.compliance_type ?? null,
      issuers_counterparty_id: Number(data.issuers_counterparty_id) ?? null,
      derivative_class_id: data.derivative_class_id ?? null,
      paper_type_id: data.paper_type_id ?? null,
      derivative_objective: data.derivative_objective ?? null,
      coverage_type_id: data.coverage_type_id ?? null,
      badge_x_id: data.badge_x_id ?? null,
      badge_y_id: data.badge_y_id ?? null,
      currency_id: data.currency_id ?? null,
      value_currency: data.value_currency ?? null,
      days: data.days ?? null,
      constitution_date: data.constitution_date ?? null,
      expiration_date: data.expiration_date ?? null,
      compliance_date: data.compliance_date ?? null,
      rate_spot_badge_y: data.rate_spot_badge_y ?? null,
      strike_badge_y: data.strike_badge_y ?? null,
      spot_badge_y: data.spot_badge_y ?? null,
      forward_badge_y: data.forward_badge_y ?? null,
      fixed_agreed_rate: data.fixed_agreed_rate ?? null,
      agreed_value_badge_y: data.agreed_value_badge_y ?? null,
      status_id: data.status_id ?? 82,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IDerivativeInvestmentOperationToCreate> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }
    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
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

  const onSubmit = async () => {
    if (!(await validateForms())) return
    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createDerivativeInvestmentOperation(payload)
    if (success) {
      goToURL('DerivativeInvestmentOperationsList')
    }
    openMainLoader(false)
  }

  onMounted(() => loadResources())

  onBeforeMount(async () => {
    _resetKeys({ investment_portfolio: keys })
    _clearData()
  })

  return {
    data_information_form,
    informationFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    onSubmit,
    goToURL,
  }
}
