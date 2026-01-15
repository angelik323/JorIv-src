// Vue - pinia
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import {
  IMovementCodesBasicDataForm,
  IMovementCodesBasicDataResponse,
} from '@/interfaces/customs/budget/MovementCodes'

// Composables
import { useRules, useUtils } from '@/composables'

// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetMovementCodesStore } from '@/stores/budget/movement-codes'

const useBasicDataMovementCodesForm = (props: {
  action: WriteActionType
  data?: IMovementCodesBasicDataResponse | null
}) => {
  const { is_required, no_special_characters_extended, max_length } = useRules()
  const { isEmptyOrZero } = useUtils()
  const { data_movement_codes_form } = storeToRefs(
    useBudgetMovementCodesStore('v1')
  )
  const { _setDataMovementCodesForm } = useBudgetMovementCodesStore('v1')

  const { code_movements, code_movement_validities } = storeToRefs(
    useBudgetResourceStore('v1')
  )

  const movementCodesBasicData = ref()

  const models = ref<IMovementCodesBasicDataForm>({
    movement_code: '',
    movement_description: '',
    validity: '',
    is_derived_contract: false,
    cancellation_code_id: null,
    cancellation_code: '',
    cancellation_code_description: '',
    balance_cancellation_code_id: null,
    balance_cancellation_code: '',
    balance_cancellation_code_description: '',
  })

  const handlerActionForm = (action: WriteActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const setFormEdit = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.movement_code = data?.movement_code
      models.value.movement_description = data?.movement_description
      models.value.validity = data?.validity
      models.value.is_derived_contract = data?.is_derived_contract
      models.value.cancellation_code_id = data?.cancellation_code_id
      models.value.cancellation_code = data?.cancellation_code
      models.value.cancellation_code_description =
        data?.cancellation_code_description
      models.value.balance_cancellation_code_id =
        data?.balance_cancellation_code_id
      models.value.balance_cancellation_code = data?.balance_cancellation_code
      models.value.balance_cancellation_code_description =
        data?.balance_cancellation_code_description
    }
  }

  const clearForm = () => {
    models.value.movement_code = ''
    models.value.movement_description = ''
    models.value.validity = ''
    models.value.is_derived_contract = false
    models.value.cancellation_code_id = null
    models.value.cancellation_code = ''
    models.value.cancellation_code_description = ''
    models.value.balance_cancellation_code_id = null
    models.value.balance_cancellation_code = ''
    models.value.balance_cancellation_code_description = ''
  }

  const _setValueModel = () => {
    if (data_movement_codes_form.value) {
      models.value = { ...data_movement_codes_form.value }
    }
  }

  const selectCancellationCode = (
    model: IMovementCodesBasicDataResponse,
    event: number
  ) => {
    model.cancellation_code = event.toString()

    const movementCodeSelected = code_movements.value.find(
      (item) => item.value === event
    )
    if (movementCodeSelected) {
      model.cancellation_code_id = movementCodeSelected.id
      model.cancellation_code_description =
        movementCodeSelected.movement_description
    }
  }

  const selectBallanceCancellationCode = (
    model: IMovementCodesBasicDataResponse,
    event: number
  ) => {
    model.balance_cancellation_code = event.toString()

    const movementCodeSelected = code_movements.value.find(
      (item) => item.value === event
    )
    if (movementCodeSelected) {
      model.balance_cancellation_code_id = movementCodeSelected.id
      model.balance_cancellation_code_description =
        movementCodeSelected.movement_description
    }
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onUnmounted(async () => {
    _setDataMovementCodesForm(null)
  })

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
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataMovementCodesForm(null)
      } else {
        _setDataMovementCodesForm({
          movement_code: models.value.movement_code,
          movement_description: models.value.movement_description,
          validity: models.value.validity,
          is_derived_contract: models.value.is_derived_contract,
          cancellation_code_id: models.value.cancellation_code_id,
          cancellation_code: models.value.cancellation_code,
          cancellation_code_description:
            models.value.cancellation_code_description,
          balance_cancellation_code_id:
            models.value.balance_cancellation_code_id,
          balance_cancellation_code: models.value.balance_cancellation_code,
          balance_cancellation_code_description:
            models.value.balance_cancellation_code_description,
        })
      }
    },
    { deep: true }
  )

  return {
    models,
    movementCodesBasicData,
    code_movements,
    code_movement_validities,
    is_required,
    no_special_characters_extended,
    max_length,
    selectCancellationCode,
    selectBallanceCancellationCode,
  }
}

export default useBasicDataMovementCodesForm
