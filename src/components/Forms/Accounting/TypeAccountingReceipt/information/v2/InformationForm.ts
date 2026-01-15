// pinia | vue
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'

// stores
import {
  useTypeAccountingReceiptStore,
  useResourceManagerStore,
  useAccountingResourceStore,
} from '@/stores'
import { QTable } from 'quasar'

// interfaces
import {
  ITypeAccountingDetail,
  ITypeAccountingAction,
} from '@/interfaces/customs'
import { ActionType, StatusID } from '@/interfaces/global'

// utils
import { isEmptyOrZero } from '@/utils'

// constants
import { status } from '@/constants/resources'
import { useRules } from '@/composables'

const useInformationForm = (props: {
  action: ActionType
  data?: ITypeAccountingAction | null
}) => {
  // table
  const tableProps = ref({
    title: 'Subtipos de comprobantes',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      ...(props.action !== 'create'
        ? [
            {
              name: 'code',
              required: false,
              label: 'Código del sub tipo de comprobante',
              align: 'center',
              field: 'code',
              sortable: true,
            },
          ]
        : []),
      {
        name: 'name',
        required: false,
        label: 'Nombre del sub tipo de comprobante',
        align: 'center',
        field: 'name',
        sortable: true,
        style: {
          'max-width': '300px',
          'min-width': '300px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'is_proof_cancellation',
        required: false,
        label: '¿Es comprobante de anulación?',
        align: 'center',
        field: 'is_proof_cancellation',
        sortable: true,
      },
      {
        name: 'proof_cancellation',
        required: false,
        label: 'Asocie comprobante de anulación',
        align: 'center',
        field: 'proof_cancellation',
        sortable: true,
        style: {
          'max-width': '300px',
          'min-width': '300px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'proof_charge',
        required: false,
        label: 'Comprobante cargue',
        align: 'center',
        field: 'proof_charge',
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
    rows: [] as ITypeAccountingDetail[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // form
  const { data_information_form } = storeToRefs(
    useTypeAccountingReceiptStore('v1')
  )
  const { _setDataInformationForm } = useTypeAccountingReceiptStore('v2')

  const { sub_receipt_types_voucher, voucher_type_types } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // refs
  const keys = {
    accounting: ['sub_receipt_types'],
  }
  const keysV2 = {
    accounting: ['voucher_type_types'],
  }
  const uid = ref(0)
  const formInformation = ref()
  const models = ref<{
    id?: number
    code?: number
    name?: string
    type?: string
    status?: number | boolean
    details?: ITypeAccountingDetail[]
    observation?: string
  }>({
    id: undefined,
    code: undefined,
    name: '',
    type: '',
    status: false,
    details: [],
    observation: '',
  })

  // actions
  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const changeStatusAction = async (row: ITypeAccountingDetail) => {
    row.status_id =
      row.status_id === StatusID.ACTIVE ? StatusID.INACTIVE : StatusID.ACTIVE
  }

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<ActionType, () => void> = {
      create: _setValueModel,
      edit: _setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const subtypesForm = ref()

  const perPage = ref(20)

  const setPagination = () => {
    tableProps.value.pages.lastPage = models.value.details?.length
      ? Math.ceil(models.value.details?.length / perPage.value)
      : 1

    const page =
      tableProps.value.pages.currentPage <= tableProps.value.pages.lastPage
        ? tableProps.value.pages.currentPage
        : 1

    tableProps.value.rows =
      models.value.details?.slice(
        (page - 1) * perPage.value,
        page * perPage.value
      ) || []
  }

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
    setPagination()
  }

  const updateRows = (rows: number) => {
    perPage.value = rows
    tableProps.value.pages.currentPage = 1
    setPagination()
  }

  const addRowTable = () => {
    const aux: ITypeAccountingDetail = {
      id: undefined,
      _uid: uid.value++,
      name: '',
      is_proof_cancellation: false,
      proof_cancellation: '',
      proof_charge: false,
      status_id: 1,
    }

    models.value.details?.push(aux)
    setPagination()
  }

  const deleteRowTable = (row: ITypeAccountingDetail) => {
    const index = models.value.details?.findIndex(
      (item) => item._uid === row._uid
    )

    if (index !== -1) {
      models.value.details?.splice(index!, 1)
    }
    setPagination()
  }

  const _setFormEdit = () => {
    clearForm()
    const data: ITypeAccountingAction | null | undefined = props.data
    if (data) {
      models.value.id = data.id
      models.value.code = data.code
      models.value.name = data.name
      models.value.type = data.type
      models.value.status = data.status_id
      models.value.details =
        data.sub_receipt_types?.map((item) => {
          return {
            id: item.id,
            _uid: item.id,
            code: item.code,
            name: item.name ?? '',
            is_proof_cancellation: item.is_cancellation ?? false,
            proof_cancellation: item.cancellation_association_id ?? '',
            proof_charge: item.is_upload_receipt ?? false,
            status_id: Number(item.status_id ?? 1),
          }
        }) ?? []
      models.value.observation = data.observation ?? ''
    }
  }

  const _setFormView = () => {
    clearForm()
    const data: ITypeAccountingAction | null | undefined = props.data
    if (data) {
      models.value.id = data.id
      models.value.code = data.code
      models.value.name = data.name
      models.value.type = data.type
      models.value.status = data.status_id
      models.value.details =
        data.sub_receipt_types?.map((item) => {
          return {
            id: item.id,
            _uid: item.id,
            code: item.code,
            name: item.name ?? '',
            is_proof_cancellation: item.is_cancellation ?? false,
            proof_cancellation:
              item.cancellation_association?.name?.toString() ?? '',
            proof_charge: item.is_upload_receipt ?? false,
            status_id: Number(item.status?.id ?? 1),
          }
        }) ?? []
      models.value.observation = data.observation ?? ''
    }
  }

  const clearForm = () => {
    models.value.id = undefined
    models.value.name = ''
    models.value.type = ''
    models.value.status = false
    models.value.code = undefined
    models.value.details = []
    models.value.observation = ''
  }

  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  const toggleProofCancellation = (
    row: ITypeAccountingDetail,
    $event: boolean
  ) => {
    row.is_proof_cancellation = $event
    row.proof_cancellation = $event ? '' : row.proof_cancellation
    // subtypesForm.value.resetValidation()
  }

  const validateForms = async () => {
    const isFormValid =
      (await formInformation.value?.validate()) &&
      (await subtypesForm.value?.validate())

    const isTableValid = tableProps.value.rows.every((row) => {
      const rules = useRules()

      const validations = [
        rules.is_required(row.name, 'El nombre es requerido'),
        rules.min_length(row.name, 2),
        rules.max_length(row.name, 80),
        rules.only_alphanumeric(row.name),
        rules.no_consecutive_spaces(row.name),
      ]

      if (!row.is_proof_cancellation) {
        validations.push(
          rules.is_required(
            row.proof_cancellation as string,
            'El comprobante de anulación es requerido'
          )
        )
      }

      validations.push(
        rules.is_required(String(row.status_id), 'La naturaleza es requerida')
      )

      return validations.every((result) => result === true)
    })

    return isFormValid && isTableValid
  }

  onMounted(async () => {
    _getResources(keys)
    _getResources(keysV2, '', 'v2')
    handlerActionForm(props.action)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
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
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.details,
    () => {
      setPagination()
    },
    { deep: true }
  )

  watch(
    () => models.value.name,
    (val) => {
      models.value.name = val?.toUpperCase()
    }
  )

  return {
    models,
    status,
    tableProps,
    subtypesForm,
    formInformation,
    sub_receipt_types_voucher,
    voucher_type_types,
    updatePage,
    updateRows,
    isRowActive,
    addRowTable,
    validateForms,
    deleteRowTable,
    changeStatusAction,
    toggleProofCancellation,
  }
}

export default useInformationForm
