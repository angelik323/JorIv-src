//Core
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
//Interfaces
import { ITabs } from '@/interfaces/global/Tabs'
import type {
  IBudgetTransferAreaCreate,
  IBudgetTransferBusinessCreate,
  IBudgetTransferSectorCreate,
} from '@/interfaces/customs/budget/BudgetTransferParameter'
//Composables
import {
  useMainLoader,
  useUtils,
  useGoToUrl,
  useRouteValidator,
} from '@/composables'
//Stores
import { useBudgetTransferStore } from '@/stores/budget/budget-transfer-parameters'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBudgetTransferParametersEdit = () => {
  const { validateRouter } = useRouteValidator()
  const route = useRoute()
  const routeId = Number(route.params.id)
  const { _updateBudgetTransfer, _getBudgetTransferById, _cleanData } =
    useBudgetTransferStore('v1')
  const { budget_transfer } = storeToRefs(useBudgetTransferStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const goBack = () => {
    goToURL('BudgetTransferParametersList')
  }

  const business_data_ref = ref()
  const area_data_ref = ref()
  const sectors_data_ref = ref()

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

  const validateForms = async () => {
    if (tabActiveIdx.value === 0 && business_data_ref.value) {
      return await business_data_ref.value.validateForm()
    }
    return true
  }

  const BUDGET_KEYS = [
    'budget_document_types_selector',
    'areas_resposabilities_codes',
    'budget_item_codes',
  ]

  const ACCOUNTING_KEYS = ['business_trusts_selector']

  const headerProps = {
    title: 'Editar parámetro de traslado presupuestales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Parámetros de traslados presupuestales',
        route: 'BudgetTransferParametersList',
      },
      { label: 'Editar', route: 'BudgetTransferParametersEdit' },
      { label: `${routeId}` },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'businesses',
      label: 'Traslado entre negocios',
      icon: defaultIconsLucide.chartLine,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'areas',
      label: 'Traslado entre áreas',
      icon: defaultIconsLucide.user,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'sectors',
      label: 'Traslado entre sectores',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref('businesses')
  const tabActiveIdx = ref(0)

  const business_data_form = ref<IBudgetTransferBusinessCreate | null>(null)

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

  const navigateTab = (direction: 'next' | 'prev') => {
    const newIndex =
      direction === 'next' ? tabActiveIdx.value + 1 : tabActiveIdx.value - 1
    if (newIndex >= 0 && newIndex < filteredTabs.value.length) {
      tabActiveIdx.value = newIndex
      tabActive.value = filteredTabs.value[newIndex].name
    }
  }

  const nextTab = async () => {
    if (!(await validateForms())) return
    navigateTab('next')
  }

  const backTab = () => {
    navigateTab('prev')
  }

  const validateAreaData = () => {
    const data = area_data_ref.value?.getFormData()
    if (!data || data.length === 0) return null
    const hasValidData = data.some(
      (row: {
        from_area_source_id: number | null
        to_area_source_id: number | null
        from_area_target_id: number | null
        to_area_target_id: number | null
      }) =>
        row.from_area_source_id != null ||
        row.to_area_source_id != null ||
        row.from_area_target_id != null ||
        row.to_area_target_id != null
    )
    return hasValidData ? data : null
  }

  const validateSectorData = () => {
    const data = sectors_data_ref.value?.getFormData()
    if (!data || data.length === 0) return null
    const hasValidData = data.some(
      (row: IBudgetTransferSectorCreate) =>
        row.from_budget_item_source_id != null ||
        row.to_budget_item_source_id != null ||
        row.from_budget_item_target_id != null ||
        row.to_budget_item_target_id != null
    )
    return hasValidData ? data : null
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const business = business_data_ref.value?.getFormData()

    const payload = {
      budget_document_type_id: business.budget_document_type_id,
      from_business_source_id: business.from_business_source_id,
      to_business_source_id: business.to_business_source_id,
      from_business_target_id: business.from_business_target_id,
      to_business_target_id: business.to_business_target_id,
      one_to_one: business.one_to_one ? 1 : 0,
      area_transfer_parameters: validateAreaData(),
      budget_item_transfer_parameters: validateSectorData(),
    }

    const success = await _updateBudgetTransfer(routeId, payload)
    if (success) {
      goToURL('BudgetTransferParametersList')
    }

    openMainLoader(false)
  }

  return {
    budget_transfer,
    headerProps,
    tabs,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    business_form_data,
    area_form_data,
    sector_form_data,
    business_data_ref,
    area_data_ref,
    sectors_data_ref,
    business_data_form,
    defaultIconsLucide,
    validateRouter,
    onSubmit,
    nextTab,
    backTab,
    goBack,
  }
}

export default useBudgetTransferParametersEdit
