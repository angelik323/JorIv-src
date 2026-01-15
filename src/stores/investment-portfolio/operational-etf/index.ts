import { useOperationalETFStoreV1 } from './operational-etf-v1'

export const useOperationalETFStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useOperationalETFStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
