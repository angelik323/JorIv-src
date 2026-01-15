import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useMainLoader, useUtils, useRouteValidator } from '@/composables'

// Store
import { useFiltersStore, useResourceStore } from '@/stores'
import { useUserModuleStore } from '@/stores/user-fidu'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { QTable } from 'quasar'

const useUserList = () => {
  const { openMainLoader } = useMainLoader()
  const { setFiltersState, setFilterState } = useFiltersStore()
  const { user_status, user_types, user_profile } = storeToRefs(
    useResourceStore('v1')
  )
  const { _getListAction } = useUserModuleStore('v1')
  const { users_list, users_pages, categorized } = storeToRefs(
    useUserModuleStore('v1')
  )
  const { document_types_user } = storeToRefs(useResourceStore('v1'))
  const { _getResourcesUsers } = useResourceStore('v1')
  const {
    formatFullName,
    defaultIconsLucide,
    formatParamsCustom,
    styleColumn,
  } = useUtils()
  const { validateRouter } = useRouteValidator()

  const statsProps = ref()

  const headerProps = {
    title: 'Gestión de usuarios',
    subtitle: '',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Usuarios',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3 q-mb-md',
      options: user_status.value,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'user_type',
      label: 'Tipo de usuario',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3',
      options: user_types.value,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'document_type_id',
      label: 'Tipo de documento',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3 q-mb-md',
      options: document_types_user.value,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'profile_type',
      label: 'Tipo de perfil',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3 q-mb-md',
      options: user_profile.value,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'created_at',
      label: 'Fecha de creación',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'user_code',
      label: 'Código de usuario',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4 q-mb-md',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código de usuario',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4 q-mb-md',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre o documento',
    },
  ])

  const tableProps = ref({
    title: 'Listado de usuarios',
    loading: false,
    columns: [
      {
        name: 'user_type',
        required: false,
        label: 'Tipo usuario',
        align: 'left',
        field: 'user_type',
        sortable: true,
      },
      {
        name: 'user_code',
        required: false,
        label: 'Código de usuario',
        align: 'left',
        field: 'user_code',
        sortable: true,
      },
      {
        name: 'created_at',
        required: false,
        label: 'Fecha creación',
        align: 'left',
        field: 'created_at',
        sortable: true,
      },
      {
        name: 'document_type_id',
        required: false,
        label: 'Tipo de documento',
        align: 'left',
        field: (row) => `${row.document_type.name}`,
        sortable: true,
      },
      {
        name: 'document',
        required: false,
        label: 'Número de documento',
        align: 'left',
        field: 'document',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombres',
        align: 'left',
        field: (row) =>
          formatFullName({
            firstName: row.name,
            middleName: row.second_name,
          }),
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'last_name',
        required: false,
        label: 'Apellidos',
        align: 'left',
        field: (row) =>
          formatFullName({
            lastName: row.last_name,
            secondLastName: row.second_last_name,
          }),
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'email',
        required: false,
        label: 'Correo electrónico',
        align: 'left',
        field: 'email',
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'phone',
        required: false,
        label: 'Número de contacto',
        align: 'left',
        field: 'phone',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => `${row.status_id}`,
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
    rows: [],
    pages: users_pages,
  })

  const setStatsProps = () => {
    statsProps.value = [
      {
        count: categorized.value?.status_active ?? 0,
        image: defaultIconsLucide.accountCheck,
        label: 'Activos',
      },
      {
        count: categorized.value?.status_inactive ?? 0,
        image: defaultIconsLucide.accountOff,
        label: 'Inactivos',
      },
      {
        count: categorized.value?.total ?? 0,
        image: defaultIconsLucide.accountMultiple,
        label: 'Total',
      },
    ]
  }

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    statsProps.value = []
    setStatsProps()
    tableProps.value.loading = false
  }

  const handleFilter = ($filters: {
    'filter[status_id]': string
    'filter[user_type]': string
    'filter[document_type_id]': number
    'filter[profile_type]': string
    'filter[created_at]': string
    'filter[user_code]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = $filters
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    cleanCategorizedTotals()
    setStatsProps()
    tableProps.value.rows = []
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRows = (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      limit: rows,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const cleanCategorizedTotals = () => {
    categorized.value.status_active = 0
    categorized.value.status_inactive = 0
    categorized.value.total = 0
  }

  const getSelectResources = async () => {
    await _getResourcesUsers('keys[]=document_types_user')
  }

  onMounted(async () => {
    openMainLoader(true)
    await getSelectResources()
    cleanCategorizedTotals()
    setStatsProps()
    setFiltersState(filterConfig.value)
    openMainLoader(false)
  })

  watch(document_types_user, (val) => {
    setFilterState(filterConfig.value, '2', val)
  })

  watch(
    () => users_list.value,
    () => {
      tableProps.value.rows = users_list.value
    }
  )

  watch(
    () => users_pages.value,
    () => {
      tableProps.value.pages = users_pages.value
    }
  )

  return {
    headerProps,
    tableProps,
    statsProps,

    // Methods
    handleFilter,
    handleClear,
    updatePage,
    updateRows,
    validateRouter,
  }
}

export default useUserList
