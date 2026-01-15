import { useBudgetTransferStoreV1 } from './budget-transfer-parameters'

export const useBudgetTransferStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetTransferStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
