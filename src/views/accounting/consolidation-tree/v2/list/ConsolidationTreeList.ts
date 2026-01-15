// Vue - pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IConsolidationTree } from '@/interfaces/customs/accounting/ConsolidationTree'

// Composables
import {
  useGoToUrl,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Stores
import { useConsolidationTreeStore } from '@/stores/accounting/consolidation-tree'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useConsolidationTreeList = () => {
  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide, formatParamsCustom, formatDate } = useUtils()
  const { goToURL } = useGoToUrl()

  const { headerPropsDefault, pages, data_consolidation_tree_list } =
    storeToRefs(useConsolidationTreeStore('v1'))
  const { _getListConsolidationTree } = useConsolidationTreeStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { business_trust_principal_structures, bussines_parent } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { business_trust_statuses } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const headerProperties = headerPropsDefault.value

  const filtersRef = ref()

  const filters = [
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable principal',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      options: business_trust_principal_structures,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'search',
      label: 'Negocio consolidador',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      options: bussines_parent,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'last_consolidation',
      label: 'Fecha última consolidación',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (val: string) =>
          val ? useRules().date_before_or_equal_to_the_current_date(val) : true,
      ],
    },
    {
      name: 'status_id',
      label: 'Estado negocio consolidador',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      options: business_trust_statuses,
      clean_value: true,
      placeholder: 'Todos',
    },
  ]
  const filterConfig = ref(filters)
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProperties = ref<IBaseTableProps<IConsolidationTree>>({
    title: 'Listado de árbol de consolidación ',
    loading: false,
    wrapCells: true,
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
        name: 'name',
        required: true,
        label: 'Negocio consolidador',
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
        name: 'last_consolidation',
        required: true,
        label: 'Fecha última consolidación',
        align: 'left',
        field: (row) =>
          row.last_consolidation
            ? formatDate(row.last_consolidation, 'YYYY-MM-DD')
            : '-',
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
        field: 'id', // No se puede dejar vacío
      },
    ],
    rows: data_consolidation_tree_list.value,
    pages: pages,
  })

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const queryString = formatParamsCustom(filtersFormat.value)
    await _getListConsolidationTree(queryString ? '&' + queryString : '')
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = ($filters: {
    'filter[account_structure_id]': string
    'filter[search]': string
    'filter[last_consolidation]': string
    'filter[status_id]': string
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

  const currentFilterAccountingStructureId = ref<number>(0)

  const handleUpdateFilterValues = async (filters: {
    [key: string]: string | number
  }) => {
    const accountingStructureId =
      filters['filter[accounting_structure_id]'] ?? 0
    if (accountingStructureId !== currentFilterAccountingStructureId.value) {
      currentFilterAccountingStructureId.value = Number(accountingStructureId)
      await _getResources(
        { accounting: ['bussines_parent'] },
        accountingStructureId
          ? `filter[account_structure_id]=${currentFilterAccountingStructureId.value}`
          : ''
      )
      filtersRef.value.setFieldValueByName('search', null)
    }
  }

  watch(
    () => data_consolidation_tree_list.value,
    () => {
      tableProperties.value.rows = data_consolidation_tree_list.value
    }
  )

  const keysV1 = {
    accounting: ['bussines_parent'],
    trust_business: ['business_trust_statuses'],
  }

  const keysV2 = {
    accounting: ['business_trust_principal_structures'],
  }

  onMounted(async () => {
    await _getResources(keysV1)
    await _getResources(keysV2, '', 'v2')
  })

  onBeforeUnmount(() => {
    _resetKeys(keysV1)
    _resetKeys(keysV2)
  })

  return {
    tableProperties,
    headerProperties,
    filterConfig,
    filtersRef,
    defaultIconsLucide,
    goToURL,
    handleFilterSearch,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,
    validateRouter,
    handleUpdateFilterValues,
  }
}

export default useConsolidationTreeList
