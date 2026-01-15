import { useBillingPortfolioClosureStoreV1 } from './billing-portfolio-closure-v1'

export const useBillingPortfolioClosureStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBillingPortfolioClosureStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
