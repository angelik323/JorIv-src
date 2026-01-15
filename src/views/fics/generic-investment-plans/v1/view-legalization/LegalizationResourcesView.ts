// Vue - Pinia - Router
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITableProps } from '@/interfaces/customs/DataTable'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { ITabs } from '@/interfaces/global'
import {
  IGenericInvestmentPlansLegalizeResponse,
  IGenericInvestmentPlansLegalizationExportDetails,
} from '@/interfaces/customs/fics/GenericInvestmentPlans'

// Composables
import {
  useUtils,
  useAlert,
  useGoToUrl,
  useMainLoader,
  useCalendarRules,
} from '@/composables'

// Stores
import { useGenericInvestmentPlansStore } from '@/stores/fics/generic-investment-plans'

const useLegalizationResourcesView = () => {
  const { only_until, only_after } = useCalendarRules()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, formatCurrencyString } = useUtils()
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const route = useRoute()

  const {
    _showGenericPlanById,
    _downloadLegalizationList,
    _listGenericPlanLegalizationExport,
    _clearGenericPlanLegalizationsExport,
  } = useGenericInvestmentPlansStore('v1')

  const {
    generic_investment_plan_legalization_export_list,
    generic_investment_plan_legalization_export_pages,
  } = storeToRefs(useGenericInvestmentPlansStore('v1'))

  const genericInvestmentPlan =
    ref<IGenericInvestmentPlansLegalizeResponse | null>(null)
  const filtersFormat = ref<Record<string, string | number>>({})
  const isLoadingGenericInvestmentPlan = ref<boolean>(true)

  const genericInvestmentPlanId = +route.params.id

  const headerProps = {
    title: 'Consulta de legalización de recursos genérico',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Planes de inversión genéricos',
        route: 'GenericInvestmentPlansList',
      },
      {
        label: 'Consulta legalización de recursos',
        route: 'GenericInvestmentPlansLegalizeView',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const filterConfig = ref<IFieldFilters[]>([
    {
      type: 'q-date',
      name: 'start_date',
      label: 'Desde fecha',
      value: null,
      class: 'col-12 col-md-6',
      placeholder: 'AAAA-MM-DD',
      disable: false,
      clean_value: true,
    },

    {
      type: 'q-date',
      name: 'end_date',
      label: 'Hasta fecha',
      value: null,
      class: 'col-12 col-md-6',
      placeholder: 'AAAA-MM-DD',
      disable: false,
      clean_value: true,
    },
  ])

  const tableProps = ref<
    ITableProps<IGenericInvestmentPlansLegalizationExportDetails>
  >({
    title: 'Detalle traslado de plan genérico',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'transfer_number',
        label: 'Número de traslado',
        field: 'transfer_number',
        align: 'left',
        sortable: true,
      },
      {
        name: 'origin_fund',
        label: 'Descripción fondo',
        field: () =>
          `${genericInvestmentPlan.value?.collective_investment_fund?.code} - ${genericInvestmentPlan.value?.collective_investment_fund?.name}` ||
          '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'generic_investment_plan',
        label: 'Plan de inversión genérico',
        field: () =>
          genericInvestmentPlan.value?.fiduciary_investment_plan?.code || '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'value',
        label: 'Valor del traslado',
        field: 'value',
        align: 'left',
        sortable: true,
        format: (val) =>
          formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'capital',
        label: 'Capital traslado',
        field: 'capital',
        align: 'left',
        sortable: true,
        format: (val) =>
          formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'returns',
        label: 'Rendimientos trasladados',
        field: 'returns',
        align: 'left',
        sortable: true,
        format: (val) =>
          formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'transfer_date',
        label: 'Fecha de traslado',
        field: 'transfer_date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'destination_fund',
        label: 'Fondo destino',
        field: 'destination_fund',
        align: 'left',
        sortable: true,
      },
      {
        name: 'destination_investment_plan',
        label: 'Plan destino',
        field: 'destination_investment_plan',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const activeTab = tabs[0].name
  const activeTabIdx = 0

  const handleGoToList = () =>
    goToURL('GenericInvestmentPlansList', undefined, { reload: 'true' })

  const loadGenericInvestmentPlanData = async () => {
    isLoadingGenericInvestmentPlan.value = true
    genericInvestmentPlan.value = await _showGenericPlanById(
      String(genericInvestmentPlanId)
    )
    isLoadingGenericInvestmentPlan.value = true
  }

  const loadLegalizationsTableData = async (
    filters: Record<string, string | number>
  ) => {
    tableProps.value.loading = true
    await _listGenericPlanLegalizationExport(genericInvestmentPlanId, filters)
    tableProps.value.loading = false
  }

  const validateFilters = (
    filters: Record<string, string | number | undefined>
  ): boolean => {
    const { 'filter[start_date]': start_date, 'filter[end_date]': end_date } =
      filters

    if (start_date === undefined || end_date === undefined) return true

    if (typeof start_date !== 'string' || typeof end_date !== 'string') {
      return false
    }

    const isStartBeforeEnd = only_until(end_date)(start_date)
    const isEndAfterStart = only_after(start_date)(end_date)

    if (!isStartBeforeEnd) {
      showAlert(
        'La fecha indicada en el campo "Desde fecha" no puede ser posterior a la fecha indicada en el campo "Hasta fecha"',
        'error'
      )
      return false
    }

    if (!isEndAfterStart) {
      showAlert(
        'La fecha indicada en el campo "Hasta fecha" no puede ser anterior a la fecha indicada en el campo "Desde fecha"',
        'error'
      )
      return false
    }

    return true
  }

  const handleFilter = async (filters: Record<string, string | number>) => {
    if (!validateFilters(filters)) return

    filtersFormat.value = {
      ...filtersFormat.value,
      ...filters,
    }
    loadLegalizationsTableData(filtersFormat.value)
  }

  const handleClearFilter = () => _clearGenericPlanLegalizationsExport()

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
    }

    await loadLegalizationsTableData(filtersFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1,
      rows,
    }

    await loadLegalizationsTableData(filtersFormat.value)
  }

  const handleDownload = async () => {
    await _downloadLegalizationList(
      genericInvestmentPlanId,
      filtersFormat.value
    )
  }

  onMounted(async () => {
    openMainLoader(true)
    await loadGenericInvestmentPlanData()
    openMainLoader(false)
  })

  onBeforeUnmount(() => _clearGenericPlanLegalizationsExport())

  watch(
    generic_investment_plan_legalization_export_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } =
        generic_investment_plan_legalization_export_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    tabs,
    activeTab,
    tableProps,
    headerProps,
    activeTabIdx,
    filterConfig,
    handleFilter,
    handleGoToList,
    handleDownload,
    handleUpdatePage,
    handleClearFilter,
    genericInvestmentPlan,
    handleUpdateRowsPerPage,
  }
}

export default useLegalizationResourcesView
