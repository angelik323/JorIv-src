// Vue - pinia - moment
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Utils
import { formatParamsCustom } from '@/utils'

// Composables
import { useAlert, useMainLoader, useRules, useUtils } from '@/composables'

// Interfaces
import { QTable } from 'quasar'
import {
  IFieldFilters,
  ISelectorResources,
  IBusinessBankAccountsAuthorization,
  FilterSourceItem,
} from '@/interfaces/customs'
import {
  IAuthorizationPayload,
  IAuthorizationTreasuryFilters,
  IAuthorizationTreasuryItemList,
} from '@/interfaces/customs/treasury/AuthorizationTreasury'

// Stores
import {
  useAuthorizationTreasuryStore,
  useFicResourceStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

// Constants
import { movement_types } from '@/constants/resources'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const useAuthorizationTreasuryList = () => {
  const { showAlert } = useAlert()
  const { no_special_characters_extended, max_length } = useRules()
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    _getAuthorizationTreasuryList,
    _getByIdAuthorizationTreasury,
    _setDataSelection,
    _authorizeRequest,
    _rejectRequest,
    _getErrorFileAuthorizationTreasury,
    _getBulkUploadsAuthorization,
    _clearData,
  } = useAuthorizationTreasuryStore('v1')

  const {
    authorization_treasury_list,
    authorization_treasury_response,
    authorization_treasury_pages,
    bulk_uploads_authorization_list,
    data_selection,
    rejection_reason,
    error,
  } = storeToRefs(useAuthorizationTreasuryStore('v1'))
  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const {
    banks_by_banks_accounts,
    business_trusts_egreso,
    business_bank_accounts_authorization,
    banking_network_uploads_with_details,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const conditionalColumnsExpense = [
    'payment_method',
    'beneficiary_bank',
    'beneficiary_account_type',
    'branch_office',
  ]

  const conditionalColumnsIncome = ['payment_method']

  const conditionalColumnsTransfer = [
    'transfer',
    'register_type',
    'fund',
    'investment_plan',
    'foreign_currency_value',
    'trm',
  ]

  const types = {
    income: 'income',
    expense: 'expense',
    transfer: 'transfer',
  }

  const allColumns = ref<QTable['columns']>([])
  const filtersFormat = ref<Record<string, string | number>>({})
  const hideFilters = ref<boolean>(true)
  const previousFilterValues = ref<Record<string, string | number | null>>({})
  const filtersRef = ref()
  const alertModalRef = ref()
  const selectedRows = ref([])
  const keys = {
    treasury: ['banks', 'business_trusts_egreso'],
    fics: ['offices'],
  }

  const keysWithParam = {
    treasury: ['bank_account'],
  }

  const load_key = {
    treasury: ['banking_network_uploads'],
  }

  const getOfficeID = ref<number | null>(null)
  const getBusinessIdFrom = ref<number | null>(null)
  const getBusinessIdTo = ref<number | null>(null)
  const getBankId = ref<number | null>(null)
  const getBankAccountId = ref<number | null>(null)

  const headerProps = {
    title: 'Autorizaciones de Tesorería',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Autorización tesorería',
        route: 'AuthorizationTreasuryList',
      },
    ],
  }

  const bank_accounts_by_bank = ref<
    typeof business_bank_accounts_authorization.value | []
  >([])

  const setKeyName = (key_name: string, key_value: string | null) => {
    const keyFilter = filterConfig.value.find((f) => f.name === key_name)
    if (keyFilter) keyFilter.value = key_value

    filtersRef.value?.setFieldValueByName(key_name, key_value)
  }

  const assignBankAccountByBank = async (bankID: number) => {
    getBankId.value = bankID
    if (!bankID) {
      setKeyName('bank_account_id', null)
      setKeyName('bank_account_name', null)
      return
    }

    bank_accounts_by_bank.value =
      business_bank_accounts_authorization.value.filter(
        (account: IBusinessBankAccountsAuthorization) =>
          account.bank_id === bankID
      ) ?? []
  }

  const setOfficeID = (officeID: number) => {
    getOfficeID.value = officeID
  }

  const setBusinessIDFrom = (businessID: number) => {
    getBusinessIdFrom.value = businessID
    if (!businessID) {
      banking_network_uploads_with_details.value = []
    }
  }

  const setBusinessIDTo = (businessID: number) => {
    getBusinessIdTo.value = businessID
    if (!businessID) {
      banking_network_uploads_with_details.value = []
    }
  }

  const setBankAccountID = (bankAccountID: number) => {
    getBankAccountId.value = bankAccountID
  }

  const getBanksByBusinessRange = async (
    business_from_id: number,
    business_to_id: number
  ) => {
    if (!business_from_id || !business_to_id) return

    const bank_keys = {
      treasury: ['business_bank_accounts_authorization'],
    }
    await _resetKeys(bank_keys)
    const banks_filter = `business_from_id=${business_from_id}&business_to_id=${business_to_id}`
    await _getResources(bank_keys, banks_filter, 'v2')
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'authorization_type',
      label: 'Tipo de movimiento',
      type: 'q-select',
      value: null,
      class: 'col-12',
      options: movement_types,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'office_id',
      label: 'Oficina*',
      type: 'q-select',
      value: null,
      class: '',
      options: offices,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
      onChange: setOfficeID,
    },
    {
      name: 'office_name',
      label: 'Nombre oficina',
      type: 'q-input',
      value: null,
      class: '',
      disable: true,
      autocomplete: true,
      clean_value: true,
      placeholder: '-',
      hide: true,
    },
    {
      name: 'business_from_id',
      label: 'Desde negocio*',
      type: 'q-select',
      value: null,
      class: '',
      options: business_trusts_egreso,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
      onChange: setBusinessIDFrom,
    },
    {
      name: 'business_from_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: null,
      class: '',
      disable: true,
      autocomplete: true,
      clean_value: true,
      placeholder: '-',
      hide: true,
    },
    {
      name: 'business_to_id',
      label: 'Hasta negocio*',
      type: 'q-select',
      value: null,
      class: '',
      options: business_trusts_egreso,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
      onChange: setBusinessIDTo,
    },
    {
      name: 'business_to_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: null,
      class: '',
      disable: true,
      autocomplete: true,
      clean_value: true,
      placeholder: '-',
      hide: true,
    },
    {
      name: 'load_id',
      label: 'Cargue',
      type: 'q-select',
      value: null,
      class: '',
      options: bulk_uploads_authorization_list,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'load_name',
      label: 'Nombre del cargue',
      type: 'q-input',
      value: null,
      class: '',
      disable: true,
      autocomplete: true,
      clean_value: true,
      placeholder: '-',
      hide: true,
    },
    {
      name: 'load_status',
      label: 'Estado del cargue',
      type: 'q-input',
      value: null,
      class: '',
      disable: true,
      autocomplete: true,
      clean_value: true,
      placeholder: '-',
      hide: true,
    },
    {
      name: 'load_date',
      label: 'Fecha cargue',
      type: 'q-input',
      value: null,
      class: '',
      disable: true,
      autocomplete: true,
      clean_value: true,
      placeholder: '-',
      hide: true,
    },
    {
      name: 'bank_id',
      label: 'Banco',
      type: 'q-select',
      value: null,
      class: '',
      options: banks_by_banks_accounts,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
      onChange: assignBankAccountByBank,
    },
    {
      name: 'bank_name',
      label: 'Nombre del banco',
      type: 'q-input',
      value: null,
      class: '',
      disable: true,
      autocomplete: true,
      clean_value: true,
      placeholder: '-',
      hide: true,
    },
    {
      name: 'bank_account_id',
      label: 'Cuenta bancaria',
      type: 'q-select',
      value: null,
      class: '',
      options: bank_accounts_by_bank,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
      onChange: setBankAccountID,
    },
    {
      name: 'bank_account_name',
      label: 'Nombre cuenta bancaria',
      type: 'q-input',
      value: null,
      class: '',
      disable: true,
      autocomplete: true,
      clean_value: true,
      placeholder: '-',
      hide: true,
    },
  ])

  const tableProps = ref({
    title: 'Listado de negocios fiduciarios',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'transfer',
        field: (item) => {
          if (item.type === types.transfer) return item.record.id
          return ''
        },
        required: false,
        label: 'Traslado',
        align: 'left',
        sortable: true,
      },
      {
        name: 'register_type',
        field: 'register_type',
        required: false,
        label: 'Tipo de registro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business',
        field: (item) => {
          if (item.type === types.income)
            return `${item.record.business?.code} - ${item.record.business?.name}`
          if (item.type === types.expense)
            return item.record.business_trust_name
          return ''
        },
        required: false,
        label: 'Negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'load',
        field: (item) => item.record.treasury_bulk_upload?.consecutive ?? ' - ',
        required: false,
        label: 'Cargue',
        align: 'left',
        sortable: true,
      },
      {
        name: 'office',
        field: (item) => {
          if (item.type === types.income)
            return item.record.office?.name
              ? `${item.record.office?.id} - ${item.record.office?.name}`
              : ''
          if (item.type === types.expense) return item.record.office_name || ''
          if (item.type === types.transfer) return item.office_name || ''
          return ''
        },
        required: false,
        label: 'Oficina',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        sortable: true,
      },
      {
        name: 'payment_method',
        field: (item) => {
          if (item.type === types.expense)
            return item.record.expense_items?.[0]?.payment_method?.type || ''
          if (item.type === types.income)
            return (
              item.record.income_details?.[0]?.type_receive?.description || ''
            )
          return ''
        },
        required: false,
        label: 'Forma de pago',
        align: 'left',
        sortable: true,
      },
      {
        name: 'bank',
        field: (item) => {
          if (item.type === types.expense)
            return item.record.expense_items?.[0]?.bank?.name || ''
          if (item.type === types.income)
            return item.record.income_details?.[0]?.bank?.name || ''
          return ''
        },
        required: false,
        label: 'Banco',
        align: 'left',
        sortable: true,
      },
      {
        name: 'bank_account',
        field: (item) => {
          if (item.type === types.expense)
            return item.record.expense_items?.[0]?.bank_account
              ?.account_number &&
              item.record.expense_items?.[0]?.bank_account?.account_name
              ? `${item.record.expense_items?.[0]?.bank_account?.account_number} - ${item.record.expense_items?.[0]?.bank_account?.account_name}`
              : ''
          if (item.type === types.income)
            return item.record.income_details?.[0]?.bank_account
              ?.account_number &&
              item.record.income_details?.[0]?.bank_account?.account_name
              ? `${item.record.income_details?.[0]?.bank_account?.account_number} - ${item.record.income_details?.[0]?.bank_account?.account_name}`
              : ''
          return ''
        },
        required: false,
        label: 'Cuenta bancaria',
        align: 'left',
        sortable: true,
      },
      {
        name: 'third_party',
        field: (item) => {
          if (item.type === types.expense)
            return item.record.expense_items?.[0]?.third_party?.document &&
              item.record.expense_items?.[0]?.third_party?.name
              ? ` ${item.record.expense_items?.[0]?.third_party?.document} - ${item.record.expense_items?.[0]?.third_party?.name}`
              : '-'
          if (item.type === types.income)
            return item.record.income_details?.[0]?.third_party?.name
              ? ` ${item.record.income_details?.[0]?.third_party?.document} - ${item.record.income_details?.[0]?.third_party?.name}`
              : '-'
          return ''
        },
        required: false,
        label: 'Tercero',
        align: 'left',
        sortable: true,
      },
      {
        name: 'fund',
        field: 'fund',
        required: false,
        label: 'Fondo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'investment_plan',
        field: 'investment_plan',
        required: false,
        label: 'Plan de inversión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'foreign_currency_value',
        field: 'foreign_currency_value',
        required: false,
        label: 'Valor moneda extranjera',
        align: 'left',
        sortable: true,
      },
      {
        name: 'trm',
        field: 'trm',
        required: false,
        label: 'TRM',
        align: 'left',
        sortable: true,
      },
      {
        name: 'date',
        field: 'date',
        required: false,
        label: 'Fecha',
        align: 'left',
        sortable: true,
      },
      {
        name: 'amount',
        field: (item) =>
          item.total_amount?.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
          }) || '',
        required: false,
        label: 'Valor',
        align: 'right',
        sortable: true,
      },
      {
        name: 'cash_flow',
        field: (item) => {
          if (item.type === types.expense)
            return item.record.expense_items?.[0]?.cash_flow?.name || '-'
          if (item.type === types.income)
            return item.record.income_details?.[0]?.cash_flow?.name || '-'
          return ''
        },
        required: false,
        label: 'Flujo de caja',
        align: 'left',
        sortable: true,
      },
      {
        name: 'cost_center',
        field: (item) => {
          if (item.type === types.expense)
            return item.record.expense_items?.[0]?.cost_center?.name || '-'
          if (item.type === types.income)
            return item.record.income_details?.[0]?.cost_center?.name || '-'
          return ''
        },
        required: false,
        label: 'Centro de costo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'beneficiary_bank',
        field: (item) => {
          if (item.type === types.expense)
            return item.record.expense_items?.[0]?.beneficiary_bank?.name || ''
          if (item.type === types.income)
            return item.record.income_details?.[0]?.beneficiary_bank?.name || ''
          return ''
        },
        required: false,
        label: 'Banco beneficiario',
        align: 'left',
        sortable: true,
      },
      {
        name: 'beneficiary_account_type',
        field: (item) => {
          if (item.type === types.expense)
            return (
              item.record.expense_items?.[0]?.beneficiary_account_type || ''
            )
          if (item.type === types.income)
            return (
              item.record.income_details?.[0]?.beneficiary_account_type || ''
            )
          return ''
        },
        required: false,
        label: 'Tipo de cuenta beneficiario',
        align: 'left',
        sortable: true,
      },
      {
        name: 'branch_office',
        field: (item) => {
          if (item.type === types.expense)
            return item.record.expense_items?.[0]?.bank_branch?.name || ''
          if (item.type === types.income)
            return item.record.income_details?.[0]?.bank_branch?.name || ''
          return ''
        },
        required: false,
        label: 'Oficina sucursal',
        align: 'left',
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
    rows: [] as IAuthorizationTreasuryItemList[],
    pages: authorization_treasury_pages.value,
  })

  const businessIdFrom = ref<number | null>(null)
  const businessIdTo = ref<number | null>(null)

  const handleFilter = async ($filters: IAuthorizationTreasuryFilters) => {
    const requiredFields = [
      'filter[authorization_type]',
      'filter[office_id]',
      'filter[business_from_id]',
      'filter[business_to_id]',
    ] as const

    const fieldLabels: Record<(typeof requiredFields)[number], string> = {
      'filter[authorization_type]': 'Tipo de movimiento',
      'filter[office_id]': 'Oficina',
      'filter[business_from_id]': 'Negocio origen',
      'filter[business_to_id]': 'Negocio destino',
    }

    const missingFields = requiredFields.filter((field) => {
      const value = $filters[field]
      return value === null || value === undefined || value === ''
    })

    if (missingFields.length > 0) {
      const message = `Debes completar los siguientes campos: ${missingFields
        .map((f) => fieldLabels[f])
        .join(', ')}`

      showAlert(message, 'error', undefined, TIMEOUT_ALERT)
      return
    }

    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleFieldChange = async (
    currentFilters: Record<string, string | number | null>
  ) => {
    const value = currentFilters['filter[authorization_type]']
    handleShowMoreFilters(value === undefined || value === null)

    const changedFields = [
      ...Object.keys(currentFilters).filter((key) => {
        const currentValue = currentFilters[key]
        const previousValue = previousFilterValues.value[key]
        return currentValue !== previousValue
      }),
      ...Object.keys(previousFilterValues.value).filter((key) => {
        // El campo fue borrado o puesto a null explícitamente
        return (
          !(key in currentFilters) ||
          (currentFilters[key] == null &&
            previousFilterValues.value[key] != null)
        )
      }),
    ]

    if (changedFields.length === 0) return

    const changedFieldKey = changedFields[0]
    const match = changedFieldKey.match(/^filter\[(.+)\]$/)
    const fieldName = match ? match[1] : changedFieldKey
    const newValue = currentFilters[changedFieldKey]

    if (fieldName === 'authorization_type') {
      filtersRef.value?.cleanFiltersByNames?.([
        'office_id',
        'office_name',
        'business_from_id',
        'business_from_name',
        'business_to_id',
        'business_to_name',
        'load_id',
        'load_name',
        'load_status',
        'load_date',
        'bank_id',
        'bank_name',
        'bank_account_id',
        'bank_account_name',
      ])
      updateTableColumns(newValue)
      _clearData()
    }

    if (fieldName === 'office_id') {
      const label = getLabelFromOptions(
        'office_id',
        newValue,
        'office_description'
      )
      setFilterLabel(currentFilters, 'office_name', label)
    }

    if (
      currentFilters['filter[business_from_id]'] &&
      currentFilters['filter[business_to_id]']
    ) {
      if (
        currentFilters['filter[business_from_id]'] !== businessIdFrom.value &&
        currentFilters['filter[business_to_id]'] !== businessIdTo.value
      ) {
        businessIdFrom.value = currentFilters['filter[business_from_id]'] as
          | number
          | null
        businessIdTo.value = currentFilters['filter[business_to_id]'] as
          | number
          | null
        getBanksByBusinessRange(
          currentFilters['filter[business_from_id]'] as number,
          currentFilters['filter[business_to_id]'] as number
        )
      }
    }

    if (fieldName === 'business_from_id') {
      const label = getLabelFromOptions('business_from_id', newValue)
      setFilterLabel(currentFilters, 'business_from_name', label)
    }

    if (fieldName === 'business_to_id') {
      const label = getLabelFromOptions('business_to_id', newValue)
      setFilterLabel(currentFilters, 'business_to_name', label)
    }

    if (fieldName === 'load_id') {
      const loadOption = banking_network_uploads_with_details.value.find(
        (load: FilterSourceItem) => load.value === newValue
      )

      if (loadOption) {
        const labelLoadName = loadOption?.file_name ?? '-'
        const labelLoadStatus = loadOption?.status?.status ?? '-'
        const labelLoadDate = useUtils().formatDate(
          loadOption?.uploaded_at ?? '-',
          'YYYY-MM-DD'
        )

        setFilterLabel(currentFilters, 'load_name', labelLoadName)
        setFilterLabel(currentFilters, 'load_status', labelLoadStatus)
        setFilterLabel(currentFilters, 'load_date', labelLoadDate)
      } else {
        setFilterLabel(currentFilters, 'load_name', null)
        setFilterLabel(currentFilters, 'load_status', null)
        setFilterLabel(currentFilters, 'load_date', null)
      }
    }

    if (fieldName === 'bank_id') {
      const label = getLabelFromOptions('bank_id', newValue, 'description')
      setFilterLabel(currentFilters, 'bank_name', label)

      filtersRef.value?.cleanFiltersByNames?.([
        'bank_account_id',
        'bank_account_name',
      ])
    }

    if (fieldName === 'bank_account_id') {
      const label = getLabelFromOptions('bank_account_id', newValue, 'label')
      const formatText = label.split(' - ')[1]
      setFilterLabel(currentFilters, 'bank_account_name', formatText)
    }

    previousFilterValues.value = { ...currentFilters }
  }

  const getLabelFromOptions = (
    field: string,
    value: string | number | null,
    index: string = 'name'
  ) => {
    return (
      filterConfig.value
        .find((f) => f.name === field)
        ?.options?.find((opt: ISelectorResources) => opt.value === value)?.[
        index
      ] ?? null
    )
  }

  const setFilterLabel = (
    currentFilters: Record<string, string | number | null>,
    name: string,
    label: string | null
  ) => {
    filtersRef.value?.setFieldValueByName(name, label)
    previousFilterValues.value[`filter[${name}]`] = label
    currentFilters[`filter[${name}]`] = label
  }

  const handleShowMoreFilters = (option: boolean) => {
    hideFilters.value = option

    for (let i = 1; i < filterConfig.value.length; i++) {
      filterConfig.value[i].hide = option
      const className = i > 2 ? 'col-12 col-md-3' : 'col-12 col-md-6'

      if (!option) {
        filterConfig.value[i].class = className
      } else {
        filterConfig.value[i].class = filterConfig.value[i].class.replace(
          className,
          ''
        )
      }
    }
  }

  const handleClearFilters = () => {
    handleShowMoreFilters(true)
    selectedRows.value = []

    _clearData()
  }

  const handleDetailClick = async (row: IAuthorizationTreasuryItemList) => {
    openMainLoader(true)
    await _getByIdAuthorizationTreasury(row.id, row.type)
    openMainLoader(false)
    alertModalRef.value?.openModal()
  }

  const handleErrorClick = () => {
    _getErrorFileAuthorizationTreasury()
  }

  const handleSelectedRows = (val: IAuthorizationTreasuryItemList[]) => {
    _setDataSelection(val)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = async (rows: number) => {
    filtersFormat.value.rows = rows
    filtersFormat.value.page = 1

    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    const params = new URLSearchParams(filters)
    const newParams = []

    for (const [key, value] of params.entries()) {
      const cleanKey = key.replace(/^filter\[(.+)\]$/, '$1')
      newParams.push(`${cleanKey}=${encodeURIComponent(value)}`)
    }

    filters = newParams.join('&')

    openMainLoader(true)
    await _getAuthorizationTreasuryList(filters)
    openMainLoader(false)
    tableProps.value.loading = false
  }

  const makeDataRequest = (rejected = false): IAuthorizationPayload => {
    const payload = {
      record_ids: data_selection.value.map((item) => item.id),
      record_type: data_selection.value[0]?.type,
      ...(rejected && { rejection_reason: rejection_reason.value }),
      ...(!rejected && { observations: '' }),
    }

    return payload
  }

  const authorizeAction = async () => {
    const payload = makeDataRequest()
    openMainLoader(true)
    const authorize = await _authorizeRequest(payload)
    openMainLoader(false)
    if (error.value.recordId.length === 0 && authorize) {
      _clearData()
      const queryString = formatParamsCustom(filtersFormat.value)
      await listAction(queryString ? '&' + queryString : '')
    }
  }

  const rejectAction = async () => {
    if (!rejection_reason.value) {
      showAlert(
        'El motivo de rechazo es obligatorio',
        'error',
        undefined,
        TIMEOUT_ALERT
      )

      return
    }

    const payload = makeDataRequest(true)
    openMainLoader(true)
    const reject = await _rejectRequest(payload)
    openMainLoader(false)
    if (reject) {
      _clearData()
      selectedRows.value = []

      const queryString = formatParamsCustom(filtersFormat.value)
      await listAction(queryString ? '&' + queryString : '')
    }
  }

  const updateTableColumns = (authType: string | number | null) => {
    const showExpenseColumns = authType === 'expense'
    const showIncomeColumns = authType === 'income'
    const showTransferColumns = authType === 'transfer'

    let filtered = allColumns.value?.filter((col) => {
      const colName = col.name as string

      if (conditionalColumnsExpense.includes(colName)) {
        return showExpenseColumns
      }

      if (conditionalColumnsIncome.includes(colName)) {
        return showIncomeColumns
      }

      if (conditionalColumnsTransfer.includes(colName)) {
        return showTransferColumns
      }

      return true
    })

    if (authType === 'transfer') {
      const orderedTransferColumns = [
        'id',
        'transfer',
        'status',
        'load',
        'office',
        'register_type',
        'business',
        'date',
        'bank',
        'bank_account',
        'third_party',
        'fund',
        'investment_plan',
        'foreign_currency_value',
        'trm',
        'amount',
        'cost_center',
        'cash_flow',
        'actions',
      ]

      filtered = filtered?.sort((a, b) => {
        const indexA = orderedTransferColumns.indexOf(a.name as string)
        const indexB = orderedTransferColumns.indexOf(b.name as string)
        return indexA - indexB
      })
    }

    tableProps.value.columns = filtered
  }

  onMounted(async () => {
    _resetKeys(keysWithParam)
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)

    if (tableProps.value.columns && Array.isArray(tableProps.value.columns)) {
      allColumns.value = [...tableProps.value.columns]
    }
    updateTableColumns(null)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysWithParam)
    _resetKeys(load_key)
  })

  watch(
    () => authorization_treasury_list.value,
    () => {
      tableProps.value.rows = authorization_treasury_list.value
      tableProps.value.pages.currentPage =
        authorization_treasury_pages.value.currentPage
      tableProps.value.pages.lastPage =
        authorization_treasury_pages.value.lastPage

      selectedRows.value = []
    },
    { deep: true }
  )

  watch(
    () => [
      getOfficeID.value,
      getBusinessIdFrom.value,
      getBusinessIdTo.value,
      getBankId.value,
      getBankAccountId.value,
    ],
    () => {
      const clearKeys = ['load_id', 'load_name', 'load_status', 'load_date']
      filtersRef.value?.cleanFiltersByNames(clearKeys)
      _resetKeys(load_key)

      const params: string[] = []
      if (getBankId.value != null) {
        params.push(`filter[bank_id]=${getBankId.value}`)
      }
      if (getBusinessIdFrom.value != null) {
        params.push(`business_from_id=${getBusinessIdFrom.value}`)
      }
      if (getBusinessIdTo.value != null) {
        params.push(`business_to_id=${getBusinessIdTo.value}`)
      }
      if (getOfficeID.value != null) {
        params.push(`filter[office_id]=${getOfficeID.value}`)
      }
      if (getBankAccountId.value != null) {
        params.push(`filter[bank_account_id]=${getBankAccountId.value}`)
      }

      const query = params.join('&')
      _getResources(load_key, query, 'v2')
      
      _getBulkUploadsAuthorization()
    },
    { deep: true }
  )

  return {
    headerProps,
    filtersRef,
    filterConfig,
    alertModalRef,
    tableProps,
    authorization_treasury_response,
    selectedRows,
    data_selection,
    rejection_reason,
    error,
    no_special_characters_extended,
    authorizeAction,
    rejectAction,
    updatePage,
    updatePerPage,
    handleFilter,
    handleFieldChange,
    handleClearFilters,
    handleDetailClick,
    handleSelectedRows,
    handleErrorClick,
    max_length,
  }
}

export default useAuthorizationTreasuryList
