// vue | quasar | router
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import {
  useInvestmentPortfolioResourceStore,
  useManualUnitValueStore,
  useResourceManagerStore,
} from '@/stores'

// composables
import { useMainLoader, useRouteValidator } from '@/composables'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { IManualUnitValueForm } from '@/interfaces/customs'

const useManualUnitValueList = () => {
  const router = useRouter()
  const { validateRouter } = useRouteValidator()
  const { _getListAction, _deleteManualUnitValue } =
    useManualUnitValueStore('v1')
  const { manual_unit_value_list, manual_unit_value_pages } = storeToRefs(
    useManualUnitValueStore('v1'),
  )
  const { issuer_seller } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1'),
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()

  // props
  const headerProps = {
    title: 'Registro manual valor unidad',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
        route: '',
      },
      {
        label: 'Registro manual valor unidad',
        route: 'ManualUnitValueList',
      },
    ],
  }
  const tableProps = ref({
    title: 'Listado registro manual valor unidad',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
        format: (val) => val || 'Sin registro',
      },
      {
        name: 'emitter_id',
        required: false,
        label: 'ID Emisor',
        align: 'left',
        field: 'emitter_id',
        sortable: true,
        format: (val) => val || 'Sin registro',
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
        format: (val) => val || 'Sin registro',
      },
      {
        name: 'participation_description',
        required: true,
        label: 'Participación',
        align: 'left',
        field: 'participation_description',
        sortable: true,
        format: (val) => val || 'Sin registro',
      },
      {
        name: 'action_type',
        required: true,
        label: 'Acciones',
        align: 'left',
        field: 'action_type',
        sortable: true,
        format: (val) => val || 'Sin registro',
      },
      {
        name: 'start_date',
        required: true,
        label: 'Fecha inicial',
        align: 'left',
        field: 'start_date',
        sortable: true,
        format: (val) => val || 'Sin registro',
      },
      {
        name: 'end_date',
        required: true,
        label: 'Fecha final',
        align: 'left',
        field: 'end_date',
        sortable: true,
        format: (val) => val || 'Sin registro',
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IManualUnitValueForm[],
    pages: manual_unit_value_pages,
  })

  const filterConfig = ref([
    {
      name: 'emitter_id',
      label: 'Emisor',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6 q-py-md',
      options: issuer_seller,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  // handlers / actions
  const handleFilter = ($filters: {
    'filter[search]': string
    'filter[emitter_id]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: 20,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  // modal
  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription()
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = () => {
    return `¿Desea eliminar el registro valor unidad?`
  }
  const changeStatusAction = async () => {
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteManualUnitValue(alertModalConfig.value.entityId as number)
    listAction('')
    openMainLoader(false)
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  // lifecycle hooks
  const keys = {
    investment_portfolio: ['issuer_seller'],
  }

  onBeforeMount(() => {
    _resetKeys(keys)
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  // watchers
  watch(
    () => manual_unit_value_list.value,
    () => {
      tableProps.value.rows = manual_unit_value_list.value
      tableProps.value.pages = manual_unit_value_pages.value
    },
  )

  return {
    alertModalConfig,
    alertModalRef,
    filtersFormat,
    filterConfig,
    headerProps,
    tableProps,
    handleClearFilters,
    changeStatusAction,
    openAlertModal,
    updatePerPage,
    handleFilter,
    handlerGoTo,
    updatePage,
    validateRouter,
  }
}

export default useManualUnitValueList
