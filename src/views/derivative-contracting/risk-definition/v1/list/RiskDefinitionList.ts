import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Store
import { useRiskDefinitionsStoreV1 } from '@/stores/derivative-contracting/risk-definition/risk-definition-v1'

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
import { IRiskDefinitionResponse } from '@/interfaces/customs/derivative-contracting'

// Constants
import { status } from '@/constants/resources'

const useRiskDefinitionsList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()

  const riskStore = useRiskDefinitionsStoreV1()
  const {
    _getRiskDefinitions,
    _deleteRiskDefinition,
    _changeRiskDefinitionStatus,
  } = riskStore

  const { risk_definitions_list } = storeToRefs(riskStore)

  const recordStatus = ref()

  const headerProps = {
    title: 'Definición de riesgos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada', route: '' },
      { label: 'Clases de pólizas y tipo de riesgos', route: '' },
      { label: 'Riesgos', route: 'RiskDefinitionsList' },
    ],
  }

  const tableProps = ref<IBaseTableProps<IRiskDefinitionResponse>>({
    title: 'Listado de riesgos definidos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'code',
        required: true,
        label: 'Código de riesgo',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre del riesgo',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'nature',
        required: true,
        label: 'Naturaleza',
        align: 'left',
        field: 'nature',
        sortable: true,
      },
      {
        name: 'minimum_percentage',
        required: true,
        label: '% Mínimo',
        align: 'left',
        field: (row) => row.minimum_percentage ?? '',
        sortable: true,
      },
      {
        name: 'maximum_percentage',
        required: true,
        label: '% Máximo',
        align: 'left',
        field: (row) => row.maximum_percentage ?? '',
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
      label: 'Riesgos',
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
    await _getRiskDefinitions(query.toString())
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

  const alertModalUpdate = ref()
  const alertModalUpdateConfig = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
  })
  const alertModalDelete = ref()
  const alertModalDeleteConfig = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
  })

  const handleOptions = async (option: string, id: number, status?: number) => {
    switch (option) {
      case 'change-status':
        recordStatus.value = status
        alertModalUpdateConfig.value.id = id
        alertModalUpdateConfig.value.title = `¿Desea ${
          status === 1 ? 'inactivar' : 'activar'
        } el riesgo seleccionado?`
        await alertModalUpdate.value.openModal()
        break
      case 'delete':
        alertModalDeleteConfig.value.id = id
        alertModalDeleteConfig.value.title =
          '¿Desea eliminar el riesgo seleccionado?'
        await alertModalDelete.value.openModal()
        break
    }
  }

  const deleteRiskAction = async (id: number) => {
    await alertModalDelete.value?.closeModal()
    openMainLoader(true)
    const ok = await _deleteRiskDefinition(id)
    if (ok) await listAction(filtersFormat.value)
    openMainLoader(false)
    alertModalDeleteConfig.value.id = null
  }

  const updateRiskAction = async (id: number) => {
    const nextStatusId = recordStatus.value === 1 ? ACTIVE_ID : INACTIVE_ID
    await alertModalUpdate.value?.closeModal()
    openMainLoader(true)
    const ok = await _changeRiskDefinitionStatus(id, nextStatusId)
    if (ok) await listAction(filtersFormat.value)
    openMainLoader(false)
    alertModalUpdateConfig.value.id = null
  }

  const ACTIVE_ID = 1
  const INACTIVE_ID = 2
  const isRowActive = (status: number): boolean => {
    return status === ACTIVE_ID
  }

  watch(
    risk_definitions_list,
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

    alertModalDelete,
    alertModalDeleteConfig,
    alertModalUpdate,
    alertModalUpdateConfig,
    isRowActive,

    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    handleOptions,
    deleteRiskAction,
    updateRiskAction,

    goToURL,
    validateRouter,
  }
}

export default useRiskDefinitionsList
