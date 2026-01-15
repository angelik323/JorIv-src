import { useFixedAssetsResourcesV1 } from './fixed-assets-resources-v1'

export const useFixedAssetsResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useFixedAssetsResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
