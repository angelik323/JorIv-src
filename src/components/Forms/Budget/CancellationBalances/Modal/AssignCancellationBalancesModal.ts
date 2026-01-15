// Vue
import { onMounted, ref } from 'vue'

// Stores
import { useBudgetCancellationBalancesStore } from '@/stores/budget/cancellation-balances'
import { useAlert } from '@/composables'

const useAssignCancellationBalancesModal = (data: {
  numberDocument: number
  cancellationId: number | null
  isFromOperationLog: boolean
  valueBalanceCancellation?: number
  balance?: number
}) => {
  const { showAlert } = useAlert()
  const initialModelsValues: { value_balance_cancellation: string | null } = {
    value_balance_cancellation: '',
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const { _createCancellationBalances, _updateCancellationBalances } =
    useBudgetCancellationBalancesStore('v1')

  const saveCancellationBalances = async () => {
    if (!models.value.value_balance_cancellation) {
      showAlert('El valor de cancelación es obligatorio', 'error')
      return
    }

    if (
      data.balance &&
      parseFloat(models.value.value_balance_cancellation) > data.balance
    ) {
      showAlert(
        'El valor supera el valor del saldo del documento, por favor valide',
        'error'
      )
      return
    }

    if (data.cancellationId) {
      return await _updateCancellationBalances(data.cancellationId, {
        cancellation_value: models.value.value_balance_cancellation,
      })
    }

    return await _createCancellationBalances({
      cancellation_value: models.value.value_balance_cancellation,
      is_from_operation_log: data.isFromOperationLog,
      operation_log_id: data.isFromOperationLog
        ? data.numberDocument
        : undefined,
      budget_transfer_id: !data.isFromOperationLog
        ? data.numberDocument
        : undefined,
    })
  }

  onMounted(() => {
    if (data.valueBalanceCancellation !== undefined) {
      models.value.value_balance_cancellation =
        data.valueBalanceCancellation.toString()
    }
  })

  return {
    models,
    saveCancellationBalances,
  }
}

export default useAssignCancellationBalancesModal
