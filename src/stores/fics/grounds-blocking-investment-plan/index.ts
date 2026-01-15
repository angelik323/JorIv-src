import { useGroundsBlockingInvestmentPlanListV1 } from "./grounds-blocking-investment-plan-v1"


export const useGroundsBlockingInvestmentPlanStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useGroundsBlockingInvestmentPlanListV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
