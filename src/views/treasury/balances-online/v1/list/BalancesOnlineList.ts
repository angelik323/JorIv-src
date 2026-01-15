// vue | quasar | router
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// store
import { storeToRefs } from 'pinia'
import {
  useBalancesOnlineStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
  useTrustBusinessResourceStore,
} from '@/stores'

// composables
import { useMainLoader, useUtils } from '@/composables'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { IBalancesOnlineList, IFieldFilters } from '@/interfaces/customs'

const useBalancesOnlineList = () => {
  const { _getBalancesOnline, _downloadPdf } = useBalancesOnlineStore('v1')
  const { data_balances_online_list, data_balances_online_pages } = storeToRefs(
    useBalancesOnlineStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { banks, business_bank_accounts_with_name } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { extend_business } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { openMainLoader } = useMainLoader()
  const { formatCurrencyString } = useUtils()
  // props
  const tableProps = ref({
    title: 'Listado de saldos de cuentas bancarias en línea',
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
        name: 'business',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'business',
        sortable: true,
      },
      {
        name: 'bank',
        required: false,
        label: 'Banco',
        align: 'left',
        field: 'bank',
        sortable: true,
      },
      {
        name: 'bank_account',
        required: false,
        label: 'Cuenta bancaria',
        align: 'left',
        field: 'bank_account',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'currency',
        field: 'currency',
        required: true,
        label: 'Moneda',
        align: 'left',
        sortable: true,
      },
      {
        name: 'initial_balance',
        field: 'initial_balance',
        required: true,
        label: 'Saldo inicio día',
        align: 'right',
        sortable: true,
        format: (_, item) => formatCurrencyString(item.initial_balance),
      },
      {
        name: 'total_credits',
        field: 'total_credits',
        required: true,
        label: 'Total abonos',
        align: 'right',
        sortable: true,
        format: (_, item) => formatCurrencyString(item.total_credits),
      },
      {
        name: 'total_debits',
        field: 'total_debits',
        required: true,
        label: 'Total cargos',
        align: 'right',
        sortable: true,
        format: (_, item) => formatCurrencyString(item.total_debits),
      },
      {
        name: 'total_balance',
        field: 'total_balance',
        required: true,
        label: 'Saldo total',
        align: 'right',
        sortable: true,
        format: (_, item) => formatCurrencyString(item.total_balance),
      },
      {
        name: 'provisional_balance',
        field: 'provisional_balance',
        required: true,
        label: 'Saldo provisionado',
        align: 'right',
        sortable: true,
        format: (_, item) => formatCurrencyString(item.provisional_balance),
      },
      {
        name: 'available_balance',
        field: 'available_balance',
        required: true,
        label: 'Saldo disponible',
        align: 'right',
        sortable: true,
        format: (_, item) => formatCurrencyString(item.available_balance),
      },
      {
        name: 'treasury_closing',
        field: 'treasury_closing',
        required: true,
        label: 'Cierre del día',
        align: 'left',
        sortable: true,
      },
      {
        name: 'withholding_tax',
        field: 'withholding_tax',
        required: true,
        label: 'Retefuente',
        align: 'left',
        sortable: true,
      },
      {
        name: 'gmf',
        field: 'gmf',
        required: true,
        label: 'GMF',
        align: 'left',
        sortable: true,
      },
      {
        name: 'initial_balance_foreign_currency',
        field: 'initial_balance_foreign_currency',
        required: true,
        label: 'Saldo inicio día (Otra moneda)',
        align: 'right',
        sortable: true,
        format: (_, item) =>
          formatCurrencyString(item.initial_balance_foreign_currency),
      },
      {
        name: 'credits_foreign_currency',
        field: 'credits_foreign_currency',
        required: true,
        label: 'Abonos (Otra Moneda)',
        align: 'right',
        sortable: true,
        format: (_, item) =>
          formatCurrencyString(item.credits_foreign_currency),
      },
      {
        name: 'debits_foreign_currency',
        field: 'debits_foreign_currency',
        required: true,
        label: 'Cargos (Otra Moneda)',
        align: 'right',
        sortable: true,
        format: (_, item) => formatCurrencyString(item.debits_foreign_currency),
      },
      {
        name: 'provisional_balance_foreign_currency',
        field: 'provisional_balance_foreign_currency',
        required: true,
        label: 'Saldo Provisionado (Otra Moneda)',
        align: 'right',
        sortable: true,
        format: (_, item) =>
          formatCurrencyString(item.provisional_balance_foreign_currency),
      },
      {
        name: 'total_balance_foreign_currency',
        field: 'total_balance_foreign_currency',
        required: true,
        label: 'Saldo Total (Otra Moneda)',
        align: 'right',
        sortable: true,
        format: (_, item) =>
          formatCurrencyString(item.total_balance_foreign_currency),
      },
    ] as QTable['columns'],
    rows: [] as IBalancesOnlineList[],
    pages: data_balances_online_pages.value,
  })

  const headerProps = {
    title: 'Saldos de cuentas bancarias en línea',
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
        label: 'Saldos de cuentas bancarias en línea',
        route: 'BalancesOnlineList',
      },
    ],
  }
  const filterComponentRef = ref()

  const filtersFormat = ref<Record<string, string | number>>({
    'filter[account]': '',
    'filter[bank]': '',
    'filter[business]': '',
    'filter[date]': '',
  })

  const onFilterBusiness = async (business_id: number, name: string) => {
    filtersFormat.value[name] = business_id

    const bank_keys = {
      treasury: ['banks'],
    }

    const keysToReset = {
      treasury: [
        'banks',
        'business_bank_accounts',
        'business_bank_accounts_with_name',
      ],
    }

    await _resetKeys(keysToReset)

    if (business_id) {
      const banks_filter = `filter[business_trust]=${filtersFormat.value['filter[business]']}`
      await _getResources(bank_keys, banks_filter, 'v2')
    }
    filterComponentRef.value.cleanFiltersByNames(['bank'])
    filterComponentRef.value.cleanFiltersByNames(['account'])
  }

  const onFilterBank = async (bank_id: number, name: string) => {
    filtersFormat.value[name] = bank_id

    const bank_accounts_keys = {
      treasury: ['business_bank_accounts'],
    }

    const keysToReset = {
      treasury: ['business_bank_accounts', 'business_bank_accounts_with_name'],
    }

    await _resetKeys(keysToReset)

    if (bank_id) {
      const bank_account_filter = `business_id=${filtersFormat.value['filter[business]']}&filter[bank_id]=${filtersFormat.value['filter[bank]']}`
      await _getResources(bank_accounts_keys, bank_account_filter, 'v2')
    }
    filterComponentRef.value.cleanFiltersByNames(['account'])
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: extend_business,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      onChange: onFilterBusiness,
    },
    {
      name: 'bank',
      label: 'Banco',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: banks,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      onChange: onFilterBank,
    },
    {
      name: 'account',
      label: 'Cuenta bancaria',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: business_bank_accounts_with_name,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'date',
      label: 'Fecha',
      type: 'q-date',
      value: useUtils().formatDate(new Date().toISOString(), 'YYYY-MM-DD'),
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      option_calendar: ($event) => useUtils().isDateUpToToday($event),
    },
  ])

  // handlers / actions
  const handleFilter = ($filters: {
    'filter[business]': string
    'filter[bank]': string
    'filter[date]': string
    'filter[account]': string
  }) => {
    if ($filters) {
      filtersFormat.value = {
        ...$filters,
      }
    }

    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getBalancesOnline(filters)
    tableProps.value.loading = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRows = (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rows,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const onDdownloadExcel = async () => {
    openMainLoader(true)

    const completeFilters = {
      'filter[account]': filtersFormat.value['filter[account]'] ?? '',
      'filter[bank]': filtersFormat.value['filter[bank]'] ?? '',
      'filter[business]': filtersFormat.value['filter[business]'] ?? '',
      'filter[date]': filtersFormat.value['filter[date]'] ?? '',
    }

    const queryString = formatParamsCustom(completeFilters)
    await _downloadPdf(queryString)
    openMainLoader(false)
  }

  const handleClear = () => {
    _resetKeys({
      treasury: ['banks', 'business_bank_accounts'],
    })
    tableProps.value.rows = []
    filterConfig.value.forEach((f) => {
      f.value = null
    })
    filtersFormat.value = {
      'filter[account]': '',
      'filter[bank]': '',
      'filter[business]': '',
      'filter[date]': '',
    }
    filterComponentRef.value.cleanFiltersByNames(['date'])
  }

  // lifecycle hooks

  const keys = {
    trust_business: ['business_trusts'],
  }
  onBeforeMount(async () => {
    await _resetKeys({
      ...keys,
      treasury: ['business_bank_accounts_with_name'],
    })
  })
  onMounted(async () => {
    await _getResources(
      keys,
      'can_manage=true&active_accounting=true&filter[status_id]=67,57&filter[account_consolidator]=false'
    )
  })

  // watchers
  watch(
    () => data_balances_online_list.value,
    () => {
      tableProps.value.rows = data_balances_online_list.value
      tableProps.value.pages.currentPage =
        data_balances_online_pages.value.currentPage
      tableProps.value.pages.lastPage =
        data_balances_online_pages.value.lastPage
    },
    { deep: true }
  )

  return {
    filterComponentRef,
    filterConfig,
    headerProps,
    tableProps,
    onDdownloadExcel,
    handleFilter,
    handleClear,
    updatePage,
    updateRows,
  }
}

export default useBalancesOnlineList
