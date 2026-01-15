// Vue - Pinia - Quasar
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IBankAccountChannel,
  IOperationChannel,
} from '@/interfaces/customs/fics/CollectiveInvestmentFunds'

// Composables
import { useAlert, useUtils } from '@/composables'

// Stores
import {
  useFicResourceStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

const useOperatingChannelsForm = (props: {
  action: ActionType
  data?: IOperationChannel[]
}) => {
  const { system_operation_channels } = storeToRefs(useFicResourceStore('v1'))
  const { banks, bank_accounts_balances } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { _getResources } = useResourceManagerStore('v1')
  const { defaultIconsLucide, formatCurrencyString } = useUtils()
  const { showAlert } = useAlert()

  const channelAccountsMap = ref(
    new Map<number | null, IBankAccountChannel[]>()
  )
  const modalType = ref<'channels' | 'accounts'>('channels')
  const selectedRowIdChannels = ref<number | null>()
  const operatingChannelsFormRef = ref()
  const modalFormRef = ref()
  const addModalRef = ref()

  const modalData = ref<IOperationChannel>({
    operation_channel_id: null,
    operation_per_day: 0,
    operation_per_month: 0,
    minimun_ammount: 0,
    maximun_ammount: 0,
    bank_accounts: [
      {
        bank_id: 0,
        has_gmf: false,
        bank_account_id: null,
        is_preferred_account: false,
      },
    ],
  })

  const tablePropsChannels = ref({
    title: 'Asignación canales de operación',
    loading: false,
    columns: [
      {
        name: 'checkbox',
        required: true,
        label: '',
        align: 'center',
        field: 'checkbox',
      },
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'channel',
        required: true,
        label: 'Canales',
        align: 'left',
        field: 'channel',
        sortable: true,
      },
      {
        name: 'operation_per_day',
        required: true,
        label: 'Operación por día',
        align: 'left',
        field: 'operation_per_day',
        sortable: true,
      },
      {
        name: 'operation_per_month',
        required: true,
        label: 'Operación por mes',
        align: 'left',
        field: 'operation_per_month',
        sortable: true,
      },
      {
        name: 'minimun_ammount',
        required: true,
        label: 'Monto mínimo',
        align: 'left',
        field: 'minimun_ammount',
        sortable: true,
        format: (item) => (item ? formatCurrencyString(item) : '-'),
      },
      {
        name: 'maximun_ammount',
        required: true,
        label: 'Monto máximo',
        align: 'left',
        field: 'maximun_ammount',
        sortable: true,
        format: (item) => (item ? formatCurrencyString(item) : '-'),
      },
    ] as QTable['columns'],
    rows: [] as IOperationChannel[],
  })

  const tablePropsAccounts = ref({
    title: 'Asignación cuentas bancarias del fondo',
    loading: false,
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
        name: 'channel',
        required: true,
        label: 'Canal',
        align: 'left',
        field: 'channel',
        sortable: true,
      },
      {
        name: 'bank_id',
        required: true,
        label: 'Banco',
        align: 'left',
        field: 'bank_id',
        sortable: true,
      },
      {
        name: 'account',
        required: true,
        label: 'Cuenta',
        align: 'left',
        field: 'account',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'has_gmf_text',
        required: true,
        label: 'Maneja GMF',
        align: 'left',
        field: 'has_gmf_text',
        sortable: true,
      },
      {
        name: 'is_preferred_account_text',
        required: true,
        label: 'Preferencial',
        align: 'left',
        field: 'is_preferred_account_text',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IBankAccountChannel[],
  })

  const loadData = () => {
    if (!props.data) return

    const channelRows: IOperationChannel[] = []

    props.data.forEach((channel) => {
      const channelOperationId = channel.operation_channel?.id ?? 0

      channelRows.push({
        ...channel,
        id: tablePropsChannels.value.rows.length + 1,
        backend_id: channel.id ?? null,
        operation_channel_id: channelOperationId,
        channel: channel.operation_channel?.name ?? '-',
      })

      const accountsForChannel: IBankAccountChannel[] = []

      if (Array.isArray(channel.bank_accounts)) {
        channel.bank_accounts.forEach((account) => {
          const accInfo = findBankAccount(account.bank_account_id ?? 0)

          const accountData: IBankAccountChannel = {
            ...account,
            id: tablePropsAccounts.value.rows.length + 1,
            backend_id: account.id ?? null,
            channel: findChannelNameById(channelOperationId),
            account: accInfo?.account_number?.toString() ?? '-',
            description: accInfo?.account_name ?? '-',
            has_gmf_text: account.has_gmf ? 'Sí' : 'No',
            is_preferred_account_text: account.is_preferred_account
              ? 'Sí'
              : 'No',
          }

          accountsForChannel.push(accountData)
        })
      }

      channelAccountsMap.value.set(channelOperationId, accountsForChannel)
    })

    tablePropsChannels.value.rows = channelRows

    if (channelRows.length > 0) {
      const selectedId = channelRows[0].operation_channel_id
      if (!selectedId) return

      selectedRowIdChannels.value = selectedId

      tablePropsAccounts.value.rows =
        channelAccountsMap.value.get(selectedId) ?? []
    }
  }

  const findChannelNameById = (id: number) =>
    system_operation_channels.value.find((ch) => ch.id === id)?.name || ''

  const findBankAccount = (id: number) =>
    bank_accounts_balances.value.find((acc) => acc.id === id)

  const onBankChange = async (bankId: number) => {
    const account = modalData.value.bank_accounts[0]
    if (!account) return

    account.bank_id = bankId
    account.bank_account_id = null
    await _getResources(
      { treasury: ['bank_account'] },
      `filter[bank_id]=${bankId}`
    )
  }

  const handleOpenModal = (type: 'channels' | 'accounts') => {
    modalType.value = type

    if (type === 'channels') {
      modalData.value = {
        operation_channel_id: null,
        operation_per_day: 0,
        operation_per_month: 0,
        minimun_ammount: 0,
        maximun_ammount: 0,
        bank_accounts: [],
      }
    } else {
      const selected = tablePropsChannels.value.rows.find(
        (row) => row.operation_channel_id === selectedRowIdChannels.value
      )

      if (!selected) return

      modalData.value = {
        operation_channel_id: selected.operation_channel_id,
        minimun_ammount: 0,
        maximun_ammount: 0,
        bank_accounts: [
          {
            bank_id: null,
            has_gmf: false,
            bank_account_id: null,
            is_preferred_account: false,
            bank: '',
            channel: '',
            account: '',
            description: '',
          },
        ],
      }
    }

    addModalRef.value?.openModal?.()
  }

  const handleCloseModal = () => addModalRef.value?.closeModal?.()

  const createChannelRow = () => ({
    ...modalData.value,
    id: tablePropsChannels.value.rows.length + 1,
    backend_id: null,
    channel: modalData.value.operation_channel_id
      ? findChannelNameById(modalData.value.operation_channel_id)
      : '',
  })

  const createAccountRows = () => {
    const channelId = modalData.value.operation_channel_id

    if (!channelId) return
    return modalData.value.bank_accounts.map((account) => {
      const accInfo = findBankAccount(account.bank_account_id ?? 0)
      return {
        ...account,
        id: tablePropsAccounts.value.rows.length + 1,
        backend_id: null,
        channel: findChannelNameById(channelId),
        account: accInfo?.account_number?.toString() ?? '',
        description: accInfo?.account_name ?? '',
        has_gmf_text: account.has_gmf ? 'Si' : 'No',
        is_preferred_account_text: account.is_preferred_account ? 'Si' : 'No',
      }
    })
  }

  const handleAddRow = () => {
    if (!modalFormRef.value?.validate()) return

    if (modalType.value === 'channels') {
      const newRow = createChannelRow()

      const usedChannel = tablePropsChannels.value.rows.find(
        (row) => row.operation_channel_id === newRow.operation_channel_id
      )
      if (usedChannel) {
        showAlert(
          'El canal ya se encuentra registrado',
          'warning',
          undefined,
          1000
        )
        return
      }

      tablePropsChannels.value.rows.push(newRow)
    } else if (modalType.value === 'accounts') {
      const newAccounts = createAccountRows()
      const channelId = modalData.value.operation_channel_id
      if (!channelId) {
        showAlert('Debe seleccionar un canal para agregar cuentas', 'warning')
        return
      }

      if (!channelAccountsMap.value.has(channelId)) {
        channelAccountsMap.value.set(channelId, [])
      }

      if (!newAccounts) return

      const updatedAccounts = [
        ...channelAccountsMap.value.get(channelId)!,
        ...newAccounts,
      ]
      channelAccountsMap.value.set(channelId, updatedAccounts)

      tablePropsAccounts.value.rows = updatedAccounts
    }

    handleCloseModal()
  }

  const getValues = () => {
    return tablePropsChannels.value.rows.map((channel) => {
      const matchingAccounts =
        channelAccountsMap.value.get(channel.operation_channel_id) || []

      return {
        id: channel.backend_id ?? null,
        operation_channel_id: channel.operation_channel_id ?? null,
        operation_per_day: channel.operation_per_day,
        operation_per_month: channel.operation_per_month,
        minimun_ammount: channel.minimun_ammount,
        maximun_ammount: channel.maximun_ammount,
        bank_accounts: matchingAccounts.map((acc) => ({
          id: acc.backend_id ?? null,
          bank_id: acc.bank_id,
          has_gmf: acc.has_gmf,
          bank_account_id: acc.bank_account_id,
          is_preferred_account: acc.is_preferred_account,
        })),
      }
    })
  }

  const validateForm = () => {
    if (!tablePropsChannels.value.rows.length) {
      showAlert(
        'Debe agregar al menos un canal de operación.',
        'warning',
        undefined,
        1000
      )
      return false
    } else if (!tablePropsAccounts.value.rows.length) {
      showAlert(
        'Debe de agregar al menos una cuenta al canal',
        'warning',
        undefined,
        1000
      )
      return false
    }

    return true
  }

  const isView = computed(() => ['view'].includes(props.action))

  const isFormValid = computed(() => {
    if (modalType.value === 'channels') {
      return (
        !!modalData.value.operation_channel_id &&
        !!modalData.value.operation_per_day &&
        !!modalData.value.operation_per_month &&
        !!modalData.value.maximun_ammount
      )
    } else if (modalType.value === 'accounts') {
      const account = modalData.value.bank_accounts?.[0]
      return !!account.bank_id && !!account.bank_account_id
    }
    return false
  })

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) loadData()
    },
    { immediate: true }
  )

  watch(selectedRowIdChannels, (newId) => {
    const selected = tablePropsChannels.value.rows.find(
      (row) => row.operation_channel_id === newId
    )

    if (!selected) {
      tablePropsAccounts.value.rows = []
      return
    }

    const channelId = selected.operation_channel_id
    const accounts = channelAccountsMap.value.get(channelId) || []
    tablePropsAccounts.value.rows = accounts
  })

  return {
    banks,
    isView,
    modalData,
    modalType,
    getValues,
    isFormValid,
    addModalRef,
    modalFormRef,
    validateForm,
    handleAddRow,
    onBankChange,
    handleOpenModal,
    handleCloseModal,
    tablePropsAccounts,
    defaultIconsLucide,
    tablePropsChannels,
    selectedRowIdChannels,
    bank_accounts_balances,
    operatingChannelsFormRef,
    system_operation_channels,
  }
}

export default useOperatingChannelsForm
