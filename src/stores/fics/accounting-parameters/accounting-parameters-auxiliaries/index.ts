import { useAccountingParametersAccountingParametersAuxiliariesStoreV1 } from './accounting-parameters-auxiliaries-v1'

export const useAccountingParametersAccountingParametersAuxiliariesStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useAccountingParametersAccountingParametersAuxiliariesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
