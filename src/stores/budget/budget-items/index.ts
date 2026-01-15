import { useBudgetItemsStoreV1 } from './budget-items-v1'

export const useBudgetItemsModuleStore = (version: 'v1' = 'v1') => {
  switch (version) {
    case 'v1':
      return useBudgetItemsStoreV1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
