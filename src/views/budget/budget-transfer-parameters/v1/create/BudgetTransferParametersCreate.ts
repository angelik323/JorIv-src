//Core
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
//Interfaces
import { ITabs } from '@/interfaces/global/Tabs'
import type {
  IBudgetTransferAreaCreate,
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

const useBudgetTransferParametersCreate = () => {
  const { validateRouter } = useRouteValidator()
  const { _createBudgetTransfer } = useBudgetTransferStore('v1')
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const goBack = () => {
    goToURL('BudgetTransferParametersList')
  }

  const business_data_ref = ref()
  const area_data_ref = ref()
  const sectors_data_ref = ref()

  const AREA_FIELDS = [
    'from_area_source_id',
    'to_area_source_id',
    'from_area_target_id',
    'to_area_target_id',
  ] as const
  const SECTOR_FIELDS = [
    'from_budget_item_source_id',
    'to_budget_item_source_id',
    'from_budget_item_target_id',
    'to_budget_item_target_id',
  ] as const

  const validateTab = async (
    ref:
      | {
          getFormData: () => Array<Record<string, unknown>>
          validateForm: () => Promise<boolean>
        }
      | undefined,
    fields: string[]
  ): Promise<boolean> => {
    if (!ref) return true
    const data = ref.getFormData?.() ?? []
    if (!Array.isArray(data) || data.length === 0) return true

    const rowsWithAny = data.filter((row) => fields.some((f) => row[f] != null))
    if (rowsWithAny.length === 0) return true

    const uiOk = (await ref.validateForm?.()) ?? true
    const allComplete = rowsWithAny.every((row) =>
      fields.every((f) => row[f] != null)
    )
    return uiOk && allComplete
  }

  const validateForms = async () => {
    if (tabActiveIdx.value === 0) {
      return business_data_ref.value
        ? await business_data_ref.value.validateForm()
        : true
    }
    if (tabActiveIdx.value === 1) {
      return await validateTab(
        area_data_ref.value,
        AREA_FIELDS as unknown as string[]
      )
    }
    if (tabActiveIdx.value === 2) {
      return await validateTab(
        sectors_data_ref.value,
        SECTOR_FIELDS as unknown as string[]
      )
    }
    return true
  }

  const BudgetKeys = [
    'budget_document_types_selector',
    'areas_resposabilities_codes',
    'budget_item_codes',
  ]

  const AccountingKeys = ['business_trusts_selector']

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all([
      _getResources({ budget: BudgetKeys }),
      _getResources({ accounting: AccountingKeys }, '', 'v2'),
    ])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
    _resetKeys({ accounting: AccountingKeys })
  })

  const headerProps = {
    title: 'Crear parámetro de traslado presupuestales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Parámetros de traslados presupuestales',
        route: 'BudgetTransferParametersList',
      },
      { label: 'Crear', route: 'BudgetTransferParametersCreate' },
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

  const validateAreaData = (): IBudgetTransferAreaCreate[] | null => {
    const data = area_data_ref.value?.getFormData()
    if (!data || data.length === 0) return null
    const withAny = data.filter((row: IBudgetTransferAreaCreate) =>
      AREA_FIELDS.some(
        (f) => (row as unknown as Record<string, unknown>)[f] != null
      )
    )
    if (withAny.length === 0) return null
    return withAny
  }

  const validateSectorData = (): IBudgetTransferSectorCreate[] | null => {
    const data = sectors_data_ref.value?.getFormData()
    if (!data || data.length === 0) return null
    const withAny = data.filter((row: IBudgetTransferSectorCreate) =>
      SECTOR_FIELDS.some(
        (f) => (row as unknown as Record<string, unknown>)[f] != null
      )
    )
    if (withAny.length === 0) return null
    return withAny
  }

  const onSubmit = async () => {
    const businessOk = business_data_ref.value
      ? await business_data_ref.value.validateForm()
      : true
    const areasOk = await validateTab(
      area_data_ref.value,
      AREA_FIELDS as unknown as string[]
    )
    const sectorsOk = await validateTab(
      sectors_data_ref.value,
      SECTOR_FIELDS as unknown as string[]
    )

    if (!(businessOk && areasOk && sectorsOk)) return

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

    const success = await _createBudgetTransfer(payload)
    if (success) {
      goToURL('BudgetTransferParametersList')
    }

    openMainLoader(false)
  }

  const documentType = ref<number | string | null>(null)
  const handleDocumentType = (id: number | string | null) => {
    documentType.value = id
  }

  return {
    headerProps,
    tabs,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    business_data_ref,
    area_data_ref,
    sectors_data_ref,
    documentType,
    handleDocumentType,
    validateRouter,
    onSubmit,
    nextTab,
    backTab,
    goBack,
  }
}

export default useBudgetTransferParametersCreate
