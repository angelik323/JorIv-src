// Vue
import { ref, watch, reactive, onMounted, computed, onBeforeUnmount } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import moment from 'moment'

// composables & Utils
import { useMainLoader, useRules, useUtils } from '@/composables'
import { formatParamsCustom } from '@/utils'

// Interfaces
import {
  IAssignmentBankAccountsFormModel,
  IAssignmentBankAccountsItem,
  IAssignmentBankAccountsPages,
  IAssignmentBankAccountsPayload,
  IFieldFilters,
  ISelectorResources,
} from '@/interfaces/customs'

// Stores
import {
  useAssignmentBankAccountsStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

const useAssignmentBankAccountsList = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { formatCurrencyString } = useUtils()

  const {
    _getAssignmentBankAccountsList,
    _createAssignmentBankAccountsList,
    _clearAssignmentBankAccountsList,
  } = useAssignmentBankAccountsStore('v1')

  const { assignment_bank_accounts_list, assignment_bank_accounts } =
    storeToRefs(useAssignmentBankAccountsStore('v1'))
  let perPage = 20

  const { business_trust_cesion, treasury_movement_codes_cesiones } =
    storeToRefs(useTreasuryResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const qBusinessCode = ref('')
  const qGrantorDate = ref('')

  const treasury_movement_codes_ingresos = ref<ISelectorResources[]>([])
  const treasury_movement_codes_egresos = ref<ISelectorResources[]>([])

  const models = reactive<IAssignmentBankAccountsFormModel>({
    assigneeBusinessId: null,
    assigneeBusinessName: '',
    expenseMovementId: '',
    expenseMovementCode: '',
    expenseMovementName: '',
    incomeMovementId: '',
    incomeMovementCode: '',
    incomeMovementName: '',
    grantorDate: '',
  })

  const headerProps = {
    title: 'Solicitudes cesión de cuentas bancarias',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Cesión de cuentas bancarias',
        route: 'AssignmentBankAccountsList',
      },
    ],
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IAssignmentBankAccountsItem[]
    pages: IAssignmentBankAccountsPages
  }>({
    title: 'Listado detalle de cuentas',
    loading: false,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
      {
        name: 'account_bank',
        label: 'Banco',
        align: 'left',
        field: 'account_bank',
        sortable: true,
      },
      {
        name: 'bank_description',
        label: 'Descripción Banco',
        align: 'left',
        field: 'bank_description',
        sortable: false,
      },
      {
        name: 'account_number',
        label: 'Cuenta Bancaria',
        align: 'left',
        field: 'account_number',
        sortable: true,
      },
      {
        name: 'account_name',
        label: 'Descripción Cuenta Bancaria',
        align: 'left',
        field: 'account_name',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'left',
        field: (row) => row.status?.status || '-',
        sortable: false,
      },
      {
        name: 'balance',
        label: 'Saldo',
        align: 'left',
        field: (row) => row.balance ?? 0,
        sortable: true,
        format: (val: number) =>
          formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'to_transfer',
        label: 'Ceder',
        align: 'center',
        field: 'to_transfer',
        sortable: false,
      },
    ],
    rows: [],
    pages: assignment_bank_accounts.value,
  })

  const holidays = ref<string[]>([])

  const handlerHolidays = async (year: number) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const filters = ref<IFieldFilters[]>([
    {
      name: 'business_code',
      label: 'Negocio cedente*',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: business_trust_cesion,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) =>
          useRules().is_required(v, 'Negocio cedente es requerido'),
      ],
    },
    {
      name: 'business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'grantor_date',
      label: 'Fecha*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'YYYY-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => useRules().is_required(v, 'La fecha es requerido'),
        (v: string) => useRules().valid_format_date(v, 'YYYY-MM-DD'),
        (v: string) => useRules().length_exactly(v, 10),
        (v: string) => useRules().date_is_not_weekend(v),
        (v: string) => useRules().date_before_or_equal_to_the_current_date(v),
      ],
      navigation_max_year: new Date().getFullYear().toString(),
      navigation_min_year: '1000/01',
      option_calendar: ($event) =>
        useUtils().isDateAllowed($event, holidays.value),
      onNavigation: async ({ year }: { year: number }) => {
        handlerHolidays(year)
      },
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const alertModalRef = ref()

  const handleFilter = ($filters: {
    'filter[business_code]': string
    'filter[grantor_date]': number
  }) => {
    const businessTrustId = $filters['filter[business_code]']

    const formattedDate = moment(
      $filters['filter[grantor_date]'],
      'YYYY-MM-DD',
      true
    ).format('YYYY-MM-DD')

    qBusinessCode.value = businessTrustId ?? ''
    qGrantorDate.value = formattedDate

    if (!businessTrustId || !formattedDate) {
      _clearAssignmentBankAccountsList()
      tableProps.value.rows = []
      return
    }

    listAction(businessTrustId ?? '', formattedDate)
  }

  const listAction = async (
    businessTrustId: string,
    grantorDate: string,
    queryString: string = ''
  ) => {
    openMainLoader(true)
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getAssignmentBankAccountsList(
      businessTrustId,
      grantorDate,
      queryString
    )

    if (
      !assignment_bank_accounts_list.value ||
      assignment_bank_accounts_list.value.length === 0
    ) {
      tableProps.value.rows = []
    } else {
      toTransferTable()
    }

    tableProps.value.loading = false
    openMainLoader(false)
  }

  const handleClear = () => {
    _clearAssignmentBankAccountsList()
    tableProps.value.rows = []
  }

  const updateAlertModalDescription = () => {
    const assigneeBusinessId = models.assigneeBusinessId

    const assigneeBusiness = business_trust_cesion.value.find(
      (item) => item.value === assigneeBusinessId
    )

    const businessCodeAssign = assigneeBusiness?.business_code ?? 'No definido'
    const businessName = assigneeBusiness?.name ?? 'No definido'
    const grantorDate = models.grantorDate || 'Sin fecha'

    alertModalConfig.value.description = `${businessCodeAssign} - ${businessName}<br><br>Fecha: ${grantorDate}`
  }

  const alertModalConfig = ref({
    title: '¿Desea ceder las cuentas seleccionadas al negocio?',
    description: '',
    id: null as number | null,
  })

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(
      qBusinessCode.value ?? '',
      qGrantorDate.value,
      queryString ? '&' + queryString : ''
    )
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(
      qBusinessCode.value ?? '',
      qGrantorDate.value,
      queryString ? '&' + queryString : ''
    )
  }

  const keys = {
    treasury: ['business_trust_cesion'],
  }

  const keysIngresos = {
    treasury: ['treasury_movement_codes_cesiones&filter[nature]=Ingresos'],
  }

  const keysEgresos = {
    treasury: ['treasury_movement_codes_cesiones&filter[nature]=Egresos'],
  }

  onMounted(async () => {
    handlerHolidays(new Date().getFullYear())
    await _getResources(keys, '', 'v2')
    await _getResources(keysIngresos, '', 'v2')
    treasury_movement_codes_ingresos.value = [
      ...treasury_movement_codes_cesiones.value,
    ]

    await _getResources(keysEgresos, '', 'v2')
    treasury_movement_codes_egresos.value = [
      ...treasury_movement_codes_cesiones.value,
    ]
  })

  onBeforeUnmount(() => _resetKeys(keys))

  const filtersRef = ref()
  type FilterValue = string | number | null
  const currentFilterValues = ref<Record<string, FilterValue>>({})

  const onFilterChange = (filters: Record<string, string | number | null>) => {
    currentFilterValues.value = filters
    const selectedValue = filters['filter[business_code]']
    const selectedBusiness = business_trust_cesion.value.find(
      (item) => item.value === selectedValue
    )
    if (selectedBusiness && filtersRef.value) {
      filtersRef.value.setFieldValueByName(
        'business_name',
        selectedBusiness.name
      )
    } else {
      filtersRef.value?.setFieldValueByName('business_name', null)
    }

    const grantorDateRaw = filters['filter[grantor_date]']
    if (grantorDateRaw) {
      models.grantorDate = moment(grantorDateRaw, 'YYYY-MM-DD').format(
        'YYYY-MM-DD'
      )
    } else {
      models.grantorDate = ''
    }
  }

  const onAssigneeBusinessChange = (newId: number) => {
    models.assigneeBusinessId = newId
    const found = business_trust_cesion.value.find((b) => b.value === newId)
    models.assigneeBusinessName = found ? found.name ?? '' : ''
  }

  const handleExpenseMovementChange = (selectedCode: string) => {
    models.expenseMovementCode = selectedCode
    const found = treasury_movement_codes_egresos.value.find(
      (item) => item.value === selectedCode || item.code === selectedCode
    )
    if (found) {
      models.expenseMovementName = found.description || found.label || ''
      models.expenseMovementId = String(found.id || found.value || '')
    } else {
      models.expenseMovementName = ''
      models.expenseMovementId = ''
    }
  }

  const handleIncomeMovementChange = (selectedCode: string) => {
    models.incomeMovementCode = selectedCode
    const found = treasury_movement_codes_ingresos.value.find(
      (item) => item.value === selectedCode || item.code === selectedCode
    )
    if (found) {
      models.incomeMovementName = found.description || found.label || ''
      models.incomeMovementId = String(found.id || found.value || '')
    } else {
      models.incomeMovementName = ''
      models.incomeMovementId = ''
    }
  }

  const handleSubmit = async () => {
    updateAlertModalDescription()
    await alertModalRef.value.openModal()
  }

  const validateModels = (): boolean => {
    const invalidFields = Object.entries(models).filter(
      ([_, value]) => value === null || value === ''
    )

    if (invalidFields.length > 0) {
      return false
    }

    return true
  }

  const validateTableRows = (): boolean => {
    const rows = tableProps.value.rows
    const hasAtLeastOneSelected = rows.some((row) => row.to_transfer === true)

    if (!hasAtLeastOneSelected) {
      return false
    }

    return true
  }

  const makeDataRequest = (): IAssignmentBankAccountsPayload => {
    const dataForm = currentFilterValues.value
    const businessTrustId = dataForm['filter[business_code]']

    const selectedAccountIds = tableProps.value.rows
      .filter((row) => row.to_transfer === true)
      .map((row) => row.id)

    const payload: IAssignmentBankAccountsPayload = {
      business_trust_grantor_id: String(businessTrustId),
      business_trust_assign_id: String(models.assigneeBusinessId),
      code_movement_incomes_id: models.expenseMovementId,
      code_movement_expenses_id: models.incomeMovementId,
      grantor_date: moment(models.grantorDate, 'YYYY-MM-DD').format(
        'YYYY/MM/DD'
      ),
      accounts_grantor: selectedAccountIds,
    }

    return payload
  }

  const validateForm = (): boolean => {
    const filters = currentFilterValues.value

    const grantorDate = filters?.['filter[grantor_date]']

    const isValidDate =
      typeof grantorDate === 'string' &&
      grantorDate.trim() !== '' &&
      moment(grantorDate, 'YYYY-MM-DD', true).isValid()

    return isValidDate
  }

  const onSubmit = async () => {
    openMainLoader(true)
    const payload = makeDataRequest()

    if (!payload) {
      openMainLoader(false)
      return
    }

    if (await _createAssignmentBankAccountsList(payload)) {
      router.push({ name: 'AssignmentBankAccountsList' })
      resetAll()
    }
    await alertModalRef.value.closeModal()
    openMainLoader(false)
  }

  const toTransferTable = () => {
    assignment_bank_accounts_list.value =
      assignment_bank_accounts_list.value.map((item) => ({
        ...item,
        to_transfer: false,
      }))
  }

  const disabledButtom = computed(() => {
    if (!validateModels() || !validateTableRows() || !validateForm()) {
      return false
    }
    return true
  })

  const resetAll = () => {
    models.assigneeBusinessId = null
    models.assigneeBusinessName = ''
    models.expenseMovementCode = ''
    models.expenseMovementName = ''
    models.incomeMovementCode = ''
    models.incomeMovementName = ''
    models.incomeMovementId = ''
    models.expenseMovementId = ''
    models.grantorDate = ''

    if (filtersRef.value?.setFieldValueByName) {
      filters.value.forEach((filter) => {
        filtersRef.value.setFieldValueByName(filter.name, null)
      })
    }

    _clearAssignmentBankAccountsList()
    tableProps.value.rows = []
  }

  const clearMovementNamesIfEmpty = () => {
    const incomeCode = String(models.incomeMovementCode || '').trim()
    if (!incomeCode) {
      models.incomeMovementName = ''
      models.incomeMovementId = ''
    }

    const expenseCode = String(models.expenseMovementCode || '').trim()
    if (!expenseCode) {
      models.expenseMovementName = ''
      models.expenseMovementId = ''
    }
  }

  watch(
    () => assignment_bank_accounts_list.value,
    () => {
      if (
        !assignment_bank_accounts_list.value ||
        assignment_bank_accounts_list.value.length === 0
      ) {
        tableProps.value.rows = []
      } else {
        tableProps.value.rows = assignment_bank_accounts_list.value
      }
      tableProps.value.pages.currentPage =
        assignment_bank_accounts.value.currentPage
      tableProps.value.pages.lastPage = assignment_bank_accounts.value.lastPage
    },
    { deep: true }
  )

  watch(
    () => [models.incomeMovementCode, models.expenseMovementCode],
    clearMovementNamesIfEmpty
  )

  watch(
    () => models.assigneeBusinessId,
    () => {
      updateAlertModalDescription()
    }
  )

  return {
    tableProps,
    filters,
    headerProps,
    alertModalRef,
    alertModalConfig,
    filtersRef,
    models,
    business_trust_cesion,
    treasury_movement_codes_ingresos,
    treasury_movement_codes_egresos,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    onFilterChange,
    onAssigneeBusinessChange,
    handleExpenseMovementChange,
    handleIncomeMovementChange,
    handleSubmit,
    onSubmit,
    disabledButtom,
  }
}

export default useAssignmentBankAccountsList
