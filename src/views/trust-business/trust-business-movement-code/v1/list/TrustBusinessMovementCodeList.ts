// vue - quasar - router - pinia
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

// stores
import { useTrustBusinessMovementCodesStore } from '@/stores/trust-business/movement-codes'
import { useResourceStore } from '@/stores/resources-selects'

// utils
import { formatParamsCustom } from '@/utils'

// interfaces
import { ITrustBusinessMovementCodesCreate } from '@/interfaces/customs/trust-business/MovementCodes'

// composables
import { useMainLoader, useRouteValidator } from '@/composables'

const useBusinessTrustMovementCodesList = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const { validateRouter } = useRouteValidator()

  const { _getListAction, _changeStatusAction, _dowloadCodeList } =
    useTrustBusinessMovementCodesStore('v1')

  const {
    business_trust_movement_codes_pages,
    business_trust_movement_codes_list,
  } = storeToRefs(useTrustBusinessMovementCodesStore('v1'))

  const keys = [
    'movement_codes_natures',
    'movement_codes_types',
    'collection_shapes',
    'funds_movements',
    'movement_codes',
  ]

  const currentRowsPerPage = ref<number>(20)

  const { openMainLoader } = useMainLoader()

  const { _getTrustBusinessResources } = useResourceStore('v1')

  const { movement_codes_natures, movement_codes_types } = storeToRefs(
    useResourceStore('v1')
  )

  // props
  const headerProps = {
    title: 'Código de movimiento de negocios fiduciarios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
      },
      {
        label: 'Código de movimiento de negocio',
        route: 'TrustBusinessMovementCodesList',
      },
    ],
  }

  // table
  const tableProps = ref({
    title: 'Listado de códigos de movimiento negocios fiduciarios',
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
        name: 'code',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción de movimento',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'nature',
        required: false,
        label: 'Naturaleza',
        align: 'center',
        field: 'nature',
        sortable: true,
      },
      {
        name: 'movement',
        required: false,
        label: 'Clase de movimiento negocios',
        align: 'center',
        field: 'movement',
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
    rows: [] as ITrustBusinessMovementCodesCreate[],
    pages: business_trust_movement_codes_pages.value,
  })

  // filter
  const filterConfig = ref([
    {
      name: 'nature',
      label: 'Naturaleza',
      type: 'q-select',
      value: null,
      class: 'col-4 q-py-md',
      options: movement_codes_natures,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'movement',
      label: 'Clase de movimento negocios',
      type: 'q-select',
      value: null,
      class: 'col-4 q-py-md',
      options: movement_codes_types,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-4 q-py-md',
      disable: false,
      icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por nombre o código de movimiento',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[nature]': string
    'filter[movement]': string
    'filter[search]': string
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

  const updateRowsPerPage = (rows: number) => {
    currentRowsPerPage.value = rows
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1,
      rows: rows,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const downloadExcel = async () => {
    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    _dowloadCodeList(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el código de movimiento?`
  }

  const changeStatusAction = async () => {
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _changeStatusAction(alertModalConfig.value.entityId as number)
    await listAction()
    openMainLoader(false)
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onMounted(async () => {
    await _getTrustBusinessResources(`keys[]=${keys.join('&keys[]=')}`)
    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
  })

  watch(
    () => business_trust_movement_codes_list.value,
    () => {
      tableProps.value.rows = business_trust_movement_codes_list.value
      tableProps.value.pages = business_trust_movement_codes_pages.value
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    alertModalRef,

    downloadExcel,
    handleClearFilters,
    handleFilter,
    handlerGoTo,
    updatePage,
    updateRowsPerPage,
    openAlertModal,
    changeStatusAction,
    validateRouter,
  }
}
export default useBusinessTrustMovementCodesList
