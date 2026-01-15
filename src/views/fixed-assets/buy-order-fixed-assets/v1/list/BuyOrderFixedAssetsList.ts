// vue - pinia - quasar
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'
import {
  IBuyOrderFixedAssetsList,
  IBuyOrderFixedAssetsFilters
} from '@/interfaces/customs/fixed-assets/BuyOrderFixedAssets'

// composables
import { useCalendarRules, useMainLoader } from '@/composables'
import { useUtils, useGoToUrl } from '@/composables'

// stores
import { useBuyOrderFixedAssetsStore } from '@/stores/fixed-assets/buy-order-fixed-assets'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import {
  useResourceManagerStore,
  useThirdPartyResourceStore,
  useTrustBusinessResourceStore
} from '@/stores/resources-manager'

const AUTHORIZATION_STATUS: Record<number, string> = {
  66: 'Autorizado',
  67: 'Sin autorizar'
}

const useBuyOrderFixedAssetsList = () => {
  // data store principal
  const { _getBuyOrderFixedAssetsList, _deleteBuyOrderFixedAssets, _authorizeBuyOrderFixedAssets } =
    useBuyOrderFixedAssetsStore('v1')
  const { headerPropsDefault } = storeToRefs(useBuyOrderFixedAssetsStore('v1'))

  // resources stores
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { purchase_order_numbers, authorization_statuses } = storeToRefs(
    useFixedAssetsResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // keys to consume resources
  const keysThirdParty = {
    third_party: ['third_parties']
  }
  const keysFixedAssets = {
    fixed_assets: ['purchase_order_numbers', 'authorization_statuses']
  }
  const keysTrustBusiness = {
    trust_business: ['business_trusts']
  }

  // composables
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  // breadcrumb
  const headerPropsList = {
    title: headerPropsDefault.value.title,
    breadcrumbs: headerPropsDefault.value.breadcrumbs
  }

  // filters
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'purchase_order_number',
      label: 'Número de orden de compra',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
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
      class: 'col-12 col-md-3',
      options: business_trusts,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Código - Nombre'
    },
    {
      name: 'third_party',
      label: 'Tercero',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: third_parties,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos'
    },
    {
      name: 'authorization_status_id',
      label: 'Autorización',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: authorization_statuses,
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
      class: 'col-12 col-md-3',
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
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      option_calendar: useCalendarRules().only_until(
        new Date().toISOString().slice(0, 10).replace(/-/g, '/')
      )
    }
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = async ($filters: IBuyOrderFixedAssetsFilters) => {
    filtersFormat.value = {
      ...$filters,
      rows: filtersFormat.value.rows || 20,
      paginate: 1
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
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
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: true, required: true },
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
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'id',
        align: 'center',
        sortable: false,
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
    await listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      paginate: 1 as number,
      rows: rowsPerPage
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  // actions
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    const response = await _getBuyOrderFixedAssetsList(filters)

    tableProps.value.rows = response.list
    tableProps.value.pages = response.pages
    tableProps.value.loading = false
  }

  const optionsActions = (id: number) => [
    {
      label: 'Eliminar',
      action: () => openDeleteModal(id)
    },
    {
      label: 'Autorizar',
      action: () => openAuthorizeModal(id)
    }
  ]

  // modals
  const deleteModalRef = ref()
  const authorizeModalRef = ref()

  const modalConfig = ref({
    selectedId: null as number | null,
    deleteTitle: '¿Desea eliminar este registro?',
    authorizeTitle: '¿Está seguro de autorizar esta orden de compra?'
  })

  // delete modal
  const openDeleteModal = (id: number) => {
    modalConfig.value.selectedId = id
    deleteModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    openMainLoader(true)
    deleteModalRef.value?.closeModal()
    if (!modalConfig.value.selectedId) return
    await _deleteBuyOrderFixedAssets(modalConfig.value.selectedId)
    await listAction()
    modalConfig.value.selectedId = null
    openMainLoader(false)
  }

  // authorize modal
  const openAuthorizeModal = (id: number) => {
    modalConfig.value.selectedId = id
    authorizeModalRef.value?.openModal()
  }

  const handleAuthorize = async () => {
    openMainLoader(true)
    authorizeModalRef.value?.closeModal()
    if (!modalConfig.value.selectedId) return
    await _authorizeBuyOrderFixedAssets(modalConfig.value.selectedId)
    await listAction()
    modalConfig.value.selectedId = null
    openMainLoader(false)
  }

  const goToCreate = () => {
    goToURL('BuyOrderFixedAssetsCreate')
  }

  // lifecycles
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
    // header and table
    headerPropsList,
    tableProps,
    filterConfig,
    defaultIconsLucide,

    // modals
    deleteModalRef,
    authorizeModalRef,
    modalConfig,

    // table actions
    optionsActions,
    goToURL,
    goToCreate,

    // handlers filters
    handleFilter,
    updatePage,
    updateRowsPerPage,
    handleClearFilters,

    //actions table
    handleDelete,
    handleAuthorize
  }
}

export default useBuyOrderFixedAssetsList
