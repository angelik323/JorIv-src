// Vue - Pinia
import { ref, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFicFiduciaryInvestmentPlansCanceledPlansItemsList } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'

// Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'

// Composables
import { useGoToUrl, useUtils } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useCanceledPlansList = () => {
  const { funds } = useFicResourceStore('v1')

  const {
    _listCanceledFiduciaryInvestmentPlans,
    _exportCanceledFiduciaryInvestmentPlans,
    _clearData,
  } = useFiduciaryInvestmentPlanStore('v1')

  const {
    canceled_fiduciary_investment_plans_list,
    canceled_fiduciary_investment_plans_pages,
  } = storeToRefs(useFiduciaryInvestmentPlanStore('v1'))

  const { goToURL } = useGoToUrl()
  const { formatCurrencyString } = useUtils()

  const filterRef = ref<InstanceType<typeof FiltersComponent> | null>(null)
  const filterFormat = ref<
    { page: number; rows: number } & Record<string, string | number>
  >({ page: 1, rows: 20 })

  const filterConfig = ref<IFieldFilters[]>([
    {
      type: 'q-select',
      name: 'start_fund',
      label: 'Desde fondo',
      options: funds,
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      display_value: 'fund_code',
      autocomplete: true,
    },
    {
      type: 'q-input',
      name: 'start_fund_description',
      label: 'Descripción fondo',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      type: 'q-input',
      name: 'start_fund_business',
      label: 'Negocio fondo',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      type: 'q-date',
      name: 'start_fund_closing_date',
      label: 'Fecha cierre',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      type: 'q-select',
      name: 'end_fund',
      label: 'Hasta fondo',
      options: funds,
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      display_value: 'fund_code',
      autocomplete: true,
    },
    {
      type: 'q-input',
      name: 'end_fund_description',
      label: 'Descripción fondo',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      type: 'q-input',
      name: 'end_fund_business',
      label: 'Negocio fondo',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      type: 'q-date',
      name: 'end_fund_closing_date',
      label: 'Fecha cierre',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
  ])

  const canceledPlansTableProps = ref<
    IBaseTableProps<IFicFiduciaryInvestmentPlansCanceledPlansItemsList>
  >({
    title: 'Detalle consulta de planes cancelados',
    loading: false,
    columns: [
      {
        name: 'fund_code',
        label: 'Código fondo',
        field: 'fund_code',
        align: 'left',
        sortable: true,
      },
      {
        name: 'plan',
        label: 'Plan de inversión',
        field: 'plan',
        align: 'left',
        sortable: true,
      },
      {
        name: 'holder',
        label: 'Titular',
        field: 'holder',
        align: 'left',
        sortable: true,
      },
      {
        name: 'cancellation_date',
        label: 'Fecha cancelación',
        field: 'cancellation_date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'cancellation_value',
        label: 'Valor a cancelar',
        align: 'left',
        sortable: true,
        field: (item) => formatCurrencyString(item.cancellation_value || 0),
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const updateStartFundFilterFields = (startFundId: number) => {
    const fund = funds.find((f) => f.id === startFundId)
    if (!fund || !filterRef.value) return

    filterRef.value.setFieldValueByName(
      'start_fund_description',
      fund.fund_name ?? '-'
    )

    filterRef.value.setFieldValueByName(
      'start_fund_business',
      fund.business_trust_id ?? '-'
    )

    filterRef.value.setFieldValueByName(
      'start_fund_closing_date',
      fund.last_closing_date ?? '-'
    )
  }

  const updateEndFundFilterFields = (endFundId: number) => {
    const fund = funds.find((f) => f.id === endFundId)
    if (!fund || !filterRef.value) return

    filterRef.value.setFieldValueByName(
      'end_fund_description',
      fund.fund_name ?? '-'
    )

    filterRef.value.setFieldValueByName(
      'end_fund_business',
      fund.business_trust_id ?? '-'
    )

    filterRef.value.setFieldValueByName(
      'end_fund_closing_date',
      fund.last_closing_date ?? '-'
    )
  }

  const handleChangeFilters = (filters: Record<string, string | number>) => {
    const {
      'filter[start_fund]': start_fund_id,
      'filter[end_fund]': end_fund_id,
    } = filters

    if (start_fund_id) updateStartFundFilterFields(Number(start_fund_id))
    if (end_fund_id) updateEndFundFilterFields(Number(end_fund_id))
  }

  const loadCanceledPlansTableData = async (
    filters: Record<string, string | number>
  ) => {
    canceledPlansTableProps.value.rows = []
    canceledPlansTableProps.value.loading = true
    await _listCanceledFiduciaryInvestmentPlans(filters)
    canceledPlansTableProps.value.loading = false
  }

  const handleFilter = async (filters: Record<string, string | number>) => {
    filterFormat.value = {
      'filter[start_fund]': filters['filter[start_fund]'],
      'filter[end_fund]': filters['filter[end_fund]'],
      page: 1,
      rows: filterFormat.value.rows,
    }

    await loadCanceledPlansTableData(filterFormat.value)
  }

  const handleClearFilter = () => {
    canceledPlansTableProps.value.rows = []
  }

  const handleUpdatePage = async (page: number) => {
    filterFormat.value.page = page
    await loadCanceledPlansTableData(filterFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filterFormat.value.page = 1
    filterFormat.value.rows = rows

    await loadCanceledPlansTableData(filterFormat.value)
  }

  const handleDownload = async () => {
    await _exportCanceledFiduciaryInvestmentPlans(filterFormat.value)
  }

  onBeforeMount(() => {
    _clearData()
  })

  watch(
    canceled_fiduciary_investment_plans_list,
    (list) => {
      canceledPlansTableProps.value.rows = list
    },
    { immediate: true }
  )

  watch(
    canceled_fiduciary_investment_plans_pages,
    (pages) => {
      canceledPlansTableProps.value.pages = pages
    },
    { immediate: true }
  )

  return {
    goToURL,

    filterRef,
    filterConfig,
    canceledPlansTableProps,

    handleChangeFilters,
    handleFilter,
    handleClearFilter,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    handleDownload,
  }
}

export default useCanceledPlansList
