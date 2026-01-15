import { formatParamsCustom, defaultIconsLucide } from '@/utils'
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import router from '@/router'

import { IFieldFilters, ISelectorResources } from '@/interfaces/customs'
import { useResourceStore, usePucAccountEquivalenceStore } from '@/stores'

const usePucAccountEquivalenceList = () => {
  const accountEquivalenceStore = usePucAccountEquivalenceStore('v1')
  const resourcesStore = useResourceStore('v1')

  const {
    puc_source_account_structures,
    puc_equivalences_account_structures,
    puc_equivalence_fiscal_account_structures,
    puc_account_equivalence_types,
  } = storeToRefs(resourcesStore)
  const { _getAccountingResources } = resourcesStore

  const { account_equivalence_list, account_equivalence_pages } = storeToRefs(
    accountEquivalenceStore
  )
  const { _listAction } = accountEquivalenceStore

  const filtersFormat = ref<Record<string, string | number>>({})
  const selectSourceStructures = ref<ISelectorResources[]>([])
  const selectFiscalStructures = ref<ISelectorResources[]>([])
  const selectStructures = ref<ISelectorResources[]>([])
  const selectType = ref<ISelectorResources[]>([])
  const isAccountEquivalenceEmpty = ref(true)
  const customColumns = ['actions']
  const showState = ref(0)

  const keys = [
    'source_account_structures',
    'equivalent_account_structures',
    'equivalence_fiscal_account_structures',
    'account_equivalence_types',
  ]

  const headerProperties = {
    title: 'Configuración PUC equivalente - fiscal',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Configuración PUC equivalente - fiscal',
        route: 'PucAccountEquivalenceList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'source_structure_id',
      label: 'Estructura contable fuente',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: selectSourceStructures,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: '',
      label: 'Estructura equivalente',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: selectStructures,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código y/o nombre de cuenta',
    },
    {
      name: '',
      label: 'Estructura equivalente fiscal',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: selectFiscalStructures,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'puc_type',
      label: 'Tipo PUC',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: selectType,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
  ])

  const tableProperties = ref({
    title: 'Listado PUC equivalente - fiscal',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'source_structure',
        label: 'Estructura contable fuente',
        field: (row) => row.source_structure?.formatted_display ?? '-',
        align: 'left',
        sortable: false,
      },
      {
        name: 'source_account_code',
        label: 'Código cuenta fuente',
        field: (row) => row.source_account?.code ?? '-',
        align: 'left',
        sortable: false,
      },
      {
        name: 'source_account_name',
        label: 'Nombre cuenta fuente',
        field: (row) => row.source_account?.name ?? '-',
        align: 'left',
        sortable: false,
      },
      {
        name: 'type',
        label: 'Tipo',
        field: (row) => row.source_account.type?.value ?? '-',
        align: 'left',
        sortable: false,
      },
      {
        name: 'puc_type',
        label: 'Tipo de PUC',
        field: 'puc_type',
        align: 'left',
        sortable: true,
      },
      {
        name: 'fiscal_equivalent_structure',
        label: 'Estructura equivalente',
        field: (row) => row.fiscal_equivalent_structure?.code ?? '-',
        align: 'left',
        sortable: false,
      },
      {
        name: 'fiscal_equivalent_structure_code',
        label: 'Estructura equivalente fuente',
        field: (row) => row.fiscal_equivalent_structure?.structure ?? '-',
        align: 'left',
        sortable: false,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [],
    pages: account_equivalence_pages,
  })

  const loadSelectOptions = async () => {
    const queryString = keys
      .map((key) => `keys[]=${encodeURIComponent(key)}`)
      .join('&')

    await _getAccountingResources(queryString)

    selectSourceStructures.value = puc_source_account_structures.value
    selectStructures.value = puc_equivalences_account_structures.value
    selectFiscalStructures.value =
      puc_equivalence_fiscal_account_structures.value
    selectType.value = puc_account_equivalence_types.value
  }

  const loadAccountEquivalences = async (filters = '') => {
    tableProperties.value.loading = true

    await _listAction(filters)

    const hasResults = account_equivalence_list.value.length > 0

    showState.value = filters ? 1 : 0
    isAccountEquivalenceEmpty.value = !hasResults
    tableProperties.value.loading = false
  }

  const handleOptions = async (option: string, id: number) => {
    if (option === 'view') {
      handleGoTo('PucAccountEquivalenceView', { id })
    }

    if (option === 'edit') {
      handleGoTo('PucAccountEquivalenceEdit', { id })
    }
  }

  const handleFilter = async ($filters: {}) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await loadAccountEquivalences(queryString)
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}
    tableProperties.value.rows = []
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    loadAccountEquivalences(queryString)
  }

  const handleGoTo = (routeName: string, params?: {}) => {
    router.push({ name: routeName, params })
  }

  onMounted(async () => {
    await loadSelectOptions()
  })

  watch(
    () => account_equivalence_list.value,
    () => {
      tableProperties.value.rows = account_equivalence_list.value
      tableProperties.value.pages = account_equivalence_pages.value
    }
  )

  return {
    showState,
    handleGoTo,
    updatePage,
    filterConfig,
    handleFilter,
    handleOptions,
    customColumns,
    tableProperties,
    headerProperties,
    handleClearFilters,
    isAccountEquivalenceEmpty,
  }
}

export default usePucAccountEquivalenceList
