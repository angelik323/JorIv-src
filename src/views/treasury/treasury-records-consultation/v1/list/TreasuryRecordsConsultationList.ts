// Utils & vue
import { onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
// Stores
import {
  useResourceManagerStore,
  useTreasuryRecordsConsultationStore,
  useTreasuryResourceStore,
} from '@/stores'
// Components & Composables
import {
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'
import {
  defaultIcons,
  defaultIconsLucide,
  formatParamsCustom,
  hollyDays,
  numberToMoneyFormat,
} from '@/utils'
// Interfaces
import {
  IBankAccountResource,
  IBankAndAccountsResource,
  IFieldFilters,
  ISelectorResources,
  ITreasuryRecordsConsultationList,
} from '@/interfaces/customs'

const useTreasuryRecordsConsultationList = () => {
  const {
    treasury_records_consultation_pages,
    treasury_records_consultation_list,
  } = storeToRefs(useTreasuryRecordsConsultationStore('v1'))
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const {
    _getTreasuryRecordsConsultationList,
    _exportTreasuryRecordsConsultationListXLS,
  } = useTreasuryRecordsConsultationStore('v1')

  const { formatCurrencyString } = useUtils()

  const {
    business_trusts_egreso,
    business_bank_accounts_check,
    banks,
    bank_accounts_balances,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    treasury: ['business_trusts_egreso', 'banks'],
  }

  const selectorFromBank = ref<IBankAndAccountsResource[] | null>(null)
  const selectorToBank = ref<IBankAndAccountsResource[] | null>(null)
  const selectorFromAccount = ref<IBankAccountResource[] | null>(null)
  const selectorToAccount = ref<IBankAccountResource[] | null>(null)

  const headerProps = {
    title: 'Consulta de registros de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Consulta de registros de tesorería',
        route: '',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de registros de tesorería',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'date',
        required: false,
        label: 'Fecha',
        align: 'left',
        field: 'date',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'name_office',
        required: true,
        label: 'Oficina',
        align: 'left',
        field: (row) =>
          row.office_id && row.name_office
            ? `${row.office_id} - ${row.name_office}`
            : '-',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'business_trust',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row) =>
          row.business_trust
            ? `${row.business_trust.business_code} - ${row.business_trust.name}`
            : '-',
        sortable: true,
      },
      {
        name: 'id',
        required: true,
        label: 'Registro',
        align: 'left',
        field: 'id',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'record_status_id',
        required: true,
        label: 'Estado registro',
        align: 'left',
        field: 'status',
        sortable: true,
        format: (_, item) => item.status?.id || '-',
      },
      {
        name: 'upload',
        required: true,
        label: 'Cargue',
        align: 'left',
        field: 'upload',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'status',
        required: true,
        label: 'Estado de movimiento',
        align: 'left',
        sortable: true,
        format: (_, item) => item.authorization?.status.id || '-',
      },
      {
        name: 'movement',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: 'movement',
        sortable: true,
        format: (_, item) =>
          `${item.movement.code} - ${item.movement.description}` || '-',
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo de operación',
        align: 'left',
        field: 'type',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'concept',
        required: true,
        label: 'Concepto',
        align: 'left',
        field: 'concept',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'method_payment',
        required: true,
        label: 'Forma pago/recaudo',
        align: 'left',
        field: 'method_payment',
        sortable: true,
        format: (_, item) =>
          item.method_payment?.code && item.method_payment?.description
            ? `${item.method_payment?.code} - ${item.method_payment?.description}`
            : '-',
      },
      {
        name: 'value',
        required: true,
        label: 'Valor',
        align: 'right',
        field: 'value',
        format: (_, row) => formatCurrencyString(Number(row.value)) || '-',
        sortable: true,
      },
      {
        name: 'bank',
        required: true,
        label: 'Banco',
        align: 'left',
        field: 'bank',
        sortable: true,
        format: (_, item) =>
          item.bank ? `${item.bank.code} - ${item.bank.description}` : '-',
      },
      {
        name: 'account_type',
        required: true,
        label: 'Tipo de cuenta',
        align: 'left',
        field: 'account_type',
        sortable: true,
        format: (_, item) => item.bank_account?.account_type || '-',
      },
      {
        name: 'account_number',
        required: true,
        label: 'Cuenta bancaria',
        align: 'left',
        field: 'account_number',
        sortable: true,
        format: (_, item) =>
          item.bank_account.account_number && item.bank_account.account_type
            ? `${item.bank_account.account_number} - ${item.bank_account.account_type}`
            : '-',
      },
      {
        name: 'investment_plan',
        required: true,
        label: 'Plan de inversión',
        align: 'left',
        field: 'investment_plan',
        sortable: true,
        format: (_, item) => item.investment_plan?.code || '-',
      },
      {
        name: 'business_trust',
        required: true,
        label: 'Negocio origen',
        align: 'left',
        field: 'business_trust',
        sortable: true,
        format: (_, item) =>
          item.business_trust?.business_code && item.business_trust?.name
            ? `${item.business_trust?.business_code} - ${item.business_trust?.name}`
            : '-',
      },
      {
        name: 'third_party',
        required: true,
        label: 'Tercero',
        align: 'left',
        field: 'third_party',
        sortable: true,
        format: (_, item) =>
          item.third_party?.document && item.third_party?.name
            ? `${item.third_party?.document} - ${item.third_party?.name}`
            : '-',
      },
      {
        name: 'beneficiary_bank',
        required: true,
        label: 'Banco beneficiario',
        align: 'left',
        field: 'beneficiary_bank',
        sortable: true,
        format: (_, item) =>
          item.beneficiary_bank?.code && item.beneficiary_bank?.code
            ? `${item.beneficiary_bank?.code} - ${item.beneficiary_bank?.description}`
            : '-',
      },
      {
        name: 'beneficiary_bank_account',
        required: true,
        label: 'Cuenta bancaria beneficiaria',
        align: 'left',
        field: 'beneficiary_bank_account',
        sortable: true,
        format: (_, item) => {
          if (item.type === 'Egreso') {
            return item.third_party_bank?.account_number &&
              item.third_party_bank?.account_name
              ? `${item.third_party_bank.account_number} - ${item.third_party_bank.account_name}`
              : '-'
          } else if (item.type === 'Ingreso') {
            return item.bank_account?.account_number &&
              item.bank_account?.account_type
              ? `${item.bank_account.account_number} - ${item.bank_account.account_type}`
              : '-'
          } else {
            return item.origin_detail?.bank_account?.account_number &&
              item.origin_detail?.bank_account?.account_type
              ? `${item.origin_detail?.bank_account?.account_number} - ${item.origin_detail?.bank_account?.account_type}`
              : '-'
          }
        },
      },
      {
        name: 'checkbook',
        required: true,
        label: 'Cheque recaudo',
        align: 'left',
        field: 'checkbook',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'checkbook_bank',
        required: true,
        label: 'Banco del cheque',
        align: 'left',
        field: 'checkbook_bank',
        sortable: true,
        format: (_, item) =>
          item.checkbook_bank?.code && item.checkbook_bank?.description
            ? `${item.checkbook_bank?.code} - ${item.checkbook_bank?.description}`
            : '-',
      },
      {
        name: 'bank_branch',
        required: true,
        label: 'Sucursal',
        align: 'left',
        field: 'bank_branch',
        sortable: true,
        format: (_, item) =>
          item.bank_branch?.code && item.bank_branch?.name
            ? `${item.bank_branch?.code} - ${item.bank_branch?.name}`
            : '-',
      },
      {
        name: 'authorization_by',
        required: true,
        label: 'Autorizado pago',
        align: 'left',
        field: 'authorization_by',
        sortable: true,
        format: (_, item) =>
          item.authorized_identification
            ? `${item.authorized_identification.document} - ${item.authorized_identification.name}`
            : '-',
      },
      {
        name: 'instructions',
        required: true,
        label: 'Instrucciones',
        align: 'left',
        field: 'instructions',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'check',
        required: true,
        label: 'Cheque generado',
        align: 'left',
        field: 'check',
        sortable: true,
        format: (_, item) => item.treasury_movement?.check_number || '-',
      },
      {
        name: 'foreign_currency_value',
        required: true,
        label: 'Valor moneda extranjera',
        align: 'right',
        field: 'foreign_currency_value',
        sortable: true,
        format: (_, item) =>
          numberToMoneyFormat(Number(item.details?.foreign_currency_value)) ||
          '-',
      },
      {
        name: 'trm',
        required: true,
        label: 'TRM',
        align: 'right',
        field: 'trm',
        sortable: true,
        format: (_, item) =>
          numberToMoneyFormat(Number(item.details?.trm)) || '-',
      },
      {
        name: 'date',
        required: true,
        label: 'Fecha efectiva',
        align: 'left',
        field: 'date',
        sortable: true,
        format: (_, item) => item.details?.effective_date || '-',
      },
      {
        name: 'cost_center',
        required: true,
        label: 'Centro de costo',
        align: 'left',
        field: 'cost_center',
        sortable: true,
        format: (_, item) =>
          item.cost_center?.code && item.cost_center?.name
            ? `${item.cost_center?.code} - ${item.cost_center?.name}`
            : '-',
      },
      {
        name: 'cash_flow',
        required: true,
        label: 'Flujo de caja',
        align: 'left',
        field: 'cash_flow',
        sortable: true,
        format: (_, item) => item.cash_flow?.code || '-',
      },
      {
        name: 'created_by',
        required: true,
        label: 'Usuario creación',
        align: 'left',
        field: 'created_by',
        sortable: true,
        format: (_, item) => item.created_by.name || '-',
      },
      {
        name: 'created_at',
        required: true,
        label: 'Fecha creación',
        align: 'left',
        field: 'created_at',
        sortable: true,
        format: (_, item) => item.details?.created_at || '-',
      },
      {
        name: 'authorized_by',
        required: true,
        label: 'Usuario autoriza',
        align: 'left',
        field: 'authorized_by',
        sortable: true,
        format: (_, item) =>
          item.authorization_by?.name && item.authorization_by?.last_name
            ? `${item.authorization_by?.name} ${item.authorization_by?.last_name}`
            : '-',
      },
      {
        name: 'authorization_date',
        required: true,
        label: 'Fecha autorización',
        align: 'left',
        field: 'authorization_date',
        sortable: true,
        format: (_, item) => item.authorization?.authorization_date || '-',
      },
      {
        name: 'receipt_type_code',
        required: true,
        label: 'Tipo comprobante',
        align: 'left',
        field: 'receipt_type_code',
        sortable: true,
        format: (_, item) =>
          item.movement?.receipt_types?.code &&
          item.movement?.receipt_types?.name
            ? `${item.movement.receipt_types.code} - ${item.movement.receipt_types.name}`
            : '-',
      },
      {
        name: 'accounting_consecutive',
        required: true,
        label: 'Número de comprobante tesorería',
        align: 'left',
        field: (row) =>
          row?.authorization?.voucher?.id && row?.authorization?.voucher?.code
            ? `${row.authorization.voucher.id} - ${row.authorization.voucher.code}`
            : '-',
        sortable: true,
      },
      {
        name: 'rejection_reason',
        required: true,
        label: 'Motivos de rechazo',
        align: 'left',
        field: (row) => row?.details?.rejection_reason || '-',
        sortable: true,
        format: (_, item) => item.details?.rejection_reason || '-',
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as ITreasuryRecordsConsultationList[],
    pages: treasury_records_consultation_pages,
  })
  const hideFilters = ref<boolean>(true)

  const fromBankAccounts = ref()
  const upBankAccounts = ref()

  const filtersFormat = ref<Record<string, string | number>>({})
  const filtersRef = ref()

  const optionsMaxCalendar = (date: string | null) => {
    if (!date) return false

    const today = new Date()
    const current = new Date(date)

    const isPastOrToday = current <= today

    const day = current.getDay()
    const isWeekday = day !== 0 && day !== 6

    const colombiaHolidays2025 = hollyDays

    const dateISO = current.toISOString().split('T')[0]
    const isHoliday = colombiaHolidays2025.includes(dateISO)

    return isPastOrToday && isWeekday && !isHoliday
  }

  const getBankAndBankAccountsByBusiness = async (businessId: number) => {
    if (!businessId) return

    await _getResources({
      treasury: [`banks_record_expenses&business_trust_id=${businessId}`],
    })
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'from_business',
      label: 'Desde negocio*',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: business_trusts_egreso,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
    },
    {
      name: 'from_name_business',
      label: 'Nombre negocio',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'up_business',
      label: 'Hasta negocio*',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: business_trusts_egreso,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
      onChange: getBankAndBankAccountsByBusiness,
    },
    {
      name: 'up_name_business',
      label: 'Nombre del negocio',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'from_bank',
      label: 'Desde banco',
      type: 'q-select',
      hide: true,
      value: null,
      autocomplete: true,
      options: selectorFromBank,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'from_name_bank',
      label: 'Nombre del banco',
      type: 'q-input',
      hide: true,
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'up_bank',
      label: 'Hasta banco',
      type: 'q-select',
      hide: true,
      value: null,
      autocomplete: true,
      options: selectorToBank,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'up_name_bank',
      label: 'Nombre del banco',
      hide: true,
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'from_account',
      label: 'Desde cuenta',
      type: 'q-select',
      hide: true,
      value: null,
      autocomplete: true,
      options: selectorFromAccount,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'from_name_account',
      label: 'Nombre de la cuenta',
      type: 'q-input',
      hide: true,
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'up_account',
      label: 'Hasta cuenta',
      hide: true,
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: selectorToAccount,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      prepend_icon: defaultIconsLucide.magnify,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'up_name_account',
      label: 'Nombre de la cuenta',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      hide: true,
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'from_date',
      label: 'Desde periodo*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      hide: true,
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().valid_format_date(v, 'YYYY-MM-DD'),
        (v: string) => useRules().date_before_or_equal_to_the_current_date(v),
      ],
      option_calendar: optionsMaxCalendar,
    },
    {
      name: 'up_date',
      label: 'Hasta periodo*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      hide: true,
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
        (v: string) => useRules().valid_format_date(v, 'YYYY-MM-DD'),
        (v: string) => useRules().date_before_or_equal_to_the_current_date(v),
      ],
      option_calendar: optionsMaxCalendar,
    },
  ])

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getTreasuryRecordsConsultationList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = ($filters: {
    'filter[from_business]': string
    'filter[from_name_business]'?: string
    'filter[up_business]': string
    'filter[up_name_business]'?: string
    'filter[from_bank]': string
    'filter[from_name_bank]'?: string
    'filter[up_bank]': string
    'filter[up_name_bank]'?: string
    'filter[from_account]': string
    'filter[from_name_account]'?: string
    'filter[up_account]': string
    'filter[up_name_account]'?: string
    'filter[from_date]': string
    'filter[up_date]': string
  }) => {
    delete $filters['filter[from_name_business]']
    delete $filters['filter[up_name_business]']
    delete $filters['filter[from_name_bank]']
    delete $filters['filter[up_name_bank]']
    delete $filters['filter[from_name_account]']
    delete $filters['filter[up_name_account]']

    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    tableProps.value.rows = []
    filterConfig.value[0].value = null
    filterConfig.value[1].value = null
    filterConfig.value[2].value = null
    filterConfig.value[3].value = null
    resetAccountStructures()
  }

  const fromBusiness = ref<number>(0)
  const toBusiness = ref<number>(0)
  const fromBank = ref<number>(0)
  const toBank = ref<number>(0)

  const onFilterChange = ($fields: Record<string, string | number>) => {
    updateBusinessNames('filter[from_business]', 'from_name_business', $fields)
    updateBusinessNames('filter[up_business]', 'up_name_business', $fields)

    if (
      $fields['filter[from_bank]'] !== filtersFormat.value['filter[from_bank]']
    ) {
      updateBank('from', Number($fields['filter[from_bank]']))
    }
    if ($fields['filter[up_bank]'] !== filtersFormat.value['filter[up_bank]']) {
      updateBank('up', Number($fields['filter[up_bank]']))
    }
    if (
      $fields['filter[from_account]'] !==
      filtersFormat.value['filter[from_account]']
    ) {
      updateAccount('from', Number($fields['filter[from_account]']))
    }
    if (
      $fields['filter[up_account]'] !==
      filtersFormat.value['filter[up_account]']
    ) {
      updateAccount('up', Number($fields['filter[up_account]']))
    }

    if ($fields['filter[from_business]']) {
      fromBusiness.value = $fields['filter[from_business]'] as number
    }
    if ($fields['filter[up_business]']) {
      toBusiness.value = $fields['filter[up_business]'] as number
    }
    if ($fields['filter[from_bank]']) {
      fromBank.value = $fields['filter[from_bank]'] as number
    }
    if ($fields['filter[up_bank]']) {
      toBank.value = $fields['filter[up_bank]'] as number
    }

    filtersFormat.value = {
      ...$fields,
    }
  }

  // Helper function to reset filter values
  const resetFilterValue = (filterName: string) => {
    const filter = filterConfig.value.find((item) => item.name === filterName)
    if (filter) filter.value = null
  }

  // Helper function to update selector based on business_bank_accounts_check
  const updateSelector = (businessId: number) => {
    return (
      business_bank_accounts_check.value.find(
        (item) => item.value === businessId
      )?.payload.account ?? null
    )
  }

  // Generic watcher for business changes
  const createBusinessWatcher = (
    source: Ref<number>,
    bankFilterName: string,
    accountFilterName: string,
    bankSetter: (value: IBankAndAccountsResource[]) => void,
    accountSetter: (value: IBankAccountResource[] | null) => void
  ) => {
    return watch(source, async (newBusinessId) => {
      // Reset dependent filters
      resetFilterValue(bankFilterName)
      resetFilterValue(accountFilterName)

      // Fetch resources
      await _getResources(
        {
          treasury: ['business_bank_accounts'],
        },
        `business_id=${newBusinessId}`,
        'v2'
      )

      // Update selectors
      bankSetter(business_bank_accounts_check.value)
      accountSetter(updateSelector(newBusinessId))
    })
  }

  // Generic watcher for bank changes
  const createBankWatcher = (
    source: Ref<number>,
    accountFilterName: string,
    accountSetter: (value: IBankAccountResource[] | null) => void
  ) => {
    return watch(source, (newBankId) => {
      resetFilterValue(accountFilterName)
      accountSetter(updateSelector(newBankId))
    })
  }

  // Apply the watchers
  createBusinessWatcher(
    fromBusiness,
    'from_bank',
    'from_account',
    (value) => {
      selectorFromBank.value = value
    },
    (value) => {
      selectorFromAccount.value = value
    }
  )

  createBusinessWatcher(
    toBusiness,
    'to_bank',
    'up_account',
    (value) => {
      selectorToBank.value = value
    },
    (value) => {
      selectorToAccount.value = value
    }
  )

  createBankWatcher(fromBank, 'from_account', (value) => {
    selectorFromAccount.value = value
  })

  createBankWatcher(toBank, 'up_account', (value) => {
    selectorToAccount.value = value
  })

  /// ---- OLD CODE - TO REFACTOR ---- ///

  const updateBank = async (filterName: 'from' | 'up', bank_id: number) => {
    filtersRef.value.setFieldValueByName(`${filterName}_name_bank`, null)
    filtersRef.value.setFieldValueByName(`${filterName}_account`, null)
    filtersRef.value.setFieldValueByName(`${filterName}_name_account`, null)

    const selectedBank = banks.value.find((item) => item.value === bank_id)
    const fetchAccountsMap = {
      up: fetchUpBankAccounts,
      from: fetchFromBankAccounts,
    }

    accountsMap[filterName].value = []

    if (selectedBank) {
      filtersRef.value.setFieldValueByName(
        `${filterName}_name_bank`,
        selectedBank.description
      )

      await fetchAccountsMap[filterName](Number(selectedBank.value))
    }
  }

  const accountsMap = {
    up: upBankAccounts,
    from: fromBankAccounts,
  }

  const updateAccount = (filterName: 'from' | 'up', account_id: number) => {
    filtersRef.value.setFieldValueByName(`${filterName}_name_account`, null)

    const selectedAccount = accountsMap[filterName].value.find(
      (item: ISelectorResources) => item.value === account_id
    )

    if (selectedAccount) {
      filtersRef.value.setFieldValueByName(
        `${filterName}_name_account`,
        selectedAccount.account_name
      )
    }
  }

  const fetchFromBankAccounts = async (bank_id: number) => {
    const key = {
      treasury: ['bank_account'],
    }
    _getResources(key, `filter[bank_id]=${bank_id} `).then(() => {
      fromBankAccounts.value = bank_accounts_balances.value.map((item) => ({
        ...item,
      }))
    })
  }

  const fetchUpBankAccounts = async (bank_id: number) => {
    const key = {
      treasury: ['bank_account'],
    }
    _getResources(key, `filter[bank_id]=${bank_id} `).then(() => {
      upBankAccounts.value = bank_accounts_balances.value.map((item) => ({
        ...item,
      }))
    })
  }

  const resetAccountStructures = () => {
    accountsMap.up.value = []
    accountsMap.from.value = []
  }

  const updateBusinessNames = (
    filterKey: string,
    fieldName: string,
    filters: Record<string, string | number | null>
  ) => {
    const selectedBusiness = business_trusts_egreso.value.find(
      (item) => item.value === filters[filterKey]
    )
    filtersRef.value?.setFieldValueByName(
      fieldName,
      selectedBusiness ? selectedBusiness.name : null
    )
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const downloadExcel = async () => {
    openMainLoader(true)
    const values = Object.fromEntries(
      Object.entries(filtersFormat.value).filter(
        ([, value]) => value !== null && value !== undefined
      )
    )
    const query = formatParamsCustom(values)
    await _exportTreasuryRecordsConsultationListXLS(query)

    openMainLoader(false)
  }

  const alertModalRef = ref()
  const alertModalConfig = ref({
    id: null as number | null,
  })

  const handleOptions = async (option: string, id: number) => {
    if (option === 'view') {
      alertModalConfig.value.id = id
      await alertModalRef.value.openModal()
    }
  }

  const findRowByRegisterId = () => {
    return treasury_records_consultation_list.value.find(
      (item) => item.id === alertModalConfig.value.id
    )
  }

  watch(
    treasury_records_consultation_list,
    () => {
      tableProps.value.rows = [...treasury_records_consultation_list.value]

      const { currentPage, lastPage } =
        treasury_records_consultation_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  onMounted(async () => {
    resetAccountStructures()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    filterConfig.value[4].hide = hideFilters.value
    filterConfig.value[5].hide = hideFilters.value
    filterConfig.value[6].hide = hideFilters.value
    filterConfig.value[7].hide = hideFilters.value
    filterConfig.value[8].hide = hideFilters.value
    filterConfig.value[9].hide = hideFilters.value
    filterConfig.value[10].hide = hideFilters.value
    filterConfig.value[11].hide = hideFilters.value
    filterConfig.value[12].hide = hideFilters.value
    filterConfig.value[13].hide = hideFilters.value
  }

  return {
    headerProps,
    filterConfig,
    tableProps,
    alertModalRef,
    filtersRef,

    findRowByRegisterId,
    handleFilter,
    onFilterChange,
    handleClear,
    downloadExcel,
    updatePage,
    updatePerPage,
    handleShowMoreFilters,
    handleOptions,
    validateRouter,
  }
}
export default useTreasuryRecordsConsultationList
