import { useBankNetworkLoadStoreV1 } from './bank-network-load-v1'

export const useBankNetworkLoadStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBankNetworkLoadStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
