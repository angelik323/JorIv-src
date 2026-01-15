import { useInvestmentPortfolioResourcesV1 } from './investment-portfolio-resources-v1'

export const useInvestmentPortfolioResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useInvestmentPortfolioResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
