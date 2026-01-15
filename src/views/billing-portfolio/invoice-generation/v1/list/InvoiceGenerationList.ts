// Vue - pinia - moment
import { ref, onMounted, computed, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { IFieldFilters, IInvoiceGenerationList } from '@/interfaces/customs'

// Utils
import {
  useAlert,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Stores
import {
  useBillingCollectStore,
  useInvoiceGenerationStore,
  useResourceManagerStore,
  useSettlementCommissionsResourceStore,
  useTrustBusinessResourceStore,
} from '@/stores'

const useInvoiceGenerationList = () => {
  const { _getInvoiceGenerationList, _clearData } =
    useInvoiceGenerationStore('v1')
  const { invoice_generation_list, invoice_generation_pages } = storeToRefs(
    useInvoiceGenerationStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    commissions_class_catalog_with_name,
    commissions_type_catalog_with_name,
  } = storeToRefs(useSettlementCommissionsResourceStore('v1'))

  const { validateRouter } = useRouteValidator()
  const { business_trusts_value_is_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { status_invoices } = storeToRefs(useBillingCollectStore('v1'))

  const {
    formatCurrencyString,
    formatDate,
    getBlobFromUrl,
    defaultIconsLucide,
    downloadFile,
  } = useUtils()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  let perPage = 20

  const viewerFileComponentRef = ref()

  const keys = {
    settlement_commissions: [
      'commission_class_catalogs',
      'commission_type_catalogs',
    ],
    billing_collect: ['status-invoices'],
  }

  const headerProps = {
    title: 'Generación de facturas por comisión fiduciaria',
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
        label: 'Generación de facturas',
        route: 'GenerationCommissionInvoicesList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de facturas de comisiones',
    loading: false,
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
        name: 'business_code_snapshot',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        sortable: true,
        field: (row: IInvoiceGenerationList) =>
          row.settled_commission
            ? `${row.settled_commission.business_code_snapshot} - ${row.settled_commission.business_name_snapshot}`
            : '',
      },
      {
        name: 'created_at',
        field: 'created_at',
        required: true,
        label: 'Fecha de emisión',
        align: 'left',
        sortable: true,
        format: (val) => formatDate(val, 'YYYY-MM-DD'),
      },
      {
        name: 'observation',
        required: true,
        label: 'Concepto de factura',
        align: 'left',
        sortable: true,
        field: (row: IInvoiceGenerationList) =>
          row.settled_commission
            ? `${row.settled_commission.observation} `
            : '',
      },
      {
        name: 'commission_class_catalog',
        required: true,
        label: 'Clase de comisión',
        align: 'left',
        sortable: true,
        field: (row: IInvoiceGenerationList) =>
          row.settled_commission
            ? `${row.settled_commission.commission_class_catalog} `
            : '',
      },
      {
        name: 'commission_type_catalog',
        required: true,
        label: 'Tipo de comisión',
        align: 'left',
        sortable: true,
        field: (row: IInvoiceGenerationList) =>
          row.commission_type_catalog ? `${row.commission_type_catalog} ` : '',
      },
      {
        name: 'expire_at',
        field: 'expire_at',
        required: true,
        label: 'Fecha de vencimiento',
        align: 'left',
        sortable: true,
        format: (val) => val ?? '-',
      },
      {
        name: 'total_amount',
        required: true,
        label: 'Valor total',
        align: 'left',
        sortable: true,
        field: (row: IInvoiceGenerationList) =>
          row.settled_commission
            ? formatCurrencyString(row.settled_commission.total_amount, {
                currency: 'COP',
                locale: 'es-CO',
              })
            : '',
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        sortable: true,
        field: (row: IInvoiceGenerationList) =>
          row.status ? row.status.id : '',
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IInvoiceGenerationList[],
    pages: invoice_generation_pages.value,
  })

  const filterConfig = computed<IFieldFilters[]>(() => [
    {
      name: 'created_at',
      label: 'Fecha de la emisión',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      rules: [],
    },
    {
      name: 'commission_class_catalog',
      label: 'Clase de comisión',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-3',
      options: [
        { label: 'Todos', value: '' },
        ...commissions_class_catalog_with_name.value,
      ],
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'commission_type_catalog',
      label: 'Tipo de comisión',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-3',
      options: [
        { label: 'Todos', value: '' },
        ...commissions_type_catalog_with_name.value,
      ],
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-3',
      options: [{ label: 'Todos', value: '' }, ...status_invoices.value],
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'business_code_snapshot',
      label: 'Buscador',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: business_trusts_value_is_code.value,
      disable: false,
      autocomplete: true,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por código o nombre del negocio',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getInvoiceGenerationList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[created_at]': string
    'filter[commission_type_catalog]': string
    'filter[commission_class_catalog]': string
    'filter[status_id]': string
    'filter[business_code_snapshot]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      rows: perPage,
      page,
    })
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }

    listAction({
      ...filtersFormat.value,
      page: 1,
    })
  }

  const handleDownloadFile = async (url: string) => {
    openMainLoader(true)
    await downloadFile(url)
    openMainLoader(false)
  }

  const viewFile = async (fileProxy: string | null) => {
    if (!fileProxy) {
      return showAlert(`No hay archivo para mostrar`, 'error', undefined, 1000)
    }

    try {
      const blob = await getBlobFromUrl(fileProxy)
      await viewerFileComponentRef.value.showFile(blob)
    } catch (error) {
      showAlert(`Error al procesar el archivo`, 'error', undefined, 3000)
      return error
    }
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }

  watch(
    invoice_generation_list,
    () => {
      tableProps.value.rows = [...invoice_generation_list.value]

      const { currentPage, lastPage } = invoice_generation_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(
      { trust_business: ['business_trusts'] },
      `filter[status_id]=12,15,19,13&can_manage=true`
    )
    openMainLoader(false)
  })

  onBeforeMount(async () => {
    _resetKeys({
      ...keys,
      trust_business: ['business_trusts'],
      billing_collect: ['status_invoices'],
    })
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    viewerFileComponentRef,
    defaultIconsLucide,

    handleFilter,
    updatePage,
    updatePerPage,
    handleDownloadFile,
    viewFile,
    handleClear,
    validateRouter,
    goToURL,
  }
}

export default useInvoiceGenerationList
