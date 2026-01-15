import { useBudgetComparisonStoreV1 } from '@/stores/budget/budget-comparison/budget-comparison-v1'

export const useBudgetComparisonModuleStore = (version: 'v1' = 'v1') => {
  switch (version) {
    case 'v1':
      return useBudgetComparisonStoreV1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
