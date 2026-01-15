import { useCancelBankLoadsStoreV1 } from './cancel-load-banks-v1'

export const useCancelBankLoadsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useCancelBankLoadsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
