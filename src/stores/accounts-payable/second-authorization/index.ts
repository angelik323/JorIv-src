import { useSecondAuthorizationStoreV1 } from './second-authorization-v1'

export const useSecondAuthorizationStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useSecondAuthorizationStoreV1()
    case 'v2':
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
