// Vue - pinia - quasar - vue-router
import { ref, watch, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IFieldFilters, IBankingAccountsList } from '@/interfaces/customs'

// Composables & Utils
import {
  useMainLoader,
  useRouteValidator,
  useUtils,
  useRules,
} from '@/composables'
import { formatParamsCustom } from '@/utils'

// Stores
import {
  useBankingAccountsStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

const useBankingAccountsList = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const { defaultIconsLucide } = useUtils()

  const {
    _getBankingAccountsList,
    _deleteBankingAccounts,
    _resetBankingAccountForms,
    _exportBankingAccountsExcel,
  } = useBankingAccountsStore('v2')

  const { banking_accounts_list, banking_accounts_pages } = storeToRefs(
    useBankingAccountsStore('v2')
  )
  const { bank_account_business, banks_bank_accounts } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  let perPage = 20
  const filtersComponentRef = ref()

  const keys = {
    treasury: ['bank_account_business'],
  }

  const keysToClear = {
    treasury: ['banks_bank_accounts', 'bank_account_business'],
  }
  const headerProps = {
    title: 'Cuentas bancarias',
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
        label: 'Cuentas bancarias',
        route: 'BankingAccountsList',
      },
    ],
  }
  const tableProps = ref({
    title: 'Listado de cuentas bancarias',
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
        field: (row: IBankingAccountsList) =>
          `${row.business?.name?.toUpperCase() ?? ''}`,
        sortable: true,
      },
      {
        name: 'bank',
        required: false,
        label: 'Banco',
        align: 'left',
        field: (row: IBankingAccountsList) =>
          `${row.bank?.description?.toUpperCase() ?? ''}`,
        sortable: true,
      },
      {
        name: 'account_bank',
        required: false,
        label: 'Cuenta bancaria',
        align: 'left',
        field: 'account_bank',
        sortable: true,
      },
      {
        name: 'account_name',
        required: true,
        label: 'Nombre de cuenta',
        align: 'left',
        field: (row: IBankingAccountsList) =>
          `${row.account_name?.toUpperCase()}`,
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status',
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
    rows: [] as IBankingAccountsList[],
    pages: banking_accounts_pages,
    rowsPerPage: perPage,
  })

  const assignBankAccountFromBanks = async (businessId: number) => {
    if (!businessId) {
      cleanFiltersValues()
      _resetKeys({ treasury: ['banks_bank_accounts'] })
      return
    }

    await _getResources({
      treasury: [`banks_bank_accounts&business_trust_id=${businessId}`],
    }, '', 'v2')
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      autocomplete: true,
      options: bank_account_business,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      rules: [(v: string) => useRules().is_required(v, 'Negocio es requerido')],
      onChange: assignBankAccountFromBanks,
    },
    {
      name: 'bank',
      label: 'Banco',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: banks_bank_accounts,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      rules: [(v: string) => useRules().is_required(v, 'Banco es requerido')],
    },
    {
      name: 'search',
      label: 'Cuenta Bancaria',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código del registro',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const alertModalRef = ref()

  const cleanFiltersValues = () => {
    filterConfig.value[1].value = null
    filtersComponentRef.value?.setFieldValueByName('bank', null)
  }

  const handleFilter = ($filters: {
    'filter[business]': string
    'filter[bank]': string
    'filter[search]': number
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
    await _getBankingAccountsList(filters)
    tableProps.value.loading = false
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'view':
        _resetBankingAccountForms()
        router.push({ name: 'BankingAccountsView', params: { id } })
        break
      case 'edit':
        _resetBankingAccountForms()
        router.push({ name: 'BankingAccountsEdit', params: { id } })
        break
      case 'delete':
        if (id) {
          alertModalConfig.value.id = id
          await alertModalRef.value.openModal()
        }
        break
      default:
        break
    }
  }

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la cuenta bancaria?',
    id: null as number | null,
  })

  const deleteBankingAccount = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteBankingAccounts(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
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

  const downloadExcelBankingAccounts = async () => {
    openMainLoader(true)
    const queryString = formatParamsCustom(filtersFormat.value)

    await _exportBankingAccountsExcel(queryString || '')
    openMainLoader(false)
  }

  const isDownloadDisabled = computed(() => {
    return tableProps.value.rows.length === 0 || tableProps.value.loading
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    _resetKeys(keysToClear)

    await _getResources(keys)

    openMainLoader(false)
  })

  watch(
    () => banking_accounts_list.value,
    () => {
      tableProps.value.rows = banking_accounts_list.value
    }
  )

  watch(
    () => banking_accounts_pages.value,
    () => {
      tableProps.value.pages = banking_accounts_pages.value
    }
  )
  return {
    tableProps,
    headerProps,
    alertModalRef,
    alertModalConfig,
    filterConfig,
    filtersComponentRef,

    deleteBankingAccount,
    handleFilter,
    handleClear,
    handleOptions,
    updatePage,
    updatePerPage,
    _resetBankingAccountForms,
    validateRouter,
    downloadExcelBankingAccounts,
    isDownloadDisabled,
  }
}

export default useBankingAccountsList
