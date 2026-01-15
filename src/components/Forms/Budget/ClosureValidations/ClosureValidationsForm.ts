// Core - Pinia - API
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QForm } from 'quasar'
// Interfaces & types
import type { IClosureValidationForm } from '@/interfaces/customs/budget/ClosureValidations'
import type { ActionType } from '@/interfaces/global'
// Composables
import { useUtils } from '@/composables'
// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager'
import { IBudgetLevelResource, IMovementCodeResource } from '@/interfaces/customs/resources/Budget'

export const useClosureValidationsForm = (props: {
  action: ActionType
  data: IClosureValidationForm | null
}) => {
  const { isEmptyOrZero } = useUtils()
  
  // Referencia al formulario de Quasar
  const formValidateElementRef = ref<QForm | null>(null)

  // Obtener selectores desde resourceManager
  const { budget_levels, code_movements } = storeToRefs(useBudgetResourceStore('v1'))

  // Modelo de solo lectura (view)
  const viewModel = ref<IClosureValidationForm>({
    id: undefined,
    level_id: null,
    level_code: '',
    level_description: '',
    cancellation_code_id: null,
    cancellation_movement_code: '',
    cancellation_movement_description: '',
    constitution_code_id: null,
    constitution_movement_code: '',
    constitution_movement_description: '',
  })

  const initialModel: IClosureValidationForm = {
    id: undefined,
    level_id: null,
    level_code: '',
    level_description: '',
    cancellation_code_id: null,
    cancellation_movement_code: '',
    cancellation_movement_description: '',
    constitution_code_id: null,
    constitution_movement_code: '',
    constitution_movement_description: '',
  }

  const models = ref<IClosureValidationForm>({ ...initialModel })

  // Watchers para auto-completar descripciones

  // Watcher para nivel
  watch(
    () => models.value.level_id,
    (newLevelId) => {
      if (newLevelId) {
        const selectedLevel = budget_levels.value.find(
          (level: IBudgetLevelResource) => level.id === newLevelId
        )
        if (selectedLevel) {
          models.value.level_code = selectedLevel.level || ''
          models.value.level_description = selectedLevel.description || ''
        }
      } else {
        models.value.level_code = ''
        models.value.level_description = ''
      }
    }
  )

  // Watcher para código de movimiento cancelación
  watch(
    () => models.value.cancellation_code_id,
    (newCodeId) => {
      if (newCodeId) {
        const selectedCode = code_movements.value.find(
          (code: IMovementCodeResource) => code.id === newCodeId
        )
        if (selectedCode) {
          models.value.cancellation_movement_code = selectedCode.movement_code || ''
          models.value.cancellation_movement_description =
            selectedCode.movement_description || ''
        }
      } else {
        models.value.cancellation_movement_code = ''
        models.value.cancellation_movement_description = ''
      }
    }
  )

  // Watcher para código de movimiento constitución
  watch(
    () => models.value.constitution_code_id,
    (newCodeId) => {
      if (newCodeId) {
        const selectedCode = code_movements.value.find(
          (code: IMovementCodeResource) => code.id === newCodeId
        )
        if (selectedCode) {
          models.value.constitution_movement_code = selectedCode.movement_code || ''
          models.value.constitution_movement_description =
            selectedCode.movement_description || ''
        }
      } else {
        models.value.constitution_movement_code = ''
        models.value.constitution_movement_description = ''
      }
    }
  )

  const validateForm = async (): Promise<boolean> => {
    // Validar con el método validate() de Quasar
    if (formValidateElementRef.value) {
      return await formValidateElementRef.value.validate()
    }
    // Fallback: validación manual si no hay referencia al formulario
    return !isEmptyOrZero({
      level_id: models.value.level_id,
      cancellation_code_id: models.value.cancellation_code_id,
      constitution_code_id: models.value.constitution_code_id,
    })
  }

  const getFormData = () => {
    return models.value
  }

  const setFormData = (data: IClosureValidationForm) => {
    models.value = { ...models.value, ...data }
  }

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) {
        setFormData(newVal)
      }
    },
    { immediate: true }
  )

  return {
    formValidateElementRef,
    models,
    viewModel,
    budget_levels,
    code_movements,
    validateForm,
    getFormData,
    setFormData,
  }
}

