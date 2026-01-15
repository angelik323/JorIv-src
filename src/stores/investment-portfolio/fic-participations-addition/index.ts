import {useFicParticipationsAdditionStoreV1} from './fic-participations-addition-v1'

export const useFicParticipationsAdditionStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useFicParticipationsAdditionStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}