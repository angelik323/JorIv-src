// Vue - Pinia - Router - Quasar
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IUploadAccountingVoucherList } from '@/interfaces/customs/accounting/UploadAccountingVouchers'

// Composables
import {
  useAlert,
  useGoToUrl,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Stores
import { useUploadAccountingVouchersStore } from '@/stores/accounting/upload-accounting-vouchers'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useUploadAccountingVouchersList = () => {
  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide, formatParamsCustom: formatCustom } = useUtils()

  const { _getListAction } = useUploadAccountingVouchersStore('v2')

  const { _getResources } = useResourceManagerStore('v1')
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()

  const key_v2 = ['vouchers_uploaded_codes', 'vouchers_upload_process_statuses']

  const { vouchers_uploaded_codes, vouchers_upload_process_statuses } =
    storeToRefs(useAccountingResourceStore('v1'))

  const headerProps = {
    title: 'Cargue de comprobantes contables',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Cargue de comprobantes contables',
        route: 'UploadAccountingVouchersList',
      },
    ],
  }

  let perPage = 20

  const tableProperties = ref({
    title: 'Listado de comprobante',
    loading: false,
    columns: [
      {
        name: 'code',
        label: 'Cargue',
        field: 'code',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'file_name',
        label: 'Nombre archivo',
        field: 'file_name',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'uploaded_at',
        label: 'Fecha carga',
        field: (row: IUploadAccountingVoucherList) =>
          row.uploaded_at.split('T')[0],
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'user',
        label: 'Usuario',
        field: (row: IUploadAccountingVoucherList) => row.creator.full_name,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'total_count',
        label: 'Total registros',
        field: 'total_count',
        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: 'status',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IUploadAccountingVoucherList[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    rowsPerPage: perPage,
    selection: 'multiple',
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'uploaded_at',
      label: 'Fecha de cargue',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA/MM/DD',
    },
    {
      name: 'code',
      label: 'Cargue',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      options: [],
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      options: vouchers_upload_process_statuses,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'file_name',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      placeholder: 'Buscar por nombre de archivo',
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProperties.value.loading = true
    tableProperties.value.rows = []

    const result = await _getListAction(filters)

    if (result) {
      tableProperties.value.rows = result.rows
      tableProperties.value.pages.currentPage = result.currentPage
      tableProperties.value.pages.lastPage = result.lastPage
    }

    tableProperties.value.loading = false
  }

  const handleFilterSearch = ($filters: {
    'filter[uploaded_at]': string
    'filter[search]': string
  }) => {
    let uploadedAt = $filters['filter[uploaded_at]']

    if (uploadedAt) {
      const parts = uploadedAt.split('/')
      if (parts.length === 3) {
        uploadedAt = `${parts[2]}-${parts[1].padStart(
          2,
          '0'
        )}-${parts[0].padStart(2, '0')}`
      }
    }

    filtersFormat.value = {
      ...$filters,
      ...(uploadedAt ? { 'filter[uploaded_at]': uploadedAt } : {}),
    }

    const queryString = formatCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}
    tableProperties.value.rows = []
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
      rows: perPage,
    }

    const queryString = formatCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }

    const queryString = formatCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleDownloadFile = (row: IUploadAccountingVoucherList) => {
    const url = row.download_url

    if (!url) {
      showAlert('No se encontró el archivo para descargar.', 'error')
      return
    }

    window.open(url, '_blank')
  }

  const keys = {
    accounting: key_v2,
  }

  onMounted(async () => {
    await _getResources(keys, '', 'v2')
  })

  watch(
    vouchers_uploaded_codes,
    (val) => {
      const codeFilter = filterConfig.value.find((f) => f.name === 'code')
      if (codeFilter) {
        codeFilter.options = val.map((item) => ({
          ...item,
          value: item.id,
          label: String(item.code),
        }))
      }
    },
    { immediate: true }
  )

  return {
    headerProps,
    tableProperties,
    filterConfig,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    validateRouter,
    defaultIconsLucide,
    goToURL,
    handleDownloadFile,
  }
}

export default useUploadAccountingVouchersList
