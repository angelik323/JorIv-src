import { useActiveConfigNoveltyStoreV1 } from './active-configuration-novelty-v1'

export const useActiveConfigNoveltyStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useActiveConfigNoveltyStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
