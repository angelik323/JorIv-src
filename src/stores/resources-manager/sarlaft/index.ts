import { useSarlaftResourcesV1 } from './sarlaft-resources-v1'

export const useSarlaftResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useSarlaftResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
