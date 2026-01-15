//Vue-Pinia
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
//Qasar
import { QTable } from 'quasar'
//Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { ICheckBalanceCostCenter } from '@/interfaces/customs/'
//Composables
import { useUtils } from '@/composables/useUtils'
import { useRouteValidator } from '@/composables/useRoutesValidator'

//Stores
import {
  useAccountingResourceStore,
  useCheckBalanceCenterStore,
  useResourceManagerStore,
} from '@/stores'

export const useCheckBalanceCostList = () => {
  const { check_balance_cost_center, check_balance_cost_center_pages } =
    storeToRefs(useCheckBalanceCenterStore('v1'))
  const { business_trusts_basic, structure_by_business } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getCheckBalanceCostCenter, _downloadTemplate } =
    useCheckBalanceCenterStore('v1')
  const { formatParamsCustom } = useUtils()
  const { validateRouter } = useRouteValidator()

  const filtersFormat = ref<Record<string, string | number>>({})
  const filtersRef = ref()
  const excelData = ref({
    from: '',
    to: '',
    business_trust_id: 0,
  })
  let perPage = 20

  const headerProps = {
    title: 'Consulta de saldos por centro de costos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Consulta de saldos por centros de costos',
        route: 'CheckBalanceCostList',
      },
    ],
  }

  //Table Properties
  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ICheckBalanceCostCenter[]
    pages: typeof check_balance_cost_center_pages
    rowsPerPage: number
  }>({
    title: 'Listado de saldos por centro de costos',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        sortable: false,
      },
      {
        name: 'account_code',
        label: 'Cuenta',
        field: 'account_code',
        sortable: false,
      },
      {
        name: 'account_name',
        label: 'Nombre de la cuenta',
        field: 'account_name',
        sortable: false,
      },

      {
        name: 'cost_center_name',
        label: 'Centro de costos',
        field: 'cost_center_name',
        sortable: false,
      },
      {
        name: 'initial_balance',
        label: 'Saldo inicial',
        field: 'initial_balance',
        sortable: false,
      },
      {
        name: 'debit',
        label: 'Débito',
        field: 'debit',
        sortable: false,
      },
      {
        name: 'credit',
        label: 'Crédito',
        field: 'credit',
        sortable: false,
      },
      {
        name: 'total',
        label: 'Saldo final',
        field: 'total',
        sortable: false,
      },
      {
        name: 'foreign_currency',
        label: 'Saldo moneda extranjera',
        field: 'foreign_currency',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [],
    pages: check_balance_cost_center_pages,
    rowsPerPage: 10,
  })

  //Funciones para obtener data de los filter
  const selectBusiness = async (business_id: number) => {
    filtersFormat.value['filter[business_trust_id]'] = business_id
    excelData.value.business_trust_id = business_id
    filtersRef.value.cleanFiltersByNames([
      'accounting_structure_id',
      'account_id',
    ])
    _resetKeys({
      accounting: [
        'structure_by_business',
        'accounting_chart_operative_by_structure',
      ],
    })
    if (business_id) {
      await _getResources({
        accounting: [
          `structure_by_business&filter[business_id]=${business_id}`,
        ],
      })
      if (!structure_by_business.value?.length) return

      const selectedStructure = structure_by_business.value[0]
      filtersRef.value.setFieldValueByName(
        'account_structure',
        selectedStructure.value
      )
    }
  }
  const selectDateFrom = (fromDate: string) => (excelData.value.from = fromDate)

  const selecDateTo = (toDate: string) => (excelData.value.to = toDate)
  //Filters
  const filters = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      autocomplete: true,
      options: business_trusts_basic,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: selectBusiness,
    },
    {
      name: 'account_structure',
      label: 'Estructura contable*',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-3',
      options: structure_by_business,
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'from_period',
      label: 'Desde periodo*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      mask: 'YYYY-MM',
      disable: false,
      autocomplete: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
      onChange: selectDateFrom,
    },
    {
      name: 'to_period',
      label: 'Hasta periodo*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      mask: 'YYYY-MM',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
      onChange: selecDateTo,
    },
  ])
  //Funciones para listar, paginar, filtrar
  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    if (filters) {
      const urlParams = new URLSearchParams(filters)

      urlParams.delete('filter[account_structure]')
      filters = urlParams.toString() ? '&' + urlParams.toString() : ''
    }
    await _getCheckBalanceCostCenter(filters)
    tableProps.value.loading = false
  }

  const handleFilter = ($filter: {
    'filter[business_trust_id]': string
    'filter[from_period]': string
    'filter[to_period]': string
  }) => {
    filtersFormat.value = {
      ...$filter,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    tableProps.value.rows = []
    filtersFormat.value = {}
  }
  //Funcion para descargar excel
  const downloadExcel = () => {
    _downloadTemplate(
      `filter[business_trust_id]=${excelData.value.business_trust_id}&filter[from_period]=${excelData.value.from}&filter[to_period]=${excelData.value.to}`
    )
    tableProps.value.loading = false
  }
  //Sincroniza el estado con los cambios del check_balance para mostrar la lista
  watch(
    () => check_balance_cost_center.value,
    () => {
      tableProps.value.rows = check_balance_cost_center.value
    }
  )

  onMounted(async () => {
    await _getResources({
      accounting: ['business_trusts_basic'],
    })
  })

  onUnmounted(() => {
    _resetKeys({
      accounting: ['business_trusts_basic', 'structure_by_business'],
    })
  })

  return {
    headerProps,
    tableProps,
    filters,
    filtersRef,
    validateRouter,
    updatePage,
    updatePerPage,
    handleFilter,
    handleClear,
    downloadExcel,
  }
}
