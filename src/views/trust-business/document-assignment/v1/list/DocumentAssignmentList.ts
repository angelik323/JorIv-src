// vue - quasar - router
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// pinia
import { storeToRefs } from 'pinia'

// store
import { useDocumentAssignmentStore } from '@/stores/trust-business/document-assignment'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// interfaces
import { IDocumentAssignmentList } from '@/interfaces/customs/trust-business/DocumentAssignment'

// composables
import { useCalendarRules, useRouteValidator, useUtils } from '@/composables'
import moment from 'moment'

const useDocumentAssignmentList = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const { validateRouter } = useRouteValidator()

  const { _getListAction, _downloadExcel } = useDocumentAssignmentStore('v1')

  const { document_assignment_list, document_assignment_pages } = storeToRefs(
    useDocumentAssignmentStore('v1')
  )

  // props
  const headerProps = {
    title: 'Asignación de documentos por negocio',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'homeView',
      },
      {
        label: 'Negocios Fiduciarios',
        route: 'DocumentAssigns',
      },
      {
        label: 'Asignación de documentos por negocio',
        route: 'DocumentAssignmentList',
      },
    ],
  }

  // table
  const tableProps = ref({
    title: 'Listado de asignación de documentos por negocio',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: (row: IDocumentAssignmentList) =>
          `${row.business?.business_code} - ${row.business?.name}`,
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción del documento',
        align: 'left',
        field: (row: IDocumentAssignmentList) =>
          `${row.document_type?.description}`,
        sortable: true,
      },
      {
        name: 'date',
        required: true,
        label: 'Fecha de creación',
        align: 'left',
        field: (row: IDocumentAssignmentList) =>
          `${useUtils().formatDate(row.created_at ?? '', 'YYYY-MM-DD')}`,
        sortable: true,
      },
      {
        name: 'upload_date',
        required: true,
        label: 'Fecha de carga/actualización',
        align: 'left',
        field: (row: IDocumentAssignmentList) =>
          `${useUtils().formatDate(row.updated_at ?? '', 'YYYY-MM-DD')}`,
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
    rows: [] as IDocumentAssignmentList[],
    pages: document_assignment_pages.value,
  })

  const filterConfig = ref([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre del negocio o descripción del documento',
    },
    {
      name: 'date_creation',
      label: 'Fecha de creación',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      disable: false,
      clean_value: true,
      option_calendar: useCalendarRules().only_until(
        moment().format('YYYY-MM-DD')
      ),
    },
    {
      name: 'date_updated',
      label: 'Fecha de carga/actualización',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      disable: false,
      clean_value: true,
      option_calendar: useCalendarRules().only_until(
        moment().format('YYYY-MM-DD')
      ),
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const currentRowsPerPage = ref<number>(20)

  const handleFilter = ($filters: {
    'filter[search]': string
    'filter[date_creation]': string
    'filter[date_updated]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: currentRowsPerPage.value,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const uploadFileExcel = async () => {
    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const ids: number[] = document_assignment_list.value
      .map((item) => (item.id ? Number(item.id) : 0))
      .filter((id) => id > 0)

    await _downloadExcel(formatParamsCustom(filtersFormat.value), ids)
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    currentRowsPerPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  watch(
    () => document_assignment_list.value,
    () => {
      tableProps.value.rows = document_assignment_list.value
      tableProps.value.pages = document_assignment_pages.value
    },
    { immediate: true, deep: true }
  )

  // lifecycle
  onMounted(async () => {
    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,

    handleFilter,
    handlerGoTo,
    updatePage,
    handleClearFilters,
    uploadFileExcel,
    validateRouter,
    updateRowsPerPage,
  }
}

export default useDocumentAssignmentList
