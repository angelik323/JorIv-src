import { useIndexingIpcStoreV1 } from './indexing-ipc-v1'

export const useIndexingIpcStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useIndexingIpcStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
