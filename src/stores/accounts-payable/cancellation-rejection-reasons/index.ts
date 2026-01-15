import { useCancellationRejectionReasonsStoreV1 } from './cancellation-rejection-reasons-v1'

export const useCancellationRejectionReasonsStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useCancellationRejectionReasonsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
