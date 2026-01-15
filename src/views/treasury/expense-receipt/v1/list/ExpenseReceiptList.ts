// Utils & vue & quasar
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
// Composables
import {
  useCalendarRules,
  useMainLoader,
  useRules,
  useUtils,
} from '@/composables'
// Interfaces
import { IFieldFilters, IExpenseReceiptResponse } from '@/interfaces/customs'
// Stores
import {
  useAccountingResourceStore,
  useExpenseReceiptStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import moment from 'moment'

const useExpenseReceiptList = () => {
  const { _getExpenseReceiptList, _getExpenseReceiptExportById } =
    useExpenseReceiptStore('v1')
  const { expenseReceiptList, expenseReceiptPages } = storeToRefs(
    useExpenseReceiptStore('v1')
  )
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const keys = ['business_trusts_egreso', 'record_expenses', 'receipt_type']
  const key = ['receipt_types']
  const {
    business_trusts_egreso: businessTrustSelect,
    record_expenses: recordExpensesSelect,
    receipt_type_with_code: receiptTypeSelect,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { receipt_types: receiptTypesSelect } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const hideFilters = ref<boolean>(true)
  const filtersFormat = ref<Record<string, string | number>>({})
  const filtersRef = ref()
  const headerProps = {
    title: 'Comprobante de egresos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Comprobantes de egresos',
        route: 'ExpenseReceiptList',
      },
    ],
  }
  const tableProps = ref({
    title: 'Listado de comprobantes de egresos',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'from_business_id',
        required: false,
        label: 'Desde negocio',
        align: 'left',
        field: (row) =>
          `${row.from_business?.code ?? ''} - ${row.from_business?.name ?? ''}`,
        sortable: true,
      },
      {
        name: 'up_business_id',
        required: false,
        label: 'Hasta negocio',
        align: 'left',
        field: (row) =>
          `${row.up_business?.code ?? ''} - ${row.up_business?.name ?? ''}`,

        sortable: true,
      },
      {
        name: 'starting_date',
        required: false,
        label: 'Fecha inicial',
        align: 'left',
        field: 'starting_date',
        sortable: true,
      },
      {
        name: 'end_date',
        required: false,
        label: 'Fecha final',
        align: 'left',
        field: 'end_date',
        sortable: true,
      },
      {
        name: 'from_voucher_id',
        required: false,
        label: 'Desde comprobante',
        align: 'left',
        field: (row) =>
          `${row.from_voucher?.code ?? ''} - ${row.from_voucher?.description ?? ''}`,
        sortable: true,
      },
      {
        name: 'up_voucher_id',
        required: false,
        label: 'Hasta comprobante',
        align: 'left',
        field: (row) =>
          `${row.up_voucher?.code ?? ''} - ${row.up_voucher?.description ?? ''}`,
        sortable: true,
      },
      {
        name: 'from_expense_number_id',
        required: false,
        label: 'Desde número egreso',
        align: 'left',
        field: 'from_expense',
        sortable: true,
      },
      {
        name: 'up_expense_number_id',
        required: false,
        label: 'Hasta número egreso',
        align: 'left',
        field: 'up_expense',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IExpenseReceiptResponse[],
    pages: {
      currentPage: 1,
      lastPage: 10,
    },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'from_business_id',
      label: 'Desde negocio*',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: businessTrustSelect,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(v: string) => useRules().is_required(v)],
    },
    {
      name: 'up_business_id',
      label: 'Hasta negocio*',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: businessTrustSelect,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(v: string) => useRules().is_required(v)],
    },
    {
      name: 'starting_date',
      label: 'Fecha inicial*',
      type: 'q-date',
      value: moment().format('YYYY-MM-DD'),
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().valid_format_date(v, 'YYYY-MM-DD'),
        (v: string) => useRules().date_before_or_equal_to_the_current_date(v),
      ],
      option_calendar: useCalendarRules().only_until(
        moment().format('YYYY-MM-DD')
      ),
    },
    {
      name: 'end_date',
      label: 'Fecha final*',
      type: 'q-date',
      value: moment().format('YYYY-MM-DD'),
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().valid_format_date(v, 'YYYY-MM-DD'),
        (v: string) => useRules().date_before_or_equal_to_the_current_date(v),
      ],
      option_calendar: useCalendarRules().only_until(
        moment().format('YYYY-MM-DD')
      ),
    },
    {
      name: 'from_voucher_id',
      label: 'Desde comprobante*',
      type: 'q-select',
      value: null,
      autocomplete: true,
      hide: true,
      options: receiptTypeSelect,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(v: string) => useRules().is_required(v)],
    },
    {
      name: 'up_voucher_id',
      label: 'Hasta comprobante*',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: receiptTypesSelect,
      hide: true,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(v: string) => useRules().is_required(v)],
    },
    {
      name: 'from_expense_number_id',
      label: 'Desde egresos número*',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: recordExpensesSelect,
      hide: true,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(v: string) => useRules().is_required(v)],
    },
    {
      name: 'up_expense_number_id',
      label: 'Hasta egresos número*',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: recordExpensesSelect,
      hide: true,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(v: string) => useRules().is_required(v)],
    },
  ])

  const handleFilter = ($filters: {
    'filter[from_business_id]': string
    'filter[up_business_id]': string
    'filter[starting_date]': string
    'filter[end_date]': string
    'filter[from_voucher_id]': string
    'filter[up_voucher_id]': string
    'filter[from_expense_number_id]': string
    'filter[up_expense_number_id]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getExpenseReceiptList(filters)
    tableProps.value.loading = false
  }

  const handleClear = () => {
    tableProps.value.rows = []
    useUtils().clearFilters(filterConfig.value)
  }

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    useUtils().toggleFilterVisibility(
      filterConfig.value,
      4,
      8,
      hideFilters.value
    )
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const downloadExcelById = async (id: number) => {
    _getExpenseReceiptExportById(id)
  }

  watch(
    () => expenseReceiptList.value,
    () => {
      tableProps.value.rows = expenseReceiptList.value
    }
  )

  watch(
    () => expenseReceiptPages.value,
    () => {
      tableProps.value.pages = expenseReceiptPages.value
    }
  )

  onMounted(async () => {
    openMainLoader(true)
    await _getResources({ treasury: keys })
    await _getResources({ accounting: key })

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({ treasury: keys })
    _resetKeys({ accounting: key })
  })

  return {
    headerProps,
    filterConfig,
    tableProps,
    filtersRef,
    handleFilter,
    handleShowMoreFilters,
    handleClear,
    updatePage,
    updatePerPage,
    downloadExcelById,
  }
}

export default useExpenseReceiptList
