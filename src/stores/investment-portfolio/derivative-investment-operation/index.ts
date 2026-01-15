import { useDerivativeInvestmentOperationStoreV1 } from './derivative-investment-operation-v1'

export const useDerivativeInvestmentOperationStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useDerivativeInvestmentOperationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
