import { storeToRefs } from 'pinia'

import { IBank } from '@/interfaces/customs/BankAccountGenerator'
import { QTable } from 'quasar'
import { reactive, ref, onMounted, watch, nextTick } from 'vue'
import { useResourceStore, useThirdPartiesStore } from '@/stores'
import { IDataTable, IBankAccountTable } from '@/interfaces/customs'
import { useAlert } from '@/composables'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useBankAccountForm = (props: any, emit: Function) => {
  const { _setBankAccounTable } = useThirdPartiesStore()
  const { thirdPartiesData, data_table_bank_account } = storeToRefs(
    useThirdPartiesStore()
  )
  const { banks, bank_branches, bank_types } = storeToRefs(
    useResourceStore('v1')
  )

  const { showAlert } = useAlert()

  const models = ref<IBank>({
    bank_id: '' as string,
    bank_code: '' as string,
    branch: '' as string,
    account_number: '' as string,
    city: '' as string,
    type: '' as string,
    branch_id: 0 as number,
  })
  const isBankGeneratorOpen = ref(false)
  const itemToEdit = ref<IBank | undefined>(undefined)
  const formElementRef = ref()
  const isLoading = ref(false)

  const customColumns = ['is_main', 'actions', 'has_active_payments']

  const tableProperties = reactive({
    title: 'Listado de cuentas bancarias',
    loading: false,
    columns: [
      {
        name: 'is_main',
        required: true,
        label: 'Principal',
        align: 'left',
        field: 'is_main',
        sortable: true,
      },
      {
        name: 'bank_name',
        required: true,
        label: 'Nombre del banco',
        align: 'left',
        field: 'bank_name',
        sortable: true,
      },
      {
        name: 'bank_code',
        required: true,
        label: 'Código del banco',
        align: 'left',
        field: 'bank_code',
        sortable: true,
      },
      {
        name: 'city',
        required: true,
        label: 'Ciudad',
        align: 'left',
        field: 'city',
        sortable: true,
      },
      {
        name: 'branch',
        required: true,
        label: 'Sucursal',
        align: 'left',
        field: 'branch',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo de cuenta',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'account_number',
        required: true,
        label: 'Número de cuenta',
        align: 'left',
        field: 'account_number',
        sortable: true,
      },
      {
        name: 'has_active_payments',
        required: true,
        label: 'Pagos S/N',
        align: 'left',
        field: 'has_active_payments',
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
    rows: [] as IBankAccountTable[],
  })

  const dataTableBankAccount = ref<IDataTable<IBankAccountTable>>({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })

  const entityId = ref<number | null>(null)

  const maxId = () =>
    dataTableBankAccount.value?.data?.reduce(
      (max, item) => Math.max(max, item.id),
      0
    )

  const saveToStore = () => {
    _setBankAccounTable(dataTableBankAccount.value)
  }

  const setMainItem = (id: number | string) => {
    dataTableBankAccount.value.data = [
      ...dataTableBankAccount.value.data.map((item) => ({
        ...item,
        is_main: item.id === id,
      })),
    ]

    dataTableBankAccount.value.total = dataTableBankAccount.value.data.length

    tableProperties.rows = [...dataTableBankAccount.value.data]

    saveToStore()
  }

  const setActivePayment = (id: number | string, value: boolean) => {
    dataTableBankAccount.value.data = [
      ...dataTableBankAccount.value.data.map((item) =>
        item.id === id ? { ...item, has_active_payments: value } : item
      ),
    ]

    dataTableBankAccount.value.total = dataTableBankAccount.value.data.length

    tableProperties.rows = [...dataTableBankAccount.value.data]

    saveToStore()
  }

  const createDataTableObject = (): IBankAccountTable => {
    const bank = banks.value.find((bank) => bank.value === models.value.bank_id)
    const branch = bank_branches.value.find(
      (branch) => branch.value === Number(models.value.branch)
    )
    return {
      id: maxId() + 1,
      is_main: false,
      bank_id: Number(models.value.bank_id),
      bank_name: bank?.label ?? '--',
      bank_code: models.value.bank_code ?? '--',
      branch: branch?.label ?? '--',
      branch_id: branch?.value ?? null,
      account_number: models.value.account_number ?? '--',
      city: branch?.city?.name ?? '--',
      type: models.value.type ?? '--',
      has_active_payments: false,
      saved: false,
    }
  }

  const addToTable = () => {
    formElementRef.value.validate().then(async (success: boolean) => {
      if (success) {
        const dataTable: IBankAccountTable = createDataTableObject()

        if (tableProperties.rows.length === 5) {
          return showAlert(
            'Solo se permiten 5 registros',
            'error',
            undefined,
            1000
          )
        }

        if (
          tableProperties.rows.some(
            (item) => item.account_number == dataTable.account_number
          )
        ) {
          return showAlert(
            'Ya la cuenta esta registrada',
            'error',
            undefined,
            1000
          )
        }

        tableProperties.rows = [...tableProperties.rows, dataTable]
        dataTableBankAccount.value.data = [...tableProperties.rows]
        dataTableBankAccount.value.total = tableProperties.rows.length

        setMainItem(dataTable.id)
        onResetForm()
        saveToStore()
      }
    })
  }

  const onResetForm = () => {
    models.value.account_number = undefined
    models.value.type = undefined
    models.value.bank_id = undefined
    models.value.branch = ''
    models.value.bank_code = ''
    models.value.city = ''

    isBankGeneratorOpen.value = false

    entityId.value = null

    setTimeout(() => {
      formElementRef.value?.reset()
    }, 500)
  }

  const deleteRecord = (id: number | string, is_main: boolean) => {
    // Función para filtrar por ID
    const filterById = (item: { id: number }) => item.id !== id

    // Actualizar data y tablas
    dataTableBankAccount.value.data =
      dataTableBankAccount.value.data?.filter(filterById) ?? []

    if (is_main) {
      setMainItem(
        dataTableBankAccount.value.data[
          dataTableBankAccount.value.data.length - 1
        ]?.id ?? null
      )
    }

    tableProperties.rows = [...dataTableBankAccount.value.data]

    // Notificación y guardar estado
    setTimeout(() => {
      showAlert(`Registro eliminado exitosamente`, 'success', undefined, 1000)
      saveToStore()
    }, 500)
  }

  const editRecord = async (row: IBankAccountTable, id: number) => {
    entityId.value = id

    isBankGeneratorOpen.value = true

    await nextTick(() => {
      itemToEdit.value = {
        id: entityId.value as number,
        bank_id: Number(row.bank_id),
        bank_code: row.bank_code ?? '',
        branch: row.branch ?? '',
        branch_id: row.branch_id ?? null,
        city: row.city ?? '',
        account_number: row.account_number ?? '',
        type: row.type ?? '',
      }
    })
  }

  const _setValueModels = () => {
    const data =
      data_table_bank_account.value && data_table_bank_account.value.length > 0
        ? data_table_bank_account.value
        : props.data
        ? props.data.bank_accounts
        : null
    if (['create', 'edit', 'view'].includes(props.formType)) {
      if (data && data.length > 0) {
        tableProperties.rows = [...data]
        dataTableBankAccount.value.data = [...data]
        dataTableBankAccount.value.total = Number(data)
      }
    }
  }

  const handleOptions = async (option: string, row?: IBank) => {
    switch (option) {
      case 'create':
        if (row) handleCreation(row)
        break
      case 'edit':
        if (row) handleEdition(row)
        break
      case 'delete':
        if (row?.id) deleteRecord(row.id, row.is_main ?? false)
        break
      default:
        break
    }
  }

  const handleCreation = (item: IBank) => {
    if (item.id) return

    formElementRef.value.validate().then((success: boolean) => {
      if (!success) return

      const itemWithId: IBank = {
        ...item,
        id: `temp-${Math.random().toString(36).substr(2, 9)}`,
      }
      handleSave(itemWithId)
    })
  }

  const handleEdition = (item: IBank) => {
    itemToEdit.value = item ? { ...item } : undefined
    isBankGeneratorOpen.value = true
  }

  const handleSave = (newItem: IBank) => {
    const updatedData = dataTableBankAccount.value.data.map((row) => {
      if (row.id === entityId.value) {
        return {
          id: row.id,
          bank_id: Number(newItem.bank_id),
          bank_name: newItem?.bank_name ?? '',
          bank_code: newItem.bank_code ?? '',
          branch: newItem?.branch?.toString() ?? '',
          branch_id: newItem.branch_id ? Number(newItem.branch_id) : null,
          city: newItem.city ?? '',
          account_number: newItem.account_number ?? '',
          type: newItem.type ?? '',
          is_main: row.is_main,
          has_active_payments: row.has_active_payments,
          saved: row.saved,
        }
      }
      return row
    })

    // Actualizar los datos y propiedades de la tabla
    dataTableBankAccount.value.data = updatedData
    dataTableBankAccount.value.total = updatedData.length
    tableProperties.rows = [...dataTableBankAccount.value.data]

    // Persistir cambios y resetear formulario
    saveToStore()
    onResetForm()
    isBankGeneratorOpen.value = false
  }

  const onContinue = () => {
    emit('onContinue', 'Bank')
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModels,
      edit: _setValueModels,
      view: _setValueModels,
    }

    actionHandlers[action]?.()
  }

  onMounted(async () => {
    if (props.formType === 'view') {
      tableProperties.columns?.splice(
        tableProperties.columns.findIndex((obj: { name?: string }) => {
          return obj.name == 'actions'
        }),
        1
      )
    }

    handlerActionForm(props.formType)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.formType)
      }
    }
  )

  watch(thirdPartiesData, () => {
    if (props.formType === 'update') {
      //
    }
  })

  watch(
    () => models.value.bank_id,
    () => {
      models.value.branch = ''
      models.value.bank_code = ''

      if (models.value.bank_id) {
        models.value.bank_code =
          banks.value.find((bank) => bank.value === models.value.bank_id)
            ?.code ?? ''
      }
    }
  )

  watch(
    () => models.value.branch,
    () => {
      models.value.city =
        bank_branches.value.find(
          (branch) => branch.value === models.value.branch
        )?.city?.name ?? ''
    }
  )

  return {
    models,
    isBankGeneratorOpen,
    customColumns,
    tableProperties,
    itemToEdit,
    formElementRef,
    isLoading,
    banks,
    bank_branches,
    bank_types,

    // Methods
    addToTable,
    deleteRecord,
    editRecord,
    handleOptions,
    setMainItem,
    setActivePayment,
    handleSave,
    onContinue,
  }
}
