import { useRouteValidator } from '@/composables'
import { IFieldFilters, IOperatingAccountList } from '@/interfaces/customs'
import { useAccountingRestatementStore, useResourceStore } from '@/stores'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { nextTick, onMounted, ref, watch } from 'vue'

const useAccountingRestatementList = () => {
  const {
    businesses_by_reexpression,
    structure_by_business,
    accounts_by_business,
  } = storeToRefs(useResourceStore('v1'))
  const { validateRouter } = useRouteValidator()
  const { _getAccountingResources } = useResourceStore('v1')
  const { accounting_restatement_list, accounting_restatement_pages } =
    storeToRefs(useAccountingRestatementStore('v1'))
  const { _getAccountingInformationTable } = useAccountingRestatementStore('v1')
  const keys = ['businesses_by_reexpression']
  const keys_second = ['structure_by_business', 'accounts_by_business']
  const hideFilters = ref<boolean>(true)

  let perPage = 20
  const headerProps = {
    title: 'Reexpresión de moneda extranjera',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Reexpresión de moneda extranjera',
        route: 'AccountingRestatementList',
      },
    ],
  }

  const tableProps = ref({
    title: '',
    loading: false,
    columns: [
      {
        name: 'periodo',
        label: 'Periodo',
        field: 'periodo',
        align: 'center',
        sortable: true,
      },
      {
        name: 'comprobante',
        label: 'Comprobante',
        field: 'comprobante',
        align: 'center',
        sortable: true,
      },
      {
        name: 'subtipo_comprobante',
        label: 'Subtipo de comprobante',
        field: 'subtipo_comprobante',
        align: 'center',
        sortable: true,
      },
      {
        name: 'consecutivo',
        label: 'Consecutivo',
        field: 'consecutivo',
        align: 'center',
        sortable: true,
      },
      {
        name: 'fecha',
        label: 'Fecha',
        field: 'fecha',
        align: 'center',
        sortable: true,
      },
      {
        name: 'saldo_dolares',
        label: 'Saldo en dólares',
        field: 'saldo_dolares',
        align: 'center',
        sortable: true,
      },
      {
        name: 'saldo_pesos',
        label: 'Saldo en pesos',
        field: 'saldo_pesos',
        align: 'center',
        sortable: true,
      },
      {
        name: 'tasa',
        label: 'Tasa',
        field: 'tasa',
        align: 'center',
        sortable: true,
      },
      {
        name: 'saldo_ajustado_pesos',
        label: 'Saldo ajustado en pesos',
        field: 'saldo_ajustado_pesos',
        align: 'center',
        sortable: true,
      },
      {
        name: 'debito',
        label: 'Débito',
        field: 'debito',
        align: 'center',
        sortable: true,
      },
      {
        name: 'credito',
        label: 'Crédito',
        field: 'credito',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IOperatingAccountList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    rowsPerPage: perPage,
    selection: 'multiple',
    selected: ref([]),
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: businesses_by_reexpression,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'account_structure_code',
      label: 'Estructuras contables',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: structure_by_business,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'account_id',
      label: 'Cuenta',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: accounts_by_business,
      disable: false,
      clean_value: true,
      autocomplete: true,
    },
    {
      name: 'from_period',
      label: 'Desde periodo',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      hide: true,
      placeholder: 'MM/AAAA',
      mask: 'MM/YYYY',
    },
    {
      name: 'to_period',
      label: 'Hasta periodo',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      hide: true,
      placeholder: 'MM/AAAA',
      mask: 'MM/YYYY',
    },
  ])

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    filterConfig.value[3].hide = hideFilters.value
    filterConfig.value[4].hide = hideFilters.value
  }

  const filtersFormat = ref<Record<string, string | number>>({})
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la reexpresión de moneda extranjera?',
    id: null as number | null,
  })

  const filtersRef = ref()
  const filterUpdate = async ($filters: {
    'filter[business_id]': string | null
  }) => {
    const nextBusiness = $filters['filter[business_id]'] ?? null
    const prevBusiness =
      (filtersFormat.value['filter[business_id]'] as string) ?? null

    if (nextBusiness) {
      filtersFormat.value['filter[business_id]'] = nextBusiness
    } else {
      delete filtersFormat.value['filter[business_id]']
    }

    if (nextBusiness === prevBusiness) return

    const structure = filterConfig.value.find(
      (f) => f.name === 'account_structure_code'
    )
    const account = filterConfig.value.find((f) => f.name === 'account_id')
    if (structure) structure.value = null
    if (account) account.value = null

    delete filtersFormat.value['filter[account_structure_code]']
    delete filtersFormat.value['filter[account_id]']

    filtersRef.value?.cleanFiltersByNames?.([
      'account_structure_code',
      'account_id',
    ])
    structure_by_business.value = []
    accounts_by_business.value = []

    await nextTick()

    if (nextBusiness) {
      await _getAccountingResources(
        `keys[]=${keys_second.join(
          '&keys[]='
        )}&filter[business_id]=${nextBusiness}`
      )
    }
  }

  const handleFilter = ($filters: {
    'filter[business_id]': string
    'filter[account_structure_code]': string
    'filter[from_period]': string
    'filter[to_period]': string
  }) => {
    const { 'filter[account_structure_code]': _, ...restFilters } = $filters
    filtersFormat.value = {
      ...restFilters,
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
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    listAction()
  }

  onMounted(async () => {
    await _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  const listAction = async (filters: string = '') => {
    const fecha = decodeURIComponent(filters)
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getAccountingInformationTable(fecha)
    tableProps.value.loading = false
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }

  watch(
    () => accounting_restatement_list.value,
    () => {
      tableProps.value.rows = accounting_restatement_list.value
      tableProps.value.pages = accounting_restatement_pages.value
    }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    alertModalRef,
    alertModalConfig,
    updatePage,
    updatePerPage,
    handleFilter,
    listAction,
    handleClear,
    handleShowMoreFilters,
    filterUpdate,
    validateRouter,
    filtersRef,
  }
}

export default useAccountingRestatementList
