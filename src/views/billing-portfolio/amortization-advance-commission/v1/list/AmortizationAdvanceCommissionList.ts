// Vue - pinia - moment
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

// Store
import { useAmortizationAdvanceCommissionStore } from '@/stores'
import {
  IAmortizationAdvanceCommissionItemList,
  IFilterableVoucher,
} from '@/interfaces/customs'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { QTable } from 'quasar'
import { useRules } from '@/composables'

const useAmortizationAdvanceCommissionList = () => {
  const { _getAmortizationAdvanceCommissionList } =
    useAmortizationAdvanceCommissionStore('v1')
  const {
    amortization_advance_commission_list,
    amortization_advance_commission_pages,
    selectedAmortizationId,
  } = storeToRefs(useAmortizationAdvanceCommissionStore('v1'))

  const headerProps = {
    title: 'Amortización de comisión anticipada',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Facturación y cartera',
        route: '',
      },
      {
        label: 'Amortización de comisión anticipada',
        route: 'AmortizationAdvanceCommissionList',
      },
    ],
  }

  const filterConfig = ref([
    {
      name: 'invoice_number',
      label: 'Número de factura',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      required: false,
      placeholder: 'Ingrese número de factura',
      rules: [
        (v: string) => (v ? useRules().max_length(v, 15) : true),
        (v: string) => (v ? useRules().only_number(v) : true),
      ],
    },
    {
      name: 'invoice_total',
      label: 'Valor comisión',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      required: false,
      placeholder: 'Ingrese número de factura',
      rules: [
        (v: string) => (v ? useRules().max_length(v, 20) : true),
        (v: string) => (v ? useRules().only_number(v) : true),
      ],
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      required: false,
      clean_value: true,
      placeholder:
        'Buscar por código del negocio fiduciario o el nombre del negocio fiduciario',
      rules: [(v: string) => (v ? useRules().max_length(v, 50) : true)],
    },
  ])

  const tableProps = ref({
    title: 'Listado de amortización de facturas',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'name_business',
        field: (row) =>
          `${row.business_code_snapshot} - ${row.business_name_snapshot}`,
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'invoice_number',
        field: 'invoice_number',
        required: true,
        label: 'N° de factura',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: (row) => row.status.id,
        required: true,
        label: 'Estado de la factura',
        align: 'left',
        sortable: true,
      },
      {
        name: 'amortization_accumulated',
        field: 'accumulated_amortization',
        required: true,
        label: 'Amortización acumulada',
        align: 'left',
        sortable: true,
      },
      {
        name: 'total_invoice_amount',
        field: 'invoice_total',
        required: true,
        label: 'Valor total de la factura',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        sortable: false,
        required: true,
        style: 'width: 100px',
        classes: 'col-actions',
      },
    ] as QTable['columns'],
    rows: [] as IAmortizationAdvanceCommissionItemList[],
    pages: amortization_advance_commission_pages.value,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getAmortizationAdvanceCommissionList(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const isDisabledAmortization = ref(true)

  const handleAmortizationSelection = (event: {
    rows: number
    selected: IFilterableVoucher[]
  }) => {
    const data = event.selected.map((item: IFilterableVoucher) => item.id)
    isDisabledAmortization.value = data.length !== 1
    selectedAmortizationId.value = data.length === 1 ? data[0] : null
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const handleFilter = ($filters: {
    'filter[invoice_number]': string
    'filter[invoice_total]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  watch(
    () => amortization_advance_commission_list.value,
    () => {
      tableProps.value.rows = amortization_advance_commission_list.value
      tableProps.value.pages = amortization_advance_commission_pages.value
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    isDisabledAmortization,
    selectedAmortizationId,
    handleFilter,
    updatePage,
    updateRowsPerPage,
    handleAmortizationSelection,
    handleClearFilters,
  }
}

export default useAmortizationAdvanceCommissionList
