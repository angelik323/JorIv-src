import { useCheckTreasuryReceiptStoreV1 } from './check-treasury-receipt-v1'

export const useCheckTreasuryReceiptStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useCheckTreasuryReceiptStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
