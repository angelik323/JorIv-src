import { useBudgetMovementCodesStoreV1 } from './movement-codes-v1'

export const useBudgetMovementCodesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetMovementCodesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
