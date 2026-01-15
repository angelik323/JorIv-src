import { useTaxResourcesV1 } from './tax-resources-v1'

export const useTaxResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTaxResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
