import { useAssetResourcesV1 } from './assets-resources-v1'

export const useAssetResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAssetResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
