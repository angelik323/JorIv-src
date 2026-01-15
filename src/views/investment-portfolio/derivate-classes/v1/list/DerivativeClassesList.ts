// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'
import { IDerivativeClassesListItem } from '@/interfaces/customs/investment-portfolio/DerivativeClasses'

// Composables - constants
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'
import { operation_type, status } from '@/constants'

// Stores
import { useDerivativeClassesStore } from '@/stores'

export const useDerivativeClassesList = () => {
  const { _getDerivateClassesList, _deleteDerivativeClass, _changeStatus } =
    useDerivativeClassesStore('v1')
  const {
    headerPropsDefault,
    derivate_classes_pages,
    derivative_classes_list,
  } = storeToRefs(useDerivativeClassesStore('v1'))

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const headerProperties = headerPropsDefault.value

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'operation_type',
      label: 'Operación',
      type: 'q-select',
      options: operation_type,
      value: null,
      disable: false,
      clean_value: true,
      class: 'col-12 col-md-4',
    },
    {
      name: 'created_at',
      label: 'Fecha',
      type: 'q-date',
      value: null,
      disable: false,
      clean_value: true,
      class: 'col-12 col-md-4',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      options: status,
      value: null,
      disable: false,
      clean_value: true,
      class: 'col-12 col-md-4',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      placeholder: 'Buscar por tipo o descripción derivado',
      value: null,
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      class: 'col-12 col-md-4',
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      per_page: number
    } & Record<string, string | number>
  >({
    page: 1,
    per_page: 20,
  })

  const tableProps = ref<IBaseTableProps<IDerivativeClassesListItem>>({
    title: 'Listado clases de derivados',
    loading: false,
    wrapCells: true,
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
        name: 'date',
        required: false,
        label: 'Fecha',
        align: 'left',
        field: (row: IDerivativeClassesListItem) =>
          row.date?.substring(0, 10) ?? '',
        sortable: true,
      },
      {
        name: 'operation',
        required: false,
        label: 'Operación',
        align: 'left',
        field: 'operation',
        sortable: true,
      },
      {
        name: 'code',
        required: false,
        label: 'Código Derivado',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'derivative_type',
        required: false,
        label: 'Tipo Derivado',
        align: 'left',
        field: 'derivative_type',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'derivative_underlying',
        required: false,
        label: 'Tipo Subyacente',
        align: 'left',
        field: 'derivative_underlying',
        sortable: true,
      },
      {
        name: 'currency',
        required: false,
        label: 'Moneda',
        align: 'left',
        field: 'currency',
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

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getDerivateClassesList(filters)
    tableProps.value.loading = false
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }

  const handleFilter = ($filter: {
    'filter[operation_type]': string
    'filter[created_at]': string
    'filter[status_id]': number
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filter,
      page: 1,
      per_page: filtersFormat.value.per_page,
    }

    listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (per_page: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.per_page = per_page

    await listAction(filtersFormat.value)
  }

  const alertModalDeleteRef = ref()
  const alertModalDeleteConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el registro clase de derivados?',
    id: null as number | null,
  })

  const alertModalStatusRef = ref()
  const alertModalStatusConfig = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
    status_id: null as number | null,
  })

  const handleDelete = async (id: number) => {
    if (id) {
      alertModalDeleteConfig.value.id = id
      await alertModalDeleteRef.value.openModal()
    }
  }

  const handleStatus = async (row: IDerivativeClassesListItem) => {
    alertModalStatusConfig.value.id = row.id
    alertModalStatusConfig.value.status_id = Number(row.status) ?? null
    alertModalStatusConfig.value.description = `¿Desea ${
      alertModalStatusConfig.value.status_id === 1 ? 'inactivar' : 'activar'
    } el registro ${row.code} clase de derivados?`

    await alertModalStatusRef.value.openModal()
  }

  const deleteDerivativeClass = async () => {
    openMainLoader(true)
    await alertModalDeleteRef.value.closeModal()
    if (!alertModalDeleteConfig.value.id) return
    await _deleteDerivativeClass(alertModalDeleteConfig.value.id)
    filtersFormat.value = {
      page: 1,
      per_page: filtersFormat.value.per_page,
    }
    await listAction(filtersFormat.value)
    openMainLoader(false)
  }

  const changeStatus = async () => {
    openMainLoader(true)
    await alertModalStatusRef.value.closeModal()
    if (!alertModalStatusConfig.value.id) return
    await _changeStatus(
      alertModalStatusConfig.value.id,
      alertModalStatusConfig.value.status_id === 1 ? 2 : 1
    )
    filtersFormat.value = {
      page: 1,
      per_page: 20,
    }
    await listAction(filtersFormat.value)
    openMainLoader(false)
  }

  watch(
    () => derivative_classes_list.value,
    (val) => {
      tableProps.value.rows = [...val]
      const { currentPage, lastPage } = derivate_classes_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )
  return {
    defaultIconsLucide,
    filterComponentRef,
    headerProperties,
    tableProps,
    filterConfig,
    alertModalDeleteRef,
    alertModalStatusRef,
    alertModalStatusConfig,
    alertModalDeleteConfig,
    validateRouter,
    goToURL,
    handleClear,
    handleFilter,
    updatePage,
    updateRowsPerPage,
    deleteDerivativeClass,
    handleDelete,
    changeStatus,
    handleStatus,
  }
}
