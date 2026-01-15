import { useExpenseReceiptStoreV1 } from './expense-receipt-v1'

export const useExpenseReceiptStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useExpenseReceiptStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
