// Vue - Pinia - Quasar
import { computed, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IInvestmentPlanOperationResponseDetailItem } from '@/interfaces/customs/fics/InvestmentPlanOperationCompliance'
import { IWithdrawalOperationDetailModel } from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useInvestmentPlanOperationComplianceStore } from '@/stores/fics/investment-plan-operation-compliance'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useWithdrawalOperationDetailForm = (props: {
  data?: IInvestmentPlanOperationResponseDetailItem[]
  subtype: string | undefined
}) => {
  const { banks, bank_account, third_parties, bank_accounts_fics } =
    storeToRefs(useTreasuryResourceStore('v1'))

  const { _setSelectedFundWithdrawal } =
    useInvestmentPlanOperationComplianceStore('v1')

  const { formatCurrencyString, styleColumn } = useUtils()

  const tableProps = ref({
    title: 'Listado de operaciones',
    loading: false,
    columns: [
      {
        name: 'radio',
        required: false,
        label: '',
        align: 'left',
        field: 'id',
        sortable: true,
        style: styleColumn(50),
      },
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
        style: styleColumn(50),
      },
      {
        name: 'collection_type',
        required: true,
        label: 'Forma de pago*',
        align: 'left',
        field: (row: IWithdrawalOperationDetailModel) =>
          `${row.means_of_payment_id}`,
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción forma de pago*',
        align: 'left',
        field: (row: IWithdrawalOperationDetailModel) =>
          `${row.means_of_payment_description}`,
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor*',
        align: 'left',
        field: (row: IWithdrawalOperationDetailModel) =>
          formatCurrencyString(row.value),
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'is_registered',
        required: true,
        label: 'Inscrita',
        align: 'left',
        field: (row: IWithdrawalOperationDetailModel) =>
          `${row.is_registered ? 'Si' : 'No'}`,
        sortable: true,
        style: styleColumn(50),
      },
      {
        name: 'account',
        required: true,
        label: 'Cuenta',
        align: 'left',
        field: (row: IWithdrawalOperationDetailModel) => `${row.check_bank_id}`,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IWithdrawalOperationDetailModel[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const details = ref<IWithdrawalOperationDetailModel[]>([])

  const selectedRow = ref()

  const selectedRowInfoExtra = ref<{
    type_account: string | null
    initial_balance: number | null
  }>({
    type_account: '',
    initial_balance: 0,
  })

  const modalAccountInfo = ref<{
    type_account: string
    account_number: string
    bank_code: string
    responsible_owner_document: string | null
    responsible_owner_name: string | null
  }>({
    type_account: '',
    account_number: '',
    bank_code: '',
    responsible_owner_document: '',
    responsible_owner_name: '',
  })

  const selectDetail = async (selected: IWithdrawalOperationDetailModel) => {
    tableProps.value.rows.forEach((row) => {
      row.selected = false
      if (row === selected) {
        row.selected = true
      }
    })
    selectedRow.value = selected
    _setSelectedFundWithdrawal(selected)
    if (selected.treasury_collection_bank_id) {
      await selectBank(selected.treasury_collection_bank_id)
    }

    if (selected.fic_account_bank_id) {
      selectBankAccount(selected.fic_account_bank_id)
    }

    if (selected.bank_or_fund_id) {
      await _getResources(
        { treasury: ['bank_accounts_fics'] },
        `account_id=${selected.bank_or_fund_id}`,
        'v2'
      )
      if (bank_accounts_fics.value.length > 0) {
        const bank_account = JSON.parse(
          JSON.stringify(bank_accounts_fics.value[0])
        )
        selectedRowInfoExtra.value.type_account =
          bank_account?.account_type ?? ''
        selectedRowInfoExtra.value.initial_balance = 0
        if (bank_account.balances && bank_account.balances.length > 0) {
          selectedRowInfoExtra.value.initial_balance =
            bank_account.balances[0].final_balance_local
        }
      }
    }
  }

  const totalValue = computed(() =>
    tableProps.value.rows.reduce(
      (accumulator: number, item: IWithdrawalOperationDetailModel) => {
        return !isNaN(Number(item.value))
          ? accumulator + Number(item.value)
          : accumulator
      },
      0
    )
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const selectBank = async (bankId: number) => {
    const selectedItem = banks.value.find((item) => item.value === bankId)
    if (!selectedItem) return
    selectedRow.value.treasury_collection_bank_description =
      selectedItem.description
    selectedRow.value.treasury_collection_bank_id = bankId

    await _getResources({ treasury: ['bank_account'] }, `bank_id=${bankId}`)
  }

  const selectBankAccount = (bankAccountId: number) => {
    const selectedItem = bank_account.value.find(
      (item) => item.value === bankAccountId
    )
    if (!selectedItem) return
    selectedRow.value.fic_account_bank_description = selectedItem.name
    selectedRow.value.fic_account_bank_id = bankAccountId
  }

  const accountModalRef = ref()

  const openAccountModal = async (
    detailRow: IWithdrawalOperationDetailModel
  ) => {
    if (!detailRow.bank_or_fund_id) return
    await _getResources(
      { treasury: ['bank_accounts_fics'] },
      `account_id=${detailRow.bank_or_fund_id}`,
      'v2'
    )

    const bank_account = JSON.parse(JSON.stringify(bank_accounts_fics.value[0]))
    modalAccountInfo.value.type_account = bank_account?.account_type ?? ''
    modalAccountInfo.value.account_number = bank_account?.account_number ?? ''
    modalAccountInfo.value.bank_code = bank_account?.bank?.bank_code ?? ''

    modalAccountInfo.value.responsible_owner_document = ''
    modalAccountInfo.value.responsible_owner_name = ''
    if (bank_account.responsible_owner_id) {
      await _getResources(
        { treasury: ['third_parties'] },
        `filter[id]=${detailRow.bank_or_fund_id}`,
        'v2'
      )

      const owner_info =
        third_parties.value && third_parties.value.length > 0
          ? third_parties.value[0]
          : null

      if (owner_info) {
        modalAccountInfo.value.responsible_owner_document =
          owner_info.document ?? ''
        modalAccountInfo.value.responsible_owner_name = owner_info.name ?? ''
      }
    }

    accountModalRef.value?.openModal()
  }

  const operationDetailForm = ref()

  const validateInvestmentPlanOperation = () => {
    return operationDetailForm.value?.validate()
  }

  const getFormData = () => {
    return selectedRow.value
  }

  const setFormData = () => {
    if (props.data) {
      if (props.data.length > 0) {
        props.data.forEach((detail) => {
          details.value.push({
            id: detail.id,
            means_of_payment_id: detail.treasury_collection_form_id,
            means_of_payment_description: detail.collection_form,
            has_registered_accounts: false,
            adjustment: false,
            bank_or_fund_id: detail.account_bank_id,
            value: detail.value,
            disabled: false,
            treasury_collection_bank_id: detail.collection_bank_id,
            treasury_collection_bank_description: detail.collection_bank,
            fic_account_bank_id: detail.fic_account_bank_id,
            fic_account_bank_description: detail.fic_account,
            observations: detail.observation,
            selected: false,
            is_registered: detail.account_bank_id ? true : false,
            check_bank_id: detail.check,

            destination_account_number: null,
            destination_plan_id: null,
          })
        })
      }
    }

    tableProps.value.rows = details.value
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        setFormData()
      }
    },
    {
      immediate: true,
    }
  )

  onUnmounted(() =>
    _resetKeys({ treasury: ['third_parties', 'bank_accounts_fics'] })
  )

  return {
    banks,
    tableProps,
    totalValue,
    selectedRow,
    bank_account,
    accountModalRef,
    operationDetailForm,
    selectedRowInfoExtra,
    modalAccountInfo,
    selectBank,
    getFormData,
    selectDetail,
    openAccountModal,
    selectBankAccount,
    validateInvestmentPlanOperation,
  }
}

export default useWithdrawalOperationDetailForm
