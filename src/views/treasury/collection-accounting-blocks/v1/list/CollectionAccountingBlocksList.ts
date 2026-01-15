import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import {
  useUtils,
  useRules,
  useRouteValidator,
  useMainLoader,
  useGoToUrl,
} from '@/composables'
import { ITabs } from '@/interfaces/global'

import { IFieldFilters, ICollectionAccountingBlocksResponse } from '@/interfaces/customs'

import { useCollectionAccountingBlocksStore } from '@/stores/treasury/collection-accounting-blocks'
import { useAccountingParametersCollectionsStore } from '@/stores/treasury/accounting-parameters-collections'

const useCollectionAccountingBlocksList = () => {
  const {
    accounting_blocks_collections_list,
    accounting_blocks_collections_pages,
  } = storeToRefs(useCollectionAccountingBlocksStore('v1'))

  const {
    _getAccountingBlocksCollection,
    _deleteCollectionAccountingBlock,
    _setDataCollectionAccountingBlockSelected,
  } = useCollectionAccountingBlocksStore('v1')

  const { _downloadAccountingParametersCollections } = useAccountingParametersCollectionsStore('v1')

  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { min_length, max_length } = useRules()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const filtersFormat = ref<Record<string, string | number>>({})
  const collectionAccountingBlockSelected = ref<number | null>(null)
  const alertModalRef = ref()
  const alertModalAssociatedBusinessesRef = ref()

  const headerProps = {
    title: 'Bloques contables de recaudo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Bloques contables de recaudo',
        route: 'useCollectionAccountingBlocksList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Código o Nombre de bloque',
      rules: [
        (val: string) => max_length(val, 50),
        (val: string) => min_length(val, 3),
      ],
    },
  ])

  const tabs = ref<ITabs[]>([
    {
      name: 'acounting-collection-param',
      label: 'Parámetros contables de recaudo',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'commission',
      label: 'Comisiones',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'commission-param',
      label: 'Parámetros de comisiones',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])
  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      per_page: 20,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el bloque contable?',
    id: null as number | null,
  })

  const alertModalAssociatedBusinessesConfig = ref({
    title: 'Negocios asociados',
    id: 0 as number | 0,
  })

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    collectionAccountingBlockSelected.value = null
  }

  const handleView = (id: number) => {
    goToURL('AccountingParametersCollectionsView', { id })
  }

  const handleBusiness = (id: number) => {
    alertModalAssociatedBusinessesConfig.value.id = id
    alertModalAssociatedBusinessesRef.value.openModal()
  }

  const handleDelete = async (id: number) => {
    if (id) {
      alertModalConfig.value.id = id
      await alertModalRef.value.openModal()
    }
  }

  const tableProps = ref({
    title: 'Listado de bloques',
    loading: false,
    columns: [
      {
        name: 'select',
        label: '',
        field: 'id',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'code',
        label: 'Código bloque',
        field: 'code',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'description',
        label: 'Nombre bloque',
        field: 'description',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'collection_structure',
        label: 'Estructura de recaudo',
        field: (row: ICollectionAccountingBlocksResponse) =>
          `${row.collection_structure?.code ?? ''} - ${
            row.collection_structure?.purpose ?? ''
          }`,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'accounting_structure',
        label: 'Estructura contable',
        field: (row: ICollectionAccountingBlocksResponse) =>
          `${row.accounting_structure?.code ?? ''} - ${
            row.accounting_structure?.purpose ?? ''
          }`,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'cost_center_structure',
        label: 'Estructura de centro de costo',
        field: (row: ICollectionAccountingBlocksResponse) =>
          `${row.cost_center_structure?.code ?? ''} - ${
            row.cost_center_structure?.purpose ?? ''
          }`,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'no',
        label: 'Estructura flujo de caja',
        field: (row: ICollectionAccountingBlocksResponse) =>
          `${(row.cash_flow_structure?.code ?? '')} - ${(row.cash_flow_structure?.purpose ?? '')}`,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'budget_structure',
        label: 'Estructura presupuesto',
        field: (row: ICollectionAccountingBlocksResponse) =>
          `${row.budget_structure?.budget_item_code ?? ''} - ${
            row.budget_structure?.formatted_structure ?? ''
          }`,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        required: false,
      },
    ] as QTable['columns'],
    rows: [] as ICollectionAccountingBlocksResponse[],
    pages: accounting_blocks_collections_pages.value,
    rowsPerPage: 20,
    selection: 'multiple',
    selected: ref([]),
  })

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1,
      per_page: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getAccountingBlocksCollection(filters)
    tableProps.value.loading = false
  }

  const changeStatus = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteCollectionAccountingBlock(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  const downloadFile = async () => {
    openMainLoader(false)
    await _downloadAccountingParametersCollections([collectionAccountingBlockSelected.value] as number[])
    openMainLoader(false)
  }

  watch(
    () => accounting_blocks_collections_list.value,
    () => {
      tableProps.value.rows = accounting_blocks_collections_list.value
    }
  )

  watch(
    () => accounting_blocks_collections_pages.value,
    () => {
      tableProps.value.pages = accounting_blocks_collections_pages.value
    }
  )

  watch(collectionAccountingBlockSelected, () => {
    _setDataCollectionAccountingBlockSelected(
      collectionAccountingBlockSelected.value!
    )
  })

  return {
    headerProps,
    defaultIconsLucide,
    filterConfig,
    tableProps,
    alertModalRef,
    alertModalConfig,
    alertModalAssociatedBusinessesRef,
    alertModalAssociatedBusinessesConfig,

    collectionAccountingBlockSelected,
    tabs,
    filteredTabs,
    tabActive,
    tabActiveIdx,

    handleFilter,
    handleClear,
    handleView,
    handleBusiness,
    handleDelete,
    changeStatus,
    downloadFile,
    updatePage,
    updateRowsPerPage,
    validateRouter,
    goToURL,
  }
}

export default useCollectionAccountingBlocksList
