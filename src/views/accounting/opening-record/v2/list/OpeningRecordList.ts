// Vue - Pinia - Router - Quasar
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import type { IFieldFilters } from '@/interfaces/customs/Filters'
import type { IBaseTableProps } from '@/interfaces/global'
import type { IOpeningRecord } from '@/interfaces/customs/accounting/OpeningRecord'

// Composables
import { useGoToUrl, useRouteValidator, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useOpeningRecordStore } from '@/stores/accounting/opening-record'

const useOpeningRecordList = () => {
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _getOpeningRecordList,
    _toggleOpeningRecordStatus,
    _selectOpeningRecord,
    _cleanOpeningRecordData,
  } = useOpeningRecordStore('v2')

  const { opening_record_list, opening_record_pages, selected_opening_record } =
    storeToRefs(useOpeningRecordStore('v2'))

  const key_v2 = [
    'accounting_account_structures',
    'business_trusts_for_period_opening',
  ]

  const keys = {
    accounting: key_v2,
  }

  const { accounting_account_structures, business_trusts_for_period_opening } =
    storeToRefs(useAccountingResourceStore('v1'))

  const headerProps = {
    title: 'Apertura de período contable',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Registro de apertura de período',
        route: 'OpeningRecordList',
      },
    ],
  }

  const tableProps = ref<IBaseTableProps<IOpeningRecord>>({
    title: 'Listado de aperturas de período',
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
        name: 'account_structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: (row) => row.account_structure,
        sortable: true,
      },
      {
        name: 'business_trust',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row) => row.business_trust,
        sortable: true,
      },
      {
        name: 'initial_period',
        required: true,
        label: 'Período inicial',
        align: 'left',
        field: (row) => row.initial_period,
        sortable: true,
      },
      {
        name: 'final_period',
        required: true,
        label: 'Período final',
        align: 'left',
        field: (row) => row.final_period,
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: accounting_account_structures,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'initial_period',
      label: 'Período inicial',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM',
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
    },
    {
      name: 'final_period',
      label: 'Período final',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM',
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
    },
    {
      name: 'business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: business_trusts_for_period_opening,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
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

  const listAction = async () => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getOpeningRecordList(filtersFormat.value)
    tableProps.value.loading = false
  }

  const handleFilter = (filters: Record<string, string | number>) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      ...filters,
      page: 1,
    }

    listAction()
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value.rows = rowsPerPage
    filtersFormat.value.page = 1
    listAction()
  }

  const handleClear = () => {
    filtersFormat.value = {
      page: 1,
      rows: filtersFormat.value.rows,
    }

    tableProps.value.rows = []
    _cleanOpeningRecordData()
  }

  onMounted(async () => {
    _cleanOpeningRecordData()

    await _getResources(keys, '', 'v2')

    tableProps.value.rows = opening_record_list.value

    const { currentPage, lastPage } = opening_record_pages.value
    tableProps.value.pages = {
      currentPage,
      lastPage,
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => opening_record_list.value,
    () => {
      tableProps.value.rows = opening_record_list.value

      const { currentPage, lastPage } = opening_record_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    // Header
    headerProps,

    // Tabla
    tableProps,

    // Filtros
    filterConfig,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,

    // Stores / acciones extra
    selected_opening_record,
    _selectOpeningRecord,
    _toggleOpeningRecordStatus,

    // Navegación / utils
    validateRouter,
    goToURL,
    defaultIconsLucide,
  }
}

export default useOpeningRecordList
