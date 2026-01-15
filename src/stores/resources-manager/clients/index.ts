import { useClientsResourcesV1 } from "./clients-resources-v1"

export const useClientsResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useClientsResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
