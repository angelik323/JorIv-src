import { useBudgetAccountingHomologationStoreV1 } from '@/stores/budget/budget-accounting-homologation/budget-accounting-homologation-v1'

export const useBudgetAccountingHomologationStore = (version: 'v1' = 'v1') => {
  switch (version) {
    case 'v1':
      return useBudgetAccountingHomologationStoreV1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
