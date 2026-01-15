import { useTypeAccountingReceiptStoreV1 } from './type-accounting-receipt-v1'
import { useTypeAccountingReceiptStoreV2 } from './type-accounting-receipt-v2'

export const useTypeAccountingReceiptStore = (version: 'v1' | 'v2' | 'v3') => {
  switch (version) {
    case 'v1':
      return useTypeAccountingReceiptStoreV1()
    case 'v2':
      return useTypeAccountingReceiptStoreV2()
    case 'v3':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
