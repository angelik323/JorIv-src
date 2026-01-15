import { useFiduciaryTrustStoreV1 } from '@/stores/trust-business/fiduciary-trust/fiduciary-trust-v1'

export const useFiduciaryTrustStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useFiduciaryTrustStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
