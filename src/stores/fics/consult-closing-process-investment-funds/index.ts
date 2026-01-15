import { useConsultClosingProcessInvestmentFundsStoreV1 } from './consult-closing-process-investment-funds-v1'
export const useConsultClosingProcessInvestmentFundsStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useConsultClosingProcessInvestmentFundsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
