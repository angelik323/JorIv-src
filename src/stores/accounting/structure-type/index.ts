import { useStructureTypesStoreV1 } from './structure-type-v1'

export const useStructureTypesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useStructureTypesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
