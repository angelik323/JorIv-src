import { useGuaranteesStoreV1 } from './guarantees-v1'

export const useGuaranteesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useGuaranteesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
