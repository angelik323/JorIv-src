// Vue - Vue Router - Pinia - Quasar
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IMovementCodesItemList } from '@/interfaces/customs/fics/MovementCodes'
import { IFieldFilters } from '@/interfaces/customs/Filters'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useMovementCodesStore } from '@/stores/fics/movement-codes'
import { useResourceStore } from '@/stores/resources-selects'

const useMovementCodesList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getMovementCodesList } = useMovementCodesStore('v1')
  const { _getResourcesFics } = useResourceStore('v1')

  const { movement_codes_list, movement_codes_pages } = storeToRefs(
    useMovementCodesStore('v1')
  )
  const {
    movement_types_movement_codes,
    movement_classes_movement_codes,
    movement_nature_movement_codes,
    movement_group_movement_codes,
    generate_accounting,
    operation_class,
  } = storeToRefs(useResourceStore('v1'))

  const filtersFormat = ref<Record<string, string | number>>({})
  const hideFilters = ref<boolean>(true)
  const isTableEmpty = ref(true)
  const showState = ref(0)

  const keys = [
    'movement_types_movement_codes',
    'movement_group_movement_codes',
    'movement_nature_movement_codes',
    'movement_classes_movement_codes',
  ]

  const headerProps = {
    title: 'Códigos de movimiento',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Códigos de movimiento',
        route: 'MovementCodesList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'movement_type_id',
      label: 'Tipo de movimiento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: movement_types_movement_codes,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'movement_class_id',
      label: 'Clase de movimiento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: movement_classes_movement_codes,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'movement_nature_id',
      label: 'Naturaleza de movimiento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: movement_nature_movement_codes,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre o código',
      hide: false,
    },
    {
      name: 'movement_group_id',
      label: 'Grupo de movimiento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: movement_group_movement_codes,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'generate_accounting',
      label: 'Genera Contabilidad',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: generate_accounting,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'operation_class',
      label: 'Clase de operación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: operation_class,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'withholding_base',
      label: 'Base de retención',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      hide: true,
      placeholder: 'Inserte',
    },
  ])

  const tableProps = ref({
    title: 'Listado de códigos de movimiento',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'code',
        field: 'code',
        required: false,
        label: 'Código',
        align: 'left',
        sortable: true,
      },
      {
        name: 'description',
        field: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        sortable: true,
      },
      {
        name: 'movement_type_description',
        field: 'movement_type_description',
        required: false,
        label: 'Tipo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'movement_class_description',
        field: 'movement_class_description',
        required: false,
        label: 'Clase',
        align: 'left',
        sortable: true,
      },
      {
        name: 'movement_nature_description',
        field: 'movement_nature_description',
        required: false,
        label: 'Naturaleza',
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
    rows: [] as IMovementCodesItemList[],
    pages: movement_codes_pages.value,
  })

  const handleFilter = async ($filters: {
    'filter[movement_type_id]': string
    'filter[movement_class_id]': string
    'filter[movement_nature_id]': string
    'filter[search]': string
    'filter[movement_group_id]': string
    'filter[generate_accounting]': string
    'filter[operation_class]': string
    'filter[withholding_base]': string
  }) => await listAction({ ...$filters })

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value

    for (let i = 4; i < filterConfig.value.length; i++) {
      filterConfig.value[i].hide = hideFilters.value
    }
  }

  const handleClearFilters = async () => {
    showState.value = 0
    isTableEmpty.value = true
    tableProps.value.rows = []
  }

  const updatePage = async (page: number) =>
    await listAction({ ...filtersFormat.value, page })

  const updatePerPage = async (rowsPerPage: number) =>
    await listAction({ ...filtersFormat.value, rows: rowsPerPage })

  const listAction = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _getMovementCodesList(filters)

    const hasResults = movement_codes_list.value.length > 0

    isTableEmpty.value = !hasResults
    showState.value = filters ? 1 : 0

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onMounted(async () => {
    if (route.query.reload === 'true') await listAction({})

    await _getResourcesFics(`keys[]=${keys.join('&keys[]=')}`)
  })

  watch(
    () => movement_codes_list.value,
    () => {
      tableProps.value.rows = movement_codes_list.value
      tableProps.value.pages.currentPage =
        movement_codes_pages.value.currentPage
      tableProps.value.pages.lastPage = movement_codes_pages.value.lastPage
    },
    { deep: true }
  )

  return {
    goToURL,
    showState,
    tableProps,
    updatePage,
    headerProps,
    filterConfig,
    handleFilter,
    isTableEmpty,
    updatePerPage,
    defaultIconsLucide,
    handleClearFilters,
    handleShowMoreFilters,
  }
}

export default useMovementCodesList
