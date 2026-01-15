// Vue - Pinia - Router - Quasar
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Composables
import {
  useMainLoader,
  useRouteValidator,
  useGoToUrl,
  useUtils,
} from '@/composables'

// Interfaces
import { StatusID } from '@/interfaces/global'
import {
  ITypesContractingDocumentsList,
  IFieldFilters,
} from '@/interfaces/customs'

// Constants
import { default_statuses } from '@/constants'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useTypesContractingDocumentsStore } from '@/stores/derivative-contracting/types-contracting-documents'

const useTypesContractingDocumentsList = () => {
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { contract_type_category, contract_type_status_budget_validy } =
    storeToRefs(useDerivativeContractingResourceStore('v1'))

  const store = useTypesContractingDocumentsStore('v1')
  const { _getListAction, _updateStatusAction, _deleteAction } = store
  const {
    types_contracting_documents_list,
    types_contracting_documents_pages,
  } = storeToRefs(store)

  const keys = {
    derivative_contracting: [
      'contract_type_category',
      'contract_type_status_budget_validy',
    ],
  }

  const headerProps = {
    title: 'Tipos de documentos contractuales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
      },
      {
        label: 'Tipos de documentos de contratos',
        route: 'TypesContractingDocumentsList',
      },
    ],
    btnLabel: 'Crear',
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'category',
      label: 'Categoría',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-3',
      options: contract_type_category,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-3',
      options: default_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'budget_validity',
      label: 'Vigencia presupuestal',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-3',
      options: contract_type_status_budget_validy,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
    },
  ])

  const tableProps = ref({
    title: 'Listado de tipos de documentos de contratos',
    loading: false,
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
        name: 'document_code',
        required: false,
        label: 'Código del documento',
        align: 'left',
        field: 'document_code',
        sortable: true,
      },
      {
        name: 'document_name',
        required: false,
        label: 'Nombre documento',
        align: 'left',
        field: 'document_name',
        sortable: true,
      },
      {
        name: 'category',
        required: false,
        label: 'Categoría',
        align: 'left',
        field: (row: ITypesContractingDocumentsList) =>
          `${row.category?.label ?? ''}`,
        sortable: true,
      },
      {
        name: 'budget_validity',
        required: false,
        label: 'Vigencia presupuestal',
        align: 'left',
        field: (row: ITypesContractingDocumentsList) =>
          `${row.budget_validity?.label ?? ''}`,
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status_id',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as ITypesContractingDocumentsList[],
    pages: types_contracting_documents_pages.value,
  })

  const alertModalDeleteRef = ref()
  const alertModalStatusRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[category]': string
    'filter[status]': string
    'filter[budget_validity]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleFilterClear = () => {
    tableProps.value.rows = []
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }
  const openAlertModal = async (action: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.title = `¿Desea ${action} el documento seleccionado?`
    action === 'eliminar'
      ? await alertModalDeleteRef.value.openModal()
      : await alertModalStatusRef.value.openModal()
  }

  const changeStatusAction = async () => {
    const entityId = alertModalConfig.value.entityId
    if (!entityId) return

    await alertModalStatusRef.value.closeModal()
    openMainLoader(true)

    const row = tableProps.value.rows.find(
      (row: ITypesContractingDocumentsList) => row.id === entityId
    )

    if (!row) return

    const status =
      row.status_id === StatusID.ACTIVE ? StatusID.INACTIVE : StatusID.ACTIVE

    const responseSuccess = await _updateStatusAction(entityId, status)

    if (responseSuccess && entityId) {
      row.status_id = status
    }

    openMainLoader(false)
  }

  const deleteAction = async () => {
    if (!alertModalConfig.value.entityId) return

    await alertModalDeleteRef.value.closeModal()
    openMainLoader(true)
    await _deleteAction(alertModalConfig.value.entityId)
    await listAction()
    openMainLoader(false)
  }

  onMounted(() => {
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => types_contracting_documents_list.value,
    () => {
      tableProps.value.rows = types_contracting_documents_list.value
      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...types_contracting_documents_pages.value,
      }
    }
  )

  return {
    defaultIconsLucide,
    headerProps,
    tableProps,
    filterConfig,
    alertModalDeleteRef,
    alertModalStatusRef,
    alertModalConfig,

    handleFilter,
    handleFilterClear,
    updatePage,
    updatePerPage,
    openAlertModal,
    changeStatusAction,
    deleteAction,
    validateRouter,
    goToURL,
  }
}

export default useTypesContractingDocumentsList
