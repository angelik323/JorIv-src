// Vue - Pinia - Quasar
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IContributionOperationDetailModel } from '@/interfaces/customs/fics/InvestmentPlanOperations'
import { IInvestmentPlanOperationResponseDetailItem } from '@/interfaces/customs/fics/InvestmentPlanOperationCompliance'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useInvestmentPlanOperationComplianceStore } from '@/stores/fics/investment-plan-operation-compliance'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useContributionOperationDetailForm = (props: {
  data?: IInvestmentPlanOperationResponseDetailItem[]
}) => {
  const { banks, bank_account } = storeToRefs(useTreasuryResourceStore('v1'))

  const { formatCurrencyString, styleColumn } = useUtils()

  const { _setSelectedFund } = useInvestmentPlanOperationComplianceStore('v1')

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
        label: 'Forma de recaudo*',
        align: 'left',
        field: (row: IContributionOperationDetailModel) =>
          `${row.collection_type_code ?? 'No registra'}`,
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción forma de recaudo*',
        align: 'left',
        field: (row: IContributionOperationDetailModel) =>
          `${row.collection_type_description ?? 'No registra'}`,
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor*',
        align: 'left',
        field: (row: IContributionOperationDetailModel) =>
          formatCurrencyString(row.value),
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'check',
        required: true,
        label: 'Cheque',
        align: 'left',
        field: (row: IContributionOperationDetailModel) =>
          `${row.check ?? 'No registra'}`,
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'check_bank',
        required: true,
        label: 'Banco cheque',
        align: 'left',
        field: (row: IContributionOperationDetailModel) =>
          `${row.check_bank_description ?? 'No registra'}`,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IContributionOperationDetailModel[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const details = ref<IContributionOperationDetailModel[]>([])

  const selectedRow = ref()

  const selectDetail = async (selected: IContributionOperationDetailModel) => {
    tableProps.value.rows.forEach((row) => {
      row.selected = false
      if (row === selected) {
        row.selected = true
      }
    })
    selectedRow.value = selected
    _setSelectedFund(selected)
    if (selected.treasury_collection_bank_id) {
      await selectBank(selected.treasury_collection_bank_id)
    }

    if (selected.fic_account_bank_id) {
      selectBankAccount(selected.fic_account_bank_id)
    }
  }

  const totalValue = computed(() =>
    tableProps.value.rows.reduce(
      (accumulator: number, item: IContributionOperationDetailModel) => {
        return !isNaN(Number(item.value))
          ? accumulator + Number(item.value)
          : accumulator
      },
      0
    )
  )

  const { _getResources } = useResourceManagerStore('v1')

  const selectBank = async (bankId: number) => {
    const selectedItem = banks.value.find((item) => item.value === bankId)
    if (!selectedItem) return
    selectedRow.value.treasury_collection_bank_description =
      selectedItem.description
    selectedRow.value.treasury_collection_bank_id = bankId

    await _getResources(
      { treasury: ['bank_account'] },
      `filter[bank_id]=${bankId}`
    )
  }

  const selectBankAccount = (bankAccountId: number) => {
    const selectedItem = bank_account.value.find(
      (item) => item.value === bankAccountId
    )
    if (!selectedItem) return
    selectedRow.value.fic_account_bank_description = selectedItem.name
    selectedRow.value.fic_account_bank_id = bankAccountId
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
            collection_type_id: detail.treasury_collection_form_id,
            collection_type_code: detail.collection_form_code,
            collection_type_description: detail.collection_form,
            is_check: false,
            value: detail.value,
            check: detail.check,
            check_bank_id: null,
            check_bank_description: detail.check_bank,
            disabled: false,
            treasury_collection_bank_id: detail.collection_bank_id,
            treasury_collection_bank_description: detail.collection_bank,
            fic_account_bank_id: detail.fic_account_bank_id,
            fic_account_bank_description: detail.fic_account,
            observations: detail.observation,
            selected: false,
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

  return {
    tableProps,
    operationDetailForm,
    selectedRow,
    banks,
    bank_account,
    totalValue,
    getFormData,
    selectDetail,
    selectBank,
    selectBankAccount,
    validateInvestmentPlanOperation,
  }
}

export default useContributionOperationDetailForm
