import { useBudgetTransferQueryStoreV1 } from './budget-transfer-query'

export const useBudgetTransferStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetTransferQueryStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
