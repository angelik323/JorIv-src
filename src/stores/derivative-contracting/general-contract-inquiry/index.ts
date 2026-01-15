import { useGeneralContractInquiryStoreV1 } from './general-contract-inquiry-v1'

export const useGeneralContractInquiryStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useGeneralContractInquiryStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no soportada: ${version}`)
  }
}
