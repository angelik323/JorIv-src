// Vue - router - quasar
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Store
import { useSarlaftResourceStore } from '@/stores/resources-manager/sarlaft'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useAddThirdForm = () => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { list_type_identification } = storeToRefs(
    useSarlaftResourceStore('v1')
  )

  const formValues = ref({
    identificationType: null as string | null,
    identificationNumber: '' as string,
    name: '' as string,
  })

  const identificationTypes = ref<typeof list_type_identification.value>([])

  const formElementRef = ref()

  const isValid = computed(() => {
    return (
      !!formValues.value.identificationType &&
      !!formValues.value.identificationNumber &&
      !!formValues.value.name
    )
  })

  const resetForm = () => {
    formValues.value = {
      identificationType: null,
      identificationNumber: '',
      name: '',
    }
    formElementRef.value?.resetValidation()
  }

  const validateForm = async () => {
    return await formElementRef.value?.validate()
  }

  const fetchIdentificationTypes = async () => {
    await _getResources({ sarlaft: ['list_type_identification'] })
    await _getResources({ sarlaft: ['list_type_identification'] })
    identificationTypes.value = list_type_identification.value
  }

  onMounted(() => {
    fetchIdentificationTypes()
  })

  onBeforeUnmount(() => _resetKeys({ sarlaft: ['list_type_identification'] }))

  return {
    formValues,
    identificationTypes,
    formElementRef,
    isValid,
    resetForm,
    validateForm,
  }
}
