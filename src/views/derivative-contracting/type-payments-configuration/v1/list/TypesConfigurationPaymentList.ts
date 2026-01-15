// Vue, Pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Stores
import { useResourceStore, useTypesConfigurationPaymentStore } from '@/stores'

// Composables
import {
  useMainLoader,
  useUtils,
  useGoToUrl,
  useRouteValidator,
} from '@/composables'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@interfaces/customs'
import { ITypesPaymentConfigurationResponse } from '@/interfaces/customs/derivative-contracting/TypePaymentsConfiguration'

const useTypesPaymentList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()

  const typesStore = useTypesConfigurationPaymentStore('v1')
  const {
    _getPaymentTypes,
    _deleteTypeConfigurationPayment,
    _activateTypeConfigurationPayment,
    _inactivateTypeConfigurationPayment,
  } = typesStore
  const { types_configuration_payment_list } = storeToRefs(typesStore)

  const resourcesStore = useResourceStore('v1')
  const { status } = storeToRefs(resourcesStore)

  const isRowActive = (row: ITypesPaymentConfigurationResponse) =>
    row?.status?.id === 1 ||
    (row?.status?.name || '').toLowerCase() === 'activo'

  const headerProps = {
    title: 'Configuración de tipos de pagos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada', route: '' },
      { label: 'Configuración de tipos de pago', route: 'TypesPaymentList' },
    ],
  }

  const tableProps = ref<IBaseTableProps<ITypesPaymentConfigurationResponse>>({
    title: 'Listado de tipos de pago',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
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
        label: 'Nombre del tipo de pago',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'payment_type',
        required: true,
        label: 'Tipo de pago',
        align: 'left',
        field: 'payment_type',
        sortable: true,
      },
      {
        name: 'require_authorization',
        required: true,
        label: '¿Pide autorización?',
        align: 'left',
        field: (row) => (row.require_authorization ? 'Sí' : 'No'),
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
      label: 'Tipos de pago',
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
      if (v !== '' && v !== null && v !== undefined) query.append(k, String(v))
    })
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getPaymentTypes(query.toString())
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

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'delete':
        alertModalDeleteConfig.value.id = id
        await alertModalDelete.value.openModal()
        break
      case 'activar':
        alertModalUpdateConfig.value.id = id
        alertModalUpdateConfig.value.title =
          '¿Desea activar el tipo de pago configurado seleccionado?'
        await alertModalUpdate.value.openModal()
        break
      case 'inactivar':
        alertModalUpdateConfig.value.id = id
        alertModalUpdateConfig.value.title =
          '¿Desea inactivar el tipo de pago configurado seleccionado?'
        await alertModalUpdate.value.openModal()
        break
    }
  }

  const changeStatus = async (id: number) => {
    await alertModalUpdate.value?.closeModal()
    openMainLoader(true)
    try {
      const row = tableProps.value.rows.find((r) => r.id === id)
      if (!row) return
      const active = isRowActive(row)
      const ok = active
        ? await _inactivateTypeConfigurationPayment(id)
        : await _activateTypeConfigurationPayment(id)
      if (ok) await listAction(filtersFormat.value)
    } finally {
      openMainLoader(false)
      alertModalUpdateConfig.value.id = null
    }
  }

  const deletePaymentTypeAction = async (id: number) => {
    await alertModalDelete.value?.closeModal()
    openMainLoader(true)
    const ok = await _deleteTypeConfigurationPayment(id)
    if (ok) await listAction(filtersFormat.value)
    openMainLoader(false)
    alertModalDeleteConfig.value.id = null
  }

  watch(
    types_configuration_payment_list,
    (val) => {
      tableProps.value.rows = [...val]
      const { page } = filtersFormat.value
      tableProps.value.pages = {
        currentPage: page,
        lastPage: 1,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    defaultIconsLucide,
    tableProps,
    filterConfig,
    alertModalUpdate,
    alertModalUpdateConfig,
    alertModalDelete,
    alertModalDeleteConfig,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    handleOptions,
    changeStatus,
    deletePaymentTypeAction,
    goToURL,
    validateRouter,
  }
}

export default useTypesPaymentList
