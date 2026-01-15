// vue - pinia - quasar
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// interfaces
import {
  IAssignmentBuyer,
  IAssignmentBuyerExtraDataOwner,
  IAssignmentBuyerExtraDataOwnerList,
  IAssignmentBuyersExtraDataPaymentPlan,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// stores
import {
  useResourceManagerStore,
  useTrustBusinessResourceStore,
  useAssignmentBuyerStore,
} from '@/stores'

// composables
import { useUtils } from '@/composables'
const { isEmptyOrZero } = useUtils()

const useInformationForm = (
  props: {
    action: ActionType | 'authorize'
    data?: IAssignmentBuyer
  },
  emit: Function
) => {
  // imports
  const {
    business_trusts,
    business_trusts_property_withdrawals_states,
    business_trust_real_estate_project,
    project_stage,
    business_trust_properties,
    business_trust_third_parties,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const { data_information_form, data_tables, selectedThirdId, selectedThird } =
    storeToRefs(useAssignmentBuyerStore('v1'))

  const { _setDataInformationForm, _getDataTablesAction, _setSelectedThird } =
    useAssignmentBuyerStore('v1')

  const isViewOrAuthorize = computed(
    () => props.action === 'view' || props.action === 'authorize'
  )

  const isCreate = computed(() => props.action === 'create')

  const formInformation = ref()
  const alertModalRef = ref()
  const selectedIdToDelete = ref<number | null>(null)

  // init data
  const models = ref<IAssignmentBuyer>({
    id: undefined,
    business_trust_id: null,
    real_estate_project_id: null,
    project_stage_id: null,
    business_trust_property_id: null,
    status_id: null,
    property_value: '0',
    total_paid: '0',
    balance_due: '0',
  })

  const tablePropsFinalBuyers = ref({
    title: 'Compradores finales',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'document_type',
        field: 'document_type',
        required: false,
        label: 'Tipo documento',
        align: 'left',
        sortable: false,
      },
      {
        name: 'document',
        field: 'document',
        required: false,
        label: 'N° documento',
        align: 'left',
        sortable: false,
      },
      {
        name: 'name',
        field: 'name',
        required: false,
        label: 'Nombre o razón social',
        align: 'left',
        sortable: false,
      },
      {
        name: 'email',
        field: 'email',
        required: false,
        label: 'Correo electrónico',
        align: 'left',
        sortable: false,
      },
      {
        name: 'phone',
        field: 'phone',
        required: false,
        label: 'Teléfono',
        align: 'left',
        sortable: false,
      },
      {
        name: 'address',
        field: 'address',
        required: false,
        label: 'Dirección',
        align: 'left',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [],
  })

  const idsAssigns = computed(
    () =>
      tablePropsAssignees.value.rows
        .filter((fl) => fl.id)
        .map((item) => {
          if (item.id) {
            return item.id
          }
        }) ?? []
  )

  // table
  const tableProps = ref({
    title: 'Plan de pagos',
    loading: false,
    columns: [
      {
        name: 'id',
        field: (row) => row.id,
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'quota_number',
        field: (row) => row.installment_number,
        required: false,
        label: 'No Cuota',
        align: 'center',
        sortable: true,
      },
      {
        name: 'opening_balance',
        field: (row) => row.initial_balance,
        required: false,
        label: 'Saldo inicial cuota',
        align: 'center',
        sortable: true,
      },
      {
        name: 'total_balance',
        field: (row) => row.total_fee,
        required: false,
        label: 'Valor total cuota',
        align: 'center',
        sortable: true,
      },
      {
        name: 'interest',
        field: (row) => row.late_interest,
        required: false,
        label: 'Interés por mora',
        align: 'center',
        sortable: true,
      },
      {
        name: 'quota_capital',
        field: (row) => row.capital_fee,
        required: false,
        label: 'Cuota capital',
        align: 'center',
        sortable: true,
      },
      {
        name: 'final_balance',
        field: (row) => row.final_balance,
        required: false,
        label: 'Saldo final',
        align: 'center',
        sortable: true,
      },
      {
        name: 'payment_date',
        field: (row) => row.payment_date,
        required: false,
        label: 'Fecha de pago',
        align: 'center',
        sortable: true,
      },
      {
        name: 'status_id',
        field: (row) => row.status?.id,
        required: false,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IAssignmentBuyersExtraDataPaymentPlan[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // table transfers
  const tablePropsTransfer = ref({
    title: 'Cedente',
    loading: false,
    columns: [
      {
        name: 'checked',
        required: true,
        label: '',
        align: 'center',
        field: 'checked',
        sortable: true,
      },
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo de documento',
        align: 'center',
        field: 'type',
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'N° de documento',
        align: 'center',
        field: 'document_number',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre o razón social',
        align: 'center',
        field: 'name',
        sortable: true,
      },
      {
        name: 'email',
        required: true,
        label: 'Correo electrónico',
        align: 'center',
        field: 'email',
        sortable: true,
      },
      {
        name: 'phone',
        required: true,
        label: 'Teléfono',
        align: 'center',
        field: 'phone',
        sortable: true,
      },
      {
        name: 'address',
        required: true,
        label: 'Dirección',
        align: 'center',
        field: 'address',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IAssignmentBuyerExtraDataOwnerList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // table assignees
  const allColumns: QTable['columns'] = [
    {
      name: 'id',
      required: true,
      label: '#',
      align: 'center',
      field: 'id',
      sortable: true,
    },
    {
      name: 'type',
      required: true,
      label: 'Tipo de documento',
      align: 'center',
      field: 'type',
      sortable: true,
    },
    {
      name: 'document_number',
      required: true,
      label: 'N° de documento',
      align: 'center',
      field: 'document_number',
      sortable: true,
    },
    {
      name: 'name',
      required: true,
      label: 'Nombre o razón social',
      align: 'center',
      field: 'name',
      sortable: true,
    },
    {
      name: 'email',
      required: true,
      label: 'Correo electrónico',
      align: 'center',
      field: 'email',
      sortable: true,
    },
    {
      name: 'phone',
      required: true,
      label: 'Teléfono',
      align: 'center',
      field: 'phone',
      sortable: true,
    },
    {
      name: 'address',
      required: true,
      label: 'Dirección',
      align: 'left',
      field: 'address',
      sortable: true,
    },
    {
      name: 'actions',
      required: true,
      label: 'Acciones',
      align: 'center',
      field: 'actions',
    },
  ]

  const tablePropsAssignees = ref({
    title: 'Cesionario',
    loading: false,
    columns: allColumns.filter(
      (col) =>
        ['create', 'edit'].includes(props.action) || col.name !== 'actions'
    ),
    rows: [] as IAssignmentBuyerExtraDataOwnerList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  let isSettingDataInformationForm = false

  const handlerActionForm = async (action: ActionType | 'authorize') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: isEmptyOrZero(data_information_form.value ?? {})
        ? await _setModelView
        : await _setModelValue,
      view: await _setModelView,
      authorize: await _setModelView,
    }
    actionHandlers[action]?.()
  }

  const _setModelValue = () => {
    models.value = {
      id: undefined,
      business_trust_id: null,
      real_estate_project_id: null,
      project_stage_id: null,
      business_trust_property_id: null,
      status_id: null,
      property_value: '0',
      total_paid: '0',
      balance_due: '0',
    }

    tableProps.value.rows = []
    tablePropsTransfer.value.rows = []
    tablePropsAssignees.value.rows = []
    tablePropsFinalBuyers.value.rows = []
    const data = data_information_form.value
    if (data) {
      models.value = {
        ...data,
      }
      setDataTableAssignees(data)
      assignPaymentPlans(data_tables.value?.payment_plans ?? [])
      assignTablePropsTransfer(data_tables.value?.buyers ?? [])
    }
  }

  const _setModelView = async () => {
    const keys = {
      trust_business: ['third_parties'],
    }
    await _getResources(keys)

    const data = props.data

    if (data) {
      models.value = {
        ...data,
        property_value: '0',
        total_paid: '0',
        balance_due: '0',
      }

      assignPaymentPlans(data_tables.value?.payment_plans ?? [])
      assignTablePropsTransfer(data_tables.value?.buyers ?? [])
      setDataTableAssignees(data)
    }
  }

  const setDataTableAssignees = (data: IAssignmentBuyer) => {
    tablePropsAssignees.value.rows =
      data.assignees?.map((item) => {
        const thirdParty = business_trust_third_parties.value.find(
          (tp) => tp.id === item.third_party_id
        )

        return {
          id: thirdParty?.id ?? 0,
          type: thirdParty?.document_type?.name ?? '',
          document_number: `${thirdParty?.document}`,
          name: thirdParty?.name ?? '',
          email: thirdParty?.email ?? '',
          phone: thirdParty?.phone ?? '',
          address: thirdParty?.address ?? '',
          status_id: 0,
          document_type_id: 0,
          document: '',
        }
      }) ?? []
  }

  const getThird = () => {
    if (!selectedThirdId.value) return _setSelectedThird(null)

    const row = tablePropsTransfer.value.rows.find(
      (item: IAssignmentBuyerExtraDataOwnerList) =>
        item.id === selectedThirdId.value
    )
    _setSelectedThird(selectedThirdId.value, row)
  }

  const addRow = () => {
    tablePropsAssignees.value.rows.push(
      {} as IAssignmentBuyerExtraDataOwnerList
    )
  }

  const changeDataTable = (id: number | string | null) => {
    if (
      !(
        tablePropsAssignees.value.rows.filter(
          (item) => item.id === (id as number)
        ).length <= 1
      )
    )
      return

    let updatedItem: IAssignmentBuyerExtraDataOwnerList = {
      id: null,
      type: '',
      document_number: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      status_id: 0,
      document_type_id: 0,
      document: '',
    }

    const dataIndex = business_trust_third_parties.value.find(
      (item) => item.id === id
    )

    const rowIndex = tablePropsAssignees.value.rows.findIndex(
      (item) => item.id === id
    )

    if (rowIndex === -1) return

    if (id && dataIndex) {
      updatedItem = {
        id: dataIndex.id ?? 1,
        type: dataIndex.document_type?.name ?? '',
        document_number: `${dataIndex.document}`,
        name: dataIndex.name ?? '',
        email: dataIndex.email ?? '',
        phone: dataIndex.phone ?? '',
        address: dataIndex.address ?? '',
        status_id: 0,
        document_type_id: 0,
        document: '',
      }
    }

    tablePropsAssignees.value.rows.splice(rowIndex, 1, updatedItem)
  }

  const _deleteRow = (idToDelete: number) => {
    const index = tablePropsAssignees.value.rows.findIndex(
      (item) => item.id === idToDelete
    )

    if (index !== -1) {
      tablePropsAssignees.value.rows.splice(index, 1)
    }
  }

  const openDeleteModal = async (id: number) => {
    selectedIdToDelete.value = id
    await alertModalRef.value.openModal()
  }

  const confirmDeleteRow = async () => {
    if (selectedIdToDelete.value !== null) {
      _deleteRow(selectedIdToDelete.value)
      selectedIdToDelete.value = null
    }
    await alertModalRef.value.closeModal()
  }

  const assignTablePropsTransfer = (
    buyers: IAssignmentBuyerExtraDataOwner[]
  ) => {
    const uniqueArray = Array.from(
      new Map(buyers.map((item) => [item.third_party_id, item])).values()
    )

    tablePropsTransfer.value.rows =
      uniqueArray.map((item) => ({
        id: item.third_party.id ?? 0,
        type: item.third_party.document_type ?? '',
        document_number: `${item.third_party.document_number ?? ''}`,
        name: item.name ?? '',
        email: item.buyer.email ?? '',
        phone: item.buyer.phone ?? '',
        address: item.buyer.address ?? '',
        status_id: Number(item.buyer?.status_id) || 0,
        document_type_id: Number(item.buyer?.document_type_id) || 0,
        document: item.buyer.document ?? '',
      })) ?? []
  }

  const assignPaymentPlans = (
    payment_plan: IAssignmentBuyersExtraDataPaymentPlan[]
  ) => {
    tableProps.value.rows =
      payment_plan?.map((item) => ({
        id: item.id ?? 0,
        installment_number: item.installment_number ?? '',
        initial_balance: item.initial_balance ?? '',
        total_value: item.total_value ?? '',
        late_interest: item.late_interest ?? '',
        capital_fee: item.capital_fee ?? '',
        total_fee: item.capital_fee ?? '',
        final_balance: item.final_balance ?? '',
        payment_date: item.payment_date ?? '',
        status_id: Number(item.status?.id) || 0,
      })) ?? []
  }

  //
  onMounted(async () => {
    handlerActionForm(props.action)
  })

  // watch
  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.business_trust_property_id,
    async (val) => {
      if (val) {
        if (isCreate.value) {
          await _getDataTablesAction(val)
        }

        const dataSearch = business_trust_properties.value.find(
          (item) => item.value === val
        )

        models.value.date_register = dataSearch?.date_registration ?? ''
        models.value.date_vinculation = dataSearch?.date_vinculation ?? ''
        models.value.property_value = dataSearch?.total_value ?? '0'
        models.value.total_paid = dataSearch?.total_paid ?? '0'
        models.value.balance_due = dataSearch?.balance_due ?? '0'
        models.value.order_number = dataSearch?.order_number ?? ''
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.business_trust_id,
    async (val) => {
      if (val) {
        const keys_filter = {
          trust_business: [
            `business_trust_real_estate_project&filter[business_trust_id]=${val}`,
          ],
        }
        await _getResources(keys_filter)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.real_estate_project_id,
    async (val) => {
      if (val) {
        const keys_filter = {
          trust_business: [
            `project_stage&filter[business_trust_real_estate_project_id]=${val}`,
          ],
        }
        await _getResources(keys_filter)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.project_stage_id,
    async (val) => {
      if (val) {
        const keys_filter = {
          trust_business: [
            `business_trust_properties&filter[status_id]=95&filter[business_trust_real_estate_project_stage_id]=${val}`,
          ],
        }
        await _getResources(keys_filter)
      }
    },
    { deep: true }
  )

  watch(
    () => data_tables.value,
    (val) => {
      assignPaymentPlans(val?.payment_plans ?? [])
      assignTablePropsTransfer(val?.buyers ?? [])
    },
    { deep: true }
  )

  watch(
    selectedThirdId,
    async () => {
      await getThird()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    () => {
      if (!isEmptyOrZero(models.value)) {
        _setDataInformationForm({ ...models.value })
      }

      if (!models.value.business_trust_id) {
        models.value.real_estate_project_id = null
        models.value.project_stage_id = null
        models.value.business_trust_property_id = null
      }

      if (!models.value.real_estate_project_id) {
        models.value.project_stage_id = null
        models.value.business_trust_property_id = null
      }

      if (!models.value.project_stage_id) {
        models.value.business_trust_property_id = null
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.business_trust_id,
    (val) => {
      if (!val) {
        models.value.real_estate_project_id = null
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.real_estate_project_id,
    (val) => {
      if (!val) {
        models.value.project_stage_id = null
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.project_stage_id,
    (val) => {
      if (!val) {
        models.value.business_trust_property_id = null
      }
    },
    { deep: true }
  )

  watch(
    () => [
      tablePropsAssignees.value.rows,
      tablePropsTransfer.value.rows,
      selectedThirdId.value,
    ],
    () => {
      if (isSettingDataInformationForm) return

      if (tablePropsAssignees.value.rows) {
        models.value.assignees = tablePropsAssignees.value.rows.map((item) => ({
          third_party_id: item.id ?? 0,
        }))
      }

      isSettingDataInformationForm = true

      tablePropsAssignees.value.rows = tablePropsAssignees.value.rows.map(
        (item) => {
          if (item.id === null) {
            return {
              ...item,
              type: '',
              document_number: '',
              name: '',
              email: '',
              phone: '',
              address: '',
              status_id: 0,
              document_type_id: 0,
              document: '',
            }
          }
          return item
        }
      )

      tablePropsFinalBuyers.value.loading = true

      const requiredKeys = [
        'type',
        'document_number',
        'name',
        'address',
        'status_id',
        'document_type_id',
        'document',
      ]

      const merged = [
        ...tablePropsAssignees.value.rows,
        ...tablePropsTransfer.value.rows,
      ]

      const filtered = merged.filter(
        (obj) =>
          obj &&
          obj.id !== null &&
          Object.keys(obj).length > 0 &&
          requiredKeys.every((key) => key in obj)
      )

      const uniqueById = Array.from(
        new Map(filtered.map((item) => [item.id, item])).values()
      ).filter((na) => na.id !== selectedThirdId.value)

      tablePropsFinalBuyers.value.rows = uniqueById.map((item) => {
        return {
          id: item.id,
          document_type: item.type ?? '--',
          document: item.document_number ?? '--',
          name: item.name ?? '--',
          email: item.email ?? '--',
          phone: item.phone ?? '--',
          address: item.address ?? '--',
        }
      }) as never[]

      setTimeout(() => {
        tablePropsFinalBuyers.value.loading = false
        isSettingDataInformationForm = false
      }, 2000)
    },
    {
      deep: true,
    }
  )

  return {
    models,
    props,
    emit,
    formInformation,
    business_trust_real_estate_project,
    project_stage,
    business_trusts,
    business_trusts_property_withdrawals_states,
    business_trust_properties,
    tableProps,
    isViewOrAuthorize,
    isCreate,
    tablePropsTransfer,
    tablePropsAssignees,
    business_trust_third_parties,
    selectedThirdId,
    selectedThird,
    tablePropsFinalBuyers,
    idsAssigns,
    alertModalRef,

    addRow,
    changeDataTable,
    openDeleteModal,
    confirmDeleteRow,
  }
}

export default useInformationForm
