import { useForeignExchangeSalesStoreV1 } from './foreign-exchange-sales-operations-v1'

export const useForeignExchangeSalesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useForeignExchangeSalesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
