import { usePaperTypesStoreV1 } from './type-paper-v1'

export const usePaperTypesStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return usePaperTypesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
