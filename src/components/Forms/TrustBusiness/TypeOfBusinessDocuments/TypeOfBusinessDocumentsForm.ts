import { ITypeOfBusinessDocumentForm } from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useTrustBusinessResourceStore,
  useTypeOfBusinessDocumentsStore,
} from '@/stores'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const useTypeOfBusinessDocumentsForm = () => {
  const {
    data_type_of_business_documents_form,
    data_business_trust_on_create,
  } = storeToRefs(useTypeOfBusinessDocumentsStore('v1'))
  const { _setDataTypeOfBusinessDocumentsForm, _validateDocumentCode } =
    useTypeOfBusinessDocumentsStore('v1')

  const { business_trust_register_types } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const models = ref<ITypeOfBusinessDocumentForm>({
    document_description: '',
    document_code: '',
    apply_for: '',
    current_business_requirements: null,
  })

  const formTypeOfBusinessDocuments = ref()

  const keys = { trust_business: ['business_trust_register_types'] }

  onMounted(async () => {
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  const validateDocumentCode = async (val: string) => {
    if (!val) return true
    
    const available: boolean = await _validateDocumentCode(
      val,
      data_business_trust_on_create.value?.id
    )

    return available
  }

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataTypeOfBusinessDocumentsForm({} as ITypeOfBusinessDocumentForm)
      } else {
        _setDataTypeOfBusinessDocumentsForm(models.value)
      }
    },
    { deep: true }
  )

  watch(
    () => data_type_of_business_documents_form.value,
    (newValue, oldValue) => {
      if (newValue && newValue !== oldValue) {
        models.value = { ...newValue }
      }
    },
    { once: true }
  )

  return {
    models,
    business_trust_register_types,
    data_business_trust_on_create,
    formTypeOfBusinessDocuments,
    validateDocumentCode,
  }
}

export default useTypeOfBusinessDocumentsForm
