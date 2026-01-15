import { useAccountingResourcesV1 } from './accounting-resources-v1'

export const useAccountingResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAccountingResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
