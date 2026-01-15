//Core
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
//Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'
//Interfaces
import {
  IBudgetTransferAreaCreate,
  IBudgetTransferBusinessCreate,
  IBudgetTransferSectorCreate,
} from '@/interfaces/customs/budget/BudgetTransferParameter'
import { ITabs } from '@/interfaces/global/Tabs'
//Stores
import { useBudgetTransferStore } from '@/stores/budget/budget-transfer-parameters'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBudgetTransferParametersView = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const routeId = Number(route.params.id)

  const { _getBudgetTransferById, _cleanData } = useBudgetTransferStore('v1')
  const { budget_transfer } = storeToRefs(useBudgetTransferStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()

  const budgetBusinessesForm = ref()
  const budgetAreasForm = ref()
  const budgetSectorsForm = ref()

  const business_form_data = computed<IBudgetTransferBusinessCreate | null>(
    () => {
      const b = budget_transfer.value?.business
      if (!b) return null
      return {
        budget_document_type_id: b.budget_document_type_id ?? null,
        code: b.code ?? null,
        document_type: b.document_type ?? undefined,
        from_business_source_id: b.from_business_source?.id ?? null,
        to_business_source_id: b.to_business_source?.id ?? null,
        from_business_target_id: b.from_business_target?.id ?? null,
        to_business_target_id: b.to_business_target?.id ?? null,
        one_to_one:
          b.one_to_one === null || b.one_to_one === undefined
            ? null
            : Boolean(b.one_to_one),
        from_business_source_description:
          b.from_business_source?.name ?? undefined,
        to_business_source_description: b.to_business_source?.name ?? undefined,
        from_business_target_description:
          b.from_business_target?.name ?? undefined,
        to_business_target_description: b.to_business_target?.name ?? undefined,
      }
    }
  )

  const area_form_data = computed<IBudgetTransferAreaCreate[] | null>(() => {
    const items = budget_transfer.value?.area_transfer_parameters || []
    if (!items.length) return null
    return items.map((item) => ({
      id: item.id ?? null,
      from_area_source_id: item.from_area_source_id ?? null,
      to_area_source_id: item.to_area_source_id ?? null,
      from_area_target_id: item.from_area_target_id ?? null,
      to_area_target_id: item.to_area_target_id ?? null,
    }))
  })

  const sector_form_data = computed<IBudgetTransferSectorCreate[] | null>(
    () => {
      const items = budget_transfer.value?.budget_item_transfer_parameters || []
      if (!items.length) return null
      return items.map((item) => ({
        id: item.id ?? null,
        from_budget_item_source_id: item.from_budget_item_source_id ?? null,
        to_budget_item_source_id: item.to_budget_item_source_id ?? null,
        from_budget_item_target_id: item.from_budget_item_target_id ?? null,
        to_budget_item_target_id: item.to_budget_item_target_id ?? null,
      }))
    }
  )

  const goBack = () => {
    goToURL('BudgetTransferParametersList')
  }

  const headerProps = {
    title: 'Ver parámetros de traslados presupuestales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Parámetros de traslados presupuestales',
        route: 'BudgetTransferParametersList',
      },
      { label: 'Ver', route: 'BudgetTransferParametersView' },
      { label: `${routeId}` },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'businesses',
      label: 'Traslado entre negocios',
      icon: defaultIconsLucide.chartLine,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'areas',
      label: 'Traslado entre áreas',
      icon: defaultIconsLucide.user,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'sectors',
      label: 'Traslado entre sectores',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const BUDGET_KEYS = [
    'budget_document_types_selector',
    'areas_resposabilities_codes',
    'budget_item_codes',
  ]

  const ACCOUNTING_KEYS = ['business_trusts_selector']

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0]?.name ?? 'businesses')
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  onMounted(async () => {
    _cleanData()
    openMainLoader(true)
    await Promise.all([
      _getResources({ budget: BUDGET_KEYS }),
      _getResources({ accounting: ACCOUNTING_KEYS }, '', 'v2'),
      _getBudgetTransferById(routeId),
    ])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BUDGET_KEYS })
    _resetKeys({ accounting: ACCOUNTING_KEYS })
    _cleanData()
  })

  const nextTab = () => {
    if (tabActiveIdx.value < tabs.value.length - 1) {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }
  }

  const backTab = () => {
    if (tabActiveIdx.value > 0) {
      tabActiveIdx.value = tabActiveIdx.value - 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }
  }

  return {
    budget_transfer,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    headerProps,
    business_form_data,
    area_form_data,
    sector_form_data,
    budgetBusinessesForm,
    budgetAreasForm,
    budgetSectorsForm,
    defaultIconsLucide,
    tabs,
    nextTab,
    backTab,
    goBack,
  }
}

export default useBudgetTransferParametersView
