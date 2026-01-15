import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

import {
  useUtils,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
} from '@/composables'

import { IFieldFilters, IReportTemplatesResponse } from '@/interfaces/customs'

import { useReportTemplatesStore } from '@/stores'

const useReportTemplatesList = () => {
  const route = useRoute()

  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const reportTemplatesStore = useReportTemplatesStore('v1')

  const { report_templates_list, report_templates_pages } =
    storeToRefs(reportTemplatesStore)
  const { _listAction } = reportTemplatesStore

  const filtersFormat = ref<Record<string, string | number>>({})
  const isReportTemplatesEmpty = ref(true)
  const showState = ref(0)

  let perPage = 20

  const headerProperties = {
    title: 'Plantilla de reportes',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Plantilla de reportes',
        route: 'ReportTemplatesList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre del informe',
    },
  ])

  const tableProperties = ref({
    title: 'Listado de plantilla de reportes',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'center',
        label: '#',
        field: 'id',
      },
      {
        name: 'code',
        align: 'left',
        label: 'Código de informe',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        align: 'left',
        label: 'Nombre del informe',
        field: 'name',
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'actions',
      },
    ] as QTable['columns'],
    customColumns: ['actions'],
    rows: [] as IReportTemplatesResponse[],
    pages: report_templates_pages,
  })

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProperties.value.rows = []

    await _listAction(filters)

    const hasResults = report_templates_list.value.length > 0

    showState.value = filters ? 1 : 0
    isReportTemplatesEmpty.value = !hasResults

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleFilter = async ($filters: { 'filter[search]': string }) =>
    await loadData({ ...$filters })

  const handleOptions = (action: string, id: number) => {
    if (action === 'edit') goToURL('ReportTemplatesEdit', id)
    else if (action === 'view') goToURL('ReportTemplatesView', id)
  }

  const handleClearFilters = () => {
    showState.value = 0
    filtersFormat.value = {}
    tableProperties.value.rows = []
    isReportTemplatesEmpty.value = true
  }

  const handleUpdatePage = async (page: number) =>
    await loadData({ ...filtersFormat.value, page })

  const handleUpdatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage

    await loadData({ ...filtersFormat.value, rows: perPage })
  }

  watch(
    () => report_templates_list.value,
    () => {
      tableProperties.value.rows = report_templates_list.value
      tableProperties.value.pages = report_templates_pages.value
    }
  )

  onMounted(() => {
    if (route.query.reload === 'true') loadData({})
  })

  return {
    goToURL,
    showState,
    handleFilter,
    filterConfig,
    handleOptions,
    validateRouter,
    tableProperties,
    headerProperties,
    handleUpdatePage,
    handleClearFilters,
    defaultIconsLucide,
    handleUpdatePerPage,
    isReportTemplatesEmpty,
  }
}

export default useReportTemplatesList
