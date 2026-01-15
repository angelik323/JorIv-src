// Vue
import { onBeforeUnmount, onMounted, reactive, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'

// Composables & Utils
import { useAlert, useMainLoader, useRules, useUtils } from '@/composables'
import { formatParamsCustom } from '@/utils'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import {
  IAuthorizationAssignmentBankAccountsFormModel,
  IAuthorizationAssignmentBankAccountsItem,
  IAuthorizationAssignmentBankAccountsPages,
} from '@/interfaces/customs/treasury/authorizationAssignmentBankAccounts'

// Stores
import { useResourceManagerStore, useTreasuryResourceStore } from '@/stores'
import { useAuthorizationAssignmentBankAccountsStore } from '@/stores/treasury/authorization-asssignment-bank-accounts'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'

export const useAuthorizationAssignmentBankAccountsList = () => {
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const { no_special_characters_extended, max_length } = useRules()
  const { business_trust_cesion, users_grantor_request, grantor_states } =
    storeToRefs(useTreasuryResourceStore('v1'))

  const {
    _getAuthorizationAssignmentBankAccountsList,
    _authorizationAssignmentBankAccountsList,
    _rejectAuthorizationAssignmentBankAccountsList,
    _errorAuthorizationAssignmentBankAccountsList,
    _hasErrors,
    _clearData,
  } = useAuthorizationAssignmentBankAccountsStore('v1')

  const filtersFormat = ref<Record<string, string | number>>({})
  const { formatCurrencyString } = useUtils()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  let perPage = 20

  const alertModalRef = ref()
  const currentAction = ref<string | null>(null)

  const {
    authorization_assignment_bank_accounts_list,
    authorization_assignment_bank_accounts_list_description,
    request_bank_id,
    authorization_assignment_bank_accounts,
  } = storeToRefs(useAuthorizationAssignmentBankAccountsStore('v1'))

  const keysV2 = {
    treasury: [
      'business_trust_cesion',
      'users_grantor_request',
      'grantor_states',
    ],
  }

  const headerProps = {
    title: 'Autorización de cesión de cuentas bancarias',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesoreria', route: '' },
      {
        label: 'Autorización de cesión de cuentas bancarias',
        route: 'AuthorizationAssignmentBankAccountsList',
      },
    ],
  }

  const models = reactive<IAuthorizationAssignmentBankAccountsFormModel>({
    bank: '',
    account_bank: '',
    name_business_assign: '',
    code_movement_expenses: '',
    name_movement_expenses: '',
    code_movement_incomes: '',
    name_movement_incomes: '',
    rejection_reason: '',
  })

  const filters = ref<IFieldFilters[]>([
    {
      name: 'business_trust',
      label: 'Negocio Cedente',
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
      name: 'request_user_id',
      label: 'Usuario solicitante',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: users_grantor_request,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado de la solicitud',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: grantor_states,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'date_init',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
    },
    {
      name: 'date_end',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IAuthorizationAssignmentBankAccountsItem[]
    pages: IAuthorizationAssignmentBankAccountsPages
  }>({
    title: 'Listado de autorización de cuentas',
    loading: false,
    columns: [
      { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
      {
        name: 'created_by',
        label: 'Usuario solicitante',
        align: 'left',
        field: 'created_by',
        sortable: true,
      },
      {
        name: 'bank',
        label: 'Banco',
        align: 'left',
        field: 'bank',
        sortable: true,
      },
      {
        name: 'bank_description',
        label: 'Descripción banco',
        align: 'left',
        field: 'bank_description',
        sortable: true,
      },
      {
        name: 'account',
        label: 'Cuenta bancaria',
        align: 'left',
        field: 'account',
        sortable: true,
      },
      {
        name: 'state',
        label: 'Estado',
        align: 'left',
        field: 'state',
        sortable: true,
      },
      {
        name: 'balance',
        label: 'Saldo',
        align: 'right',
        field: 'balance',
        sortable: true,
        format: (val: number) =>
          formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'business_grantor',
        label: 'Negocio cedente',
        align: 'left',
        field: 'business_grantor',
        sortable: true,
      },
      {
        name: 'business_assign',
        label: 'Negocio cesionario',
        align: 'left',
        field: 'business_assign',
        sortable: true,
      },
      {
        name: 'date',
        label: 'Fecha cesión',
        align: 'left',
        field: 'date',
        sortable: true,
      },
      {
        name: 'selected',
        label: 'Seleccionar/todo',
        align: 'center',
        field: 'selected',
        sortable: false,
      },
    ],
    rows: [],
    pages: authorization_assignment_bank_accounts.value,
  })

  const toTransferTable = () => {
    authorization_assignment_bank_accounts_list.value =
      authorization_assignment_bank_accounts_list.value.map((item) => ({
        ...item,
        selected: false,
        date: useUtils().formatDate(item.date, 'YYYY-MM-DD'),
      }))
  }

  const filtersRef = ref()

  const onFilterChange = (filters: Record<string, string | number | null>) => {
    const selectedValue = filters['filter[business_trust]']
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
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    _clearData()
    await _getAuthorizationAssignmentBankAccountsList(filters)
    toTransferTable()
    tableProps.value.loading = false
  }

  const handleFilter = ($filters: {
    'filter[business_trust]': string
    'filter[status_id]': number
    'filter[business_name]'?: string
    'filter[date_end]'?: string
  }) => {
    delete $filters['filter[business_name]']

    const processedFilters: Record<string, string | number> = { ...$filters }
    if (processedFilters['filter[date_end]']) {
      processedFilters['date_end'] = processedFilters[
        'filter[date_end]'
      ] as string
      delete processedFilters['filter[date_end]']
    }

    const queryString = formatParamsCustom(processedFilters)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  onMounted(async () => {
    await _getResources(keysV2, '', 'v2')
  })

  onBeforeUnmount(() => _resetKeys(keysV2))

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la cuenta bancaria?',
    id: null as number | null,
  })

  const makeDataRequestApprove = () => {
    const selectedRows = tableProps.value.rows.filter(
      (row) => row.selected === true
    )

    const groupedByParentId = selectedRows.reduce((groups, row) => {
      const parentId = row.parent_id || request_bank_id.value || 0
      if (!groups[parentId]) {
        groups[parentId] = []
      }
      groups[parentId].push(row.id)
      return groups
    }, {} as Record<number, number[]>)

    return Object.entries(groupedByParentId).map(([parentId, accountIds]) => ({
      bank_account_grantor_request_id: Number(parentId),
      requests: accountIds,
    }))
  }

  const makeDataRequestReject = () => {
    const selectedRows = tableProps.value.rows.filter(
      (row) => row.selected === true
    )

    const groupedByParentId = selectedRows.reduce((groups, row) => {
      const parentId = row.parent_id || request_bank_id.value || 0
      if (!groups[parentId]) {
        groups[parentId] = []
      }
      groups[parentId].push(row)
      return groups
    }, {} as Record<number, IAuthorizationAssignmentBankAccountsItem[]>)

    return Object.entries(groupedByParentId).map(([parentId, rows]) => ({
      bank_account_grantor_request_id: Number(parentId),
      rejections: rows.map((row) => ({
        bank_account_id: row.id,
        reason: models.rejection_reason,
      })),
    }))
  }

  const handleActions = async () => {
    openMainLoader(true)

    let payloads
    let allSuccess = true

    if (currentAction.value === 'autorizar') {
      payloads = makeDataRequestApprove()
      if (!payloads || payloads.length === 0) {
        showAlert('No hay cuentas seleccionadas para autorizar.', 'error')
        openMainLoader(false)
        return
      }

      for (const payload of payloads) {
        const success = await _authorizationAssignmentBankAccountsList(payload)
        if (!success) {
          allSuccess = false
          break
        }
      }
    } else if (currentAction.value === 'rechazar') {
      payloads = makeDataRequestReject()
      if (!payloads || payloads.length === 0) {
        showAlert('No hay cuentas seleccionadas para rechazar.', 'error')
        openMainLoader(false)
        return
      }

      for (const payload of payloads) {
        const success = await _rejectAuthorizationAssignmentBankAccountsList(
          payload as never
        )
        if (!success) {
          allSuccess = false
          break
        }
      }
    }

    if (allSuccess) {
      router.push({ name: 'AuthorizationAssignmentBankAccountsList' })
      currentAction.value = null
      resetAll()
    }
    await alertModalRef.value.closeModal()
    openMainLoader(false)
  }

  const resetAll = () => {
    models.bank = ''
    models.account_bank = ''
    models.name_business_assign = ''
    models.code_movement_expenses = ''
    models.name_movement_expenses = ''
    models.code_movement_incomes = ''
    models.name_movement_incomes = ''
    models.rejection_reason = ''

    if (filtersRef.value?.setFieldValueByName) {
      filters.value.forEach((filter) => {
        filtersRef.value.setFieldValueByName(filter.name, null)
      })
    }

    if (tableProps.value?.rows) {
      tableProps.value.rows = []
    }
  }

  const handleOptions = async (option: string) => {
    currentAction.value = option
    switch (option) {
      case 'errores':
        if (!_hasErrors()) {
          showAlert(
            'No hay errores registrados para generar el log',
            'warning',
            undefined,
            TIMEOUT_ALERT
          )
          return
        }

        const success = await _errorAuthorizationAssignmentBankAccountsList()
        if (success) {
          showAlert(
            'Log de errores procesado exitosamente',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        }
        currentAction.value = null
        break
      case 'autorizar':
        alertModalConfig.value.description =
          '¿Desea autorizar los registros seleccionado?'
        await alertModalRef.value.openModal()
        break
      case 'rechazar':
        if (!models.rejection_reason) {
          showAlert(
            'El motivo de rechazo es obligatorio',
            'error',
            undefined,
            TIMEOUT_ALERT
          )

          return
        }
        alertModalConfig.value.description =
          '¿Desea rechazar los registros seleccionados?'
        await alertModalRef.value.openModal()
        break
      default:
        break
    }
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }

  const hasErrorsForDownload = computed(() => {
    return _hasErrors()
  })

  watch(
    () => authorization_assignment_bank_accounts_list.value,
    () => {
      tableProps.value.rows = authorization_assignment_bank_accounts_list.value
      tableProps.value.pages.currentPage =
        authorization_assignment_bank_accounts.value.currentPage
      tableProps.value.pages.lastPage =
        authorization_assignment_bank_accounts.value.lastPage
    },
    { deep: true }
  )

  watch(
    () => authorization_assignment_bank_accounts_list_description.value,
    (newValue) => {
      Object.assign(models, newValue)
    },
    { deep: true }
  )

  return {
    headerProps,
    filters,
    tableProps,
    filtersRef,
    alertModalRef,
    models,
    updatePage,
    updatePerPage,
    handleFilter,
    onFilterChange,
    handleOptions,
    no_special_characters_extended,
    max_length,
    handleActions,
    alertModalConfig,
    hasErrorsForDownload,
    handleClear,
  }
}
