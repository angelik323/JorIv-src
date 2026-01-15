import { ref } from 'vue'

import { IAnnualPeriodClosingModel, IFieldFilters } from '@/interfaces/customs'
import { QTable } from 'quasar'
import { useRouteValidator } from '@/composables/useRoutesValidator'

const useCostCenterBalanceQueryList = () => {
  const { validateRouter } = useRouteValidator()
  const alertModalRef = ref()

  let perPage = 20

  const tableProps = ref({
    title: 'Consulta de saldos por centro de costos',
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
        name: 'account',
        required: true,
        label: 'Cuenta',
        align: 'left',
        sortable: true,
      },
      {
        name: 'accountName',
        required: true,
        label: 'Nombre de la cuenta',
        align: 'left',
        sortable: true,
      },
      {
        name: 'scabCenter',
        required: true,
        label: 'Centro de costros',
        align: 'left',
      },
      {
        name: 'initialBalance',
        required: true,
        label: 'Saldo inicial',
        align: 'left',
      },
      {
        name: 'debit',
        required: true,
        label: 'Débito',
        align: 'left',
        sortable: true,
      },
      {
        name: 'Credit',
        required: true,
        label: 'Crédito',
        align: 'left',
      },
      {
        name: 'finalBalance',
        required: true,
        label: 'Saldo final',
        align: 'left',
        sortable: true,
      },
      {
        name: 'foreignCurrencyBalance',
        required: true,
        label: 'Saldo moneda extranjera',
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IAnnualPeriodClosingModel[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Consulta de saldos por centro de costos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Consulta de saldos por centro de costos',
        route: 'CostCenterBalanceQueryList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'accounting_structure',
      label: 'Estructura contable',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: false,
      placeholder: '-',
      hide: false,
    },
    {
      name: 'fromPeriod',
      label: 'Desde Periodo',
      type: 'q-date',
      value: null,
      mask: 'MM/YYYY',
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: 'MM-AAAA',
    },
    {
      name: 'toPeriod',
      label: 'Hasta periodo',
      type: 'q-date',
      value: null,
      mask: 'MM/YYYY',
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: 'MM-AAAA',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[accounting_structure_id]': string
    'filter[from_business_trust_id]': string
    'filter[to_business_trust_id]': string
    'filter[executed_at]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
  }

  return {
    headerProps,
    tableProps,
    alertModalRef,
    filterConfig,

    handleFilter,
    updatePage,
    updatePerPage,
    validateRouter,
  }
}

export default useCostCenterBalanceQueryList
