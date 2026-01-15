import { useConsolidatedBalanceInquiryV1 } from './consolidated-balance-inquiry-v1'

export const useConsolidatedBalanceInquiryStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useConsolidatedBalanceInquiryV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
