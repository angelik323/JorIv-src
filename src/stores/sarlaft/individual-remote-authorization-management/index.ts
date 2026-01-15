import { useIndividualRemoteAuthorizationManagementStoreV1 } from './individual-remote-authorization-management-v1'

export const useIndividualRemoteAuthorizationManagementStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useIndividualRemoteAuthorizationManagementStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
