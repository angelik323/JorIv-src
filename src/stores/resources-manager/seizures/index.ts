import { useSeizuresResourcesV1 } from './seizures-resources-v1'

export const useSeizuresResourcesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useSeizuresResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
