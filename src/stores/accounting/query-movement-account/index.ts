import { useQueryMovementAccountStoreV1 } from './type-query-movement-account-v1'

export const useQueryMovementAccountStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useQueryMovementAccountStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
