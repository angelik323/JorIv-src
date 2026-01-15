// Vue - pinia - moment
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { IFieldFilters, IBillingTrustList } from '@/interfaces/customs'

// Stores
import { useBillingTrustsStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { useRouter } from 'vue-router'

const useBillingTrustList = () => {
  const router = useRouter()
  const { _getBillingTrustsList, _clearData } = useBillingTrustsStore('v1')
  const { billing_trusts_list, billing_trusts_pages } = storeToRefs(
    useBillingTrustsStore('v1')
  )

  const selectedRowId = ref<number | null>(null)
  const selectedRow = computed(() =>
    tableProps.value.rows.find(
      (row: IBillingTrustList) => row.id === selectedRowId.value
    )
  )

  const filterConfig = computed<IFieldFilters[]>(() => [
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAA/MM/DD',
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAA/MM/DD',
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
      placeholder: 'Buscar por código o nombre',
      rules: [
        (val: string) =>
          !val || val.length <= 50 || 'Debe contener como máximo 50 caracteres',
      ],
    },
  ])

  const headerProps = {
    title: 'Definición inicial fideicomiso para facturación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Definición inicial fideicomiso para facturación',
        route: 'BillingTrustList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de definición inicial fideicomisos',
    loading: false,
    columns: [
      {
        name: 'selected',
        field: 'selected',
        label: '',
        align: 'center',
      },
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
        field: 'business_code_snapshot',
        required: true,
        label: 'Código negocio fiduciario',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_name_snapshot',
        field: 'business_name_snapshot',
        required: true,
        label: 'Nombre negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'start_date',
        field: 'start_date',
        required: true,
        label: 'Fecha inicial',
        align: 'left',
        sortable: true,
      },
      {
        name: 'end_date',
        field: 'end_date',
        required: true,
        label: 'Fecha final',
        align: 'left',
        sortable: true,
      },
      {
        name: 'periodicity',
        field: 'periodicity',
        required: true,
        label: 'Periodicidad',
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
    rows: [] as IBillingTrustList[],
    pages: billing_trusts_pages.value,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getBillingTrustsList(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const handleFilter = async ($filters: {
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
    }

    await listAction(filtersFormat.value)
  }

  const goToAccountingParams = () => {
    if (!selectedRow.value) return
    const { id, accounting_parameters } = selectedRow.value

    router.push({
      name: accounting_parameters
        ? 'AccountingParametersRead'
        : 'AccountingParametersCreate',
      params: { id },
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rowsPerPage

    await listAction(filtersFormat.value)
  }

  const handleClear = async () => {
    tableProps.value.rows = []
    filtersFormat.value = {}
  }

  onMounted(async () => {
    _clearData()
  })

  watch(
    billing_trusts_list,
    () => {
      tableProps.value.rows = billing_trusts_list.value.map((item) => ({
        ...item,
        selected: item.id === selectedRowId.value,
      }))

      const { currentPage, lastPage } = billing_trusts_pages.value
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
    selectedRow,
    selectedRowId,
    handleClear,
    updatePerPage,
    goToAccountingParams,
    handleFilter,
    updatePage,
  }
}

export default useBillingTrustList
