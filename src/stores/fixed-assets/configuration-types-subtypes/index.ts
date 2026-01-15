import { useConfigurationTypesSubtypesStoreV1 } from './configuration-types-subtypes-v1'


export const useConfigurationTypesSubtypesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useConfigurationTypesSubtypesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}