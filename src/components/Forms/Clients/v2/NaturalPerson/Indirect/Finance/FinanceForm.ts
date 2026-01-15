// Vue - Quasar - Pinia
import { ref, watch, onMounted, onBeforeMount } from 'vue'

// Composables
import { useGoToUrl, useUtils } from '@/composables'
import { useValidator } from '@/composables/useValidator'

// Interfaces
import type { ActionType } from '@/interfaces/global/Action'
import { INaturalClientFinanceForm } from '@/interfaces/customs'
import {
  IBankAccountRow,
  INaturalClientFinanceFormExtended,
  BankAccountModalMode,
  IBankAccountRowUI,
  IBankAccountModalModel
} from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'

import { IBaseTableProps } from '@/interfaces/global'

// Moment
import moment from 'moment'

// Constants
import { default_statuses } from '@/constants'

// Stores
import { useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'

const useFinanceForm = (
  props: {
    action: ActionType
    data?: INaturalClientFinanceForm | null
  },
  emit?: (e: 'update:data', value: INaturalClientFinanceForm | null) => void
) => {
  const { isEmptyOrZeroOrFalse, formatCurrencyString } = useUtils()
  const { validateAlphanumericMessage } = useValidator()
  const { goToURL } = useGoToUrl()

  const { getResources } = useResourceStore('v1')

  const formFinance = ref()
  const openModal = ref(false)
  const principalSelected = ref<string | null>(null)

  const openBankAccountModal = ref(false)
  const bankAccountModalMode = ref<BankAccountModalMode>('create')
  const editingRowIndex = ref<number | null>(null)

  const bankAccountModels = ref<IBankAccountModalModel>({
    id: undefined,
    bank_id: null,
    bank_branch_id: null,
    status_id: null,
    account_type_id: null,
    account_number: '',
    is_main: false
  })

  let isSettingFromProps = false


  const alertModalDelete = ref()
  const alertModalDeleteConfig = ref({
    title: 'Advertencia',
    account_number: null as string | null
  })

  const { banks, bank_types, bank_branches, legal_people_fund_sources } = storeToRefs(useResourceStore('v1'))

  const indirectNaturalPersonKeys = [
    'banks',
    'bank_types',
    'bank_branches',
    'legal_people_fund_sources'
  ]

  const models = ref<INaturalClientFinanceFormExtended>({
    financial_info: {
      report_income: undefined,
      total_operational_income: null,
      total_expenses: null,
      total_non_operational_income: null,
      other_non_operational_income_concept: null,
      assets: null,
      liabilities: null,
      cutoff_date: null,
      bank_holder_id: null,
      bank_account_number_holder: null,
      account_type_holder_id: null,
      beneficiary_name: null,
      beneficiary_document_number: null,
      bank_beneficiary_id: null,
      bank_account_number_beneficiary: null,
      account_type_beneficiary_id: null,
      bank_branch_id: null,
      bank_status: null,
      bank_name: null,
      principal: false,
      legal_people_found_source_id: null,
      other_legal_people_found_source: null,
      bank_accounts: []
    }
  })

  const optionsCalendar = (date: string) =>
    date <= moment().format('YYYY/MM/DD')

  const tableProperties = ref<IBaseTableProps<IBankAccountRowUI>>({
    title: 'Listado de cuentas bancarias',
    loading: false,
    columns: [
      {
        name: 'bank_name',
        required: false,
        label: 'Banco',
        align: 'left',
        field: (row: IBankAccountRow) => row.account_bank,
        sortable: true
      },
      {
        name: 'account_type',
        required: false,
        label: 'Tipo de cuenta',
        align: 'left',
        field: (row: IBankAccountRow) => row.account_type,
        sortable: true
      },
      {
        name: 'account_number',
        required: false,
        label: 'Número cuenta bancaria',
        align: 'left',
        field: (row: IBankAccountRow) => row.account_number,
        sortable: true
      },
      {
        name: 'branch_name',
        required: true,
        label: 'Sucursal',
        align: 'left',
        field: (row: IBankAccountRow) => row.branch_name,
        sortable: true
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'center',
        field: (row: IBankAccountRow) => row.status,
        sortable: true
      },
      {
        name: 'principal',
        required: false,
        label: 'Principal',
        align: 'center',
        field: (row: IBankAccountRow) => row.principal,
        sortable: true
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 }
  })

  const _setValueModel = () => {
    if (!props.data) return
    isSettingFromProps = true

    const incoming: INaturalClientFinanceFormExtended = {
      financial_info: {
        report_income: props.data?.financial_info?.report_income ?? undefined,
        total_operational_income:
          props.data?.financial_info?.total_operational_income ?? null,
        total_expenses: props.data?.financial_info?.total_expenses ?? null,
        total_non_operational_income:
          props.data?.financial_info?.total_non_operational_income ?? null,
        other_non_operational_income_concept:
          props.data?.financial_info?.other_non_operational_income_concept ??
          null,
        assets: props.data?.financial_info?.assets ?? null,
        liabilities: props.data?.financial_info?.liabilities ?? null,
        cutoff_date: props.data?.financial_info?.cutoff_date ?? null,
        bank_holder_id: props.data?.financial_info?.bank_holder_id ?? null,
        bank_account_number_holder:
          props.data?.financial_info?.bank_account_number_holder ?? null,
        account_type_holder_id:
          props.data?.financial_info?.account_type_holder_id ?? null,
        beneficiary_name:
          props.data?.financial_info?.beneficiary_name ?? null,
        beneficiary_document_number:
          props.data?.financial_info?.beneficiary_document_number ?? null,
        bank_beneficiary_id:
          props.data?.financial_info?.bank_beneficiary_id ?? null,
        bank_account_number_beneficiary:
          props.data?.financial_info?.bank_account_number_beneficiary ?? null,
        account_type_beneficiary_id:
          props.data?.financial_info?.account_type_beneficiary_id ?? null,
        bank_branch_id:
          (props.data as INaturalClientFinanceFormExtended)?.financial_info
            ?.bank_branch_id ?? null,
        bank_status:
          (props.data as INaturalClientFinanceFormExtended)?.financial_info
            ?.bank_status ?? null,
        bank_name:
          (props.data as INaturalClientFinanceFormExtended)?.financial_info
            ?.bank_name ?? null,
        principal:
          (props.data as INaturalClientFinanceFormExtended)?.financial_info
            ?.principal ?? false,
        legal_people_found_source_id:
          (props.data as INaturalClientFinanceFormExtended)?.financial_info
            ?.legal_people_found_source_id ?? null,
        other_legal_people_found_source:
          (props.data as INaturalClientFinanceFormExtended)?.financial_info
            ?.other_legal_people_found_source ?? null,
        bank_accounts: (props.data as INaturalClientFinanceFormExtended)?.financial_info?.bank_accounts ?? [],
        funding_source: (props.data as INaturalClientFinanceFormExtended)?.financial_info?.funding_source ?? null
      }
    }

    Object.assign(models.value, incoming)

    Promise.resolve().then(() => {
      isSettingFromProps = false
    })
  }

  const clearForm = () => {
    models.value = {
      financial_info: {
        report_income: false,
        total_operational_income: null,
        total_expenses: null,
        total_non_operational_income: null,
        other_non_operational_income_concept: null,
        assets: null,
        liabilities: null,
        cutoff_date: null,
        bank_holder_id: null,
        bank_account_number_holder: null,
        account_type_holder_id: null,
        beneficiary_name: null,
        beneficiary_document_number: null,
        bank_beneficiary_id: null,
        bank_account_number_beneficiary: null,
        account_type_beneficiary_id: null,
        bank_branch_id: null,
        bank_status: null,
        bank_name: null,
        principal: false,
        legal_people_found_source_id: null,
        other_legal_people_found_source: null,
        bank_accounts: [],
        funding_source: null
      }
    }
  }

  const handlerActionForm = (action: ActionType) => {
    const actions: Record<ActionType, () => void> = {
      create: clearForm,
      edit: _setValueModel,
      view: _setValueModel
    }
    actions[action]?.()
  }

  const handleOpenModal = () => {
    openModal.value = true
  }

  const addBankAccount = () => {
  const info = models.value.financial_info

  if (
    !info.bank_holder_id ||
    !info.account_type_holder_id ||
    !info.bank_account_number_beneficiary ||
    !info.bank_branch_id ||
    !info.bank_status
  ) {
    return
  }

  const bankId = Number(info.bank_holder_id)
  const accountTypeId = info.account_type_holder_id
  const branchId = Number(info.bank_branch_id)
  const statusId = info.bank_status

  const bankLabel = banks.value.find((b) => b.value == bankId)?.label ?? ''
  const typeLabel =
    bank_types.value.find((t) => t.value == accountTypeId)?.label ?? ''
  const branchLabel =
    bank_branches.value.find((b) => b.value == branchId)?.label ?? ''

  const statusLabel =
    default_statuses.find((s) => s.value == statusId)?.label ??
    String(statusId)

  const newRow: IBankAccountRowUI = {
    account_bank: bankLabel,
    account_type: typeLabel,
    account_number: String(info.bank_account_number_beneficiary),
    branch_name: branchLabel,
    status: statusLabel,
    bank_name: bankLabel,
    principal: false,

    bank_id: bankId,
    bank_branch_id: branchId,
    status_id: statusId,
    account_type_id: accountTypeId,
    is_main: false,
    id: undefined
  }

  tableProperties.value.rows.push(newRow)

  syncBankAccountsToModel()

  openModal.value = false

  info.bank_holder_id = null
  info.account_type_holder_id = null
  info.bank_account_number_beneficiary = null
  info.bank_branch_id = null
  info.bank_status = null
}


  const handleOptions = async (option: string, account_number: string) => {
    switch (option) {
      case 'delete':
        alertModalDeleteConfig.value.account_number = account_number
        await alertModalDelete.value.openModal()
        break
    }
  }

 const syncBankAccountsToModel = () => {
  const payload = tableProperties.value.rows.map((row) => ({
    id: row.id,
    bank_id: row.bank_id,
    bank_branch_id: row.bank_branch_id,
    account_type: row.account_type,
    account_number: row.account_number,
    is_main: row.is_main,
    status: typeof row.status === 'string' ? row.status : String(row.status ?? '')
  }))

  models.value.financial_info.bank_accounts =
    payload as unknown as INaturalClientFinanceFormExtended['financial_info']['bank_accounts']
}

  const deleteBankAccount = async (account_number: string) => {
  await alertModalDelete.value?.closeModal()

  tableProperties.value.rows = tableProperties.value.rows.filter(
    (row) => row.account_number !== account_number
  )

  alertModalDeleteConfig.value.account_number = null

  syncBankAccountsToModel()

  const principal = tableProperties.value.rows.find(r => r.is_main)
  principalSelected.value = principal ? principal.account_number : null
}


  const normalizeFundingSourceFromBackend = () => {
    const value =
      models.value.financial_info.legal_people_found_source_id

    if (
      typeof value === 'string' &&
      legal_people_fund_sources.value?.length
    ) {
      const match = legal_people_fund_sources.value.find(
        opt => opt.label === value
      )

      if (match) {
        models.value.financial_info.legal_people_found_source_id = match.value
      }
    }
  }
  
  const normalizeBankAccountTypeFromBackend = () => {
    const value = bankAccountModels.value.account_type_id

    if (
      typeof value === 'string' &&
      bank_types.value?.length
    ) {
      const match = bank_types.value.find(
        opt => opt.label === value
      )

      if (match) {
        bankAccountModels.value.account_type_id = match.value
      }
    }
  }

  const resetBankAccountModal = () => {
  bankAccountModels.value = {
    id: undefined,
    bank_id: null,
    bank_branch_id: null,
    status_id: null,
    account_type_id: null,
    account_number: '',
    is_main: false
  }
  editingRowIndex.value = null
}

const handleOpenCreateModal = () => {
  bankAccountModalMode.value = 'create'
  resetBankAccountModal()
  openBankAccountModal.value = true
}

const handleOpenEditModal = (row: IBankAccountRowUI) => {
  bankAccountModalMode.value = 'edit'
  editingRowIndex.value = tableProperties.value.rows.findIndex(
    r => r.account_number === row.account_number
  )

  bankAccountModels.value = {
    id: row.id,
    bank_id: row.bank_id,
    bank_branch_id: row.bank_branch_id,
    status_id: row.status_id,
    account_type_id: row.account_type,
    account_number: row.account_number,
    is_main: row.is_main
  }

  openBankAccountModal.value = true
}

  const saveBankAccount = () => {
    const m = bankAccountModels.value

    if (
      !m.bank_id ||
      !m.account_type_id ||
      !m.account_number ||
      !m.bank_branch_id ||
      m.status_id === null ||
      m.status_id === undefined ||
      String(m.status_id) === ''
    ) {
      return
    }

    const statusNumber = Number(m.status_id)

    if (m.is_main) {
      tableProperties.value.rows = tableProperties.value.rows.map((r) => ({
        ...r,
        is_main: false,
        principal: false
      }))
    }

    const bankLabel = banks.value.find((b) => b.value == m.bank_id)?.label ?? ''
    const typeLabel = bank_types.value.find((t) => t.value == m.account_type_id)?.label ?? ''
    const branchLabel = bank_branches.value.find((b) => b.value == m.bank_branch_id)?.label ?? ''

    const newRow: IBankAccountRowUI = {
      id: m.id,
      bank_id: m.bank_id,
      bank_branch_id: m.bank_branch_id,
      status_id: statusNumber,
      account_type_id: m.account_type_id,
      is_main: m.is_main,

      account_bank: bankLabel,
      account_type: typeLabel,
      account_number: m.account_number,
      branch_name: branchLabel,
      status: statusNumber,
      bank_name: bankLabel,
      principal: m.is_main
    }

    if (bankAccountModalMode.value === 'create') {
      tableProperties.value.rows.push(newRow)
    } else {
      const idx = editingRowIndex.value
      if (idx !== null && idx >= 0) tableProperties.value.rows.splice(idx, 1, newRow)
    }

    syncBankAccountsToModel()

    principalSelected.value = m.is_main
      ? m.account_number
      : (tableProperties.value.rows.find((r) => r.is_main)?.account_number ?? null)

    openBankAccountModal.value = false
    resetBankAccountModal()
  }

  const addActionsColumn = () => {
    if (['create', 'edit'].includes(props.action)) {
      tableProperties.value.columns.push({
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: () => ''
      })
    }
  }

  onBeforeMount(async () => {
    await getResources(`keys[]=${indirectNaturalPersonKeys.join('&keys[]=')}`)
  })

  onMounted(() => {
    addActionsColumn()
    handlerActionForm(props.action)
  })

  onMounted(() => {
    if (!props.data) return

    Object.assign(models.value, props.data)

    const accounts = props.data.financial_info?.bank_accounts
    if (!accounts?.length) {
      tableProperties.value.rows = []
      principalSelected.value = null
      return
    }

    const mappedAccounts: IBankAccountRowUI[] = accounts.map((acc) => {
      const bankId = acc.bank_id ?? 0
      const branchId = acc.bank_branch_id ?? null
      const accountNumber = acc.account_number ?? ''
      const isMain = !!acc.is_main

      const bankLabel = banks.value.find((b) => b.value == bankId)?.label || ''
      const branchLabel = bank_branches.value.find((b) => b.value == branchId)?.label || ''

      const rawStatus = (acc as unknown as { status: { id: number } }).status

      const statusId: string | number | null =
        rawStatus && typeof rawStatus === 'object' && 'id' in rawStatus
          ? (rawStatus as { id: number }).id
          : (rawStatus ?? null)

      const statusSafe: string | number = statusId ?? ''

      if (isMain) principalSelected.value = accountNumber

      return {
        id: acc.id,
        bank_id: bankId,
        bank_branch_id: branchId,
        status_id: statusId,
        account_type_id: null,
        is_main: isMain,

        // UI
        account_bank: bankLabel,
        account_type: acc.account_type ?? '',
        account_number: accountNumber,
        branch_name: branchLabel,
        status: statusSafe,
        bank_name: bankLabel,
        principal: isMain
      }
    })

    tableProperties.value.rows = mappedAccounts
  })


  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.financial_info,
    (val) => {
      if (isSettingFromProps) return

      emit?.(
        'update:data',
        isEmptyOrZeroOrFalse(val)
          ? null
          : {
              financial_info: { ...val }
            }
      )
    },
    { deep: true }
  )

  watch(
    () => legal_people_fund_sources.value,
    (options) => {
      if (!options?.length) return
      normalizeFundingSourceFromBackend()
    },
    { immediate: true }
  )

  watch(
    () => bank_types.value,
    (options) => {
      if (!options?.length) return
      normalizeBankAccountTypeFromBackend()
    },
    { immediate: true }
  )

  return {
    models,
    formFinance,

    banks,
    bank_types,
    bank_branches,
    legal_people_fund_sources,

    validateAlphanumericMessage,
    formatCurrencyString,
    optionsCalendar,

    handleOpenModal,
    tableProperties,
    openModal,
    addBankAccount,

    goToURL,
    handleOptions,
    alertModalDelete,
    alertModalDeleteConfig,
    deleteBankAccount,

    principalSelected,

    openBankAccountModal,
    bankAccountModalMode,
    bankAccountModels,
    handleOpenCreateModal,
    handleOpenEditModal,
    saveBankAccount,
  }
}

export default useFinanceForm
