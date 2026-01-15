import { useBankResponseStoreV1 } from './bank-response-v1'

export const useBankResponseStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBankResponseStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
