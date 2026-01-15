import { useBalancePointStoreV1 } from './balance-point-v1'

export const useBalancePointStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBalancePointStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
