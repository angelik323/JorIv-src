// Vue - pinia
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IFiduciaryCommissionListV2 } from '@/interfaces/customs/settlement-commissions/FiduciaryCommissionV2'
import { IBaseTableProps } from '@/interfaces/global'

// Constantes
import { collections_options } from '@/constants'

// composables
import {
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Stores
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'
import { useFiduciaryCommissionsStore } from '@/stores/settlement-commissions/fiduciary-commission'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryCommissionList = () => {
  const {
    _getFiduciaryCommissionList,
    _liquidateFiduciaryCommission,
    _clearData,
  } = useFiduciaryCommissionsStore('v2')
  const { fiduciary_commission_list, fiduciary_commission_pages } = storeToRefs(
    useFiduciaryCommissionsStore('v2')
  )

  const { periodicities, commission_types } = storeToRefs(
    useSettlementCommissionsResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide, formatCurrencyString } = useUtils()
  const { max_length } = useRules()
  const { openMainLoader } = useMainLoader()

  const selectedRows = ref<IFiduciaryCommissionListV2[]>([])

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    statusId: null as number | null,
  })

  const headerProps = {
    title: 'Liquidar comisiones',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Liquidar comisiones',
        route: 'SettlementFiduciaryCommissionsList',
      },
    ],
  }

  const tableProperties = ref<IBaseTableProps<IFiduciaryCommissionListV2>>({
    title: 'Listado de comisiones a liquidar',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business',
        field: (row) =>
          row.business_trust_commissions.business_code_snapshot +
          ' - ' +
          row.business_trust_commissions.business_name_snapshot,
        required: true,
        label: 'Código y nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'commission_type_id',
        field: (row) =>
          row.business_trust_commissions.type_commission.description,
        required: true,
        label: 'Nombre de comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'third_party_billing',
        field: (row) =>
          row.business_trust_commissions.third_party_billing?.name,
        required: true,
        label: 'Tercero a facturar',
        align: 'left',
        sortable: true,
      },
      {
        name: 'collection',
        field: (row) => row.business_trust_commissions.collection,
        required: true,
        label: 'Cobro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'billing_period',
        field: (row) =>
          row.business_trust_commissions.business_start_date_snapshot +
          ' - ' +
          row.business_trust_commissions.business_end_date_snapshot,
        required: true,
        label: 'Periodo de facturación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'periodicity',
        field: (row) => row.business_trust_commissions.billing_trust.periodicity,
        required: true,
        label: 'Periodicidad',
        align: 'left',
        sortable: true,
      },
      {
        name: 'period_code',
        field: (row) => row.period_code,
        required: true,
        label: 'Período a liquidar',
        align: 'left',
        sortable: true,
      },
      {
        name: 'base_amount',
        field: 'base_amount',
        required: true,
        label: 'Valor de comisión',
        align: 'left',
        sortable: true,
        format: (val: string | number) => formatCurrencyString(val) ?? '-',
      },
      {
        name: 'iva_amount',
        field: 'iva_amount',
        required: true,
        label: 'IVA',
        align: 'left',
        sortable: true,
        format: (val: string | number) => formatCurrencyString(val) ?? '-',
      },
      {
        name: 'retefuente',
        field: 'retefuente_amount',
        required: true,
        label: 'Retefuente',
        align: 'left',
        sortable: true,
        format: (val: string | number) => formatCurrencyString(val) ?? '-',
      },
      {
        name: 'reteica',
        field: 'reteica_amount',
        required: true,
        label: 'ReteICA',
        align: 'left',
        sortable: true,
        format: (val: string | number) => formatCurrencyString(val) ?? '-',
      },
      {
        name: 'reteiva',
        field: 'reteiva_amount',
        required: true,
        label: 'Rete IVA',
        align: 'left',
        sortable: true,
        format: (val: string | number) => formatCurrencyString(val) ?? '-',
      },
      {
        name: 'total_amount',
        field: 'total_amount',
        required: true,
        label: 'Valor total',
        align: 'left',
        sortable: true,
        format: (val: string | number) => formatCurrencyString(val) ?? '-',
      },
      {
        name: 'status',
        field: (row) => row.status.name,
        required: true,
        label: 'Estado',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const periodicitiesOptions = computed(() => [
    { label: 'Todos', value: '' },
    ...periodicities.value,
  ])

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'period_code',
      label: 'Periodo a liquidar',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
    },
    {
      name: 'commission_type_id',
      label: 'Nombre de comisión',
      type: 'q-select',
      options: commission_types,
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'periodicity',
      label: 'Periodicidad',
      type: 'q-select',
      options: periodicitiesOptions,
      value: '',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'colllection',
      label: 'Cobro',
      type: 'q-select',
      options: collections_options,
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código de negocio/nombre negocio',
      rules: [(val: string) => max_length(val, 50)],
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number | boolean>
  >({
    page: 1,
    rows: 20,
  })

  const listAction = async (
    filters: Record<string, string | number | boolean>
  ) => {
    selectedRows.value = []
    tableProperties.value.rows = []
    tableProperties.value.loading = true

    const result = await _getFiduciaryCommissionList(filters)

    if (result) {
      tableProperties.value.rows = result.list
      tableProperties.value.pages = {
        currentPage: result.pages.currentPage,
        lastPage: result.pages.lastPage,
      }
    }

    tableProperties.value.loading = false
  }

  const handleFilter = async (
    $filters: Record<string, string | number | boolean>
  ) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
      paginate: 1,
    }

    await listAction(filtersFormat.value)
  }

  const handleClear = () => {
    tableProperties.value.rows = []
    selectedRows.value = []
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const handleLiquidateAction = async () => {
    selectedRows.value.length === 0
      ? (selectedRows.value = tableProperties.value.rows)
      : selectedRows.value

    await _liquidateFiduciaryCommission({
      commission_ids: selectedRows.value.map((row) => row.id),
    })
    await alertModalRef.value.closeModal()
    await listAction({
      ...filtersFormat.value,
    })
    openMainLoader(false)
  }

  const handleOpenModalLiquidate = async (liquidateAll: boolean = false) => {

    if (liquidateAll) {
      await listAction({})
      selectedRows.value = tableProperties.value.rows
    }

    alertModalConfig.value.description = `¿Desea liquidar ${selectedRows.value.length} comisiones?`
    await alertModalRef.value.openModal()
  }

  watch(
    fiduciary_commission_list,
    () => {
      tableProperties.value.rows = [...fiduciary_commission_list.value]

      const { currentPage, lastPage } = fiduciary_commission_pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  const keys = {
    settlement_commissions: ['periodicities', 'commission_types'],
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    tableProperties,
    filterConfig,
    selectedRows,
    defaultIconsLucide,
    alertModalRef,
    alertModalConfig,

    handleFilter,
    updatePage,
    updatePerPage,
    handleClear,
    handleLiquidateAction,
    handleOpenModalLiquidate,
    validateRouter,
  }
}

export default useFiduciaryCommissionList
