import { useNormativeResourcesV1 } from './normative-resources-v1'

export const useNormativeResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useNormativeResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
