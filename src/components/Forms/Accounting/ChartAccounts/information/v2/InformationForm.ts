import { onMounted, onUnmounted, ref, watch } from 'vue'
import { debounce, QTable } from 'quasar'
import { storeToRefs } from 'pinia'

import {
  IChartAccount,
  IChartAccountCreate,
  IChartAccountDifference,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import { useRouteValidator, useUtils } from '@/composables'

import {
  useAccountingResourceStore,
  useChartAccountsStore,
  useResourceManagerStore,
} from '@/stores'

const useInformationForm = (props: {
  action: ActionType
  data?: IChartAccountCreate | null
}) => {
  const isDataImport = ref(false)
  const { defaultIconsLucide, isEmptyOrZero } = useUtils()
  const { _getResources } = useResourceManagerStore('v1')
  const { accounting_account_structures } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { validateRouter } = useRouteValidator()

  const { styleColumn } = useUtils()

  const selectedStructure = ref()

  const {
    _setDataInformationForm,
    _export,
    _getByIdChartAccount,
    _createChartAccount,
    _updateChartAccount,
    _getExportFile,
  } = useChartAccountsStore('v2')
  const {
    data_information_form,
    temp_data_import,
    is_temp_data_import,
    selected_structure_accounts,
  } = storeToRefs(useChartAccountsStore('v2'))

  const tableProps = ref({
    title: 'Listado de cuentas contables',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: false,
        label: 'Código cuenta contable',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre de la cuenta',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'type',
        required: false,
        label: 'Tipo',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'nature',
        required: false,
        label: 'Naturaleza',
        align: 'left',
        field: 'nature',
        sortable: true,
      },
      {
        name: 'has_cost_center',
        required: false,
        label: 'Centro de costos',
        align: 'left',
        field: (row: IChartAccount) => `${row.has_cost_center ? 'Sí' : 'No'}`,
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
      {
        name: 'applies_ica_withholding_income',
        required: false,
        label: 'Base de retenciones ICA por ingresos',
        align: 'left',
        field: (row: IChartAccount) =>
          `${row.applies_ica_withholding_income ? 'Sí' : 'No'}`,
        sortable: true,
      },
      {
        name: 'applies_withholding_profits',
        required: false,
        label: 'Base de retención utilidades',
        align: 'left',
        field: (row: IChartAccount) =>
          `${row.applies_withholding_profits ? 'Sí' : 'No'}`,
        sortable: true,
      },
      {
        name: 'is_currency_reexpressed',
        required: false,
        label: 'Reexpresa moneda',
        align: 'left',
        field: (row: IChartAccount) =>
          `${row.is_currency_reexpressed ? 'Sí' : 'No'}`,
        sortable: true,
      },
      ...(props.action !== 'view'
        ? [
            {
              name: 'actions',
              required: true,
              label: 'Acciones',
              align: 'left',
              field: 'actions',
            },
          ]
        : []),
      ...(props.action === 'view'
        ? [
            {
              name: 'difference',
              required: true,
              label: 'Diferencia',
              align: 'left',
              field: '',
              style: {
                ...styleColumn(200),
                'padding-left': 0,
                'padding-right': 0,
              },
            },
            {
              name: 'accounting_account',
              required: true,
              label: 'Cuenta contable',
              align: 'left',
              field: '',
              style: {
                ...styleColumn(200),
                'padding-left': 0,
                'padding-right': 0,
              },
            },
            {
              name: 'aux',
              required: true,
              label: 'Auxiliar',
              align: 'left',
              field: '',
              style: {
                ...styleColumn(200),
                'padding-left': 0,
                'padding-right': 0,
              },
            },
            {
              name: 'movements',
              required: true,
              label: 'Movimientos de fondos',
              align: 'left',
              field: '',
              style: {
                ...styleColumn(200),
                'padding-left': 0,
              },
            },
          ]
        : []),
    ] as QTable['columns'],
    rows: [] as IChartAccount[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const itemEdit = ref<IChartAccount | undefined>(undefined)
  const rowToDelete = ref<IChartAccount | undefined>(undefined)
  const alertModalRef = ref()
  const advancedFiltersModalRef = ref()
  const opsSearch = ref()

  // form

  const formInformation = ref()

  const models = ref<{
    code?: string
    account_structure_id?: number | string
    arrAccounts?: IChartAccount[]
    accounts?: IChartAccount[]
    accounts_to_delete?: number[]
  }>({
    code: '',
    account_structure_id: undefined,
    arrAccounts: [],
    accounts: [],
    accounts_to_delete: [],
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: () => setDataFormFromProps(),
      view: () => setDataFormFromProps(),
    }
    actionHandlers[action]?.()
  }

  const setDataFormFromProps = (
    data: IChartAccountCreate | null = props.data ?? null
  ) => {
    clearForm()
    if (data) {
      const chartAccountData: IChartAccountCreate = data
      models.value.code = chartAccountData.structure?.code ?? ''
      models.value.account_structure_id =
        props.action === 'view'
          ? `${chartAccountData.structure?.id} - ${chartAccountData.structure?.structure}`
          : chartAccountData.structure?.id
      models.value.arrAccounts =
        chartAccountData.arrAccounts?.map((item) => {
          let positiveDifference
          let negativeDifference
          if (item.is_currency_reexpressed) {
            const settings =
              item.reexpression_settings as Array<IChartAccountDifference>
            if (settings) {
              positiveDifference = settings.find(
                (item) => item.difference === 'Positiva'
              )
              negativeDifference = settings.find(
                (item) => item.difference === 'Negativa'
              )
            }
          }
          return {
            ...item,
            currency_id: item.is_currency_reexpressed
              ? item.currency?.id
              : undefined,
            reexpression_settings: {
              positive: {
                ...positiveDifference,
                account_code_id: positiveDifference?.account_code?.id || null,
                third_party_id: positiveDifference?.third_party?.id || null,
                fund_movement_id: positiveDifference?.fund_movement?.id || null,
              },
              negative: {
                ...negativeDifference,
                account_code_id: negativeDifference?.account_code?.id || null,
                third_party_id: negativeDifference?.third_party?.id || null,
                fund_movement_id: negativeDifference?.fund_movement?.id || null,
              },
            },
            status_id: item.status?.id ?? undefined,
          }
        }) ?? []
      selectedStructure.value = accounting_account_structures.value.find(
        (item) => Number(item.id) === Number(chartAccountData.structure?.id)
      )
    }
  }

  watch(
    () => accounting_account_structures.value,
    () => {
      if (!selectedStructure.value && models.value.account_structure_id) {
        selectedStructure.value = accounting_account_structures.value.find(
          (item) =>
            Number(item.id) === Number(models.value.account_structure_id)
        )
      }
    }
  )

  const clearForm = async () => {
    models.value.account_structure_id = undefined
    models.value.arrAccounts = []
  }

  const _setValueModel = async () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  const accountingAccountFormRef = ref()

  const handleSave = async () => {
    if (!(await accountingAccountFormRef.value.validateForm())) return
    const newItem = accountingAccountFormRef.value.getFormData()
    if (selected_structure_accounts.value.list.length && !newItem.id) {
      const payload = {
        account_structure_id: selectedStructure.value.id,
        accounts: [newItem],
      }
      const created = await _createChartAccount(payload)
      if (created) {
        _getByIdChartAccount(selectedStructure.value.id, listParams.value)
        addAccountChartModalRef.value.closeModal()
      }
      return
    }
    addAccountChartModalRef.value.closeModal()

    const { accounts, arrAccounts } = models.value

    if (!itemEdit.value) {
      arrAccounts?.push(newItem)
      accounts?.push(newItem)
      return
    }

    if (!arrAccounts) return
    const index = arrAccounts.findIndex(
      (item) => item.id === newItem.id && item.code === newItem.code
    )

    const accountIndex = accounts?.findIndex(
      (item) => item.id === newItem.id && item.code === newItem.code
    )

    if (index !== -1) {
      arrAccounts[index] = { ...(arrAccounts[index] ?? {}), ...newItem }
    }
    if (accounts && accountIndex !== -1) {
      accounts[index] = { ...(accounts[index] ?? {}), ...newItem }
    } else {
      accounts?.push(newItem)
    }
  }

  const handleDeleteList = (row: IChartAccount) => {
    if (props.action === 'create') {
      deleteItem(row)
    } else {
      rowToDelete.value = row
      alertModalRef.value.openModal()
    }
  }

  const deleteItem = async (row?: IChartAccount) => {
    if (
      selected_structure_accounts.value.list.length &&
      rowToDelete.value &&
      selectedStructure.value
    ) {
      const payload = {
        account_structure_id: selectedStructure.value.id,
        accounts_to_delete: [Number(rowToDelete.value?.id)],
        accounts: [],
      }
      const updated = await _updateChartAccount(
        payload,
        selectedStructure.value.id
      )
      if (updated) {
        listParams.value.page = 1
        _getByIdChartAccount(selectedStructure.value.id, listParams.value)
        alertModalRef.value.closeModal()
      }
      return
    }
    const targetRow = rowToDelete.value || row
    if (!targetRow) return
    const { arrAccounts, accounts_to_delete, accounts } = models.value
    const index = arrAccounts?.findIndex((item) => item.code === targetRow.code)
    const accountIndex = accounts?.findIndex(
      (item) => item.code === targetRow.code
    )

    if (index !== -1 && index !== undefined) {
      arrAccounts?.splice(index, 1)
      accounts_to_delete?.push(targetRow.id as number)
    }
    if (accountIndex !== -1 && accountIndex !== undefined) {
      accounts?.splice(accountIndex, 1)
    }
    alertModalRef.value.closeModal()
  }

  const editItem = (row: IChartAccount) => {
    itemEdit.value = row
    addAccountChartModalRef.value.openModal()
  }

  const exportAccountCharts = async () => {
    if (!props.data) return
    const queueId = await _export(Number(props.data?.account_structure_id))
    if (queueId) {
      const interval = setInterval(async () => {
        const response = await _getExportFile(queueId)
        if (response?.status === 'Procesado') {
          clearInterval(interval)
          useUtils().downloadFile(response.file_url, response.file_name)
        }
        if (response?.status === 'Errores') {
          clearInterval(interval)
        }
      }, 5000)
    }
  }

  const customFilter = (rows: IChartAccount[], idToFilter: string | number) => {
    if (typeof idToFilter === 'string') {
      return rows.filter((row) => `${row.code} - ${row.name}` === idToFilter)
    } else {
      return rows.filter((row) => Number(row.id) === Number(idToFilter))
    }
  }

  onMounted(async () => {
    if (temp_data_import.value) {
      setDataFormFromProps({
        arrAccounts: temp_data_import.value.arrAccounts ?? [],
        structure: {
          id: temp_data_import.value.account_structure_id,
        },
      } as IChartAccountCreate)
      isDataImport.value = true
    }
    handlerActionForm(props.action)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({
          account_structure_id: models.value.account_structure_id ?? undefined,
          accounts: models.value.accounts ?? [],
          accounts_to_delete: models.value.accounts_to_delete ?? [],
          arrAccounts: models.value.arrAccounts ?? [],
        })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.arrAccounts,
    () => {
      tableProps.value.rows = models.value.arrAccounts ?? []
      const totalRows = models.value.arrAccounts?.length || 0
      const rowsPerPage = 20
      const totalPages = Math.ceil(totalRows / rowsPerPage) || 1
      tableProps.value.pages = {
        currentPage: 1,
        lastPage: totalPages,
      }
    },
    { deep: true }
  )

  watch(
    () => tableProps.value.rows,
    (val) => {
      if (!val) return

      opsSearch.value = val
        .filter((item) => item && item.code && item.name)
        .sort((a, b) => (a.code ?? '').localeCompare(b.code ?? ''))
        .map((item) => ({
          label: `${item.code} - ${item.name}`,
          value: item.id ?? `${item.code} - ${item.name}`,
          name: item.name,
          code: item.code,
        }))
    },
    { deep: true }
  )

  const addAccountChartModalRef = ref()
  const listParams = ref({
    page: 1,
    rows: 20,
    search: '',
  })
  const selectStructure = (structure_id: number) => {
    models.value.account_structure_id = structure_id
    selectedStructure.value = accounting_account_structures.value.find(
      (item) => Number(item.id) === Number(structure_id)
    )

    if (selectedStructure.value) {
      _getByIdChartAccount(structure_id, listParams.value)
      _getResources(
        { accounting: ['accounting_chart_operative_by_structure'] },
        `filter[account_structures_id]=${structure_id}`
      )
      _getResources(
        { accounting: ['account_chart_by_account_structure'] },
        `filter[account_structure_id]=${structure_id}`,
        'v2'
      )
    }
  }

  const searchFilter = debounce((search: string) => {
    listParams.value.search = search
    if (!selectedStructure.value) return
    _getByIdChartAccount(selectedStructure.value.id, listParams.value)
  }, 1000)

  const updatePage = (page: number) => {
    listParams.value.page = page
    if (is_temp_data_import.value) {
      _getArrAcountsByTempDataImport(listParams.value)
    } else {
      _getByIdChartAccount(selectedStructure.value.id, listParams.value)
    }
  }

  const updateRows = (rows: number) => {
    listParams.value.rows = rows
    listParams.value.page = 1
    if (is_temp_data_import.value) {
      _getArrAcountsByTempDataImport(listParams.value)
    } else {
      _getByIdChartAccount(selectedStructure.value.id, listParams.value)
    }
  }

  const _getArrAcountsByTempDataImport = (params: {
    page: number
    rows: number
  }) => {
    const filteredAccounts = temp_data_import.value?.arrAccounts || []

    const totalRows = filteredAccounts.length
    const rowsPerPage = params.rows
    const totalPages = Math.ceil(totalRows / rowsPerPage) || 1
    const startIndex = (params.page - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage

    tableProps.value.rows = filteredAccounts.slice(startIndex, endIndex)
    tableProps.value.pages = {
      currentPage: params.page,
      lastPage: totalPages,
    }
  }

  watch(
    () => selected_structure_accounts.value,
    () => {
      tableProps.value.rows = selected_structure_accounts.value.list
      tableProps.value.pages = selected_structure_accounts.value.pages
    },
    { deep: true }
  )

  const openAddAccountModal = () => {
    itemEdit.value = undefined
    addAccountChartModalRef.value.openModal()
  }

  const openAdvancedFilters = () => {
    advancedFiltersModalRef.value.openModal()
  }

  const advancedFiltersRef = ref()

  const handleAdvancedFilters = () => {
    const filters = advancedFiltersRef.value.getFilters()
    const formattedFilters = {
      'filter[code][operator]': filters.code_operator,
      'filter[code][value]': filters.code_value,
      'filter[name][operator]': filters.name_operator,
      'filter[name][value]': filters.name_value,
      'filter[nature]': filters.nature,
      'filter[type]': filters.type,
      'filter[group]': filters.group,
    }
    listParams.value = {
      ...listParams.value,
      ...formattedFilters,
      page: 1,
    }
    _getByIdChartAccount(selectedStructure.value.id, listParams.value)
    advancedFiltersModalRef.value.closeModal()
  }

  return {
    models,
    itemEdit,
    opsSearch,
    tableProps,
    listParams,
    isDataImport,
    alertModalRef,
    formInformation,
    selectedStructure,
    defaultIconsLucide,
    advancedFiltersModalRef,
    addAccountChartModalRef,
    accountingAccountFormRef,
    accounting_account_structures,
    advancedFiltersRef,
    searchFilter,
    editItem,
    updatePage,
    updateRows,
    handleSave,
    deleteItem,
    styleColumn,
    customFilter,
    selectStructure,
    handleDeleteList,
    exportAccountCharts,
    openAddAccountModal,
    openAdvancedFilters,
    handleAdvancedFilters,
    validateRouter,
  }
}

export default useInformationForm
