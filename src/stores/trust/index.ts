import { useTrustV1 } from './trust-v1'

export const useTrustStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTrustV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
