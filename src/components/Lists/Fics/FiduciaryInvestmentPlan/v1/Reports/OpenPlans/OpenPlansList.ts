// Vue - Pinia
import { ref, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IIFicFiduciaryInvestmentPlansOpenPlansItemsList } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'

// Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'

// Composables
import { useGoToUrl, useRules, useUtils } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useOpenPlansList = () => {
  const { funds } = useFicResourceStore('v1')

  const {
    _listOpenFiduciaryInvestmentPlans,
    _exportOpenFiduciaryInvestmentPlans,
    _clearData,
  } = useFiduciaryInvestmentPlanStore('v1')

  const {
    open_fiduciary_investment_plans_list,
    open_fiduciary_investment_plans_pages,
  } = storeToRefs(useFiduciaryInvestmentPlanStore('v1'))

  const { goToURL } = useGoToUrl()
  const { formatCurrencyString } = useUtils()
  const { date_before_or_equal_to_the_current_date, is_after_or_equal_today } =
    useRules()

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
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      display_value: 'fund_code',
      autocomplete: true,
    },
    {
      type: 'q-date',
      name: 'start_fund_closing_date',
      label: 'Fecha cierre',
      value: null,
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      type: 'q-date',
      name: 'start_date',
      label: 'Fecha inicial',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: '-',
      rules: [
        (val: string | null) =>
          !val || date_before_or_equal_to_the_current_date(val),
      ],
    },
    {
      type: 'q-select',
      name: 'end_fund',
      label: 'Hasta fondo',
      options: funds,
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      display_value: 'fund_code',
      autocomplete: true,
    },
    {
      type: 'q-date',
      name: 'end_fund_closing_date',
      label: 'Fecha cierre',
      value: null,
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      type: 'q-date',
      name: 'end_date',
      label: 'Fecha final',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: '-',
      rules: [
        (val: string | null) =>
          !val ||
          is_after_or_equal_today(
            val,
            'La fecha debe ser superior o igual a la fecha actual'
          ),
      ],
    },
  ])

  const openPlansTableProps = ref<
    IBaseTableProps<IIFicFiduciaryInvestmentPlansOpenPlansItemsList>
  >({
    title: 'Listado de apertura planes de inversión',
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
        name: 'fund_description',
        label: 'Descripción fondo',
        field: 'fund_description',
        align: 'left',
        sortable: true,
      },
      {
        name: 'plan_code',
        label: 'Plan de inversión',
        field: 'plan_code',
        align: 'left',
        sortable: true,
      },
      {
        name: 'holder_identification',
        label: 'Identificación titular',
        field: 'holder_identification',
        align: 'left',
        sortable: true,
      },
      {
        name: 'opening_date',
        label: 'Fecha de apertura',
        field: 'opening_date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'opening_value',
        label: 'Valor de apertura',
        align: 'left',
        sortable: true,
        field: (item) => formatCurrencyString(item.opening_value || 0),
      },
      {
        name: 'created_by',
        label: 'Usuario que realiza apertura',
        field: 'created_by',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const updateStartFundFilterFields = (startFundId: number) => {
    const fund = funds.find((f) => f.id === startFundId)
    if (!fund || !filterRef.value) return

    filterRef.value.setFieldValueByName(
      'start_fund_closing_date',
      fund.last_closing_date ?? '-'
    )
  }

  const updateEndFundFilterFields = (endFundId: number) => {
    const fund = funds.find((f) => f.id === endFundId)
    if (!fund || !filterRef.value) return

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

  const loadOpenPlansTableData = async (
    filters: Record<string, string | number>
  ) => {
    openPlansTableProps.value.rows = []
    openPlansTableProps.value.loading = true
    await _listOpenFiduciaryInvestmentPlans(filters)
    openPlansTableProps.value.loading = false
  }

  const handleFilter = async (filters: Record<string, string | number>) => {
    const {
      'filter[end_fund_closing_date]': _end_fund_closing_date,
      'filter[start_fund_closing_date]': _start_fund_closing_date,
      ...rest
    } = filters

    filterFormat.value = {
      ...rest,
      page: 1,
      rows: filterFormat.value.rows,
    }

    await loadOpenPlansTableData(filterFormat.value)
  }

  const handleClearFilter = () => {
    openPlansTableProps.value.rows = []
    _clearData()
  }

  const handleUpdatePage = async (page: number) => {
    filterFormat.value.page = page

    await loadOpenPlansTableData(filterFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filterFormat.value.page = 1
    filterFormat.value.rows = rows

    await loadOpenPlansTableData(filterFormat.value)
  }

  const handleDownload = async () => {
    await _exportOpenFiduciaryInvestmentPlans(filterFormat.value)
  }

  onBeforeMount(() => {
    _clearData()
  })

  watch(
    open_fiduciary_investment_plans_list,
    (list) => {
      openPlansTableProps.value.rows = list
    },
    { immediate: true }
  )

  watch(
    open_fiduciary_investment_plans_pages,
    (pages) => {
      openPlansTableProps.value.pages = pages
    },
    { immediate: true }
  )

  return {
    goToURL,

    filterRef,
    filterConfig,
    openPlansTableProps,

    handleChangeFilters,
    handleFilter,
    handleClearFilter,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    handleDownload,
  }
}

export default useOpenPlansList
