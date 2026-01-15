import { ITrustBusinessDocumentStructureForm } from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useTrustBusinessResourceStore,
  useTrustBusinessDocumentStructureStore,
} from '@/stores'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const useTrustBusinessDocumentStructureForm = () => {
  const {
    data_trust_business_document_structure_form,
    data_business_trust_on_create,
  } = storeToRefs(useTrustBusinessDocumentStructureStore('v1'))
  const {
    _setDataTrustBusinessDocumentStructureForm,
    _validateCharacteristicCode,
  } = useTrustBusinessDocumentStructureStore('v1')

  const { document_structure_type } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const models = ref<ITrustBusinessDocumentStructureForm>({
    description: '',
    characteristic_code: '',
    type: '',
    is_obligatory: null,
    alert: null,
  })

  const formTrustBusinessDocumentStructure = ref()

  const keys = { trust_business: ['document_structure_type'] }

  onMounted(async () => {
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  const validateCharacteristicCode = async (val: string) => {
    if (!val) return true

    const available: boolean = await _validateCharacteristicCode(
      val,
      data_business_trust_on_create.value?.id
    )

    return available
  }

  const resetForm = () => {
    models.value = {
      description: '',
      characteristic_code: '',
      type: '',
      is_obligatory: null,
      alert: null,
    }
    formTrustBusinessDocumentStructure.value?.resetValidation()
  }

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataTrustBusinessDocumentStructureForm(
          {} as ITrustBusinessDocumentStructureForm
        )
      } else {
        _setDataTrustBusinessDocumentStructureForm(models.value)
      }
    },
    { deep: true }
  )

  watch(
    () => data_trust_business_document_structure_form.value,
    (newValue, oldValue) => {
      if (newValue && newValue !== oldValue) {
        models.value = { ...newValue }
      }
    },
    { once: true }
  )

  return {
    models,
    document_structure_type,
    data_business_trust_on_create,
    formTrustBusinessDocumentStructure,
    validateCharacteristicCode,
    resetForm,
  }
}

export default useTrustBusinessDocumentStructureForm
