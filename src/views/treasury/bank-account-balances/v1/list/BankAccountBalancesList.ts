// vue | quasar | router
import { QTable } from 'quasar'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// utils
import { formatParamsCustom } from '@/utils'

import {
  useBankAccountBalancesStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { IFieldFilters, IBankAccountBalance } from '@/interfaces/customs'
import { useRouteValidator, useUtils } from '@/composables'

const useBankAccountBalancesList = () => {
  // imports
  const router = useRouter()

  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const { formatCurrencyString } = useUtils()

  const { _getListAction, _changeStatusAction } =
    useBankAccountBalancesStore('v1')

  const { bank_account_balances_list, bank_account_balances_pages } =
    storeToRefs(useBankAccountBalancesStore('v1'))

  const {
    business_trusts,
    business_bank_accounts_with_name,
    banks_record_expenses,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // props
  const headerProps = {
    title: 'Saldos iniciales de cuentas bancarias',
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
        label: 'Saldos iniciales de cuentas bancarias',
        route: 'BankAccountBalancesList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de saldos iniciales bancarias',
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
        name: 'business_id',
        required: false,
        label: 'Cuenta bancaria',
        align: 'left',
        field: (row) =>
          row.bank_account.account_number && row.bank_account.account_name
            ? `${row.bank_account.account_number} - ${row.bank_account.account_name}`
            : '-',
        sortable: true,
      },
      {
        name: 'currency',
        required: true,
        label: 'Moneda',
        align: 'left',
        field: 'currency',
        sortable: true,
      },
      {
        name: 'initial_balance_local_currency',
        required: true,
        label: 'Saldo inicial moneda local',
        align: 'left',
        field: 'initial_balance_local_currency',
        sortable: true,
        format: (_, item) =>
          formatCurrencyString(item.initial_balance_local_currency),
      },
      {
        name: 'initial_balance_foreign_currency',
        required: true,
        label: 'Saldo inicial moneda extranjera',
        align: 'left',
        field: 'initial_balance_foreign_currency',
        sortable: true,
        format: (_, item) =>
          formatCurrencyString(item.initial_balance_foreign_currency),
      },
      {
        name: 'opening_date',
        required: true,
        label: 'Fecha de apertura',
        align: 'left',
        field: 'opening_date',
        sortable: true,
      },
      {
        name: 'initial_balance_date',
        required: true,
        label: 'Fecha saldo inicial',
        align: 'left',
        field: 'initial_balance_date',
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
    rows: [] as IBankAccountBalance[],
    pages: bank_account_balances_pages,
  })

  const filterComponentRef = ref()

  const onFilterBusiness = async (business_id: number, name: string) => {
    filtersFormat.value[name] = business_id

    const reset_bank_keys = {
      treasury: ['banks_record_expenses', 'business_bank_accounts'],
    }
    const bank_keys = {
      treasury: ['banks_record_expenses'],
    }
    await _resetKeys(reset_bank_keys)

    if (business_id) {
      const banks_filter = `business_trust_id=${business_id}`
      await _getResources(bank_keys, banks_filter)
    }
    filterComponentRef.value.cleanFiltersByNames(['bank', 'bank_account'])
    filterConfig.value[2].options = null
  }

  const onFilterBank = async (bank_id: number, name: string) => {
    filtersFormat.value[name] = bank_id

    const bank_accounts_keys = {
      treasury: ['business_bank_accounts'],
    }
    await _resetKeys(bank_accounts_keys)

    if (bank_id) {
      const bank_account_filter = `business_id=${filtersFormat.value['filter[business_trust]']}&filter[bank_id]=${filtersFormat.value['filter[bank]']}`
      await _getResources(bank_accounts_keys, bank_account_filter, 'v2')
      filterComponentRef.value.cleanFiltersByNames(['bank_account'])
      filterConfig.value[2].options = business_bank_accounts_with_name.value
    }
  }
  // filter
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: business_trusts,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
      onChange: onFilterBusiness,
    },
    {
      name: 'bank',
      label: 'Banco',
      type: 'q-select',
      autocomplete: true,
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: banks_record_expenses,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      onChange: onFilterBank,
    },
    {
      name: 'bank_account',
      label: 'Cuenta bancaria',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: null,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[business_trust]': string
    'filter[bank]': string
    'filter[bank_account]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }
  const handleClearFilters = async () => {
    tableProps.value.rows = []
  }

  // actions
  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const changeStatusAction = async () => {
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _changeStatusAction(alertModalConfig.value.entityId as number)
    openMainLoader(false)
  }

  const key = {
    treasury: ['business_trusts'],
  }

  onMounted(async () => {
    await _getResources(key, '', 'v2')
  })

  onBeforeMount(async () => {
    _resetKeys({
      ...key,
      treasury: ['banks', 'business_bank_accounts', 'banks_record_expenses'],
    })
  })

  // modal
  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el saldo inicial?`
  }

  watch(
    () => bank_account_balances_list.value,
    () => {
      tableProps.value.rows = bank_account_balances_list.value
      tableProps.value.pages = bank_account_balances_pages.value
    }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    alertModalRef,
    filterComponentRef,
    handleFilter,
    handlerGoTo,
    openAlertModal,
    changeStatusAction,
    handleClearFilters,
    validateRouter,
  }
}

export default useBankAccountBalancesList
