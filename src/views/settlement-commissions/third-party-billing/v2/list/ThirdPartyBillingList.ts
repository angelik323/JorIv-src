// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IThirdPartyBillingListV2 } from '@/interfaces/customs/settlement-commissions/ThirdPartyBillingV2'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps, StatusID } from '@/interfaces/global'

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
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useThirdPartyBillingStore } from '@/stores/settlement-commissions/third-party-billing'
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'
import { status } from '@/constants'

const useThirdPartyBillingList = () => {
  const {
    _getThirdPartyBillingList,
    _changeStatusThirdPartyBilling,
    _clearData,
  } = useThirdPartyBillingStore('v2')

  const { third_party_billing_list, third_party_billing_pages } = storeToRefs(
    useThirdPartyBillingStore('v2')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { business_trusts_thirdparty_billing } = storeToRefs(
    useSettlementCommissionsResourceStore('v1')
  )

  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide } = useUtils()
  const { max_length } = useRules()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const headerProperties = {
    title: 'Vincular terceros de facturación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
      },
      {
        label: 'Vincular terceros de facturación',
        route: 'ThirdPartyBillingList',
      },
    ],
  }

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const alertModalRef = ref()
  const alertModalConfig = ref({
    id: null as number | null,
    status: null as number | null,
    title: 'Advertencia',
    description: '',
  })

  const tableProps = ref<IBaseTableProps<IThirdPartyBillingListV2>>({
    title: 'Listado de vinculación de terceros de facturación',
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
        name: 'business_name',
        field: (row) =>
          (row.business_code_snapshot ?? '') +
          ' - ' +
          (row.business_name_snapshot ?? ''),
        required: true,
        label: 'Código y nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'third_party_document',
        field: (row) =>
          row.third_party_document_type +
          ' - ' +
          row.third_party_document +
          ' - ' +
          row.third_party_name,
        required: true,
        label: 'Nombre del tercero',
        align: 'left',
        sortable: true,
      },
      {
        name: 'third_party_address',
        field: 'third_party_address',
        required: true,
        label: 'Dirección',
        align: 'left',
        sortable: true,
        format: (val) => val ?? '-',
      },
      {
        name: 'third_party_phone',
        field: 'third_party_phone',
        required: true,
        label: 'Teléfono',
        align: 'left',
        sortable: true,
        format: (val) => val ?? '-',
      },
      {
        name: 'third_party_email',
        field: 'third_party_email',
        required: true,
        label: 'Correo electrónico',
        align: 'left',
        sortable: true,
        format: (val) => val ?? '-',
      },
      {
        name: 'created_date',
        field: 'created_date',
        required: true,
        label: 'Fecha de vinculación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: (row) => row.comission_settlement_statuses?.id,
        required: true,
        label: 'Estado',
        align: 'left',
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

  const { updateRowById } = useTable<IThirdPartyBillingListV2>(tableProps)

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'start_date',
      label: 'Fecha inicial de vinculación',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'end_date',
      label: 'Fecha final de vinculación',
      type: 'q-date',
      value: null,
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
      options: business_trusts_thirdparty_billing,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: 0,
      class: 'col-12 col-md-4',
      options: status,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-8',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por Nº de identificación/nombre del tercero',
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
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getThirdPartyBillingList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[business_code]': string | number
    'filter[status_id]': string | number
    'filter[search]': string
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

  const updatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const handleClear = async () => {
    tableProps.value.rows = []
  }

  const openAlertModal = async (row: IThirdPartyBillingListV2) => {
    alertModalConfig.value.description = `¿Desea ${
      row.comission_settlement_statuses_id === StatusID.ACTIVE
        ? 'inactivar'
        : 'activar'
    } el tercero de facturación?`
    alertModalConfig.value.id = row.id
    alertModalConfig.value.status = row.comission_settlement_statuses_id
    await alertModalRef.value.openModal()
  }

  const changeStatusAction = async () => {
    const { id, status } = alertModalConfig.value
    if (!id || !status) return

    openMainLoader(true)
    const success = await _changeStatusThirdPartyBilling(
      alertModalConfig.value.id as number
    )
    if (success)
      updateRowById(id, {
        comission_settlement_statuses_id: status === 1 ? 2 : 1,
      })
    openMainLoader(false)
    alertModalRef.value.closeModal()
  }

  const keys = {
    settlement_commissions: ['business_trusts_thirdparty_billing'],
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    third_party_billing_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = third_party_billing_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProperties,
    tableProps,
    filterConfig,
    defaultIconsLucide,
    isRowActive,
    alertModalRef,
    alertModalConfig,

    handleClear,
    handleFilter,
    updatePage,
    updatePerPage,
    openAlertModal,
    goToURL,
    changeStatusAction,
    validateRouter,
  }
}

export default useThirdPartyBillingList
