// Vue - pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IAnnualPaymentAmountsItem, IFieldFilters } from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useRules, useUtils } from '@/composables'

// Stores
import {
  useAccountsPayableResourceStore,
  useResourceManagerStore,
  useAnnualPaymentAmountsStore,
} from '@/stores'

export const useAnnualPaymentAmountsList = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { annual_payment_amounts_list, annual_payment_amounts_pages } =
    storeToRefs(useAnnualPaymentAmountsStore('v1'))

  const {
    _getAnnualPaymentAmountsList,
    _deleteAnnualPaymentAmounts,
    _clearData,
  } = useAnnualPaymentAmountsStore('v1')

  const { annual_payment_years } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const { defaultIconsLucide, formatCurrency } = useUtils()

  const { is_required } = useRules()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const showState = ref(false)
  const isAnnualPaymentAmountsListEmpty = ref(true)

  const alertModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Desea eliminar el monto anual de pago?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
  })

  const headerProps = {
    title: 'Montos anuales de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Montos anuales de pago',
        route: 'AnnualPaymentAmountsList',
      },
    ],
    btn: {
      icon: defaultIconsLucide.plusCircleOutline,
      label: 'Crear',
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'year',
      label: 'Vigencia*',
      type: 'q-select',
      value: 'Todos',
      class: 'col-12',
      options: annual_payment_years,
      disable: false,
      clean_value: true,
      icon: defaultIconsLucide.calendar,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val, 'La vigencia es requerida')],
    },
  ])

  const tableProps = ref<IBaseTableProps<IAnnualPaymentAmountsItem>>({
    title: 'Listado de montos anuales de pago',
    loading: false,
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
        name: 'year',
        required: false,
        label: 'Vigencia',
        align: 'left',
        field: 'year',
        sortable: true,
      },
      {
        name: 'minimum_salary',
        required: false,
        label: 'Salario mínimo',
        align: 'left',
        field: (row) => formatCurrency(row.minimum_salary) ?? '-',
        sortable: true,
      },
      {
        name: 'transport_subsidy',
        required: false,
        label: 'Subsidio de transporte',
        align: 'left',
        field: (row) => formatCurrency(row.transport_subsidy) ?? '-',
        sortable: true,
      },
      {
        name: 'uvt',
        required: false,
        label: 'UVT',
        align: 'left',
        field: (row) => formatCurrency(row.uvt) ?? '-',
        sortable: true,
      },
      {
        name: 'obligated_iva_uvt_pn',
        required: false,
        label: 'Monto obligado IVA UVT - PN',
        align: 'left',
        field: (row) => formatCurrency(row.obligated_iva_uvt_pn) ?? '-',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
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

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getAnnualPaymentAmountsList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: { 'filter[year]'?: string }) => {
    if ($filters['filter[year]'] === 'Todos') {
      delete $filters['filter[year]']
    }
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    _clearData()

    await listAction(filtersFormat.value)

    showState.value = true
    isAnnualPaymentAmountsListEmpty.value =
      annual_payment_amounts_list.value.length === 0
  }

  const handleClearFilters = async () => {
    _clearData()
    isAnnualPaymentAmountsListEmpty.value = true
    showState.value = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction(filtersFormat.value)
  }

  const updateRowsPerPage = (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    listAction(filtersFormat.value)
  }

  const openDeleteModal = (id: number) => {
    alertModalConfig.value.id = id
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    const result = await _deleteAnnualPaymentAmounts(alertModalConfig.value.id)
    if (result) {
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const keys = { accounts_payable: ['annual_payment_years'] }

  onMounted(async () => {
    await _getResources(keys)
    filterConfig.value[0].options.unshift({ label: 'Todos', value: 'Todos' })
  })

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    () => annual_payment_amounts_list.value,
    (val) => {
      tableProps.value.rows = val

      const { currentPage, lastPage } = annual_payment_amounts_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    filterConfig,
    tableProps,
    showState,
    isAnnualPaymentAmountsListEmpty,
    alertModalRef,
    alertModalConfig,
    handleFilter,
    handleClearFilters,
    openDeleteModal,
    handleDelete,
    updatePage,
    updateRowsPerPage,
    goToURL,
  }
}

export default useAnnualPaymentAmountsList
