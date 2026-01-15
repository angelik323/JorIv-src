import { useConsecutiveMovementsV1 } from './consecutive-movements-v1'

export const useConsecutiveMovementsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useConsecutiveMovementsV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
