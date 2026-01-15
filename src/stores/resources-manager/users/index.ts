import { useUserResourcesV1 } from './user-resources-v1'

export const useUserResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useUserResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
