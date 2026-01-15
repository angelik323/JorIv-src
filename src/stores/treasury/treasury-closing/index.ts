import { useTreasuryClosingStoreV1 } from './treasury-closing-v1'

export const useTreasuryClosingStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useTreasuryClosingStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
