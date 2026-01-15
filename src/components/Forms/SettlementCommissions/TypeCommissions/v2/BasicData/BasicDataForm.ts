// vue - router - quasar
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfeaces
import { ITypeCommissionsInformationFormV2 } from '@/interfaces/customs/settlement-commissions/TypeCommissionsV2'
import { WriteActionType } from '@/interfaces/global'

// Composables
import { useRules, useUtils } from '@/composables'

// Stores
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'

const useBasicDataForm = (
  props: {
    action: WriteActionType
    data: ITypeCommissionsInformationFormV2 | null
  },
  emit: Function
) => {
  const { is_required, max_length, no_leading_zeros, only_alphanumeric } =
    useRules()

  const { commissions_class_catalog, commissions_type_catalog } = storeToRefs(
    useSettlementCommissionsResourceStore('v1')
  )

  const { isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: ITypeCommissionsInformationFormV2 = {
    code: null,
    description: null,
    commission_type_catalog_id: null,
    commission_class_catalog_id: null,
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
    is_required,
    max_length,
    no_leading_zeros,
    only_alphanumeric,

    commissions_class_catalog,
    commissions_type_catalog,
  }
}

export default useBasicDataForm
