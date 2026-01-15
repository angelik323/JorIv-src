import { useAccountingParametersMovementCodesStoreV1 } from './accounting-parameters-movement-codes-v1'

export const useAccountingParametersMovementCodesStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useAccountingParametersMovementCodesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
