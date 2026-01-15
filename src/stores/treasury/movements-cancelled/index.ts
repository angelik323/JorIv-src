import { useMovementsCancelledStoreV1 } from './movements-cancelled-v1'

export const useMovementsCancelledStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useMovementsCancelledStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
