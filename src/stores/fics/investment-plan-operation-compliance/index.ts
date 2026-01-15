import { useInvestmentPlanOperationComplianceStoreV1 } from './investment-plan-operation-compliance-v1'

export const useInvestmentPlanOperationComplianceStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useInvestmentPlanOperationComplianceStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
