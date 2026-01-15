// Vue - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IFicMovementTable,
  IFicFundBusinessLine,
} from '@/interfaces/customs/fics/ConsultClosingProcessInvestmentFunds'

// Composables
import { useMainLoader, useRules, useUtils } from '@/composables'

// Stores
import { useConsultClosingProcessInvestmentFundsStore } from '@/stores/fics/consult-closing-process-investment-funds'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { IBaseTableProps } from '@/interfaces/global'

const useConsultClosingProcessInvestmentFundsList = () => {
  const { formatDate, formatCurrency, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()

  const { funts_to_investment_plans } = storeToRefs(useFicResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    participation_type_pages,
    participation_type_list,
    movements_pages,
    movements_list,
  } = storeToRefs(useConsultClosingProcessInvestmentFundsStore('v1'))
  const { _listAction, _listDetailAction, _exportExcelAction } =
    useConsultClosingProcessInvestmentFundsStore('v1')

  const isTableDetailEmpty = ref(true)
  const isTableEmpty = ref(true)
  const isSelected = ref(false)
  const filtersRef = ref()
  const showState = ref(0)
  const currentDate = ref('')

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const keys = {
    fics: ['funts_to_investment_plans'],
  }

  const headerProps = {
    title: 'Consulta proceso de cierre en fondo de inversión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Consulta proceso de cierre en fondo de inversión',
        route: 'ConsultClosingProcessInvestmentFundsList',
      },
    ],
  }

  const validateDate = (date: string) => {
    currentDate.value = date
  }
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'registration_date',
      label: 'Fecha de registro',
      type: 'q-date',
      value: formatDate(new Date().toISOString(), 'YYYY-MM-DD'),
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'fund_id',
      label: 'Código fondo de inversión',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: funts_to_investment_plans,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'fund_description',
      label: 'Descripción fondo',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'fund_business',
      label: 'Negocio fondo',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'close_date',
      label: 'Fecha de cierre',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      onChange: validateDate,
    },
    {
      name: 'closing_date',
      label: 'Fecha consulta*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      onChange: validateDate,
      rules: [
        (v: string) => useRules().is_required(v),
        (v: string) => {
          const closeDate = currentDate.value
          if (!closeDate) return true

          return useRules().date_less_or_equal(v, closeDate)
        },
      ],
    },
  ])

  const tableProps = ref<IBaseTableProps<IFicFundBusinessLine>>({
    title: 'Tipos de participación',
    loading: false,
    columns: [
      {
        name: 'movement_code',
        label: 'Tipo de participación',
        align: 'left',
        field: (row: IFicFundBusinessLine) =>
          `${row.business_line.code ?? '-'}`,
        required: true,
        sortable: true,
      },
      {
        name: 'movement_description',
        label: 'Descripción tipo de participación',
        align: 'left',
        field: (row: IFicFundBusinessLine) =>
          `${row.business_line.description ?? '-'}`,
        required: true,
        sortable: true,
      },
      {
        name: 'initial_balance',
        label: 'Saldo tipo de participación',
        align: 'left',
        field: (row: IFicFundBusinessLine) =>
          `${formatCurrency(row.initial_balance ?? 0)}`,
        required: true,
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const tablePropsDetail = ref<IBaseTableProps<IFicMovementTable>>({
    title: 'Detalle de movimientos proceso de cierre de fondo',
    loading: false,
    columns: [
      {
        name: 'movement_code',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: (row: IFicMovementTable) => `${row.movement.code}`,
        sortable: true,
      },
      {
        name: 'movement_description',
        required: true,
        label: 'Descripción código de movimiento',
        align: 'left',
        field: (row: IFicMovementTable) => `${row.movement.description ?? '-'}`,
        sortable: true,
      },
      {
        name: 'movement_nature',
        required: true,
        label: 'Naturaleza movimiento',
        align: 'left',
        field: (row: IFicMovementTable) =>
          `${row.movement.movement_nature_description ?? '-'}`,
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor del movimiento',
        align: 'left',
        field: (row: IFicMovementTable) => `${formatCurrency(row.value ?? 0)}`,
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources(keys)

    setTimeout(() => openMainLoader(false), 1000)
  }

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _listAction(filters)

    const hasResults = participation_type_list.value.length > 0

    showState.value = filters ? 1 : 0
    isTableEmpty.value = !hasResults
    isSelected.value = false

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleFilter = async ($filters: {
    'filter[closing_date]': string
    'filter[fund_id]': string
  }) => {
    filtersFormat.value = {
      'filter[closing_date]': $filters['filter[closing_date]'],
      'filter[fund_id]': $filters['filter[fund_id]'],
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await loadData(filtersFormat.value)
  }

  const handleClearFilters = () => {
    showState.value = 0
    isSelected.value = false
    isTableEmpty.value = true
    tableProps.value.rows = []
    currentDate.value = ''
  }

  const onChangeFilter = async (values: Record<string, string | number>) => {
    const val = values['filter[fund_id]']

    if (!val) {
      filtersRef.value.setFieldValueByName('fund_description', null)
      filtersRef.value.setFieldValueByName('fund_business', null)
      filtersRef.value.setFieldValueByName('close_date', null)
      return
    }

    const selectedFund = funts_to_investment_plans.value.find(
      (f) => f.value === val
    )
    if (!selectedFund) return

    const dateToFormat =
      selectedFund.last_closing_date || selectedFund.created_at || ''

    filtersRef.value.setFieldValueByName(
      'fund_description',
      selectedFund.fund_name || null
    )
    filtersRef.value.setFieldValueByName(
      'fund_business',
      selectedFund.business_trust
        ? `${selectedFund.business_trust.business_code} - ${selectedFund.business_trust.name}`
        : null
    )

    filtersRef.value.setFieldValueByName(
      'close_date',
      formatDate(dateToFormat, 'YYYY-MM-DD')
    )
    filtersRef.value.setFieldValueByName(
      'closing_date',
      formatDate(dateToFormat, 'YYYY-MM-DD')
    )
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page
    await loadData(filtersFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value)
  }

  const handleDownload = async () => {
    filtersFormat.value = {
      'filter[fund_id]': filtersFormat.value['filter[fund_id]'] ?? null,
      'filter[closing_date]':
        filtersFormat.value['filter[closing_date]'] ?? null,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    await _exportExcelAction(formatParamsCustom(filtersFormat.value))
  }

  const handleSelected = async (selected: IFicFundBusinessLine[] = []) => {
    if (!selected.length) return
    isSelected.value = true

    const selectedItem = selected[0]

    openMainLoader(true)
    tablePropsDetail.value.rows = []

    await _listDetailAction({
      'filter[participation_type_id]': selectedItem?.business_line?.id,
      'filter[closing_date]': filtersFormat.value['filter[closing_date]'],
    })

    const hasResults = movements_list.value.length > 0
    isTableDetailEmpty.value = !hasResults
    showState.value = filtersFormat.value ? 1 : 0

    setTimeout(() => openMainLoader(false), 1000)
  }

  onMounted(async () => await loadResources())

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    participation_type_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = participation_type_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(
    movements_list,
    (val) => {
      tablePropsDetail.value.rows = [...val]

      const { currentPage, lastPage } = movements_pages.value
      tablePropsDetail.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    showState,
    tableProps,
    filtersRef,
    isSelected,
    headerProps,
    handleFilter,
    isTableEmpty,
    filterConfig,
    onChangeFilter,
    handleDownload,
    handleSelected,
    tablePropsDetail,
    handleUpdatePage,
    isTableDetailEmpty,
    handleClearFilters,
    handleUpdateRowsPerPage,
  }
}

export default useConsultClosingProcessInvestmentFundsList
