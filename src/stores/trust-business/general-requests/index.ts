import { useGeneralRequestsStoreV1 } from '@/stores/trust-business/general-requests/general-request-v1'

export const useGeneralRequestsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useGeneralRequestsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
