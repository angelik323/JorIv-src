// Vue - pinia - moment
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IContractClausesList } from '@/interfaces/customs/derivative-contracting/ContractClauses'
import { StatusID } from '@/interfaces/global'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useContractClausesStore } from '@/stores/derivative-contracting'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'

// Constantes
import { status } from '@/constants'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useUtils,
  useRouteValidator,
} from '@/composables'

const useContractClausesList = () => {
  const {
    _getContractClausesList,
    _deleteContractClauses,
    _clearData,
    _changeStatus,
  } = useContractClausesStore('v1')
  const { contract_clauses_list, contract_clauses_pages } = storeToRefs(
    useContractClausesStore('v1')
  )
  const { clause_types, contract_clauses_codes, contract_clauses_names } =
    storeToRefs(useDerivativeContractingResourceStore('v1'))
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  const deleteModalRef = ref()
  const rowToDelete = ref<IContractClausesList | null>(null)
  const alertModalRef = ref()
  const selectedRow = ref<IContractClausesList | null>(null)

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const keys = {
    derivative_contracting: ['contract_clauses_codes'],
  }

  const filterConfig = computed<IFieldFilters[]>(() => [
    {
      name: 'clause_type_id',
      label: 'Tipo de cláusula',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: clause_types,
    },
    {
      name: 'code',
      label: 'Código de cláusula',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: contract_clauses_codes,
    },
    {
      name: 'code',
      label: 'Nombre de cláusula',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: contract_clauses_names,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      options: status,
    },
  ])

  const headerProps = {
    title: 'Cláusulas de contratos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
        route: '',
      },
      {
        label: 'Cláusulas de contratos',
        route: 'ContractClausesList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de cláusulas de contratos',
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
        name: 'code',
        field: (row) => row.code ?? 'Sin información',
        required: true,
        label: 'Código de cláusula',
        align: 'left',
        sortable: true,
      },
      {
        name: 'type',
        field: (row) => row.type?.name,
        required: true,
        label: 'Tipo de cláusula',
        align: 'left',
        sortable: true,
      },
      {
        name: 'name',
        field: 'name',
        required: true,
        label: 'Nombre de cláusula',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status_id',
        field: 'status_id',
        required: true,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IContractClausesList[],
    pages: contract_clauses_pages.value,
  })

  const filtersFormat = ref<Record<string, string | number>>({})
  const alertModalConfig = ref({
    title: '',
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getContractClausesList(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const handleFilter = async ($filters: {
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      per_page: filtersFormat.value.per_page,
    }

    await listAction(filtersFormat.value)
  }

  const updatePerPage = async (rowsPerPage: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.per_page = rowsPerPage

    await listAction(filtersFormat.value)
  }

  const handleClear = async () => {
    tableProps.value.rows = []
  }

  const openDeleteModal = (row: IContractClausesList) => {
    rowToDelete.value = row
    deleteModalRef.value.openModal()
  }

  const confirmDeleteAction = async () => {
    if (!rowToDelete.value) return

    openMainLoader(true)
    const success = await _deleteContractClauses(rowToDelete.value.id)

    if (success) {
      await listAction(filtersFormat.value)
    }

    openMainLoader(false)
    deleteModalRef.value.closeModal()
    rowToDelete.value = null
  }

  const openAlertModal = (row: IContractClausesList) => {
    selectedRow.value = row
    alertModalConfig.value.title = `¿Desea ${
      isRowActive(row.status.id) ? 'inactivar' : 'activar'
    } el registro?`

    alertModalRef.value.openModal()
  }

  const changeStatusAction = async () => {
    if (!selectedRow.value) return
    const { id, status } = selectedRow.value
    const statusFormatted =
      status.id === StatusID.ACTIVE ? StatusID.INACTIVE : StatusID.ACTIVE

    openMainLoader(true)
    const success = await _changeStatus(id, statusFormatted)
    openMainLoader(false)

    if (success) {
      const newStatus =
        selectedRow.value.status.id === StatusID.ACTIVE
          ? StatusID.INACTIVE
          : StatusID.ACTIVE

      selectedRow.value.status.id = newStatus
      if (selectedRow.value.status.id) {
        selectedRow.value.status.id = newStatus
      }
    }

    alertModalRef.value.closeModal()
    selectedRow.value = null
  }

  const getResourcesContract = async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(
      {
        derivative_contracting: ['clause_types'],
      },
      `filter[is_system]=true`
    )
    openMainLoader(false)
  }

  onMounted(async () => {
    _clearData()
    getResourcesContract()
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    contract_clauses_list,
    () => {
      tableProps.value.rows = contract_clauses_list.value
      const { currentPage, lastPage } = contract_clauses_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    deleteModalRef,
    alertModalRef,
    alertModalConfig,
    defaultIconsLucide,
    goToURL,
    changeStatusAction,
    openAlertModal,
    isRowActive,
    confirmDeleteAction,
    openDeleteModal,
    handleClear,
    updatePerPage,
    handleFilter,
    updatePage,
    validateRouter,
  }
}

export default useContractClausesList
