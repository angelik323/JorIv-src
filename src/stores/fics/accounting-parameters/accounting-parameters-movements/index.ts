import { useAccountingParametersAccountingParametersMovementsStoreV1 } from './accounting-parameters-movements-v1'

export const useAccountingParametersAccountingParametersMovementsStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useAccountingParametersAccountingParametersMovementsStoreV1()
    default:
      throw new Error(`Versión de store no soportada: ${version}`)
  }
}
