import { useInvestmentPlanOperationStoreV1 } from './investment-plan-operations-v1'

export const useInvestmentPlanOperationStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useInvestmentPlanOperationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
