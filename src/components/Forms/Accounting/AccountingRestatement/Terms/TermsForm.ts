import { IOperatingAccountList } from '@/interfaces/customs'
import {
  useAccountingResourceStore,
  useAccountingRestatementStore,
  useResourceManagerStore,
  useResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const useTermsForm = () => {
  const {
    account_structures_with_purpose,
    receipt_types_by_structure,
    sub_receipt_types_by_type,
    cost_structures_by_chart_account,
    accounting_third_parties_with_document,
    movement_types_by_ids,
    cost_center_codes_by_structure,
  } = storeToRefs(useResourceStore('v1'))

  const {
    _setStatementValidate,
    _setPrePayload,
    executeValidateRestatement,
    _createRestatement,
    _getOperatingAccounts,
    _getAccountingInformationTable,
  } = useAccountingRestatementStore('v1')
  const {
    operating_accounts,
    prePayload_data,
    flagChargeInformation,
    accounting_restatement_pending,
  } = storeToRefs(useAccountingRestatementStore('v1'))
  const router = useRouter()
  const { business_trusts_by_date_range } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { _getResourcesFics, _getAccountingResources } = useResourceStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  const keys = [
    'accounting_third_parties_with_document',
    'cost_structures_by_chart_account',
    'filter[account_chart_id]',
  ]
  const subKeys = ['movement_types_by_ids']
  const keyReexpresionMoney = ['cost_center_codes_by_structure']
  const changeStateProcess = ref(false)

  const models = ref<{
    cost_structure_by_chart_id: string | number
    const_center_id: string | number
    aux_type_id: string | number
    found_cost_id: string | number
    income_fund_tpmv?: number | null
    expense_fund_tpmv?: number | null
    date_from?: string
    date_to?: string
    from_business_id?: number
    to_business_id?: number
  }>({
    cost_structure_by_chart_id: 0,
    const_center_id: 0,
    aux_type_id: 0,
    found_cost_id: 0,
    income_fund_tpmv: null,
    expense_fund_tpmv: null,
  })

  const center_cost_submenu = ref([{}])
  const movement_types = ref([{}])

  const showModal = ref(false)
  const changeViewCreate = ref(false)
  const thirdMenu = ref([{}])
  const selectedAccountId = ref<number | null>(null)

  const openModal = async (accountId: number) => {
    selectedAccountId.value = accountId
    showModal.value = true
    await _getAccountingResources(
      `keys[]=${keys.join('&keys[]=')}&filter[account_chart_id]=${accountId}`
    )
    await _getResourcesFics(
      `keys[]=${subKeys.join('&keys[]=')}&filter[id]=14,15`
    )

    thirdMenu.value = accounting_third_parties_with_document.value
    movement_types.value = movement_types_by_ids.value
  }

  const handleCloseModal = () => {
    showModal.value = false
    changeViewCreate.value = false
    changeStateProcess.value = false
    selectedAccountId.value = null
    _setStatementValidate({
      terms: false,
      execute: true,
      processInformation: true,
    })
  }

  const changeReferenceStatus = () => {
    _setStatementValidate({
      terms: true,
      execute: false,
      processInformation: true,
    })
    handleClear()
    showModal.value = false
    changeViewCreate.value = true
    savePrePayload()
  }

  const setChangeStateProcess = () => {
    _setStatementValidate({
      terms: true,
      execute: true,
      processInformation: false,
    })
    handleClear()
    changeViewCreate.value = false
    changeStateProcess.value = true
  }

  const selectedStructureId = ref<number | null>(null)
  const selectedReceipt = ref<number | undefined>(undefined)
  const selectedSubReceiptType = ref<number | undefined>(undefined)

  const menuDifference = ref([
    {
      label: 'Diferencia positiva',
      value: 'Positiva',
    },
    {
      label: 'Diferencia negativa',
      value: 'Negativa',
    },
    {
      label: 'Ambas',
      value: 'Ambas',
    },
  ])

  const selectedDifference = ref(menuDifference.value[0].value)
  const menuReferenceWatch = ref(
    menuDifference.value.filter(
      (item) =>
        item.value === selectedDifference.value ||
        selectedDifference.value === 'Ambas'
    )
  )

  const columnsOperatingAccounts = [
    {
      name: 'id',
      label: '#',
      field: 'id',
      sortable: true,
      align: 'left' as const,
      required: true,
    },
    {
      name: 'code',
      label: 'Cuenta',
      field: 'code',
      sortable: true,
      align: 'left' as const,
      required: true,
    },
    {
      name: 'name',
      label: 'Nombre de la cuenta',
      field: 'name',
      sortable: true,
      align: 'left' as const,
      required: true,
    },
    {
      name: 'type',
      label: 'Tipo',
      field: 'type',
      sortable: true,
      align: 'left' as const,
      required: true,
    },
    {
      name: 'nature',
      label: 'Naturaleza',
      field: 'nature',
      sortable: true,
      align: 'left' as const,
      required: true,
    },
    {
      name: 'has_cost_center',
      label: 'Centro de costo',
      field: (row: IOperatingAccountList) =>
        row.has_cost_center ? 'Sí' : 'No',
      sortable: true,
      align: 'left' as const,
      required: true,
    },
    {
      name: 'is_currency_reexpressed',
      label: 'Reexpresa moneda',
      field: (row: IOperatingAccountList) =>
        row.is_currency_reexpressed ? 'Sí' : 'No',
      sortable: true,
      align: 'left' as const,
      required: true,
    },
    {
      name: 'status',
      label: 'Estado',
      field: (row: IOperatingAccountList) => row.status?.status ?? '',
      sortable: true,
      align: 'left' as const,
      required: true,
    },
    {
      name: 'actions',
      label: 'Acciones',
      field: 'actions',
      sortable: false,
      align: 'center' as const,
      required: true,
      classes: 'text-center',
      style: 'width: 150px;',
    },
  ]

  const operatingAccountsTableProps = ref({
    title: 'Listado de cuentas operativas',
    loading: false,
    columns: columnsOperatingAccounts,
    rows: operating_accounts.value,
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const columnsProcessPending = [
    {
      name: 'code',
      label: 'Código del negocio',
      field: 'code',
      sortable: true,
      align: 'left' as const,
      required: true,
    },
    {
      name: 'name',
      label: 'Nombre del negocio',
      field: 'name',
      sortable: true,
      align: 'left' as const,
      required: true,
    },
    {
      name: 'detail',
      label: 'Detalle',
      field: 'detail',
      sortable: true,
      align: 'left' as const,
      required: true,
    },
  ]
  const processPendingTable = ref({
    title: 'Informe de procesos pendientes',
    loading: false,
    columns: columnsProcessPending,
    rows: accounting_restatement_pending.value,
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const handleClear = () => {
    selectedStructureId.value = null
    selectedReceipt.value = undefined
    selectedSubReceiptType.value = undefined
    receipt_types_by_structure.value = []
    sub_receipt_types_by_type.value = []
    operatingAccountsTableProps.value.rows = []
  }

  const selectStructure = async (structureId: number) => {
    selectedReceipt.value = undefined
    selectedSubReceiptType.value = undefined
    receipt_types_by_structure.value = []
    sub_receipt_types_by_type.value = []

    if (structureId) {
      await _getOperatingAccounts(
        structureId,
        selectedReceipt.value,
        selectedSubReceiptType.value
      )

      await _getAccountingResources(
        `keys[]=receipt_types_by_structure&filter[structure_id]=${structureId}`
      )
    }

    selectedStructureId.value = structureId
  }

  const getPrePayload = () => ({
    difference: selectedDifference.value,
    account_id: selectedAccountId.value !== null ? selectedAccountId.value : '',
    cost_center_structure_id: models.value.cost_structure_by_chart_id,
    cost_center_id: models.value.const_center_id,
    third_party_id: models.value.aux_type_id,
    income_fund_tpmv: models.value.income_fund_tpmv,
  })

  const savePrePayload = () => {
    const prePayload = getPrePayload()
    _setPrePayload(prePayload)
  }

  const afterStateView = () => {
    _setStatementValidate({
      terms: true,
      execute: false,
      processInformation: true,
    })
    handleClear()
    changeViewCreate.value = true
  }

  const onSubmitPayload = async () => {
    const payload = {
      ...prePayload_data.value,
      expense_fund_tpmv: models.value.expense_fund_tpmv ?? null,
      difference: selectedDifference.value,
      date_from: models.value.date_from,
      date_to: models.value.date_to,
      from_business_id: models.value.from_business_id,
      to_business_id: models.value.to_business_id,
    }
    if (await executeValidateRestatement(payload)) {
      setTimeout(() => {
        router.push({
          name: 'AccountingRestatementList',
        })
      }, 5000)
      const payloadCreate = [payload]
      _getAccountingInformationTable()
      return await _createRestatement(payloadCreate)
    }

    setChangeStateProcess()
  }

  const selectReceipt = async (receiptId: number | undefined) => {
    selectedReceipt.value = receiptId
    if (selectedStructureId.value) {
      await _getOperatingAccounts(
        selectedStructureId.value,
        receiptId,
        selectedSubReceiptType.value
      )
      sub_receipt_types_by_type.value = []
      await _getAccountingResources(
        `keys[]=sub_receipt_types_by_type&filter[receipt_type_id]=${receiptId}`
      )
    }
  }

  const selectSubReceiptType = async (subReceiptTypeId: number | undefined) => {
    selectedSubReceiptType.value = subReceiptTypeId
    if (selectedStructureId.value) {
      await _getOperatingAccounts(
        selectedStructureId.value,
        selectedReceipt.value,
        subReceiptTypeId
      )
    }
  }

  const setOperativeAccountListValues = (val: IOperatingAccountList[]) => {
    if (!val || !Array.isArray(val)) {
      operatingAccountsTableProps.value.rows = []
      return
    }
    operatingAccountsTableProps.value.rows = val
  }

  onMounted(async () => {
    operatingAccountsTableProps.value.rows = []
  })

  watch(selectedDifference, (newValue) => {
    menuReferenceWatch.value = menuDifference.value.filter(
      (item) => item.value === newValue || newValue === 'Ambas'
    )
  })

  watch(
    () => menuDifference.value,
    (newValue) => {
      menuReferenceWatch.value = newValue
    }
  )

  watch(
    () => operating_accounts.value,
    (newValue) => {
      if (newValue) {
        setOperativeAccountListValues(newValue)
      }
    }
  )

  watch(
    () => models.value.cost_structure_by_chart_id,

    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        _getAccountingResources(
          `keys[]=${keyReexpresionMoney.join(
            '&keys[]='
          )}&filter[account_structures_id]=${newValue}`
        )
      }
    }
  )

  watch(
    () => selectedStructureId.value,
    (newValue) => {
      if (!newValue || flagChargeInformation.value) {
        setOperativeAccountListValues([])
      }
    }
  )

  watch(
    () => models.value.date_to,
    async () => {
      await _getResources({
        accounting: [
          `business_trusts_by_date_range&filter[from_date]=${models.value.date_from}&filter[to_date]=${models.value.date_to}`,
        ],
      })
    }
  )

  watch(
    () => accounting_restatement_pending.value,
    (newValue) => {
      if (newValue) {
        processPendingTable.value.rows = newValue
      }
    }
  )

  return {
    account_structures_with_purpose,
    receipt_types_by_structure,
    operatingAccountsTableProps,
    sub_receipt_types_by_type,
    selectedReceipt,
    selectedSubReceiptType,
    menuReferenceWatch,
    menuDifference,
    selectedDifference,
    showModal,
    changeViewCreate,
    changeStateProcess,
    processPendingTable,
    models,
    thirdMenu,
    center_cost_submenu,
    selectedAccountId,
    cost_structures_by_chart_account,
    movement_types,
    cost_center_codes_by_structure,
    operating_accounts,
    openModal,
    setChangeStateProcess,
    afterStateView,
    selectStructure,
    selectReceipt,
    selectSubReceiptType,
    changeReferenceStatus,
    onSubmitPayload,
    handleCloseModal,
    business_trusts_by_date_range,
  }
}
export default useTermsForm
