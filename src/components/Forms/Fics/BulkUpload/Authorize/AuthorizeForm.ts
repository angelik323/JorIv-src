// Vue - Pinia - Quasar
import { ref, reactive, onMounted, watch, onBeforeMount, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { ExtendedActionTypeAuth } from '@/interfaces/global'
import {
  IBulkUploadBasicData,
  IBulkUploadValidatedOperationsList,
} from '@/interfaces/customs/fics/BulkUpload'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBulkUploadFicsStore } from '@/stores/fics/bulk-upload'

export const useAuthorizeForm = (
  bulkUploadId: string,
  action: ExtendedActionTypeAuth
) => {
  const { openMainLoader } = useMainLoader()
  const {
    _getApiAuthorizedDataBasicBulkUpload,
    _getApiAuthorizedValidateOperationBulkUpload,
    _getApiFundLimitOperationsBulkUpload,
    _downloadDetailBulkUpload,
    _clearData,
  } = useBulkUploadFicsStore('v1')

  const { formatCurrencyString, defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { banks } = storeToRefs(useTreasuryResourceStore('v1'))

  const { fic_bank_accounts_operations } = storeToRefs(
    useFicResourceStore('v1')
  )

  const keys = {
    treasury: ['banks'],
    fics: ['fic_bank_accounts_operations'],
  }

  const selectedRows = ref<IBulkUploadValidatedOperationsList[]>([])
  const selectedFundLimitRows = ref<IBulkUploadValidatedOperationsList[]>([])

  const {
    data_authorized_data_basic_list,
    data_authorized_data_validate_operation_list,
    data_authorized_data_validate_operation_pages,
    data_fund_limit_operations_list,
    data_fund_limit_operations_pages,
  } = storeToRefs(useBulkUploadFicsStore('v1'))

  const models = reactive({
    bank_id: null as number | null,
    bank_code: null as string | null,
    bank_description: '',
    account_id: null as number | null,
    account_code: null as string | null,
    account_description: '',
    account_balance: '',
  })

  const flatBankAccounts = computed(() => {
    return fic_bank_accounts_operations.value.flatMap((item) => {
      if (!Array.isArray(item.bank_account)) return []
      return item.bank_account
    })
  })

  const filteredBankAccounts = computed(() => {
    if (!models.bank_id) return []

    return flatBankAccounts.value.filter(
      (account) => account.bank_id === models.bank_id
    )
  })

  const basicData = reactive<IBulkUploadBasicData>({
    id: 0,
    code: 0,
    operation: '',
    operation_description: '',
    template: {
      id: 0,
      description: '',
      operation: '',
    },
    fund: {
      id: 0,
      fund_code: '',
      fund_name: '',
      fund_type_id: 0,
      business_trust: {
        id: 0,
        business_code: '',
        name: '',
      },
      fic_rating: '',
      status_id: 0,
      has_participation_types: false,
      is_fund_validated: false,
      last_closing_date: null,
    },
    office: {
      id: 0,
      office_code: '',
      office_description: '',
      office_schedule_start: '',
      office_schedule_end: '',
      extended_schedule_start: null,
      extended_schedule_end: null,
      status_id: 0,
      created_at: '',
      updated_at: '',
    },
    status: {
      id: 0,
      status: '',
      comments: null,
    },
    bank: {
      id: 0,
      description: '',
      bank_code: null,
    },
    titles: [],
    transaction_method_id: 0,
    created_at: '',
    updated_at: '',
    transaction_method: [
      {
        id: 0,
        account_name: '',
        account_number: '',
        last_balance: {
          final_balance_local: 0,
        },
      },
    ],
  })

  const tabs = reactive([
    {
      name: 'basic_data',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])

  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const fundLimitTableProps = ref({
    title: 'Operaciones que superan el porcentaje del fondo',
    loading: false,
    columns: [] as QTable['columns'],
    rows: [] as IBulkUploadValidatedOperationsList[],
    pages: data_fund_limit_operations_pages.value,
    rowsPerPage: 20,
    selection: 'none' as const,
  })

  const downloadExcelAuthorizeForm = async () => {
    await _downloadDetailBulkUpload(bulkUploadId)
  }

  const fieldLabels: Record<string, string> = {}

  const generateDynamicColumns = (
    data: IBulkUploadValidatedOperationsList[]
  ): QTable['columns'] | undefined => {
    const baseColumns: QTable['columns'] = [
      {
        name: 'line_number',
        label: '#',
        align: 'left',
        field: 'line_number',
        sortable: true,
      },
    ]
    if (!data || data.length === 0) {
      const conditionalColumns = []

      if (action !== 'annular') {
        conditionalColumns.push(
          {
            name: 'status_id',
            label: 'Estado',
            align: 'left' as const,
            field: (row: IBulkUploadValidatedOperationsList) =>
              row.status?.status || row.status?.id || 'Sin estado',
            sortable: true,
          },
          {
            name: 'pass_fund_limit',
            label: 'Supera porcentaje del fondo',
            align: 'center' as const,
            field: (row: IBulkUploadValidatedOperationsList) =>
              row.pass_fund_limit === true ? 'Sí' : 'No',
            sortable: true,
          }
        )
      }

      return [...baseColumns, ...conditionalColumns]
    }

    const dynamicFields = new Set<string>()
    data.forEach((item) => {
      if (item.row && typeof item.row === 'object') {
        Object.keys(item.row).forEach((key) => dynamicFields.add(key))
      }
    })

    const dynamicColumns: QTable['columns'] = Array.from(dynamicFields).map(
      (fieldName) => ({
        name: fieldName,
        label:
          fieldLabels[fieldName] ||
          fieldName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        align: 'left' as const,
        field: (row: IBulkUploadValidatedOperationsList) => {
          const value = row.row?.[fieldName]
          if (fieldName === 'valor_del_aporte' && value != null) {
            return formatCurrencyString(Number(value), {
              currency: 'COP',
              locale: 'es-CO',
            })
          }
          return value || ''
        },
        sortable: true,
      })
    )

    const fixedColumns: QTable['columns'] = []

    if (action !== 'annular') {
      fixedColumns.push(
        {
          name: 'status_id',
          label: 'Estado',
          align: 'left' as const,
          field: (row: IBulkUploadValidatedOperationsList) =>
            row.status?.status || row.status?.id || 'Sin estado',
          sortable: true,
        },
        {
          name: 'pass_fund_limit',
          label: 'Supera porcentaje del fondo',
          align: 'center' as const,
          field: (row: IBulkUploadValidatedOperationsList) =>
            row.pass_fund_limit === true ? 'Sí' : 'No',
          sortable: true,
        }
      )
    }

    return [...baseColumns, ...dynamicColumns, ...fixedColumns]
  }

  const tableProps = ref({
    title:
      action === 'annular'
        ? 'Detalle de la operación'
        : 'Operaciones Validadas',
    loading: false,
    columns: [] as QTable['columns'],
    rows: [] as IBulkUploadValidatedOperationsList[],
    pages: data_authorized_data_validate_operation_pages.value,
    rowsPerPage: 20,
    selection: 'none' as const,
  })

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
  }

  const updatePerPage = (rowsPerPage: number) => {
    tableProps.value.rowsPerPage = rowsPerPage
    tableProps.value.pages.currentPage = 1
  }

  const mapBasicData = () => {
    const data = Array.isArray(data_authorized_data_basic_list.value)
      ? data_authorized_data_basic_list.value.length > 0
        ? data_authorized_data_basic_list.value[0]
        : null
      : data_authorized_data_basic_list.value || null

    if (data) {
      basicData.id = data.id || 0
      basicData.code = data.code || 0
      basicData.operation = data.operation || ''
      basicData.operation_description = data.operation_description || ''

      if (data.template) {
        basicData.template.id = data.template.id || 0
        basicData.template.description = data.template.description || ''
        basicData.template.operation = data.template.operation || ''
      }

      if (data.fund) {
        basicData.fund.id = data.fund.id || 0
        basicData.fund.fund_code = data.fund.fund_code || ''
        basicData.fund.fund_name = data.fund.fund_name || ''
        basicData.fund.fund_type_id = data.fund.fund_type_id || 0
        basicData.fund.fic_rating = data.fund.fic_rating || ''
        basicData.fund.status_id = data.fund.status_id || 0
        basicData.fund.has_participation_types =
          data.fund.has_participation_types || false
        basicData.fund.is_fund_validated = data.fund.is_fund_validated || false
        basicData.fund.last_closing_date = data.fund.last_closing_date || null

        if (data.fund.business_trust) {
          basicData.fund.business_trust.id = data.fund.business_trust.id || 0
          basicData.fund.business_trust.business_code =
            data.fund.business_trust.business_code || ''
          basicData.fund.business_trust.name =
            data.fund.business_trust.name || ''
        }
      }

      if (data.office) {
        basicData.office.id = data.office.id || 0
        basicData.office.office_code = data.office.office_code || ''
        basicData.office.office_description =
          data.office.office_description || ''
        basicData.office.office_schedule_start =
          data.office.office_schedule_start || ''
        basicData.office.office_schedule_end =
          data.office.office_schedule_end || ''
        basicData.office.extended_schedule_start =
          data.office.extended_schedule_start
        basicData.office.extended_schedule_end =
          data.office.extended_schedule_end
        basicData.office.status_id = data.office.status_id || 0
        basicData.office.created_at = data.office.created_at || ''
        basicData.office.updated_at = data.office.updated_at || ''
      }

      if (data.status) {
        basicData.status.id = data.status.id || 0
        basicData.status.status = data.status.status || ''
        basicData.status.comments = data.status.comments
      }

      if (data.bank) {
        basicData.bank.id = data.bank.id || 0
        basicData.bank.description = data.bank.description || ''
        basicData.bank.bank_code = data.bank.bank_code
      }

      basicData.titles = data.titles || []
      basicData.transaction_method_id = data.transaction_method_id || 0
      basicData.created_at = data.created_at || ''
      basicData.updated_at = data.updated_at || ''

      if (data.bank_account?.id) {
        const { id, account_name, account_number, last_balance } =
          data.bank_account

        basicData.bank_account = {
          id: id || 0,
          account_name: account_name || '',
          account_number: account_number || '',
          last_balance: {
            final_balance_local:
              formatCurrencyString(last_balance?.final_balance_local || 0, {
                currency: 'COP',
                locale: 'es-CO',
              }) || 0,
          },
        }

        models.account_balance =
          formatCurrencyString(last_balance?.final_balance_local || 0, {
            currency: 'COP',
            locale: 'es-CO',
          }) || ''
      }
    }
  }

  const onUpdateSelectedRows = (val: IBulkUploadValidatedOperationsList[]) => {
    selectedRows.value = val
  }

  const onUpdateSelectedFundLimitRows = (
    val: IBulkUploadValidatedOperationsList[]
  ) => {
    selectedFundLimitRows.value = val
  }

  const getApiAuthorizedBulkUpload = async () => {
    const id = parseInt(bulkUploadId)
    _clearData()
    await _getApiAuthorizedDataBasicBulkUpload(id)
    await _getApiAuthorizedValidateOperationBulkUpload(id)
    await _getApiFundLimitOperationsBulkUpload(id)
    mapBasicData()
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    getApiAuthorizedBulkUpload()
    openMainLoader(false)
  })

  onBeforeMount(async () => {
    await _resetKeys({
      treasury: [...keys.treasury],
    })
  })

  watch(
    () => data_authorized_data_validate_operation_list.value,
    () => {
      const updatedRows =
        data_authorized_data_validate_operation_list.value.map((row) => ({
          ...row,
          disabled: row?.status?.id !== 25,
        }))

      tableProps.value.rows = updatedRows
      tableProps.value.columns = generateDynamicColumns(updatedRows) || []

      tableProps.value.pages.currentPage =
        data_authorized_data_validate_operation_pages.value.currentPage
      tableProps.value.pages.lastPage =
        data_authorized_data_validate_operation_pages.value.lastPage
    },
    { deep: true }
  )

  watch(
    () => data_fund_limit_operations_list.value,
    () => {
      const updatedFundLimitRows = data_fund_limit_operations_list.value.map(
        (row) => ({
          ...row,
          disabled: row?.status?.id !== 25,
        })
      )

      fundLimitTableProps.value.rows = updatedFundLimitRows
      const dynamicColumns = generateDynamicColumns(updatedFundLimitRows) || []
      fundLimitTableProps.value.columns = dynamicColumns.filter(
        (col) => col.name !== 'pass_fund_limit'
      )

      fundLimitTableProps.value.pages.currentPage =
        data_fund_limit_operations_pages.value.currentPage
      fundLimitTableProps.value.pages.lastPage =
        data_fund_limit_operations_pages.value.lastPage
    },
    { deep: true }
  )

  const updateFundLimitPage = (page: number) => {
    fundLimitTableProps.value.pages.currentPage = page
  }

  const updateFundLimitPerPage = (rowsPerPage: number) => {
    fundLimitTableProps.value.rowsPerPage = rowsPerPage
    fundLimitTableProps.value.pages.currentPage = 1
  }

  const getSelectedLineNumbers = (): number[] => {
    const allSelected = [...selectedRows.value, ...selectedFundLimitRows.value]
    return allSelected.map((row) => row.line_number)
  }

  const onBankChange = (id: string | number | null) => {
    if (!id) {
      models.bank_id = null
      models.bank_description = ''
      models.account_id = null
      models.account_description = ''
      return
    }

    models.bank_id = typeof id === 'string' ? parseInt(id) : id
    const bank = banks.value.find(
      (b) => b.value === id || b.id?.toString() === id || b.code === id
    )
    models.bank_description = bank ? bank.description || bank.label || '' : ''

    models.account_id = null
    models.account_description = ''
  }

  const onAccountCodeChange = (id: string | number | null) => {
    if (!id) {
      models.account_id = null
      models.account_description = ''
      return
    }
    models.account_id = typeof id === 'string' ? parseInt(id) : id
    const account = filteredBankAccounts.value.find(
      (a) => a.value === id || a.id?.toString() === id
    )
    models.account_description = account
      ? account.account_name || account.label || ''
      : ''
  }

  return {
    banks,
    flatBankAccounts,
    filteredBankAccounts,
    tabs,
    activeTab,
    tabActiveIdx,
    tableProps,
    fundLimitTableProps,
    basicData,
    models,
    downloadExcelAuthorizeForm,
    updatePage,
    updatePerPage,
    updateFundLimitPage,
    updateFundLimitPerPage,
    selectedRows,
    selectedFundLimitRows,
    onUpdateSelectedRows,
    onUpdateSelectedFundLimitRows,
    getSelectedLineNumbers,
    onBankChange,
    onAccountCodeChange,
  }
}
