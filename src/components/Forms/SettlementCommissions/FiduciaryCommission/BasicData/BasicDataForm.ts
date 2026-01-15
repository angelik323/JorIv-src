import { IFiduciaryCommissionForm } from '@/interfaces/customs'
import { WriteActionType } from '@/interfaces/global'
import { ref, watch } from 'vue'
import { useRules } from '@/composables'
import { isEmptyOrZero } from '@/utils'

const useBasicDataForm = (
  props: {
    action: WriteActionType
    data: IFiduciaryCommissionForm | null
  },
  emit: Function
) => {
  const { is_required, max_length } = useRules()

  const formElementRef = ref()

  const initialModelsValues: IFiduciaryCommissionForm = {
    base_amount: null,
    iva_amount: null,
    iva_percentage: null,
    total_amount: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  // Sincroniza el modelo con la prop 'data'
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      // Evita bucle infinito
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => models.value.base_amount,
    (val) => {
      models.value.iva_amount =
        (Number(val) * Number(models.value.iva_percentage)) / 100
      models.value.total_amount = Number(val) + Number(models.value.iva_amount)
    }
  )

  return {
    formElementRef,
    models,
    is_required,
    max_length,
  }
}

export default useBasicDataForm
