import { useMainLoader, useRouteValidator } from '@/composables'
import { useResourceStore, useCashFlowStructuresStore } from '@/stores'
import { ICashFlowStructures } from '@/interfaces/customs'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const useCashFlowStructuresList = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const { data_cash_flow_list, headerPropsDefault, pages } = storeToRefs(
    useCashFlowStructuresStore('v1')
  )
  const { _getListCashFlowStructures, _deleteAction } =
    useCashFlowStructuresStore('v1')
  const {
    account_structures,
    account_structure_structures,
    account_structure_purposes,
  } = storeToRefs(useResourceStore('v1'))
  const { _getResourcesTreasuries } = useResourceStore('v1')
  const { validateRouter } = useRouteValidator()

  const headerProperties = headerPropsDefault.value

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la estructura de caja?',
    id: null as number | null,
  })

  const filters = [
    {
      name: 'account_structure_id',
      label: 'Código estructura de flujo de caja',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-3 q-py-md',
      disable: false,
      options: account_structures,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'account_structure_structure',
      label: 'Estructura',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-3 q-py-md',
      disable: false,
      options: account_structure_structures,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'account_structure_purpose',
      label: 'Uso',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-3 q-py-md',
      disable: false,
      options: account_structure_purposes,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-3 q-py-md',
      disable: false,
      icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por nombre o código',
    },
  ]
  const filterConfig = ref(filters)
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProperties = ref({
    title: 'Listado de estructuras de flujo de caja',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'structure_code',
        required: true,
        label: 'Código estructura de flujo de caja',
        align: 'left',
        field: 'structure_code',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'name',
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'nature',
        label: 'Naturaleza',
        align: 'left',
        field: 'nature',
        sortable: true,
      },
      {
        name: 'activity_group',
        required: true,
        label: 'Grupo actividad',
        align: 'center',
        field: 'activity_group',
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
    rows: [] as ICashFlowStructures[],
    pages: pages,
    wrapCells: true,
  })

  const handleFilterSearch = ($filters: {
    'filter[account_structure_id]': string
    'filter[account_structure_structure]': string
    'filter[account_structure_purpose]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getListCashFlowStructures(filters)
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const updatePage = (pageNumber: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: pageNumber as number,
    }
    listAction()
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage as number,
    }
    listAction()
  }

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'edit':
        router.push({ name: 'CashFlowStructuresEdit', params: { id } })
        break
      case 'delete':
        if (id) {
          alertModalConfig.value.id = id
          await alertModalRef.value.openModal()
        }
        break
      default:
        break
    }
  }

  const changeStatus = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteAction(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  const keys = [
    'account_structures',
    'account_structure_structures',
    'account_structure_purposes',
  ]

  watch(
    () => data_cash_flow_list.value,
    () => {
      tableProperties.value.rows = data_cash_flow_list.value
    }
  )

  onMounted(() => {
    _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
  })

  return {
    headerProperties,
    tableProperties,
    alertModalRef,
    alertModalConfig,
    filterConfig,
    handleOptions,
    changeStatus,
    handleFilterSearch,
    handleClearFilters,
    handlerGoTo,
    updatePage,
    updateRowsPerPage,
    validateRouter,
  }
}

export default useCashFlowStructuresList
