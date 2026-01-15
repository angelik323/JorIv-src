import { useInvestmentPortfolioStoreV1 } from './investment-portfolio-v1'

export const useInvestmentPortfoliosStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useInvestmentPortfolioStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
