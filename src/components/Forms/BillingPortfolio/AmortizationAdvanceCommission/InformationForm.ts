// interfaces
import {
  IAmortizationAdvanceCommissionCreate,
  IAmortizationAdvanceCommissionDetail,
  IAmortizationAdvanceCommissionResponse,
} from '@/interfaces/customs'
// quasar & vue & utils
import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import moment from 'moment/moment'
import { isEmptyOrZero } from '@/utils'

// stores & pinia
import { useAmortizationAdvanceCommissionStore } from '@/stores'
import { storeToRefs } from 'pinia'

const useInformationForm = (
  props: {
    action: 'create' | 'view'
    data?: IAmortizationAdvanceCommissionResponse
  },
  emits: (event: 'update') => void
) => {
  const formInformation = ref()
  const { _setDataBasicCollection } =
    useAmortizationAdvanceCommissionStore('v1')

  const { amortization_advance_commission_response } = storeToRefs(
    useAmortizationAdvanceCommissionStore('v1')
  )

  const { _cancelAmortizationAdvanceCommission } =
    useAmortizationAdvanceCommissionStore('v1')

  const modelsCancelAmortization = ref<{ observation: string }>({
    observation: '',
  })

  const models = ref<IAmortizationAdvanceCommissionCreate>({
    id: null,
    invoice_number: '',
    amortization_start_date: '',
    balance_amortized: '',
    accumulated_amortization: '',
    invoice_total: '',
    amortized_value: 0,
  })

  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'invoice_number',
        required: false,
        label: 'Número de la factura',
        align: 'center',
        field: 'invoice_number',
        sortable: true,
      },
      {
        name: 'amortization_date',
        required: false,
        label: 'Fecha de amortización',
        align: 'center',
        field: 'amortization_date',
        sortable: true,
      },
      {
        name: 'amortization_amount',
        required: false,
        label: 'Valor amortizado',
        align: 'center',
        field: 'amortization_amount',
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
        name: 'observation',
        required: false,
        label: 'Motivo de cancelación',
        align: 'center',
        field: 'observation',
        sortable: true,
      },
      {
        name: 'anulled_date',
        required: false,
        label: 'Fecha de anulación',
        align: 'center',
        field: 'anulled_date',
        sortable: true,
      },

      ...(props.action !== 'create'
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
    pages: { currentPage: ref(1), lastPage: ref(1) },
    rows: [] as IAmortizationAdvanceCommissionDetail[],
  })

  // Actions
  const handlerActionForm = (action: 'create' | 'view') => {
    const actionHandlers: Record<string, () => void> = {
      create: _setModelValue,
      view: _setModelValue,
    }
    actionHandlers[action]()
  }

  const _setModelValue = () => {
    const data = props.data

    if (data) {
      models.value = {
        id: data.id,
        invoice_number: data.invoice_number,
        amortization_start_date:
          data.amortization_start_date ?? moment().format('YYYY-MM-DD'),
        balance_amortized: data.balance_amortized,
        accumulated_amortization: data.accumulated_amortization,
        amortized_value: data.amortized_value ?? 0,
        invoice_total: data.invoice_total,
        amortizations:
          data.amortizations as IAmortizationAdvanceCommissionDetail[],
      }
    }
  }

  const alertModalRef = ref()

  const openAlertModal = async (row: number) => {
    alertModalRef.value.entityId = row
    await alertModalRef.value.openModal()
    modelsCancelAmortization.value.observation = ''
  }

  const cancelAmortization = async () => {
    await _cancelAmortizationAdvanceCommission(
      amortization_advance_commission_response.value.id,
      alertModalRef.value.entityId,
      modelsCancelAmortization.value.observation
    )
    modelsCancelAmortization.value.observation = ''
    alertModalRef.value.closeModal()
    emits('update')
  }

  onMounted(() => {
    handlerActionForm(props.action)
  })

  // watch
  watch(
    () => props.data,
    () => {
      handlerActionForm(props.action)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataBasicCollection(null)
      } else {
        _setDataBasicCollection({
          ...models.value,
        })
      }
    },
    { deep: true }
  )

  watch(
    () => amortization_advance_commission_response.value,
    () => {
      tableProps.value.rows =
        amortization_advance_commission_response.value?.amortizations || []
    },
    { deep: true, immediate: true }
  )

  return {
    models,
    modelsCancelAmortization,
    formInformation,
    tableProps,
    alertModalRef,
    cancelAmortization,
    openAlertModal,
  }
}

export default useInformationForm
