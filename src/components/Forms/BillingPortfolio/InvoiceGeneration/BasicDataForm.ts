import { IInvoiceGenerationForm } from '@/interfaces/customs'
import { ref, watch } from 'vue'
import { isEmptyOrZero } from '@/utils'
import { ActionType } from '@/interfaces/global'
import { useTrustBusinessResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: IInvoiceGenerationForm | null
  },
  emit: Function
) => {
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const formElementRef = ref()

  const initialModelsValues: IInvoiceGenerationForm = {
    transmitter: null,
    method: null,
    payday: 15,
    rows: [],
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

  return {
    formElementRef,
    models,
    business_trusts,
  }
}

export default useBasicDataForm
