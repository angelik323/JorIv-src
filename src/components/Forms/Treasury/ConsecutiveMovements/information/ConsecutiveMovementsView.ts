// Vue
import { Ref, ref, watch } from 'vue'

// Interfaces
import { IConsecutiveDetailResponse } from '@/interfaces/customs/treasury/ConsecutiveVoucher'

const useConsecutiveMovementsShowForm = (
  data: Ref<IConsecutiveDetailResponse | null>
) => {
  const initialModelsValues = {
    status: '',
    business_id: '',
    business_name: '',
    voucher_type: '',
    voucher_number: '',
    amount: '',
    currency: '',
    movement_date: '',
    created_at: '',
    created_by: '',
  }

  const models = ref({ ...initialModelsValues })

  const setFormData = (payload?: IConsecutiveDetailResponse) => {
    if (!payload) {
      models.value = { ...initialModelsValues }
      return
    }

    models.value = {
      status: payload.data.general_information?.status?.name ?? '',
      business_id: payload.data.business?.id.toString() ?? '',
      business_name: payload.data.business?.name ?? '',
      voucher_type:
        payload.data.general_information?.voucher_type?.full_info ?? '',
      voucher_number: payload.data.general_information?.voucher_number ?? '',
      amount: payload.data.general_information?.amount?.formatted ?? '',
      currency: payload.data.general_information?.currency?.name ?? '',
      movement_date: payload.data.general_information?.movement_date ?? '',
      created_at: payload.data.general_information?.created_at ?? '',
      created_by: payload.data.general_information?.created_by.name ?? '',
    }
  }

  watch(data, (val) => setFormData(val ?? undefined), { immediate: true })

  return {
    models,
    setFormData,
  }
}

export default useConsecutiveMovementsShowForm
