// Vue - Pinia
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Quasar
import { QTable } from 'quasar'

// Interfaces
import { IGenericResource } from '@/interfaces/customs/resources/Common'
import {
  IGenerateBallotFormDetail,
  IGenerateBallotSubmit,
  BankSlot,
  NatureOperation,
} from '@/interfaces/customs/investment-portfolio/GenerateBallot'

// Stores
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useGenerateBallotStore } from '@/stores/investment-portfolio/generate-ballot'

import { ActionType } from '@/interfaces/global/Action'

export const useInformationForm = (
  props: { action: ActionType; data?: boolean },
  emit: (event: 'submit', payload: IGenerateBallotSubmit) => void
) => {
  const isModalOpen = ref(false)
  const valueTypePayment = ref()
  const refCodeType = ref('')
  const refDescription = ref('')
  const refDescriptionNit = ref('')
  const refTotalValueNit = ref('')
  const models = ref<IGenerateBallotFormDetail>({
    titleOperation: 0,
    typeOperation: 0,
    ValueOperation: 0,
    titles: [],
    operation_value: 0,
    nitBenefit: '',
  })
  const {
    type_accounts,
    investment_portfolio_benefit,
    investment_portfolio_titles,
    investment_portfolio_operation_types,
    investment_portfolio_payment_methods,
    investment_portfolio_collection_methods,
    investment_portfolio_bank_accounts,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { investment_portfolio_banks } =
    useInvestmentPortfolioResourceStore('v1')
  const { payments_investment, bank_account_investment, type_receive } =
    storeToRefs(useTreasuryResourceStore('v1'))
  const { menu_data, nature_operation } = storeToRefs(
    useGenerateBallotStore('v1')
  )
  const { _getSelectionMenu } = useGenerateBallotStore('v1')
  const { _getResources } = useResourceManagerStore('v1')
  const reference = ref('')

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IGenerateBallotFormDetail[]
    pages: { currentPage: number; lastPage: number; total: number }
    rowsPerPage: number
  }>({
    title: '',
    loading: false,
    columns: [
      {
        name: 'title_number',
        label: 'Número de título',
        field: 'title_number',
        align: 'center',
      },
      {
        name: 'operation_type',
        label: 'Tipo de operación',
        field: 'operation_type',
        align: 'center',
      },
      {
        name: 'operation_value',
        label: 'Valor operación',
        field: 'operation_value',
        align: 'center',
      },
      {
        name: 'beneficiary',
        label: 'Beneficiario',
        field: 'beneficiary',
        align: 'center',
      },
      { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
    ],

    rows: [],
    pages: { currentPage: 1, lastPage: 1, total: 0 },
    rowsPerPage: 10,
  })

  const tablePropsLocal = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IGenerateBallotFormDetail[]
    pages: { currentPage: number; lastPage: number; total: number }
    rowsPerPage: number
  }>({
    title: '',
    loading: false,
    columns: [
      {
        name: 'title_id',
        label: 'Número de título',
        field: 'title_id',
        align: 'center',
        sortable: true,
      },
      {
        name: 'operation_type',
        label: 'Tipo de operación',
        field: 'operation_type',
        align: 'center',
        sortable: true,
      },
      {
        name: 'operation_value',
        label: 'Valor operación',
        field: 'operation_value',
        align: 'center',
        sortable: true,
      },
      {
        name: 'beneficiary',
        label: 'Beneficiario',
        field: 'beneficiary',
        align: 'center',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1, total: 0 },
    rowsPerPage: 10,
  })

  const createDataTables = () => {
    if (nature_operation.value === NatureOperation.INCOME) {
      models.value.titles.push({
        title_id: 0,
        operation_type: '',
        operation_value: 0,
      })
      return
    } else {
      models.value.titles.push({
        title_id: 0,
        operation_type: '',
        origin_currency_value: '',
        origin_currency_operation_value: '',
        local_currency_operation_value: '',
        placement_date: '',
        fulfillment_date: '',
      })
    }
  }
  const page = ref(1)
  const rowsPerPage = ref(10)
  const rowsPerPageOptions = [5, 10, 25, 50, 100]

  const paginatedRows = computed(() => {
    const start = (page.value - 1) * rowsPerPage.value
    const end = start + rowsPerPage.value
    return models.value.titles.slice(start, end).map((item, idx) => ({
      ...item,
      index: start + idx + 1,
      _originalIndex: start + idx,
    }))
  })

  const visibleRows = computed(() => paginatedRows.value)

  const updateTable = () => {
    tableProps.value.rows =
      paginatedRows.value as unknown as IGenerateBallotFormDetail[]
    tablePropsLocal.value.rows =
      paginatedRows.value as unknown as IGenerateBallotFormDetail[]

    const total = models.value.titles.length
    const lastPage = Math.max(1, Math.ceil(total / rowsPerPage.value))
    tableProps.value.pages = { currentPage: page.value, lastPage, total }
    tablePropsLocal.value.pages = { currentPage: page.value, lastPage, total }
  }

  const updatePage = (newPage: number): void => {
    page.value = newPage
    updateTable()
  }

  const updatePerPage = (newRows: number): void => {
    rowsPerPage.value = newRows
    page.value = 1
    updateTable()
  }

  watch(
    () => models.value.titles,
    () => updateTable(),
    { deep: true }
  )

  const addOperationRow = () => {
    if (
      !modalForm.value.title_id ||
      !modalForm.value.operation_type ||
      !modalForm.value.operation_value ||
      !modalForm.value.beneficiary
    )
      return

    const newRow: IGenerateBallotFormDetail = {
      titleOperation: Number(modalForm.value.title_id) || 0,
      typeOperation: Number(valueTypePayment.value) || 0,
      ValueOperation: 0,
      operation_value: 0,
      titles: [
        {
          title_id: Number(modalForm.value.title_id),
          operation_type: String(valueTypePayment.value),
          operation_value: 0,
          beneficiary: '',
          id: 0,
        },
      ],
      nitBenefit: '',
    }

    tableProps.value.rows.push(newRow)
    models.value.titles.push({
      title_id: modalForm.value.title_id,
      operation_type: modalForm.value.operation_type,
      operation_value: modalForm.value.operation_value,
      beneficiary: modalForm.value.beneficiary,
    })

    isModalOpen.value = false
    modalForm.value = {
      title_id: 0,
      operation_type: '',
      operation_value: 0,
      beneficiary: '',
      id: 0,
    }
  }

  const modalForm = ref({
    title_id: 0,
    operation_type: '',
    operation_value: 0,
    beneficiary: '',
    id: 0,
  })

  const isEditing = ref(false)
  const editingIndex = ref<number | null>(null)

  const editItem = async (index: number) => {
    const item = models.value.titles[index]
    if (!item) return

    await preloadModalData()

    isEditing.value = true
    editingIndex.value = index

    modalForm.value = {
      title_id: item.title_id || 0,
      operation_type: item.operation_type || '',
      operation_value: item.operation_value || 0,
      beneficiary: item.beneficiary || '',
      id: item.id || 0,
    }

    const methodList =
      nature_operation.value === NatureOperation.INCOME
        ? investment_portfolio_collection_methods.value
        : investment_portfolio_payment_methods.value

    const matchedMethod = methodList.find(
      (opt) =>
        opt.label === item.operation_type ||
        opt.value === item.operation_type ||
        opt.label === refDescription.value
    )

    valueTypePayment.value = matchedMethod ? matchedMethod.value : null
    refDescription.value = matchedMethod
      ? matchedMethod.label
      : item.operation_type || '-'

    selectedBanks.value = {
      origen: item.bank_origin_id ?? null,
      destino: item.bank_destiny_id ?? null,
      cumplimiento: item.bank_fulfillment_id ?? null,
    }

    selectedAccounts.value = {
      origen: item.account_origin_id ?? null,
      destino: item.account_destiny_id ?? null,
      cumplimiento: item.account_fulfillment_id ?? null,
    }

    isModalOpen.value = true
  }

  const removeItem = (index: number) => {
    if (index >= 0 && index < models.value.titles.length) {
      models.value.titles.splice(index, 1)

      const totalItems = models.value.titles.length
      const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage.value))

      if (page.value > totalPages) {
        page.value = totalPages
      }

      updateTable()
    }
  }

  const isValidBankSlot = (slot: BankSlot) => {
    const bankId = selectedBanks.value[slot]
    const accountId = selectedAccounts.value[slot]
    if (!bankId || !accountId) return false

    const accounts = bankAccountsByBank.value[slot] || []
    return accounts.some((a) => a?.value === accountId)
  }

  const addPaymentMethod = () => {
    if (!modalForm.value.title_id) return
    if (!valueTypePayment.value) return

    const slots: BankSlot[] = [
      BankSlot.ORIGIN,
      BankSlot.DESTINY,
      BankSlot.FULFILLMENT,
    ]

    const allTreasuryOk = slots.every(isValidBankSlot)
    if (!allTreasuryOk) return

    const selectedTitle = investment_portfolio_titles.value.find(
      (t) => t.value === modalForm.value.title_id
    )
    if (!selectedTitle) return

    const selectedPayment =
      typeof valueTypePayment.value === 'object'
        ? valueTypePayment.value
        : (nature_operation.value === NatureOperation.INCOME
            ? investment_portfolio_collection_methods.value
            : investment_portfolio_payment_methods.value
          ).find((opt) => opt.value === valueTypePayment.value)

    const operationLabel =
      selectedPayment?.label ||
      selectedPayment?.description ||
      selectedPayment?.name ||
      String(selectedPayment?.value || valueTypePayment.value)

    const newTitleRow = {
      id: selectedTitle.id ?? 0,
      title_id: Number(selectedTitle.value),
      operation_type:
        nature_operation.value === NatureOperation.INCOME
          ? 'Recaudo'
          : selectedTitle.operation_type_description || operationLabel,
      operation_value: Number(selectedTitle.operation_value) || 0,
      beneficiary: selectedTitle.benefit_id
        ? String(selectedTitle.benefit_id)
        : '-',

      payment_or_collection_method_id:
        typeof valueTypePayment.value === 'object'
          ? valueTypePayment.value.value
          : valueTypePayment.value,
      bank_origin_id: selectedBanks.value.origen,
      bank_destiny_id: selectedBanks.value.destino,
      bank_fulfillment_id: selectedBanks.value.cumplimiento,
      account_origin_id: selectedAccounts.value.origen,
      account_destiny_id: selectedAccounts.value.destino,
      account_fulfillment_id: selectedAccounts.value.cumplimiento,
    }

    if (isEditing.value && editingIndex.value !== null) {
      models.value.titles[editingIndex.value] = {
        ...models.value.titles[editingIndex.value],
        ...newTitleRow,
      }
    } else {
      models.value.titles.push(newTitleRow)
    }

    closeModal()
  }

  const preloadModalData = async () => {
    const payload = {
      instruction_slip_type_id: Number(
        menu_data.value?.instruction_slip_type_id ?? 0
      ),
      investment_portfolio_id: Number(
        menu_data.value?.investment_portfolio_id ?? 0
      ),
      operation_date: menu_data.value?.operation_date ?? '',
      operation_type_id: Number(menu_data.value?.operation_type_id ?? 0),
    }

    const data = await _getSelectionMenu(payload)
    if (!data || !data.titles) return

    investment_portfolio_titles.value = data.titles.map(
      (item: {
        title_id: number
        operation_value: string
        operation_type_id: number
        operation_type_description?: string
        benefit_id: number
        id: number
      }) => ({
        label: `${item.title_id}`,
        value: item.title_id,
        operation_type_id: item.operation_type_id,
        operation_type_description: item.operation_type_description,
        benefit_id: item.benefit_id,
        operation_value: Number(item.operation_value),
        id: item.id,
      })
    )
  }

  const closeModal = () => {
    isModalOpen.value = false
    isEditing.value = false
    editingIndex.value = null

    modalForm.value = {
      title_id: 0,
      operation_type: '',
      operation_value: 0,
      beneficiary: '',
      id: 0,
    }

    valueTypePayment.value = null
    refDescription.value = ''
    selectedBanks.value = { origen: null, destino: null, cumplimiento: null }
    selectedAccounts.value = { origen: null, destino: null, cumplimiento: null }
  }

  const openModal = async () => {
    await preloadModalData()

    if (!isEditing.value) {
      modalForm.value = {
        title_id: 0,
        operation_type: '',
        operation_value: 0,
        beneficiary: '',
        id: 0,
      }

      valueTypePayment.value = null
      refDescription.value = ''

      selectedBanks.value = { origen: null, destino: null, cumplimiento: null }
      selectedAccounts.value = {
        origen: null,
        destino: null,
        cumplimiento: null,
      }

      editingIndex.value = null
    }

    isModalOpen.value = true
  }

  const onSubmit = (): void => {
    emit('submit', {
      ...models.value,
      titles: models.value.titles,
      selectedBanks: selectedBanks.value,
      selectedAccounts: selectedAccounts.value,
      valueTypePayment: valueTypePayment.value,
    } as unknown as IGenerateBallotSubmit)
  }

  const selectedBanks = ref<{ [key: string]: number | null }>({
    origen: null,
    destino: null,
    cumplimiento: null,
  })

  const selectedAccounts = ref<{ [key: string]: number | null }>({
    origen: null,
    destino: null,
    cumplimiento: null,
  })

  const selectedBanksLabels = computed(() => {
    const result: Record<string, string> = {}
    const banks = investment_portfolio_banks

    Object.keys(selectedBanks.value).forEach((key) => {
      const selected = banks.find((b) => b.value === selectedBanks.value[key])
      result[key] = selected?.label || ''
    })

    return result
  })

  const selectedAccountsLabels = computed(() => {
    const result: Record<string, string> = {}

    Object.keys(selectedAccounts.value).forEach((key) => {
      const accounts = bankAccountsByBank.value[key] || []
      const selectedAccount = accounts.find(
        (a) => a.value === selectedAccounts.value[key]
      )
      result[key] = selectedAccount?.label || ''
    })

    return result
  })

  onMounted(async () => {
    await _getResources({
      investment_portfolio: [`investment_portfolio_benefit`],
    })
    if (nature_operation.value === NatureOperation.INCOME) {
      await _getResources({
        investment_portfolio: [
          `investment_portfolio_titles&filter[investment_portfolio_id]=${menu_data?.value?.investment_portfolio_id}&filter[operation_type_id]=${menu_data?.value?.operation_type_id}`,
        ],
      })
    } else if (nature_operation.value === NatureOperation.EXPENSE) {
      await _getResources({
        investment_portfolio: [
          `investment_portfolio_titles_foreign_currency&filter[investment_portfolio_id]=${menu_data?.value?.investment_portfolio_id}&filter[operation_type_id]=${menu_data?.value?.operation_type_id}`,
        ],
      })
    }
  })
  onUnmounted(() => {
    models.value.titles = []
  })

  watch(
    () => valueTypePayment.value,
    (newVal) => {
      if (!newVal) return

      const options =
        nature_operation.value === NatureOperation.INCOME
          ? investment_portfolio_collection_methods.value
          : investment_portfolio_payment_methods.value

      const selected =
        typeof newVal === 'object'
          ? newVal
          : options.find((opt) => opt.value === newVal)

      if (!selected) return

      valueTypePayment.value = selected

      const cleanDescription =
        selected.description?.replace(/^\d+\s*-\s*/, '')?.trim() ||
        selected.label ||
        '-'

      refDescription.value = cleanDescription
    }
  )

  watch(
    () => props.data,
    () => {
      reference.value = props.data ? 'Editar' : 'Crear'
    }
  )
  const bankAccountsByBank = ref<Record<string, IGenericResource[]>>({})

  watch(
    () => valueTypePayment.value,
    (newVal) => {
      if (!newVal) return
      const hasValidMethods =
        (nature_operation.value === NatureOperation.INCOME &&
          investment_portfolio_collection_methods.value.length > 0) ||
        (nature_operation.value === NatureOperation.EXPENSE &&
          investment_portfolio_payment_methods.value.length > 0)

      if (hasValidMethods) {
        const selectedPayment = payments_investment.value.find(
          (payment) => payment.value === newVal
        )

        if (selectedPayment) {
          refCodeType.value = selectedPayment.code || ''
          refDescription.value = selectedPayment.description || ''
        }
      }
    }
  )

  watch(
    () => models.value.nitBenefit,
    (newVal) => {
      if (!newVal) return
      refDescriptionNit.value =
        investment_portfolio_benefit.value.find((item) => item.value === newVal)
          ?.label || ''
      refTotalValueNit.value =
        models.value.titles.length > 0
          ? models.value.titles[
              models.value.titles.length - 1
            ].operation_value?.toString() || ''
          : ''
    },
    { deep: true }
  )

  watch(
    () => ({ ...selectedBanks.value }),
    async (curr, prev) => {
      const keys: Array<keyof typeof selectedBanks.value> = [
        'origen',
        'destino',
        'cumplimiento',
      ]

      for (const k of keys) {
        const newValue = curr[k]
        const oldValue = prev?.[k]

        if (newValue && newValue !== oldValue) {
          bankAccountsByBank.value[k] = []

          await _getResources({
            investment_portfolio: [
              `investment_portfolio_bank_accounts&investment_portfolio_id=${menu_data.value?.investment_portfolio_id}&bank_id=${newValue}`,
            ],
          })
          if (
            Array.isArray(investment_portfolio_bank_accounts.value) &&
            investment_portfolio_bank_accounts.value.length > 0
          ) {
            bankAccountsByBank.value[k] =
              investment_portfolio_bank_accounts.value.map((item) => ({
                ...item,
                label: `${item.account_number} - ${item.account_name}`,
                value: item.id,
              }))
          }
        }
      }
    },
    { deep: true }
  )

  return {
    tableProps,
    preloadModalData,
    createDataTables,
    onSubmit,
    closeModal,
    selectedAccounts,
    selectedAccountsLabels,
    selectedBanksLabels,
    selectedBanks,
    bank_account_investment,
    isModalOpen,
    models,
    rowsPerPageOptions,
    page,
    rowsPerPage,
    visibleRows,
    updatePage,
    updatePerPage,
    removeItem,
    editItem,
    modalForm,
    addOperationRow,
    refDescription,
    openModal,
    addPaymentMethod,
    tablePropsLocal,
    type_accounts,
    investment_portfolio_benefit,
    investment_portfolio_banks,
    payments_investment,
    investment_portfolio_titles,
    bankAccountsByBank,
    valueTypePayment,
    investment_portfolio_operation_types,
    refDescriptionNit,
    refTotalValueNit,
    nature_operation,
    type_receive,
    investment_portfolio_collection_methods,
    investment_portfolio_payment_methods,
  }
}
