// Vue - Vue Router - Pinia
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

// Interfaces
import { IBulkUploadTemplatesList } from '@/interfaces/customs/fics/BulkUploadTemplates'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { operation_bulk_upload_template } from '@/constants'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useBulkUploadTemplatesStore } from '@/stores/fics/bulk-upload-templates'
import { IBaseTableProps } from '@/interfaces/global'

const BulkUploadTemplatesList = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { _getApiBulkUploadTemplates, _downloadExcelBulkUploadTemplates } =
    useBulkUploadTemplatesStore('v1')
  const { data_bulk_upload_templates_list, data_bulk_upload_templates_pages } =
    storeToRefs(useBulkUploadTemplatesStore('v1'))

  const filterFormat = ref()

  const headerBreadcrumbs = {
    title: 'Plantillas de cargues masivos',
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
      {
        label: 'Plantillas de cargues masivos',
        route: 'BulkUploadTemplatesList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
    btnBack: {
      name: 'FicsBulkUploadList',
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'operation',
      label: 'Operación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: operation_bulk_upload_template,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'created_date',
      label: 'Fecha de creación',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador plantilla',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
      prepend_icon: defaultIconsLucide.magnify,
    },
  ])

  const tableProps = ref<IBaseTableProps<IBulkUploadTemplatesList>>({
    title: 'Listado de plantillas',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'left',
        field: 'id',
        required: false,
        sortable: true,
      },
      {
        name: 'created_at',
        label: 'Fecha de creación',
        align: 'left',
        field: 'created_at',
        required: false,
        sortable: true,
      },
      {
        name: 'operation',
        label: 'Tipo de operación',
        align: 'left',
        field: 'operation',
        required: false,
        sortable: true,
      },
      {
        name: 'description',
        label: 'Descripción de plantilla',
        align: 'left',
        field: 'description',
        required: false,
        sortable: true,
      },
      {
        name: 'transaction_method',
        label: 'Forma de pago',
        align: 'left',
        field: 'transaction_method',
        format: (_, row) =>
          row?.transaction_method ? `${row?.transaction_method}` : '-',
        required: false,
        sortable: true,
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

    openMainLoader(true)

    await _getApiBulkUploadTemplates(filters)

    openMainLoader(false)
  }
  const handlerSearch = ($filters: {
    'filter[operation]': string
    'filter[created_date]': string
    'filter[search]': string
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

  const handlerClear = () => {
    tableProps.value.rows = []
  }

  const handleGoToCreate = () =>
    goToURL('BulkUploadTemplatesCreate', undefined, { reload: true })

  const handleGoToBack = () =>
    goToURL('FicsBulkUploadList', undefined, { reload: true })

  const handleGoToEdit = (id: string | number) =>
    goToURL('BulkUploadTemplatesEdit', id, { reload: true })

  const onDdownloadExcel = async (id: string) => {
    openMainLoader(true)

    await _downloadExcelBulkUploadTemplates(id)

    openMainLoader(false)
  }

  watch(
    data_bulk_upload_templates_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = data_bulk_upload_templates_pages.value
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
    handlerSearch,
    handleGoToBack,
    handleGoToEdit,
    onDdownloadExcel,
    handleGoToCreate,
    headerBreadcrumbs,
    defaultIconsLucide,
  }
}

export default BulkUploadTemplatesList
