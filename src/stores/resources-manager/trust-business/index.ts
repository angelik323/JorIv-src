import { useTrustBusinessResourcesV1 } from './trust-business-resources-v1'

export const useTrustBusinessResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTrustBusinessResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
