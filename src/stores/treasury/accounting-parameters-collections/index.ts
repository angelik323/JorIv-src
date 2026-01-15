import { useAccountingParametersCollectionsStoreV1 } from './accounting-parameters-collections-v1'

export const useAccountingParametersCollectionsStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useAccountingParametersCollectionsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
