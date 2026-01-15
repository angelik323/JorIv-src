//Vue - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

//Interfaces
import { IFieldFilters, IGenericResource } from '@/interfaces/customs'
import { IExchangeDifferenceRestatementListItem } from '@/interfaces/customs/accounting/AccountingRestatement'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'
import { useRouteValidator } from '@/composables/useRoutesValidator'

// Constants
import { consolidation_type_options } from '@/constants/resources'

//Stores
import { useAccountingRestatementStore } from '@/stores/accounting/accounting-restatement'
import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'

const useExchangeDifferenceRestatementList = () => {
  //Destructuring store, functions and refs
  const { headerPropsDefault, reexpresion_difference_list, pages } =
    storeToRefs(useAccountingRestatementStore('v2'))
  // Function get list
  const { _getExchangeDifferenceRestatementList } =
    useAccountingRestatementStore('v2')

  // Utils and functions
  const { defaultIconsLucide } = useUtils()
  const headerProperties = headerPropsDefault.value
  const filterComponentRef = ref()
  const { goToURL } = useGoToUrl()
  const structureRef = ref()
  const businessFromRef = ref()
  const hideFilters = ref<boolean>(true)
  const { validateRouter } = useRouteValidator()

  //Resources options for lists filters
  const {
    account_structures,
    business_trusts_by_structure_and_closing_type,
    status_by_id,
  } = storeToRefs(useAccountingResourceStore('v1'))

  // Resource manager store
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  //arrays pivot for information
  const businessTrustsByStructure = ref<IGenericResource[]>([])
  const businessTrustsToOptions = ref<IGenericResource[]>([])

  //Keys to load resources
  const keysAccounting = {
    accounting: [
      'account_structures&filter[status_id]=1&filter[type]=Catálogo de cuentas contables',
    ],
  }
  const keysFilterStatus = {
    accounting: ['status_by_id&filter[ids]=84,85,86'],
  }

  const statusByIdWithAll = ref<IGenericResource[]>([
    {
      label: 'Todos',
      value: '',
    },
    ...status_by_id.value,
  ])

  //Filter configuration
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'closing_type',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Tipo de cierre',
      placeholder: 'Seleccione',
      value: null,
      options: consolidation_type_options,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'period',
      type: 'q-date',
      class: 'col-12 col-md-3',
      label: 'Periodo',
      placeholder: 'YYYY-MM',
      value: null,
      options: [],
      mask: 'YYYY-MM',
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'structure_id',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Estructura contable',
      placeholder: 'Seleccione',
      value: null,
      options: account_structures,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'from_business',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Desde negocio',
      placeholder: 'Seleccione',
      value: null,
      options: businessTrustsByStructure,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'to_business',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Hasta negocio',
      placeholder: 'Seleccione',
      value: null,
      options: businessTrustsToOptions,
      clean_value: true,
      autocomplete: true,
      disable: false,
      hide: true,
    },
    {
      name: 'status_id',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Estado del proceso',
      placeholder: 'Seleccione',
      value: null,
      options: statusByIdWithAll,
      clean_value: true,
      autocomplete: true,
      disable: false,
      hide: true,
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })
  const isListEmpty = ref(true)
  const showState = ref(0)

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    filterConfig.value[4].hide = hideFilters.value
    filterConfig.value[5].hide = hideFilters.value
  }

  //Functions to handle filter updates
  const handleUpdateValues = (filters: Record<string, string | number>) => {
    const structureIdFilter = filters['filter[structure_id]']
    if (structureIdFilter) {
      const selectedStructure = account_structures.value.find(
        (item) => item.id === Number(structureIdFilter)
      )
      structureRef.value = selectedStructure ? selectedStructure.id : null
    }
    const fromBusinessFilter = filters['filter[from_business]']
    if (fromBusinessFilter) {
      const selectedBusiness =
        business_trusts_by_structure_and_closing_type.value.find(
          (item) => item.id === Number(fromBusinessFilter)
        )
      businessFromRef.value = selectedBusiness ? selectedBusiness.id : null
    }
  }

  //Table properties and methods
  const tableProperties = ref<
    IBaseTableProps<IExchangeDifferenceRestatementListItem>
  >({
    title: 'Listado de procesos generados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'process',
        required: false,
        label: 'Proceso',
        align: 'left',
        field: 'process',
        sortable: true,
      },
      {
        name: 'period',
        required: false,
        label: 'Período',
        align: 'left',
        field: 'period',
        sortable: true,
      },
      {
        name: 'structure_',
        required: false,
        label: 'Estructura contable',
        align: 'left',
        field: 'structure',
        sortable: true,
      },
      {
        name: 'from_business',
        required: false,
        label: 'Desde negocio',
        align: 'left',
        field: 'from_business',
        sortable: true,
      },
      {
        name: 'to_business',
        required: false,
        label: 'Hasta negocio',
        align: 'left',
        field: 'to_business',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado de proceso',
        align: 'left',
        field: (row) => row.status?.status ?? '-',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  //Functions for table actions and filters
  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getExchangeDifferenceRestatementList(filters)
    isListEmpty.value = tableProperties.value.rows?.length === 0
    showState.value = filtersFormat.value ? 1 : 0
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
    structureRef.value = null
    businessFromRef.value = null
    isListEmpty.value = true
    showState.value = 0
  }

  const handleFilterSearch = async ($filters: {
    'filter[status_id]': string
    'filter[closing_type]': string
    'filter[period]': string
    'filter[structure_id]': number
    'filter[from_business]': string
    'filter[to_business]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    await listAction(filtersFormat.value)
  }
  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  // Lifecycle hooks and watchers
  onMounted(async () => {
    await _getResources(keysAccounting)
    await _getResources(keysFilterStatus, '', 'v2')
  })

  onBeforeUnmount(() => {
    _resetKeys({
      accounting: [
        'account_structures',
        'status_by_id',
        'business_trusts_by_structure_and_closing_type',
      ],
    })
  })

  // Watch to populate table rows and pagination
  watch(
    reexpresion_difference_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  // Watch to load account structures when structure filter changes
  watch(
    () => structureRef.value,
    async (newVal) => {
      if (!newVal) {
        businessTrustsByStructure.value = []
        return
      }
      await _getResources(
        {
          accounting: [
            `business_trusts_by_structure_and_closing_type&filter[accounting_structure_id]=${newVal}`,
          ],
        },
        '',
        'v2'
      )
      businessTrustsByStructure.value = [
        ...business_trusts_by_structure_and_closing_type.value,
      ]
      const fromBusinessFilter = filterConfig.value.find(
        (item) => item.name === 'from_business'
      )
      if (fromBusinessFilter) {
        fromBusinessFilter.options = businessTrustsByStructure.value
      }
    }
  )

  watch(
    () => businessFromRef.value,
    async (newVal) => {
      if (!newVal) {
        businessTrustsToOptions.value = []
        return
      }
      await _getResources(
        {
          accounting: [
            `business_trusts_by_structure_and_closing_type&filter[accounting_structure_id]=${structureRef.value}&filter[reference_business_id]=${newVal}`,
          ],
        },
        '',
        'v2'
      )
      businessTrustsToOptions.value = [
        ...business_trusts_by_structure_and_closing_type.value,
      ]
      const toBusinessFilter = filterConfig.value.find(
        (item) => item.name === 'to_business'
      )
      if (toBusinessFilter) {
        toBusinessFilter.options = businessTrustsToOptions.value
      }
    }
  )
  return {
    //Header, filter and table props
    headerProperties,
    filterComponentRef,
    filterConfig,
    filtersFormat,
    tableProperties,
    isListEmpty,
    showState,

    //Methods
    updatePage,
    updateRowsPerPage,
    handleFilterSearch,
    handleClearFilters,
    handleUpdateValues,
    handleShowMoreFilters,
    validateRouter,

    //Navigate
    goToURL,

    //Icons
    defaultIconsLucide,
  }
}

export default useExchangeDifferenceRestatementList
