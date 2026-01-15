import { useTreasuryMovementsCancelledStoreV1 } from './treasury-movements-cancelled-v1'

export const useTreasurMovementsCancelledStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTreasuryMovementsCancelledStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
