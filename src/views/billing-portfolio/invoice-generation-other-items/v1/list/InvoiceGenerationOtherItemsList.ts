// Vue - pinia - moment
import { ref, onMounted, computed, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import {
  IFieldFilters,
  IInvoiceGenerationOtherItemsList,
} from '@/interfaces/customs'

import {
  useAlert,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Stores
import {
  useInvoiceGenerationOtherItemsStore,
  useResourceManagerStore,
  useTrustBusinessResourceStore,
} from '@/stores'

const useInvoiceGenerationOtherItemsList = () => {
  const { _getInvoiceGenerationOtherItemsList, _clearData } =
    useInvoiceGenerationOtherItemsStore('v1')
  const {
    invoice_generation_other_items_list,
    invoice_generation_other_items_pages,
  } = storeToRefs(useInvoiceGenerationOtherItemsStore('v1'))

  const { business_trusts_value_is_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { validateRouter } = useRouteValidator()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()

  const {
    downloadFile,
    formatDate,
    formatCurrencyString,
    defaultIconsLucide,
    getBlobFromUrl,
  } = useUtils()
  const { goToURL } = useGoToUrl()
  const { max_length } = useRules()
  const { showAlert } = useAlert()

  let perPage = 20
  const viewerFileComponentRef = ref()

  const keys = {
    trust_business: ['business_trusts'],
  }

  const headerProps = {
    title: 'Generación de facturación otros conceptos',
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
        label: 'Generación de facturación otros conceptos',
        route: 'GenerateInvoicesOtherConceptsList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de facturas otros conceptos',
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
        name: 'invoice_number',
        field: 'invoice_number',
        required: true,
        label: 'N° de factura',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_code_snapshot',
        field: 'business_code_snapshot',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        sortable: true,
        format: (_, record) =>
          (record.business_code_snapshot ?? '') +
          ' - ' +
          (record.business_name_snapshot ?? ''),
      },
      {
        name: 'third_party_billing',
        field: (row) =>
          (row?.third_party_billing_document_type_snapshot ?? '') +
          ' - ' +
          (row?.third_party_billing_document_snapshot ?? '') +
          ' - ' +
          (row?.third_party_billing_name_snapshot ?? ''),
        required: true,
        label: 'Nombre del cliente',
        align: 'left',
        sortable: true,
      },
      {
        name: 'created_at',
        field: 'created_at',
        required: true,
        label: 'Fecha emisión',
        align: 'left',
        sortable: true,
        format: (val) => formatDate(val, 'YYYY-MM-DD'),
      },
      {
        name: 'total_amount',
        field: 'total_amount',
        required: true,
        label: 'Valor total',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val),
      },
      {
        name: 'status',
        field: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
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
    rows: [] as IInvoiceGenerationOtherItemsList[],
    pages: invoice_generation_other_items_pages.value,
  })

  const filterConfig = computed<IFieldFilters[]>(() => [
    {
      name: 'created_at',
      label: 'Fecha de emisión',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
    },
    {
      name: 'invoice_number',
      label: 'Número de factura',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [],
    },
    {
      name: 'business_code_snapshot',
      label: 'Nombre del negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts_value_is_code.value,
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
      placeholder: 'Buscar por nombre del cliente o numero de identificación',
      rules: [(val: string) => max_length(val, 50)],
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getInvoiceGenerationOtherItemsList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[created_at]': string
    'filter[invoice_number]': string
    'filter[business_code_snapshot]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    await listAction(filtersFormat.value)
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      rows: perPage,
      page,
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    await listAction({ ...filtersFormat.value, page: 1 })
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

  onBeforeMount(async () => {
    _clearData()
    _resetKeys({
      trust_business: ['business_trusts_value_is_code'],
    })
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys, `can_manage=true`)
    openMainLoader(false)
  })

  watch(
    invoice_generation_other_items_list,
    () => {
      tableProps.value.rows = [...invoice_generation_other_items_list.value]

      const { currentPage, lastPage } =
        invoice_generation_other_items_pages.value
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
    defaultIconsLucide,
    viewerFileComponentRef,

    handleFilter,
    updatePage,
    updatePerPage,
    handleClear,
    handleDownloadFile,
    validateRouter,
    goToURL,
    viewFile,
  }
}

export default useInvoiceGenerationOtherItemsList
