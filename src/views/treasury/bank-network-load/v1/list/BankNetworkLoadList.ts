// Vue - Pinia - Router - Quasar
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// Composables & Utils
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Interfaces
import {
  IBankNetworkLoadItem,
  IBankNetworkLoadPages,
} from '@/interfaces/customs/treasury/BankNetworkLoad'
import { IFieldFilters } from '@/interfaces/customs'

// Store
import {
  useBankNetworkLoadStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { formatParamsCustom } from '@/utils'

export const useBankNetworkLoadList = () => {
  const { goToURL } = useGoToUrl()
  const { _getBankNetworkLoadList, _deleteBankNetworkLoad, _exportFailures } =
    useBankNetworkLoadStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { formatDate } = useUtils()

  const {
    banking_network_upload_statuses,
    banking_network_upload_request_types,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { bank_network_load_list, bank_network_load } = storeToRefs(
    useBankNetworkLoadStore('v1')
  )

  const { openMainLoader } = useMainLoader()
  let perPage = 20
  const alertModalRef = ref()
  const filtersFormat = ref<Record<string, string | number>>({})

  const keysV2 = {
    treasury: [
      'banking_network_upload_request_types',
      'banking_network_upload_statuses',
    ],
  }

  const headerProps = {
    title: 'Cargues de red bancario',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      {
        label: 'Cargues de red bancario',
        route: 'BankNetworkLoadList',
      },
    ],
  }

  const filters = ref<IFieldFilters[]>([
    {
      name: 'status',
      label: 'Estado del cargue',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      options: banking_network_upload_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'request_type',
      label: 'Tipo de solicitud',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      options: banking_network_upload_request_types,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'from_date',
      label: 'Desde fecha inicial',
      type: 'q-date',
      value: moment().format('YYYY-MM-DD'),
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      clean_value: true,
      placeholder: 'YYYY-MM-DD',
      mask: 'YYYY-MM-DD',
    },
    {
      name: 'to_date',
      label: 'Hasta fecha final',
      type: 'q-date',
      value: moment().format('YYYY-MM-DD'),
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      clean_value: true,
      placeholder: 'YYYY-MM-DD',
      mask: 'YYYY-MM-DD',
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IBankNetworkLoadItem[]
    pages: IBankNetworkLoadPages
  }>({
    title: 'Listado detalle de cuentas',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'left',
        field: 'consecutive',
        sortable: true,
      },
      {
        name: 'upload_number',
        label: 'Número de cargue',
        align: 'left',
        field: 'upload_number',
        sortable: true,
      },
      {
        name: 'uploaded_at',
        label: 'Fecha de cargue',
        align: 'left',
        field: (row) =>
          row.uploaded_at ? formatDate(row.uploaded_at, 'YYYY-MM-DD') : '-',
        sortable: true,
      },
      {
        name: 'request_type',
        label: 'Solicitud',
        align: 'left',
        field: 'request_type',
        sortable: true,
      },
      {
        name: 'business_trust',
        label: 'Negocio',
        align: 'left',
        field: (row) =>
          row.business_trust.code + '- ' + row.business_trust.name,
        sortable: true,
      },
      {
        name: 'bank',
        label: 'Banco',
        align: 'left',
        field: (row) => row.bank.code + ' - ' + row.bank.description,
        sortable: true,
      },
      {
        name: 'account_bank',
        label: 'Cuenta bancaria',
        align: 'left',
        field: (row) =>
          row.bank_account.account_number +
          ' - ' +
          row.bank_account.account_type,
        sortable: true,
      },
      {
        name: 'total_count',
        label: 'Registros',
        align: 'left',
        field: 'total_count',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ],
    rows: [],
    pages: bank_network_load.value,
  })

  const handleFilter = async ($filters: {
    'filter[status]': string
    'filter[from_date]': string
    'filter[to_date]': string
    'filter[request_type]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getBankNetworkLoadList(filters)
    tableProps.value.loading = false
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

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el cargue de red bancaria?',
    id: null as number | null,
  })

  const deleteBankNetworkLoad = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteBankNetworkLoad(alertModalConfig.value.id)
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
    openMainLoader(false)
  }

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'delete':
        if (id) {
          alertModalConfig.value.id = id
          await alertModalRef.value.openModal()
        }
        break
      case 'view':
        goToURL('BankNetworkLoadView', id)
        break
      case 'edit':
        goToURL('BankNetworkLoadEdit', id)
        break
      case 'errors':
        _exportFailures(id)
        break
      default:
        break
    }
  }

  onMounted(async () => {
    await _getResources(keysV2, '', 'v2')
  })

  onBeforeUnmount(() => _resetKeys(keysV2))

  watch(
    () => bank_network_load_list.value,
    () => {
      const currentPage = bank_network_load.value.currentPage || 1
      const startIndex = (currentPage - 1) * perPage

      tableProps.value.rows = bank_network_load_list.value.map(
        (item, index) => ({
          ...item,
          consecutive: startIndex + index + 1,
          upload_number: String(item.id),
        })
      )
      tableProps.value.pages.currentPage = bank_network_load.value.currentPage
      tableProps.value.pages.lastPage = bank_network_load.value.lastPage
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filters,
    alertModalRef,
    alertModalConfig,
    updatePage,
    updatePerPage,
    handleOptions,
    deleteBankNetworkLoad,
    handleFilter,
    handleClear,
    goToURL,
  }
}
