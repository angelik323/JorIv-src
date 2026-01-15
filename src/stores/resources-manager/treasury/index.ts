import { useTreasuryResourcesV1 } from './treasury-resources-v1'

export const useTreasuryResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTreasuryResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
