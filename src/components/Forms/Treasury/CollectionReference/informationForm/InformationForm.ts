import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

// Composables
import { useRules, useUtils } from '@/composables'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { ICollectionReferenceForm } from '@/interfaces/customs/treasury/CollectionReference'

// Stores
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'

const useInformationForm = (
  props: {
    action: WriteActionType
    data: ICollectionReferenceForm | null
  },
  emit: Function
) => {
  const {
    origin,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { is_required } = useRules()
  const { isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: ICollectionReferenceForm = {
    accounting_blocks_collection_id: 0,
    accounting_parameters_collection_id: 0,
    origin_id: 0,
    bank_reference: '',
    bar_code: '',
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const selectOptions = computed(() => ({
    origin: origin.value,
  }))

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

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
    is_required,
  }
}

export default useInformationForm