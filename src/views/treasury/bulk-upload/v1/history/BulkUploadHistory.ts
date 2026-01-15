// Vue - pinia
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  watch,
  Ref,
} from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs, IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { IBulkUploadHistory } from '@/interfaces/customs/treasury/BulkUpload'

// Composables - constants
import { useUtils, useRules, useMainLoader, useGoToUrl } from '@/composables'
import { BULK_UPLOAD_OPTIONS } from '@/constants/resources/treasury'

// Stores
import { useBulkUploadStore } from '@/stores/treasury/bulk-upload'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'

const useBulkUploadHistory = () => {
  const {
    _listHistoryAction,
    _deleteHistoryAction,
    _getValidateErrorsAction,
    _getErrorsLogHistoryAction,
  } = useBulkUploadStore('v1')
  const { bulk_upload_history_list, bulk_upload_history_pages } = storeToRefs(
    useBulkUploadStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const {
    business_trusts_egreso,
    banks_label_code,
    business_bank_accounts_bulk,
    treasury_bulk_uploads,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { defaultIconsLucide, formatDate, formatCurrency } = useUtils()
  const { is_required, date_before_or_equal_to_the_current_date } = useRules()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const selectOptions = computed(() => ({
    offices: offices,
    business: business_trusts_egreso,
    banks: banks_label_code,
    bank_accounts: business_bank_accounts_bulk,
    load_numbers: treasury_bulk_uploads,
  }))

  const headerProperties = {
    title: 'Historial cargue masivo',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Historial cargue masivo',
        route: 'BulkUploadHistory',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'BulkUploadForm',
      label: 'Datos de entrada',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const holidays = ref<string[]>([])

  const handlerHolidays = async (year: number) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const selectedType = ref('')
  const selectedRowId = ref<number | null>()
  const selectedBulkUploadId = ref<number | null>()

  const onSelectRow = (row: IBulkUploadHistory) => {
    selectedRowId.value = row.id
    selectedBulkUploadId.value = row.bulk_upload_id || null
  }

  const isDisabled = computed(() => {
    const selectedRow = tableProperties.value.rows.find(
      (row) => row.id === selectedRowId.value
    )
    return (
      !selectedRowId.value ||
      selectedRow?.status?.status !== 'Cargado con errores'
    )
  })

  const filterComponentRef = ref()

  const filtersFormat = ref<
    {
      page: number
      rows: number
      'filter[date]': string | null
      'filter[record_status]': string | null
    } & Record<string, string | number | null>
  >({
    page: 1,
    rows: 20,
    'filter[date]': formatDate(new Date().toISOString(), 'YYYY-MM-DD') ?? null,
    'filter[record_status]': null,
  })

  const loadNumberFilters = reactive({
    date: formatDate(new Date().toISOString(), 'YYYY-MM-DD') as string | null,
    businessId: null as number | null,
    operationType: null as string | null,
  })

  const bankAccountFilters = reactive({
    businessId: null as number | null,
    bankId: null as number | null,
  })

  const setFilterFieldName = <T extends { value: number | string }>(
    id: number | null,
    field: string,
    optionsList: Ref<T[]>,
    labelField: keyof T = 'name' as keyof T
  ) => {
    const selectedItem = id
      ? optionsList.value.find((item) => Number(item.value) === Number(id))
      : null

    filterComponentRef.value?.setFieldValueByName(
      field,
      selectedItem?.[labelField] ?? null
    )
  }

  const handleBusinessChange = async (businessId: number | null) => {
    setFilterFieldName(
      businessId,
      'business_name',
      selectOptions.value.business
    )

    loadNumberFilters.businessId = businessId
    bankAccountFilters.businessId = businessId

    _resetKeys({ treasury: ['banks', 'banks_label_code'] })
    filterComponentRef.value?.cleanFiltersByNames(['bank_id', 'bank_name'])

    if (!businessId) return

    await _getResources(
      { treasury: ['banks'] },
      `filter[business_trust]=${businessId}`,
      'v2'
    )
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'operation_type',
      type: 'q-option-group',
      class: 'col-12',
      label: '',
      value: null,
      options: BULK_UPLOAD_OPTIONS['filters'],
      clean_value: true,
      disable: false,
      onChange: (value: string | null) => {
        loadNumberFilters.operationType = value
      },
    },
    {
      name: 'office_id',
      type: 'q-select',
      class: 'col-12 col-md-6',
      label: 'Oficina',
      placeholder: 'Seleccione',
      value: null,
      options: selectOptions.value.offices,
      clean_value: true,
      autocomplete: true,
      disable: false,
      onChange: (value: number | null) =>
        setFilterFieldName(value, 'office_name', selectOptions.value.offices),
    },
    {
      name: 'office_name',
      type: 'q-input',
      class: 'col-12 col-md-6',
      label: 'Nombre oficina',
      placeholder: '-',
      value: null,
      clean_value: true,
      disable: true,
    },
    {
      name: 'business_trust_id',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Negocio',
      placeholder: 'Seleccione',
      value: null,
      options: selectOptions.value.business,
      clean_value: true,
      autocomplete: true,
      disable: false,
      onChange: handleBusinessChange,
    },
    {
      name: 'business_name',
      type: 'q-input',
      class: 'col-12 col-md-3',
      label: 'Nombre negocio',
      placeholder: '-',
      value: null,
      clean_value: true,
      disable: true,
    },
    {
      name: 'bank_id',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Banco',
      placeholder: 'Seleccione',
      value: null,
      options: selectOptions.value.banks,
      clean_value: true,
      autocomplete: true,
      disable: false,
      onChange: (value: number | null) => {
        setFilterFieldName(
          value,
          'bank_name',
          selectOptions.value.banks,
          'description'
        )
        bankAccountFilters.bankId = value
      },
    },
    {
      name: 'bank_name',
      type: 'q-input',
      class: 'col-12 col-md-3',
      label: 'Nombre banco',
      placeholder: '-',
      value: null,
      clean_value: true,
      disable: true,
    },
    {
      name: 'bank_account_id',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Cuenta bancaria',
      placeholder: 'Seleccione',
      value: null,
      options: selectOptions.value.bank_accounts,
      clean_value: true,
      autocomplete: true,
      disable: false,
      onChange: (value: number | null) =>
        setFilterFieldName(
          value,
          'bank_account_name',
          selectOptions.value.bank_accounts,
          'account_name'
        ),
    },
    {
      name: 'bank_account_name',
      type: 'q-input',
      class: 'col-12 col-md-3',
      label: 'Nombre cuenta bancaria',
      placeholder: '-',
      value: null,
      clean_value: true,
      disable: true,
    },
    {
      name: 'date',
      type: 'q-date',
      class: 'col-12 col-md-3',
      label: 'Fecha*',
      placeholder: 'AAAA-MM-DD',
      value: formatDate(new Date().toISOString(), 'YYYY-MM-DD') ?? null,
      clean_value: true,
      disable: false,
      rules: [
        (val: string) => is_required(val, 'La fecha es requerida'),
        (val: string) => date_before_or_equal_to_the_current_date(val),
      ],
      navigation_max_year: new Date().getFullYear().toString(),
      navigation_min_year: '1000/01',
      option_calendar: ($event) =>
        useUtils().isDateAllowed($event, holidays.value),
      onNavigation: async ({ year }: { year: number }) => {
        handlerHolidays(year)
      },
      onChange: (value: string | null) => {
        loadNumberFilters.date = value
      },
    },
    {
      name: 'load_number',
      type: 'q-select',
      class: 'col-12 col-md-3',
      label: 'Número de cargue',
      placeholder: 'Seleccione',
      value: null,
      options: selectOptions.value.load_numbers,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
  ])

  const tableProperties = ref<IBaseTableProps<IBulkUploadHistory>>({
    title: 'Listado de cargue masivo',
    loading: false,
    columns: [
      {
        name: 'radio_button',
        required: true,
        label: '',
        align: 'center',
        field: 'id',
        sortable: false,
      },
      {
        name: 'id',
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
        required: true,
      },
      {
        name: 'load_number',
        label: 'Número de cargue',
        align: 'left',
        field: (row) => row.load_number || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'business_name',
        label: 'Negocio',
        align: 'left',
        field: (row) =>
          row.basic_data?.business?.name ||
          row.additional_info?.error_message ||
          '-',
        sortable: true,
        required: true,
      },
      {
        name: 'bank_name',
        label: 'Banco',
        align: 'left',
        field: () => '',
        sortable: true,
        required: true,
      },
      {
        name: 'account_name',
        label: 'Cuenta',
        align: 'left',
        field: () => '',
        sortable: true,
        required: true,
      },
      {
        name: 'movement_code',
        label: 'Código de movimiento',
        align: 'left',
        field: () => '',
        sortable: true,
      },
      {
        name: 'nature',
        label: 'Naturaleza',
        align: 'left',
        field: () => '',
        sortable: true,
      },
      {
        name: 'beneficiary_nit',
        label: 'Nit beneficiario',
        align: 'left',
        field: () => '',
        sortable: true,
        required: true,
      },
      {
        name: 'total_value_formatted',
        label: 'Valor',
        align: 'left',
        field: () => '',
        sortable: true,
        required: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'center',
        field: (row) => row.status.id,
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'id',
        required: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _listHistoryAction(filters)
    tableProperties.value.loading = false
  }

  const handleValidateErrors = async (id: number) => {
    openMainLoader(true)
    await _getValidateErrorsAction(id)
    openMainLoader(false)
  }

  const handleDownloadErrorsLog = async (id: number) => {
    openMainLoader(true)
    await _getErrorsLogHistoryAction(id)
    openMainLoader(false)
  }

  const handleDeleteBulkUpload = async (id: number) => {
    openMainLoader(true)
    const success = await _deleteHistoryAction(id)

    if (success) {
      await listAction(filtersFormat.value)
      selectedRowId.value = null
      selectedBulkUploadId.value = null
    }

    openMainLoader(false)
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
    selectedRowId.value = null
    selectedBulkUploadId.value = null

    filtersFormat.value = {
      page: 1,
      rows: filtersFormat.value.rows,
      'filter[date]': filtersFormat.value['filter[date]'],
      'filter[record_status]': filtersFormat.value['filter[record_status]'],
    }
  }

  const handleFilterSearch = async ($filters: {
    'filter[operation_type]': string
    'filter[office_id]': string
    'filter[business_trust_id]': string
    'filter[bank_id]': string
    'filter[bank_account_id]': string
    'filter[date]': string
    'filter[load_number]': string
  }) => {
    filtersFormat.value = {
      'filter[operation_type]': $filters['filter[operation_type]'],
      'filter[office_id]': $filters['filter[office_id]'],
      'filter[business_trust_id]': $filters['filter[business_trust_id]'],
      'filter[bank_id]': $filters['filter[bank_id]'],
      'filter[bank_account_id]': $filters['filter[bank_account_id]'],
      'filter[date]': $filters['filter[date]'],
      'filter[load_number]': $filters['filter[load_number]'],
      page: 1,
      rows: filtersFormat.value.rows,
      'filter[record_status]': filtersFormat.value['filter[record_status]'],
    }

    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  onMounted(async () => {
    await Promise.all([
      _getResources({
        treasury: ['business_trusts_egreso'],
        fics: ['offices'],
      }),
      listAction(filtersFormat.value),
    ])
  })

  onBeforeMount(() => {
    handlerHolidays(new Date().getFullYear())
  })

  onBeforeUnmount(() =>
    _resetKeys({
      fics: ['offices'],
      treasury: [
        'business_trusts_egreso',
        'banks',
        'banks_label_code',
        'business_bank_accounts',
        'business_bank_accounts_bulk',
        'treasury_bulk_uploads',
      ],
    })
  )

  watch(selectedType, async (newValue) => {
    filtersFormat.value.page = 1
    filtersFormat.value['filter[record_status]'] = newValue || null

    await listAction(filtersFormat.value)
  })

  // Cuentas bancarias por negocio y banco
  watch(
    bankAccountFilters,
    async ({ businessId, bankId }) => {
      filterComponentRef.value?.cleanFiltersByNames([
        'bank_account_id',
        'bank_account_name',
      ])
      _resetKeys({
        treasury: ['business_bank_accounts', 'business_bank_accounts_bulk'],
      })

      if (!businessId || !bankId) return

      await _getResources(
        { treasury: ['business_bank_accounts'] },
        `business_id=${businessId}&filter[bank_id]=${bankId}`,
        'v2'
      )
    },
    { deep: true }
  )

  // Numero de cargue por negocio, fecha y operación
  watch(
    loadNumberFilters,
    async ({ date, businessId, operationType }) => {
      filterComponentRef.value?.cleanFiltersByNames(['load_number'])
      _resetKeys({ treasury: ['treasury_bulk_uploads'] })

      // Filtro por negocio y fecha obligatorios
      if (!date || !businessId) return

      const filterParams: Record<string, string | number | null> = {
        'filter[date]': date,
        'filter[business_trust_id]': businessId,
        ...(operationType ? { 'filter[operation_type]': operationType } : {}),
      }

      const filterQuery = Object.entries(filterParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

      await _getResources(
        { treasury: ['treasury_bulk_uploads'] },
        filterQuery,
        'v2'
      )
    },
    { immediate: true, deep: true }
  )

  watch(bulk_upload_history_list, (val) => {
    tableProperties.value.rows = [...val]

    const { currentPage, lastPage } = bulk_upload_history_pages.value
    tableProperties.value.pages = {
      currentPage,
      lastPage,
    }
  })

  return {
    BULK_UPLOAD_OPTIONS,
    defaultIconsLucide,
    selectedType,
    selectedRowId,
    selectedBulkUploadId,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    isDisabled,
    filterComponentRef,
    filterConfig,
    tableProperties,
    goToURL,
    onSelectRow,
    handleValidateErrors,
    handleDownloadErrorsLog,
    handleDeleteBulkUpload,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    formatCurrency,
  }
}

export default useBulkUploadHistory
