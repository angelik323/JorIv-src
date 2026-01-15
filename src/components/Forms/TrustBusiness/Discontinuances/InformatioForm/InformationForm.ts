// vue - pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import {
  IDiscontinuances,
  IDiscontinuancesExtraDataOwner,
  IDiscontinuancesExtraDataPaymentPlan,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// stores
import {
  useResourceManagerStore,
  useTrustBusinessResourceStore,
  useDiscontinuancesStore,
  useTreasuryResourceStore,
} from '@/stores'
import { isEmptyOrZero } from '@/utils'
import { QTable } from 'quasar'

const useInformationForm = (
  props: {
    action: ActionType | 'authorize'
    data?: IDiscontinuances
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
    means_of_payment,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { banks } = storeToRefs(useTreasuryResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const { data_information_form, data_tables } = storeToRefs(
    useDiscontinuancesStore('v1')
  )

  const { _setDataInformationForm, _getDataTablesAction } =
    useDiscontinuancesStore('v1')

  const isViewOrAuthorize = computed(
    () => props.action === 'view' || props.action === 'authorize'
  )

  const isCreate = computed(() => props.action === 'create')
  const isEditing = computed(() => props.action === 'edit')

  const isBankTransaction = ref(false)

  const formInformation = ref()

  // init data
  const models = ref<IDiscontinuances>({
    id: undefined,
    business_trust_id: null,
    real_estate_project_id: null,
    project_stage_id: null,
    business_trust_property_id: null,
    status_id: null,
    property_value: '0',
    total_paid: '0',
    balance_due: '0',
    refund_amount: null,
    retention_amount: null,
    penalty_amount: null,
    net_refund_amount: null,
    refund_method_id: null,
    bank_id: null,
    bank_account_number: '',
    trust_account_number: null,
  })

  const handlerActionForm = async (action: ActionType | 'authorize') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: await _setModelView,
      view: await _setModelView,
      authorize: await _setModelView,
    }
    actionHandlers[action]?.()
  }

  const _setModelValue = async () => {
    clearForm()
    const data = data_information_form.value
    if (data) {
      models.value = {
        ...data,
      }
    }
  }

  const _setModelView = async () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value = {
        ...data,
      }
      await set_documents()
      await searchBank(models.value.refund_method_id ?? 0)
    }
  }

  const searchBank = async (searchId: number) => {
    isBankTransaction.value = false

    const keys_filter = {
      trust_business: ['means_of_payment'],
    }
    await _getResources(keys_filter)

    const search = await means_of_payment.value.find(
      (item) => item.value === searchId
    )

    if (!search) return

    models.value.refund_method_name = search.label

    isBankTransaction.value = search.label
      .toLowerCase()
      .includes('transferencia')
  }

  const clearForm = async () => {
    models.value.id = undefined
    models.value.business_trust_id = null
    models.value.real_estate_project_id = null
    models.value.project_stage_id = null
    models.value.business_trust_property_id = null
    models.value.status_id = null
    models.value.property_value = ''
    models.value.total_paid = ''
    models.value.balance_due = ''
    models.value.refund_amount = null
    models.value.retention_amount = null
    models.value.penalty_amount = null
    models.value.net_refund_amount = null
    models.value.refund_method_id = null
    models.value.bank_id = null
    models.value.bank_account_number = ''
    models.value.trust_account_number = null
  }

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
        name: 'initial_balance',
        field: (row) => row.initial_balance,
        required: false,
        label: 'Saldo inicial cuota',
        align: 'center',
        sortable: true,
      },
      {
        name: 'total_balance',
        field: (row) => row.total_value,
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
        field: (row) => row.status_id,
        required: false,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IDiscontinuancesExtraDataPaymentPlan[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // table
  const tablePropsPrincipal = ref({
    title: 'Títular principal',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'document_type',
        field: (row) => row.document_type?.abbreviation,
        required: false,
        label: 'Tipo documento',
        align: 'center',
        sortable: true,
      },
      {
        name: 'document',
        field: (row) => row.document,
        required: false,
        label: 'N° documento',
        align: 'center',
        sortable: true,
      },
      {
        name: 'name',
        field: (row) => row.name,
        required: false,
        label: 'Nombre o razón social',
        align: 'center',
        sortable: true,
      },
      {
        name: 'email',
        field: (row) => row.email,
        required: false,
        label: 'Correo electrónico',
        align: 'center',
        sortable: true,
      },
      {
        name: 'phone',
        field: (row) => row.phone,
        required: false,
        label: 'Teléfono',
        align: 'center',
        sortable: true,
      },
      {
        name: 'address',
        field: (row) => row.address,
        required: false,
        label: 'Dirección',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IDiscontinuancesExtraDataOwner[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // documents
  const set_documents = async () => {
    const docsMap = new Map(
      models.value.documents?.map((doc) => [doc.DbType, doc])
    )

    dataUpload.value = await dataUpload.value.map((element) => {
      const doc = docsMap.get(element.title)
      if (doc) {
        return { ...element, file: doc.file }
      }
      return element
    })
  }

  // documents upload
  const dataUpload = ref<
    {
      position: number
      class: string
      title: string
      subtitle: string
      required: boolean
      file: File | null
      id: number | null | string
      DbType: string
    }[]
  >([
    {
      position: 0,
      class: 'mt-1',
      title: 'Soporte cuenta bancaria',
      subtitle: '',
      required: true,
      file: null,
      id: null,
      DbType: 'support_bank_account',
    },
    {
      position: 1,
      class: 'mt-1',
      title: 'Copia de cédula',
      subtitle: '',
      required: true,
      file: null,
      id: null,
      DbType: 'support_id_copy',
    },
    {
      position: 2,
      class: 'mt-1',
      title: 'Instrucción de desistimiento',
      subtitle: '',
      required: true,
      file: null,
      id: null,
      DbType: 'support_withdrawal_instruction',
    },
  ])

  const handleFileChange = async (file: File | null, name: string) => {
    if (file) {
      const existingFileIndex = dataUpload.value.findIndex(
        (doc) => doc.title === name
      )

      if (existingFileIndex !== -1) {
        dataUpload.value[existingFileIndex].file = file
      }
    }
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
    { immediate: true, deep: true }
  )

  watch(
    () => models.value.business_trust_property_id,
    async (val) => {
      if (!val) {
        models.value.date_register = ''
        models.value.date_vinculation = ''
        models.value.property_value = ''
        models.value.total_paid = ''
        models.value.balance_due = ''
        models.value.order_number = ''

        tableProps.value.rows = []
        tablePropsPrincipal.value.rows = []
      }

      if (val && isCreate.value) {
        const dataSearch = business_trust_properties.value.find(
          (item) => item.value === val
        )
        await _getDataTablesAction(val)

        models.value.date_register = dataSearch?.date_registration ?? ''
        models.value.date_vinculation =
          dataSearch?.date_vinculation || undefined
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
    async (val, oldval) => {
      if (oldval && val !== oldval) models.value.real_estate_project_id = null
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
    async (val, oldval) => {
      if (oldval && val !== oldval) models.value.project_stage_id = null
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
    async (val, oldval) => {
      if (oldval && val !== oldval)
        models.value.business_trust_property_id = null
      if (val) {
        const keys_filter = {
          trust_business: [
            `business_trust_properties&filter[status_id]=95&filter[property_sale]=true&filter[business_trust_real_estate_project_stage_id]=${val}`,
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
      if (!val) {
        tableProps.value.rows = []
        tablePropsPrincipal.value.rows = []
        return
      }

      tableProps.value.rows =
        val?.payment_plans?.map((item) => ({
          id: item.id ?? 0,
          installment_number: item.installment_number ?? '',
          initial_balance: item.initial_balance ?? '',
          total_value: item.total_value ?? '',
          late_interest: item.late_interest ?? '',
          capital_fee: item.capital_fee ?? '',
          final_balance: item.final_balance ?? '',
          payment_date: item.payment_date ?? '',
          status_id: Number(item.status_id),
        })) ?? []
      tablePropsPrincipal.value.rows = val?.owner ? [val.owner] : []
    },
    { deep: true }
  )

  watch(
    () => [
      models.value.total_paid,
      models.value.retention_amount,
      models.value.penalty_amount,
    ],
    () => {
      models.value.net_refund_amount =
        Number(models.value.total_paid) -
        Number(models.value.retention_amount) -
        Number(models.value.penalty_amount)
    },
    { deep: true }
  )

  watch(
    () => models.value.refund_method_id,
    async (val) => {
      if (val) {
        searchBank(val)
      }
    },
    { deep: true }
  )

  watch(
    () => dataUpload.value,
    () => {
      models.value.documents = dataUpload.value
        .filter((item) => !!item.file)
        .map((item) => ({
          file: item.file as File,
          name: item.title,
          required: item.required,
          id: item.id ?? null,
          type: item.file?.type,
          DbType: item.DbType,
        }))
    },
    { deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (!isEmptyOrZero(models.value)) {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    models,
    props,
    emit,
    formInformation,
    business_trust_real_estate_project,
    project_stage,
    dataUpload,
    business_trusts,
    business_trusts_property_withdrawals_states,
    business_trust_properties,
    tableProps,
    tablePropsPrincipal,
    banks,
    isViewOrAuthorize,
    means_of_payment,
    isBankTransaction,
    isCreate,
    isEditing,
    handleFileChange,
  }
}

export default useInformationForm
