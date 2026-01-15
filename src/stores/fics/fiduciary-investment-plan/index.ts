import { useFiduciaryInvestmentPlanStoreV1 } from './fiduciary-investment-plan-v1'

export const useFiduciaryInvestmentPlanStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useFiduciaryInvestmentPlanStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
