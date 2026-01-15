// Vue - pinia
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IAutomaticDebitSettingsList } from '@/interfaces/customs/billing-portfolio/AutomaticDebitSettings'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps, StatusID } from '@/interfaces/global'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Constants
import { sources_debit, status_automatic_debit } from '@/constants'

// Stores
import { useAutomaticDebitSettingsStore } from '@/stores/billing-portfolio/automatic-debit-settings'

const useAutomaticDebtCollectionList = () => {
  const { _getAutomaticDebitList, _changeStatusAutomaticDebit, _clearData } =
    useAutomaticDebitSettingsStore('v1')
  const { headerPropsDefault, automatic_debit_list, automatic_debit_pages } =
    storeToRefs(useAutomaticDebitSettingsStore('v1'))

  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatDate, formatCurrencyString } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { max_length } = useRules()

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const headerProps = headerPropsDefault.value

  const tableProps = ref<IBaseTableProps<IAutomaticDebitSettingsList>>({
    title: 'Listado de débito automático',
    loading: false,
    wrapCells: true,
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
        name: 'business_trust',
        field: (row) =>
          `${row.business_trust_code ?? ''} - ${row.business_trust_name ?? ''}`,
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'source',
        field: (row) => row.source.label,
        required: true,
        label: 'Fuente',
        align: 'left',
        sortable: true,
      },
      {
        name: 'bank_fund',
        field: (row) => {
          if (row.collective_investment_fund_data) {
            return (
              (row.collective_investment_fund_data?.fund_code ?? '') +
              ' - ' +
              (row.collective_investment_fund_data?.fund_name ?? '')
            )
          }
          if (row.bank_data) {
            return (
              (row.bank_data?.bank_code ?? '') +
              ' - ' +
              (row.bank_data?.description ?? '')
            )
          }
          return '-'
        },
        required: true,
        label: 'Banco/Fondo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'account',
        field: (row) => {
          if (row.investment_plan_data) {
            return row.investment_plan_data?.code ?? ''
          }
          if (row.account_bank_data) {
            return (
              (row.account_bank_data?.account_number ?? '') +
              ' - ' +
              (row.account_bank_data?.account_name ?? '')
            )
          }
          return '-'
        },
        required: true,
        label: 'Número de Cuenta/Plan de Inversión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'balance',
        field: 'balance',
        required: true,
        label: 'Saldo disponible',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val) ?? '-',
      },
      {
        name: 'updated_at',
        field: 'updated_at',
        required: true,
        label: 'Fecha de registro/actualización',
        align: 'left',
        sortable: true,
        format: (val) => formatDate(val, 'YYYY-MM-DD') ?? '-',
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'id',
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'date',
      label: 'Fecha de registro/actualización',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'source',
      label: 'Fuente',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: sources_debit,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-3',
      options: status_automatic_debit,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
      rules: [(val: string) => max_length(val, 50)],
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const alertModalRef = ref()
  const alertModalConfig = ref({
    id: null as number | null,
    status: null as boolean | null,
    title: 'Advertencia',
    description: '',
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getAutomaticDebitList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[date]': string
    'filter[source]': string
    'filter[status]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
  }

  const openAlertModal = async (row: IAutomaticDebitSettingsList) => {
    alertModalConfig.value.description = `¿Desea ${
      row.is_active ? 'inactivar' : 'activar'
    } el débito automático?`
    alertModalConfig.value.id = row.id
    alertModalConfig.value.status = !row.is_active
    await alertModalRef.value.openModal()
  }

  const changeStatusAction = async () => {
    openMainLoader(true)
    await _changeStatusAutomaticDebit(
      alertModalConfig.value.id as number,
      alertModalConfig.value.status as boolean
    )
    await listAction({
      ...filtersFormat.value,
    })
    openMainLoader(false)
    alertModalRef.value.closeModal()
  }

  onMounted(async () => {
    _clearData()
  })

  watch(
    automatic_debit_list,
    () => {
      tableProps.value.rows = [...automatic_debit_list.value]

      const { currentPage, lastPage } = automatic_debit_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    alertModalRef,
    alertModalConfig,
    isRowActive,
    defaultIconsLucide,

    handleFilter,
    updatePage,
    updatePerPage,
    openAlertModal,
    changeStatusAction,
    goToURL,
    validateRouter,
    handleClearFilters,
  }
}

export default useAutomaticDebtCollectionList
