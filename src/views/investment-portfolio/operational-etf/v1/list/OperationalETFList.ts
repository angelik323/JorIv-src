import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import { IFieldFilters, IOperationalETFItem } from '@/interfaces/customs'

import { defaultIconsLucide, formatParamsCustom } from '@/utils'

import { default_statuses } from '@/constants/resources'

import {
  useInvestmentPortfolioResourceStore,
  useOperationalETFStore,
  useResourceManagerStore,
} from '@/stores'
import { useMainLoader } from '@/composables'

const useOperationalETFList = () => {
  const {
    _getOperationalETFList,
    _cleanOperationalETFsData,
    _updateOperationalETFStatus,
    _deleteOperationalETF,
  } = useOperationalETFStore('v1')
  const { operational_etf_list, operational_etf_pages } = storeToRefs(
    useOperationalETFStore('v1')
  )
  const { emitter, exchange_traded_fund_all } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  let perPage = 20

  const modalAction = ref<'eliminar' | 'cambiar' | null>(null)
  const selectedPortfolio = ref<IOperationalETFItem>()
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
  })

  const tableProps = ref({
    title: 'Listado definición de ETFs',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'etf_number',
        sortable: true,
      },
      {
        name: 'crated_at',
        required: true,
        label: 'Fecha de operación',
        align: 'left',
        field: (row: IOperationalETFItem) => `${row.crated_at}`,
        sortable: true,
      },
      {
        name: 'etf_number',
        required: true,
        label: 'Número ETFs',
        align: 'left',
        field: (row: IOperationalETFItem) => `${row.etf_number}`,
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción ETFs',
        align: 'left',
        field: (row: IOperationalETFItem) => `${row.description}`,
        sortable: true,
      },
      {
        name: 'transmitter',
        required: true,
        label: 'Nit emisor',
        align: 'left',
        field: (row: IOperationalETFItem) => `${row.transmitter.nit}`,
        sortable: true,
      },
      {
        name: 'transmitter',
        required: true,
        label: 'Descripción emisor',
        align: 'left',
        field: (row: IOperationalETFItem) => `${row.transmitter.description}`,
        sortable: true,
      },
      {
        name: 'administrator',
        required: true,
        label: 'Nit administrador',
        align: 'left',
        field: (row: IOperationalETFItem) => `${row.administrator.nit}`,
        sortable: true,
      },
      {
        name: 'administrator',
        required: true,
        label: 'Descripción administrador',
        align: 'left',
        field: (row: IOperationalETFItem) => `${row.administrator.description}`,
        sortable: true,
      },
      {
        name: 'isin',
        required: true,
        label: 'ISIN',
        align: 'left',
        field: (row: IOperationalETFItem) =>
          `${row.isin.mnemonic} - ${row.isin.description}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: IOperationalETFItem) => `${row.status.id}`,
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
    rows: [] as IOperationalETFItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const keys = {
    investment_portfolio: ['exchange_traded_fund_all', 'emitter'],
  }

  const headerProps = {
    title: "Definición ETF's",
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: "Definición ETF's" },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'exchange_traded_fund_id',
      label: 'Número ETFs',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      options: exchange_traded_fund_all,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'transmitter',
      label: 'Nit emisor',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      options: emitter,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código y/o descripción administrador',
    },
    {
      name: 'operation_date',
      label: 'Fecha operación',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      options: default_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
      rows: perPage,
    }

    listAction()
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _cleanOperationalETFsData()
  })

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }

    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }

    listAction()
  }

  const listAction = async () => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const queryString = formatParamsCustom(filtersFormat.value)
    const filters = queryString ? '&' + queryString : ''
    await _getOperationalETFList(filters)
    tableProps.value.loading = false
  }

  const handleGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onMounted(async () => {
    _cleanOperationalETFsData()
    tableProps.value.rows = operational_etf_list.value
  })

  watch(
    () => operational_etf_list.value,
    () => {
      tableProps.value.rows = operational_etf_list.value
    }
  )

  watch(
    () => operational_etf_pages.value,
    () => {
      tableProps.value.pages = operational_etf_pages.value
    }
  )

  const openAlertModal = async (
    action: 'eliminar' | 'cambiar',
    rowOrId: IOperationalETFItem | number
  ) => {
    modalAction.value = action

    const row =
      typeof rowOrId === 'number'
        ? operational_etf_list.value.find((r) => r.etf_number === rowOrId)
        : rowOrId

    selectedPortfolio.value = row ?? (null as unknown as IOperationalETFItem)
    alertModalConfig.value.id =
      row?.etf_number ?? (typeof rowOrId === 'number' ? rowOrId : null)

    alertModalConfig.value.title =
      action === 'eliminar'
        ? `¿Desea eliminar el registro ${alertModalConfig.value.id} definición de ETFs?`
        : `¿Desea cambiar el estado del registro ${alertModalConfig.value.id} definición de ETFs ?`

    alertModalConfig.value.description =
      action === 'eliminar'
        ? 'Esta acción no se puede deshacer.'
        : 'Se actualizará el estado del ETF seleccionado.'

    await alertModalRef.value.openModal()
  }

  const deleteAction = async () => {
    if (!alertModalConfig.value.id) return
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteOperationalETF(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  const updatePortfolioStatus = async () => {
    const id = alertModalConfig.value.id ?? selectedPortfolio.value?.etf_number
    if (!id) return
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    const success = await _updateOperationalETFStatus(id)
    if (success) await listAction()
    openMainLoader(false)
  }

  const onConfirm = async () => {
    if (modalAction.value === 'eliminar') return deleteAction()
    if (modalAction.value === 'cambiar') return updatePortfolioStatus()
  }

  return {
    // Props
    headerProps,
    tableProps,
    alertModalRef,
    selectedPortfolio,
    filterConfig,
    alertModalConfig,
    // Methods
    handleFilter,
    handleGoTo,
    updatePage,
    updatePerPage,
    updatePortfolioStatus,
    openAlertModal,
    deleteAction,
    onConfirm,
    _cleanOperationalETFsData,
  }
}

export default useOperationalETFList
