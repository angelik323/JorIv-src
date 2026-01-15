import { useBudgetResourceTypeStore } from '@/stores/budget/resource-type/resource-type-v1'
export const useBudgetResourceTypeModuleStore = (version: 'v1' = 'v1') => {
  switch (version) {
    case 'v1':
      return useBudgetResourceTypeStore()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
