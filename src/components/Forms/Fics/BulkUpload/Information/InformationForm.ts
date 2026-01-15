// Vue - Quasar - Pinia - Moment
import { computed, onMounted, ref, watch } from 'vue'
import { QTable, QTableColumn, scroll } from 'quasar'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IBulkUploadList,
  ITransactionMethod,
  IBulkUploadTableUpload,
} from '@/interfaces/customs/fics/BulkUpload'
import { IFicBulkUploadOptions } from '@/interfaces/customs/resources/Fics'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBulkUploadFicsStore } from '@/stores/fics/bulk-upload'

const useInformationForm = (props: {
  action: ActionType
  data?: IBulkUploadList
}) => {
  const { _getResources } = useResourceManagerStore('v1')

  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const {
    banks_collective_investment_funds: banks_code,
    funds_code,
    templates,
    offices,
    fic_bank_accounts_operations,
  } = storeToRefs(useFicResourceStore('v1'))
  const { bank_accounts_with_name, payments } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const {
    _getApiBulkUpload,
    _validateTemplate,
    _getApiByIdDetailsBulkUpload,
    _downloadDetailBulkUpload,
    _downloadValidExcelBulkUpload,
  } = useBulkUploadFicsStore('v1')

  const {
    data_information_form,
    data_bulk_upload_list,
    data_bulk_upload_pages,
    validate_template_bulk_upload,
    data_result_template_bulk_upload_pages,
    data_result_template_bulk_upload_list,
  } = storeToRefs(useBulkUploadFicsStore('v1'))

  const { formatCurrencyString, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()

  const tableLoadPros = ref({
    loading: false,
    columns: [
      {
        name: 'file_name',
        label: 'Nombre',
        align: 'left',
        field: 'file_name',
        sortable: true,
        required: true,
        format: (item) => item || '-',
      },
      {
        name: 'total_lines',
        label: 'Total de registros',
        align: 'left',
        field: 'total_lines',
        sortable: true,
        required: true,
        format: (item) => item || '-',
      },
      {
        name: 'status',
        label: 'Estado de cargue',
        align: 'center',
        field: 'status',
        sortable: true,
        required: true,
        format: (_, row) => row.status?.id || '-',
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'actions',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IBulkUploadTableUpload[],
    pages: {},
  })

  const tableChangeManualPros = ref({
    loading: false,
    columns: [
      {
        name: 'checkbox',
        label: '',
        align: 'left',
        field: 'checkbox',
        sortable: false,
        required: true,
      },
      {
        name: 'id',
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
        required: true,
        format: (item) => item || '-',
      },
      {
        name: 'investment_plan',
        label: 'Plan de inversión',
        align: 'left',
        field: 'investment_plan',
        sortable: true,
        required: true,
        format: (item) => item || '-',
      },
      {
        name: 'operation_description',
        label: 'Operacion',
        align: 'center',
        field: 'operation_description',
        sortable: true,
        required: true,
        format: (item) => item || '-',
      },
      {
        name: 'operation',
        label: 'Valor de la operacion',
        align: 'center',
        field: 'operation',
        sortable: true,
        required: true,
        format: (item) => item || '-',
      },
      {
        name: 'transaction_method',
        label: 'Forma de pago',
        align: 'center',
        field: 'transaction_method',
        sortable: true,
        required: true,
        format: (item) => item || '-',
      },
      {
        name: 'entity',
        label: 'Entidad (Fondo/Banco)',
        align: 'center',
        field: 'selected_transaction_method',
        format: (val, row) => {
          const selected = row.transaction_method.find(
            (item: ITransactionMethod) => item.id === val
          )
          return selected ? selected.account_name : '-'
        },
        sortable: true,
        required: true,
      },
      {
        name: 'account',
        label: 'Cuenta/Plan',
        align: 'center',
        field: 'selected_transaction_method',
        format: (val, row) => {
          const selected = row.transaction_method.find(
            (item: ITransactionMethod) => item.id === val
          )
          return selected ? selected.account_number : '-'
        },
        sortable: true,
        required: true,
      },
    ] as QTable['columns'],
    rows: [] as IBulkUploadTableUpload[],
    pages: data_bulk_upload_pages,
  })

  const tableResulUploadPros = ref<{
    loading: boolean
    columns: QTableColumn[]
    rows: IBulkUploadList[]
    pages: { currentPage: number; lastPage: number }
  }>({
    loading: false,
    columns: [
      {
        name: 'line_number',
        label: '#',
        align: 'center',
        field: 'line_number',
        sortable: true,
        required: true,
        format: (item) => item || '-',
      },
      {
        name: 'status',
        label: 'Validación',
        align: 'center',
        field: 'status',
        format: (_, item) => item.status?.id || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'pass_fund_limit',
        label: 'Supera porcentaje del fondo',
        align: 'center',
        field: 'pass_fund_limit',
        sortable: true,
        required: true,
        format: (_, item) => (item.pass_fund_limit ? 'Si' : 'No'),
      },
    ],
    rows: [],
    pages: data_result_template_bulk_upload_pages.value,
  })

  const flatBankAccounts = computed(() => {
    return fic_bank_accounts_operations.value.flatMap((item) => {
      if (!Array.isArray(item.bank_account)) return []
      return item.bank_account
    })
  })

  const transaction_method_options = ref<IFicBulkUploadOptions[]>([])
  const initialModelsValues: IBulkUploadList = {
    id: null,
    operation: '',
    manual: '',
    template_id: '',
    investment_fund_id: '',
    office_id: '',
    bank_id: '',
    transaction_method_id: '',
    business_code: '',
    manual_ids: [],
    //fields hidden
    transaction_method_description: '',
    account_balance: '',
    bank_description: '',
    office_description: '',
    operation_date: '',
    cancelation_date: '',
    business_fund: '',
    investment_fund_description: '',
    template_description: '',
    number_masive: null,
  }
  const { getScrollTarget, setVerticalScrollPosition } = scroll
  const showFieldsCancelation = ref(false)
  const informationFormRef = ref()
  const btnContinueClicked = ref(false)
  const attachDocumentRef = ref<{ removeFilesRemote: () => void } | null>(null)
  const skipWatchFields = ref<Set<keyof IBulkUploadList>>(new Set())
  const showUploadExcel = ref(false)
  const filterFormat = ref()
  const idResultBulk = ref()
  const fileToCreate = ref()
  const scrollBox = ref<HTMLElement | null>(null)
  const showFields = ref(false)

  const models = ref<IBulkUploadList>({
    ...initialModelsValues,
  })

  const selectOptions = computed(() => ({
    templates: templates.value,
    funds: funds_code.value,
    banks: banks_code.value,
    type_receive: bank_accounts_with_name.value,
    payments: payments.value,
    offices: offices.value,
  }))

  // handlers / actions
  const addDynamicRowColumns = (data: IBulkUploadList[]) => {
    if (!data.length) return

    const rowKeys = Object.keys(data[0].row || {})

    const dynamicColumns = rowKeys.map((key) => ({
      name: key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      align: 'left' as 'left',
      field: (row: { row?: Record<string, unknown> }) =>
        row.row?.[key] != null ? String(row.row[key]) : '-',
      sortable: false,
      required: true,
    }))

    tableResulUploadPros.value.columns = [
      ...tableResulUploadPros.value.columns,
      ...dynamicColumns,
    ]
  }

  const listAction = async (id: number, filters: string = '') => {
    tableResulUploadPros.value.rows = []
    tableResulUploadPros.value.loading = true
    await _getApiByIdDetailsBulkUpload(id, filters)
    tableResulUploadPros.value.loading = false
  }
  const onFileAdded = async (files: File[]) => {
    if (!files?.length) return

    fileToCreate.value = files

    const payload = ['Aportes', 'Retiros']?.includes(
      models.value?.operation ?? ''
    )
      ? {
          operation: models.value.operation,
          template_id: models.value.template_id,
          investment_fund_id: models.value.investment_fund_id,
          office_id: models.value.office_id,
          bank_id: models.value.bank_id,
          transaction_method_id: models.value.transaction_method_id,
          file: fileToCreate.value[0],
        }
      : {
          operation: models.value.operation,
          template_id: models.value.template_id,
          investment_fund_id: models.value.investment_fund_id,
          office_id: models.value.office_id,
          file: fileToCreate.value[0],
        }

    tableLoadPros.value.loading = true

    await _validateTemplate(payload)

    if (validate_template_bulk_upload.value) {
      const formatStatus = {
        ...validate_template_bulk_upload.value,
        status: {
          id: 20,
        },
      }
      tableLoadPros.value.rows = [formatStatus]

      idResultBulk.value = Number(validate_template_bulk_upload.value.id)
      listAction(Number(validate_template_bulk_upload.value.id), '')
    }

    setTimeout(() => {
      tableLoadPros.value.loading = false
      attachDocumentRef.value?.removeFilesRemote()
    }, 1000)
  }
  const updatePage = (page: number) => {
    if (!filterFormat.value) return

    const queryString = formatParamsCustom({
      ...filterFormat.value,
      page,
    })

    listAction(idResultBulk.value, `&${queryString}`)
  }

  const updateRows = (per_page: number) => {
    const queryString = formatParamsCustom({
      ...filterFormat.value,
      per_page,
    })

    listAction(idResultBulk.value, `&${queryString}`)
  }
  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const clearFields = () => {
    skipWatchFields.value.delete('investment_fund_id')
    skipWatchFields.value.add('investment_fund_id')
    models.value.investment_fund_id = ''

    models.value.template_id = ''
    models.value.office_id = ''
    models.value.bank_id = ''
    models.value.transaction_method_id = ''
    models.value.transaction_method_description = ''
    models.value.account_balance = ''
    models.value.bank_description = ''
    models.value.office_description = ''
    models.value.operation_date = ''
    models.value.cancelation_date = ''
    models.value.business_fund = ''
    models.value.investment_fund_description = ''
    models.value.template_description = ''
    models.value.business_code = ''
  }

  const setFormData = (data: IBulkUploadList) => {
    models.value.operation = data.operation ?? ''
    models.value.template_id = data.template_id ?? ''
    models.value.investment_fund_id = data.investment_fund_id ?? ''
    models.value.office_id = data.office_id ?? ''
    models.value.bank_id = data.bank_id ?? ''
    models.value.transaction_method_id = data.transaction_method_id ?? ''
  }

  const setFormEdit = async () => {
    clearForm()
    if (props.data) setFormData(props.data)
  }

  const _setFormView = async () => {
    const data = data_information_form.value

    if (!data) return
    models.value.number_masive = data?.id ?? null
    models.value.operation = data?.template?.operation ?? ''

    models.value.template_id = data?.template?.code ?? ''
    models.value.template_description = data?.template?.description ?? ''
    models.value.investment_fund_id = data?.fund?.fund_code ?? ''
    models.value.investment_fund_description = data.fund?.fund_name ?? 'xx'
    models.value.business_fund = data?.fund?.business_trust?.business_code ?? ''
    models.value.operation_date = data?.created_at ?? ''
    models.value.office_id = data?.office?.office_code ?? ''
    models.value.office_description = data?.office?.office_description ?? ''
    models.value.bank_id = data?.bank?.bank_code ?? ''
    models.value.bank_description = data?.bank?.description ?? ''
    models.value.transaction_method_id =
      data.transaction_method?.[0]?.account_number ?? ''
    models.value.transaction_method_description =
      data.transaction_method?.[0]?.account_name ?? ''
    models.value.account_balance =
      formatCurrencyString(
        data.transaction_method?.[0]?.last_balance?.final_balance_local,
        { showCurrencySymbol: false }
      ) ?? ''
  }

  const _setValueModel = () => {
    if (!data_information_form.value) return

    Object.assign(models.value, data_information_form.value)
  }

  const clearForm = () => {
    Object.assign(models.value, initialModelsValues)
  }

  const assignNameById = (
    id: number | null,
    options: IFicBulkUploadOptions[]
  ) => {
    if (!options) return
    return options.find((item) => item.value === id)
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validate()) ?? false
  }
  const scrollToBottomOfElement = (el: unknown, duration = 500) => {
    if (!(el instanceof HTMLElement)) {
      return
    }

    const target = getScrollTarget(el)
    const offset = el.scrollHeight
    setVerticalScrollPosition(target, offset, duration)
  }
  const handleContinue = async () => {
    if (!(await validateForm())) {
      showAlert('El registro no pudo ser creado.', 'error')
      return
    }
    if (models.value.operation === 'Cancelaciones' && !models.value.manual) {
      showAlert('Seleccione una opcion Manual/Plantilla', 'error')
      return
    }

    setTimeout(() => {
      if (scrollBox.value) {
        scrollToBottomOfElement(scrollBox.value)
      }
    }, 1000)

    btnContinueClicked.value = true
    showUploadExcel.value = true
  }

  const handleCreate = async () => {
    if (!(await validateForm())) {
      showAlert('El registro no pudo ser creado.', 'error')
      return
    }
    const validRows = tableResulUploadPros.value.rows.find(
      (item) => item?.status?.id !== 72
    )

    if (!validRows) {
      showAlert(
        'El documento importado tiene todos los registro con errores',
        'error'
      )
      return
    }
    const payload = {
      operation: models.value.operation,
      template_id: models.value.template_id,
      investment_fund_id: models.value.investment_fund_id,
      office_id: models.value.office_id,
      bank_id: models.value.bank_id,
      transaction_method_id: models.value.transaction_method_id,
      file: fileToCreate.value[0],
    }

    try {
      openMainLoader(true)
      await _validateTemplate(payload)
      openMainLoader(false)
      goToURL('FicsBulkUploadList')
    } catch (error) {
      openMainLoader(false)
    }
  }

  const conditionalContinue = () => {
    if (!models.value.operation) {
      return true
    }
  }

  const tableLoadDelete = (id: number) => {
    tableLoadPros.value.rows = tableLoadPros.value.rows.filter(
      (row) => row.id !== id
    )
  }

  //Exportar excel
  const exportExcelTableResulUpload = async () => {
    openMainLoader(true)
    await _downloadDetailBulkUpload(String(idResultBulk.value))
    openMainLoader(false)
  }

  const exportExcelTableLoad = async () => {
    openMainLoader(true)
    await _downloadValidExcelBulkUpload(String(models.value.template_id))
    openMainLoader(false)
  }

  const handleIdSelection = (event: {
    rows: number
    selected: ITransactionMethod[]
  }) => {
    models.value.manual_ids = event.selected.map((item) => Number(item.id))
  }

  const manualOptionTableManual = (list: ITransactionMethod[]) =>
    list?.map((item) => ({
      label: `${item?.account_number} - ${item.account_name}`,
      value: item.id,
    }))
  // lifecycle hooks
  onMounted(async () => {
    handlerActionForm(props.action)
  })

  // watchers
  watch(
    () => data_result_template_bulk_upload_list.value,
    () => {
      if (data_result_template_bulk_upload_list.value.length === 0) return

      addDynamicRowColumns(data_result_template_bulk_upload_list.value)
      tableLoadPros.value.rows = [validate_template_bulk_upload.value]

      tableResulUploadPros.value.rows =
        data_result_template_bulk_upload_list.value
      tableResulUploadPros.value.pages =
        data_result_template_bulk_upload_pages.value
    },
    { deep: true }
  )

  watch(
    () => models.value.transaction_method_id,
    (id) => {
      if (props.action !== 'view') {
        const options = assignNameById(
          Number(id),
          transaction_method_options.value
        )
        models.value.transaction_method_description = options?.account_name
        models.value.account_balance =
          options?.last_balance?.final_balance_local
      }
    }
  )

  watch(
    () => models.value.bank_id,
    async (id) => {
      if (props.action !== 'view') {
        const options = assignNameById(Number(id), selectOptions.value.banks)
        models.value.bank_description = options?.description

        const keysBankAccount = {
          fics: ['fic_bank_accounts_operations'],
        }
        await openMainLoader(true)
        await _getResources(
          keysBankAccount,
          `filter[bank_id]=${id}&filter[fund_id]=${models.value.investment_fund_id}`
        )
        await openMainLoader(false)

        transaction_method_options.value =
          flatBankAccounts.value as unknown as IFicBulkUploadOptions[]
      }
    }
  )

  watch(
    () => models.value.office_id,
    (id) => {
      if (props.action !== 'view') {
        const options = assignNameById(Number(id), selectOptions.value.offices)
        models.value.office_description = options?.office_description

        if (showFieldsCancelation.value) {
          models.value.cancelation_date = moment().format('YYYY-MM-DD')
        }
      }
    }
  )

  watch(
    () => models.value.investment_fund_id,
    async (id) => {
      if (props.action !== 'view' && id) {
        const options = assignNameById(Number(id), selectOptions.value.funds)
        models.value.investment_fund_description = options?.name

        models.value.operation_date = options?.created_at

        const keys = {
          trust_business: ['business_trusts'],
        }
        const keysFics = {
          fics: ['banks_collective_investment_funds'],
        }
        await openMainLoader(true)
        await _getResources(keys, `filter[id]=${id}`)
        await _getResources(
          keysFics,
          `filter[ficOperationChannel.fund_id]=${id}`
        )

        await openMainLoader(false)

        models.value.business_fund =
          business_trusts.value.length > 0
            ? `${business_trusts.value[0].business_code} - ${business_trusts.value[0].name}`
            : '-'
      }
    }
  )

  watch(
    () => models.value.template_id,
    (id) => {
      if (props.action !== 'view') {
        const options = assignNameById(
          Number(id),
          selectOptions.value.templates
        )
        models.value.template_description = options?.description
      }
    }
  )

  watch(
    () => models.value.manual,
    () => {
      tableLoadPros.value.rows = []
      tableResulUploadPros.value.rows = []
      models.value.manual_ids = []
      btnContinueClicked.value = false
    }
  )

  watch(
    () => models.value.operation,
    (val) => {
      tableLoadPros.value.rows = []
      tableResulUploadPros.value.rows = []
      tableChangeManualPros.value.rows = []
      models.value.manual_ids = []
      if (props.action !== 'view') {
        models.value.transaction_method_id = ''
        models.value.account_balance = ''
        models.value.transaction_method_description = ''
        btnContinueClicked.value = false

        if (val === 'Aportes') {
          if (showFieldsCancelation.value) {
            clearFields()
          }
          showFields.value = true
          showFieldsCancelation.value = false
          models.value.manual = ''

          transaction_method_options.value = bank_accounts_with_name.value.map(
            (item): IFicBulkUploadOptions => ({
              ...item,
              last_balance: item.last_balance
                ? { final_balance_local: String(item.last_balance) }
                : undefined,
            })
          )
        } else if (val === 'Retiros') {
          if (showFieldsCancelation.value) {
            clearFields()
          }
          showFields.value = true
          showFieldsCancelation.value = false
          models.value.manual = ''
        } else {
          clearFields()
          showFields.value = false
          showFieldsCancelation.value = true
        }
      }
    }
  )

  watch(
    () => btnContinueClicked.value,
    async (val) => {
      if (val && models.value.manual === 'Manual') {
        tableChangeManualPros.value.loading = true

        await _getApiBulkUpload(
          `&filter[investment_fund_id]=${String(
            models.value.investment_fund_id
          )}`
        )
        tableChangeManualPros.value.loading = false
      }
    }
  )

  watch(
    () => data_bulk_upload_list.value,
    async (val) => {
      if (val && models.value.manual === 'Manual') {
        tableChangeManualPros.value.rows = data_bulk_upload_list.value
        tableChangeManualPros.value.pages = data_bulk_upload_pages.value
      }
    }
  )

  watch(
    () => data_information_form.value,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  return {
    transaction_method_options,
    tableChangeManualPros,
    showFieldsCancelation,
    formatCurrencyString,
    tableResulUploadPros,
    informationFormRef,
    btnContinueClicked,
    attachDocumentRef,
    showUploadExcel,
    tableLoadPros,
    selectOptions,
    scrollBox,
    showFields,
    models,
    exportExcelTableResulUpload,
    manualOptionTableManual,
    exportExcelTableLoad,
    conditionalContinue,
    handleIdSelection,
    tableLoadDelete,
    handleContinue,
    handleCreate,
    onFileAdded,
    updatePage,
    updateRows,
  }
}
export default useInformationForm
