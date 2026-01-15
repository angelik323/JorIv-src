// Core - Pinia - API
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Composables
import {
  useAlert,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'
// Interfaces & types
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import { IBudgetResourceType } from '@/interfaces/customs/budget/ResourceBudget'
// Stores
import { useBudgetResourceTypeModuleStore } from '@/stores/budget/resource-type'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useTypeBudgetResourceList = () => {
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  // Una sola instancia del store
  const budgetResourceTypeStore = useBudgetResourceTypeModuleStore('v1')

  // Desestructurar acciones del store (no son reactivas, solo funciones)
  const {
    _createAction,
    _listAction,
    _downloadExcelAction,
    _clearData,
    _updateAction,
    _deleteAction,
  } = budgetResourceTypeStore

  const { resource_type_list, resource_type_pages } = storeToRefs(
    budgetResourceTypeStore
  )

  const { budget_resources_types } = storeToRefs(useBudgetResourceStore('v1'))

  // Agregar opción "Todos" al selector de tipos
  const budget_resources_types_with_all = computed(() => {
    const base = Array.isArray(budget_resources_types.value)
      ? budget_resources_types.value
      : []
    return [{ label: 'Todos', value: '' }, ...base]
  })

  const typeResourceTableRef = ref()
  const initialValueResourceType: IBudgetResourceType = {
    id: null,
    code: '',
    description: '',
  }
  const resource_type = ref<IBudgetResourceType>({
    ...initialValueResourceType,
  })
  const tableProps = ref<IBaseTableProps<IBudgetResourceType>>({
    title: 'Listado de tipos de recursos',
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: false },
      {
        name: 'code',
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: false,
      },
      {
        name: 'description',
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: false,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })
  const filterConfig = ref([
    {
      name: 'type_resource',
      label: 'Tipo de recurso',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: budget_resources_types_with_all,
      placeholder: 'Todos',
      disable: false,
      clean_value: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-4 q-py-md',
      placeholder: 'Buscar por código o nombre',
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      disable: false,
    },
  ])

  // Filtros
  const filtersFormat = ref<Record<string, string | number>>({})
  const filtersUpdate = (values: Record<string, string | number>) => {
    filtersFormat.value = { ...values }
  }
  const handleFilter = async (filters: Record<string, string | number>) => {
    filtersFormat.value = { ...filters }
    await listAction()
  }
  const handleClearFilters = async () => {
    _clearData()
  }
  const actionModal = ref<ActionType>('create')
  const showModalTypeBudgetResource = ref(false)

  const listAction = async () => {
    tableProps.value.loading = true
    const hasFilters = Object.keys(filtersFormat.value).length > 0
    const params: Record<string, string | number> = hasFilters
      ? { ...filtersFormat.value, paginate: 1 }
      : { page: 1, paginate: 1 }
    await _listAction(params)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    listAction()
  }

  const downloadAction = async () => {
    _downloadExcelAction(filtersFormat.value)
  }

  const openModal = async (
    action: ActionType,
    row?: IBudgetResourceType | null
  ) => {
    if (action === 'edit' && row) {
      resource_type.value = {
        id: row.id,
        code: row.code,
        description: row.description,
      }
    } else {
      resource_type.value = { id: 1, code: '', description: '' }
    }
    actionModal.value = action

    showModalTypeBudgetResource.value = true
  }

  const deleteModalRef = ref()
  const modalsConfig = ref({
    title: computed(() => {
      return actionModal.value === 'create'
        ? 'Agregar tipos de recursos'
        : 'Editar tipos de recursos'
    }),
    description: '¿Desea eliminar el tipo de recurso?',
    entityId: null as number | null,
  })
  const openModalDelete = async (id: number) => {
    modalsConfig.value.entityId = id || null
    deleteModalRef.value.openModal()
  }
  const handleDelete = async () => {
    if (!modalsConfig.value.entityId) return
    deleteModalRef.value.closeModal()
    openMainLoader(true)
    const success = await _deleteAction(String(modalsConfig.value.entityId))
    if (success) await listAction()
    openMainLoader(false)
  }
  const onSubmit = async () => {
    let success = false
    openMainLoader(true)
    if (actionModal.value === 'create') {
      const payload = typeResourceTableRef.value?.getAllRowsData() || []
      success = await _createAction(payload)
    } else {
      const payload = typeResourceTableRef.value.getRowData()
      success = await _updateAction(payload)
    }
    openMainLoader(false)
    if (success) {
      closeModalTypeResourceBudget()
      await listAction()
    }
  }
  const closeModalTypeResourceBudget = () => {
    showModalTypeBudgetResource.value = false
  }
  const handleConfirm = () => {
    onSubmit()

    closeModalTypeResourceBudget()
  }

  // Validación dinámica para deshabilitar el botón de confirmar
  const disableConfirm = computed(() => {
    if (!typeResourceTableRef.value) return true

    const rows = typeResourceTableRef.value.getAllRowsData?.() || []

    // Si no hay filas, deshabilitar
    if (rows.length === 0) return true

    // Validar cada fila
    return rows.some((row: IBudgetResourceType) => {
      // Validar código
      if (!row.code || row.code === '') return true
      if (String(row.code).length > 3) return true

      // Validar descripción
      if (!row.description || row.description === '') return true
      if (String(row.description).length > 100) return true

      return false
    })
  })
  const handleCloseModalDelete = () => {
    deleteModalRef.value.entityId = null
    showAlert('No se eliminó ningún registro', 'info', undefined, 3000)
  }
  // Watch para actualizar rows cuando cambie el store
  watch(
    () => resource_type_list.value,
    () => {
      tableProps.value.rows = resource_type_list.value
      tableProps.value.pages.currentPage = resource_type_pages.value.currentPage
      tableProps.value.pages.lastPage = resource_type_pages.value.lastPage
    },
    { immediate: true, deep: true }
  )

  return {
    typeResourceTableRef,
    deleteModalRef,
    showModalTypeBudgetResource,
    tableProps,
    filterConfig,
    resource_type,
    defaultIconsLucide,
    modalsConfig,
    actionModal,
    updatePage,
    updatePerPage,
    filtersUpdate,
    downloadAction,
    openModalDelete,
    openModal,
    validateRouter,
    closeModalTypeResourceBudget,
    handleDelete,
    handleFilter,
    handleClearFilters,
    handleConfirm,
    disableConfirm,
    handleCloseModalDelete,
  }
}

export default useTypeBudgetResourceList
