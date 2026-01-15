import { storeToRefs } from 'pinia'
import { useBankResponseStore } from '@/stores'

const useBankResponseDescriptionForm = () => {
  const { bank_response_description_form } = storeToRefs(
    useBankResponseStore('v1')
  )

  return {
    bank_response_description_form,
  }
}

export default useBankResponseDescriptionForm
