// Vue - Pinia
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IPaymentAuthorizersItemList } from '@/interfaces/customs/accounts-payable/PaymentAuthorizers'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Stores
import { usePaymentAuthorizersStore } from '@/stores/accounts-payable/payment-authorizers'
import { useUserResourceStore } from '@/stores/resources-manager/users'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const usePaymentAuthorizersList = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const { _getPaymentAuthorizersList, _deletePaymentAuthorizers } =
    usePaymentAuthorizersStore('v1')

  const { users_label_email } = storeToRefs(useUserResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, formatCurrency } = useUtils()

  const showState = ref(false)
  const isPaymentAuthorizersListEmpty = ref(true)

  const headerProps = {
    title: 'Autorizadores de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Autorizadores de pago',
        route: 'PaymentAuthorizersList',
      },
    ],
    btn: {
      icon: defaultIconsLucide.plusCircleOutline,
      label: 'Crear',
    },
  }

  const dateInputDisabled = ref(false)

  const isDateInputDisabled = computed(() => dateInputDisabled.value)

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'autorized_user_id',
      label: 'Usuario autorizado',
      type: 'q-select',
      value: '',
      class: 'col-4',
      options: users_label_email,
      autocomplete: true,
      disable: false,
      clean_value: true,
      onChange: (val: number) => onChangeUser(val),
      placeholder: 'Seleccione',
    },
    {
      name: 'date_from',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-4',
      autocomplete: false,
      disable: isDateInputDisabled,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'date_to',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-4',
      autocomplete: false,
      disable: isDateInputDisabled,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const onChangeUser = (val: number) => {
    dateInputDisabled.value = !!val
    filterConfig.value[1].value = null
    filterConfig.value[2].value = null
  }

  const tableProps = ref<IBaseTableProps<IPaymentAuthorizersItemList>>({
    title: 'Listado de autorizadores de pago ',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'user_name',
        required: false,
        label: 'Usuario autorizado',
        field: (row) => row.autorized_user.email,
        sortable: true,
        align: 'left',
      },
      {
        name: 'amount_from',
        required: false,
        label: 'Monto desde',
        field: (row) => formatCurrency(row.amount_from) ?? '-',
        sortable: true,
      },
      {
        name: 'amount_to',
        required: false,
        label: 'Monto hasta',
        field: (row) => formatCurrency(row.amount_to) ?? '-',
        sortable: true,
      },
      {
        name: 'created_at',
        required: false,
        label: 'Fecha de creación',
        field: 'created_at',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'id',
        sortable: false,
        align: 'center',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const alertModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Desea eliminar el autorizador de pago?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
  })

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const result = await _getPaymentAuthorizersList(filters)

    if (result) {
      tableProps.value.rows = result.list
      tableProps.value.pages = result.pages
    }
    tableProps.value.loading = false
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const handleFilter = async ($filters: {
    'filter[autorized_user_id]': number
    'filter[date_from]': string
    'filter[date_to]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    clearData()
    await listAction(filtersFormat.value)

    showState.value = true
    isPaymentAuthorizersListEmpty.value = tableProps.value.rows.length === 0
  }

  const handleClearFilters = async () => {
    clearData()
    isPaymentAuthorizersListEmpty.value = true
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

  const clearData = () => {
    tableProps.value.rows = []
    tableProps.value.pages = {
      currentPage: 1,
      lastPage: 1,
    }
  }

  const openAlertModal = (row: IPaymentAuthorizersItemList) => {
    alertModalConfig.value.id = row.id ?? null
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (await _deletePaymentAuthorizers(alertModalConfig.value.id)) {
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const keys = {
    user: ['users'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    filterConfig.value[0].options.unshift({ label: 'Todos', value: '' })
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    defaultIconsLucide,
    headerProps,
    filterConfig,
    tableProps,
    showState,
    isPaymentAuthorizersListEmpty,
    alertModalRef,
    alertModalConfig,
    handleFilter,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,
    openAlertModal,
    handleDelete,
    goToURL,
    validateRouter,
  }
}

export default usePaymentAuthorizersList
