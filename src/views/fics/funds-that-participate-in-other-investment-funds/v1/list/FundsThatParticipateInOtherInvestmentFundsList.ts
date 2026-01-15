// Vue - Pinia - Quasar - Moment
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IFundsThatParticipateInOtherInvestmentFundsList,
  IFundsThatParticipateInOtherInvestmentMovementsList,
  IFundsThatParticipateInOtherInvestmentMovementsPayload,
} from '@/interfaces/customs/fics/FundsThatParticipateInOtherInvestmentFunds'

// Composables
import { useUtils, useAlert } from '@/composables'

// Stores
import { useFundsThatParticipateInOtherInvestmentFundsStoreV1 } from '@/stores/fics/funds-that-participate-in-other-investment-funds/funds-that-participate-in-other-investment-funds-v1'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useFundsThatParticipateInOtherInvestmentFundsList = () => {
  const { showAlert } = useAlert()
  const { defaultIconsLucide, formatCurrency, formatDate } = useUtils()

  const {
    _getFundsThatParticipateInOtherInvestmentFundsList,
    _getFundsThatParticipateInOtherInvestmentFundsMovementsList,
    _downloadExcelFundsThatParticipateInOtherInvestmentFundsMovements,
  } = useFundsThatParticipateInOtherInvestmentFundsStoreV1()
  const {
    fund_origin_info,
    funds_that_participate_in_other_investment_funds_list,
    funds_that_participate_in_other_investment_funds_pages,
    funds_that_participate_in_other_investment_funds_movements_list,
    funds_that_participate_in_other_investment_funds_movements_pages,
  } = storeToRefs(useFundsThatParticipateInOtherInvestmentFundsStoreV1())
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { funds } = storeToRefs(useFicResourceStore('v1'))

  const filtersFormatMovement = ref<Record<string, string | number>>({})
  const filtersFormat = ref<Record<string, string | number>>({})
  const selectedId = ref<number | null>(null)
  const selectedFundLabel = ref('')
  const filterDateFromValue = ref()
  const perPageMovement = ref(20)
  const filterToDateValue = ref()
  const selectedFundId = ref()
  const showState = ref(0)

  const perPage = ref(20)

  const headerProperties = {
    title: 'Fondos que participan en otros fondos de inversión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Fondos que participan en otros fondos de inversión',
        route: 'FundsThatParticipateInOtherInvestmentFundsList',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'InformationForm',
      label: 'Datos básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'origin_background_fund_id',
      label: 'Fondo de origen',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-12',
      options: funds,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
  ])

  const filterMovement = ref<IFieldFilters[]>([
    {
      name: 'date_from',
      label: 'Desde',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM-DD',
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'to_date',
      label: 'Hasta',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM-DD',
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
  ])

  const tableProps = ref<
    IBaseTableProps<IFundsThatParticipateInOtherInvestmentFundsList>
  >({
    title: 'Fondos con participación en otros Fics',
    loading: false,
    columns: [
      {
        name: 'select',
        required: false,
        label: '',
        align: 'left',
        field: 'id',
        sortable: false,
      },
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: false,
      },
      {
        name: 'collective_investment_fund_code',
        required: false,
        label: 'Fondo de destino',
        align: 'left',
        field: (row: IFundsThatParticipateInOtherInvestmentFundsList) =>
          `${row.collective_investment_fund.fund_code} - ${row.collective_investment_fund.fund_name}`,
        sortable: false,
      },
      {
        name: 'code',
        required: false,
        label: 'Plan de inversión',
        align: 'left',
        field: 'code',
        sortable: false,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const tableMovementProps = ref<
    IBaseTableProps<IFundsThatParticipateInOtherInvestmentMovementsList>
  >({
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: false,
      },
      {
        name: 'fund_code',
        required: false,
        label: 'Fondo de destino',
        align: 'left',
        field: (row: IFundsThatParticipateInOtherInvestmentMovementsList) =>
          `${row.fund.fund_code} - ${row.fund.fund_name}`,
        sortable: false,
      },
      {
        name: 'operation_date',
        required: false,
        label: 'Fecha de operación',
        align: 'left',
        field: (row: IFundsThatParticipateInOtherInvestmentMovementsList) =>
          row?.operation_date
            ? formatDate(row.operation_date, 'YYYY-MM-DD')
            : '',
        sortable: false,
      },
      {
        name: 'inversión_plan_code',
        required: false,
        label: 'Plan de inversión',
        align: 'left',
        field: (row: IFundsThatParticipateInOtherInvestmentMovementsList) =>
          `${row.plan.code}`,
        sortable: false,
      },
      {
        name: 'plan_balance',
        required: false,
        label: 'Saldo plan de inversión',
        align: 'left',
        field: (row: IFundsThatParticipateInOtherInvestmentMovementsList) =>
          formatCurrency(row.plan.plan_balance) ?? '-',
        sortable: false,
      },
      {
        name: 'value',
        required: false,
        label: 'Comisión cobrada',
        align: 'left',
        field: (row: IFundsThatParticipateInOtherInvestmentMovementsList) =>
          formatCurrency(row.value) ?? '-',
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const activeTab = tabs[0].name
  const tabActiveIdx = 0

  const selectPlan = (val: number) => {
    selectedId.value = val
    filtersFormatMovement.value = {}
    filterDateFromValue.value = null
    filterToDateValue.value = null

    for (const filter of filterMovement.value) filter.value = null

    listActionMovement(filtersFormatMovement.value)
    handleClearMovements()
  }

  const handleFilter = async ($filter: {
    'filter[origin_background_fund_id]': number
  }) => {
    selectedFundId.value = null
    if ($filter['filter[origin_background_fund_id]']) {
      selectedFundId.value = $filter['filter[origin_background_fund_id]']
      filtersFormat.value = {}
      await listAction(
        $filter['filter[origin_background_fund_id]'],
        filtersFormat.value
      )
      selectedFundLabel.value =
        funds.value.find(
          (fund) => fund.id === $filter['filter[origin_background_fund_id]']
        )?.label ?? ''
      showState.value = 1
    }
  }

  const handleClear = () => (tableProps.value.rows = [])

  const listAction = async (
    fund_id: number,
    params: Record<string, string | number>
  ) => {
    tableProps.value.loading = true
    await _getFundsThatParticipateInOtherInvestmentFundsList(fund_id, params)
    tableProps.value.loading = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage.value,
    }
    listAction(selectedFundId.value, filtersFormat.value)
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage.value,
    }
    listAction(selectedFundId.value, filtersFormat.value)
  }

  const listActionMovement = async (
    pagination_params: Record<string, string | number>
  ) => {
    if (
      filterDateFromValue.value &&
      filterToDateValue.value &&
      moment(filterDateFromValue.value).isAfter(filterToDateValue.value)
    ) {
      return showAlert(
        'La fecha Hasta debe ser mayor o igual a la fecha Desde',
        'error'
      )
    }

    tableMovementProps.value.loading = true
    const payload = createMovementPayload()
    await _getFundsThatParticipateInOtherInvestmentFundsMovementsList(
      payload,
      pagination_params
    )
    tableMovementProps.value.loading = false
  }

  const createMovementPayload = () => {
    return <IFundsThatParticipateInOtherInvestmentMovementsPayload>{
      'filter[fiduciary_investment_plan_id]': selectedId.value,
      'filter[from_date]': filterDateFromValue.value ?? null,
      'filter[to_date]': filterToDateValue.value ?? null,
      sort: '-operation_date,-id',
    }
  }
  const handleFilterMovements = async ($filter: {
    'filter[date_from]': string
    'filter[to_date]': string
  }) => {
    if (selectedId.value) {
      filterDateFromValue.value = $filter['filter[date_from]']
      filterToDateValue.value = $filter['filter[to_date]']
      listActionMovement(filtersFormatMovement.value)
    }
  }

  const handleClearMovements = () => (tableMovementProps.value.rows = [])

  const updatePageMovements = (page: number) => {
    filtersFormatMovement.value = {
      ...filtersFormatMovement.value,
      page: page,
      rows: perPageMovement.value,
    }

    listActionMovement(filtersFormatMovement.value)
  }

  const updatePerPageMovements = (rowsPerPage: number) => {
    perPageMovement.value = rowsPerPage
    filtersFormatMovement.value = {
      ...filtersFormatMovement.value,
      rows: perPageMovement.value,
    }
    listActionMovement(filtersFormatMovement.value)
  }

  const downloadAction = () => {
    const payload = createMovementPayload()
    _downloadExcelFundsThatParticipateInOtherInvestmentFundsMovements(
      payload,
      filtersFormatMovement.value
    )
  }

  onMounted(async () => await _getResources({ fics: ['funds'] }))

  onBeforeUnmount(() => _resetKeys({ fics: ['funds'] }))

  watch(
    funds_that_participate_in_other_investment_funds_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } =
        funds_that_participate_in_other_investment_funds_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(
    funds_that_participate_in_other_investment_funds_movements_list,
    (val) => {
      tableMovementProps.value.rows = [...val]

      const { currentPage, lastPage } =
        funds_that_participate_in_other_investment_funds_movements_pages.value
      tableMovementProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    tabs,
    activeTab,
    showState,
    selectedId,
    tableProps,
    updatePage,
    selectPlan,
    handleClear,
    tabActiveIdx,
    handleFilter,
    filterConfig,
    updatePerPage,
    filterMovement,
    downloadAction,
    headerProperties,
    fund_origin_info,
    selectedFundLabel,
    tableMovementProps,
    updatePageMovements,
    handleClearMovements,
    handleFilterMovements,
    updatePerPageMovements,
  }
}
