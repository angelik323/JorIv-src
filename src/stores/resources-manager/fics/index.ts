import { useFicResourcesV1 } from './fic-resources-v1'

export const useFicResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useFicResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
