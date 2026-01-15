import { useCheckbooksStoreV1 } from './checkbooks-v1'

export const useCheckbooksStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useCheckbooksStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
