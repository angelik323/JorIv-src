// vue - pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import {
  IExtraordinaryPaymentValue,
  IPaymentList,
  ISaleRealEstate,
  ITableColumnBuyers,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// stores
import {
  useResourceManagerStore,
  useSaleRealEstateStore,
  useTrustBusinessResourceStore,
} from '@/stores'
import { QTable } from 'quasar'
import { useMainLoader } from '@/composables'
import { isEmptyOrZero } from '@/utils'

const useInformationForm = (
  props: {
    action: ActionType
    data?: ISaleRealEstate
  },
  emit: Function
) => {
  // imports
  const {
    business_trust_third_parties,
    business_trust_real_estate_project,
    project_stage,
    business_trust_properties,
    fiduciary_mandates_sale,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { data_information_form } = storeToRefs(useSaleRealEstateStore('v1'))

  const { _setDataInformationForm } = useSaleRealEstateStore('v1')

  const { openMainLoader } = useMainLoader()

  const isCreate = computed(() => props.action === 'create')

  const formInformation = ref()

  // init data
  const models = ref<ISaleRealEstate>({
    id: undefined,
    creation_date: undefined,
    status_id: null,
    buyers: [],
    real_estate_project_id: null,
    real_estate_project_stage_id: null,
    real_estate_project_nomenclature_id: null,
    has_extraordinary_paymentes: null,
    fiduciary_mandate_id: null,
    fiduciary_mandate: null,
    extraordinaryPayment: [],
    value: '',
    financial_obligation: {
      id: null,
      obligation_number: null,
      business_trust_id: null,
      amount: null,
      quotas: null,
      interest_rate: null,
      periodicity_type: null,
    },
    payment_plan_list: [],
  })

  const set_documents = () => {
    const docsMap = new Map(
      models.value.documents?.map((doc) => [doc.DbType, doc])
    )

    dataUpload.value = dataUpload.value.map((element) => {
      const doc = docsMap.get(element.title)
      if (doc) {
        return { ...element, file: doc.file }
      }
      return element
    })
  }
  const _setModelValue = () => {
    clearForm()
    const data = data_information_form.value
    if (data) {
      models.value = {
        ...data,
        creation_date: getTodayFormatted(),
        status_id: null,
        real_estate_project_id: data?.real_estate_project_id ?? null,
        real_estate_project_stage_id:
          data?.real_estate_project_stage_id ?? null,
        real_estate_project_nomenclature_id:
          data?.real_estate_project_nomenclature_id ?? null,
        has_extraordinary_paymentes: data?.has_extraordinary_paymentes ?? null,
        fiduciary_mandate_id: data?.fiduciary_mandate_id ?? null,
        fiduciary_mandate: data?.fiduciary_mandate ?? null,
        extraordinaryPayment: data?.extraordinaryPayment,
      }
      set_documents()
    }
  }

  const _setModelEdit = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value = {
        ...data,
        area: data.area ?? '',
        value: data.value ?? '',
        date: data.date ?? '',
        financial_obligation: data.financial_obligation,
      }

      tableProps.value.rows =
        data.buyers?.map((item) => ({
          buyer_id: Number(item.buyer_id),
          name: '',
          email: '',
          phone: '',
          address: '',
          document: '',
          document_type: '',
        })) ?? []

      tablePropsPayments.value.rows =
        data.payment_plan_list?.map((item) => ({
          id: Number(item.id),
          final_balance: item.final_balance,
          initial_balance: item.initial_balance,
          installment_number: item.installment_number,
          late_interest: item.late_interest,
          payment_date: item.payment_date,
          capital_fee: item.capital_fee,
          status: item.status,
          total_value: item.total_value,
        })) ?? []
      tableProps.value.rows.forEach((element) => {
        changeDataTable(element.buyer_id)
      })

      tablePropsContributions.value.rows =
        data.extraordinaryPayment?.map((item) => ({
          id: item.id,
          extraordinary_payment_value: item.extraordinary_payment_value,
          concept: item.concept,
        })) ?? []

      set_documents()
    }
  }

  const _setModelView = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value = {
        ...data,
        financial_obligation: data.financial_obligation,
      }
      tableProps.value.rows =
        data.buyers?.map((item) => ({
          buyer_id: Number(item.buyer_id),
          name: '',
          email: '',
          phone: '',
          address: '',
          document: '',
          document_type: '',
        })) ?? []

      tablePropsPayments.value.rows =
        data.payment_plan_list?.map((item) => ({
          id: Number(item.id),
          final_balance: item.final_balance,
          initial_balance: item.initial_balance,
          installment_number: item.installment_number,
          late_interest: item.late_interest,
          payment_date: item.payment_date,
          capital_fee: item.capital_fee,
          status: item.status,
          total_value: item.total_value,
        })) ?? []

      tableProps.value.rows.forEach((element) => {
        changeDataTable(element.buyer_id)
      })

      tablePropsContributions.value.rows =
        data.extraordinaryPayment?.map((item) => ({
          id: item.id,
          extraordinary_payment_value: item.extraordinary_payment_value,
          concept: item.concept,
        })) ?? []

      set_documents()
    }
  }

  const clearForm = async () => {
    models.value.id = undefined
    models.value.creation_date = undefined
    models.value.status_id = null
    models.value.buyers = []
    models.value.real_estate_project_id = null
    models.value.real_estate_project_stage_id = null
    models.value.real_estate_project_nomenclature_id = null
    models.value.has_extraordinary_paymentes = null
    models.value.fiduciary_mandate_id = null
    models.value.extraordinaryPayment = []
  }

  // table
  const tableProps = ref({
    title: 'Comprador',
    loading: false,
    columns: [
      {
        name: 'buyer_id',
        field: 'buyer_id',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'document_type',
        field: 'document_type',
        required: false,
        label: 'Tipo de documento',
        align: 'center',
        sortable: true,
      },
      {
        name: 'document',
        field: 'document',
        required: false,
        label: 'N° de documento',
        align: 'center',
        sortable: true,
      },
      {
        name: 'name',
        field: 'name',
        required: false,
        label: 'Nombre o razón social',
        align: 'center',
        sortable: true,
      },
      {
        name: 'email',
        field: 'email',
        required: false,
        label: 'Correo electrónico',
        align: 'center',
        sortable: true,
      },
      {
        name: 'phone',
        field: 'phone',
        required: false,
        label: 'Teléfono',
        align: 'center',
        sortable: true,
      },
      {
        name: 'address',
        field: 'address',
        required: false,
        label: 'Dirección',
        align: 'center',
        sortable: true,
      },
      ...(isCreate.value
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
    rows: [] as ITableColumnBuyers[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const addRow = () => {
    tableProps.value.rows.push({} as ITableColumnBuyers)
  }

  // modal delete
  const alertModalRefPrincipal = ref()
  const alertModalConfigPrincipal = ref({
    title: 'Advertencia',
    description: '',
    entity: null as ITableColumnBuyers | null,
  })

  const idsAssigns = computed(
    () =>
      tableProps.value.rows
        .filter((tp) => tp.buyer_id)
        .map((item) => {
          if (item.buyer_id) {
            return item.buyer_id
          }
        }) ?? []
  )

  const openAlertModalPrincipal = async (entity: ITableColumnBuyers) => {
    alertModalRefPrincipal.value.entity = entity
    await alertModalRefPrincipal.value.openModal()
  }

  const deleteSaleRealStateProject = async () => {
    alertModalRefPrincipal.value.closeModal()
    openMainLoader(true)

    const entityToReplace = alertModalRefPrincipal.value.entity
    if (entityToReplace != null) {
      tableProps.value.rows = tableProps.value.rows.filter(
        (item) => item !== entityToReplace
      )
    }

    openMainLoader(false)
  }

  // table payments
  const tablePropsPayments = ref({
    title: 'Listado de plan de pagos',
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
        name: 'installment_number',
        field: 'installment_number',
        required: false,
        label: 'No Cuota',
        align: 'center',
        sortable: true,
      },
      {
        name: 'initial_balance',
        field: 'initial_balance',
        required: false,
        label: 'Saldo inicial cuota',
        align: 'center',
        sortable: true,
      },
      {
        name: 'total_value',
        field: 'total_value',
        required: false,
        label: 'Valor total cuota',
        align: 'center',
        sortable: true,
      },
      {
        name: 'late_interest',
        field: 'late_interest',
        required: false,
        label: 'Interés por mora',
        align: 'center',
        sortable: true,
      },
      {
        name: 'capital_fee',
        field: 'capital_fee',
        required: false,
        label: 'Cuota capital',
        align: 'center',
        sortable: true,
      },
      {
        name: 'final_balance',
        field: 'final_balance',
        required: false,
        label: 'Saldo final',
        align: 'center',
        sortable: true,
      },
      {
        name: 'payment_date',
        field: 'payment_date',
        required: false,
        label: 'Fecha de pago',
        align: 'center',
        sortable: true,
      },
      {
        name: 'status',
        field: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
      },
    ] as QTable['columns'],
    rows: [] as IPaymentList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // table contributions
  const tablePropsContributions = ref({
    title: 'Listado de abonos extraordinarios',
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
        name: 'extraordinary_payment_value',
        field: 'extraordinary_payment_value',
        required: false,
        label: 'Valor abono extraordinario',
        align: 'center',
        sortable: true,
      },
      {
        name: 'concept',
        field: 'concept',
        required: false,
        label: 'Concepto',
        align: 'center',
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
    rows: [] as IExtraordinaryPaymentValue[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const addRowContributions = () => {
    tablePropsContributions.value.rows.push({} as IExtraordinaryPaymentValue)
  }

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: _setModelEdit,
      view: _setModelView,
    }
    actionHandlers[action]?.()
  }

  const getTodayFormatted = (): string => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
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
    }[]
  >([
    {
      position: 0,
      class: 'mt-1',
      title: 'Promesa de Compraventa',
      subtitle: '',
      required: false,
      file: null,
      id: null,
    },
    {
      position: 1,
      class: 'mt-1',
      title: 'Anexo Fiduciario',
      subtitle: '',
      required: false,
      file: null,
      id: null,
    },
    {
      position: 2,
      class: 'mt-1',
      title: 'Carta de Preaprobado',
      subtitle: '',
      required: false,
      file: null,
      id: null,
    },
    {
      position: 3,
      class: 'mt-1',
      title: 'Carta de Cesión',
      subtitle: '',
      required: false,
      file: null,
      id: null,
    },
    {
      position: 4,
      class: 'mt-1',
      title: 'Contrato de Adhesión',
      subtitle: '',
      required: false,
      file: null,
      id: null,
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

  const changeDataTable = (id: number | null) => {
    if (!id) return

    const dataIndex = business_trust_third_parties.value.find(
      (item) => item.value === id
    )

    if (!dataIndex) return

    const rowIndex = tableProps.value.rows.findIndex(
      (item) => item.buyer_id === id
    )

    if (rowIndex === -1) return

    const updatedItem: ITableColumnBuyers = {
      buyer_id: dataIndex.id ?? 0,
      name: dataIndex.name ?? '',
      email: dataIndex.email ?? '',
      phone: dataIndex.phone ?? '',
      address: dataIndex.address ?? '',
      document: dataIndex.document ?? '',
      document_type: dataIndex.document_type?.name ?? '',
    }

    if (
      tableProps.value.rows.filter(
        (item) => item.buyer_id === updatedItem.buyer_id
      ).length <= 1
    ) {
      tableProps.value.rows.splice(rowIndex, 1, updatedItem)
    }
  }

  // modal delete
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entity: null as IExtraordinaryPaymentValue | null,
  })

  const openAlertModal = async (entity: IExtraordinaryPaymentValue) => {
    alertModalConfig.value.entity = entity
    await alertModalRef.value.openModal()
  }

  const deleteContributions = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)

    const entityToDelete = alertModalConfig.value.entity
    if (entityToDelete != null) {
      tablePropsContributions.value.rows =
        tablePropsContributions.value.rows.filter(
          (item) => item !== entityToDelete
        )
    }

    openMainLoader(false)
  }

  //
  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onMounted(async () => {
    const keys = {
      trust_business: [`project_stage`, `business_trust_properties`],
    }
    await _resetKeys(keys)

    models.value = {
      id: undefined,
      creation_date: undefined,
      status_id: null,
      buyers: [],
      real_estate_project_id: null,
      real_estate_project_stage_id: null,
      real_estate_project_nomenclature_id: null,
      has_extraordinary_paymentes: null,
      fiduciary_mandate_id: null,
      fiduciary_mandate: null,
      extraordinaryPayment: [],
      payment_plan_list: [],
    }
  })

  // watch
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
        }))
    },
    { deep: true }
  )

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
    () => models.value.real_estate_project_nomenclature_id,
    async (val) => {
      if (val) {
        if (props.action !== 'create') return

        const dataSearch = business_trust_properties.value.find(
          (item) => item.value === val
        )

        models.value.type = dataSearch?.nomenclature.includes('Torre')
          ? 'Apartamento'
          : 'Casa'
        models.value.area = dataSearch?.area as string
        models.value.value = `${dataSearch?.total_value}` as string
        models.value.date =
          dataSearch?.business_trust_real_estate_project_stages.start_end
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.real_estate_project_stage_id,
    async (val) => {
      if (val) {
        const keys_filter = {
          trust_business: [`fiduciary_mandates&filter[stage_id]=${val}`],
        }
        await _getResources(keys_filter)
      }
    },
    { deep: true }
  )

  watch(
    () => tableProps.value.rows,
    () => {
      models.value.buyers = tableProps.value.rows?.map((item) => ({
        buyer_id: `${item.buyer_id}`,
      }))
    },
    { deep: true }
  )

  watch(
    () => tablePropsContributions.value.rows,
    () => {
      models.value.extraordinaryPayment =
        tablePropsContributions.value.rows?.map((item) => ({
          extraordinary_payment_value: `${item.extraordinary_payment_value}`,
          concept: item.concept,
        }))
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
    () => models.value.real_estate_project_stage_id,
    async (val) => {
      if (val) {
        const keys_filter = {
          trust_business: [
            `business_trust_properties&filter[status_id]=83&filter[business_trust_real_estate_project_stage_id]=${val}`,
          ],
        }
        await _getResources(keys_filter)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.has_extraordinary_paymentes,
    (val) => {
      if (!val) {
        tablePropsContributions.value.rows = []
      }
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
    business_trust_third_parties,
    formInformation,
    tableProps,
    alertModalRef,
    business_trust_real_estate_project,
    dataUpload,
    project_stage,
    business_trust_properties,
    tablePropsPayments,
    tablePropsContributions,
    alertModalRefPrincipal,
    alertModalConfigPrincipal,
    isCreate,
    fiduciary_mandates_sale,
    idsAssigns,

    openAlertModalPrincipal,
    deleteSaleRealStateProject,
    addRow,
    addRowContributions,
    deleteContributions,
    changeDataTable,
    openAlertModal,
    handleFileChange,
  }
}

export default useInformationForm
