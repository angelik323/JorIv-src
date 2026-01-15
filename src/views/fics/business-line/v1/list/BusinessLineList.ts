// Vue - Vue Router - Pinia - Quasar
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { ITabs } from '@/interfaces/global'
import {
  BusinessLineType,
  IBusinessLineItem,
} from '@/interfaces/customs/fics/BusinessLine'

// Composables
import {
  useUtils,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
} from '@/composables'

// Stores
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBusinessLineStore } from '@/stores/fics/business-line'

const useBusinessLineList = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getBusinessLineList, _cleanData } = useBusinessLineStore('v1')
  const {
    selected_type,
    business_line_list,
    business_line_pages,
    business_lines_name,
    participation_types_name,
  } = storeToRefs(useBusinessLineStore('v1'))

  const { status_business_line } = storeToRefs(useFicResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const filtersFormat = ref<Record<string, string | number>>({})
  const isTableEmpty = ref(true)
  const showState = ref(0)

  const keys = { fics: ['status_business_line'] }

  let perPage = 20

  const tableTitle = computed(() =>
    selected_type.value === business_lines_name.value
      ? 'Listado de líneas de negocio'
      : 'Listado de tipos de participación'
  )

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const headerProps = {
    title: 'Líneas de negocios y tipos de participación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      { label: 'Fics' },
      {
        label: 'Líneas de negocios y tipos de participación',
        route: 'BusinessLineList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
      to: 'BusinessLineCreate',
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: status_business_line,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre o código',
    },
  ])

  const tabs = ref<ITabs[]>([
    {
      name: business_lines_name.value,
      label: 'Líneas de negocio',
      icon: defaultIconsLucide.briefcase,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: participation_types_name.value,
      label: 'Tipos de participación',
      icon: defaultIconsLucide.user,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tableProps = ref({
    title: tableTitle,
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: (row: IBusinessLineItem) => `${row.code}`,
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: (row: IBusinessLineItem) => `${row.description}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'center',
        field: (row: IBusinessLineItem) => `${row.status_id}`,
      },
      {
        name: 'cancellation_reason',
        required: true,
        label: 'Motivo cancelación',
        align: 'left',
        field: (row: IBusinessLineItem) => `${row.cancellation_reason ?? '-'}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IBusinessLineItem[],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === selected_type.value)
  )

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
    }
    listAction(formatParamsCustom(filtersFormat.value))
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    listAction(formatParamsCustom(filtersFormat.value))
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }
    listAction(formatParamsCustom(filtersFormat.value))
  }

  const listAction = async (filters: string = '') => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _getBusinessLineList(filters)

    const hasResults = business_line_list.value.length > 0

    isTableEmpty.value = !hasResults
    showState.value = filters ? 1 : 0

    setTimeout(() => openMainLoader(false), 1000)
  }

  const selectType = (type: BusinessLineType) => {
    selected_type.value = type
    showState.value = 0
    isTableEmpty.value = true
    _cleanData()
  }

  onMounted(async () => {
    if (route.query.reload === 'true') await listAction()
    else {
      _cleanData()
      tableProps.value.rows = business_line_list.value
    }

    await _getResources(keys)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    () => business_line_list.value,
    () => (tableProps.value.rows = business_line_list.value)
  )

  watch(
    () => business_line_pages.value,
    () => (tableProps.value.pages = business_line_pages.value)
  )

  return {
    goToURL,
    showState,
    selectType,
    _cleanData,
    updatePage,
    tableProps,
    headerProps,
    handleFilter,
    isTableEmpty,
    filterConfig,
    filteredTabs,
    tabActiveIdx,
    selected_type,
    updatePerPage,
    validateRouter,
    defaultIconsLucide,
  }
}

export default useBusinessLineList
