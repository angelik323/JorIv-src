import { useInvestmentPlanParticipationModificationStore as useInvestmentPlanParticipationModificationStoreV1 } from './investment-plan-participation-modification-v1'

export const useInvestmentPlanParticipationModificationStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useInvestmentPlanParticipationModificationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
