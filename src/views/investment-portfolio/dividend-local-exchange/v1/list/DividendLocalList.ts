import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import {
  IFieldFilters,
  IDividendLocalItem,
  DropdownOption,
} from '@/interfaces/customs'

import { defaultIconsLucide, formatParamsCustom } from '@/utils'

import {
  useInvestmentPortfolioResourceStore,
  useDividendLocalStore,
  useResourceManagerStore,
} from '@/stores'
import { useMainLoader, useRouteValidator } from '@/composables'
import {
  dividendTypeOptions,
  currency_type_equity_operations,
} from '@/constants'

const useDividendLocalList = () => {
  const {
    _getDividendLocalList,
    _cleanDividendLocalsData,
    _updateDividendLocalStatus,
    _deleteDividendLocal,
  } = useDividendLocalStore('v1')
  const { dividend_local_list, dividend_local_pages } = storeToRefs(
    useDividendLocalStore('v1')
  )
  const { operation_type } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  let perPage = 20

  const modalAction = ref<'eliminar' | 'cambiar' | null>(null)
  const selectedPortfolio = ref<IDividendLocalItem>()
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
  })

  const tableProps = ref({
    title: 'Listado de operaciones',
    loading: false,
    columns: [
      {
        name: '#',
        required: false,
        label: 'ID Dividendo',
        align: 'left',
        field: 'consecutive',
        sortable: true,
      },
      {
        name: '#',
        required: false,
        label: 'Número ETFs',
        align: 'left',
        field: 'exchange_traded_fund_number',
        sortable: true,
      },
      {
        name: '#',
        required: false,
        label: 'Fecha de registro',
        align: 'left',
        field: 'register_date',
        sortable: true,
      },
      {
        name: '#',
        required: false,
        label: 'Fecha de exigibilidad',
        align: 'left',
        field: 'enforceability_date',
        sortable: true,
      },
      {
        name: '#',
        required: false,
        label: 'Fecha pago dividendo',
        align: 'left',
        field: 'date_pay_dividend',
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
    rows: [] as IDividendLocalItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const keys = {
    investment_portfolio: ['operation_type'],
  }

  const headerProps = {
    title: 'Registro de dividendos ETFs',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'PDI' },
      { label: 'Operaciones renta variable' },
      { label: 'Listado' },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
      options: [
        {
          label: 'Dividendos ETFs Moneda local',
          route: 'DividendLocalCreate',
        },
        {
          label: 'Dividendos ETFs Moneda extranjera',
          route: 'DividendForeignCreate',
        },
      ],
      color: 'primary',
      textColor: 'white',
      size: 'md',
      class: 'btn-header',
      outline: false,
      disable: false,
    },
  }

  const handleBtnSelect = (option: { label: string; routeName?: string }) => {
    if (option?.routeName) router.push({ name: option.routeName })
  }
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'transmitter',
      label: 'Tipo de operación',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      options: operation_type,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'currency_type',
      label: 'Tipo de moneda',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      options: currency_type_equity_operations,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'dividend_type',
      label: 'Tipo de dividendo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      options: dividendTypeOptions,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'register_date',
      label: 'Fecha de registro',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
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
    _cleanDividendLocalsData()
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
    await _getDividendLocalList(filters)
    tableProps.value.loading = false
  }

  const handleGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onMounted(async () => {
    _cleanDividendLocalsData()
    tableProps.value.rows = dividend_local_list.value
  })

  watch(
    () => dividend_local_list.value,
    () => {
      tableProps.value.rows = dividend_local_list.value
    }
  )

  watch(
    () => dividend_local_pages.value,
    () => {
      tableProps.value.pages = dividend_local_pages.value
    }
  )

  const openAlertModal = async (
    action: 'eliminar' | 'cambiar',
    rowOrId: IDividendLocalItem | number
  ) => {
    modalAction.value = action

    const row =
      typeof rowOrId === 'number'
        ? dividend_local_list.value.find(
            (r) => r.parameters.emitter_id === rowOrId
          )
        : rowOrId

    selectedPortfolio.value = row ?? (null as unknown as IDividendLocalItem)
    alertModalConfig.value.id =
      row?.parameters.emitter_id ??
      (typeof rowOrId === 'number' ? rowOrId : null)

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
    await _deleteDividendLocal(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  const updatePortfolioStatus = async () => {
    const id =
      alertModalConfig.value.id ??
      selectedPortfolio.value?.parameters.emitter_id
    if (!id) return
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    const success = await _updateDividendLocalStatus(id)
    if (success) await listAction()
    openMainLoader(false)
  }

  const onConfirm = async () => {
    if (modalAction.value === 'eliminar') return deleteAction()
    if (modalAction.value === 'cambiar') return updatePortfolioStatus()
  }
  const btnOptions = computed<DropdownOption[]>(() =>
    headerProps.btn.options.map((o) => ({
      label: o.label,
      routeName: o.route || undefined,
    }))
  )

  const goToEdit = (row: IDividendLocalItem) => {
    if (!row) return
    const id = row?.real_id
    if (!id) return

    if (row.title === 'dividendo_moneda_local') {
      router.push({
        name: 'DividendLocalEdit',
        params: { id },
      })
    } else if (row.title === 'dividendo_moneda_extranjera') {
      router.push({
        name: 'DividendForeignEdit',
        params: { id },
      })
    }
  }

  const goToView = (row: IDividendLocalItem) => {
    if (!row) return
    const id = row?.real_id
    if (!id) return

    if (row.title === 'dividendo_moneda_local') {
      router.push({
        name: 'DividendLocalView',
        params: { id },
      })
    } else if (row.title === 'dividendo_moneda_extranjera') {
      router.push({
        name: 'DividendForeignView',
        params: { id },
      })
    }
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
    _cleanDividendLocalsData,
    handleBtnSelect,
    validateRouter,
    btnOptions,
    goToEdit,
    goToView,
  }
}

export default useDividendLocalList
