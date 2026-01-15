import { useDerivativeInvestmentOperationStore } from '@/stores'
import { storeToRefs } from 'pinia'

export const useDerivativeInvestmentOperationDetail = () => {
  const { data_information_view } = storeToRefs(
    useDerivativeInvestmentOperationStore('v1')
  )

  return {
    data_information_view,
  }
}
