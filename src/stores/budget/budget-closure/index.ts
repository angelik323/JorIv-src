import { useBudgetClosureStoreV1 } from "./budget-closure-v1"

export const useBudgetClosureStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetClosureStoreV1()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
