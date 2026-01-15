import { useSarlaftParameterizationStoreV1 } from './sarlaft-parameterization-v1'

export const useSarlaftParameterizationStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useSarlaftParameterizationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
