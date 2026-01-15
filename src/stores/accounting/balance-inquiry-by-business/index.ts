import { useBalanceInquiryByBusiness } from './balance-inquiry-by-business-v1'
export const useBalanceInquiryByBusinessStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBalanceInquiryByBusiness()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
