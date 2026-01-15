// Vue - pinia - moment
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetAccountingHomologationParametersStore } from '@/stores/budget/budget-accounting-homologation-parameters'

const useBudgetAccountingHomologationParametersEdit = () => {
  const { _updateBudgetAccountingAction, _getBudgetAccountingParameterById } =
    useBudgetAccountingHomologationParametersStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const parameterId = route.params.id

  const headerProps = {
    title: 'Editar parámetros homologación presupuesto a contabilidad',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Parámetros homologación contabilidad vs presupuesto',
        route: 'BudgetAccountingHomologationParametersList',
      },
      { label: 'Editar', route: 'BudgetAccountingHomologationParametersEdit' },
      { label: String(parameterId) },
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
  ]

  const tabActive = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

  const basicDataFormRef = ref()

  const onSubmit = async () => {
    if (!(await basicDataFormRef.value.validateForm())) return

    openMainLoader(true)

    const payload = {
      ...basicDataFormRef.value.getFormData(),
    }

    for (const key in payload) {
      if (key.includes('_description')) {
        delete payload[key]
      }
    }

    const parameterResponse = await _updateBudgetAccountingAction(
      Number(parameterId),
      payload
    )

    if (parameterResponse) {
      goToURL('BudgetAccountingHomologationParametersList')
    }

    openMainLoader(false)
  }

  const parameterData = ref()

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
      (parameterData.value = await _getBudgetAccountingParameterById(
        Number(parameterId)
      )),
    ]).finally(() => {
      openMainLoader(false)
    })
  })

  return {
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    parameterData,
    goToURL,
    onSubmit,
  }
}

export default useBudgetAccountingHomologationParametersEdit
