import { useBusinessTrustMovementCodesStoreV1 } from './business-trust-movement-codes-v1'

export const useTrustBusinessMovementCodesStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useBusinessTrustMovementCodesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
