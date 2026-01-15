// Vue - Pinia
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  ICausationWithoutPaymentInstructionsForm,
  ICausationWithoutPaymentInstructionsListItem,
  ICausationWithoutPaymentInstructionsPayload,
} from '@/interfaces/customs/accounts-payable/CausationWithoutPaymentInstructions'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'

// Composables
import { useAlert } from '@/composables/useAlert'
import { useRules } from '@/composables/useRules'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// Stores
import { useCausationWithoutPaymentInstructionsStore } from '@/stores/accounts-payable/causation-without-payment-instructions'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useCausationWithoutPaymentInstructionsList = () => {
  const { openMainLoader } = useMainLoader()

  const { showAlert } = useAlert()

  const {
    _getCausationWithoutPaymentInstructionsList,
    _confirmCausationWithoutPaymentInstruction,
    _downloadExcelCausationWithoutPaymentInstructions,
  } = useCausationWithoutPaymentInstructionsStore('v1')

  const { payment_request_businesses } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const { is_required, date_after_or_equal_to_specific_date } = useRules()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { formatCurrency } = useUtils()

  const showState = ref(false)
  const isCausationWithoutPaymentInstructionsListEmpty = ref(true)

  const selected = ref<ICausationWithoutPaymentInstructionsListItem[]>([])

  const headerProps = {
    title: 'Causación sin instrucciones de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Causación sin instrucciones de pago',
        route: 'CausationWithoutPaymentInstructionsList',
      },
    ],
  }

  const basicDataFormRef = ref()

  const alertModalRef = ref()

  const basic_data_form = ref<ICausationWithoutPaymentInstructionsForm | null>({
    tax_provision: null,
    resource_source: null,
    fund_or_bank_id: null,
    plan_or_account_id: null,
  })

  const alertModalConfig = ref({
    title: 'Confirmar',
    description_message:
      '¿Desea confirmar la causación sin instrucciones de pago?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
  })

  const initialDateFilter = ref('')

  const onChangeInitialDate = (val: string) => {
    initialDateFilter.value = val
  }

  const selectedBusinessId = ref<number | null>(null)

  const onChangeBusinessId = (val: number) => {
    selectedBusinessId.value = val
    if (!val) return
    _getResources(
      { fics: ['funds'], treasury: ['banks'] },
      `filter[business_trust_id]=${val}`
    )
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: payment_request_businesses,
      rules: [(val: string) => is_required(val, 'El negocio es requerido')],
      onChange: onChangeBusinessId,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'start_date',
      label: 'Fecha inicial*',
      type: 'q-date',
      value: null,
      rules: [
        (val: string) => is_required(val, 'La fecha inicial es requerida'),
      ],
      onChange: onChangeInitialDate,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'end_date',
      label: 'Fecha final*',
      type: 'q-date',
      value: null,
      rules: [
        (val: string) => is_required(val, 'La fecha final es requerida'),
        (val: string) =>
          date_after_or_equal_to_specific_date(
            val,
            initialDateFilter.value,
            'fecha inicial'
          ),
      ],
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      prepend_icon: 'Search',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por número de solicitud',
    },
  ])

  const tableProps = ref<
    IBaseTableProps<ICausationWithoutPaymentInstructionsListItem>
  >({
    title: 'Listado de causación sin instrucciones de pago',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        sortable: true,
        align: 'left',
      },
      {
        name: 'request_number',
        label: 'Número de solicitud',
        field: 'request_number',
        sortable: true,
        align: 'left',
      },
      {
        name: 'internal_code',
        label: 'Consecutivo interno',
        field: 'internal_code',
        sortable: true,
        align: 'left',
      },
      {
        name: 'client_code',
        label: 'Consecutivo cliente',
        field: 'client_code',
        sortable: true,
        align: 'left',
      },
      {
        name: 'date',
        label: 'Fecha',
        field: 'date',
        sortable: true,
        align: 'left',
      },
      {
        name: 'supplier_id',
        label: 'Tercero',
        field: 'supplier_id',
        sortable: true,
        align: 'left',
      },
      {
        name: 'base_value',
        label: 'Valor base',
        field: (row) => formatCurrency(row.base_value) ?? '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'discounts',
        label: 'Descuento',
        field: (row) => formatCurrency(row.discounts) ?? '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'net_value',
        label: 'Valor neto',
        field: (row) => formatCurrency(row.net_value) ?? '',
        sortable: true,
        align: 'left',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const result = await _getCausationWithoutPaymentInstructionsList(filters)
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
    'filter[business_id]': number
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    clearData()
    await listAction(filtersFormat.value)

    showState.value = true
    isCausationWithoutPaymentInstructionsListEmpty.value =
      tableProps.value.rows.length === 0
  }

  const handleClearFilters = () => {
    clearData()
    isCausationWithoutPaymentInstructionsListEmpty.value = true
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

  const openAlertModal = () => {
    alertModalRef.value?.openModal()
  }

  const clearData = () => {
    tableProps.value.rows = []
    tableProps.value.pages = {
      currentPage: 0,
      lastPage: 0,
    }
  }

  const confirmBtnDisabled = computed(() => selected.value.length === 0)

  const handleConfirm = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid || !basic_data_form.value || !selected.value.length) return
    if (basic_data_form.value.tax_provision === null) {
      showAlert('Seleccione la provisión de impuestos', 'error')
      return
    }
    if (
      basic_data_form.value.tax_provision === true &&
      !basic_data_form.value.resource_source
    ) {
      showAlert('Seleccione la fuente de recursos ', 'error')
      return
    }

    const payload: ICausationWithoutPaymentInstructionsPayload = {
      payment_request_ids: selected.value.map((item) => item.id),
      ...basic_data_form.value,
    }
    alertModalRef.value?.closeModal()
    await _confirmCausationWithoutPaymentInstruction(payload)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    listAction(filtersFormat.value)
  }

  const handleClose = () => {
    basic_data_form.value = {
      tax_provision: null,
      resource_source: null,
      fund_or_bank_id: null,
      plan_or_account_id: null,
    }
  }

  const downloadExcel = async () => {
    openMainLoader(true)
    await _downloadExcelCausationWithoutPaymentInstructions(filtersFormat.value)
    openMainLoader(false)
  }

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all([
      _getResources(
        {
          accounts_payable: ['payment_request_businesses'],
        },
        'filter[status_id]=67,57,59'
      ),
      _getResources({ accounts_payable: ['causation_resource_source'] }),
    ])

    openMainLoader(false)
  })

  onBeforeUnmount(() =>
    _resetKeys({
      accounts_payable: [
        'payment_request_businesses',
        'causation_resource_source',
      ],
      fics: ['funds'],
      treasury: ['banks'],
    })
  )

  return {
    headerProps,
    filterConfig,
    tableProps,
    showState,
    isCausationWithoutPaymentInstructionsListEmpty,
    selected,
    alertModalRef,
    alertModalConfig,
    basicDataFormRef,
    basic_data_form,
    confirmBtnDisabled,
    selectedBusinessId,
    handleFilter,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,
    openAlertModal,
    handleConfirm,
    handleClose,
    downloadExcel,
  }
}

export default useCausationWithoutPaymentInstructionsList
