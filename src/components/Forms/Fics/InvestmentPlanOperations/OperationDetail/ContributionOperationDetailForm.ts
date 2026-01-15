// Vue - Pinia - Quasar
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import {
  IContributionOperationModel,
  IContributionOperationDetailModel,
} from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Stores
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useContributionOperationDetailForm = (props: {
  fundId: number | null
}) => {
  const { type_receive_with_name: type_receive } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const {
    banks_collective_investment_funds: banks,
    fic_bank_accounts_operations,
  } = storeToRefs(useFicResourceStore('v1'))

  const selectedRowToDelete = ref<IContributionOperationDetailModel | null>(
    null
  )
  const deleteModalRef = ref()

  const flatBankAccounts = computed(() => {
    return fic_bank_accounts_operations.value.flatMap((item) => {
      if (!Array.isArray(item.bank_account)) return []
      return item.bank_account
    })
  })

  const styleColumn = (width: number = 200) => ({
    'white-space': 'nowrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'text-overflow': 'ellipsis',
  })

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
          `${row.collection_type_id}`,
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción forma de recaudo*',
        align: 'left',
        field: (row: IContributionOperationDetailModel) =>
          `${row.collection_type_description}`,
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor*',
        align: 'left',
        field: (row: IContributionOperationDetailModel) => `${row.value}`,
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'check',
        required: true,
        label: 'Cheque',
        align: 'left',
        field: (row: IContributionOperationDetailModel) => `${row.check}`,
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'check_bank_id',
        required: true,
        label: 'Banco cheque',
        align: 'left',
        field: (row: IContributionOperationDetailModel) =>
          `${row.check_bank_id}`,
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
    rows: [] as IContributionOperationDetailModel[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const details = ref<IContributionOperationDetailModel[]>([])
  const models = ref<IContributionOperationModel>({
    treasury_collection_bank_id: null,
    treasury_collection_bank_description: '',
    account_bank_id: null,
    account_bank_description: '',
    observations: '',
  })

  const incremental = ref(1)

  const addDetail = () => {
    details.value.push({
      id: incremental.value,
      collection_type_id: null,
      collection_type_description: '',
      is_check: false,
      value: null,
      check: null,
      check_bank_id: null,
      disabled: false,
      treasury_collection_bank_id: null,
      treasury_collection_bank_description: null,
      fic_account_bank_id: null,
      fic_account_bank_description: null,
      account_bank_id: null,
      account_bank_description: null,
      observations: '',
      selected: false,
    })
    incremental.value += 1
    tableProps.value.rows = details.value
  }

  const removeDetail = () => {
    const detailRow = selectedRowToDelete.value
    if (!detailRow) return

    const index = details.value.indexOf(detailRow)
    if (detailRow === selectedRow.value) {
      selectedRow.value = null
    }
    if (index > -1) {
      details.value.splice(index, 1)
    }
    tableProps.value.rows = details.value

    selectedRowToDelete.value = null
    deleteModalRef.value?.closeModal()
  }

  const selectedRow = ref()

  const selectDetail = (selected: IContributionOperationDetailModel) => {
    tableProps.value.rows.forEach((row) => {
      row.selected = false
      if (row === selected) {
        row.selected = true
      }
    })
    selectedRow.value = selected
  }

  const selectCollectionType = (
    row: IContributionOperationDetailModel,
    collectionTypeId: number
  ) => {
    const selectedItem = type_receive.value.find(
      (item) => item.id === collectionTypeId
    )
    if (!selectedItem) return
    row.collection_type_id = collectionTypeId
    row.collection_type_description = String(selectedItem.description)
    row.is_check = selectedItem.type_receive === 'Cheque'
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
    models.value.account_bank_id = null
    models.value.account_bank_description = ''
    models.value.treasury_collection_bank_description = ''

    if (!bankId) {
      models.value.treasury_collection_bank_id = null
      return
    }

    const selectedItem = banks.value.find((item) => item.value === bankId)
    if (!selectedItem) return

    models.value.treasury_collection_bank_id = bankId ? Number(bankId) : null
    models.value.treasury_collection_bank_description =
      selectedItem.description ?? ''

    await _getResources(
      { fics: ['fic_bank_accounts_operations'] },
      `filter[bank_id]=${bankId}&filter[fund_id]=${props.fundId}`
    )
  }

  const selectBankAccount = (bankAccountId: number) => {
    const selectedItem = flatBankAccounts.value.find(
      (account) => account.value === bankAccountId
    )
    if (!selectedItem) return

    models.value.account_bank_id = bankAccountId
    models.value.account_bank_description = selectedItem.account_name ?? '-'
  }

  const operationDetailForm = ref()

  const getFormData = () => {
    return details.value.map(
      ({
        treasury_collection_bank_id,
        treasury_collection_bank_description,
        account_bank_id,
        account_bank_description,
        observations,
        ...detail
      }) =>
        ({
          ...detail,
          type: 'aporte',
          treasury_collection_bank_id: models.value.treasury_collection_bank_id,
          treasury_collection_bank_description:
            models.value.treasury_collection_bank_description,
          account_bank_id: models.value.account_bank_id,
          account_bank_description: models.value.account_bank_description,
          observations: models.value.observations,
        } as IContributionOperationDetailModel & { type: 'aporte' })
    )
  }

  const openDeleteModal = (row: IContributionOperationDetailModel) => {
    selectedRowToDelete.value = row
    deleteModalRef.value?.openModal()
  }

  return {
    banks,
    models,
    addDetail,
    selectBank,
    tableProps,
    totalValue,
    getFormData,
    selectedRow,
    type_receive,
    removeDetail,
    selectDetail,
    flatBankAccounts,
    deleteModalRef,
    openDeleteModal,
    selectBankAccount,
    operationDetailForm,
    selectCollectionType,
  }
}

export default useContributionOperationDetailForm
