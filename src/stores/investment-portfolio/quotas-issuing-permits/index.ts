import { useQuotasIssuingPermitsStoreV1 } from './quotas-issuing-permits-v1'

export const useQuotasIssuingPermitsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useQuotasIssuingPermitsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
