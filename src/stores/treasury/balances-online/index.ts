import { useBalancesOnlineStoreV1 } from '@/stores/treasury/balances-online/balances-online-v1'

export const useBalancesOnlineStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBalancesOnlineStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
