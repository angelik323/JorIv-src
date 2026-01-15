import { useTreasuryCancellationsStoreV1 } from './treasury-cancellations-v1'

export const useTreasuryCancellationsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTreasuryCancellationsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
