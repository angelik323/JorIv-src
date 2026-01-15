// pinia | vue
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'

// stores
import { useAccountingResourceStore, useChartAccountsStore } from '@/stores'
import { IChartAccount, IChartAccountCreate } from '@/interfaces/customs'
import { QTable } from 'quasar'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'
import { ActionType } from '@/interfaces/global'

const useInformationForm = (props: {
  action: ActionType
  data?: IChartAccountCreate | null
}) => {
  const isDataImport = ref(false)

  // table

  const { account_structures_available_for_store } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { _setDataInformationForm, _export } = useChartAccountsStore('v1')
  const { data_information_form, temp_data_import } = storeToRefs(
    useChartAccountsStore('v1')
  )

  const tableProps = ref({
    title: 'Listado de cuentas contables',
    loading: false,
    columns: [
      {
        name: 'code',
        required: false,
        label: 'Código cuenta contable',
        align: 'center',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre de la cuenta',
        align: 'center',
        field: 'name',
        sortable: true,
      },
      {
        name: 'type',
        required: false,
        label: 'Tipo',
        align: 'center',
        field: 'type',
        sortable: true,
      },
      {
        name: 'nature',
        required: false,
        label: 'Naturaleza',
        align: 'center',
        field: 'nature',
        sortable: true,
      },
      {
        name: 'has_cost_center',
        required: false,
        label: 'Centro de costos',
        align: 'center',
        field: 'has_cost_center',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status_id',
        sortable: true,
      },
      {
        name: 'applies_ica_withholding_income',
        required: false,
        label: 'Base de retenciones ICA por ingresos',
        align: 'center',
        field: 'applies_ica_withholding_income',
        sortable: true,
      },
      {
        name: 'applies_withholding_profits',
        required: false,
        label: 'Base de retención utilidades',
        align: 'center',
        field: 'applies_withholding_profits',
        sortable: true,
      },
      {
        name: 'is_currency_reexpressed',
        required: false,
        label: 'Reexpresa moneda',
        align: 'center',
        field: 'is_currency_reexpressed',
        sortable: true,
      },
      ...(props.action !== 'view'
        ? [
            {
              name: 'actions',
              required: true,
              label: 'Acciones',
              align: 'center',
              field: 'actions',
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

  const isModalOpen = ref(false)
  const itemEdit = ref<IChartAccount | undefined>(undefined)
  const rowToDelete = ref<IChartAccount | undefined>(undefined)
  const alertModalRef = ref()
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

  const infoFilters = ref<{
    purpose: string
    status: string | number
    row_id?: any
  }>({
    purpose: '',
    status: '',
    row_id: null,
  })

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: () => setDataFormFromProps(),
      view: () => setDataFormFromProps(),
    }
    actionHandlers[action]?.()
  }

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
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
      infoFilters.value.purpose = chartAccountData.structure?.purpose ?? ''
      infoFilters.value.status =
        chartAccountData.structure?.status?.status ?? ''
      models.value.arrAccounts =
        chartAccountData.arrAccounts?.map((item) => ({
          ...item,
          status_id: item.status?.id ?? undefined,
        })) ?? []
    }
  }

  const clearForm = async () => {
    models.value.account_structure_id = undefined
    models.value.arrAccounts = []
  }

  const _setValueModel = async () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  const handleSave = (newItem: IChartAccount, isEditing: boolean) => {
    const { accounts, arrAccounts } = models.value

    if (!isEditing) {
      arrAccounts?.push(newItem)
      accounts?.push(newItem)
      return
    }

    if (!arrAccounts) return
    const index = arrAccounts.findIndex(
      (item) => item.id === newItem.id && item.code === newItem.code
    )

    if (index !== -1) {
      arrAccounts[index] = { ...(arrAccounts[index] ?? {}), ...newItem }
      accounts?.push(newItem)
      return
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

  const deleteItem = (row?: IChartAccount) => {
    const targetRow = rowToDelete.value || row
    if (!targetRow) return
    const { arrAccounts, accounts_to_delete } = models.value
    const index = arrAccounts?.findIndex((item) => item.code === targetRow.code)

    if (index !== -1 && index !== undefined) {
      arrAccounts?.splice(index, 1)
      accounts_to_delete?.push(targetRow.id as number)
    }
    alertModalRef.value.closeModal()
  }

  const editItem = (row: IChartAccount) => {
    itemEdit.value = row
    isModalOpen.value = true
  }

  const exportAccountCharts = () => {
    if (!props.data) return
    _export(Number(props.data?.account_structure_id)).then((xlsResponse) => {
      if (xlsResponse) {
        createAndDownloadBlobByArrayBuffer(
          xlsResponse,
          `Plan_de_cuentas${models.value.account_structure_id}`,
          new Date()
        )
      }
    })
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
      if (isEmpty(models.value)) {
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
    () => models.value.account_structure_id,
    () => {
      if (props.action === 'create') {
        const infoStructure = account_structures_available_for_store.value.find(
          (item) => item.value === models.value.account_structure_id
        )
        infoFilters.value.purpose = infoStructure?.purpose ?? ''
        infoFilters.value.status = infoStructure?.status_id ?? ''
      }
    }
  )

  watch(
    () => models.value.arrAccounts,
    () => {
      tableProps.value.rows = data_information_form.value?.arrAccounts ?? []
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

  return {
    models,
    alertModalRef,
    formInformation,
    account_structures_available_for_store,
    tableProps,
    isModalOpen,
    itemEdit,
    infoFilters,
    opsSearch,

    isDataImport,
    handleSave,
    editItem,
    handleDeleteList,
    deleteItem,
    exportAccountCharts,
    customFilter,
  }
}

export default useInformationForm
