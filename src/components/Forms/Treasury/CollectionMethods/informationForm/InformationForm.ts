import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

// Composables
import { useRules, useUtils } from '@/composables'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { CollectionMethodsForm } from '@/interfaces/customs/treasury/CollectionForms'

// Stores
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'

const useInformationForm = (
  props: {
    action: WriteActionType
    data: CollectionMethodsForm | null
  },
  emit: Function
) => {
  const {
    commission_rate,
    type_receive_with_name,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { is_required, only_number_with_max_integers_and_decimals } = useRules()
  const { isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: CollectionMethodsForm = {
    type_receive_id: 0,
    description: '',
    accounting_blocks_collection_id: 0,
    bank_entity_id: 0,
    commission_rate: '',
    commission_percentage: 0,
    fixed_value: '',
    observations: '',
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const selectOptions = computed(() => ({
    commission_rate: commission_rate.value,
    typeReceive: type_receive_with_name.value
  }))

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  watch(
    () => models.value.type_receive_id,
    (newVal) => {
      const paymentSelected = selectOptions.value.typeReceive.find(idx => idx.id == newVal)
      models.value.description = paymentSelected?.description ?? ''
    }
  )

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
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    selectOptions,
    only_number_with_max_integers_and_decimals,
    is_required,
  }
}

export default useInformationForm