// Vue - Pinia - Router - Quasar
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import {
  useMainLoader,
  useRouteValidator,
  useGoToUrl,
  useUtils,
} from '@/composables'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { ProjectManagementFilter } from '@/interfaces/global/DerivativeContracting'
import {
  IProjectManagementItem,
  IProjectManagementBusinessChildrenItem,
} from '@/interfaces/customs/derivative-contracting/ProjectManagement'

// Stores
import {
  useResourceManagerStore,
  useTrustBusinessResourceStore,
  useDerivativeContractingResourceStore,
} from '@/stores/resources-manager'
import { useProjectManagementStore } from '@/stores/derivative-contracting/project-management'

const useProjectManagementList = () => {
  const { goToURL } = useGoToUrl()
  const {
    defaultIconsLucide,
    formatFiltersToParamsCustom,
    formatParamsCustom,
  } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { business_trusts_derivate_contracting, business_trust_types } =
    storeToRefs(useTrustBusinessResourceStore('v1'))
  const { business_trust_derivative_contracting_statuses } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )

  const store = useProjectManagementStore('v1')
  const { _getListAction, _deleteAction, _getListAssociatedAction } = store
  const {
    project_management_list,
    project_management_pages,
    business_children_list,
  } = storeToRefs(store)

  const keysDerivativeContracting = {
    derivative_contracting: ['business_trust_derivative_contracting_statuses'],
  }

  const keysTrustBusiness = {
    trust_business: ['business_trust_types'],
  }

  const keysTrustBusinessDerivateContracting = {
    trust_business: ['business_trusts_derivate_contracting'],
  }

  const headerProps = {
    title: 'Proyectos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
      },
      {
        label: 'Administración de proyectos',
        route: 'ProjectManagementList',
      },
    ],
    btnLabel: 'Crear',
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: ProjectManagementFilter.FIDUCIARY_BUSINESS_ID,
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
      options: business_trusts_derivate_contracting,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: ProjectManagementFilter.BUSINESS_TYPE_ID,
      label: 'Tipo de negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
      options: business_trust_types,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: ProjectManagementFilter.BUSINESS_STATUS_ID,
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
      options: business_trust_derivative_contracting_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])

  const tableProps = ref<IBaseTableProps<IProjectManagementItem>>({
    title: 'Listado de proyectos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'check',
        required: false,
        label: '',
        align: 'center',
        field: 'id',
        sortable: false,
      },
      {
        name: 'code',
        required: false,
        label: 'Código',
        align: 'center',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre del proyecto',
        align: 'center',
        field: 'name',
        sortable: true,
      },
      {
        name: 'business',
        required: false,
        label: 'Negocio',
        align: 'center',
        field: (row: IProjectManagementItem) => {
          return `${row.business_code ?? ''} - ${row.business_name ?? ''}`
        },
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status',
        sortable: true,
      },
      {
        name: 'start_date',
        required: false,
        label: 'Fecha inicio',
        align: 'center',
        field: 'start_date',
        sortable: true,
      },
      {
        name: 'end_date',
        required: false,
        label: 'Fecha fin',
        align: 'center',
        field: 'end_date',
        sortable: true,
      },
      {
        name: 'expenditure_computer',
        required: false,
        label: 'Ordenador del gasto',
        align: 'center',
        field: 'expenditure_computer',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const associatedBusinessTableProps = ref<
    IBaseTableProps<IProjectManagementBusinessChildrenItem>
  >({
    title: 'Negocios vinculados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'code',
        required: false,
        label: 'Código de negocio',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre de negocio',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const alertModalDeleteRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
  })

  const filtersFormat = ref<Record<string, string | number>>({})
  const selectedProject = ref<IProjectManagementItem | null>(null)

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: { key: string; value: string }) => {
    const queryString = formatParamsCustom($filters)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleFilterClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    associatedBusinessTableProps.value.rows = []
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
    alertModalConfig.value.title = `¿Desea ${action} el proyecto seleccionado?`
    await alertModalDeleteRef.value.openModal()
  }

  const deleteAction = async () => {
    if (!alertModalConfig.value.entityId) return

    await alertModalDeleteRef.value.closeModal()
    openMainLoader(true)
    await _deleteAction(alertModalConfig.value.entityId)
    await listAction()
    openMainLoader(false)
  }

  const handleSelectionChange = (projectId: IProjectManagementItem) => {
    selectedProject.value = projectId
    associatedBusinessListAction()
  }

  const associatedBusinessListAction = async (filters: string = '') => {
    associatedBusinessTableProps.value.rows = []
    associatedBusinessTableProps.value.loading = true
    if (!selectedProject.value) return

    await _getListAssociatedAction(
      selectedProject.value ? '/' + String(selectedProject.value) : '',
      filters
    )
    associatedBusinessTableProps.value.loading = false
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keysDerivativeContracting)
    await _getResources(keysTrustBusiness)

    const filters = {
      [ProjectManagementFilter.DERIVATE_CONTRACTING]: 'true',
      [ProjectManagementFilter.INCLUDE_CONSOLIDATED]: 'true',
    }

    const params = formatFiltersToParamsCustom(filters)
    await _getResources(
      keysTrustBusinessDerivateContracting,
      new URLSearchParams(params).toString()
    )
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keysDerivativeContracting)
    _resetKeys(keysTrustBusiness)
    _resetKeys(keysTrustBusinessDerivateContracting)
  })

  watch(
    () => project_management_list.value,
    () => {
      tableProps.value.rows = project_management_list.value
      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...project_management_pages.value,
      }
    },
    { immediate: true }
  )

  watch(
    () => business_children_list.value,
    () => {
      associatedBusinessTableProps.value.rows = business_children_list.value
    },
    { immediate: true }
  )

  return {
    defaultIconsLucide,
    headerProps,
    filterConfig,
    tableProps,
    associatedBusinessTableProps,
    alertModalDeleteRef,
    alertModalConfig,
    selectedProject,

    handleFilter,
    handleFilterClear,
    updatePage,
    updatePerPage,
    openAlertModal,
    deleteAction,
    handleSelectionChange,
    validateRouter,
    goToURL,
  }
}

export default useProjectManagementList
