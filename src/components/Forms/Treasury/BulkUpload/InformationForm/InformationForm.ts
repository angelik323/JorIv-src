import { IBulkUploadHistory } from '@/interfaces/customs'
import { ref, watch } from 'vue'

const useInformationForm = (props: { data: IBulkUploadHistory }) => {
  const formData = ref<IBulkUploadHistory>({
    id: 0,
    code: '',
    name: null,
    bank: {
      id: 0,
      code: '',
      name: null,
    },
    bank_account: {
      id: 0,
      account_number: '',
      account_name: '',
    },
    account_name: '',
    account_number: '',
    business: {
      id: 0,
      code: null,
      name: '',
    },
    business_name: null,
    status: {
      id: 0,
      status: '',
    },
    created_at: '',
  })

  watch(
    () => props.data,
    () => {
      formData.value = props.data
    }
  )

  return { formData }
}

export default useInformationForm
