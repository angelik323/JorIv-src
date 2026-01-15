// Vue
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Interfaces
import { ReportTypes } from '@/interfaces/customs/accounting/ReportTypes'
import { ITabs } from '@/interfaces/global'
import {
  IReportModel,
  IAccountingReportForm,
  IGeneralLedgerBusinessTable,
} from '@/interfaces/customs/accounting/v2/AccountingReport'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useAccoutingReportStore } from '@/stores/accounting/accounting-report'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useConsolidatedBalanceCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _createAction } = useAccoutingReportStore(
    'v1',
    'generalLedgerV2'
  ) as ReportTypes['generalLedgerV2']

  const reportFilters = ref<IAccountingReportForm | null>(null)
  const reportModels = ref<IReportModel[]>([])
  const informationFormRef = ref()

  const filtersFormat = ref({
    page: 1,
    rows: 20,
  })

  const reportResult = ref<{
    list: IGeneralLedgerBusinessTable[]
    pages: {
      currentPage: number
      lastPage: number
    }
  }>({
    list: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const keysV1 = {
    trust_business: ['business_trust_fideico_types'],
  }

  const keysV2 = {
    accounting: [
      'reporte_third_filter_type_person',
      'account_structures',
      'business_classes',
      'unit_businesses',
      'amount_types',
    ],
  }

  const keysClean = {
    accounting: [
      'business_list_without_permissions',
      'reporte_third_filter_type_person',
      'account_structures',
      'levels_structure',
      'business_classes',
      'unit_businesses',
      'type_operators',
      'amount_types',
      'type_nature',
      'template',
    ],
    trust_business: ['business_trust_fideico_types'],
  }

  const headerProps = {
    title: 'Balance de consolidación de negocios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
      },
      {
        label: 'Reportes contables',
        route: 'AccoutingReportList',
      },
      {
        label: 'Balance de consolidación de negocios',
        route: 'ConsolidatedBalanceCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'report',
      label: 'Informe generado',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const goToNextTab = () => {
    const nextIndex = tabActiveIdx.value + 1
    const tabsList = filteredTabs.value

    if (nextIndex < tabsList.length) {
      tabActiveIdx.value = nextIndex
      tabActive.value = tabsList[nextIndex].name
    }
  }

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources(keysV1)
    await _getResources(keysV2, '', 'v2')
    await _getResources(
      { accounting: ['template'] },
      'filter[status_id]=1',
      'v2'
    )

    openMainLoader(false)
  }

  const fetchReport = async (
    overrides?: Partial<{ page: number; rows: number }>
  ) => {
    if (!reportFilters.value) return

    openMainLoader(true)

    const payload = {
      ...reportFilters.value,
      page: overrides?.page ?? filtersFormat.value.page,
      per_page: overrides?.rows ?? filtersFormat.value.rows,
    }

    const response = await _createAction(payload)

    if (response.success && response.result) {
      reportResult.value = {
        list: response.result.list,
        pages: response.result.pages,
      }

      reportModels.value = response.models ?? reportModels.value
    }

    openMainLoader(false)
  }

  const handleSubmitForm = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    const data = informationFormRef.value.getValues()

    reportFilters.value = {
      name_report: data.name_report,
      type_report: data.type_report,
      report_type_id: data.report_type_id,
      report_template_id: data.report_template_id,
      business_class: data.business_class,
      accounting_structure_id: data.accounting_structure_id,
      structure_level: data.structure_level,
      amount_type: data.amount_type,

      business_unit: data.business_unit,
      business_type_id: data.business_type_id,
      use_business_range: data.use_business_range ? 1 : 0,
      from_business_trust_code: data.from_business_trust_code,
      to_business_trust_code: data.to_business_trust_code,

      from_period_date: data.from_period_date,
      to_period_date: data.to_period_date,
      include_close_voucher: data.include_close_voucher ? 1 : 0,

      use_account_range: data.use_account_range ? 1 : 0,
      from_account_code: data.from_account_code,
      to_account_code: data.to_account_code,

      paginate: 1,
    }

    filtersFormat.value.page = 1

    await fetchReport({ page: 1 })

    if (tabActive.value !== 'report') goToNextTab()
  }

  const handleGoToList = () => goToURL('AccoutingReportList')

  onMounted(async () => await loadResources())

  onBeforeUnmount(() => _resetKeys(keysClean))

  watch(
    () => filtersFormat.value.page,
    async () => {
      if (!reportFilters.value) return

      openMainLoader(true)

      const payload = {
        ...reportFilters.value,
        page: filtersFormat.value.page,
        per_page: filtersFormat.value.rows,
      }

      const response = await _createAction(payload)

      if (response.success && response.result) {
        reportResult.value = {
          list: response.result.list,
          pages: response.result.pages,
        }
      }

      openMainLoader(false)
    }
  )

  watch(
    () => filtersFormat.value.page,
    async () => await fetchReport()
  )

  return {
    tabActive,
    headerProps,
    filteredTabs,
    tabActiveIdx,
    reportResult,
    reportModels,
    filtersFormat,
    reportFilters,
    handleGoToList,
    handleSubmitForm,
    informationFormRef,
  }
}

export default useConsolidatedBalanceCreate
