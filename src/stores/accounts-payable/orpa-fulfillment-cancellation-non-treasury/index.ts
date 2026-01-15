import { useOrpaFulfillmentCancelationNonTreasuryStoreV1 } from './orpa-fulfillment-cancellation-non-treasury-v1'

export const useOrpaFulfillmentCancelationNonTreasuryStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useOrpaFulfillmentCancelationNonTreasuryStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
