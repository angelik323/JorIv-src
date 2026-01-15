import { useAuthorizationTreasuryStoreV1 } from './authorization-treasury-v1'

export const useAuthorizationTreasuryStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAuthorizationTreasuryStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
