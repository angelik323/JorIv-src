// Vue
import { ref, watch } from 'vue'

// Interfaces
import { IAnnualPaymentAmountsForm } from '@/interfaces/customs'

// Composables
import { useUtils } from '@/composables'

const useBasicDataForm = (
  props: {
    data?: IAnnualPaymentAmountsForm | null
  },
  emit: Function
) => {
  const basicDataFormRef = ref()
  const currentYear = new Date().getFullYear()

  const { isEmptyOrZero } = useUtils()

  const models = ref<IAnnualPaymentAmountsForm>({
    year: currentYear,
    minimum_salary: null,
    transport_subsidy: null,
    uvt: null,
    obligated_iva_uvt_pn: null,
  })

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    {
      deep: true,
    }
  )

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  return {
    basicDataFormRef,
    models,
  }
}

export default useBasicDataForm
