import { useBudgetAccountingHomologationParametersStoreV1 } from '@/stores/budget/budget-accounting-homologation-parameters/budget-accounting-homologation-parameters-v1'

export const useBudgetAccountingHomologationParametersStore = (
  version: 'v1' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useBudgetAccountingHomologationParametersStoreV1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
