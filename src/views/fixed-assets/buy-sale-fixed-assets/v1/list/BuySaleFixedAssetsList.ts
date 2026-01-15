// vue - pinia - quasar
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { DropdownOption } from '@/interfaces/global/Button'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { IBuySaleFixedAssetsList } from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'

// composables
import { useUtils, useGoToUrl, useCalendarRules, useMainLoader } from '@/composables'
import { useRouter } from 'vue-router'

// stores
import { useBuySaleFixedAssetsStore } from '@/stores/fixed-assets/buy-sale-fixed-assets'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import {
  useResourceManagerStore,
  useThirdPartyResourceStore,
  useTrustBusinessResourceStore
} from '@/stores/resources-manager'

const useBuySaleFixedAssetsList = () => {
  // data store principal
  const { _getBuySaleFixedAssetsList, _approveBuySaleFixedAssets, _deleteBuySaleFixedAssets } =
    useBuySaleFixedAssetsStore('v1')
  const { headerPropsDefault } = storeToRefs(useBuySaleFixedAssetsStore('v1'))

  // resources stores
  const { type, approval_statuses, transaction_types } = storeToRefs(
    useFixedAssetsResourceStore('v1')
  )

  // local options for accounts_payable_status
  const accountsPayableStatusOptions = ref([
    { label: 'Si', value: 'Si' },
    { label: 'No', value: 'No' }
  ])
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // keys para consumir recursos
  const keysThirdParty = {
    third_party: ['third_parties']
  }
  const keysFixedAssets = {
    fixed_assets: ['type', 'approval_statuses', 'transaction_types']
  }
  const keysTrustBusiness = {
    trust_business: ['business_trusts']
  }

  // composables
  const { defaultIconsLucide, formatParamsCustom, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const router = useRouter()

  // breadcrumb
  const headerPropsList = {
    title: headerPropsDefault.value.title,
    breadcrumbs: headerPropsDefault.value.breadcrumbs
  }

  // filters
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'transaction_type',
      label: 'Operación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: transaction_types,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos'
    },
    {
      name: 'business_trust_id',
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
      name: 'asset_category',
      label: 'Tipo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: type,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos'
    },
    {
      name: 'third_party_id',
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
      name: 'approval_status_id',
      label: 'Aprobación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: approval_statuses,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos'
    },
    {
      name: 'accounts_payable_status',
      label: 'Contabilidad',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: accountsPayableStatusOptions,
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
      clean_value: true
    }
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = async ($filters: {
    'filter[transaction_type]': string
    'filter[business_trust_id]': string
    'filter[asset_category]': string
    'filter[third_party_id]': string
    'filter[approval_status_id]': string
    'filter[accounts_payable_status]': string
    'filter[start_date]': string
    'filter[end_date]': string
  }) => {
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

  // table
  const tableProps = ref<IBaseTableProps<IBuySaleFixedAssetsList>>({
    title: 'Listado de compra y venta de activos fijos y bienes',
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: true, required: true },
      {
        name: 'record_type',
        label: 'Operación',
        field: 'transaction_type',
        align: 'left',
        sortable: true,
        required: true
      },
      {
        name: 'created_at',
        label: 'Fecha de creación',
        field: (row) => formatDate(row.created_at, 'YYYY-MM-DD HH:mm'),
        align: 'left',
        sortable: true,
        required: true
      },
      {
        name: 'reference',
        label: 'Código de compra/venta',
        field: 'id',
        align: 'left',
        sortable: true,
        required: true
      },
      {
        name: 'asset_category',
        label: 'Tipo',
        field: 'asset_category',
        align: 'left',
        sortable: true,
        required: true
      },
      {
        name: 'business_trust',
        label: 'Negocio',
        field: (row) =>
          row.business_trust
            ? `${row.business_trust.business_code} - ${row.business_trust.name}`
            : '-',
        align: 'left',
        sortable: true,
        required: true
      },
      {
        name: 'third_party',
        label: 'Tercero',
        field: (row) =>
          row.third_party
            ? `${row.third_party?.document} ${
                row.third_party?.name ? `- ${row.third_party?.name}` : ''
              }`
            : '-',
        align: 'left',
        sortable: true,
        required: true
      },
      {
        name: 'transaction_value',
        label: 'Valor de compra/venta',
        field: 'transaction_value',
        align: 'right',
        sortable: true,
        required: true
      },
      {
        name: 'currency',
        label: 'Moneda',
        field: (row) => row.currency[0]?.code || '-',
        align: 'left',
        sortable: true,
        required: true
      },
      {
        name: 'accounts_payable_status',
        label: 'Contabilidad',
        field: (row) => row.accounting_status || '-',
        align: 'left',
        sortable: true,
        required: true
      },
      {
        name: 'approval_statuses',
        label: 'Aprobación',
        field: (row) => row.approval_status.status?.toString() || '-',
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

    const response = await _getBuySaleFixedAssetsList(filters)

    tableProps.value.rows = response.list
    tableProps.value.pages = response.pages
    tableProps.value.loading = false
  }

  const refreshList = async () => {
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const optionsActions = (id: number) => [
    {
      label: 'Eliminar',
      action: () => openDeleteModal(id)
    },
    {
      label: 'Aprobar',
      action: () => openApproveModal(id)
    }
  ]

  // modals
  const deleteModalRef = ref()
  const approveModalRef = ref()

  const modalConfig = ref({
    selectedId: null as number | null,
    deleteTitle: '¿Desea eliminar este registro?',
    approveTitle: '¿Está seguro de aprobar el registro?'
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
    await _deleteBuySaleFixedAssets(modalConfig.value.selectedId)
    await refreshList()
    modalConfig.value.selectedId = null
    openMainLoader(false)
  }

  // approve modal
  const openApproveModal = (id: number) => {
    modalConfig.value.selectedId = id
    approveModalRef.value?.openModal()
  }

  const handleApprove = async () => {
    openMainLoader(true)
    approveModalRef.value?.closeModal()
    if (!modalConfig.value.selectedId) return
    await _approveBuySaleFixedAssets(modalConfig.value.selectedId)
    await refreshList()
    modalConfig.value.selectedId = null
    openMainLoader(false)
  }

  // options create - usando rutas separadas para compra y venta
  const optionsCreate = ref<DropdownOption[]>([
    {
      label: 'Compra',
      action: () => router.push({ name: 'BuyFixedAssetsCreate' })
    },
    {
      label: 'Venta',
      action: () => router.push({ name: 'SaleFixedAssetsCreate' })
    }
  ])

  // Navegación a editar según tipo de transacción
  const goToEdit = (row: IBuySaleFixedAssetsList) => {
    const routeName =
      row.transaction_type === 'Compra' ? 'BuyFixedAssetsEdit' : 'SaleFixedAssetsEdit'
    router.push({ name: routeName, params: { id: row.id } })
  }

  // Navegación a ver según tipo de transacción
  const goToRead = (row: IBuySaleFixedAssetsList) => {
    const routeName =
      row.transaction_type === 'Compra' ? 'BuyFixedAssetsRead' : 'SaleFixedAssetsRead'
    router.push({ name: routeName, params: { id: row.id } })
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
    approveModalRef,
    modalConfig,

    // options
    optionsActions,
    optionsCreate,

    // actions
    goToURL,
    goToEdit,
    goToRead,
    handleFilter,
    updatePage,
    updateRowsPerPage,
    handleClearFilters,
    handleDelete,
    handleApprove
  }
}

export default useBuySaleFixedAssetsList
