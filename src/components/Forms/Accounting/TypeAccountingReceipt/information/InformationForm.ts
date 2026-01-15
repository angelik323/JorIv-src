// pinia | vue
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'

// stores
import { useTypeAccountingReceiptStore, useResourceStore } from '@/stores'
import { QTable } from 'quasar'
import {
  ITypeAccountingDetail,
  ITypeAccountingAction,
} from '@/interfaces/customs'

const useInformationForm = (props: any) => {
  // table
  const tableProps = ref({
    title: 'Tipos de sub comprobantes contables',
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
      {
        name: 'code',
        required: false,
        label: 'Código del sub tipo de comprobante',
        align: 'center',
        field: 'code',
        sortable: true,
      },
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
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
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
  const { _setDataInformationForm } = useTypeAccountingReceiptStore('v1')

  const { sub_receipt_types, status } = storeToRefs(useResourceStore('v1'))

  // refs
  const uid = ref(0)
  const formInformation = ref()
  const models = ref<{
    id?: number
    code?: number
    name?: string
    status?: number | boolean
    details?: ITypeAccountingDetail[]
    observation?: string
  }>({
    id: undefined,
    code: undefined,
    name: '',
    status: false,
    details: [],
    observation: '',
  })

  // actions
  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: _setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
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
  }

  const deleteRowTable = (row: ITypeAccountingDetail) => {
    const index = models.value.details?.findIndex(
      (item) => item._uid === row._uid
    )

    if (index !== -1) {
      models.value.details?.splice(index!, 1)
    }
  }

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const _setFormEdit = () => {
    clearForm()
    const data: ITypeAccountingAction = props.data
    if (data) {
      models.value.id = data.id
      models.value.code = data.code
      models.value.name = data.name
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
    const data: ITypeAccountingAction = props.data
    if (data) {
      models.value.id = data.id
      models.value.code = data.code
      models.value.name = data.name
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
    models.value.status = false
    models.value.code = undefined
    models.value.details = []
    models.value.observation = ''
  }

  const _setValueModel = async () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  onMounted(async () => {
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
          id: models.value.id,
          code: models.value.code,
          name: models.value.name,
          status: models.value.status,
          details: models.value.details?.map((item) => {
            return {
              id: item.id,
              name: item.name,
              is_proof_cancellation: item.is_proof_cancellation,
              proof_cancellation: item.proof_cancellation,
              proof_charge: item.proof_charge,
              status_id: item.status_id,
            }
          }),
          observation: models.value.observation,
        })
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value.details,
    () => {
      tableProps.value.rows = models.value?.details ?? []
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
    formInformation,
    tableProps,
    sub_receipt_types,
    status,
    addRowTable,
    deleteRowTable,
  }
}

export default useInformationForm
