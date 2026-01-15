// Vue - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { IBulkUploadList } from '@/interfaces/customs/fics/BulkUpload'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { bulk_upload_status_id } from '@/constants'

// Composables
import { useUtils, useGoToUrl, useMainLoader } from '@/composables'

// Stores
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBulkUploadFicsStore } from '@/stores/fics/bulk-upload'
import { IBaseTableProps } from '@/interfaces/global'

const useBulkUploadList = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { data_bulk_upload_list, data_bulk_upload_pages } = storeToRefs(
    useBulkUploadFicsStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getApiBulkUpload } = useBulkUploadFicsStore('v1')
  const { offices } = storeToRefs(useFicResourceStore('v1'))

  const filterFormat = ref()

  const keys = {
    fics: ['offices'],
  }

  const headerBreadcrumbs = {
    title: 'Cargues masivos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Cargues masivos',
        route: 'FicsBulkUploadList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'id',
      label: 'Código de cargue',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
    },
    {
      name: 'created_at',
      label: 'Fecha de operación',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
      prepend_icon: defaultIconsLucide.magnify,
    },
    {
      name: 'office_id',
      label: 'Oficina',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: offices,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: bulk_upload_status_id,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<IBaseTableProps<IBulkUploadList>>({
    title: 'Listado de cargues masivos',
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
        name: 'id',
        label: 'Código de cargue',
        align: 'left',
        field: 'id',
        required: false,
        sortable: true,
      },
      {
        name: 'created_at',
        label: 'Fecha de operación',
        align: 'left',
        field: 'created_at',
        required: false,
        sortable: true,
      },
      {
        name: 'fund',
        label: 'Fondo de inversión',
        align: 'left',
        field: 'fund',
        required: false,
        sortable: true,
        format(_, row) {
          return `${row.fund?.fund_code} - ${row.fund?.fund_name}`
        },
      },
      {
        name: 'office',
        label: 'Oficina',
        align: 'left',
        field: 'office',
        required: false,
        sortable: true,
        format(_, row) {
          return `${row.office?.office_code} - ${row.office?.office_description}`
        },
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'left',
        field: 'status',
        required: false,
        sortable: true,
        format(row) {
          return row.status?.id
        },
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'left',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getApiBulkUpload(filters)
    tableProps.value.loading = false
  }

  const handlerSearch = ($filters: {
    'filter[id]': string
    'filter[created_at]': string
    'filter[search]': string
    'filter[office_id]': string
    'filter[status_id]': string
  }) => {
    filterFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filterFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
    if (!filterFormat.value) return

    const queryString = formatParamsCustom({
      ...filterFormat.value,
      page,
    })

    listAction(`&${queryString}`)
  }

  const updateRows = (per_page: number) => {
    const queryString = formatParamsCustom({
      ...filterFormat.value,
      per_page,
    })

    listAction(`&${queryString}`)
  }

  const handlerClear = () => (tableProps.value.rows = [])

  const handleOptions = (type: string, id: string) => {
    openMainLoader(true)
    switch (type) {
      case 'view':
        goToURL('FicsBulkUploadView', id)
        break
      case 'authorize':
        goToURL('FicsBulkUploadAuthorize', id)
        break
      case 'anular':
        goToURL('FicsBulkUploadAnnular', id)
        break
    }
    openMainLoader(false)
  }

  const handleGoToCreate = () =>
    goToURL('FicsBulkUploadCreate', undefined, { reload: true })

  onMounted(async () => await _getResources(keys))

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    data_bulk_upload_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = data_bulk_upload_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    goToURL,
    updateRows,
    tableProps,
    updatePage,
    filterConfig,
    handlerClear,
    handleOptions,
    handlerSearch,
    handleGoToCreate,
    headerBreadcrumbs,
    defaultIconsLucide,
  }
}

export default useBulkUploadList
