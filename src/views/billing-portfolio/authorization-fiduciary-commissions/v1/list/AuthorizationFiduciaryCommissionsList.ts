// Vue - pinia - moment
import { ref, watch, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  IAuthorizationFiduciaryCommission,
  IFieldFilters,
  ITableProps,
} from '@/interfaces/customs'

import TableList from '@/components/table-list/TableList.vue'

// Utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import {
  authorization_fiduciary_commissions_collection,
  authorization_fiduciary_commissions_periodicity,
  authorization_fiduciary_commissions_class,
  authorization_fiduciary_commissions_type,
  authorization_fiduciary_commissions_status,
} from '@/constants'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useAuthorizationFiduciaryCommissionsStore } from '@/stores'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

const useAuthorizationFiduciaryCommissionsList = () => {
  const {
    _getGeneralCommissionsList,
    _clearGeneralCommissionsList,
    _clearData,
    _setAuthorizationCommissionsList,
    _authorizeCommissions,
    _cancelCommissions,
  } = useAuthorizationFiduciaryCommissionsStore('v1')

  const { general_commissions_list, general_commissions_pages } = storeToRefs(
    useAuthorizationFiduciaryCommissionsStore('v1')
  )

  const { formatCurrencyString } = useUtils()

  const headerConfig = {
    title: 'Autorización de comisiones fiduciarias',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Facturación y cartera',
        route: '',
      },
      {
        label: 'Autorización de comisiones fiduciarias',
        route: 'AuthorizationFiduciaryCommissionsList',
      },
    ],
  }

  const filterProps = ref<IFieldFilters[]>([
    {
      name: 'commission_class_catalog',
      label: 'Clase de comisión',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: authorization_fiduciary_commissions_class,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'commission_type_catalog',
      label: 'Tipo de comisión',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: authorization_fiduciary_commissions_type,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'periodicity',
      label: 'Periodicidad',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: authorization_fiduciary_commissions_periodicity,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'comission_settlement_statuses_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: authorization_fiduciary_commissions_status,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'collection',
      label: 'Cobro',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: authorization_fiduciary_commissions_collection,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
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
      placeholder: 'Buscar por código del negocio o nombre del negocio',
    },
  ])

  const filtersFormat = ref<
    { page: number; rows: number } & Record<string, string | number>
  >({ page: 1, rows: 20 })

  const generalParametersListRef = ref<InstanceType<typeof TableList> | null>(
    null
  )

  const cancelSettlementFormRef = ref()

  const generalParametersTableProps = ref<
    ITableProps<IAuthorizationFiduciaryCommission>
  >({
    title: 'Listado de comisiones liquidadas',
    loading: false,
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
        name: 'business_code_name',
        field: (row: IAuthorizationFiduciaryCommission) =>
          `${row.business_code_snapshot} - ${row.business_name_snapshot}`,
        label: 'Nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'commission_class',
        field: 'commission_class_catalog',
        label: 'Clase de comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'commission_type',
        field: 'commission_type_catalog',
        label: 'Tipo de comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'periodicity',
        field: 'periodicity',
        label: 'Periodicidad',
        align: 'left',
        sortable: true,
      },
      {
        name: 'iva',
        field: (row: IAuthorizationFiduciaryCommission) =>
          row.iva ? 'Si' : 'No',
        label: 'Iva',
        align: 'left',
        sortable: true,
      },
      {
        name: 'collection',
        field: (row: IAuthorizationFiduciaryCommission) =>
          row.collection ?? '-',
        label: 'Cobro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: (row: IAuthorizationFiduciaryCommission) => row.status.name,
        label: 'Estado',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ],
    customColumns: ['actions', 'status'],
    rows: general_commissions_list.value,
    pages: general_commissions_pages.value,
  })

  const generalSettlementAlertModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const generalParametersAlertModalProps = ref({
    openButtonTitle: 'Autorizar comisiones',
    enabledButton: false,
  })

  const selectedGeneralParametersRows = ref<
    IAuthorizationFiduciaryCommission[]
  >([])

  const generalSettlementListRef = ref<InstanceType<typeof TableList> | null>(
    null
  )

  const generalSettlementTableProps = ref<
    ITableProps<IAuthorizationFiduciaryCommission>
  >({
    title: 'Listado de comisiones liquidadas',
    loading: false,
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
        name: 'business_code_name',
        field: (row: IAuthorizationFiduciaryCommission) =>
          `${row.business_code_snapshot} - ${row.business_name_snapshot}`,
        label: 'Nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'settlement_date',
        field: 'settlement_date',
        label: 'Fecha de liquidación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'base_amount',
        field: (row: IAuthorizationFiduciaryCommission) =>
          formatCurrencyString(row.base_amount),
        label: 'Valor base',
        align: 'left',
        sortable: true,
      },
      {
        name: 'iva_amount',
        field: (row: IAuthorizationFiduciaryCommission) =>
          row.iva_amount ? formatCurrencyString(row.iva_amount) : '-',
        label: 'IVA',
        align: 'left',
        sortable: true,
      },
      {
        name: 'total_amount',
        field: (row: IAuthorizationFiduciaryCommission) =>
          formatCurrencyString(row.total_amount),
        label: 'Valor total',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const generalSettlementAlertModalProps = ref({
    openButtonTitle: 'Autorizar',
    enabledButton: false,
  })

  const cancelSettlementAlertModalProps = ref({
    id: null as number | null,
    title: '¿Desea anular la comisión?',
    reason: null as string | null,
  })

  const selectedGeneralSettlementRows = ref<
    IAuthorizationFiduciaryCommission[]
  >([])

  const authGeneralSettlementAlertModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const cancelSettlementAlertModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const authGeneralSettlementAlertModalProps = computed(() => ({
    title: `¿Desea autorizar las comisiones (${selectedGeneralSettlementRows.value.length})?`,
  }))

  const handleSelectedGeneralParametersRows = (
    selectedRows: IAuthorizationFiduciaryCommission[]
  ) => {
    if (selectedRows.length === 0) {
      selectedGeneralParametersRows.value = []
      generalParametersAlertModalProps.value.enabledButton = false
      return
    }

    selectedGeneralParametersRows.value = selectedRows

    handleSetGeneralSettlementPagination()

    generalParametersAlertModalProps.value.enabledButton = true
  }

  const handleSelectedGeneralSettlementRows = (
    selectedRows: IAuthorizationFiduciaryCommission[]
  ) => {
    if (selectedRows.length === 0) {
      selectedGeneralSettlementRows.value = []
      generalSettlementAlertModalProps.value.enabledButton = false
      return
    }

    selectedGeneralSettlementRows.value = selectedRows
    generalSettlementAlertModalProps.value.enabledButton = true
  }

  const generalSettlementPerPage = ref(20)

  const handleSetGeneralSettlementPagination = () => {
    generalSettlementTableProps.value.pages.lastPage =
      selectedGeneralParametersRows.value.length > 0
        ? Math.ceil(
            selectedGeneralParametersRows.value.length /
              generalSettlementPerPage.value
          )
        : 1

    const page =
      generalSettlementTableProps.value.pages.currentPage <=
      generalSettlementTableProps.value.pages.lastPage
        ? generalSettlementTableProps.value.pages.currentPage
        : 1

    generalSettlementTableProps.value.rows =
      selectedGeneralParametersRows.value.slice(
        (page - 1) * generalSettlementPerPage.value,
        page * generalSettlementPerPage.value
      )
  }

  const handleUpdateGeneralSettlementUpdatePage = (page: number) => {
    generalSettlementTableProps.value.pages.currentPage = page
    handleSetGeneralSettlementPagination()
  }

  const handleUpdateGeneralSettlementUpdateRows = (rows: number) => {
    generalSettlementPerPage.value = rows
    generalSettlementTableProps.value.pages.currentPage = 1
    handleSetGeneralSettlementPagination()
  }

  const generalParametersListAction = async (filters: string = '') => {
    generalParametersTableProps.value.loading = true
    await _getGeneralCommissionsList(filters)
    generalParametersTableProps.value.loading = false
  }

  const generalSettlementListAction = async () => {
    generalSettlementTableProps.value.loading = true
    await _setAuthorizationCommissionsList({
      selectedCommissions: selectedGeneralParametersRows.value,
    })
    generalSettlementTableProps.value.loading = false
  }

  const handleGeneralParametersFilter = async (
    filters: Record<string, string | number>
  ) => {
    filtersFormat.value = {
      ...filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    await generalParametersListAction(queryString ? '&' + queryString : '')
  }

  const handleGeneralParametersUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    const queryString = formatParamsCustom(filtersFormat.value)
    await generalParametersListAction(queryString ? '&' + queryString : '')
  }

  const handleGeneralParametersUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    const queryString = formatParamsCustom(filtersFormat.value)
    await generalParametersListAction(queryString ? '&' + queryString : '')
  }

  const handleGeneralParametersClearFilter = () => {
    filtersFormat.value = { page: 1, rows: 20 }
    _clearGeneralCommissionsList()
  }

  const handleOpenGeneralSettlementAlertModal = async () => {
    if (!generalSettlementAlertModalRef.value) return
    await generalSettlementAlertModalRef.value.openModal()
    await generalSettlementListAction()
  }

  const handleOpenAuthGeneralSettlementAlertModal = async () => {
    if (!authGeneralSettlementAlertModalRef.value) return
    await authGeneralSettlementAlertModalRef.value.openModal()
  }

  const handleAuthorizeCommissionsSettlement = async () => {
    await _authorizeCommissions({
      ids: selectedGeneralSettlementRows.value.map((row) => row.id),
    })

    generalParametersListRef.value?.clearSelection()
    generalSettlementListRef.value?.clearSelection()
    authGeneralSettlementAlertModalRef.value?.closeModal()
    generalSettlementAlertModalRef.value?.closeModal()

    const queryString = formatParamsCustom(filtersFormat.value)
    await generalParametersListAction(queryString ? '&' + queryString : '')
  }

  const handleOpenCancelCommissionAlertModal = async (id: number) => {
    cancelSettlementAlertModalProps.value.id = id
    cancelSettlementAlertModalRef.value?.openModal()
  }

  const handleCancelCommissionSettlement = async () => {
    if (!(await cancelSettlementFormRef.value.validate())) return
    if (!cancelSettlementAlertModalProps.value.id) return

    const success = await _cancelCommissions({
      ids: [cancelSettlementAlertModalProps.value.id],
      cancellation_reason:
        cancelSettlementAlertModalProps.value.reason ?? 'No especificado',
    })

    if (success) {
      cancelSettlementAlertModalRef.value?.closeModal()
      const queryString = formatParamsCustom(filtersFormat.value)
      await generalParametersListAction(queryString ? '&' + queryString : '')
      handleCloseModal()
    }
  }

  const handleCloseModal = () => {
    cancelSettlementAlertModalProps.value.id = null
    cancelSettlementAlertModalProps.value.reason = null
  }

  const customSelectionFilter = (
    selected: IAuthorizationFiduciaryCommission[]
  ) =>
    selected.filter(
      (item: IAuthorizationFiduciaryCommission) => item.status?.id === 7
    )

  const isEnabledtoCancelCommission = (
    row: IAuthorizationFiduciaryCommission
  ) => {
    return [7, 12].includes(row.status.id)
  }

  onUnmounted(() => _clearData())

  watch(
    general_commissions_list,
    (list) => {
      generalParametersTableProps.value.rows = list.map((row) => ({
        ...row,
        disabled: row.status?.id !== 7,
      }))
    },
    { deep: true }
  )

  watch(
    general_commissions_pages,
    (pages) => {
      const { currentPage, lastPage } = pages
      generalParametersTableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(selectedGeneralParametersRows, (rows) => {
    generalSettlementTableProps.value.rows = rows
  })

  return {
    defaultIconsLucide,
    headerConfig,
    filterProps,

    generalParametersListRef,
    generalSettlementListRef,

    generalParametersAlertModalProps,
    generalSettlementAlertModalProps,
    authGeneralSettlementAlertModalProps,
    cancelSettlementAlertModalProps,

    generalParametersTableProps,
    generalSettlementTableProps,

    generalSettlementAlertModalRef,
    authGeneralSettlementAlertModalRef,
    cancelSettlementAlertModalRef,
    cancelSettlementFormRef,

    handleGeneralParametersFilter,
    handleGeneralParametersClearFilter,
    handleGeneralParametersUpdatePage,
    handleGeneralParametersUpdateRowsPerPage,
    handleSelectedGeneralParametersRows,
    handleSelectedGeneralSettlementRows,
    handleOpenGeneralSettlementAlertModal,
    handleOpenAuthGeneralSettlementAlertModal,
    handleUpdateGeneralSettlementUpdatePage,
    handleUpdateGeneralSettlementUpdateRows,
    handleAuthorizeCommissionsSettlement,
    handleOpenCancelCommissionAlertModal,
    handleCancelCommissionSettlement,
    customSelectionFilter,
    isEnabledtoCancelCommission,
    handleCloseModal,
  }
}

export default useAuthorizationFiduciaryCommissionsList
