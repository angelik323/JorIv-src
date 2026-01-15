// Vue - pinia - moment
import { ref, onMounted, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  IFieldFilters,
  ITrustCommissionCollectionItemList,
} from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustCommissionCollectionStore } from '@/stores/billing-portfolio/trust-commission-collection'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useTrustCommissionCollectionList = () => {
  const { _getTrustCommissionCollectionList } =
    useTrustCommissionCollectionStore('v1')

  const { business_trusts_value_is_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { formatDate, defaultIconsLucide, formatCurrency } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const selected = ref<ITrustCommissionCollectionItemList[]>([])

  const keys = {
    trust_business: ['business_trusts'],
  }

  const headerProps = {
    title: 'Recaudo comisión fiduciaria',
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
        label: 'Recaudo de comisión fiduciaria',
        route: 'CollectionTrustCommissionList',
      },
    ],
  }

  const tableProps = ref<IBaseTableProps<ITrustCommissionCollectionItemList>>({
    title: 'Listado de facturas',
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
        name: 'business_code',
        field: (row) => `${row.business_code} - ${row.business_name}`,
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'invoice_number',
        field: 'invoice_number',
        required: true,
        label: 'Número factura',
        align: 'left',
        sortable: true,
        format: (val: string) => val ?? '-',
      },
      {
        name: 'init_date',
        field: 'init_date',
        required: true,
        label: 'Fecha de emisión',
        align: 'left',
        sortable: true,
        format: (val: string) => formatDate(val, 'YYYY-MM-DD'),
      },
      {
        name: 'third_party',
        field: (row: ITrustCommissionCollectionItemList) =>
          row.third_party_billing.id
            ? `${row.third_party_billing.third_party_document_type} - ${row.third_party_billing.third_party_document} - ${row.third_party_billing.third_party_name}`
            : '-',
        required: true,
        label: 'Tercero',
        align: 'left',
        sortable: true,
      },
      {
        name: 'total',
        field: 'total',
        required: true,
        label: 'Valor total',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrency(val),
      },
      {
        name: 'expire_at',
        field: 'expire_at',
        required: true,
        label: 'Fecha de vencimiento',
        align: 'left',
        sortable: true,
        format: (val: string) => formatDate(val, 'YYYY-MM-DD'),
      },
      {
        name: 'status',
        field: 'status_id',
        required: true,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'expire_date',
      label: 'Fecha de vencimiento',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [],
    },
    {
      name: 'init_date',
      label: 'Fecha de emisión',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [],
    },
    {
      name: 'invoice_number',
      label: 'No. Factura',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string) =>
          !val || val.length <= 12 || 'Debe contener como máximo 12 caracteres',
      ],
    },
    {
      name: 'business_trust',
      label: 'Nombre del negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-md-3',
      options: business_trusts_value_is_code,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder:
        'Buscar por nombre o número de documento del titular de la factura',
      rules: [
        (val: string) =>
          !val || val.length <= 50 || 'Debe contener como máximo 50 caracteres',
      ],
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number | boolean>
  >({
    page: 1,
    rows: 20,
    'filter[only_registered]': true,
  })

  const listAction = async (
    filters: Record<string, string | number | boolean>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const result = await _getTrustCommissionCollectionList(filters)

    if (result) {
      tableProps.value.rows = result.list
      tableProps.value.pages = {
        currentPage: result.pages.currentPage,
        lastPage: result.pages.lastPage,
      }
    }
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[init_date]': string
    'filter[expire_date]': string
    'filter[invoice_number]': string
    'filter[business_trust]': string | number
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

  const handleCollection = async () => {
    localStorage.setItem(
      'trust-commission-collection-store-v1',
      selected.value.map((item) => item.id).join(',')
    )
    goToURL('CollectionTrustCommissionCreate')
  }

  const clearFilters = () => {
    tableProps.value.rows = []
    selected.value = []
  }

  onBeforeMount(async () => {
    _resetKeys({
      trust_business: ['business_trusts_value_is_code'],
    })
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    selected,
    defaultIconsLucide,

    handleFilter,
    updatePage,
    updatePerPage,
    handleCollection,
    clearFilters,
    validateRouter,
    goToURL,
  }
}

export default useTrustCommissionCollectionList
