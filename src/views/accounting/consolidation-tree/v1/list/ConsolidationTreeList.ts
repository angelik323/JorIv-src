import { useMainLoader, useRouteValidator } from '@/composables'
import { useResourceStore, useConsolidationTreeStore } from '@/stores'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const useConsolidationTreeList = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  const { headerPropsDefault, pages, data_consolidation_tree_list } =
    storeToRefs(useConsolidationTreeStore('v1'))
  const { _getListConsolidationTree, _toggleAccountStructureStatus } =
    useConsolidationTreeStore('v1')

  const { tree_status, account_structures_with_purpose } = storeToRefs(
    useResourceStore('v1')
  )
  const { _getAccountingResources } = useResourceStore('v1')

  const headerProperties = headerPropsDefault.value

  const filters = [
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      disable: false,
      options: account_structures_with_purpose,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      disable: false,
      options: tree_status,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      disable: false,
      icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por nombre o código de negocio',
    },
  ]
  const filterConfig = ref(filters)
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProperties = ref({
    title: 'Árbol de consolidación',
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
        name: 'name',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row) => `${row.code} - ${row.name}`,
        sortable: true,
      },
      {
        name: 'accounting_structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: (row) =>
          `${row.accounting_structure.code} - ${row.accounting_structure.purpose}`,
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
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: data_consolidation_tree_list.value,
    pages: pages,
    wrapCells: true,
  })

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la estructura de caja?',
    id: null as number | null,
    status_id: null as number | null,
  })

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const queryString = formatParamsCustom(filtersFormat.value)
    await _getListConsolidationTree(queryString ? '&' + queryString : '')
    tableProperties.value.loading = false
  }

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  const handleOptions = async (
    option: string,
    id: number,
    status_now?: number
  ) => {
    if (option === 'toggle_status' && id && status_now) {
      alertModalConfig.value.id = id
      alertModalConfig.value.status_id = status_now === 1 ? 2 : 1
      alertModalConfig.value.title = `¿Desea ${
        status_now !== 1 ? 'activar' : 'inactivar'
      } el árbol de consolidación?`
      await alertModalRef.value.openModal()
    }
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = ($filters: {
    'filter[account_structure_id]': string
    'filter[account_structure_structure]': string
    'filter[account_structure_purpose]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    listAction()
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

  const toggleConsolidationTreeStatus = async () => {
    if (!alertModalConfig.value.id) return
    if (!alertModalConfig.value.status_id) return

    openMainLoader(true)
    await alertModalRef.value.closeModal()
    await _toggleAccountStructureStatus(
      alertModalConfig.value.id,
      alertModalConfig.value.status_id
    )
    await listAction()
    openMainLoader(false)
  }

  watch(
    () => data_consolidation_tree_list.value,
    () => {
      tableProperties.value.rows = data_consolidation_tree_list.value
    }
  )

  const keys = ['tree_status', 'account_structures_with_purpose']

  onMounted(() => {
    _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  return {
    tableProperties,
    headerProperties,
    alertModalRef,
    alertModalConfig,
    filterConfig,
    handlerGoTo,
    handleOptions,
    handleFilterSearch,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,
    toggleConsolidationTreeStatus,
    validateRouter,
  }
}

export default useConsolidationTreeList
