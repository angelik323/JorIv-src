import { useSystemOperationChannelsStoreV1 } from './system-operation-channels-v1'

export const useSystemOperationChannelsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useSystemOperationChannelsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
