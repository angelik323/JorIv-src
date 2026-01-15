// Vue - pinia - moment
import { ref, onMounted } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetAccountingHomologationParametersStore } from '@/stores/budget/budget-accounting-homologation-parameters'

const useAccountingBudgetHomologationParametersCreate = () => {
  const { _createAccountingBudgetAction } =
    useBudgetAccountingHomologationParametersStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const headerProps = {
    title: 'Crear parámetros homologación contabilidad a presupuesto',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Parámetros homologación contabilidad vs presupuesto',
        route: 'BudgetAccountingHomologationParametersList',
      },
      { label: 'Crear', route: 'AccountingBudgetHomologationParametersCreate' },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'budget_data',
      label: 'Datos presupuestales',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

  const basicDataFormRef = ref()
  const budgetDataFormRef = ref()

  const validateForms = async () => {
    const forms = [basicDataFormRef, budgetDataFormRef]
    if (forms.length && forms[tabActiveIdx.value]) {
      return forms[tabActiveIdx.value].value.validateForm()
    }
    return false
  }

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = 1
    tabActive.value = tabs[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = {
      ...basicDataFormRef.value.getFormData(),
      ...budgetDataFormRef.value.getFormData(),
    }

    for (const key in payload) {
      if (key.includes('_description')) {
        delete payload[key]
      }
    }

    const parameterResponse = await _createAccountingBudgetAction(payload)

    if (parameterResponse) {
      goToURL('BudgetAccountingHomologationParametersList')
    }

    openMainLoader(false)
  }

  onMounted(async () => {
    openMainLoader(true)
    _resetKeys({
      budget: [
        'budget_resource_codes',
        'areas_resposabilities_codes',
        'budget_document_types',
        'budget_item_codes',
        'code_movements',
      ],
      accounting: [
        'business_trusts_selector',
        'cost_center',
        'receipt_types',
        'third_parties',
      ],
      treasury: ['treasury_movement_codes'],
    })
    Promise.all([
      _getResources({ accounting: ['business_trusts_selector'] }, '', 'v2'),
      _getResources({ accounting: ['cost_center', 'receipt_types'] }),
      _getResources({ accounting: ['third_parties'] }),
      _getResources({ treasury: ['treasury_movement_codes'] }),
      _getResources({
        budget: [
          'budget_resource_codes',
          'areas_resposabilities_codes',
          'budget_document_types',
          'budget_item_codes',
          'code_movements',
        ],
      }),
    ]).finally(() => {
      openMainLoader(false)
    })
  })

  const previousTab = () => {
    tabActiveIdx.value = 0
    tabActive.value = tabs[tabActiveIdx.value].name
  }

  return {
    basicDataFormRef,
    budgetDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    goToURL,
    nextTab,
    onSubmit,
    previousTab,
  }
}

export default useAccountingBudgetHomologationParametersCreate
