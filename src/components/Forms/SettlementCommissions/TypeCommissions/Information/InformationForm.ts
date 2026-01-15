// vue - router - quasar
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Utils
import { isEmptyOrZero } from '@/utils'

// Interfeaces
import { ITypeCommissionsInformationForm } from '@/interfaces/customs'
import { WriteActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Stores
import { useSettlementCommissionsResourceStore } from '@/stores'

const useInformationForm = (
  props: {
    action: WriteActionType
    data: ITypeCommissionsInformationForm | null
  },
  emit: Function
) => {
  const { is_required, max_length, no_leading_zeros, only_alphanumeric } =
    useRules()

  const { commissions_class_catalog, commissions_type_catalog } = storeToRefs(
    useSettlementCommissionsResourceStore('v1')
  )

  const formElementRef = ref()

  const initialModelsValues: ITypeCommissionsInformationForm = {
    description: null,
    commission_type_catalog_id: null,
    commission_class_catalog_id: null,
    value: null,
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
    [
      () => models.value.commission_type_catalog_id,
      () => models.value.commission_class_catalog_id,
    ],
    ([typeId, classId]) => {
      if (typeId !== 1 || classId !== 1) {
        models.value.value = null
      }
    }
  )

  return {
    formElementRef,
    models,
    is_required,
    max_length,
    no_leading_zeros,
    only_alphanumeric,

    commissions_class_catalog,
    commissions_type_catalog,
  }
}

export default useInformationForm
