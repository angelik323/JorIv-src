// Vue - pinia - moment
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IAccountingSettingsListV2 } from '@/interfaces/customs/settlement-commissions/AccountingSettingsV2'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useTable,
  useUtils,
} from '@/composables'

// Stores
import { useAccountingSettingsStore } from '@/stores/settlement-commissions/accounting-settings'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'

const useAccountingSettingList = () => {
  const { _getAccountingSettingsList, _deleteAccountingSettings, _clearData } =
    useAccountingSettingsStore('v2')

  const { accounting_settings_list, accounting_settings_pages } = storeToRefs(
    useAccountingSettingsStore('v2')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    periodicities,
    business_trusts_accounting_parameters,
    movement_codes_accounting_parameters,
  } = storeToRefs(useSettlementCommissionsResourceStore('v1'))

  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { max_length } = useRules()
  const { openMainLoader } = useMainLoader()

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el parámetro contable?',
    id: null as number | null,
  })

  const headerProperties = {
    title: 'Parámetros contables',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
      },
      {
        label: 'Parámetros contables',
        route: 'AccountingSettingsList',
      },
    ],
  }

  const tableProperties = ref<IBaseTableProps<IAccountingSettingsListV2>>({
    title: 'Listado de parámetros contables',
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
        name: 'name',
        label: 'Código y nombre del negocio',
        required: true,
        align: 'left',
        field: (row) =>
          row.business_code_snapshot + ' - ' + row.business_name_snapshot,
        sortable: true,
      },
      {
        name: 'code',
        label: 'Código del periodo',
        required: true,
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'start_date',
        label: 'Fecha inicial',
        required: true,
        align: 'left',
        field: 'start_date',
        sortable: true,
      },
      {
        name: 'end_date',
        label: 'Fecha final',
        required: true,
        field: 'end_date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'periodicity',
        required: true,
        label: 'Periodicidad',
        align: 'left',
        field: 'periodicity',
        sortable: true,
      },
      {
        name: 'business_movement_code_snapshot',
        required: true,
        label: 'Código del movimiento',
        align: 'left',
        field: 'business_movement_code_snapshot',
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

  const { removeRowById } = useTable<IAccountingSettingsListV2>(tableProperties)

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: '',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'business_code_snapshot',
      label: 'Nombre del negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_accounting_parameters,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'periodicity',
      label: 'Periodicidad',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      options: periodicities,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'business_movement_code_snapshot',
      label: 'Código del movimiento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      options: movement_codes_accounting_parameters,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
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
      placeholder: 'Buscar por código del periodo',
      rules: [(val: string) => max_length(val, 50)],
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

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getAccountingSettingsList(filters)
    tableProperties.value.loading = false
  }

  const handleFilterSearch = async ($filters: {
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[periodicity]': string
    'filter[business_movement_code_snapshot]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    await listAction(filtersFormat.value)
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
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

  const openAlertModal = async (id: number) => {
    alertModalConfig.value.id = id
    await alertModalRef.value.openModal()
  }

  const handleDeleteAction = async () => {
    const { id } = alertModalConfig.value
    if (!id) return

    openMainLoader(true)
    const success = await _deleteAccountingSettings(id)
    if (success) {
      alertModalRef.value.closeModal()
      removeRowById(id)
    }
    openMainLoader(false)
  }

  const keys = {
    settlement_commissions: [
      'business_trusts_accounting_parameters',
      'periodicities',
      'movement_codes_accounting_parameters',
    ],
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    accounting_settings_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = accounting_settings_pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProperties,
    tableProperties,
    defaultIconsLucide,
    filterConfig,
    alertModalConfig,
    alertModalRef,

    updatePage,
    updateRowsPerPage,
    goToURL,
    handleFilterSearch,
    handleClearFilters,
    handleDeleteAction,
    openAlertModal,
    validateRouter,
  }
}

export default useAccountingSettingList
