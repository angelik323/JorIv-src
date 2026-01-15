// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  ActionType,
  WriteActionType,
  IBaseTableProps,
  StatusID,
} from '@/interfaces/global'
import { IBankAccountCorporateForm } from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import { QForm } from 'quasar'

// Composables
import { useUtils } from '@/composables'
import { default_statuses } from '@/constants/resources'
import { BANK_TYPES_OPTIONS } from '@/constants/resources/clients'

// Stores
import { useAssetResourceStore } from '@/stores/resources-manager/assets'

const useBankAccountsForm = (
  props: {
    action: ActionType
    data: IBankAccountCorporateForm[]
  },
  emit: Function
) => {
  const { banks } = storeToRefs(useAssetResourceStore('v1'))

  const { defaultIconsLucide, getMaxId } = useUtils()

  const formElementRef = ref<QForm>()

  const initialModelsValues: IBankAccountCorporateForm = {
    is_breb_key: false,
    email: null,
    identification_number: null,
    mobile_number: null,
    breb_key: null,
    breb_keyword: null,
    bank: null,
    bank_name: null,
    account_type: null,
    bank_account_number: null,
    branch: null,
    branch_name: null,
    status: StatusID.ACTIVE, // Por defecto
    is_bank_account_primary: false,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const isModalOpen = ref(false)
  const modalConfig = ref({
    title: '',
    btnText: '',
    action: null as WriteActionType | null,
  })

  const tableProperties = ref<IBaseTableProps<IBankAccountCorporateForm>>({
    title: 'Listado de cuentas bancarias',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'bre-b',
        required: true,
        label: 'Clave Bre-b',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'email',
        required: true,
        label: 'Correo electrónico',
        align: 'left',
        field: (row) => (row.is_breb_key ? row.email : 'No aplica'),
        sortable: true,
      },
      {
        name: 'identification_number',
        required: true,
        label: 'Número de identificación',
        align: 'left',
        field: (row) =>
          row.is_breb_key ? row.identification_number : 'No aplica',
        sortable: true,
      },
      {
        name: 'mobile_number',
        required: true,
        label: 'Celular',
        align: 'left',
        field: (row) => (row.is_breb_key ? row.mobile_number : 'No aplica'),
        sortable: true,
      },
      {
        name: 'breb_key',
        required: true,
        label: 'Llave',
        align: 'left',
        field: (row) => (row.is_breb_key ? row.breb_key : 'No aplica'),
        sortable: true,
      },
      {
        name: 'bank',
        required: true,
        label: 'Banco',
        align: 'left',
        field: (row) => (row.is_breb_key ? 'No aplica' : row.bank_name),
        sortable: true,
      },
      {
        name: 'account_type',
        required: true,
        label: 'Tipo de cuenta',
        align: 'left',
        field: (row) => (row.is_breb_key ? 'No aplica' : row.account_type),
        sortable: true,
      },
      {
        name: 'bank_account_number',
        required: true,
        label: 'Número de cuenta bancaria',
        align: 'left',
        field: (row) =>
          row.is_breb_key ? 'No aplica' : row.bank_account_number,
        sortable: true,
      },
      {
        name: 'branch',
        required: true,
        label: 'Sucursal',
        align: 'left',
        field: (row) => (row.is_breb_key ? 'No aplica' : row.branch_name),
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'main',
        required: true,
        label: 'Cuenta principal',
        align: 'left',
        field: (row) => (row.is_bank_account_primary ? 'Si' : '-'),
        sortable: true,
      },
    ],
    rows: props.data || [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  if (props.action !== 'view') {
    tableProperties.value.columns = [
      ...tableProperties.value.columns,
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ]
  }

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const handleTableOptions = async (
    action: WriteActionType,
    row?: IBankAccountCorporateForm
  ) => {
    const isCreate = action === 'create'
    modalConfig.value = {
      title: `${isCreate ? 'Registro' : 'Edición'} de cuentas bancarias`,
      btnText: isCreate ? 'Crear' : 'Actualizar',
      action,
    }

    models.value = isCreate
      ? { ...initialModelsValues }
      : { ...(row ?? initialModelsValues) }

    isModalOpen.value = true
  }

  const handleDelete = (row: IBankAccountCorporateForm) => {
    const list = props.data
    const filteredList = list.filter(({ id }) => id !== row.id)
    emit('update:data', filteredList)
  }

  const cleanAccountFields = (
    account: IBankAccountCorporateForm
  ): IBankAccountCorporateForm => {
    if (account.is_breb_key) {
      return {
        ...account,
        bank: null,
        account_type: null,
        bank_account_number: null,
        branch: null,
      }
    }

    return {
      ...account,
      email: null,
      identification_number: null,
      mobile_number: null,
      breb_key: null,
      breb_keyword: null,
    }
  }

  const onSave = async () => {
    if (!(await formElementRef.value?.validate())) return

    // Limpia campos según el tipo de cuenta
    const cleanedAccount = cleanAccountFields({ ...models.value })
    const isEditing = Boolean(cleanedAccount.id)
    const list = props.data

    if (isEditing) {
      const index = list.findIndex(({ id }) => id === cleanedAccount.id)
      if (index === -1) return
      const updatedList = list.map((item, i) =>
        i === index ? { ...item, ...cleanedAccount } : item
      )
      emit('update:data', updatedList)
    } else {
      const newItem = {
        ...cleanedAccount,
        id: getMaxId(list) + 1,
      }
      emit('update:data', [...list, newItem])
    }

    isModalOpen.value = false
  }

  watch(
    () => props.data,
    (val) => (tableProperties.value.rows = [...val]),
    { immediate: true }
  )

  return {
    default_statuses,
    banks,
    bank_types: BANK_TYPES_OPTIONS,
    defaultIconsLucide,
    formElementRef,
    models,
    isModalOpen,
    modalConfig,
    tableProperties,
    isRowActive,
    handleTableOptions,
    handleDelete,
    onSave,
  }
}

export default useBankAccountsForm
