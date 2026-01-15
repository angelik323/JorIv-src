// vue - quasar - router
import { onMounted, ref } from 'vue'
import { QTable } from 'quasar'

// composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

//interfaces
import {
  ICashUnitFilters,
  ICashUnitResponseList,
} from '@/interfaces/customs/fixed-assets/CashGeneratingUnit'
import { useCashGeneratingUnitStoreV1 } from '@/stores/fixed-assets/cash-generating-unit/cash-generating-unit-v1'
import { useFixedAssetsResourceStore, useResourceManagerStore } from '@/stores'
import { StatusID } from '@/interfaces/global'

// stores

const useCashGeneratingUnitList = () => {
  // composables
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide, formatCurrency } = useUtils()

  // stores
  const { _getCashUnitList, _deleteCasUnit, _updateCashUnitStatus } =
    useCashGeneratingUnitStoreV1()

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE
  const filtersFormat = ref<Record<string, string | number>>({})
  const tableRef = ref()
  const perPage = ref(20)
  const alertModalRef = ref()
  const alertModalDeleteRef = ref()

  const showMore = ref()

  // keys
  const keys = ref({
    fixed_assets: ['uge', 'business_trusts_uge', 'statuses_uge'],
  })

  const headerProps = {
    title: 'Unidades generadoras de efectivo',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Activos fijos',
        route: '',
      },
      {
        label: 'Unidades generadoras de efectivo',
        route: 'CashGeneratingUnitList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  const { _getResources } = useResourceManagerStore('v1')
  // stores

  const { business_trusts_uge, uge, statuses_uge } =
    useFixedAssetsResourceStore('v1')

  // filters
  const filterConfig = ref([
    {
      name: 'business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      options: business_trusts_uge,
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'configuration_type_id',
      label: 'Tipo de UGE',
      type: 'q-select',
      options: uge,
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      options: statuses_uge,
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'start_date',
      label: 'Fecha de inicio',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      hide: true,
    },
    {
      name: 'end_date',
      label: 'Fecha de final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      hide: true,
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    customColumns: string[]
    rows: ICashUnitResponseList[]
    filterRows: ICashUnitResponseList[]
    pages: {
      currentPage: number
      lastPage: number
    }
  }>({
    title: 'Listado de UGE’s',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'configuration_type',
        required: true,
        label: 'Código UGE',
        align: 'center',
        field: (row) =>
          `${row.configuration_type.code} - ${row.configuration_type.description}`,
        sortable: true,
      },
      {
        name: 'business_trust_id',
        required: true,
        label: 'Negocio ',
        align: 'center',
        field: (row) =>
          `${row.business_trust.business_code} - ${row.business_trust.name}`,
        sortable: true,
      },
      {
        name: 'configuration_type',
        required: true,
        label: 'Tipo de UGE',
        align: 'center',
        field: (row) =>
          `${row.configuration_type.code} - ${row.configuration_type.description}`,
        sortable: true,
      },
      {
        name: 'description_type',
        required: true,
        label: 'Descripción tipo UGE',
        align: 'center',
        field: 'description_type',
        sortable: true,
      },
      {
        name: 'created_at',
        required: true,
        label: 'Fecha de generación de flujos',
        align: 'center',
        field: 'created_at',
        sortable: true,
      },
      {
        name: 'initial_value',
        required: true,
        label: 'Valor inicial UGE',
        align: 'center',
        field: (row) => formatCurrency(row.initial_value ?? 0),
        sortable: true,
      },
      {
        name: 'currency',
        required: true,
        label: 'Moneda UGE',
        align: 'center',
        field: 'currency',

        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        field: 'status',
        sortable: true,
      },

      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: true,
      },
    ] as QTable['columns'],
    customColumns: ['status', 'actions'],
    rows: [],
    filterRows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const alertModalConfig = ref({
    description: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
    business_trust_name: null as null | string,
    option: '',
  })

  const openModalStatus = (
    id: number,
    business_trust_name: string,
    status: string
  ) => {
    const action = status === 'Activo' ? 'Inactivar' : 'Activar'

    alertModalConfig.value.description = `¿Desea ${action} el UGE ${id} - ${business_trust_name}?`
    alertModalConfig.value.id = id
    alertModalConfig.value.business_trust_name = business_trust_name
    alertModalConfig.value.option = action

    alertModalRef.value.openModal()
  }

  const openDeleteModal = async (id: number, business_trust_name: string) => {
    alertModalConfig.value.description =
      alertModalConfig.value.description = `¿Desea anular el UGE ${id} - ${business_trust_name}?`
    alertModalConfig.value.business_trust_name = business_trust_name
    alertModalConfig.value.id = id
    alertModalConfig.value.option = 'cashGeneratingUnit'

    alertModalDeleteRef.value.openModal()
  }

  const listAction = async (filters: typeof filtersFormat.value) => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    tableRef.value.clearSelection()

    const list = await _getCashUnitList(filters)

    tableProps.value.rows = list?.data || []
    tableProps.value.pages = list?.pages ?? { currentPage: 1, lastPage: 1 }

    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: ICashUnitFilters) => {
    filtersFormat.value = { ...$filters }

    await listAction(filtersFormat.value)
  }

  const handleClearFilters = async () => {
    tableProps.value.rows = []
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      rows: perPage.value,
      page,
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    await listAction(filtersFormat.value)
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return

    openMainLoader(true)
    let result = false

    if (alertModalConfig.value.option === 'cashGeneratingUnit') {
      result = await _deleteCasUnit(alertModalConfig.value.id)
    }

    if (result) {
      await alertModalDeleteRef.value.closeModal()
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const handleStatus = async () => {
    if (!alertModalConfig.value.id) return

    openMainLoader(true)

    let result = false
    const id = alertModalConfig.value.id

    const status_id = alertModalConfig.value.option === 'Inactivar' ? 2 : 1

    result = await _updateCashUnitStatus(id, status_id)

    if (result) {
      await alertModalRef.value.closeModal()
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  // filter more-filters
  const handleShowFilters = () => {
    showMore.value = !showMore.value
    const hiddenFilters = ['start_date', 'end_date']

    filterConfig.value.forEach((field) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !showMore.value
      }
    })
  }

  onMounted(async () => {
    await _getResources(keys.value)
  })

  return {
    headerProps,
    filterConfig,
    tableProps,
    tableRef,
    alertModalRef,
    alertModalConfig,
    alertModalDeleteRef,

    goToURL,
    updatePage,
    updatePerPage,
    handleFilter,
    handleClearFilters,

    validateRouter,
    handleShowFilters,

    isRowActive,
    handleStatus,
    openModalStatus,
    handleDelete,
    openDeleteModal,
  }
}

export default useCashGeneratingUnitList
