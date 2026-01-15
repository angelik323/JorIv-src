//Core
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
//Composable
import { useGoToUrl, useRouteValidator, useUtils } from '@/composables'
//Interfaces
import { IBudgetTransferListItem } from '@/interfaces/customs/budget/BudgetTransferParameter'
import { useBudgetTransferStore } from '@/stores/budget/budget-transfer-parameters'
import { IFieldFilters } from '@/interfaces/customs/Filters'
//Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { IBaseTableProps } from '@/interfaces/global'

const useBudgetTransferParametersList = () => {
  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { goToURL } = useGoToUrl()
  const {
    _cleanData,
    _getBudgetTransferList,
    _deleteBudgetTransfer,
    _downloadBudgetTransferList,
  } = useBudgetTransferStore('v1')
  const { budget_transfer_list, budget_transfer_pages } = storeToRefs(
    useBudgetTransferStore('v1')
  )
  const { budget_document_transfer_type } = storeToRefs(
    useBudgetResourceStore('v1')
  )
  const { _resetKeys, _getResources } = useResourceManagerStore('v1')

  const keys = {
    budget: ['budget_document_types_selector'],
  }

  onBeforeMount(() => {
    _resetKeys(keys)
  })

  onMounted(async () => {
    await _getResources(keys)
  })

  let perPage = 20

  const headerProps = {
    title: 'Parámetros de traslados presupuestales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Parámetros de traslados presupuestales',
        route: 'BudgetTransferList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
      route: () => goToURL('BudgetTransferParametersCreate'),
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_transfer_parameters.budget_document_type_id',
      label: 'Tipo de documento',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      options: budget_document_transfer_type,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = async ($filters: Record<string, string | number>) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    await listAction(queryString)
  }

  const tableProps = ref<IBaseTableProps<IBudgetTransferListItem>>({
    title: 'Listado de parámetros de traslados presupuestales',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: (row: IBudgetTransferListItem) => row.business?.id,
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: (row: IBudgetTransferListItem) => row.business?.code,
        sortable: true,
      },
      {
        name: 'document_type',
        required: true,
        label: 'Tipo de documento',
        align: 'left',
        field: (row: IBudgetTransferListItem) => row.business?.document_type,
        sortable: true,
      },
      {
        name: 'from_business_source',
        required: true,
        label: 'Desde negocio fuente',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.business?.from_business_source?.business_code,
        sortable: true,
      },
      {
        name: 'to_business_source',
        required: true,
        label: 'Hasta negocio fuente',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.business?.to_business_source?.business_code,
        sortable: true,
      },
      {
        name: 'from_business_target',
        required: true,
        label: 'Desde negocio destino',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.business?.from_business_target?.business_code,
        sortable: true,
      },
      {
        name: 'to_business_target',
        required: true,
        label: 'Hasta negocio destino',
        field: (row: IBudgetTransferListItem) =>
          row.business?.to_business_target?.business_code,
        align: 'left',
        sortable: true,
      },
      {
        name: 'from_area_source',
        required: true,
        label: 'Desde área fuente',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.area_transfer?.from_area_source,
        sortable: true,
      },
      {
        name: 'to_area_source',
        required: true,
        label: 'Hasta área fuente',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.area_transfer?.to_area_source,
        sortable: true,
      },
      {
        name: 'from_area_target',
        required: true,
        label: 'Desde área destino',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.area_transfer?.from_area_target,
        sortable: true,
      },
      {
        name: 'to_area_target',
        required: true,
        label: 'Hasta área destino',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.area_transfer?.to_area_target,
        sortable: true,
      },
      {
        name: 'from_budget_item_source',
        required: true,
        label: 'Desde rubro fuente',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.budget_item_transfer?.from_budget_item_source,
        sortable: true,
      },

      {
        name: 'to_budget_item_source',
        required: true,
        label: 'Hasta rubro fuente',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.budget_item_transfer?.to_budget_item_source,
        sortable: true,
      },
      {
        name: 'from_budget_item_target',
        required: true,
        label: 'Desde rubro destino',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.budget_item_transfer?.from_budget_item_target,
        sortable: true,
      },

      {
        name: 'to_budget_item_target',
        required: true,
        label: 'Hasta rubro destino',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.budget_item_transfer?.to_budget_item_target,
        sortable: true,
      },
      {
        name: 'one_to_one',
        required: true,
        label: '1a1',
        align: 'left',
        field: (row: IBudgetTransferListItem) =>
          row.business.one_to_one ? 'SI' : 'NO',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: () => 'actions',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString)
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString)
  }

  const listAction = async (filters: string) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getBudgetTransferList(filters)
    tableProps.value.loading = false
  }

  const deleteBudgetTransfer = async () => {
    const id = alertModalRef.value.entityId
    await _deleteBudgetTransfer(id)
    alertModalRef.value.closeModal()
    _cleanData()
  }

  const alertModalRef = ref()

  const openAlertModal = async (id: number) => {
    alertModalRef.value.entityId = id
    await alertModalRef.value.openModal()
  }
  const downloadBudgetTransfer = async () => {
    const queryString = formatParamsCustom({ ...filtersFormat.value })
    await _downloadBudgetTransferList(queryString || '')
  }

  const transferView = (id: number) => {
    goToURL('BudgetTransferParametersView', id)
  }

  const editView = (id: number) => {
    goToURL('BudgetTransferParametersEdit', id)
  }

  watch(
    () => budget_transfer_list.value,
    () => {
      tableProps.value.rows = budget_transfer_list.value
    }
  )

  watch(
    () => budget_transfer_pages.value,
    () => {
      tableProps.value.pages = budget_transfer_pages.value
    }
  )

  return {
    tableProps,
    headerProps,
    filterConfig,
    alertModalRef,
    defaultIconsLucide,
    _cleanData,
    validateRouter,
    handleFilter,
    openAlertModal,
    downloadBudgetTransfer,
    deleteBudgetTransfer,
    updatePage,
    updatePerPage,
    transferView,
    editView,
  }
}

export default useBudgetTransferParametersList
