// vue - quasar - router - pinia
import { useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// store
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useExtendTrustStore } from '@/stores/trust-business/extend-trust'
import { useResourceManagerStore } from '@/stores/resources-manager'

// utils
import { formatParamsCustom } from '@/utils'

// interfaces
import { IExtendTrustInterface } from '@/interfaces/customs'

// composables
import { useCalendarRules, useRouteValidator } from '@/composables'

const useExtendTrustList = () => {
  // router
  const route = useRoute()

  // imports
  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  const { _getListAction, _clearData } = useExtendTrustStore('v1')

  const { extend_trust_list, extend_trust_pages } = storeToRefs(
    useExtendTrustStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { business_trust_statuses_extend } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const keys = {
    trust_business: ['business_trust_statuses_extend'],
  }

  const currentRowsPerPage = ref<number>(20)

  // props
  const headerProps = {
    title: 'Prórroga fideicomiso',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
        route: '',
      },
      {
        label: 'Prórroga fideicomiso',
        route: 'ExtendTrustList',
      },
    ],
  }

  // table
  const tableProps = ref({
    title: 'Listado de prórroga fideicomiso',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: 'ID',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_code',
        required: true,
        label: 'Código negocio',
        align: 'left',
        field: 'business_code',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'start_date',
        required: true,
        label: 'Fecha inicio',
        align: 'left',
        field: 'start_date',
        sortable: true,
      },
      {
        name: 'end_date',
        required: true,
        label: 'Fecha final',
        align: 'left',
        field: 'end_date',
        sortable: true,
      },
      {
        name: 'extension_date',
        required: true,
        label: 'Fecha prórroga actual',
        align: 'left',
        field: (row) => row.last_extension?.extension_date || '',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
      {
        name: 'observation',
        required: true,
        label: 'Observación',
        align: 'left',
        field: (row) => row.last_extension?.observation || '',
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
    rows: [] as IExtendTrustInterface[],
    pages: extend_trust_pages.value,
  })

  const start_date = ref<string>('')

  const filterConfig = ref([
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      clean_value: true,
      disable: false,
      option_calendar: (date: string) =>
        start_date.value
          ? useCalendarRules().only_after(start_date.value)(date)
          : true,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3 q-py-md',
      options: business_trust_statuses_extend,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3 q-py-md',
      disable: false,
      icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por nombre o código del negocio',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const filtersUpdate = (values: Record<string, string | number>) => {
    if (values['filter[start_date]']) {
      start_date.value = values['filter[start_date]'] as string
    } else {
      start_date.value = ''
    }
  }

  const handleFilter = ($filters: {
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[status_id]': string
    'filter[name]': string
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

  onMounted(async () => {
    await _getResources(keys)
    await _clearData()
    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _clearData()
  })

  watch(
    () => extend_trust_list.value,
    () => {
      tableProps.value.rows = extend_trust_list.value
      tableProps.value.pages = extend_trust_pages.value
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,

    handleFilter,
    handlerGoTo,
    updatePage,
    handleClearFilters,
    filtersUpdate,
    validateRouter,
    updateRowsPerPage,
  }
}

export default useExtendTrustList
