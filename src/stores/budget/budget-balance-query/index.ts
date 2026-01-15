import { useBudgetBalanceQueryStoreV1 } from './budget-balance-query-v1'

export const useBudgetBalanceQueryStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetBalanceQueryStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
