import { useAccountingParametersAssociatedBusinessesStoreV1 } from './associated-businesses-v1'

export const useAccountingParametersAssociatedBusinessesStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useAccountingParametersAssociatedBusinessesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
