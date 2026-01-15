import {useTreasuryReadjustmentStoreV1} from './treasury-readjustment-v1'

export const useTreasuryReadjustmentStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTreasuryReadjustmentStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}