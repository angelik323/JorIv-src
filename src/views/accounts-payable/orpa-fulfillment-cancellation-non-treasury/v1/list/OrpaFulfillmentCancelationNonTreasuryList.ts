// Vue - Pinia
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import {
  IOrpaCancelDataForm,
  IOrpaCancelPayload,
  IOrpaFulfillDataForm,
  IOrpaFulfillmentCancelationNonTreasuryListItem,
  IOrpaFulfillPayload,
} from '@/interfaces/customs/accounts-payable/OrpaFulfillmentCancelationNonTreasury'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { StatusID } from '@/interfaces/global/Status'

// Composables
import { useRules } from '@/composables/useRules'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// Stores
import { useOrpaFulfillmentCancelationNonTreasuryStore } from '@/stores/accounts-payable/orpa-fulfillment-cancellation-non-treasury'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useOrpaFulfillmentCancelationNonTreasuryList = () => {
  const { openMainLoader } = useMainLoader()

  const {
    _getOrpaFulfillmentCancelationNonTreasuryList,
    _fulFillOrpaFulfillmentCancelationNonTreasury,
    _cancelOrpaFulfillmentCancelationNonTreasury,
  } = useOrpaFulfillmentCancelationNonTreasuryStore('v1')

  const { payment_request_businesses_value_code, orpa_compliance_statuses } =
    storeToRefs(useAccountsPayableResourceStore('v1'))

  const { is_required, date_after_or_equal_to_specific_date } = useRules()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { formatCurrency } = useUtils()

  const showState = ref(false)
  const isOrpaFulfillmentCancelationNonTreasuryListEmpty = ref(true)

  const selected = ref<IOrpaFulfillmentCancelationNonTreasuryListItem[]>([])

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const headerProps = {
    title: 'Cumplir ORPA sin tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Cumplir o Anular ORPA sin tesorería',
        route: 'OrpaFulfillmentCancelationNonTreasuryList',
      },
    ],
  }

  const fulfillDataFormRef = ref()

  const cancelDataFormRef = ref()

  const alertModalFulfillRef = ref()

  const fulfill_data_form = ref<IOrpaFulfillDataForm | null>(null)

  const alertModalFulfillConfig = ref({
    title: '¿Desea cumplir el cumplimiento sin tesorería?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    action: '' as 'fulfill' | 'cancel',
  })

  const alertModalCancelRef = ref()

  const cancel_data_form = ref<IOrpaCancelDataForm | null>(null)

  const alertModalCancelConfig = ref({
    title: '¿Desea anular el cumplimiento sin tesorería?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    action: '' as 'fulfill' | 'cancel',
  })

  const initialDateFilter = ref('')

  const onChangeInitialDate = (val: string) => {
    initialDateFilter.value = val
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_code',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: payment_request_businesses_value_code,
      rules: [(val: string) => is_required(val, 'El negocio es requerido')],
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status',
      label: 'Estado*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: orpa_compliance_statuses,
      rules: [(val: string) => is_required(val, 'El estado es requerido')],
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
  ])

  const tableProps = ref<
    IBaseTableProps<IOrpaFulfillmentCancelationNonTreasuryListItem>
  >({
    title: 'Listado de anulación o cumplimiento ORPA sin tesorería',
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
        name: 'orpa_number',
        label: 'Número de ORPA',
        field: 'orpa_number',
        sortable: true,
        align: 'left',
      },
      {
        name: 'created_at',
        label: 'Fecha registro',
        field: 'created_at',
        sortable: true,
        align: 'left',
      },
      {
        name: 'proveedor',
        label: 'Emisor / Proveedor',
        field: 'proveedor',
        sortable: true,
        align: 'left',
      },
      {
        name: 'beneficiario',
        label: 'Beneficiario',
        field: 'beneficiario',
        sortable: true,
        align: 'left',
      },
      {
        name: 'total_amount',
        label: 'Valor ORPA',
        field: (row) => formatCurrency(row.total_amount) ?? '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'observations',
        label: 'Observaciones cumplimiento',
        field: 'observations',
        sortable: true,
        align: 'left',
      },
      {
        name: 'legalization_account',
        label: 'Cuenta contable legalización',
        field: 'legalization_account',
        sortable: true,
        align: 'left',
      },
      {
        name: 'status',
        label: 'Estado',
        field: 'status',
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

    const result = await _getOrpaFulfillmentCancelationNonTreasuryList(filters)
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
    'filter[business_code]': number
    'filter[status]': string
    'filter[start_date]': string
    'filter[end_date]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    clearData()
    await listAction(filtersFormat.value)

    showState.value = true
    isOrpaFulfillmentCancelationNonTreasuryListEmpty.value =
      tableProps.value.rows.length === 0
  }

  const handleClearFilters = async () => {
    clearData()
    isOrpaFulfillmentCancelationNonTreasuryListEmpty.value = true
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

  const openAlertModal = (action: 'fulfill' | 'cancel') => {
    if (action === 'fulfill') {
      alertModalFulfillRef.value?.openModal()
    } else {
      alertModalCancelRef.value?.openModal()
    }
  }

  const clearData = () => {
    tableProps.value.rows = []
    tableProps.value.pages = {
      currentPage: 0,
      lastPage: 0,
    }
  }

  const cancelBtnDisabled = computed(
    () =>
      selected.value.length === 0 ||
      !selected.value.some(
        (selected_register) => selected_register.status === 115
      )
  )

  const fulfillBtnDisabled = computed(() => selected.value.length === 0)

  const handleConfirmFulfillForm = async () => {
    const isValid = await fulfillDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!fulfill_data_form.value) return
    const payload: IOrpaFulfillPayload = {
      ...fulfill_data_form.value,
      orpa_ids: selected.value.map((row) => row.id),
    }
    alertModalFulfillRef.value?.openModal()
    await _fulFillOrpaFulfillmentCancelationNonTreasury(payload)
    listAction(filtersFormat.value)
  }

  const handleConfirmCancelForm = async () => {
    const isValid = await cancelDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!cancel_data_form.value) return
    const payload: IOrpaCancelPayload = {
      ...cancel_data_form.value,
      orpa_ids: selected.value.map((row) => row.id),
    }
    alertModalCancelRef.value?.closeModal()
    await _cancelOrpaFulfillmentCancelationNonTreasury(payload)
    listAction(filtersFormat.value)
  }

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all([
      _getResources(
        { accounts_payable: ['payment_request_businesses'] },
        'filter[status_id]=67,57,59'
      ),
      _getResources(
        {
          accounting: [
            'account_structures_accounting_accounts',
            'sub_receipt_types',
          ],
        },
        '',
        'v2'
      ),
      _getResources({
        accounting: ['receipt_types'],
        accounts_payable: [
          'cancellation_rejection_reasons',
          'orpa_compliance_statuses',
        ],
      }),
    ])
    openMainLoader(false)
  })

  onBeforeUnmount(() =>
    _resetKeys({
      accounts_payable: [
        'payment_request_businesses',
        'cancellation_rejection_reasons',
        'orpa_compliance_statuses',
      ],
      accounting: [
        'account_structures_accounting_accounts',
        'sub_receipt_types',
        'receipt_types',
      ],
    })
  )

  return {
    headerProps,
    filterConfig,
    tableProps,
    showState,
    isOrpaFulfillmentCancelationNonTreasuryListEmpty,
    selected,
    alertModalFulfillRef,
    fulfill_data_form,
    alertModalFulfillConfig,
    alertModalCancelRef,
    cancel_data_form,
    alertModalCancelConfig,
    fulfillDataFormRef,
    cancelDataFormRef,
    fulfillBtnDisabled,
    cancelBtnDisabled,
    handleFilter,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,
    isRowActive,
    openAlertModal,
    handleConfirmFulfillForm,
    handleConfirmCancelForm,
  }
}

export default useOrpaFulfillmentCancelationNonTreasuryList
