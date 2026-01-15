import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

import { useMainLoader, useRules, useUtils } from '@/composables'
import { formatParamsCustom } from '@/utils'

import { normative_framework } from '@/constants/resources'
import {
  IFieldFilters,
  IAccountBalanceAndThirdParties,
} from '@/interfaces/customs'

import {
  useResourceManagerStore,
  useAccountingResourceStore,
  useAccountBalancesAndThirdPartiesStore,
} from '@/stores'
import { useRouteValidator } from '@/composables/useRoutesValidator'

const useAccountBalancesAndThirdPartiesList = () => {
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { getFormatNumber, normalizeThousands } = useUtils()
  const { is_required } = useRules()

  const accountBalanceStore = useAccountBalancesAndThirdPartiesStore('v1')

  const { business_trusts_basic: business, structure_by_business } =
    storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { account_balances_list, account_balances_pages } =
    storeToRefs(accountBalanceStore)
  const { _listAction, _exportExcelAction } = accountBalanceStore

  const filtersFormat = ref<Record<string, string | number>>({})
  const isAccountBalanceEmpty = ref(true)
  const filtersRef = ref()
  const showState = ref(0)

  let perPage = 20

  const headerProperties = {
    title: 'Consulta de saldos cuenta y terceros',
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
        label: 'Consulta de saldos cuenta y terceros',
        route: 'AccountBalancesAndThirdPartiesList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val)],
      hide: false,
      autocomplete: true,
    },
    {
      name: 'structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: '',
      options: structure_by_business,
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
      hide: false,
      autocomplete: true,
    },
    {
      name: 'normative_framework',
      label: 'Marco normativo',
      type: 'q-select',
      value: 'CUIF',
      class: 'col-12 col-md-4',
      options: normative_framework,
      disable: false,
      clean_value: true,
      hide: false,
    },
    {
      name: 'start_date',
      label: 'Desde periodo*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'YYYY-MM-DD',
      rules: [(val: string) => is_required(val)],
      hide: true,
    },
    {
      name: 'end_date',
      label: 'Hasta periodo*',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'YYYY-MM-DD',
      rules: [(val: string) => is_required(val)],
      hide: true,
    },
  ])

  const tableProperties = ref({
    title: 'Listado de saldos y movimientos por cuenta',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'center',
        label: '#',
        field: 'id',
      },
      {
        name: 'account_code',
        align: 'left',
        label: 'Cuenta',
        field: 'account_code',
        sortable: true,
      },
      {
        name: 'account_name',
        align: 'left',
        label: 'Nombre de la cuenta',
        field: 'account_name',
        sortable: true,
      },
      {
        name: 'auxiliary',
        align: 'left',
        label: 'Auxiliar',
        field: 'auxiliary',
        sortable: true,
      },
      {
        name: 'cost_center',
        align: 'left',
        label: 'Centro de costos',
        field: 'cost_center',
        sortable: true,
      },
      {
        name: 'initial_balance',
        align: 'left',
        label: 'Saldo inicial',
        field: 'initial_balance',
        sortable: true,
        format: (val: string | number | null) => {
          const numeric = normalizeThousands(val)
          return getFormatNumber(numeric)
        },
      },
      {
        name: 'debits',
        align: 'left',
        label: 'Débito',
        field: 'debits',
        sortable: true,
        format: (val: string | number | null) => {
          const numeric = normalizeThousands(val)
          return getFormatNumber(numeric)
        },
      },
      {
        name: 'credits',
        align: 'left',
        label: 'Crédito',
        field: 'credits',
        sortable: true,
        format: (val: string | number | null) => {
          const numeric = normalizeThousands(val)
          return getFormatNumber(numeric)
        },
      },
      {
        name: 'final_balance',
        align: 'left',
        label: 'Saldo final',
        field: 'final_balance',
        sortable: true,
        format: (val: string | number | null) => {
          const numeric = normalizeThousands(val)
          return getFormatNumber(numeric)
        },
      },
    ] as QTable['columns'],
    rows: [] as IAccountBalanceAndThirdParties[],
    pages: account_balances_pages,
  })

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProperties.value.rows = []

    await _listAction(filters)

    const hasResults = account_balances_list.value.length > 0

    showState.value = filters ? 1 : 0
    isAccountBalanceEmpty.value = !hasResults

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const uploadFileExcel = async () =>
    await _exportExcelAction(formatParamsCustom({ ...filtersFormat.value }))

  const onChangeFilter = async (values: Record<string, string | number>) => {
    const val = values['filter[business_id]']
    if (!val) {
      if (filtersRef.value) {
        filtersRef.value.setFieldValueByName('structure_id', '')
      }
      return
    }
    _resetKeys({ accounting: ['structure_by_business'] })

    await _getResources({
      accounting: [`structure_by_business&filter[business_id]=${val}`],
    })

    const structures = structure_by_business.value || []
    const selectedStructure = structures[0]

    if (!selectedStructure) {
      if (filtersRef.value) {
        filtersRef.value.setFieldValueByName('structure_id', '')
      }
      return
    }

    if (filtersRef.value) {
      filtersRef.value.setFieldValueByName(
        'structure_id',
        selectedStructure.value
      )
    }
  }

  const handleFilter = async ($filters: {
    'filter[structure_id]': string | number
    'filter[start_date]': string
    'filter[end_date]': string
  }) => {
    filtersFormat.value = {
      'filter[structure_id]': $filters['filter[structure_id]'],
      'filter[start_date]': $filters['filter[start_date]'],
      'filter[end_date]': $filters['filter[end_date]'],
    }

    await loadData(filtersFormat.value)
  }

  const handleClearFilters = () => {
    showState.value = 0
    filtersFormat.value = {}
    tableProperties.value.rows = []
    isAccountBalanceEmpty.value = true
  }

  const handleShowFilters = (showMore: boolean) =>
    filterConfig.value.forEach((field) => {
      if (field.name === 'start_date' || field.name === 'end_date') {
        field.hide = !showMore
      }
    })

  const handleUpdatePage = async (page: number) =>
    await loadData({ ...filtersFormat.value, page, rows: perPage })

  const handleUpdatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    await loadData({ ...filtersFormat.value, rows: perPage })
  }

  watch(
    () => account_balances_list.value,
    () => {
      tableProperties.value.rows = account_balances_list.value
      tableProperties.value.pages = account_balances_pages.value
    }
  )

  onMounted(
    async () => await _getResources({ accounting: ['business_trusts_basic'] })
  )

  onBeforeUnmount(() => _resetKeys({ accounting: ['business_trusts_basic'] }))

  return {
    showState,
    filtersRef,
    filterConfig,
    handleFilter,
    onChangeFilter,
    uploadFileExcel,
    tableProperties,
    handleUpdatePage,
    headerProperties,
    handleShowFilters,
    handleClearFilters,
    handleUpdatePerPage,
    isAccountBalanceEmpty,
    validateRouter,
  }
}

export default useAccountBalancesAndThirdPartiesList
