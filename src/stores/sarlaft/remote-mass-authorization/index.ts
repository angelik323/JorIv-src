import useRemoteMassAuthorizationStoreV1 from './remote-mass-authorization-v1'

export const useRemoteMassAuthorizationStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useRemoteMassAuthorizationStoreV1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
