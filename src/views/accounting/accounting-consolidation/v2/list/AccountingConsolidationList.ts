//Vue - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

//Composables
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'

//Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { IAccountingListItem } from '@/interfaces/customs/accounting/AccountingConsolidationV2'
import { IBaseTableProps } from '@/interfaces/global'

//Stores
import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'
import { useAccountingConsolidationStore } from '@/stores/accounting/accounting-consolidation'

const useAccountingConsolidationListV2 = () => {
  //Destructure store and refs
  const { headerProps, consolidation_list, pages } = storeToRefs(
    useAccountingConsolidationStore('v2')
  )
  const {
    account_chart_structure_accounting,
    business_trusts_to_consolidate,
    consolidate_process,
    process_consolidate_status,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getAccountingConsolidationList } =
    useAccountingConsolidationStore('v2')
  const { validateRouter } = useRouteValidator()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  //Navigate composable
  const { goToURL } = useGoToUrl()
  //Icons
  const { defaultIconsLucide } = useUtils()
  const structureRef = ref()
  const periodRef = ref('')
  const filterComponentRef = ref()

  const hideFilters = ref<boolean>(false)
  //Table properties
  const tableProperties = ref<IBaseTableProps<IAccountingListItem>>({
    title: 'Listado de consolidación contable',
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
        field: 'process_code',
        sortable: true,
      },
      {
        name: 'last_consolidation',
        required: false,
        label: 'Última consolidación',
        align: 'left',
        field: 'date_last_consolidation',
        sortable: true,
      },
      {
        name: 'account_structure',
        required: false,
        label: 'Estructura contable',
        align: 'left',
        field: (row) =>
          row.account_structure.code +
          ' - ' +
          row.account_structure.description,
        sortable: true,
      },
      {
        name: 'from_business',
        required: false,
        label: 'Desde negocio',
        align: 'left',
        field: (row) =>
          row.from_business.code + ' - ' + row.from_business.description,
        sortable: true,
      },
      {
        name: 'to_business',
        required: false,
        label: 'Hasta negocio',
        align: 'left',
        field: (row) =>
          row.to_business.code + ' - ' + row.to_business.description,
        sortable: true,
      },
      {
        name: 'period',
        required: false,
        label: 'Periodo actual',
        align: 'left',
        field: 'current_period',
        sortable: true,
      },
      {
        name: 'close_period',
        required: false,
        label: 'Periodo cierre',
        align: 'left',
        field: 'close_period',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => row.status.status,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  //Filter properties and refs

  const filterConfig = ref<IFieldFilters[]>([
    {
      type: 'q-date',
      name: 'date_last_consolidation',
      label: 'Fecha de última consolidación',
      value: null,
      disable: false,
      autocomplete: false,
      class: 'col-12 col-md-3',
      placeholder: 'AAAA-MM-DD',
      clean_value: true,
    },
    {
      type: 'q-date',
      name: 'current_period',
      label: 'Periodo actual',
      value: null,
      disable: false,
      autocomplete: false,
      class: 'col-12 col-md-3',
      mask: 'YYYY-MM',
      placeholder: 'AAAA-MM',
      clean_value: true,
      onChange: (val: string) => {
        periodRef.value = val
      },
    },
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: account_chart_structure_accounting,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: (val: number) => {
        structureRef.value = val
      },
    },
    {
      name: 'from_business_code',
      label: 'Desde negocio consolidador',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts_to_consolidate,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'to_business_code',
      label: 'Hasta negocio consolidador',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts_to_consolidate,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'process_id',
      label: 'Proceso',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: process_consolidate_status,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'status_id',
      label: 'Estado del proceso',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: consolidate_process,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
  ])

  const handleShowFilters = () => {
    hideFilters.value = !hideFilters.value
    const hiddenFilters = ['to_business_code', 'process_id', 'status_id']

    filterConfig.value.forEach((field) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !hideFilters.value
      }
    })
  }

  //Structure filters format
  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  //Actions for list, filter and pagination
  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getAccountingConsolidationList(filters)
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[date_last_consolidation]': string
    'filter[status_id]': string
    'filter[process_id]': string
    'filter[from_business_code]': string
    'filter[to_business_code]': string
    'filter[accounting_structure_id]': string
    'filter[current_period]': string
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

  const accountingKeys = {
    accounting: [
      'consolidate_process',
      'process_consolidate_status',
      'account_chart_structure_accounting',
    ],
  }

  //lifecycle hooks and request actions
  onMounted(async () => {
    await _getResources(accountingKeys, '', 'v2')
  })

  onBeforeUnmount(() => {
    _resetKeys(accountingKeys)
  })

  //Populate list and pagination properties
  watch(
    consolidation_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = pages.value
      tableProperties.value.pages = { currentPage, lastPage }
    },
    { deep: true }
  )

  watch(
    () => [structureRef.value, periodRef.value],
    async () => {
      if (structureRef.value === null || periodRef.value === '') return
      await _getResources(
        {
          accounting: [
            `business_trusts_to_consolidate&filter[structure_id]=${structureRef.value}&filter[current_period]=${periodRef.value}`,
          ],
        },
        '',
        'v2'
      )
    }
  )

  return {
    //properties for components
    headerProps,
    tableProperties,
    filterConfig,
    filterComponentRef,

    //validate actions
    validateRouter,
    handleShowFilters,

    //navigate actions
    goToURL,

    //Table actions
    handleFilterSearch,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,

    //Icons
    defaultIconsLucide,
  }
}

export default useAccountingConsolidationListV2
