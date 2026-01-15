import { ref, computed, watch } from 'vue'
import { QForm } from 'quasar'
import { IEditOperationForm } from '@/interfaces/customs'
import { MODIFICATION_OPTIONS } from '@/constants'
import moment from 'moment'
import { useRules } from '@/composables'

const useInformationForm = (props: { data: IEditOperationForm }) => {
  const formRef = ref<QForm>()
  const formData = ref<IEditOperationForm>({ ...props.data })

  const modificationOptions = ref(MODIFICATION_OPTIONS)

  const isValid = computed(() => {
    return (
      !!formData.value.days_number &&
      !!formData.value.modification_type &&
      formData.value.observation.trim().length > 0
    )
  })

  const validateForm = async (): Promise<boolean> => {
    const valid = await formRef.value?.validate()
    return Boolean(valid)
  }

  const getFormData = () => ({
    modification_type: formData.value.modification_type,
    observation: formData.value.observation,
    number_days: Number(formData.value.days_number ?? 0),
  })

  watch(
    () => props.data,
    (newData) => {
      if (newData) {
        formData.value = { ...newData }
      }
    },
    { deep: true }
  )

  watch(
    () => [formData.value.days_number, formData.value.start_date],
    ([daysRaw, start]) => {
      const days = Number(daysRaw)
      if (!days || days <= 0 || days > 365 || !start) {
        formData.value.end_date = ''
        return
      }
      let tentative = moment(start).add(days, 'days')
      while (
        useRules().date_is_not_weekend(tentative.format('YYYY-MM-DD')) !== true
      ) {
        tentative = tentative.add(1, 'days')
      }
      formData.value.end_date = tentative.format('YYYY-MM-DD')
    }
  )

  return {
    formRef,
    formData,
    modificationOptions,
    isValid,
    validateForm,
    getFormData,
  }
}

export default useInformationForm
