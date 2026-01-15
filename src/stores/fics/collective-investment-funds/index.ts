import { useCollectiveInvestmentFundsStoreV1 } from './collective-investment-funds-v1'

export const useCollectiveInvestmentFundsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useCollectiveInvestmentFundsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
