// Vue - pinia - moment
import { ref, onMounted, computed, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import {
  IFieldFilters,
  ISupportingDocumentItemList,
} from '@/interfaces/customs'

// Utils
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Stores
import { useSupportingDocumentsStore } from '@/stores/settlement-commissions/supporting-documents'
import { useBillingCollectStore } from '@/stores/resources-manager/billing-collect'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'

const useSupportingDocumentsList = () => {
  const { _getSupportingDocumentsList, _getDownloadDocuments, _clearData } =
    useSupportingDocumentsStore('v1')
  const { supporting_documents_list, supporting_documents_pages } = storeToRefs(
    useSupportingDocumentsStore('v1')
  )

  const { payment_methods, status_support_document } = storeToRefs(
    useBillingCollectStore('v1')
  )

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { formatCurrency, defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { max_length } = useRules()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  let perPage = 20

  const headerProps = {
    title: 'Documentos soporte',
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
        label: 'Documentos soporte',
        route: 'SupportingDocumentsList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de documentos soporte',
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
        name: 'support_document_number',
        field: 'support_document_number',
        required: true,
        label: 'Número de documento soporte',
        align: 'left',
        sortable: true,
        format: (val) => val ?? '-',
      },
      {
        name: 'third_party',
        field: (row) =>
          (row?.third_party_billing?.type_document ?? '') +
          ' - ' +
          (row?.third_party_billing?.document ?? '') +
          ' - ' +
          (row?.third_party_billing?.name ?? ''),
        required: true,
        label: 'Tercero',
        align: 'left',
        sortable: true,
      },
      {
        name: 'created_at',
        field: 'created_at',
        required: true,
        label: 'Fecha de elaboración',
        align: 'left',
        sortable: true,
      },
      {
        name: 'payment_methods',
        field: 'payment_methods',
        required: true,
        label: 'Forma de pago',
        align: 'left',
        sortable: true,
      },
      {
        name: 'total_amount',
        field: 'total_amount',
        required: true,
        label: 'Valor total',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrency(val),
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'status',
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as ISupportingDocumentItemList[],
    pages: supporting_documents_pages.value,
  })

  const filterConfig = computed<IFieldFilters[]>(() => [
    {
      name: 'production_date',
      label: 'Fecha de elaboración',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
    },
    {
      name: 'payment_methods',
      label: 'Forma de pago',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: payment_methods.value,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'third_party_billing',
      label: 'Tercero',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      options: third_parties.value,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por tercero de facturación',
      autocomplete: true,
      rules: [],
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-2',
      options: [
        { value: '', label: 'Todos' },
        ...status_support_document.value,
      ],
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'support_document_number',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por número de documento soporte',
      rules: [(val: string) => max_length(val, 50)],
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getSupportingDocumentsList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[production_date]': string
    'filter[payment_methods]': string
    'filter[third_party_billing]': string
    'filter[status_id]': string
    'filter[support_document_number]': string
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

  const handleDownloadSupportingDocument = async (id: number) => {
    openMainLoader(true)
    await _getDownloadDocuments(id)
    openMainLoader(false)
  }

  const keys = {
    billing_collect: ['payment_methods', 'status_support_document'],
  }

  onBeforeMount(async () => {
    _clearData()
    _resetKeys(keys)
    _resetKeys({ third_party: ['third_parties'] })
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(
      { third_party: ['third_parties'] },
      'include=documentType,naturalPerson,legalPerson&filter[is_customer]=1&fields[]=id,document,document_type_id'
    )
    openMainLoader(false)
  })

  watch(
    supporting_documents_list,
    () => {
      tableProps.value.rows = [...supporting_documents_list.value]

      const { currentPage, lastPage } = supporting_documents_pages.value
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

    handleFilter,
    updatePage,
    updatePerPage,
    handleClear,
    goToURL,
    validateRouter,
    handleDownloadSupportingDocument,
  }
}

export default useSupportingDocumentsList
