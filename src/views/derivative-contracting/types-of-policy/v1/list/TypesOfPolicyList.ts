// Vue, Pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Stores
import { useTypeOfPoliciesStore } from '@/stores'

// Composables
import {
  useMainLoader,
  useUtils,
  useGoToUrl,
  useRouteValidator,
} from '@/composables'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global/Table'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { ITypeOfPolicy } from '@/interfaces/customs/derivative-contracting/TypesOfPolicy'

// Constants
import { status } from '@/constants/resources'

const useTypeOfPoliciesList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()

  const typeOfPolicyStore = useTypeOfPoliciesStore('v1')
  const {
    _getTypeOfPolicies,
    _deleteTypeOfPolicy,
    _activateTypeOfPolicy,
    _inactivateTypeOfPolicy,
  } = typeOfPolicyStore
  const { type_of_policies_list } = storeToRefs(typeOfPolicyStore)

  const headerProps = {
    title: 'Clases de pólizas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada', route: '' },
      { label: 'Clases de pólizas', route: 'TypeOfPolicyList' },
    ],
  }

  const tableProps = ref<IBaseTableProps<ITypeOfPolicy>>({
    title: 'Listado de tipos de póliza',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Tipo de póliza',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'stage',
        required: true,
        label: 'Etapa',
        align: 'left',
        field: 'stage',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row) => row.status?.name ?? '',
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
    pages: { currentPage: 1, lastPage: 1 },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Tipos de póliza',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: status,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])

  const filtersFormat = ref<
    { page: number; rows: number } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    const query = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) {
        query.append(k, String(v))
      }
    })
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getTypeOfPolicies(query.toString())
    tableProps.value.loading = false
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }

  const handleFilter = async ($filters: {
    'filter[search]': string
    'filter[status_id]': string
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

  const alertModalRef = ref()
  const alertModalConfig = ref<{
    title: string
    description: string
    id: number | null
    action?: 'delete' | 'activate' | 'inactivate'
  }>({
    title: 'Advertencia',
    description: '',
    id: null,
    action: undefined,
  })

  const handleOptions = async (
    option: 'edit' | 'delete' | 'activar' | 'inactivar',
    id: number
  ) => {
    switch (option) {
      case 'edit':
        goToURL('TypesOfPolicyEdit', { id })
        break
      case 'delete':
        alertModalConfig.value = {
          title: 'Advertencia',
          description: '¿Desea eliminar el tipo de póliza seleccionado?',
          id,
          action: 'delete',
        }
        await alertModalRef.value?.openModal()
        break
      case 'activar':
        alertModalConfig.value = {
          title: 'Advertencia',
          description: '¿Desea activar el tipo de póliza seleccionado?',
          id,
          action: 'activate',
        }
        await alertModalRef.value?.openModal()
        break
      case 'inactivar':
        alertModalConfig.value = {
          title: 'Advertencia',
          description: '¿Desea inactivar el tipo de póliza seleccionado?',
          id,
          action: 'inactivate',
        }
        await alertModalRef.value?.openModal()
        break
    }
  }

  const confirmOption = async () => {
    await alertModalRef.value?.closeModal()
    if (!alertModalConfig.value.id || !alertModalConfig.value.action) return

    openMainLoader(true)
    let ok = false
    switch (alertModalConfig.value.action) {
      case 'delete':
        ok = await _deleteTypeOfPolicy(alertModalConfig.value.id)
        break
      case 'activate':
        ok = await _activateTypeOfPolicy(alertModalConfig.value.id)
        break
      case 'inactivate':
        ok = await _inactivateTypeOfPolicy(alertModalConfig.value.id)
        break
    }
    if (ok) await listAction(filtersFormat.value)
    openMainLoader(false)

    alertModalConfig.value.id = null
    alertModalConfig.value.action = undefined
  }

  watch(
    type_of_policies_list,
    (val) => {
      tableProps.value.rows = [...val]
      const { page } = filtersFormat.value
      tableProps.value.pages = { currentPage: page, lastPage: 1 }
    },
    { deep: true }
  )

  return {
    headerProps,
    defaultIconsLucide,
    tableProps,
    filterConfig,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    handleOptions,
    alertModalRef,
    alertModalConfig,
    confirmOption,
    goToURL,
    validateRouter,
  }
}

export default useTypeOfPoliciesList
