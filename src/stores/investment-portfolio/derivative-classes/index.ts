import { useDerivativeClassesStoreV1 } from './derivative-classes-v1'

export const useDerivativeClassesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useDerivativeClassesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
