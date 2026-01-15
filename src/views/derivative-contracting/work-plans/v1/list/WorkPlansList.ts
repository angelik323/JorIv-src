// Vue, Pinia
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import type { IBaseTableProps } from '@/interfaces/global/Table'
import type { IFieldFilters } from '@/interfaces/customs/Filters'
import type { ITypesWorkPlanResponse } from '@/interfaces/customs/derivative-contracting/WorkPlans'

// Composables
import {
  useMainLoader,
  useUtils,
  useGoToUrl,
  useRouteValidator,
} from '@/composables'

// Stores
import { useWorkPlansStore } from '@/stores/derivative-contracting/work-plans'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'

const useWorkPlansList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()

  const workPlansStore = useWorkPlansStore('v1')
  const { _getWorkPlans, _deleteWorkPlan } = workPlansStore
  const { work_plans_list } = storeToRefs(workPlansStore)

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    derivative_contracting: ['work_plan'],
  }
  const { work_plan } = storeToRefs(useDerivativeContractingResourceStore('v1'))
  const workPlanOptions = computed(() =>
    work_plan.value.map((item) => ({
      label: item.label_code_purpose,
      value: item.value,
    }))
  )
  const headerProps = {
    title: 'Planes de obra',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada', route: '' },
      { label: 'Planes de obra', route: 'WorkPlansList' },
    ],
  }

  const tableProps = ref<IBaseTableProps<ITypesWorkPlanResponse>>({
    title: 'Listado de planes de obra',
    loading: false,
    wrapCells: true,
    columns: [
      { name: 'id', label: '#', field: 'id', sortable: true },
      { name: 'code', label: 'Código', field: 'code', sortable: true },
      { name: 'name', label: 'Nombre', field: 'name', sortable: true },
      { name: 'type', label: 'Tipo', field: 'type', sortable: true },
      {
        name: 'status',
        label: 'Estado',
        field: (row) => row.status?.name ?? '',
        sortable: true,
      },
      { name: 'actions', label: 'Acciones', align: 'center', field: 'id' },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'structure_plan_code_id',
      type: 'q-select',
      label: 'Código de estructura del plan de obra',
      placeholder: 'Seleccione',
      value: null,
      class: 'col-12 col-md-4',
      clean_value: true,
      disable: false,
      autocomplete: true,
      options: workPlanOptions,
    },
    {
      name: 'structure_name',
      type: 'q-input',
      label: 'Estructura',
      placeholder: 'Inserte',
      value: null,
      class: 'col-12 col-md-4',
      clean_value: true,
      disable: false,
    },
    {
      name: 'purpose',
      type: 'q-input',
      label: 'Uso',
      placeholder: 'Inserte',
      value: null,
      class: 'col-12 col-md-4',
      clean_value: true,
      disable: false,
    },
  ])

  const filtersFormat = ref({
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
    await _getWorkPlans(query.toString())
    tableProps.value.loading = false
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }

  const handleFilter = async ($filters: Record<string, string>) => {
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
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
    action: undefined as 'delete' | undefined,
  })

  const handleOptions = async (option: 'edit' | 'delete', id: number) => {
    if (option === 'edit') {
      goToURL('WorkPlansEdit', { id })
      return
    }

    alertModalConfig.value = {
      title: 'Advertencia',
      description: '¿Desea eliminar el plan de obra seleccionado?',
      id,
      action: 'delete',
    }
    await alertModalRef.value?.openModal()
  }

  const confirmOption = async () => {
    await alertModalRef.value?.closeModal()

    if (
      !alertModalConfig.value.id ||
      alertModalConfig.value.action !== 'delete'
    )
      return

    openMainLoader(true)
    const ok = await _deleteWorkPlan(alertModalConfig.value.id)
    if (ok) await listAction(filtersFormat.value)
    openMainLoader(false)

    alertModalConfig.value.id = null
    alertModalConfig.value.action = undefined
  }

  watch(
    work_plans_list,
    (val) => {
      tableProps.value.rows = [...val]
      tableProps.value.pages = {
        currentPage: filtersFormat.value.page,
        lastPage: 1,
      }
    },
    { deep: true }
  )

  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

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

export default useWorkPlansList
