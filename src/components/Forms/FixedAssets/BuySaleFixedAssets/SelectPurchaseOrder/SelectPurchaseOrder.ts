// vue - pinia
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { IBuyOrderFixedAssetsList } from '@/interfaces/customs/fixed-assets/BuyOrderFixedAssets'

// composables
import { useCalendarRules } from '@/composables/useCalendarRules'
import { useUtils } from '@/composables/useUtils'

// stores
import { useBuyOrderFixedAssetsStore } from '@/stores/fixed-assets/buy-order-fixed-assets'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import {
  useResourceManagerStore,
  useThirdPartyResourceStore,
  useTrustBusinessResourceStore
} from '@/stores/resources-manager'

const AUTHORIZED_STATUS_ID = 66
const AUTHORIZATION_STATUS: Record<number, string> = {
  66: 'Autorizado',
  67: 'Sin autorizar'
}

const useSelectPurchaseOrder = (
  emit: (event: 'select', order: IBuyOrderFixedAssetsList) => void
) => {
  // principal data store
  const { _getBuyOrderFixedAssetsList } = useBuyOrderFixedAssetsStore('v1')

  // resources stores
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { purchase_order_numbers } = storeToRefs(useFixedAssetsResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // keys
  const keysThirdParty = {
    third_party: ['third_parties']
  }
  const keysTrustBusiness = {
    trust_business: ['business_trusts']
  }
  const keysFixedAssets = {
    fixed_assets: ['purchase_order_numbers']
  }

  // composables
  const { defaultIconsLucide, formatParamsCustom } = useUtils()

  const selectedOrder = ref<IBuyOrderFixedAssetsList | null>(null)
  const canContinue = computed(() => selectedOrder.value !== null)

  // filters
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'purchase_order_id',
      label: 'Número de orden de compra',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: purchase_order_numbers,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos'
    },
    {
      name: 'business_trust',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Código - Nombre'
    },
    {
      name: 'third_party',
      label: 'Tercero/Proveedor',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: third_parties,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos'
    },
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      option_calendar: useCalendarRules().only_until(
        new Date().toISOString().slice(0, 10).replace(/-/g, '/')
      )
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true
    }
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const getBaseFilters = () => {
    return `filter[authorization_status_id]=${AUTHORIZED_STATUS_ID}`
  }

  const handleFilter = async ($filters: {
    'filter[purchase_order_id]': string
    'filter[business_trust]': string
    'filter[third_party]': string
    'filter[start_date]': string
    'filter[end_date]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: filtersFormat.value.rows || 20,
      paginate: 1
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    const baseFilters = getBaseFilters()
    await listAction(baseFilters + (queryString ? '&' + queryString : ''))
  }

  const handleClearFilters = async () => {
    selectedOrder.value = null
    await listAction(getBaseFilters())
  }

  const getBusinessTrustDisplay = (row: IBuyOrderFixedAssetsList): string => {
    if (!row.items || row.items.length === 0) return '-'
    const firstItem = row.items[0]
    if (!firstItem.business_trust) return '-'
    return `${firstItem.business_trust.business_code} - ${firstItem.business_trust.name}`
  }

  const getThirdPartyDisplay = (row: IBuyOrderFixedAssetsList): string => {
    if (!row.items || row.items.length === 0) return '-'
    const firstItem = row.items[0]
    if (!firstItem.third_party) return '-'
    return firstItem.third_party.document
  }

  // table
  const tableProps = ref<IBaseTableProps<IBuyOrderFixedAssetsList>>({
    title: 'Listado de ordenes de compra',
    loading: false,
    columns: [
      {
        name: 'select',
        label: 'Seleccionar',
        field: 'id',
        align: 'center',
        sortable: false,
        required: true
      },
      {
        name: 'purchase_order_number',
        label: 'Número de orden de compra',
        field: 'id',
        align: 'left',
        sortable: true,
        required: true
      },
      {
        name: 'business_trust',
        label: 'Negocio',
        field: (row: IBuyOrderFixedAssetsList) => getBusinessTrustDisplay(row),
        align: 'left',
        sortable: false,
        required: true
      },
      {
        name: 'third_party',
        label: 'Tercero/Proveedor',
        field: (row: IBuyOrderFixedAssetsList) => getThirdPartyDisplay(row),
        align: 'left',
        sortable: false,
        required: true
      },
      {
        name: 'authorization_status',
        label: 'Autorización',
        field: (row: IBuyOrderFixedAssetsList) =>
          AUTHORIZATION_STATUS[row.authorization_status_id] || 'Desconocido',
        align: 'left',
        sortable: true,
        required: true
      }
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 }
  })

  const updatePage = async (paginate: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      paginate: paginate
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    const baseFilters = getBaseFilters()
    await listAction(baseFilters + (queryString ? '&' + queryString : ''))
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      paginate: 1 as number,
      rows: rowsPerPage
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    const baseFilters = getBaseFilters()
    await listAction(baseFilters + (queryString ? '&' + queryString : ''))
  }

  // actions
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    selectedOrder.value = null

    const response = await _getBuyOrderFixedAssetsList(filters)

    tableProps.value.rows = response.list
    tableProps.value.pages = response.pages
    tableProps.value.loading = false
  }

  const selectOrder = (order: IBuyOrderFixedAssetsList) => {
    if (selectedOrder.value?.id === order.id) {
      selectedOrder.value = null
    } else {
      selectedOrder.value = order
    }
  }

  const isSelected = (orderId: number) => {
    return selectedOrder.value?.id === orderId
  }

  const handleContinue = () => {
    if (selectedOrder.value) {
      emit('select', selectedOrder.value)
    }
  }

  onMounted(async () => {
    await _getResources(
      keysThirdParty,
      'include=legalPerson,documentType,naturalPerson&keys[]=third_parties&fields[]=id,document,document_type_id&fields[natural_people]=third_party_id,id,name,middle_name,last_name,second_last_name&fields[legal_people]=third_party_id,id,business_name'
    )
    await _getResources(keysTrustBusiness, 'filter[effect]=true')
    await _getResources(keysFixedAssets)
  })

  onBeforeUnmount(() => {
    _resetKeys(keysThirdParty)
    _resetKeys(keysTrustBusiness)
    _resetKeys(keysFixedAssets)
  })

  return {
    // Table
    tableProps,
    filterConfig,
    defaultIconsLucide,

    // Selection
    selectedOrder,
    canContinue,

    // Methods
    handleFilter,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,
    selectOrder,
    isSelected,
    handleContinue
  }
}

export default useSelectPurchaseOrder
