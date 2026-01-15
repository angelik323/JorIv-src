//Vue - Pinia
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

//Interfaces
import { IReportTemplateListItem } from '@/interfaces/customs/accounting/ReportTemplates'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'

//Composables
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useRouteValidator } from '@/composables/useRoutesValidator'

//Stores
import { useReportTemplatesStore } from '@/stores/accounting/report-templates'

const useReportTemplateList = () => {
  //Desestructuring and logic
  const { headerPropsDefault } = storeToRefs(useReportTemplatesStore('v2'))
  const { _getReportTemplate, _updateReportTemplate } =
    useReportTemplatesStore('v2')
  const { validateRouter } = useRouteValidator()
  const headerProperties = headerPropsDefault.value

  //Utils
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const valueRowReference = ref()
  const modalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea Inactivar/Activar el registro?',
    id: null as number | null,
  })
  //Filters and table config
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      type: 'q-input',
      class: 'col-12 col-md-12',
      label: 'Plantilla',
      placeholder: 'Buscar por código o nombre',
      value: null,
      options: [],
      clean_value: true,
      icon: defaultIconsLucide.search,
      autocomplete: true,
      disable: false,
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

  const tableProperties = ref<IBaseTableProps<IReportTemplateListItem>>({
    title: 'Listado de plantillas',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: 'Consecutivo',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre de la plantilla',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row: IReportTemplateListItem) => row.status?.id ?? '',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true

    const resp = await _getReportTemplate(filters)
    if (!resp) {
      tableProperties.value.pages = { currentPage: 0, lastPage: 0 }
      return
    }

    tableProperties.value.loading = false
    tableProperties.value.rows = [...resp?.data]
    tableProperties.value.pages = {
      currentPage: resp?.current_page,
      lastPage: resp?.last_page,
    }
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: { 'filter[search]': string }) => {
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

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const modifyStatus = async (id: number) => {
    modalRef.value = true
    valueRowReference.value = id
  }

  const submitDataModify = async () => {
    await _updateReportTemplate(valueRowReference.value)
  }

  return {
    headerProperties,
    filterConfig,
    tableProperties,
    defaultIconsLucide,
    modalRef,
    alertModalConfig,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    goToURL,
    modifyStatus,
    submitDataModify,
    validateRouter,
  }
}

export default useReportTemplateList
