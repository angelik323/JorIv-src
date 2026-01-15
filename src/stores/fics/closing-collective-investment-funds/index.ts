import { useClosingCollectiveInvestmentFundsStoreV1 } from './closing-collective-investment-funds-store-v1'

export const useClosingCollectiveInvestmentFundsStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useClosingCollectiveInvestmentFundsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
