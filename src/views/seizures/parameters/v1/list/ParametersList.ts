// Vue
import { onMounted, ref, computed } from 'vue'

// Interfaces
import { ISeizuresParametersList } from '@/interfaces/customs/seizures/Parameters'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables'

// Stores
import { useSeizuresStore } from '@/stores/seizures'

const useSeizuresParametersList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const handleGoToList = () => {
    goToURL('SeizuresList')
  }

  const store = useSeizuresStore('v1')
  const { _listParametersAction, _updateParameterAction } = store

  const editModalRef = ref()

  const selectedRow = ref<{
    id: number
    priority: number
    process_type_name: string
    embargability_limit: number
  }>({
    id: 0,
    priority: 0,
    process_type_name: '',
    embargability_limit: 0,
  })

  const pagination = ref({
    page: 1,
    rowsPerPage: 20,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const headerProps = {
    title: 'Reglas de aplicabilidad',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Embargos', route: 'SeizuresList' },
      {
        label: 'Reglas de aplicabilidad',
        route: 'SeizuresParametersList',
      },
    ],
  }

  const tableProps = ref<IBaseTableProps<ISeizuresParametersList>>({
    title: 'Listado de reglas',
    loading: false,
    columns: [
      {
        name: 'priority',
        align: 'center',
        label: 'Prioridad',
        field: 'priority',
      },
      {
        name: 'process_type',
        align: 'left',
        label: 'Tipo de proceso',
        field: 'process_type_name',
        sortable: true,
      },
      {
        name: 'embargability_limit',
        align: 'left',
        label: 'Límite de embargabilidad',
        field: 'embargability_limit',
        sortable: true,
      },
      {
        name: 'actions',
        align: 'left',
        label: 'Acciones',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const visibleRows = computed<ISeizuresParametersList[]>(() => {
    const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
    const end = start + pagination.value.rowsPerPage

    return tableProps.value.rows.slice(start, end)
  })

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.loading = true
    tableProps.value.rows = []

    const response = await _listParametersAction(filters)

    const rows: ISeizuresParametersList[] = (response ?? []).map(
      (item: ISeizuresParametersList) => ({
        id: item.id,
        priority: item.priority,
        process_type_name: item.process_type_name,
        embargability_limit: Number(item.embargability_limit.replace('%', '')),
      })
    )

    tableProps.value.rows = rows
    tableProps.value.pages = {
      currentPage: pagination.value.page,
      lastPage: Math.max(
        1,
        Math.ceil(rows.length / pagination.value.rowsPerPage)
      ),
    }

    tableProps.value.loading = false
    openMainLoader(false)
  }

  const handleUpdatePage = (page: number) => {
    pagination.value.page = page
    tableProps.value.pages.currentPage = page
  }

  const handleUpdatePerPage = (rows: number) => {
    pagination.value.rowsPerPage = rows
    pagination.value.page = 1

    tableProps.value.pages = {
      currentPage: 1,
      lastPage: Math.max(1, Math.ceil(tableProps.value.rows.length / rows)),
    }
  }

  const openModal = (id: number) => {
    const row = tableProps.value.rows.find((r) => r.id === id)

    selectedRow.value = row
      ? {
          id: row.id,
          process_type_name: row.process_type_name,
          priority: row.priority,
          embargability_limit: Number(row.embargability_limit),
        }
      : {
          id: 0,
          process_type_name: '',
          priority: 0,
          embargability_limit: 0,
        }

    editModalRef.value?.openModal()
  }

  const closeModal = () => {
    editModalRef.value?.closeModal()
  }

  const onSubmit = async () => {
    openMainLoader(true)

    const success = await _updateParameterAction(selectedRow.value.id, {
      priority: selectedRow.value.priority,
      embargability_limit: selectedRow.value.embargability_limit,
    })

    openMainLoader(false)

    if (!success) return

    closeModal()
    await loadData(filtersFormat.value)
  }

  onMounted(async () => {
    await loadData(filtersFormat.value)
  })

  return {
    tableProps,
    visibleRows,
    handleUpdatePage,
    handleUpdatePerPage,
    openModal,
    closeModal,
    onSubmit,
    editModalRef,
    selectedRow,
    headerProps,
    defaultIconsLucide,
    handleGoToList,
  }
}

export default useSeizuresParametersList
