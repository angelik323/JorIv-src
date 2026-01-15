import { useBudgetResourceStore } from '@/stores/budget/budget-resources/budget-resource-v1'
export const useBudgetResourceModuleStore = (version: 'v1' = 'v1') => {
  switch (version) {
    case 'v1':
      return useBudgetResourceStore()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
